"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { NAV, SLOGAN, CTA, CHECKOUT } from "@/lib/content";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Header refinado com base no feedback do Pencil:
 * 1. Nav mais fina: h:88px em desktop.
 * 2. Caixa da Logo ajustada: w:408px (remove o excesso de espaçamento na direita).
 * 3. 4 Botões Principais: Como funciona, Recursos, Preço, FAQ.
 * 4. Alinhamento dos Nomes dos Botões: alinhados à esquerda (pl-8) exatamente como no Pencil.
 */
export function SiteHeader() {
  const root = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState<string | null>(null);
  const [aberto, setAberto] = useState(false);

  useGSAP(
    () => {
      const gs: ScrollTrigger[] = [];
      NAV.forEach((item) => {
        const alvo = document.getElementById(item.id);
        if (!alvo) return;
        gs.push(
          ScrollTrigger.create({
            trigger: alvo,
            start: "top 40%",
            end: "bottom 40%",
            onToggle: (self) => self.isActive && setAtivo(item.id),
          }),
        );
      });
      return () => gs.forEach((g) => g.kill());
    },
    { scope: root },
  );

  return (
    <header
      ref={root}
      className="fixed inset-x-0 top-0 z-50 bg-[#09090a]"
      style={{ borderBottom: "1px solid #212124" }}
    >
      {/* ── Linha principal (72px de altura no desktop - nav mais fina) ── */}
      <div className="flex h-[56px] items-stretch sm:h-[64px] lg:h-[72px]">

        {/* ── Container Logo + Slogan (w:408px no desktop, removendo o espaço excessivo à direita) ── */}
        <a
          href="#topo"
          aria-label="Ficha Técnica Pro"
          className="relative flex shrink-0 items-stretch pl-5 pr-6 sm:pl-8 lg:w-[408px] lg:px-0"
        >
          {/* Responsivo (mobile/tablet) */}
          <div className="flex flex-col justify-center gap-0 lg:hidden">
            <Image
              src="/images/logo-ftp.png"
              alt="Ficha Técnica Pro"
              width={944}
              height={100}
              priority
              className="block h-auto w-[140px] sm:w-[176px]"
            />
          </div>

          {/* Desktop (lg): Logo 302×32px (left:65px top:16px) e Slogan (left:64px top:48px) */}
          <div className="hidden lg:block lg:w-full lg:h-full lg:relative">
            <div
              className="absolute left-[65px] top-[10px] w-[302px] h-[32px]"
              style={{
                backgroundImage: "url('/images/logo-ftp.png')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            />
            <div
              className="absolute left-[64px] top-[40px] text-[16px] font-semibold text-[#dbdbdb] whitespace-nowrap"
              style={{
                fontFamily: "Manrope, system-ui, sans-serif",
                lineHeight: "normal",
              }}
            >
              {SLOGAN}
            </div>
          </div>
        </a>

        {/* ── Nav desktop: 4 botões principais com texto ALINHADO À ESQUERDA (pl-8) ── */}
        <nav aria-label="Seções" className="hidden flex-1 items-stretch lg:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={ativo === item.id ? "true" : undefined}
              className={cn(
                "relative flex flex-1 items-center justify-start pl-8 text-left transition-colors duration-150 whitespace-nowrap",
                ativo === item.id ? "text-[#f5f4f2]" : "text-[#A3A3A3] hover:text-[#dbdbdb]",
              )}
              style={{
                borderLeft: "1px solid #212124",
                fontFamily: "Manrope, system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              {item.label}
              {/* Underline 3px #ff4785 na base da célula ativa */}
              {ativo === item.id && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 bg-[#ff4785]"
                  style={{ height: "3px" }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* ── Espaçador mobile ── */}
        <div className="flex-1 lg:hidden" />

        {/* ── Hambúrguer (mobile/tablet) ── */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          className="flex shrink-0 items-center gap-2.5 px-4 text-[0.8125rem] font-semibold text-[#dbdbdb] uppercase tracking-wider sm:px-5 lg:hidden"
        >
          <span className="flex flex-col gap-[4px]">
            <span className={cn("block h-[2px] w-4 bg-current transition-transform", aberto && "translate-y-[6px] rotate-45")} />
            <span className={cn("block h-[2px] w-4 bg-current transition-opacity",   aberto && "opacity-0")} />
            <span className={cn("block h-[2px] w-4 bg-current transition-transform", aberto && "-translate-y-[6px] -rotate-45")} />
          </span>
          <span className="hidden sm:inline">Menu</span>
        </button>

        {/* ── CTA: Largura de 304px no desktop, bg #FF4784, texto 19px bold ── */}
        <a
          href={CHECKOUT}
          className="flex shrink-0 items-center justify-center bg-[#FF4784] px-6 text-white transition-colors duration-150 hover:bg-[#e02e6b] lg:w-[304px] lg:px-0"
          style={{ borderLeft: "1px solid #212124" }}
        >
          <span
            className="lg:hidden font-bold text-[15px]"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            Comprar
          </span>
          <span
            className="hidden lg:inline font-bold text-[19px] whitespace-nowrap"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            {CTA.header.l2}
          </span>
        </a>
      </div>

      {/* ── Menu Mobile ── */}
      {aberto && (
        <nav
          aria-label="Seções"
          className="bg-[#09090a] lg:hidden"
          style={{ borderTop: "1px solid #212124" }}
        >
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setAberto(false)}
              className="block py-4 pl-5 text-[1.0625rem] font-semibold text-[#dbdbdb] sm:pl-8"
              style={{ borderBottom: "1px solid #212124" }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
