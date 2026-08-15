"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type React from "react";
import { annotate } from "rough-notation";
import { type RoughAnnotation } from "rough-notation/lib/model";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
  /** Espera X ms depois do gatilho antes de desenhar (ex.: deixar um texto animado, tipo WhipInUp, terminar antes do traço aparecer). */
  delay?: number;
  /**
   * Modo controlado: quando definido, ignora `isView` e desenha/some a
   * anotação toda vez que o valor mudar — em vez de desenhar uma única
   * vez. Use pra ênfases que reagem a hover/estado, não só a "entrou na
   * tela". Cada toggle recria a anotação do zero (mede a posição de novo),
   * então nunca fica presa numa medição antiga.
   */
  show?: boolean;
}

/**
 * Porta do Highlighter da Magic UI (magicui.design/r/highlighter). O
 * original usa `useInView` de "motion/react" (Framer Motion) só pra
 * disparar a anotação quando entra na viewport — trocado aqui por
 * IntersectionObserver nativo, mesmo padrão do WhipInUp: este projeto
 * usa GSAP/vanilla, nunca Framer Motion. `rough-notation` (o motor do
 * traço à mão) continua o mesmo, não é uma lib de motion.
 */
export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  delay = 0,
  show,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);

  const controlled = show !== undefined;

  useLayoutEffect(() => {
    if (controlled || !isView) return;
    const element = elementRef.current;
    if (!element) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setIsInView(true);
        io.disconnect();
      },
      { rootMargin: "-10%" },
    );
    io.observe(element);

    return () => io.disconnect();
  }, [isView, controlled]);

  // Modo controlado: `show` manda. Senão, mostra direto (ou espera a
  // viewport, se `isView`).
  const shouldShow = controlled ? show : !isView || isInView;

  // Cria a anotação DO ZERO a cada vez que `shouldShow` liga (e a destrói
  // quando desliga) — em vez de manter uma única instância viva alternando
  // show()/hide(). Manter uma instância persistente + um ResizeObserver
  // por Highlighter (observando document.body) causava colisão entre as
  // várias anotações de um mesmo parágrafo: todas acabavam desenhadas na
  // mesma posição/tamanho quando vários observers disparavam juntos.
  // Recriar do zero garante uma medição limpa e isolada a cada toggle.
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || !shouldShow) return;

    let annotation: RoughAnnotation | null = null;
    const timer = setTimeout(() => {
      annotation = annotate(element, {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      });
      annotation.show();
    }, delay);

    return () => {
      clearTimeout(timer);
      annotation?.remove();
    };
  }, [shouldShow, delay, action, color, strokeWidth, animationDuration, iterations, padding, multiline]);

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  );
}
