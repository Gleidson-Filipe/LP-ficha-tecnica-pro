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
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);

  useLayoutEffect(() => {
    if (!isView) return;
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
  }, [isView]);

  // Se isView for false, sempre mostra. Se for true, espera entrar na viewport.
  const shouldShow = !isView || isInView;

  useLayoutEffect(() => {
    const element = elementRef.current;
    let annotation: RoughAnnotation | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (shouldShow && element) {
      const start = () => {
        const annotationConfig = {
          type: action,
          color,
          strokeWidth,
          animationDuration,
          iterations,
          padding,
          multiline,
        };

        const currentAnnotation = annotate(element, annotationConfig);
        annotation = currentAnnotation;
        currentAnnotation.show();

        resizeObserver = new ResizeObserver(() => {
          currentAnnotation.hide();
          currentAnnotation.show();
        });

        resizeObserver.observe(element);
        resizeObserver.observe(document.body);
      };

      if (delay > 0) {
        timer = setTimeout(start, delay);
      } else {
        start();
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
      annotation?.remove();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    delay,
  ]);

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  );
}
