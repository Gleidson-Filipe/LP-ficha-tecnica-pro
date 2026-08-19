"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { calculo as c } from "@/lib/content";
import { Section } from "@/components/ui/kit";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

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
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Transição GSAP suave ao clicar nas etapas
  useGSAP(
    () => {
      steps.forEach((_, idx) => {
        const el = imgRefs.current[idx];
        if (!el) return;

        if (activeIdx === idx) {
          gsap.to(el, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
            pointerEvents: "auto",
          });
        } else {
          gsap.to(el, {
            opacity: 0,
            scale: 0.96,
            y: 10,
            duration: 0.25,
            ease: "power2.in",
            pointerEvents: "none",
          });
        }
      });
    },
    { dependencies: [activeIdx], scope: sectionRef }
  );

  return (
    <Section
      ref={sectionRef}
      id="calculo"
      tone="paper"
      className="rule-t relative overflow-hidden py-14 md:py-20 lg:py-24"
    >
      {/* ── Cabeçalho Centralizado ── */}
      <div className="pad mb-12 md:mb-16 text-center flex flex-col items-center">
        <p className="flex items-center gap-3 text-label uppercase text-accent justify-center">
          <span aria-hidden className="inline-block h-[2px] w-7 bg-accent" />
          <WhipInUp text={c.label} />
          <span aria-hidden className="inline-block h-[2px] w-7 bg-accent" />
        </p>
        <h2 className="mt-4 max-w-[28ch] font-display text-h2 text-balance text-center">
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
              onClick={() => setActiveIdx((prev) => (prev === idx ? null : idx))}
              className={cn(
                "group relative w-full rule-b transition-all duration-300 ease-out cursor-pointer overflow-hidden select-none",
                isActive
                  ? "bg-paper-panel/35 py-6 sm:py-7 lg:py-8"
                  : "bg-transparent hover:bg-paper-panel/15 py-4 sm:py-5 lg:py-5.5"
              )}
            >
              <div className="pad relative grid gap-6 lg:grid-cols-[1fr_1.4fr] xl:grid-cols-[0.9fr_1.5fr] lg:items-start">
                {/* Coluna da Esquerda: Apenas o Título quando fechado, e Textos quando aberto */}
                <div className="flex flex-col justify-start pt-0.5 lg:pt-1 pr-14 lg:pr-10">
                  <h3
                    className={cn(
                      "font-display text-xl sm:text-2xl lg:text-[1.85rem] font-bold tracking-tight transition-colors duration-300",
                      isActive ? "text-on-paper" : "text-on-paper/75 group-hover:text-on-paper"
                    )}
                  >
                    {step.titulo}
                  </h3>

                  {/* Textos explicativos e checkmarks visíveis EXCLUSIVAMENTE quando o retângulo estiver ABERTO */}
                  {isActive && (
                    <div className="mt-3 animate-in fade-in duration-300">
                      <p className="text-[0.9375rem] md:text-body text-on-paper-soft leading-relaxed max-w-[44ch]">
                        {step.texto}
                      </p>

                      {/* Lista de Checkmarks para a etapa 06 */}
                      {step.checks && (
                        <ul className="mt-3.5 space-y-1.5 text-[0.875rem] font-medium text-on-paper">
                          {step.checks.map((ck) => (
                            <li key={ck} className="flex items-center gap-2">
                              <span className="text-accent font-bold text-sm">✔</span>
                              <span>{ck}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Seta diagonal Phosphor (Thin) quando o retângulo estiver FECHADO */}
                {!isActive && (
                  <div className="absolute right-6 sm:right-10 md:right-14 lg:right-16 xl:right-20 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
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

                {/* Coluna da Direita: Accordion que expande ao clicar com imagem maior e clique para Zoom */}
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
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
                      className="group/img relative inline-flex w-fit max-w-full max-h-[300px] sm:max-h-[340px] md:max-h-[380px] lg:max-h-[420px] cursor-zoom-in rounded-xl"
                    >
                      <Image
                        src={step.image}
                        alt={`Etapa - ${step.titulo}`}
                        width={step.w}
                        height={step.h}
                        sizes="(max-width: 1024px) 95vw, 50vw"
                        quality={90}
                        className="max-h-[300px] sm:max-h-[340px] md:max-h-[380px] lg:max-h-[415px] w-auto max-w-full object-contain rounded-xl shadow-md transition-transform duration-300 group-hover/img:scale-[1.015]"
                      />

                      {/* Badge sutil de Zoom no canto exato da imagem */}
                      <span className="absolute bottom-2.5 right-2.5 rounded-md bg-ink/70 backdrop-blur-sm px-2 py-1 text-[11px] font-medium text-white opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none flex items-center gap-1 shadow-sm">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                        Ampliar
                      </span>
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
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 cursor-zoom-out animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setZoomImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-full bg-white/15 hover:bg-white/30 text-white w-10 h-10 flex items-center justify-center transition-colors text-lg font-bold"
            aria-label="Fechar ampliação"
          >
            ✕
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-[95vw] flex items-center justify-center p-2 rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            <Image
              src={zoomImage}
              alt="Planilha ampliada"
              width={2278}
              height={1100}
              quality={90}
              className="max-h-[85vh] max-w-[92vw] w-auto h-auto object-contain rounded-xl"
              priority
            />
          </div>
        </div>
      )}
    </Section>
  );
}



