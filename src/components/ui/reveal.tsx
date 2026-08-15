"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Entrada discreta ao entrar no viewport.
 * À prova de falha: o conteúdo é renderizado VISÍVEL e o estado inicial é
 * aplicado pelo GSAP em layout effect (antes da pintura). Se o JS não
 * carregar, nada some da página.
 */
export function Reveal({
  children,
  className,
  stagger,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const grupo = stagger !== undefined;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const alvos = grupo ? Array.from(el.children) : el;
      gsap.set(alvos, { opacity: 0, y: 14 });
      gsap.to(alvos, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    },
    { scope: root, dependencies: [stagger, grupo] },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
