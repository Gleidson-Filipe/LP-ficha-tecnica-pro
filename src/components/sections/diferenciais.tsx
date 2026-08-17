"use client";

import { useState } from "react";
import { diferenciais as d } from "@/lib/content";
import { Section, Label } from "@/components/ui/kit";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { cn } from "@/lib/utils";

function DiferencialIcon({ icone }: { icone: string }) {
  switch (icone) {
    case "calculadora":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-accent"
        >
          <rect x="40" y="32" width="176" height="192" rx="16" />
          <line x1="80" y1="72" x2="176" y2="72" />
          <circle cx="88" cy="120" r="10" fill="currentColor" />
          <circle cx="128" cy="120" r="10" fill="currentColor" />
          <circle cx="168" cy="120" r="10" fill="currentColor" />
          <circle cx="88" cy="168" r="10" fill="currentColor" />
          <circle cx="128" cy="168" r="10" fill="currentColor" />
          <circle cx="168" cy="168" r="10" fill="currentColor" />
        </svg>
      );
    case "energia":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-accent"
        >
          <polygon points="160 16 48 144 120 144 96 240 208 112 136 112 160 16" />
        </svg>
      );
    case "tempo":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-accent"
        >
          <circle cx="128" cy="128" r="96" />
          <polyline points="128 72 128 128 176 128" />
        </svg>
      );
    case "embalagem":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-accent"
        >
          <polygon points="128 24 224 80 128 136 32 80 128 24" />
          <polyline points="224 80 224 176 128 232 32 176 32 80" />
          <line x1="128" y1="136" x2="128" y2="232" />
          <polyline points="176 52 80 108" />
        </svg>
      );
    default:
      return null;
  }
}

export function Diferenciais() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const toggleFlip = (idx: number) => {
    setFlippedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <Section id="diferenciais" tone="ink" className="py-16 md:py-24">
      {/* ── Cabeçalho da Seção ── */}
      <div className="pad mb-12 md:mb-16">
        <Label>{d.label}</Label>
        <h2 className="mt-6 max-w-[26ch] font-display text-h2 text-balance">
          <WhipInUp text={d.titlePre} />
          <span className="underline decoration-accent decoration-[4px] underline-offset-[8px]">
            <WhipInUp text={d.titleMark} />
          </span>
          <WhipInUp text={d.titlePost} />
        </h2>
      </div>

      {/* ── Painel Unificado com as 4 Colunas (Sem fundo residual atrás do flip) ── */}
      <div className="pad">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-transparent">
          {d.cards.map((c, idx) => {
            const isFlipped = flippedIndex === idx;

            const roundedClasses = cn(
              // Mobile (1 col)
              idx === 0 && "rounded-t-2xl sm:rounded-t-none",
              idx === 3 && "rounded-b-2xl sm:rounded-b-none",
              // Tablet (2 cols)
              idx === 0 && "sm:rounded-tl-2xl sm:rounded-tr-none lg:rounded-l-3xl lg:rounded-r-none",
              idx === 1 && "sm:rounded-tr-2xl sm:rounded-tl-none lg:rounded-none",
              idx === 2 && "sm:rounded-bl-2xl sm:rounded-br-none lg:rounded-none",
              idx === 3 && "sm:rounded-br-2xl sm:rounded-bl-none lg:rounded-r-3xl lg:rounded-l-none"
            );

            return (
              <div
                key={c.n}
                onClick={() => toggleFlip(idx)}
                className="group h-[440px] sm:h-[470px] lg:h-[500px] w-full [perspective:1200px] cursor-pointer select-none"
              >
                {/* Container 3D com rotação */}
                <div
                  className={cn(
                    "relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ease-out",
                    isFlipped
                      ? "[transform:rotateY(180deg)]"
                      : "group-hover:[transform:rotateY(180deg)]"
                  )}
                >
                  {/* ── FRENTE DO CARD (Superfície Clara / Minimalista com Texto na Base) ── */}
                  <div
                    className={cn(
                      "absolute inset-0 w-full h-full bg-paper p-7 sm:p-8 lg:p-9 flex flex-col justify-between [backface-visibility:hidden] border-b sm:border-b-0 sm:border-r border-black/[0.08] last:border-r-0 shadow-lg",
                      roundedClasses
                    )}
                  >
                    {/* Topo: Ícone Phosphor na esquerda, Ícone de Flip no canto direito */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <DiferencialIcon icone={c.icone} />
                        <span className="text-on-paper/30 group-hover:text-accent group-hover:rotate-180 transition-all duration-500" title="Virar card">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xl lg:text-[1.35rem] leading-snug text-on-paper">
                        {c.titulo}
                      </h3>
                    </div>

                    {/* Base: Texto explicativo posicionado embaixo */}
                    <div className="mt-auto pt-6">
                      <p className="text-[0.875rem] lg:text-[0.9375rem] text-on-paper-soft leading-relaxed">
                        {c.texto}
                      </p>
                    </div>
                  </div>

                  {/* ── VERSO DO CARD (Superfície Escura / Comparativo de Impacto) ── */}
                  <div
                    className={cn(
                      "absolute inset-0 w-full h-full bg-ink-panel text-on-ink p-7 sm:p-8 lg:p-9 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] border border-white/12 shadow-2xl",
                      roundedClasses
                    )}
                  >
                    {/* Topo: Header com ícone no canto direito e Pergunta */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                          Comparativo
                        </span>
                        <span className="text-on-ink-soft/40 group-hover:text-accent group-hover:-rotate-180 transition-all duration-500" title="Virar card">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </span>
                      </div>

                      <h4 className="font-display text-lg lg:text-xl font-bold text-on-ink leading-snug">
                        {c.pergunta}
                      </h4>
                    </div>

                    {/* Base: Comparação Planilha comum vs Ficha Técnica Pro */}
                    <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
                      <div className="flex items-center gap-2.5 text-sm text-on-ink-soft">
                        {/* Phosphor x-bold */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 256"
                          fill="none"
                          stroke="#ff0000"
                          strokeWidth="24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 shrink-0"
                        >
                          <line x1="200" y1="56" x2="56" y2="200" />
                          <line x1="200" y1="200" x2="56" y2="56" />
                        </svg>
                        <span className="leading-tight">{c.concorrente}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-[0.9375rem] font-bold text-white">
                        {/* Phosphor check-bold */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 256"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 text-emerald-400 shrink-0"
                        >
                          <polyline points="216 72 104 184 48 128" />
                        </svg>
                        <span className="leading-tight">{c.destaque}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
