"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Entrada discreta ao entrar no viewport.
 * À prova de falha: o conteúdo é renderizado VISÍVEL e o estado inicial é
 * aplicado pelo GSAP em layout effect (antes da pintura). Se o JS não
 * carregar, nada some da página.
 *
 * Usa IntersectionObserver nativo (não ScrollTrigger): se o elemento monta
 * já além do ponto de ativação (F5 no meio da seção, back/forward),
 * `scrollTrigger.onEnter` dispara no mesmo tick da criação, antes do
 * navegador pintar o `opacity: 0` — e com `once: true` o conteúdo travava
 * invisível pra sempre. O IntersectionObserver dispara de forma assíncrona
 * (próximo frame), garantindo que o estado inicial sempre é pintado antes
 * do tween começar — mesmo padrão do WhipInUp e do ChecklistReveal.
 * `rootMargin: "0px 0px -8% 0px"` é o equivalente exato de `"top 92%"`.
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

      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          gsap.to(alvos, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: stagger ?? 0,
          });
          io.disconnect();
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);

      return () => io.disconnect();
    },
    { scope: root, dependencies: [stagger, grupo] },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
