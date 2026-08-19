"use client";

import Image from "next/image";
import { rodape, INSTAGRAM, SLOGAN, CHECKOUT } from "@/lib/content";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { useCtaFx, useCrookedIn, CtaGlow, CtaShine, CtaEcho } from "@/components/ui/cta-fx";

export function SiteFooter() {
  const ctaFx = useCtaFx<HTMLAnchorElement>();
  useCrookedIn(ctaFx);
  return (
    <footer className="t-ink bg-ink rule-t">
      {/* ── Bloco Superior: CTA com Linhas Verticais Restritas ── */}
      <div className="relative overflow-hidden">
        {/* Linhas Verticais Arquiteturais no Fundo (APENAS na parte de cima) */}
        <div
          aria-hidden
          className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 pointer-events-none divide-x divide-white/[0.04] border-x border-white/[0.04]"
        >
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>

        {/* Conteúdo Centralizado do CTA */}
        <div className="relative pad py-20 sm:py-24 md:py-28 lg:py-32 flex flex-col items-center justify-center text-center">
          {/* Título Principal */}
          <h2 className="font-display text-[2.25rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] font-bold text-white leading-[1.06] tracking-tight max-w-[18ch] mx-auto text-balance">
            <span className="block">
              <WhipInUp text={rodape.tituloLinha1} />
            </span>
            <span className="block">
              <WhipInUp text={rodape.tituloLinha2} />
            </span>
          </h2>

          {/* Copy Descritiva */}
          <p className="mt-6 sm:mt-7 text-sm sm:text-base md:text-lg text-on-ink-soft leading-relaxed max-w-[56ch] mx-auto font-sans">
            <WhipInUp text={rodape.texto} />
          </p>

          {/* Botão de Ação (CTA) */}
          <div className="mt-8 sm:mt-10">
            <a
              ref={ctaFx}
              href={CHECKOUT}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center overflow-hidden cta-btn-fluid text-white font-body py-4.5 px-8 sm:px-12 text-center"
              style={{ opacity: 0, transform: "translate(22px, 26px) rotate(6deg)" }}
            >
              <CtaGlow />
              <CtaShine />
              <CtaEcho className="items-center whitespace-nowrap">
                <span className="font-body font-bold text-[16px] sm:text-[18px] lg:text-[20px] whitespace-nowrap text-white">
                  <WhipInUp text="Quero saber meu custo real e precificar certo" />
                </span>
              </CtaEcho>
            </a>
          </div>
        </div>
      </div>

      {/* ── Linha Horizontal Divisória ── */}
      <div className="border-t border-white/10 w-full" />

      {/* ── Barra Inferior: Logo Image + Slogan Claro | GF Instagram Pill | Copyright ── */}
      <div className="relative pad py-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4">
        {/* Bloco Esquerda: Logo Image + Slogan com mesma largura + Pill GF */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10">
          {/* Logo Imagem + Slogan Claro perfeitamente pareados */}
          <div className="flex flex-col items-center sm:items-start w-[210px]">
            <Image
              src="/images/logo-ftp.png"
              alt="Ficha Técnica Pro"
              width={944}
              height={100}
              sizes="210px"
              className="w-[210px] h-auto object-contain block"
            />
            <p className="text-[12.2px] font-medium text-[#f5f4ea] font-sans -ml-[1px] whitespace-nowrap mt-1 text-center sm:text-left">
              {SLOGAN}
            </p>
          </div>

          {/* GF Link Pill com Logo GFD e Ícone Colorido Oficial do Instagram */}
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            style={{ borderRadius: "9999px" }}
            className="inline-flex items-center gap-3.5 px-5 py-2.5 bg-white/[0.04] border border-white/15 hover:bg-white/[0.08] hover:border-white/30 transition-all text-xs sm:text-sm text-white group shrink-0"
            aria-label="Siga Gestão Financeira Digital no Instagram"
          >
            <Image
              src="/images/logo-gfd.png"
              alt={rodape.empresa}
              width={3036}
              height={1718}
              sizes="42px"
              className="h-5 sm:h-6 w-auto object-contain shrink-0 opacity-95 group-hover:opacity-100 transition-opacity"
            />
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="w-4 h-4 shrink-0"
              >
                <defs>
                  <linearGradient id="insta-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="10%" stopColor="#fdf497" />
                    <stop offset="50%" stopColor="#fd5949" />
                    <stop offset="70%" stopColor="#d6249f" />
                    <stop offset="100%" stopColor="#285AEB" />
                  </linearGradient>
                </defs>
                <rect
                  x="32"
                  y="32"
                  width="192"
                  height="192"
                  rx="48"
                  fill="none"
                  stroke="url(#insta-grad)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="20"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="40"
                  fill="none"
                  stroke="url(#insta-grad)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="20"
                />
                <circle cx="180" cy="76" r="14" fill="url(#insta-grad)" />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                Siga no Instagram
              </span>
            </div>
          </a>
        </div>

        {/* Bloco Direita: Copyright */}
        <p className="text-xs sm:text-sm text-on-ink-soft text-center lg:text-right whitespace-nowrap">
          {rodape.copyright}
        </p>
      </div>
    </footer>
  );
}
