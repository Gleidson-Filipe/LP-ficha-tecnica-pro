"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { calculo as c } from "@/lib/content";
import { Section } from "@/components/ui/kit";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { cn } from "@/lib/utils";

const steps = [
  {
    n: "01",
    titulo: "Ingredientes",
    texto:
      "Cadastre os ingredientes e as quantidades da receita. A Ficha Técnica Pro calcula automaticamente o custo exato de cada preparo.",
    image: "/images/precificacao/ingredientes.webp",
    w: 1001,
    h: 677,
  },
  {
    n: "02",
    titulo: "Embalagens",
    texto:
      "Adicione o custo de embalagens, etiquetas, sacolas e outros materiais utilizados na venda do produto.",
    image: "/images/precificacao/embalagens.webp",
    w: 691,
    h: 677,
  },
  {
    n: "03",
    titulo: "Maquinários",
    texto:
      "Cadastre os equipamentos utilizados na produção e informe o tempo de uso de cada um. A Ficha Técnica Pro calcula automaticamente o consumo de gás e energia da receita.",
    image: "/images/precificacao/maquinarios.webp",
    w: 768,
    h: 677,
  },
  {
    n: "04",
    titulo: "Mão de obra",
    texto:
      "Cadastre os funcionários e o tempo gasto na produção. A planilha calcula o custo da mão de obra por minuto e por receita.",
    image: "/images/precificacao/maodeobra.webp",
    w: 777,
    h: 677,
  },
  {
    n: "05",
    titulo: "Precificação",
    texto:
      "Informe impostos, taxas de cartão, comissões e a margem de lucro desejada. A Ficha Técnica Pro calcula automaticamente o preço de venda sugerido.",
    image: "/images/precificacao/precificacao.webp",
    w: 950,
    h: 991,
  },
  {
    n: "06",
    titulo: "Preço de venda calculado",
    texto: "Em poucos segundos você visualiza:",
    checks: [
      "Preço sugerido",
      "Lucro estimado",
      "Margem de contribuição",
      "CMV",
      "Markup",
      "Todos os custos considerados automaticamente",
    ],
    image: "/images/precificacao/resultado.webp",
    w: 827,
    h: 861,
  },
];

/**
 * Calculo: Layout com linhas horizontais e revelação da imagem no hover.
 * Ao passar o mouse sobre o retângulo da etapa, a imagem correspondente da
 * planilha aparece suavemente na lateral direita daquela linha.
 */
export function Calculo() {
  // Controle por clique (primeira etapa aberta por padrão ou conforme o usuário clica)
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Skeleton sutil enquanto a imagem de cada etapa carrega — mesmo motivo
  // do modulos.tsx: `step.image` (string) é a própria chave do lightbox,
  // então nada de import estático aqui.
  const [loadedSteps, setLoadedSteps] = useState<Set<string>>(new Set());
  const markLoaded = (n: string) =>
    setLoadedSteps((prev) => (prev.has(n) ? prev : new Set(prev).add(n)));
  // Zoom sutil da imagem no hover, via JS (não `group-hover/img:scale-[1.015]`
  // do Tailwind) — essa classe com valor arbitrário decimal não compila
  // com consistência em todos os targets. `onMouseEnter/Leave` + `style`
  // inline garante o transform sem falha.
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  // O texto/checks de cada etapa (`step.texto`) só existe no DOM quando a
  // etapa está aberta (`{isActive && (...)}`) — fecha e reabre = desmonta e
  // remonta de verdade. Sem essa marcação, reabrir a MESMA etapa re-anima o
  // WhipInUp toda vez.
  //
  // Marcar isso num `useEffect` com cleanup (rodando quando `activeIdx`
  // muda) quebra no React Strict Mode. Por isso a marca é feita direto no
  // clique (só dispara em interação de verdade).
  const [seenSteps, setSeenSteps] = useState<Set<string>>(new Set());
  const markSeenStep = (idx: number) => {
    const n = steps[idx].n;
    setSeenSteps((prev) => (prev.has(n) ? prev : new Set(prev).add(n)));
  };

  // Fechar lightbox ao pressionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomImage(null);
    };
    if (zoomImage) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomImage]);

  return (
    <Section
      ref={sectionRef}
      id="calculo"
      tone="paper"
      className="rule-t relative overflow-hidden py-14 md:py-20 lg:py-24"
    >
      {/* ── Cabeçalho Centralizado ── */}
      <div className="pad mb-12 md:mb-16 text-center flex flex-col items-center">
        <h2 className="max-w-[28ch] font-display text-h2 text-balance text-center">
          <WhipInUp text={c.title} />
        </h2>
        <p className="mt-4 max-w-[64ch] text-lead soft text-center">
          <WhipInUp text={c.lead} />
        </p>
      </div>

      {/* ── Faixas Horizontais Largura Total: Abertura por Clique ── */}
      <div className="w-full rule-t">
        {steps.map((step, idx) => {
          const isActive = activeIdx === idx;

          return (
            <div
              key={step.n}
              onClick={() => {
                if (activeIdx !== null) markSeenStep(activeIdx);
                setActiveIdx((prev) => (prev === idx ? null : idx));
              }}
              className={cn(
                "group relative w-full rule-b transition-all duration-300 ease-out cursor-pointer overflow-hidden select-none",
                isActive
                  ? "bg-paper-panel/35 py-6 sm:py-7 lg:py-8"
                  : "bg-transparent hover:bg-paper-panel/25 py-4 sm:py-5 lg:py-5.5"
              )}
            >
              <div className="pad relative grid gap-6 lg:grid-cols-[1fr_1.4fr] xl:grid-cols-[0.9fr_1.5fr] lg:items-start">
                {/* Coluna da Esquerda: Apenas o Título quando fechado, e Textos quando aberto */}
                <div className="flex flex-col justify-start pt-0.5 lg:pt-1 pr-14 lg:pr-10">
                  <h3
                    className="font-display text-xl sm:text-2xl lg:text-[1.85rem] font-bold tracking-tight text-on-paper"
                  >
                    <WhipInUp text={step.titulo} />
                  </h3>

                  {/* Textos explicativos e checkmarks visíveis EXCLUSIVAMENTE quando o retângulo estiver ABERTO */}
                  {isActive && (
                    <div className="mt-3 animate-in fade-in duration-300">
                      <p className="text-[0.9375rem] md:text-body text-on-paper-soft leading-relaxed max-w-[44ch]">
                        {seenSteps.has(step.n) ? step.texto : <WhipInUp text={step.texto} />}
                      </p>

                      {/* Lista de Checkmarks para a etapa 06 */}
                      {step.checks && (
                        <ul className="mt-3.5 space-y-1.5 text-[0.875rem] font-medium text-on-paper">
                          {step.checks.map((ck) => (
                            <li key={ck} className="flex items-center gap-2">
                              <span className="text-accent font-bold text-sm">✔</span>
                              <span>
                                {seenSteps.has(step.n) ? ck : <WhipInUp text={ck} />}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Seta diagonal Phosphor (Thin) — visível apenas quando a etapa está fechada.
                    Desmontada quando ativa para garantir que o SVG não permaneça no DOM sob a imagem,
                    eliminando qualquer conflito de composição de camadas/GPU no hover do zoom. */}
                {!isActive && (
                  <div
                    className="absolute right-6 sm:right-10 md:right-14 lg:right-16 xl:right-20 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-opacity duration-200"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-on-paper/75 group-hover:text-accent group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-all duration-300 shrink-0"
                    >
                      <line x1="64" y1="192" x2="192" y2="64" />
                      <polyline points="88 64 192 64 192 168" />
                    </svg>
                  </div>
                )}

                {/* Coluna da Direita: Accordion que expande ao clicar com imagem maior e clique para Zoom. */}
                <div
                  className={cn(
                    "relative z-10 grid transition-all duration-300 ease-out",
                    isActive
                      ? "grid-rows-[1fr] opacity-100 mt-4 lg:mt-0"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  )}
                >
                  <div className="min-h-0 overflow-hidden flex items-center justify-center lg:justify-end">
                    <div
                      title="Clique para ampliar a planilha"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomImage(step.image);
                      }}
                      onMouseEnter={() => setHoveredStep(step.n)}
                      onMouseLeave={() => setHoveredStep((prev) => (prev === step.n ? null : prev))}
                      className="group/img isolate relative inline-flex w-fit max-w-full max-h-[300px] sm:max-h-[340px] md:max-h-[380px] lg:max-h-[420px] cursor-zoom-in"
                      style={{ aspectRatio: `${step.w} / ${step.h}`, padding: 8 }}
                    >
                      {!loadedSteps.has(step.n) && (
                        <div
                          aria-hidden
                          className="absolute inset-2 z-0 animate-pulse bg-black/[0.05]"
                          style={{ borderRadius: 12 }}
                        />
                      )}
                      <Image
                        src={step.image}
                        alt={`Etapa - ${step.titulo}`}
                        width={step.w}
                        height={step.h}
                        sizes="(max-width: 1024px) 95vw, 50vw"
                        quality={90}
                        priority={idx === 0}
                        onLoad={() => markLoaded(step.n)}
                        className="relative z-10 max-h-full max-w-full object-contain shadow-md transition-transform duration-300"
                        style={{
                          aspectRatio: `${step.w} / ${step.h}`,
                          borderRadius: 12,
                          transform: hoveredStep === step.n ? "scale(1.015)" : "scale(1)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal Lightbox de Zoom para Visualização em Alta Resolução ── */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 cursor-zoom-out animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setZoomImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors font-bold"
            style={{ borderRadius: "50%", width: 44, height: 44, fontSize: 20 }}
            aria-label="Fechar ampliação"
          >
            ✕
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-[95vw] flex items-center justify-center p-2 bg-white shadow-2xl overflow-hidden"
            style={{ borderRadius: 16 }}
          >
            <Image
              src={zoomImage}
              alt="Planilha ampliada"
              width={2278}
              height={1100}
              quality={90}
              className="max-h-[85vh] max-w-[92vw] w-auto h-auto object-contain"
              style={{ borderRadius: 10 }}
              priority
            />
          </div>
        </div>
      )}
    </Section>
  );
}



