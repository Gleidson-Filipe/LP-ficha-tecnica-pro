"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { IPAD_SPECS } from "@/lib/ipad-specs";
import { deferDuringNavJump, cancelDeferred } from "@/lib/nav-jump";

// Proporção exata do corpo do iPad Pro (10.0 / 5.912438 = 1.69135)
const CONTAINER_ASPECT = IPAD_SPECS.aspectRatio;

// Margem de enquadramento da câmera (2.0% para acomodar os botões em 3D)
const CAMERA_MARGIN = 0.020;
const SCALE_FACTOR = 1 / (1 + CAMERA_MARGIN);
const SIDE_MARGIN = (CAMERA_MARGIN / 2) * 100;

// Insets exatos da tela 16:9 sincronizados com o modelo 3D
export const TABLET_SCREEN_INSET = {
  top: `${(SIDE_MARGIN + IPAD_SPECS.bezelTop * 100 * SCALE_FACTOR).toFixed(3)}%`,
  bottom: `${(SIDE_MARGIN + IPAD_SPECS.bezelBottom * 100 * SCALE_FACTOR).toFixed(3)}%`,
  left: `${(SIDE_MARGIN + IPAD_SPECS.bezelLeft * 100 * SCALE_FACTOR).toFixed(3)}%`,
  right: `${(SIDE_MARGIN + IPAD_SPECS.bezelRight * 100 * SCALE_FACTOR).toFixed(3)}%`,
};

// three.js só entra no bundle quando este componente realmente monta (ver
// IntersectionObserver abaixo) — nunca no chunk inicial da página.
const TabletCanvas = dynamic(
  () => import("@/components/video-tablet-canvas").then((m) => m.VideoTabletCanvas),
  { ssr: false, loading: () => null },
);

/**
 * Shell do tablet — SEM three.js. Define a geometria (altura via
 * aspectRatio, sombra, border-radius concêntrico) inteiramente com
 * matemática de IPAD_SPECS, então a altura do subtree nunca muda quando o
 * three.js carrega depois: é essa invariante que mantém o scrub de
 * video.tsx imune sem precisar de ScrollTrigger.refresh() nenhum.
 *
 * Um chassi CSS (mesma cor média do corpo do iPad) fica PERMANENTEMENTE
 * atrás do canvas, então não existe frame "sem moldura" — o WebGL só pinta
 * por cima quando estiver pronto, sem piscada nem swap perceptível.
 */
export function VideoTablet({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [precisaCanvas, setPrecisaCanvas] = useState(false);

  // Border-radius circular concêntrico em pixels — só matemática de
  // IPAD_SPECS, sem depender do three.js estar carregado.
  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const ro = new ResizeObserver(() => {
      const { clientWidth: w } = host;
      if (!w) return;

      const bodyPxRadius = w * (IPAD_SPECS.cornerRadius / IPAD_SPECS.bodyWidth) * SCALE_FACTOR;
      if (shadowRef.current) {
        shadowRef.current.style.borderRadius = `${bodyPxRadius.toFixed(1)}px`;
      }

      const screenPxRadius = w * (IPAD_SPECS.screenCornerRadius / IPAD_SPECS.bodyWidth) * SCALE_FACTOR;
      if (screenRef.current) {
        screenRef.current.style.borderRadius = `${screenPxRadius.toFixed(1)}px`;
      }
    });
    ro.observe(host);

    return () => ro.disconnect();
  }, []);

  // Só busca o chunk do three.js quando o tablet está perto da tela — a
  // seção de vídeo vem logo após o Hero, então a margem é generosa (o
  // usuário chega lá rápido, e o three carrega enquanto ainda lê o Hero).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        // Igual ao animated-check: não busca o chunk do three.js (o maior
        // da página) durante um voo de navegação, só reobserva.
        if (deferDuringNavJump(el, () => {
          io.unobserve(el);
          io.observe(el);
        })) {
          return;
        }
        setPrecisaCanvas(true);
        io.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);

    return () => {
      cancelDeferred(el);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="@container isolate relative mx-auto w-full max-w-[1040px] select-none"
      style={{
        aspectRatio: CONTAINER_ASPECT,
      }}
    >
      {/* Sombra de estúdio fotográfico hiper-realista alinhada ao corpo do iPad */}
      <div
        ref={shadowRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-0"
        style={{
          top: `${SIDE_MARGIN.toFixed(3)}%`,
          bottom: `${SIDE_MARGIN.toFixed(3)}%`,
          left: `${SIDE_MARGIN.toFixed(3)}%`,
          right: `${SIDE_MARGIN.toFixed(3)}%`,
          borderRadius: "calc(3.863cqw)",
          boxShadow:
            "-30px 45px 95px -12px rgba(0, 0, 0, 0.48), -16px 24px 48px -8px rgba(0, 0, 0, 0.32), -6px 10px 20px -4px rgba(0, 0, 0, 0.20)",
        }}
      />

      {/* Chassi CSS do iPad (renderiza com acabamento realista e cantos arredondados desde o frame 0) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-[1] overflow-hidden"
        style={{
          top: `${SIDE_MARGIN.toFixed(3)}%`,
          bottom: `${SIDE_MARGIN.toFixed(3)}%`,
          left: `${SIDE_MARGIN.toFixed(3)}%`,
          right: `${SIDE_MARGIN.toFixed(3)}%`,
          borderRadius: "calc(3.863cqw)",
          background: "linear-gradient(145deg, #1d1f24 0%, #101114 45%, #15171b 100%)",
          boxShadow:
            "inset 0 1px 1.5px rgba(255, 255, 255, 0.24), inset 0 -1.5px 2px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.09)",
        }}
      />

      {/* Host do canvas three.js */}
      <div
        ref={canvasHostRef}
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{ background: "transparent" }}
      >
        {precisaCanvas && <TabletCanvas host={canvasHostRef} />}
      </div>

      {/* Screen Video Layer (Display 16:9 perfeitamente enquadrado dentro do bezel) */}
      <div
        ref={screenRef}
        className="absolute overflow-hidden z-[10] bg-black"
        style={{
          ...TABLET_SCREEN_INSET,
          borderRadius: "calc(1.078cqw)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
