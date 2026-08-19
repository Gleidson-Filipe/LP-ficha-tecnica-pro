"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { NAV, SLOGAN, CTA, CHECKOUT } from "@/lib/content";
import { setPendingNavTarget } from "@/lib/pending-nav-target";
import { scrollToId, scrollToTop } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { FitWidth } from "@/components/ui/fit-width";
import { useCtaFx, CtaGlow, CtaShine, CtaEcho } from "@/components/ui/cta-fx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Header refinado com base no feedback do Pencil:
 * 1. Nav mais fina: h:88px em desktop.
 * 2. Caixa da Logo ajustada: w:408px (remove o excesso de espaçamento na direita).
 * 3. 4 Botões Principais: Como funciona, Recursos, Depoimentos, FAQ.
 * 4. Alinhamento dos Nomes dos Botões: alinhados à esquerda (pl-8) exatamente como no Pencil.
 */
export function SiteHeader() {
  const root = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState<string | null>(null);
  const [aberto, setAberto] = useState(false);
  const ctaFx = useCtaFx<HTMLAnchorElement>();

  useGSAP(
    () => {
      const getSecoes = () =>
        NAV.map((item) => ({
          id: item.id,
          el: document.getElementById(item.id),
        })).filter((s): s is { id: typeof NAV[number]["id"]; el: HTMLElement } => s.el instanceof HTMLElement);

      const atualizar = () => {
        const headerH = root.current?.offsetHeight ?? 72;
        const viewportH = window.innerHeight;
        const triggerY = headerH + Math.min(viewportH * 0.35, 280);

        // 1. Se o usuário estiver no Rodapé (footer entrou na linha de foco), nenhum botão fica selecionado
        const footerEl = document.querySelector("footer");
        if (footerEl && footerEl.getBoundingClientRect().top <= triggerY) {
          setAtivo(null);
          return;
        }

        const secoes = getSecoes();
        if (secoes.length === 0) return;

        // 2. Se o usuário ainda estiver no Hero/Topo da página (antes da 1ª seção entrar)
        const firstSec = secoes[0];
        if (firstSec.el.getBoundingClientRect().top > triggerY) {
          setAtivo(null);
          return;
        }

        // 3. Procura a seção que cruza a linha de leitura principal
        let atual = secoes.find(({ el }) => {
          const r = el.getBoundingClientRect();
          return r.top <= triggerY && r.bottom > triggerY;
        });

        // 4. Fallback: seção com maior área visível na tela
        if (!atual) {
          let maxVisible = 0;
          for (const s of secoes) {
            const r = s.el.getBoundingClientRect();
            const top = Math.max(r.top, headerH);
            const bottom = Math.min(r.bottom, viewportH);
            const visible = Math.max(0, bottom - top);
            if (visible > maxVisible && visible > 100) {
              maxVisible = visible;
              atual = s;
            }
          }
        }

        setAtivo(atual ? atual.id : null);
      };

      // `atualizar` faz até 8 leituras de getBoundingClientRect (força
      // layout) por chamada. Throttle pra no máximo 1x a cada 100ms — o
      // destaque do nav não precisa de precisão de frame, e sem isso o
      // onUpdate roda a cada tick de scroll (até 60x/s durante um scroll
      // suave), competindo pela mesma thread que está pintando o próprio
      // scroll. Mesma família do bug já documentado abaixo (duplicação de
      // listener causando stutter só sob scroll real).
      let ultimaExec = 0;
      const THROTTLE_MS = 100;
      const atualizarThrottled = () => {
        const agora = performance.now();
        if (agora - ultimaExec < THROTTLE_MS) return;
        ultimaExec = agora;
        atualizar();
      };

      // Só a ScrollTrigger cuida do scroll (ela já escuta scroll de forma
      // otimizada internamente) — não duplicar com um addEventListener
      // "scroll" manual chamando a MESMA função a cada tick: isso rodava o
      // mesmo getBoundingClientRect() em todas as seções DUAS vezes por
      // evento de scroll, sobrecarregando a thread principal durante
      // rolagem contínua e competindo com outras animações (ex.: a entrada
      // "torta" do CTA de Problema ficava com stutter só quando chegava lá
      // rolando de verdade, mas suave num reload — a diferença era
      // exatamente essa duplicação só acontecer sob scroll real).
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: atualizarThrottled,
        onRefresh: atualizar,
      });

      window.addEventListener("resize", atualizar, { passive: true });
      atualizar();

      const gs: ScrollTrigger[] = [st];

      // Logo descendo de cima pra baixo ao carregar a página, com fade.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".site-logo", { clearProps: "transform,opacity" });
      } else {
        gsap.to(".site-logo", {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "back.out(1.4)",
        });
      }

      return () => {
        window.removeEventListener("resize", atualizar);
        gs.forEach((g) => g.kill());
      };
    },
    { scope: root },
  );

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setAtivo(null);
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    scrollToTop();
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setAtivo(id);
    const target = document.getElementById(id);
    if (target) {
      setPendingNavTarget(id, target.getBoundingClientRect().top + window.scrollY);
      scrollToId(id);
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  };

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setAberto(false);
    setAtivo(id);
    const target = document.getElementById(id);
    if (target) {
      setPendingNavTarget(id, target.getBoundingClientRect().top + window.scrollY);
      scrollToId(id);
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (CHECKOUT.startsWith("#")) {
      e.preventDefault();
      const id = CHECKOUT.slice(1);
      const target = document.getElementById(id);
      if (target) {
        setPendingNavTarget(id, target.getBoundingClientRect().top + window.scrollY);
        scrollToId(id);
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    }
  };

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
          href="/"
          onClick={handleLogoClick}
          aria-label="Ficha Técnica Pro"
          className="relative flex shrink-0 items-stretch pl-5 pr-6 sm:pl-8 xl:w-[408px] xl:px-0 cursor-pointer"
        >
          {/* Responsivo (mobile/tablet) */}
          <div
            className="site-logo flex flex-col justify-center gap-0 xl:hidden"
            style={{ transform: "translateY(-160px)", opacity: 0 }}
          >
            <Image
              src="/images/logo-ftp.png"
              alt="Ficha Técnica Pro"
              width={944}
              height={100}
              priority
              sizes="176px"
              className="block h-auto w-[140px] sm:w-[176px]"
            />
          </div>

          {/* Desktop (lg/xl): Logo perfeitamente rente à largura do Slogan (277px) */}
          <div className="hidden xl:block xl:w-full xl:h-full xl:relative">
            <div
              className="site-logo absolute left-[64px] top-[12px] w-[277px] h-[29.34px]"
              style={{
                backgroundImage: "url('/images/logo-ftp.png')",
                backgroundPosition: "left center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                transform: "translateY(-160px)",
                opacity: 0,
              }}
            />
            <div
              className="absolute left-[64px] -ml-[1px] top-[42px] w-[277px]"
              style={{ lineHeight: "normal" }}
            >
              <FitWidth width={277} className="font-body text-[16px] font-semibold text-[#f5f4ea]">
                <WhipInUp text={SLOGAN} eager />
              </FitWidth>
            </div>
          </div>
        </a>

        {/* ── Nav desktop: 4 botões principais com texto ALINHADO À ESQUERDA (pl-8) ── */}
        <nav aria-label="Seções" className="hidden flex-1 items-stretch xl:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              aria-current={ativo === item.id ? "true" : undefined}
              className={cn(
                "font-body relative flex flex-1 items-center justify-start pl-8 text-left transition-colors duration-150 whitespace-nowrap",
                ativo === item.id ? "text-[#f5f4f2]" : "text-[#A3A3A3] hover:text-[#dbdbdb]",
              )}
              style={{
                borderLeft: "1px solid #212124",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              <WhipInUp text={item.label} eager />
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
        <div className="flex-1 xl:hidden" />

        {/* ── Hambúrguer (mobile/tablet) ── */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          className="flex shrink-0 items-center gap-2.5 px-4 text-[0.8125rem] font-semibold text-[#dbdbdb] uppercase tracking-wider sm:px-5 xl:hidden"
        >
          <span className="flex flex-col gap-[4px]">
            <span className={cn("block h-[2px] w-4 bg-current transition-transform", aberto && "translate-y-[6px] rotate-45")} />
            <span className={cn("block h-[2px] w-4 bg-current transition-opacity",   aberto && "opacity-0")} />
            <span className={cn("block h-[2px] w-4 bg-current transition-transform", aberto && "-translate-y-[6px] -rotate-45")} />
          </span>
          <span className="hidden sm:inline">
            <WhipInUp text="Menu" eager />
          </span>
        </button>

        {/* ── CTA: Largura de 304px no desktop, bg fluido animado, texto 19px bold ── */}
        <a
          ref={ctaFx}
          href={CHECKOUT}
          onClick={handleCtaClick}
          className="group relative flex shrink-0 items-center justify-center overflow-hidden cta-btn-fluid px-6 text-white transition-all duration-150 xl:w-[304px] xl:px-0"
          style={{ borderLeft: "1px solid #212124" }}
        >
          <CtaGlow />
          <CtaShine />
          <span className="font-body xl:hidden font-bold text-[15px] text-white">
            <CtaEcho>
              <WhipInUp text="Comprar" eager />
            </CtaEcho>
          </span>
          <span className="font-body hidden xl:inline font-bold text-[19px] whitespace-nowrap text-white">
            <CtaEcho>
              <WhipInUp text={CTA.header.l2} eager />
            </CtaEcho>
          </span>
        </a>
      </div>

      {/* ── Menu Mobile ── */}
      {aberto && (
        <nav
          aria-label="Seções"
          className="bg-[#09090a] xl:hidden"
          style={{ borderTop: "1px solid #212124" }}
        >
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleMobileNavClick(e, item.id)}
              className="block py-4 pl-5 text-[1.0625rem] font-semibold text-[#dbdbdb] sm:pl-8"
              style={{ borderBottom: "1px solid #212124" }}
            >
              <WhipInUp text={item.label} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
