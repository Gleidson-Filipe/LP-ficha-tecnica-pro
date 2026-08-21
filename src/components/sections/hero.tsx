"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CHECKOUT } from "@/lib/content";
import { WhipInUp, CountUpStat } from "@/components/ui/whip-in-up";
import { Highlighter } from "@/components/magicui/highlighter";
import { useCtaFx, CtaGlow, CtaShine, CtaEcho } from "@/components/ui/cta-fx";
import { navigateToId } from "@/lib/smooth-scroll";
import { isNavJumping, deferDuringNavJump, cancelDeferred } from "@/lib/nav-jump";

gsap.registerPlugin(useGSAP);

/**
 * Hero 100% alinhado ao Header de 88px e ao Pencil (teste1.html):
 *
 * 1. Frame Container: lg:h-[847px] com overflow-hidden.
 * 2. Painel Cinza do Mockup: left: 949px, top: 139px, w: 971px, bottom: 0.
 * 3. Mockup do Notebook: left: 751px, bottom: 0, w: 1311px, h: 668px.
 * 4. Headline: left: 64px, top: 203px, w: 755px (font-display 90px/99px bold #F5F4F2).
 * 5. Subtítulo: left: 64px, top: 614px, w: 742px (font-body 25px/38px #ababab).
 * 6. CTA Hero: left: 64px, top: 716px, w: 584px, h: 70px (bg #FF4784).
 * 7. Divisórias verticais em 63px, 408px, 818px, 1217px, 1643px iniciam exatamente em top: 88px, encostando na base do header.
 */
export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const ctaFx = useCtaFx<HTMLAnchorElement>();

  useGSAP(
    () => {
      // O mockup (.hero-mockup) é o LCP da página e entra via @keyframes em
      // globals.css, não por aqui — ver comentário lá. Só o CTA continua
      // animado por JS (não é o LCP, e usa back.out, que exige overshoot
      // controlado por JS).
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".hero-fade", { clearProps: "transform,opacity" });
        return;
      }

      const el = root.current?.querySelector<HTMLElement>(".hero-fade");
      if (!el) return;

      // Estado inicial (opacity:0 + offset) já nasce no JSX via style inline —
      // evita o "flash" de aparecer pronto e só depois pular pra escondido.
      // Disparado por IntersectionObserver (não incondicional no mount):
      // sem isso, um reload com o Hero fora da tela (usuário já rolado pra
      // outra seção) tocava a animação inteira ali mesmo, invisível — ao
      // voltar pro Hero depois (ex.: clique na logo), o botão já chegava
      // pronto, sem "recarregar" a entrada. Mesmo padrão do WhipInUp/Reveal.
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          if (isNavJumping()) {
            deferDuringNavJump(el, () => {
              io.unobserve(el);
              io.observe(el);
            });
            return;
          }
          gsap.to(el, {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1.1,
            ease: "back.out(1.6)",
          });
          io.disconnect();
        },
        { rootMargin: "0px" },
      );
      io.observe(el);

      return () => {
        cancelDeferred(el);
        io.disconnect();
      };
    },
    { scope: root }
  );

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (CHECKOUT.startsWith("#")) {
      e.preventDefault();
      const id = CHECKOUT.slice(1);
      const target = document.getElementById(id);
      if (target) {
        navigateToId(id);
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    }
  };

  return (
    <section id="topo" className="relative w-full bg-[#09090a] text-[#F5F4F2]">
      {/* ── Container Superior do Hero (Termina estritamente ANTES da barra de stats) ── */}
      <div className="relative w-full overflow-hidden">
        {/* ── Opção 2: Ambiência de Estúdio Difusa + Vinheta Lateral (Ativa estritamente acima de 1920px) ── */}
        <div aria-hidden className="hidden min-[120.0625rem]:block wide-ambient-edge-left" />
        <div aria-hidden className="hidden min-[120.0625rem]:block wide-ambient-edge-right" />
        <div aria-hidden className="hidden min-[120.0625rem]:block wide-edge-vignette" />

        {/* ── Opção 1: Grid Arquitetural de Linhas Contínuas na Asa Esquerda (Ativa estritamente acima de 1920px) ── */}
        <div
          aria-hidden
          className="hidden min-[120.0625rem]:block absolute left-0 top-[4.5rem] bottom-0 pointer-events-none z-0 overflow-hidden"
          style={{
            right: "calc(50% + 60rem)",
            borderTop: "1px solid #212124",
            backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 4.5rem, #212124 4.5rem, #212124 calc(4.5rem + 1px))",
            opacity: 0.6,
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 40%, black 100%)",
          }}
        />

        {/* ── Opção 1: Painel Cinza Contínuo com Linhas na Asa Direita (Ativa estritamente acima de 1920px) ── */}
        <div
          aria-hidden
          className="hidden min-[120.0625rem]:block absolute right-0 top-[4.5rem] bottom-0 bg-[#0d0d0f] pointer-events-none z-0 overflow-hidden"
          style={{
            left: "calc(50% + 60rem - 60.6875rem)",
            borderTop: "1px solid #212124",
            borderLeft: "1px solid #212124",
          }}
        >
          <div
            className="hero-panel-lines absolute inset-0 pointer-events-none"
            style={{
              maskImage: "linear-gradient(to right, black 0%, black 60%, rgba(0,0,0,0.5) 80%, transparent 100%)",
            }}
          />
        </div>

        {/* ── Frame Central de 1920px (100% Intacto e Idêntico ao Aprovado) ── */}
        <div
          ref={root}
          className="relative mx-auto w-full max-w-[120rem] h-auto lg:h-[calc(100vh-7.0625rem)] lg:min-h-[47.5rem] overflow-visible bg-transparent z-10"
        >
          {/* ── Painel Cinza do Mockup no Centro ── */}
          <div
            className="hidden lg:block absolute left-[59.3125rem] top-[4.5rem] w-[60.6875rem] bottom-0 bg-[#0d0d0f] overflow-hidden"
            style={{
              borderTop: "1px solid #212124",
              borderLeft: "1px solid #212124",
            }}
          >
            <div
              aria-hidden
              className="hero-panel-lines absolute inset-0 pointer-events-none"
            />
          </div>

          {/* ── Divisórias Verticais Encostando na base do Header (top: 4.5rem) ── */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
            <div className="absolute left-[3.9375rem] top-[4.5rem] w-[1px] h-[calc(100vh-11.5625rem)] min-h-[43rem] bg-[#212124]" />
            <div className="absolute left-[25.5rem] top-[4.5rem] w-[1px] h-[calc(100vh-11.5625rem)] min-h-[43rem] bg-[#212124]" />
            <div className="absolute left-[51.125rem] top-[4.5rem] w-[1px] h-[calc(100vh-11.5625rem)] min-h-[43rem] bg-[#212124]" />
          </div>

          {/* ── Conteúdo Textual (Headline + Sub + CTA) ── */}
          <div className="relative z-20 px-6 pt-[6.75rem] pb-12 lg:px-0 lg:pt-0 lg:pb-0">
            {/* Headline exata em unidades relativas (left: 4rem, top: 8.5rem, w: 47.1875rem) */}
            <h1 className="font-display font-bold tracking-[-0.0375rem] text-left text-[#F5F4F2] text-[2.5rem] leading-[1.1] lg:absolute lg:left-[4rem] lg:top-[8.5rem] lg:w-[47.1875rem] lg:text-[5.625rem] lg:leading-[6.1875rem]">
              <WhipInUp text="Descubra o custo real e o lucro de" className="inline" eager />{" "}
              <Highlighter
                action="underline"
                color="#FF4785"
                strokeWidth={1.5}
                padding={2}
                delay={700}
                iterations={4}
                isView
              >
                <WhipInUp text="cada ítem" className="inline" eager />
              </Highlighter>{" "}
              <WhipInUp text="do seu cardápio." className="inline" eager />
            </h1>

            {/* Subtítulo exato em unidades relativas (left: 4rem, top: 34.1875rem, w: 46.375rem) */}
            <p className="font-body mt-6 text-[#ababab] text-lg font-normal lg:mt-0 lg:absolute lg:left-[4rem] lg:top-[34.1875rem] lg:w-[46.375rem] lg:text-[1.5625rem] lg:leading-[2.375rem]">
              <WhipInUp text="Tenha preços que geram lucro e não apenas faturamento." eager />
            </p>

            {/* Botão CTA exato em unidades relativas (left: 4rem, top: 40.5625rem, w: 36.5rem, h: 4.375rem) */}
            <a
              ref={ctaFx}
              href={CHECKOUT}
              onClick={handleCtaClick}
              className="hero-fade group relative font-body mt-8 inline-flex items-center justify-center gap-1.5 overflow-hidden cta-btn-fluid px-6 py-4 text-white lg:mt-0 lg:absolute lg:left-[4rem] lg:top-[40.5625rem] lg:w-[36.5rem] lg:h-[4.375rem] lg:px-0 lg:py-0 lg:justify-center"
              style={{ opacity: 0, transform: "translate(1.375rem, 1.625rem) rotate(6deg)" }}
            >
              <CtaGlow />
              <CtaShine />
              <CtaEcho className="items-center whitespace-nowrap text-white">
                <span className="font-bold text-[1.125rem] sm:text-[1.25rem] lg:text-[1.375rem] whitespace-nowrap text-white">
                  <WhipInUp text="Quero saber meu custo real e precificar certo" eager />
                </span>
              </CtaEcho>
            </a>
          </div>

          {/* ── Imagem do Mockup (Posição 100% FIXA em left: 43.1875rem, bottom: 0, com fading na borda direita em widescreen) ── */}
          <div className="hero-mockup hero-mockup-fade-wide relative z-20 mt-8 px-4 lg:mt-0 lg:px-0 lg:absolute lg:left-[43.1875rem] lg:bottom-0 lg:top-auto lg:w-[85.625rem] lg:h-[43.625rem] pointer-events-none flex items-end">
            <Image
              src="/images/mockup-hero.webp"
              alt="Planilha Ficha Técnica Pro"
              width={5423}
              height={2808}
              priority
              quality={90}
              sizes="(min-width: 64rem) 85.625rem, 100vw"
              className="w-full h-auto object-contain object-bottom block lg:w-[85.625rem] lg:h-[43.625rem]"
            />
          </div>
        </div>
      </div>

      {/* ── Faixa de Reforços / Stats na Base (100% Limpa e Independente) ── */}
      <div className="relative z-30 w-full border-t border-[#212124] bg-[#09090a]">
        <div className="font-body w-full max-w-[120rem] mx-auto grid grid-cols-1 md:grid-cols-3 text-[#F5F4F2]">
          <div className="border-b border-[#212124] md:border-b-0 md:border-r border-[#212124] px-6 py-8 lg:pl-[4rem] lg:py-6">
            <p className="inline-flex items-baseline text-[1.75rem] font-bold leading-none lg:text-[2rem]">
              <CountUpStat prefix="+" to={25} className="mr-[0.22em]" />
              <WhipInUp text="mil" />
            </p>
            <p className="mt-2 text-[#ababab] text-[1rem]">
              <WhipInUp text="Negócios atendidos" />
            </p>
          </div>

          <div className="border-b border-[#212124] md:border-b-0 md:border-r border-[#212124] px-6 py-8 lg:px-10 lg:py-6">
            <p className="text-[1.75rem] font-bold leading-none lg:text-[2rem]">
              <WhipInUp text="Pagamento único" />
            </p>
            <p className="mt-2 text-[#ababab] text-[1rem]">
              <WhipInUp text="Sem mensalidade" />
            </p>
          </div>

          <div className="px-6 py-8 lg:px-10 lg:py-6">
            <p className="text-[1.75rem] font-bold leading-none lg:text-[2rem]">
              <WhipInUp text="Acesso vitalício" />
            </p>
            <p className="mt-2 text-[#ababab] text-[1rem]">
              <WhipInUp text="Atualizações incluídas" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
