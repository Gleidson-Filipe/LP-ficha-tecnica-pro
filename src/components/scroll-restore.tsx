"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isNavJumping } from "@/lib/nav-jump";
import { getLenisInstance } from "@/lib/lenis-instance";

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
 * pintura da página.
 *
 * Este componente cuida de:
 * 1. Salvar a posição no pagehide.
 * 2. Disparar ScrollTrigger.refresh() de forma segura após o load / fonts.ready
 *    quando o scroll estiver ocioso.
 * 3. Restaurar a posição salva no reload com a página assentada.
 */
export function ScrollRestore() {
  useEffect(() => {
    if (!("scrollRestoration" in history)) return;

    const key = KEY_PREFIX + location.pathname;

    let userScrolled = false;
    let lastCorrectionAt = 0;
    const markUserScrolled = () => {
      userScrolled = true;
    };
    window.addEventListener("wheel", markUserScrolled, { passive: true, once: true });
    window.addEventListener("touchstart", markUserScrolled, { passive: true, once: true });
    window.addEventListener("keydown", markUserScrolled, { passive: true, once: true });
    window.addEventListener("pointerdown", markUserScrolled, { passive: true, once: true });
    const onAnyScroll = () => {
      if (userScrolled) return;
      if (performance.now() - lastCorrectionAt < 120) return;
      markUserScrolled();
    };
    window.addEventListener("scroll", onAnyScroll, { passive: true });

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
    // uma rolagem em andamento.
    const whenScrollIdle = (fn: () => void) => {
      if (!hasScrollend) {
        runIdle(fn);
        return;
      }
      const attempt = () => {
        if (isScrolling || isNavJumping()) {
          window.addEventListener("scrollend", attempt, { once: true });
          return;
        }
        runIdle(() => {
          if (isScrolling || isNavJumping()) {
            attempt();
            return;
          }
          fn();
        });
      };
      attempt();
    };

    const refreshKeepingScroll = () => {
      const lenis = getLenisInstance();
      const y = lenis ? lenis.animatedScroll : window.scrollY;
      ScrollTrigger.refresh();
      lastCorrectionAt = performance.now();
      if (lenis) {
        lenis.scrollTo(y, { immediate: true });
      } else {
        window.scrollTo(0, y);
      }
    };

    const correctReloadRestore = () => {
      if (userScrolled || location.hash || isNavJumping()) return;
      const saved = sessionStorage.getItem(key);
      const y = saved === null ? NaN : parseInt(saved, 10);
      if (!isFinite(y)) return;
      if (Math.abs(window.scrollY - y) < 4) return;
      lastCorrectionAt = performance.now();
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.scrollTo(y, { immediate: true });
      } else {
        window.scrollTo(0, y);
      }
    };

    const onLoad = () => {
      whenScrollIdle(() => {
        if (!isNavJumping()) {
          refreshKeepingScroll();
          correctReloadRestore();
        }
      });
    };

    const onPageHide = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    // Corrige instantaneamente no mount sem esperar load/fontes
    correctReloadRestore();

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
    document.fonts?.ready?.then(() => {
      if (!isNavJumping()) {
        correctReloadRestore();
      }
    });
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("wheel", markUserScrolled);
      window.removeEventListener("touchstart", markUserScrolled);
      window.removeEventListener("keydown", markUserScrolled);
      window.removeEventListener("pointerdown", markUserScrolled);
      window.removeEventListener("scroll", onAnyScroll);
      if (hasScrollend) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("scrollend", onScrollEnd);
      }
    };
  }, []);

  return null;
}
