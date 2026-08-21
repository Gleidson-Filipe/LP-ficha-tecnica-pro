"use client";

import Image, { type StaticImageData } from "next/image";
import { createPortal } from "react-dom";
import { useRef, useState, useEffect, useSyncExternalStore } from "react";
import { modulos } from "@/lib/content";
import { Section } from "@/components/ui/kit";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { cn } from "@/lib/utils";
import cardapioImg from "../../../public/images/modulos/gestor_lucro_cardapio.webp";
import despesasImg from "../../../public/images/modulos/controle_despesas.webp";
import maodeobraImg from "../../../public/images/modulos/custo_maodeobra.webp";
import combosImg from "../../../public/images/modulos/calc_combos.webp";
import precificarImg from "../../../public/images/modulos/modulo_precificar.webp";
import equilibrioImg from "../../../public/images/modulos/pontodeequilibrio.webp";

const MODULO_IMAGES: Record<string, StaticImageData> = {
  Cardápio: cardapioImg,
  Despesas: despesasImg,
  "Mão de obra": maodeobraImg,
  Combos: combosImg,
  Precificar: precificarImg,
  Equilíbrio: equilibrioImg,
};

/**
 * Modulos – Carousel de módulos integrado com lightbox zoom.
 *
 * Estrutura:
 *  - Todos os slides permanecem no DOM simultaneamente com key={item.tab} (estável).
 *  - Transições suaves de opacidade entre slides (sem remontar DOM, zero layout shift).
 *  - Hover zoom proporcional e consistente em todos os módulos (inclusivo Equilíbrio).
 *  - Lightbox ampliado renderizado via createPortal(document.body) com dimensionamento
 *    responsivo generoso (tanto para imagens panorâmicas quanto quadradas/verticais).
 */
import { isNavJumping, deferDuringNavJump, cancelDeferred } from "@/lib/nav-jump";

const emptySubscribe = () => () => {};

export function Modulos() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomImage, setZoomImage] = useState<StaticImageData | string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Cada módulo (eyebrow/título/texto) anima só na PRIMEIRA vez que fica
  // ativo — revisitar um módulo já visto mostra o texto direto, sem
  // re-animar. Não dá pra só trocar o `text` prop do WhipInUp já montado:
  // ele manipula o DOM diretamente (splitWord/revertWord) por fora do
  // React, e trocar o texto depois disso dessincroniza a árvore do React
  // da árvore real. Por isso o gate troca de RAMO (WhipInUp vs texto puro)
  // em vez de só trocar o texto — cada ramo é uma montagem limpa.
  //
  // Precisa ser state (não ref): ler ref durante o render é proibido pelas
  // regras do React (react-hooks/refs) — o valor pode não refletir o que
  // foi commitado. E marca o módulo que está SAINDO, nunca o que está
  // entrando: se marcasse o que acabou de entrar, o re-render disparado
  // pelo próprio setState desmontaria o WhipInUp antes dele conseguir
  // animar.
  const [animatedTabs, setAnimatedTabs] = useState<Set<string>>(new Set());
  const markSeen = (tab: string) =>
    setAnimatedTabs((prev) => (prev.has(tab) ? prev : new Set(prev).add(tab)));
  // Espelha o tab ativo sem entrar nas deps do intervalo do autoplay (que
  // não pode reiniciar a cada troca, senão o ciclo de 14s nunca fecha).
  const activeTabRef = useRef("");

  const items = modulos.items;
  const total = items.length;
  const activeItem = items[activeIdx] || items[0];

  const activeZoomItem = items.find((it) => it.image === zoomImage) || activeItem;
  const ratio = activeZoomItem.w / activeZoomItem.h;
  const isCardapio = activeZoomItem.tab === "Cardápio";
  const isEquilibrio = activeZoomItem.tab === "Equilíbrio";
  const isPrecificar = activeZoomItem.tab === "Precificar";
  const maxW =
    isCardapio
      ? 1600
      : isEquilibrio
      ? 980
      : isPrecificar
      ? 880
      : 1480;
  const maxH = isCardapio ? "86.5vh" : isEquilibrio ? "74vh" : "84vh";
  const maxVw = isCardapio ? "95.5vw" : isEquilibrio ? "88vw" : "94vw";

  useEffect(() => {
    activeTabRef.current = activeItem.tab;
  }, [activeItem.tab]);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (isNavJumping() && e.isIntersecting) {
          deferDuringNavJump(el, () => {
            obs.unobserve(el);
            obs.observe(el);
          });
          return;
        }
        setIsInView(e.isIntersecting);
      },
      { rootMargin: "150px 0px" }
    );
    obs.observe(el);
    return () => {
      cancelDeferred(el);
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const iv = setInterval(() => {
      if (isInteracting.current || zoomImage) return;
      markSeen(activeTabRef.current);
      setActiveIdx((p) => (p + 1) % total);
    }, 14000);
    return () => clearInterval(iv);
  }, [isInView, total, zoomImage]);

  const setManualIdx = (idx: number) => {
    isInteracting.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { isInteracting.current = false; }, 20000);
    markSeen(activeTabRef.current);
    setActiveIdx(idx);
  };

  const go = (dir: 1 | -1) =>
    setManualIdx(Math.min(total - 1, Math.max(0, activeIdx + dir)));

  return (
    <>
      <Section
        id="modulos"
        tone="ink"
        className="rule-t relative overflow-hidden flex flex-col justify-center min-h-[40rem] lg:min-h-[44rem] min-[120.0625rem]:min-h-[48rem] py-8 lg:py-12 w-full"
        ref={containerRef}
      >
        <div className="pad w-full min-[120.0625rem]:px-0">
          <div className="w-full grid gap-8 lg:grid-cols-[22.5rem_1fr] xl:grid-cols-[25rem_1fr] items-start lg:gap-10 xl:gap-14 min-[120.0625rem]:max-w-[120rem] min-[120.0625rem]:mx-auto min-[120.0625rem]:pl-[4rem] min-[120.0625rem]:pr-0">

            {/* ── Coluna Esquerda ── */}
            <div className="flex flex-col justify-between py-1 min-h-[28rem] lg:min-h-[35rem] min-[120.0625rem]:min-h-[38rem]">
              <div>
                <h2 className="max-w-[15ch] font-display text-h2 leading-tight">
                  <WhipInUp text={modulos.title} />
                </h2>
              </div>

              <div className="pt-6">
                {(() => {
                  const jaVisto = animatedTabs.has(activeItem.tab);
                  const eyebrowText = `Módulo ${String(activeIdx + 1).padStart(2, "0")}`;
                  return (
                    <>
                      <span className="text-xs uppercase tracking-wider font-semibold text-accent mb-2 block">
                        {jaVisto ? eyebrowText : <WhipInUp key={activeItem.tab} text={eyebrowText} />}
                      </span>
                      <h3 className="font-display text-2xl lg:text-[1.75rem] font-bold text-white tracking-tight leading-snug">
                        {jaVisto ? activeItem.titulo : <WhipInUp key={activeItem.tab} text={activeItem.titulo} />}
                      </h3>
                      <p className="mt-2.5 text-body text-on-ink-soft leading-relaxed max-w-[36ch]">
                        {jaVisto ? activeItem.texto : <WhipInUp key={activeItem.tab} text={activeItem.texto} />}
                      </p>
                    </>
                  );
                })()}

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      disabled={activeIdx === 0}
                      aria-label="Módulo anterior"
                      className="peer flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm text-white transition-all hover:border-accent hover:bg-accent disabled:opacity-25 disabled:hover:border-white/20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      disabled={activeIdx === total - 1}
                      aria-label="Próximo módulo"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-accent bg-accent text-sm text-white transition-all hover:bg-accent-deep peer-hover:border-white/20 peer-hover:bg-transparent disabled:opacity-25 disabled:border-white/20 disabled:bg-transparent disabled:text-white cursor-pointer disabled:cursor-not-allowed"
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

            {/* ── Coluna Direita ── */}
            <div
              className="modulos-img-frame group/img relative w-full flex items-center justify-center overflow-hidden rounded-xl cursor-zoom-in"
              onClick={() => setZoomImage(MODULO_IMAGES[activeItem.tab] || activeItem.image)}
              title="Clique para ampliar a imagem"
            >
              {items.map((item, idx) => {
                const isActive = idx === activeIdx;
                const staticSrc = MODULO_IMAGES[item.tab] || item.image;
                return (
                  <div
                    key={item.tab}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center p-3 sm:p-4 transition-opacity duration-350 ease-in-out",
                      isActive
                        ? "opacity-100 pointer-events-auto z-10"
                        : "opacity-0 pointer-events-none z-0"
                    )}
                  >
                    <Image
                      src={staticSrc}
                      alt={`Módulo ${item.tab} — ${item.titulo}`}
                      width={item.w}
                      height={item.h}
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      quality={100}
                      className={cn(
                        "max-h-full max-w-full w-auto h-auto object-contain drop-shadow-2xl rounded-xl",
                        "transition-transform duration-300 ease-out origin-center",
                        "scale-100 group-hover/img:scale-[1.03]"
                      )}
                      style={{ borderRadius: 12 }}
                    />
                  </div>
                );
              })}

              {/* Badge Ampliar */}
              <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 rounded-md bg-ink/75 backdrop-blur-sm px-2.5 py-1.5 text-xs font-medium text-white opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5 shadow-lg border border-white/10">
                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                Ampliar
              </span>
            </div>

          </div>
        </div>
      </Section>

      {/* ── Modal Lightbox Ampliado via Portal ── */}
      {mounted && zoomImage && createPortal(
        <div
          onClick={() => setZoomImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            cursor: "zoom-out",
            animation: "lbFadeIn 0.2s ease-out both",
          }}
        >
          <style>{`@keyframes lbFadeIn { from { opacity:0 } to { opacity:1 } }`}</style>
          <button
            type="button"
            onClick={() => setZoomImage(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 10,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              cursor: "pointer",
            }}
            aria-label="Fechar ampliação"
          >
            ✕
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 16,
              padding: 6,
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={zoomImage}
              alt={`Módulo ${activeZoomItem.tab} ampliado`}
              quality={100}
              style={{
                width: `min(${maxVw}, ${maxW}px, calc(${maxH} * ${ratio.toFixed(4)}))`,
                height: "auto",
                aspectRatio: `${activeZoomItem.w} / ${activeZoomItem.h}`,
                objectFit: "contain",
                borderRadius: 10,
                display: "block",
              }}
              priority
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
