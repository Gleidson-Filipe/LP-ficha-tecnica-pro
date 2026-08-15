"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ClippedCircleProps {
  circleClassName?: string;
  className?: string;
}

/**
 * Reveal circular que nasce no ponto do mouse e cresce até cobrir a caixa
 * toda — via clip-path (não opacity). O JS só alimenta a posição do cursor
 * nas variáveis --x/--y; quem faz o efeito (expandir no hover, com
 * transição) é puramente Tailwind (`group-hover:` + `transition-`).
 * Precisa de um ancestral `position: relative` com a classe `group`.
 */
export function ClippedCircle({ circleClassName, className }: ClippedCircleProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = rootRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const handleMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--x", `${x}%`);
      el.style.setProperty("--y", `${y}%`);
    };
    parent.addEventListener("mousemove", handleMove);
    return () => parent.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{ "--x": "50%", "--y": "50%" } as React.CSSProperties}
      className={cn(
        "pointer-events-none absolute inset-0 z-0",
        "transition-[clip-path] duration-500 ease-out",
        "[clip-path:circle(0%_at_var(--x)_var(--y))]",
        "group-hover:[clip-path:circle(140%_at_var(--x)_var(--y))]",
        className,
      )}
    >
      <div className={cn("absolute inset-0", circleClassName)} />
    </div>
  );
}
