"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { consumePendingNavTarget } from "@/lib/pending-nav-target";

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
 * Esse componente só cuida do que sobrou: salvar a posição no pagehide e
 * disparar o refresh do GSAP depois que a página assenta.
 *
 * O que precisava esperar o layout assentar não era a posição do scroll em
 * si, e sim as ScrollTrigger do GSAP: elas calculam start/end no mount de
 * cada seção, cedo demais em relação à altura final da página — sem
 * recalcular depois, ficam com esses números desatualizados pra sempre e a
 * seção correspondente (ex.: título/tablet da seção de vídeo) nunca sai do
 * estado inicial (escondida), mesmo com o scroll certo. Por isso chamamos
 * `ScrollTrigger.refresh()` DE VERDADE (import direto) no 'load', quando a
 * altura final já é conhecida.
 *
 * Esse refresh recalcula o espaço reservado pela seção de vídeo (sticky) —
 * se o usuário clicou num link do nav ANTES do 'load' disparar (comum:
 * 'load' só acontece depois de TODAS as imagens da página baixarem), o
 * scroll suave já em voo tinha calculado o alvo com a altura ANTIGA, e o
 * refresh desloca onde a seção realmente está. Por isso, depois do
 * refresh, corrige a posição pro alvo pendente (se ainda houver um).
 *
 * Segunda corrida, independente da primeira: as fontes (`font-display:
 * swap`) podem terminar de trocar DEPOIS do 'load' — 'load' não espera
 * fontes, só os recursos "de rede" padrão. A troca da fonte fallback pra
 * Switzer/GeneralSans muda métricas de linha e reflow a página inteira
 * (ver comentário nas fontes em globals.css). Se o clique no nav acontecer
 * DEPOIS da correção do 'load' mas ANTES desse reflow de fonte, nada mais
 * corrigiria — por isso repete a mesma correção em `document.fonts.ready`.
 */
export function ScrollRestore() {
  useEffect(() => {
    if (!("scrollRestoration" in history)) return;

    const key = KEY_PREFIX + location.pathname;

    const correct = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          const pendingId = consumePendingNavTarget();
          if (pendingId) {
            document.getElementById(pendingId)?.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
    };

    const onPageHide = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    if (document.readyState === "complete") {
      correct();
    } else {
      window.addEventListener("load", correct);
    }
    document.fonts?.ready?.then(correct);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("load", correct);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  return null;
}
