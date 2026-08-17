"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { modulos } from "@/lib/content";
import { Section, Label } from "@/components/ui/kit";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/**
 * Modulos: Showcase amplo com transição fluida via GSAP.
 * Sem quadros cinzas, sem vazamento ou sobreposição entre imagens de tamanhos diferentes,
 * com imagens grandes centralizadas que ocupam toda a altura da seção.
 */
export function Modulos() {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageStageRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const items = modulos.items;
  const total = items.length;
  const activeItem = items[activeIdx] || items[0];

  // Transição suave, nítida e cinematográfica usando GSAP (0.8s)
  useGSAP(
    () => {
      const stage = imageStageRef.current;
      if (!stage) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        stage,
        { opacity: 0, scale: 0.98, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    },
    { dependencies: [activeIdx] }
  );

  // Autoplay pausado e confortável (14s por módulo)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isInteracting.current) return;
      setActiveIdx((prev) => (prev + 1) % total);
    }, 14000);

    return () => clearInterval(interval);
  }, [total]);

  const setManualIdx = (idx: number) => {
    isInteracting.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      isInteracting.current = false;
    }, 20000);

    setActiveIdx(idx);
  };

  const go = (dir: 1 | -1) => {
    const next = Math.min(total - 1, Math.max(0, activeIdx + dir));
    setManualIdx(next);
  };

  const isEquilibrio = activeItem.tab === "Equilíbrio";

  return (
    <Section
      id="modulos"
      tone="ink"
      className="rule-t relative overflow-hidden flex flex-col justify-center min-h-[620px] lg:min-h-[660px] py-8 lg:py-10"
      ref={containerRef}
    >
      <div className="pad w-full">
        {/* Layout de 2 Colunas: Esquerda (Header no topo + Info embaixo) | Direita (Imagem gigante ocupando toda a altura) */}
        <div className="grid gap-8 lg:grid-cols-[360px_1fr] xl:grid-cols-[400px_1fr] items-stretch lg:gap-10 xl:gap-14">
          {/* Coluna da Esquerda: Header no topo e Módulo Info na base */}
          <div className="flex flex-col justify-between py-1 min-h-[440px] lg:min-h-[560px]">
            {/* Topo: Cabeçalho da Seção */}
            <div>
              <Label>{modulos.label}</Label>
              <h2 className="mt-2.5 max-w-[15ch] font-display text-h2 leading-tight">
                <WhipInUp text={modulos.title} />
              </h2>
            </div>

            {/* Base: Informações do Módulo Ativo e Controles */}
            <div className="pt-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-accent mb-2 block">
                Módulo {String(activeIdx + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl lg:text-[1.75rem] font-bold text-white tracking-tight leading-snug">
                {activeItem.titulo}
              </h3>
              <p className="mt-2.5 text-body text-on-ink-soft leading-relaxed max-w-[36ch]">
                {activeItem.texto}
              </p>

              {/* Controles e Stepper */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    disabled={activeIdx === 0}
                    aria-label="Módulo anterior"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm text-white transition-all hover:border-accent hover:text-accent disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    disabled={activeIdx === total - 1}
                    aria-label="Próximo módulo"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-accent bg-accent text-sm text-white transition-all hover:bg-accent-deep disabled:opacity-25 disabled:border-white/20 disabled:bg-transparent disabled:text-white cursor-pointer disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {items.map((it, idx) => (
                    <button
                      key={it.tab}
                      type="button"
                      onClick={() => setManualIdx(idx)}
                      aria-label={`Ir para módulo ${it.tab}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                        idx === activeIdx
                          ? "w-7 bg-accent"
                          : idx < activeIdx
                          ? "w-2.5 bg-accent/40 hover:bg-accent/70"
                          : "w-2.5 bg-white/20 hover:bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Imagem Ocupando Toda a Altura da Seção até o Nível do Título */}
          <div className="relative flex h-[380px] sm:h-[460px] md:h-[520px] lg:h-[560px] xl:h-[600px] w-full items-center justify-center overflow-hidden">
            <div
              ref={imageStageRef}
              className="relative flex h-full w-full items-center justify-center select-none"
            >
              <Image
                key={activeItem.image}
                src={activeItem.image}
                alt={`Módulo ${activeItem.tab} - ${activeItem.titulo}`}
                width={activeItem.w}
                height={activeItem.h}
                sizes="(max-width: 1024px) 100vw, 70vw"
                className={cn(
                  "max-h-full max-w-full w-auto h-auto object-contain rounded-xl drop-shadow-2xl transition-transform duration-300",
                  isEquilibrio && "scale-[1.28] sm:scale-[1.34] md:scale-[1.4] lg:scale-[1.46] xl:scale-[1.52]"
                )}
                style={{ borderRadius: 12 }}
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}







