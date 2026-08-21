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
      {/* ── Frame (w:1920px h:847px com overflow-hidden) ── */}
      <div
        ref={root}
        className="relative mx-auto w-full max-w-[1920px] min-[1921px]:max-w-[2400px] h-auto lg:h-[calc(100vh-113px)] lg:min-h-[760px] overflow-hidden bg-[#09090a]"
      >
        {/* ── Painel Cinza do Mockup (com cadeia de linhas finas de ~1px ao fundo) ──
            Acima de 1920px o frame ganha um teto maior (2400px) em vez de só
            centralizar com margens pretas mortas nas laterais — o painel
            estica até a nova borda direita (right-[64px] no lugar de
            w-[971px] fixo) e o mockup abaixo passa a se ancorar pela direita
            com o MESMO respiro de 64px que o headline usa à esquerda (mesma
            distância da borda da janela dos dois lados), em vez de ficar
            preso numa posição fixa que ou clipava ou deixava vazio. */}
        <div
          className="hidden lg:block absolute left-[949px] top-[72px] w-[971px] min-[1921px]:right-[64px] min-[1921px]:w-auto bottom-0 bg-[#0d0d0f] overflow-hidden"
          style={{
            borderTop: "1px solid #212124",
            borderLeft: "1px solid #212124",
          }}
        >
          {/* Cadeia de linhas finas de 1px por trás da imagem — repetição em
              % + background-size (não px fixo): a largura do painel não é
              múltiplo exato de 20px, então um passo fixo em px deixava a
              última linha cortada pela metade na borda. Com 49 repetições
              fechando em exatamente 100% da largura, a última linha sempre
              bate perfeitinha no limite, em qualquer largura do painel.
              Acima de 1920px o painel fica bem mais largo (right-[64px] em
              vez de w-[971px] fixo) e 49 repetições nessa largura maior
              deixava o espaçamento visivelmente mais aberto que o original
              (~20px) — a classe .hero-panel-lines sobe pra 70 repetições
              só nesse breakpoint (ver globals.css) pra manter a densidade
              parecida, sem mexer no padrão já aprovado abaixo de 1921px. */}
          <div
            aria-hidden
            className="hero-panel-lines absolute inset-0 pointer-events-none"
          />
        </div>

        {/* ── Divisórias Verticais Encostando na base do Header (top: 88px) ── */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
          <div className="absolute left-[63px] top-[72px] w-[1px] h-[calc(100vh-185px)] min-h-[688px] bg-[#212124]" />
          <div className="absolute left-[408px] top-[72px] w-[1px] h-[calc(100vh-185px)] min-h-[688px] bg-[#212124]" />
          <div className="absolute left-[818px] top-[72px] w-[1px] h-[calc(100vh-185px)] min-h-[688px] bg-[#212124]" />
        </div>

        {/* ── Conteúdo Textual (Headline + Sub + CTA) ── */}
        <div className="relative z-20 px-6 pt-[108px] pb-12 lg:px-0 lg:pt-0 lg:pb-0">
          {/* Headline exata de teste1.html (left:64px top:203px w:755px) */}
          <h1 className="font-display font-bold tracking-[-0.6px] text-left text-[#F5F4F2] text-[2.5rem] leading-[1.1] lg:absolute lg:left-[64px] lg:top-[136px] lg:w-[755px] lg:text-[90px] lg:leading-[99px]">
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

          {/* Subtítulo exato de teste1.html (left:64px top:614px w:742px) */}
          <p className="font-body mt-6 text-[#ababab] text-lg font-normal lg:mt-0 lg:absolute lg:left-[64px] lg:top-[547px] lg:w-[742px] lg:text-[25px] lg:leading-[38px]">
            <WhipInUp text="Tenha preços que geram lucro e não apenas faturamento." eager />
          </p>

          {/* Botão CTA exato de teste1.html (left:64px top:716px w:584px h:70px) */}
          <a
            ref={ctaFx}
            href={CHECKOUT}
            onClick={handleCtaClick}
            className="hero-fade group relative font-body mt-8 inline-flex items-center justify-center gap-1.5 overflow-hidden cta-btn-fluid px-6 py-4 text-white lg:mt-0 lg:absolute lg:left-[64px] lg:top-[649px] lg:w-[584px] lg:h-[70px] lg:px-0 lg:py-0 lg:justify-center"
            style={{ opacity: 0, transform: "translate(22px, 26px) rotate(6deg)" }}
          >
            <CtaGlow />
            <CtaShine />
            <CtaEcho className="items-center whitespace-nowrap text-white">
              <span className="font-bold text-[18px] sm:text-[20px] lg:text-[22px] whitespace-nowrap text-white">
                <WhipInUp text="Quero saber meu custo real e precificar certo" eager />
              </span>
            </CtaEcho>
          </a>
        </div>

        {/* ── Imagem do Mockup (Encostando na borda inferior) ── */}
        {/* min-[1921px]: cresce um pouco em tela wide (pedido: topo do
            notebook passando levemente da altura do título), mas em `vw`
            (relativo à tela) dentro de um clamp, não px fixo — escala
            sozinho em qualquer largura acima de 1920px, sem depender de um
            número mágico calibrado só pra uma resolução. Altura em
            aspect-ratio (não h fixo) pra manter a proporção 1370:698
            automaticamente, então só o width precisa ser controlado. Teto
            do clamp reduzido (1370→1420, era 1495) porque tava quase
            encostando na nav. Continua bottom-anchored (bottom-0): crescer
            a altura empurra o topo pra cima, não o fundo pra baixo. */}
        <div className="hero-mockup hero-mockup-wide relative z-20 mt-8 px-4 lg:mt-0 lg:px-0 lg:absolute lg:left-[691px] min-[1921px]:!left-auto min-[1921px]:!right-[64px] lg:bottom-0 lg:top-auto lg:w-[1370px] lg:h-[698px] pointer-events-none flex items-end">
          <Image
            src="/images/mockup-hero.webp"
            alt="Planilha Ficha Técnica Pro"
            width={5423}
            height={2808}
            priority
            quality={90}
            sizes="(min-width: 1024px) 1450px, 100vw"
            className="w-full h-auto object-contain object-bottom block lg:w-[1370px] lg:h-[698px] min-[1921px]:!w-full min-[1921px]:!h-full min-[1921px]:object-right-bottom"
          />
        </div>
      </div>

      {/* ── Faixa de Reforços / Stats na Base ──
          A borda superior é full-bleed (w-full, sem max-w) — precisa
          encostar nas duas bordas da tela mesmo acima de 1920px, diferente
          do conteúdo em si (números/texto), que continua dentro do mesmo
          teto de largura do resto do Hero. */}
      <div className="relative z-20 w-full border-t border-[#212124]">
        <div className="font-body w-full max-w-[1920px] min-[1921px]:max-w-[2400px] mx-auto grid grid-cols-1 md:grid-cols-3 text-[#F5F4F2]">
        <div className="border-b border-[#212124] md:border-b-0 md:border-r border-[#212124] px-6 py-8 lg:pl-[64px] lg:py-6">
          <p className="inline-flex items-baseline text-[28px] font-bold leading-none lg:text-[32px]">
            <CountUpStat prefix="+" to={25} className="mr-[0.22em]" />
            <WhipInUp text="mil" />
          </p>
          <p className="mt-2 text-[#ababab] text-[16px]">
            <WhipInUp text="Negócios atendidos" />
          </p>
        </div>

        <div className="border-b border-[#212124] md:border-b-0 md:border-r border-[#212124] px-6 py-8 lg:px-10 lg:py-6">
          <p className="text-[28px] font-bold leading-none lg:text-[32px]">
            <WhipInUp text="Pagamento único" />
          </p>
          <p className="mt-2 text-[#ababab] text-[16px]">
            <WhipInUp text="Sem mensalidade" />
          </p>
        </div>

        <div className="px-6 py-8 lg:px-10 lg:py-6">
          <p className="text-[28px] font-bold leading-none lg:text-[32px]">
            <WhipInUp text="Acesso vitalício" />
          </p>
          <p className="mt-2 text-[#ababab] text-[16px]">
            <WhipInUp text="Atualizações incluídas" />
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
