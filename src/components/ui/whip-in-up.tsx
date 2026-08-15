"use client";

import { useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(CustomEase, useGSAP);

/**
 * Curva do "whipInUp" do cult-ui (biblioteca original é Framer Motion —
 * aqui é a mesma curva de bezier recriada em GSAP via CustomEase, este
 * projeto usa GSAP em tudo, nunca Framer Motion).
 */
let whipEaseReady = false;
function ensureWhipEase() {
  if (whipEaseReady) return;
  CustomEase.create("whipInUp", "0.5, -0.15, 0.25, 1.05");
  whipEaseReady = true;
}

/**
 * Texto que "chicoteia" de baixo para cima, letra a letra, cada palavra
 * mascarada em overflow-hidden (permite quebra de linha normal). Dispara
 * uma vez quando entra no viewport — inclusive no load, se já nascer
 * visível (ex.: Hero), sem precisar de scroll.
 *
 * Usa IntersectionObserver nativo (não ScrollTrigger): com dezenas dessas
 * animações na mesma página, o bookkeeping interno do ScrollTrigger para
 * "elemento já ativo no momento da criação" ficava dessincronizado do DOM
 * (o tween reportava progresso mas o transform não era escrito) — o
 * IntersectionObserver dispara de forma confiável em ambos os casos:
 * elemento já visível no mount ou entrando depois via scroll.
 */
export function WhipInUp({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      ensureWhipEase();

      const el = root.current;
      const letters = el?.querySelectorAll<HTMLElement>(".wiu-letter");
      if (!el || !letters?.length) return;

      gsap.set(letters, { yPercent: 200 });

      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          gsap.to(letters, {
            yPercent: 0,
            duration: 1,
            ease: "whipInUp",
            stagger: 0.014,
          });
          io.disconnect();
        },
        // Sem margem: dispara exatamente quando o elemento cruza a borda
        // real do viewport, nunca antes — não é sobre "entrar na seção",
        // é sobre o elemento em si entrar na área visível da tela.
        { rootMargin: "0px" },
      );
      io.observe(el);

      return () => io.disconnect();
    },
    { scope: root },
  );

  const words = text.split(" ");

  return (
    <span ref={root} className={className}>
      {words.map((word, wi) => (
        <span
          key={wi}
          className="mr-[0.22em] inline-block overflow-hidden align-top last:mr-0"
        >
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className="wiu-letter inline-block">
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
