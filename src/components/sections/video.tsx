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
export function Video() {
  const [tocando, setTocando] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".video-title", { y: -140, opacity: 0 });
      gsap.set(".video-tablet-wrap", { y: 180, opacity: 0 });

      // Entrada: título desce, iPad sobe, convergindo no centro da seção.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "center center",
            scrub: 1,
          },
        })
        .to(".video-title", { y: 0, opacity: 1, ease: "power2.out" }, 0)
        .to(".video-tablet-wrap", { y: 0, opacity: 1, ease: "power2.out" }, 0);

      // Saída: gatilho único (não scrub) quando a próxima seção já subiu
      // pela metade — título dá um bounce e sobe, iPad desce. Reverte se
      // o usuário voltar a rolar para cima.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "bottom 50%",
            toggleActions: "play none none reverse",
          },
        })
        .to(".video-title", {
          y: -180,
          opacity: 0,
          duration: 0.7,
          ease: "back.in(1.8)",
        }, 0)
        .to(".video-tablet-wrap", {
          y: 220,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
        }, 0);
    },
    { scope: root },
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
