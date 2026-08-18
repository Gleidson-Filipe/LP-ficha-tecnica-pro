"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Comprime/estica horizontalmente o conteúdo (via scaleX) pra caber
 * exatamente em `width` px — nem passa, nem falta. Mede a largura natural
 * do texto renderizado e aplica a razão certa, então continua exato mesmo
 * se a fonte mudar (peso, fallback ainda não carregado, etc.) — ao
 * contrário de simplesmente reduzir o font-size num valor fixo "no olho".
 *
 * Recalcula no resize (a fonte pode trocar de fallback pra web font depois
 * do mount, mudando a largura natural do texto).
 */
export function FitWidth({
  width,
  className,
  children,
}: {
  width: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      el.style.transform = "scaleX(1)";
      const natural = el.scrollWidth;
      if (natural > 0) el.style.transform = `scaleX(${width / natural})`;
    };

    fit();
    window.addEventListener("resize", fit);
    document.fonts?.ready?.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, [width]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-block", transformOrigin: "left", whiteSpace: "nowrap" }}
    >
      {children}
    </span>
  );
}
