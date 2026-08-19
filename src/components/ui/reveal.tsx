"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { isNavJumping, deferDuringNavJump, cancelDeferred } from "@/lib/nav-jump";

gsap.registerPlugin(useGSAP);

/**
 * Entrada discreta ao entrar no viewport.
 * Por padrão, à prova de falha: o conteúdo é renderizado VISÍVEL e o
 * estado inicial é aplicado pelo GSAP em layout effect (antes da
 * pintura). Se o JS não carregar, nada some da página. Isso deixa uma
 * janela teórica de flash (o layout effect precisa rodar antes do
 * primeiro paint do navegador) — normalmente imperceptível, mas visível
 * em alguns casos.
 *
 * `noFlash`: troca essa garantia por zero flash garantido — igual ao
 * WhipInUp, escreve `opacity:0` direto no JSX, antes de qualquer JS
 * rodar. Só usar quando o elemento é puramente decorativo (ex.: um
 * ícone ao lado de um texto que já tem sua própria garantia de
 * fallback) — sem JS, ele fica invisível para sempre.
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
  noFlash,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  noFlash?: boolean;
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
          if (isNavJumping()) {
            deferDuringNavJump(el, () => {
              io.unobserve(el);
              io.observe(el);
            });
            return;
          }
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

      return () => {
        cancelDeferred(el);
        io.disconnect();
      };
    },
    { scope: root, dependencies: [stagger, grupo] },
  );

  return (
    <div
      ref={root}
      className={className}
      style={noFlash ? { opacity: 0, transform: "translateY(14px)" } : undefined}
    >
      {children}
    </div>
  );
}
