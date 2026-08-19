"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenisInstance } from "@/lib/lenis-instance";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis assume o scroll da página inteira (wheel/touch), sincronizado com
 * o ticker do GSAP — é a integração oficial recomendada (docs do Lenis,
 * seção GSAP ScrollTrigger). Pedido explícito do usuário: testar Lenis
 * como alternativa ao scrollIntoView nativo / GSAP ScrollToPlugin pra
 * resolver o soluço ao clicar no nav logo após o load — `lenis.scrollTo()`
 * aceita o ELEMENTO diretamente (não um Y congelado) e já respeita
 * scroll-margin-top nativo, então não precisa de cálculo manual de offset.
 *
 * `gsap.ticker.lagSmoothing(0)` desliga a compensação de "frames perdidos"
 * do GSAP — com Lenis dirigindo o scroll pelo mesmo ticker, essa
 * compensação pode fazer o scroll pular pra frente de forma abrupta depois
 * de qualquer soluço da thread principal, em vez de só continuar suave.
 */
export function LenisProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis();
    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return null;
}
