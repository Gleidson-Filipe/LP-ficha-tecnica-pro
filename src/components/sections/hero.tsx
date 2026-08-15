"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CHECKOUT } from "@/lib/content";

gsap.registerPlugin(useGSAP);

/**
 * Hero 100% alinhado ao Header de 88px e ao Pencil (teste1.html):
 *
 * 1. Frame Container: lg:h-[847px] com overflow-hidden.
 * 2. Painel Cinza do Mockup: left: 949px, top: 139px, w: 971px, bottom: 0.
 * 3. Mockup do Notebook: left: 751px, bottom: 0, w: 1311px, h: 668px.
 * 4. Headline: left: 64px, top: 203px, w: 755px (font Archivo 90px/99px bold #F5F4F2).
 * 5. Subtítulo: left: 64px, top: 614px, w: 742px (font Manrope 25px/38px #ababab).
 * 6. CTA Hero: left: 64px, top: 716px, w: 584px, h: 70px (bg #FF4784).
 * 7. Divisórias verticais em 63px, 408px, 818px, 1217px, 1643px iniciam exatamente em top: 88px, encostando na base do header.
 */
export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".hero-fade",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }
        )
        .fromTo(
          ".hero-mockup",
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.8 },
          "-=0.4"
        );
    },
    { scope: root }
  );

  return (
    <section id="topo" className="relative w-full bg-[#09090a] text-[#F5F4F2]">
      {/* ── Frame (w:1920px h:847px com overflow-hidden) ── */}
      <div
        ref={root}
        className="relative mx-auto w-full max-w-[1920px] h-auto lg:h-[calc(100vh-113px)] lg:min-h-[760px] overflow-hidden bg-[#09090a]"
      >
        {/* ── Painel Cinza do Mockup (left:949px top:139px w:971px terminando na borda inferior) ── */}
        <div
          className="hidden lg:block absolute left-[949px] top-[72px] w-[971px] bottom-0 bg-[#0d0d0f]"
          style={{ border: "1px solid #212124", borderBottom: "none" }}
        />

        {/* ── Divisórias Verticais Encostando na base do Header (top: 88px) ── */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
          <div className="absolute left-[63px] top-[72px] w-[1px] h-[calc(100vh-185px)] min-h-[688px] bg-[#212124]" />
          <div className="absolute left-[408px] top-[72px] w-[1px] h-[calc(100vh-185px)] min-h-[688px] bg-[#212124]" />
          <div className="absolute left-[818px] top-[72px] w-[1px] h-[calc(100vh-185px)] min-h-[688px] bg-[#212124]" />
          <div className="absolute left-[1217px] top-[72px] w-[1px] h-[calc(100vh-185px)] min-h-[688px] bg-[#212124]" />
          <div className="absolute left-[1643px] top-[72px] w-[1px] h-[calc(100vh-185px)] min-h-[688px] bg-[#212124]" />
        </div>

        {/* ── Conteúdo Textual (Headline + Sub + CTA) ── */}
        <div className="relative z-20 px-6 pt-[108px] pb-12 lg:px-0 lg:pt-0 lg:pb-0">
          {/* Headline exata de teste1.html (left:64px top:203px w:755px) */}
          <h1
            className="hero-fade font-bold tracking-[-0.6px] text-left text-[#F5F4F2] text-[2.5rem] leading-[1.1] lg:absolute lg:left-[64px] lg:top-[136px] lg:w-[755px] lg:text-[90px] lg:leading-[99px]"
            style={{ fontFamily: "Archivo, system-ui, sans-serif" }}
          >
            Descubra o custo real e o lucro de cada ítem do seu cardápio.
          </h1>

          {/* Subtítulo exato de teste1.html (left:64px top:614px w:742px) */}
          <p
            className="hero-fade mt-6 text-[#ababab] text-lg lg:mt-0 lg:absolute lg:left-[64px] lg:top-[547px] lg:w-[742px] lg:text-[25px] lg:leading-[38px]"
            style={{ fontFamily: "Manrope, system-ui, sans-serif", fontWeight: 400 }}
          >
            Tenha preços que geram lucro e não apenas faturamento.
          </p>

          {/* Botão CTA exato de teste1.html (left:64px top:716px w:584px h:70px) */}
          <a
            href={CHECKOUT}
            className="hero-fade mt-8 inline-flex items-center justify-center gap-1.5 bg-[#FF4784] px-6 py-4 text-white transition-colors duration-150 hover:bg-[#e02e6b] lg:mt-0 lg:absolute lg:left-[64px] lg:top-[649px] lg:w-[584px] lg:h-[70px] lg:px-0 lg:py-0 lg:justify-center"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            <span className="text-[17px] lg:text-[20px] font-medium whitespace-nowrap">
              Quero saber meu custo real e
            </span>
            <span className="text-[19px] lg:text-[25px] font-bold whitespace-nowrap">
              precificar certo
            </span>
          </a>
        </div>

        {/* ── Imagem do Mockup (Encostando na borda inferior) ── */}
        <div className="hero-mockup relative z-20 mt-8 px-4 lg:mt-0 lg:px-0 lg:absolute lg:left-[751px] lg:bottom-0 lg:top-auto lg:w-[1311px] lg:h-[668px] pointer-events-none flex items-end">
          <Image
            src="/images/mockup-hero.png"
            alt="Planilha Ficha Técnica Pro"
            width={5471}
            height={2856}
            priority
            className="w-full h-auto object-contain object-bottom block lg:w-[1311px] lg:h-[668px]"
          />
        </div>
      </div>

      {/* ── Faixa de Reforços / Stats na Base ── */}
      <div
        className="relative z-20 w-full max-w-[1920px] mx-auto border-t border-[#212124] grid grid-cols-1 md:grid-cols-3 text-[#F5F4F2]"
        style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
      >
        <div className="border-b border-[#212124] md:border-b-0 md:border-r border-[#212124] px-6 py-8 lg:pl-[64px] lg:py-6">
          <p className="text-[28px] font-bold leading-none lg:text-[32px]">+25 mil</p>
          <p className="mt-2 text-[#ababab] text-[16px]">Negócios atendidos</p>
        </div>

        <div className="border-b border-[#212124] md:border-b-0 md:border-r border-[#212124] px-6 py-8 lg:px-10 lg:py-6">
          <p className="text-[28px] font-bold leading-none lg:text-[32px]">Pagamento único</p>
          <p className="mt-2 text-[#ababab] text-[16px]">Sem mensalidade</p>
        </div>

        <div className="px-6 py-8 lg:px-10 lg:py-6">
          <p className="text-[28px] font-bold leading-none lg:text-[32px]">Acesso vitalício</p>
          <p className="mt-2 text-[#ababab] text-[16px]">Atualizações incluídas</p>
        </div>
      </div>
    </section>
  );
}
