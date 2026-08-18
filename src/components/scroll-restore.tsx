"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
 */
export function ScrollRestore() {
  useEffect(() => {
    if (!("scrollRestoration" in history)) return;

    const key = KEY_PREFIX + location.pathname;

    const onLoad = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    };

    const onPageHide = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  return null;
}
