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
      const el = root.current;
      const letters = el?.querySelectorAll<HTMLElement>(".wiu-letter");
      if (!el || !letters?.length) return;

      // JSX nasce só com opacity:0 (evita o "flash" de aparecer pronto).
      // O yPercent:200 é definido AQUI, pelo próprio GSAP — nunca via CSS
      // bruto no style inline: o GSAP, ao herdar um transform já escrito
      // em % puro, cravava um deslocamento fixo em px por cima do que
      // depois animava, deixando a letra presa fora de posição mesmo após
      // o tween "terminar". Definindo tudo pelo GSAP desde o início, o
      // cache interno dele fica consistente com o que realmente anima.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(letters, { clearProps: "transform,opacity" });
        return;
      }
      ensureWhipEase();
      gsap.set(letters, { yPercent: 200, opacity: 1 });

      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          gsap.to(letters, {
            yPercent: 0,
            duration: 0.58,
            ease: "whipInUp",
            stagger: 0.007,
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
          style={{ paddingBottom: "0.2em", marginBottom: "-0.2em" }}
        >
          {Array.from(word).map((ch, ci) => (
            <span
              key={ci}
              className="wiu-letter inline-block"
              style={{ opacity: 0 }}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/**
 * Número que "chicoteia" pra cima como o WhipInUp e, na sequência, cresce
 * suavemente de um valor menor até `to` (em vez de já nascer no valor final).
 * Dispara junto com o resto do texto ao redor, mesmo gatilho de viewport.
 */
export function CountUpStat({
  to,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const wrapEl = wrap.current;
      const el = num.current;
      if (!wrapEl || !el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = `${prefix}${to}${suffix}`;
        gsap.set(el, { clearProps: "transform,opacity" });
        return;
      }
      ensureWhipEase();

      const from = Math.max(0, Math.round(to * 0.25));
      const counter = { val: from };
      el.textContent = `${prefix}${from}${suffix}`;
      gsap.set(el, { yPercent: 200, opacity: 1 });

      // Observa o WRAPPER (sem transform), nunca o próprio número que se
      // move — o mesmo padrão do WhipInUp. Observar o elemento que é
      // transformado faz o navegador medir a interseção na posição
      // deslocada (escondida), não na posição de repouso.
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          gsap
            .timeline()
            .to(el, { yPercent: 0, duration: 0.58, ease: "whipInUp" })
            .to(
              counter,
              {
                val: to,
                duration: 1,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
                },
              },
              "-=0.55",
            );
          io.disconnect();
        },
        { rootMargin: "0px" },
      );
      io.observe(wrapEl);

      return () => io.disconnect();
    },
    { scope: wrap },
  );

  return (
    <span
      ref={wrap}
      className="inline-block overflow-hidden align-top"
      style={{ paddingBottom: "0.2em", marginBottom: "-0.2em" }}
    >
      <span
        ref={num}
        className={cn("inline-block tabular-nums", className)}
        style={{ opacity: 0 }}
      >
        {prefix}
        {to}
        {suffix}
      </span>
    </span>
  );
}
