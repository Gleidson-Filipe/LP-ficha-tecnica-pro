"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { VIDEO_EMBED } from "@/lib/content";
import { VideoTablet } from "@/components/video-tablet";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Seção de vídeo com iluminação e ambiência de estúdio fotográfico completa (Anthony Boyd Graphics):
 * 1. Luz direcional difusa vinda do topo-direito (Key Light).
 * 2. Ciclorama de estúdio contínuo cobrindo 100% da viewport.
 * 3. iPad perfeitamente centralizado com sombra de estúdio profunda.
 *
 * Ao sair do Hero e entrar nesta seção, o título desce (como se saísse de
 * baixo do Hero) e o iPad sobe, encontrando-se centralizados no meio da
 * seção — amarrado ao scroll (scrub).
 *
 * Na saída, quando a próxima seção já cobriu cerca de metade do caminho,
 * dispara um bounce: o título salta e sobe saindo por cima, o iPad desce
 * saindo por baixo — efeito de "tesoura", não é mais scrub contínuo, é um
 * gatilho único que reverte se o usuário rolar pra cima de novo.
 */
export function Video({
  containerRef,
}: {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [tocando, setTocando] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([".video-title", ".video-tablet-wrap"], { clearProps: "transform,opacity" });
        return;
      }

      // O trigger precisa ser o container pai estático (não-sticky),
      // pois elementos position: sticky alteram suas coordenadas de viewport durante o scroll.
      const triggerEl = containerRef?.current || root.current;
      if (!triggerEl) return;

      // Entrada, espera (visível) e saída, tudo numa timeline só por
      // elemento, com UMA ScrollTrigger cada — nunca duas ScrollTriggers
      // com scrub disputando as mesmas propriedades do mesmo alvo. É um bug
      // documentado do próprio GSAP (greensock/GSAP#497: "scrubbing
      // animations cause other scrubbing animations to jump"): a segunda
      // sempre atropela a primeira a cada evento de scroll, porque cada
      // scrub re-renderiza pro seu próprio progresso clampado em TODO
      // scroll, mesmo fora do próprio intervalo. Já tentamos desligar uma
      // via disable()/enable() (dispara refresh() global, que arrasta o
      // scroll da página por causa da seção com pin:true em
      // story-scroll.tsx, e ainda deixou a ScrollTrigger "surda" depois de
      // reativada) e via overwrite:true (mata a outra na hora da CRIAÇÃO,
      // não na hora do trigger, quebrando a entrada desde o mount). Uma
      // timeline com scrub cobrindo o intervalo inteiro evita o conflito
      // por construção — não existe uma segunda ScrollTrigger pra brigar.
      //
      // A posição de cada trecho é calculada em px (não em % fixo da
      // timeline) porque a entrada é uma janela de scroll bem menor que a
      // distância total até a saída — sem isso, a proporção ficaria
      // arbitrária e a entrada aconteceria rápido/lenta demais.
      //
      // start/end são FUNÇÕES, não números fixos: um número (px) calculado
      // uma vez no mount fica errado pra sempre se a página ainda não tinha
      // a altura final naquele instante (ex.: fonte ainda carregando) —
      // ScrollTrigger.refresh() só recalcula expressões dinâmicas (string
      // ou função), nunca um número já resolvido. invalidateOnRefresh
      // garante que a função é reexecutada a cada refresh (não só a
      // primeira vez), pegando a geometria atual de verdade.
      const geometry = () => {
        const vh = window.innerHeight;
        const rect = triggerEl.getBoundingClientRect();
        const containerTop = rect.top + window.scrollY;
        const enterStart = containerTop - vh * 0.8; // "top 80%"
        const enterEnd = containerTop - vh * 0.1; // "top 10%"
        // O vídeo ocupa exatamente 1 viewport (h-screen) — "meio coberto"
        // pela próxima seção (Para quem é) é quando ela já subiu até a
        // metade da tela, ou seja, meio viewport depois do fim do vídeo.
        // Não usar o fundo do CONTAINER inteiro (vídeo + Para quem é
        // somados): isso dispararia a saída só perto do fim de "Para quem
        // é", tarde e abrupto demais.
        const exitStart = containerTop + vh * 0.5;
        // Mesma distância de scroll da entrada (enterEnd - enterStart),
        // pra saída ter a mesma duração/suavidade — nunca mais curta.
        const exitEnd = exitStart + (enterEnd - enterStart);
        return { enterStart, enterEnd, exitStart, exitEnd };
      };

      // Frações fixas (aproximação): só definem a proporção RELATIVA entre
      // entrada/espera/saída dentro do intervalo, recalculado a cada
      // refresh via geometry() acima — não precisam ser dinâmicas também.
      const { enterStart, enterEnd, exitStart, exitEnd } = geometry();
      const totalRange = exitEnd - enterStart;
      const enterEndFrac = (enterEnd - enterStart) / totalRange;
      const exitStartFrac = (exitStart - enterStart) / totalRange;

      // Saída no mesmo estilo da entrada (mesmo deslocamento, mesma ease
      // power2) — não é mais um "bounce" distinto, é a entrada tocando ao
      // contrário: título volta a subir/sumir por cima, tablet volta a
      // descer/sumir por baixo, exatamente pelo caminho que vieram.
      const buildTimeline = (target: string, fromY: number) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerEl,
            start: () => geometry().enterStart,
            end: () => geometry().exitEnd,
            scrub: 0.8,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(
          target,
          { y: fromY, opacity: 0 },
          { y: 0, opacity: 1, ease: "power2.out", duration: enterEndFrac },
          0,
        ).to(
          target,
          { y: fromY, opacity: 0, ease: "power2.out", duration: 1 - exitStartFrac },
          exitStartFrac,
        );
      };

      buildTimeline(".video-title", -140);
      buildTimeline(".video-tablet-wrap", 180);
    },
    { scope: root, dependencies: [containerRef] },
  );

  return (
    <section
      ref={root}
      className="relative flex h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden text-[#1a1c20] lg:gap-14"
      style={{
        background:
          "radial-gradient(130% 120% at 85% 15%, #eceef4 0%, #c8cbd6 38%, #a4a8b8 78%, #8c90a0 100%)",
      }}
    >
      {/* Luz difusa de estúdio (Key Light do topo-direito) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 size-[1000px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.40) 40%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(60px)",
        }}
      />

      <h2 className="video-title font-display relative z-10 px-4 text-center text-h2 text-[#1a1c20]">
        Seu negócio sempre atualizado.
      </h2>

      <div className="video-tablet-wrap relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <VideoTablet>
          {tocando ? (
            <iframe
              src={`${VIDEO_EMBED}&autoplay=1`}
              title="Ficha Técnica Pro por dentro"
              allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setTocando(true)}
              aria-label="Reproduzir a demonstração"
              className="absolute inset-0 size-full cursor-pointer"
            >
              <Image
                src="https://cdn.pandavideo.com/vz-0e8baf6e-011/66bcda6b-0d7a-46d8-9e08-997dd88101b9/thumbnail.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover"
                priority
              />
              <span className="absolute inset-0 bg-black/20" />
              <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3.5 bg-accent px-7 py-5 text-white">
                <span
                  aria-hidden
                  className="block size-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-current"
                />
                <span className="font-display text-[1rem] font-bold tracking-[0.03em]">
                  ASSISTIR
                </span>
              </span>
            </button>
          )}
        </VideoTablet>
      </div>
    </section>
  );
}
