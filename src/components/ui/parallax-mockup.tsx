"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * As 3 camadas do PSD (fundo, sofá, notebook), posicionadas com a mesma
 * disposição montada à mão no Pencil (frame "mockup-notebook", 1200×909 —
 * fundo 0,0 1200×909 / sofá 0,233 1200×676 / notebook 300,169 627×512),
 * convertida aqui em porcentagens para ficar responsiva.
 *
 * Cada camada nasce um pouco maior que sua caixa (a caixa recorta o
 * excesso) para que o parallax de scroll desloque a imagem sem nunca
 * expor uma borda vazia.
 */
export function ParallaxMockup() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const scrollTrigger = {
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      };

      gsap.fromTo(
        ".parallax-fundo",
        { yPercent: -4 },
        { yPercent: 4, ease: "none", scrollTrigger },
      );
      gsap.fromTo(
        ".parallax-sofa",
        { yPercent: -6 },
        { yPercent: 6, ease: "none", scrollTrigger },
      );
      gsap.fromTo(
        ".parallax-notebook",
        { yPercent: -10 },
        { yPercent: 10, ease: "none", scrollTrigger },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-full w-full overflow-hidden">
      {/* fundo — tira limpa do topo (sem o recorte de máscara), cobre toda a caixa */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="parallax-fundo absolute inset-x-0 -top-[8%] h-[116%]">
          <Image
            src="/images/solucao/fundo.png"
            alt=""
            aria-hidden
            width={2400}
            height={309}
            quality={100}
            sizes="(max-width: 1024px) 100vw, 63vw"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>

      {/* sofá — 0,233 · 1200×676 (25.63% do topo, 74.37% de altura) */}
      <div className="absolute inset-x-0 top-[25.63%] h-[74.37%] overflow-hidden">
        <div className="parallax-sofa absolute inset-x-0 -top-[6%] h-[112%]">
          <Image
            src="/images/solucao/sofa.png"
            alt=""
            aria-hidden
            width={2400}
            height={1350}
            quality={100}
            sizes="(max-width: 1024px) 100vw, 63vw"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* notebook — 300,169 · 627×512 (25% esq., 18.59% topo, 52.25% larg., 56.33% alt.) */}
      <div className="absolute left-[25%] top-[18.59%] h-[56.33%] w-[52.25%] overflow-visible">
        <div className="parallax-notebook absolute inset-x-0 -top-[8%] h-[116%]">
          <Image
            src="/images/solucao/notebook.png"
            alt="Notebook mostrando a tela de gestão do cardápio da Ficha Técnica Pro, com custo, preço e lucro de cada produto"
            width={2400}
            height={1963}
            quality={100}
            sizes="(max-width: 1024px) 60vw, 33vw"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
