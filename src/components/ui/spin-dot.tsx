"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/**
 * Quadradinho que gira no próprio eixo de tempos em tempos, sozinho —
 * cada instância com seu próprio atraso inicial e cooldown aleatórios
 * entre giros, pra não ficarem todos girando em sincronia.
 */
export function SpinDot({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let cancelled = false;
      let timer: ReturnType<typeof setTimeout>;

      const spin = () => {
        if (cancelled) return;
        gsap.to(el, {
          rotate: "+=360",
          duration: 1.8 + Math.random() * 0.5,
          ease: "sine.inOut",
          onComplete: () => {
            if (cancelled) return;
            timer = setTimeout(spin, 2200 + Math.random() * 3200);
          },
        });
      };

      timer = setTimeout(spin, Math.random() * 3000);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-hidden
      className={cn("inline-block size-1.5 shrink-0 bg-accent", className)}
    />
  );
}
