"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenisInstance } from "@/lib/lenis-instance";

import { isNavJumping, onNavJumpEnd } from "@/lib/nav-jump";

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis();
    setLenisInstance(lenis);

    // Sincroniza imediatamente o Lenis com a posição salva/atual
    if (typeof window !== "undefined") {
      const key = "ftp:scrollY:" + location.pathname;
      const saved = sessionStorage.getItem(key);
      const y = saved !== null ? parseInt(saved, 10) : window.scrollY;
      if (isFinite(y) && y > 0) {
        lenis.scrollTo(y, { immediate: true });
      }
    }

    lenis.on("scroll", () => {
      if (isNavJumping()) return;
      ScrollTrigger.update();
    });

    const unlisten = onNavJumpEnd(() => {
      ScrollTrigger.update();
    });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      unlisten();
      gsap.ticker.remove(update);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return null;
}
