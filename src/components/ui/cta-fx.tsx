"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/**
 * Hook GSAP para controle de animação sutil do botão no hover.
 */
export function useCtaFx<T extends HTMLElement = HTMLAnchorElement>() {
  const ref = useRef<T>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onEnter = () => {
      gsap.to(el, {
        scale: 1.012,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return ref;
}

/**
 * Camada de Glow Sutil Contido:
 * Fica rente à borda do botão (-inset-[1px]), com blur baixo (blur-[6px])
 * para criar apenas um contorno luminoso suave que não vaza para fora.
 */
export function CtaGlow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -inset-[1px]",
        "bg-gradient-to-r from-[#ff0055] via-[#ff2a70] to-[#ff4785]",
        "opacity-25 blur-[6px]",
        "transition-all duration-300 ease-out",
        "group-hover:opacity-40 group-hover:blur-[8px]",
        "animate-morphic-glow -z-10",
        className
      )}
    />
  );
}

/**
 * Faixa de Luz (Shine) no hover:
 * Desliza rapidamente de -100% para +100% apenas ao passar o mouse.
 * Fica atrás do texto (z-0) para nunca esbranquiçar a leitura.
 */
export function CtaShine({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -translate-x-full",
        "group-hover:translate-x-full",
        "transition-transform duration-700 ease-out",
        "bg-gradient-to-r from-transparent via-white/30 to-transparent",
        "skew-x-[-20deg] z-0",
        className
      )}
    />
  );
}

/**
 * Transição de Texto Vertical (Slide Text Roll):
 * No hover, a frase sobe e a mesma frase entra por baixo com opacidade fluida.
 * O texto fica na camada superior (relative z-10) com branco 100% nítido e legível.
 */
export function CtaEcho({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className="relative z-10 inline-flex flex-col items-center justify-center overflow-hidden align-middle">
      {/* Texto Principal: sobe e faz fade out no hover */}
      <span
        className={cn(
          "inline-flex items-center justify-center text-white transition-all duration-300 ease-in-out group-hover:-translate-y-full group-hover:opacity-0",
          className
        )}
      >
        {children}
      </span>
      {/* Cópia Idêntica: entra por baixo no hover */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 inline-flex items-center justify-center text-white translate-y-full opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100",
          className
        )}
      >
        {children}
      </span>
    </span>
  );
}
