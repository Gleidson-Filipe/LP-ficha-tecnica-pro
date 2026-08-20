"use client";

import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { WhipInUp } from "@/components/ui/whip-in-up";

type Segment = { text: string; mark: boolean };

/** Quebra o texto nas frases de ênfase, na ordem em que aparecem. */
function splitEmphasis(text: string, phrases: string[]): Segment[] {
  const segments: Segment[] = [];
  let rest = text;
  for (const phrase of phrases) {
    const idx = rest.indexOf(phrase);
    if (idx === -1) continue;
    if (idx > 0) segments.push({ text: rest.slice(0, idx), mark: false });
    segments.push({ text: phrase, mark: true });
    rest = rest.slice(idx + phrase.length);
  }
  if (rest) segments.push({ text: rest, mark: false });
  return segments;
}

/**
 * Traço de underline orgânico (estilo feito à mão com caneta rosa),
 * renderizado como SVG inline dentro da palavra para alinhamento 100% exato.
 */
function HandUnderline({ show, delay = 0 }: { show: boolean; delay?: number }) {
  return (
    <svg
      className="pointer-events-none absolute left-0 right-0 overflow-visible"
      style={{
        bottom: "-5px",
        left: "-2px",
        width: "calc(100% + 4px)",
        height: "12px",
      }}
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 2 4 Q 30 2.8, 60 3.8 T 98 3.5"
        fill="none"
        stroke="#FF4785"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{
          strokeDasharray: 120,
          strokeDashoffset: show ? 0 : 120,
          opacity: show ? 1 : 0,
          transition: show
            ? `stroke-dashoffset 0.4s cubic-bezier(0.2, 0.9, 0.3, 1) ${delay}ms, opacity 0.3s ease ${delay}ms`
            : "stroke-dashoffset 0.15s ease-out 0ms, opacity 0.15s ease 0ms",
        }}
      />
      <path
        d="M 5 7.8 Q 40 8.5, 75 7.3 T 95 7.8"
        fill="none"
        stroke="#FF4785"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{
          strokeDasharray: 120,
          strokeDashoffset: show ? 0 : 120,
          opacity: show ? 0.7 : 0,
          transition: show
            ? `stroke-dashoffset 0.38s cubic-bezier(0.2, 0.9, 0.3, 1) ${delay + 60}ms, opacity 0.3s ease ${delay + 60}ms`
            : "stroke-dashoffset 0.15s ease-out 0ms, opacity 0.15s ease 0ms",
        }}
      />
    </svg>
  );
}

/**
 * Círculo / elipse orgânica feita à mão (estilo rabisco em volta da palavra),
 * renderizado como SVG inline com padding equilibrado.
 */
function HandCircle({ show, delay = 0 }: { show: boolean; delay?: number }) {
  return (
    <svg
      className="pointer-events-none absolute overflow-visible"
      style={{
        top: "-6px",
        bottom: "-6px",
        left: "-10px",
        right: "-10px",
        width: "calc(100% + 20px)",
        height: "calc(100% + 12px)",
      }}
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Traço principal da elipse */}
      <path
        d="M 12,18 C 10,7 32,3 52,3 C 78,3 96,8 97,20 C 98,31 76,37 50,37 C 22,37 4,31 4,19 C 4,8 28,4 55,4 C 76,4 94,9 96,21"
        fill="none"
        stroke="#FF4785"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{
          strokeDasharray: 320,
          strokeDashoffset: show ? 0 : 320,
          opacity: show ? 1 : 0,
          transition: show
            ? `stroke-dashoffset 0.5s cubic-bezier(0.2, 0.9, 0.3, 1) ${delay}ms, opacity 0.3s ease ${delay}ms`
            : "stroke-dashoffset 0.15s ease-out 0ms, opacity 0.15s ease 0ms",
        }}
      />
      {/* Segundo traço de sobreposição sutil para autenticidade de desenho à mão */}
      <path
        d="M 8,24 C 6,33 28,38 52,38 C 76,38 95,33 96,22 C 97,13 82,6 58,5"
        fill="none"
        stroke="#FF4785"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{
          strokeDasharray: 240,
          strokeDashoffset: show ? 0 : 240,
          opacity: show ? 0.75 : 0,
          transition: show
            ? `stroke-dashoffset 0.42s cubic-bezier(0.2, 0.9, 0.3, 1) ${delay + 80}ms, opacity 0.3s ease ${delay + 80}ms`
            : "stroke-dashoffset 0.15s ease-out 0ms, opacity 0.15s ease 0ms",
        }}
      />
    </svg>
  );
}

const EMPHASIS_ACTIONS = ["underline", "circle", "underline"] as const;

interface RateioFocusProps {
  p1: string;
  p1Emphasis: string[];
  p2: string;
  p2Emphasis: string[];
  remate: string;
  remateEmphasis: string[];
}

/**
 * Os 3 parágrafos do bloco "rateio": passar o mouse na ALTURA de um deles
 * aumenta esse parágrafo e desfoca os outros. O parágrafo em foco ganha
 * os destaques animados (underline e circle) nas palavras exatas.
 */
export function RateioFocus({
  p1,
  p1Emphasis,
  p2,
  p2Emphasis,
  remate,
  remateEmphasis,
}: RateioFocusProps) {
  const refs = [
    useRef<HTMLParagraphElement>(null),
    useRef<HTMLParagraphElement>(null),
    useRef<HTMLParagraphElement>(null),
  ];
  const [active, setActive] = useState<number | null>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rects = refs.map((r) => r.current?.getBoundingClientRect());
    if (rects.some((r) => !r)) return;
    const [r0, r1, r2] = rects as DOMRect[];
    const y = e.clientY;

    const boundary1 = (r0.bottom + r1.top) / 2;
    const boundary2 = (r1.bottom + r2.top) / 2;

    if (y < boundary1) setActive(0);
    else if (y < boundary2) setActive(1);
    else setActive(2);
  };

  const paragraphStyle = (index: number): CSSProperties => {
    const isActive = active === index;
    const neutral = active === null;
    return {
      transform: `scale(${isActive ? 1.06 : neutral ? 1 : 0.95})`,
      filter: isActive || neutral ? "blur(0px)" : "blur(3px)",
      opacity: isActive || neutral ? 1 : 0.4,
      transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease, opacity 0.35s ease",
    };
  };

  const renderParagraph = (
    index: number,
    text: string,
    emphasis: string[],
    className: string,
  ) => {
    const segments = splitEmphasis(text, emphasis);
    let markIndex = 0;

    return (
      <p
        ref={refs[index]}
        className={className}
        style={paragraphStyle(index)}
      >
        {segments.map((seg, i) => {
          const hasLeading = seg.text.startsWith(" ");
          const hasTrailing = seg.text.endsWith(" ");
          const cleanText = seg.text.trim();

          if (!cleanText) {
            return " ";
          }

          if (!seg.mark) {
            return (
              <span key={i}>
                {hasLeading && " "}
                <WhipInUp text={cleanText} />
                {hasTrailing && " "}
              </span>
            );
          }

          const action = EMPHASIS_ACTIONS[markIndex % EMPHASIS_ACTIONS.length];
          const delay = markIndex * 140; // 0ms, 140ms, 280ms
          markIndex += 1;

          return (
            <span key={i}>
              {hasLeading && " "}
              <span className="relative inline-block whitespace-nowrap">
                <WhipInUp text={cleanText} />
                {action === "underline" ? (
                  <HandUnderline show={active === index} delay={delay} />
                ) : (
                  <HandCircle show={active === index} delay={delay} />
                )}
              </span>
              {hasTrailing && " "}
            </span>
          );
        })}
      </p>
    );
  };

  return (
    <div
      className="cursor-default py-2"
      onMouseMove={handleMove}
      onMouseLeave={() => setActive(null)}
    >
      <div className="mx-auto max-w-[46rem] text-center">
        <div className="mt-4 space-y-3 text-lead leading-relaxed">
          {renderParagraph(0, p1, p1Emphasis, "text-[1.0625rem] md:text-[1.125rem] font-medium text-on-ink")}
          {renderParagraph(1, p2, p2Emphasis, "text-[1.0625rem] md:text-[1.125rem] font-medium text-on-ink")}
        </div>

        {/* Citação Editorial de Impacto */}
        {renderParagraph(
          2,
          remate,
          remateEmphasis,
          "mx-auto mt-5 font-display text-[1.25rem] md:text-[1.5rem] font-semibold leading-snug text-on-ink",
        )}
      </div>
    </div>
  );
}
