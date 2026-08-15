"use client";

import Image from "next/image";
import { useState } from "react";
import { VIDEO_EMBED } from "@/lib/content";
import { VideoTablet } from "@/components/video-tablet";

/**
 * Seção de vídeo com iluminação e ambiência de estúdio fotográfico completa (Anthony Boyd Graphics):
 * 1. Luz direcional difusa vinda do topo-direito (Key Light).
 * 2. Ciclorama de estúdio contínuo cobrindo 100% da viewport.
 * 3. iPad perfeitamente centralizado com sombra de estúdio profunda.
 */
export function Video() {
  const [tocando, setTocando] = useState(false);

  return (
    <section
      className="relative flex h-screen w-full items-center justify-center overflow-hidden text-[#1a1c20]"
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

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
