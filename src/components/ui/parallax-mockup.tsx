"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import fundoImg from "../../../public/images/solucao/fundo.webp";
import sofaImg from "../../../public/images/solucao/sofa.webp";
import notebookImg from "../../../public/images/solucao/notebook.webp";

gsap.registerPlugin(useGSAP);

/**
 * Mockup 2.5D com Parallax em camadas (Fundo, Sofá e Notebook).
 * As 3 camadas compartilham o mesmo canvas 6600×5000, garantindo
 * proporção, enquadramento e alinhamento 100% fiéis ao design original.
 *
 * O parallax reage suavemente aos movimentos do mouse. As 3 imagens
 * são apresentadas sincronizadas assim que todas concluem o carregamento
 * e a decodificação assíncrona.
 */
export function ParallaxMockup() {
  const root = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState({ fundo: false, sofa: false, notebook: false });
  const allLoaded = loaded.fundo && loaded.sofa && loaded.notebook;

  const markLoaded = useCallback((layer: keyof typeof loaded) => {
    setLoaded((prev) => (prev[layer] ? prev : { ...prev, [layer]: true }));
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const layers = [
        { sel: ".parallax-fundo", move: 10, base: 1, zoom: 1.02 },
        { sel: ".parallax-sofa", move: 16, base: 1, zoom: 1.03 },
        { sel: ".parallax-notebook", move: 26, base: 1, zoom: 1.05 },
      ] as const;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const setters = layers.map(({ sel, move, base, zoom }) => {
        const target = el.querySelector<HTMLElement>(sel);
        gsap.set(target, { scaleX: base, scaleY: base });
        return {
          target,
          move,
          base,
          zoom,
          x: gsap.quickTo(target, "x", { duration: 0.7, ease: "power3.out" }),
          y: gsap.quickTo(target, "y", { duration: 0.7, ease: "power3.out" }),
          scaleX: gsap.quickTo(target, "scaleX", { duration: 0.7, ease: "power3.out" }),
          scaleY: gsap.quickTo(target, "scaleY", { duration: 0.7, ease: "power3.out" }),
        };
      });

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;

        setters.forEach((s) => {
          s.x(px * s.move);
          s.y(py * s.move);
          s.scaleX(s.zoom);
          s.scaleY(s.zoom);
        });
      };

      const onLeave = () => {
        setters.forEach((s) => {
          s.x(0);
          s.y(0);
          s.scaleX(s.base);
          s.scaleY(s.base);
        });
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="isolate relative h-full w-full overflow-hidden bg-[#9eb88d]">
      {/* Container das 3 Camadas: revelado de forma síncrona apenas com as 3 camadas prontas */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{ opacity: allLoaded ? 1 : 0 }}
      >
        {/* Camada 1: Fundo */}
        <div className="parallax-fundo absolute -left-[18%] -top-[18%] h-[136%] w-[136%]">
          <Image
            src={fundoImg}
            alt=""
            aria-hidden
            quality={90}
            sizes="(min-width: 1024px) 85vw, 136vw"
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img && "decode" in img) {
                img.decode().catch(() => {}).finally(() => markLoaded("fundo"));
              } else {
                markLoaded("fundo");
              }
            }}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Camada 2: Sofá */}
        <div className="parallax-sofa pointer-events-none absolute -left-[18%] -top-[18%] h-[136%] w-[136%]">
          <Image
            src={sofaImg}
            alt=""
            aria-hidden
            quality={90}
            sizes="(min-width: 1024px) 85vw, 136vw"
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img && "decode" in img) {
                img.decode().catch(() => {}).finally(() => markLoaded("sofa"));
              } else {
                markLoaded("sofa");
              }
            }}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Camada 3: Notebook */}
        <div className="parallax-notebook pointer-events-none absolute -left-[18%] -top-[18%] h-[136%] w-[136%]">
          <Image
            src={notebookImg}
            alt="Notebook mostrando a tela de gestão do cardápio da Ficha Técnica Pro, com custo, preço e lucro de cada produto"
            quality={95}
            sizes="(min-width: 1024px) 95vw, 136vw"
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img && "decode" in img) {
                img.decode().catch(() => {}).finally(() => markLoaded("notebook"));
              } else {
                markLoaded("notebook");
              }
            }}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>

      {/* Placeholder Sólido Elegante: cor #9eb88d exata sem vazamento de camadas */}
      {!allLoaded && (
        <div
          aria-hidden
          className="absolute inset-0 z-20 flex items-center justify-center bg-[#9eb88d] transition-opacity duration-300"
        >
          <div className="h-full w-full animate-pulse bg-black/[0.04]" />
        </div>
      )}
    </div>
  );
}
