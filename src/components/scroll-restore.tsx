"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { peekPendingNavTarget, updatePendingNavTargetTop } from "@/lib/pending-nav-target";
import { scrollToId } from "@/lib/smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

const KEY_PREFIX = "ftp:scrollY:";

/**
 * O Chrome restaura sozinho o scroll de onde você recarregou, e isso é o
 * comportamento que queremos manter (voltar de onde parou) — só assumimos
 * o controle manual pra decidir a posição nós mesmos via sessionStorage
 * (guardada no pagehide), em vez de depender da memória nativa do
 * navegador. Se a URL tiver âncora (#secao), ela sempre vence.
 *
 * O SALTO em si (scrollTo) acontece num <script> síncrono e bloqueante no
 * <head> (ver `beforeInteractive` em layout.tsx), ANTES da primeira
 * pintura da página — mesmo rodando "cedo" aqui, um useEffect do React só
 * executa DEPOIS que o navegador já pintou o HTML inicial (no topo), então
 * ainda apareceria um flash do header antes de pular pra posição certa.
 * Esse componente só cuida do que sobrou: salvar a posição no pagehide,
 * disparar o refresh do GSAP depois que a página assenta, e corrigir um
 * clique de nav que tenha pousado errado nesse meio-tempo.
 *
 * O que precisava esperar o layout assentar não era a posição do scroll em
 * si, e sim as ScrollTrigger do GSAP: elas calculam start/end no mount de
 * cada seção, cedo demais em relação à altura final da página — sem
 * recalcular depois, ficam com esses números desatualizados pra sempre e a
 * seção correspondente (ex.: título/tablet da seção de vídeo) nunca sai do
 * estado inicial (escondida), mesmo com o scroll certo. Por isso chamamos
 * `ScrollTrigger.refresh()` DE VERDADE (import direto) no 'load'.
 *
 * A correção do alvo de nav pendente é ortogonal a isso e só age quando a
 * posição do alvo REALMENTE mudou desde o clique (comparada contra o valor
 * guardado em pending-nav-target.ts) — nunca incondicionalmente. Usa
 * `scrollToId` (Lenis) porque `lenis.scrollTo(elemento)` lê a posição atual
 * do elemento e o próprio Lenis administra a substituição de uma animação
 * em voo por outra — diferente do scroll nativo do navegador, que reinicia
 * do zero se chamado de novo no meio do caminho.
 *
 * IMPORTANTE — duas coisas diferentes, dois tratamentos diferentes:
 *
 * 1. `scrollToId` (a correção em si) NÃO espera o scroll ficar ocioso.
 *    Chamar de novo enquanto o Lenis já está animando é exatamente pra
 *    isso que ele serve — ele re-mira suavemente. Esperar o scroll
 *    "terminar" antes de corrigir criava um padrão visível de "chega
 *    perto do alvo, para, aí termina de descer" (duas animações em
 *    sequência em vez de uma só sendo re-mirada no meio).
 *
 * 2. `ScrollTrigger.refresh()` (dentro de `onLoad`) é uma chamada pesada e
 *    separada (recalcula TODAS as ScrollTrigger da página, força reflow —
 *    chegou a travar a thread por 800ms numa medição) — essa sim precisa
 *    esperar o scroll ficar ocioso, porque travar a thread NO MEIO da
 *    rolagem trava a pintura do próximo frame independente de quem está
 *    animando o scroll. `whenScrollIdle` rastreia isso em tempo real
 *    (eventos 'scroll'/'scrollend'), não com um timeout cego — um timeout
 *    cego dispara a checagem "não tem scroll AGORA" antes do usuário
 *    clicar em qualquer coisa (comum: 'load' dispara antes da reação do
 *    usuário) e roda o trabalho pesado bem no meio do scroll que ele só
 *    começa DEPOIS, dentro daquela janela.
 */
export function ScrollRestore() {
  useEffect(() => {
    if (!("scrollRestoration" in history)) return;

    const key = KEY_PREFIX + location.pathname;

    // Corrige a posição do alvo de nav pendente (se ainda houver um E a
    // posição dele tiver mudado de verdade) — pode rodar a qualquer
    // momento, inclusive com um scroll do Lenis já em voo.
    const correctPendingTarget = () => {
      const pending = peekPendingNavTarget();
      if (!pending) return;
      const el = document.getElementById(pending.id);
      if (!el) return;
      const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
      if (Math.abs(top - pending.top) < 4) return;
      updatePendingNavTargetTop(top);
      scrollToId(pending.id);
    };

    const runIdle = (fn: () => void) => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(fn, { timeout: 1000 });
      } else {
        setTimeout(fn, 0);
      }
    };

    const hasScrollend = "onscrollend" in window;
    let isScrolling = false;
    const onScroll = () => {
      isScrolling = true;
    };
    const onScrollEnd = () => {
      isScrolling = false;
    };
    if (hasScrollend) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("scrollend", onScrollEnd, { passive: true });
    }

    // Só pro trabalho PESADO (ScrollTrigger.refresh()) — nunca interrompe
    // uma rolagem em andamento. A checagem se repete a cada 'scrollend',
    // então sempre reflete o estado atual, nunca uma suposição de quando
    // foi agendada.
    const whenScrollIdle = (fn: () => void) => {
      if (!hasScrollend) {
        runIdle(fn);
        return;
      }
      const attempt = () => {
        if (isScrolling) {
          window.addEventListener("scrollend", attempt, { once: true });
          return;
        }
        runIdle(() => {
          if (isScrolling) {
            attempt();
            return;
          }
          fn();
        });
      };
      attempt();
    };

    const onLoad = () => {
      whenScrollIdle(() => {
        ScrollTrigger.refresh();
      });
      correctPendingTarget();
    };

    const onPageHide = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
    document.fonts?.ready?.then(correctPendingTarget);
    window.addEventListener("pagehide", onPageHide);

    // Debounce de 250ms de silêncio — evita reagir a rajadas de mudanças
    // no mesmo instante como se fossem N correções separadas.
    let debounceId: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (debounceId !== null) clearTimeout(debounceId);
      debounceId = setTimeout(() => {
        debounceId = null;
        correctPendingTarget();
      }, 250);
    });
    ro.observe(document.documentElement);

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pagehide", onPageHide);
      if (hasScrollend) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("scrollend", onScrollEnd);
      }
      ro.disconnect();
      if (debounceId !== null) clearTimeout(debounceId);
    };
  }, []);

  return null;
}
