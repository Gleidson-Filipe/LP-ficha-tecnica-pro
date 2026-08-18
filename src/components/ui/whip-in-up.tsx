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
      // As letras ficam quebradas em spans só enquanto a animação precisa
      // delas. Feito o tween, cada palavra volta a ser um texto único —
      // sem isso, a página inteira fica permanentemente cheia de spans por
      // letra, o que quebra a seleção (o navegador desenha um retângulo por
      // span, ficando "picotada") e o copy/paste (o espaçamento entre
      // palavras é feito via margin, não caractere de espaço real, então
      // colar gruda as palavras). Recomendação da própria autora do GSAP
      // SplitText (Cassie Evans) para esse exato problema: reverter o split
      // assim que a animação terminar, em vez de manter o DOM fragmentado.
      //
      // Importante: o revert some com as letras, mas mantém o <span> de
      // cada palavra (o wrapper com align-top/padding que evita cortar
      // rabichos de letras como "g" e "j" durante o slide). Trocar isso por
      // texto solto (sem wrapper nenhum) muda a métrica vertical da linha —
      // o texto "salta" ~6px pra cima no instante do revert, porque o
      // wrapper tem alinhamento/altura diferentes do fluxo normal de texto.
      // Mantendo o wrapper e só limpando as letras de dentro dele, a caixa
      // nunca muda: revert fica imperceptível.
      //
      // O "overflow-hidden" em si só existe pra mascarar o slide da letra
      // durante a animação — uma vez revertido não sobra nada pra cortar, e
      // deixá-lo ligado faz o Chrome pintar a seleção de texto com uma
      // reentrância exatamente no espaço entre palavras (cada wrapper vira
      // seu próprio "clipping container" e a marcação de seleção nele fica
      // ligeiramente destacada da marcação do espaço ao lado). Desligar o
      // overflow no revert não mexe em tamanho/posição — só no que fica
      // visível — então é seguro e resolve o serrilhado da seleção.
      const revertWord = (wordEl: HTMLElement, word: string) => {
        wordEl.textContent = word;
        wordEl.style.overflow = "visible";
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.querySelectorAll<HTMLElement>(".wiu-word").forEach((w) =>
          revertWord(w, w.dataset.word ?? ""),
        );
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
            onComplete: () => {
              el.querySelectorAll<HTMLElement>(".wiu-word").forEach((w) =>
                revertWord(w, w.dataset.word ?? ""),
              );
            },
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
    // font-kerning:none nos dois estados (letras separadas e texto revertido)
    // — sem isso, o navegador aplica kerning só depois do revert (letras
    // separadas nunca têm kerning entre si), e a diferença de largura entre
    // pares de letras kerned some de uma vez, deslocando várias palavras ao
    // mesmo tempo (percebido como um "salto" coletivo do texto).
    <span ref={root} className={className} style={{ fontKerning: "none" }}>
      {words.map((word, wi) => (
        <span key={wi}>
          <span
            className="wiu-word inline-block overflow-hidden align-top"
            data-word={word}
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
          {wi < words.length - 1 ? (
            <span style={{ verticalAlign: "top" }}> </span>
          ) : (
            ""
          )}
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

      const from = 0;
      const counter = { val: from };
      el.textContent = `${prefix}${from}${suffix}`;
      gsap.set(el, { yPercent: 200, opacity: 1 });

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
                duration: 1.3,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
                },
              },
              "+=0.04",
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

/**
 * Componente que recebe uma string como "6", "100%", "30s", "7 dias",
 * executa o efeito de chicotear de baixo para cima (Whip In Up) e,
 * imediatamente após assentar, dispara a contagem (Counter Up) de 0 até o valor final.
 */
export function CountUpWhip({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const wrap = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  const match = value.match(/^([^\d]*?)(\d+)(.*)$/);
  const prefix = match ? match[1] : "";
  const to = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : "";

  useGSAP(
    () => {
      const wrapEl = wrap.current;
      const el = num.current;
      if (!wrapEl || !el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = value;
        gsap.set(el, { clearProps: "transform,opacity" });
        return;
      }
      ensureWhipEase();

      const counter = { val: 0 };
      el.textContent = `${prefix}0${suffix}`;
      gsap.set(el, { yPercent: 200, opacity: 1 });

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
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
                },
              },
              "+=0.04",
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
        {value}
      </span>
    </span>
  );
}
