"use client";

import Image from "next/image";
import { useRef } from "react";
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
 * O parallax reage ao mouse (não ao scroll): cada camada se desloca e
 * dá um leve zoom extra conforme o cursor se move sobre o mockup, com
 * intensidade crescente do fundo para o notebook (profundidade 2.5D).
 * Ao tirar o mouse, tudo volta ao zoom de repouso (não a escala 1) —
 * o notebook já nasce mais próximo/grande, puxando o quadro pra ele.
 *
 * Clique alterna um zoom grande (tipo o visualizador de imagem do Chrome):
 * escala as 3 camadas juntas a partir do centro (transform-origin nunca
 * muda — trocar a origem dinamicamente causava um "congela e depois
 * pula" no fim da animação, expondo um recorte do fundo por trás) e usa
 * x/y (translate) pra deslocar o conteúdo de forma que o ponto clicado
 * fique parado sob o cursor, simulando o zoom nesse ponto sem nenhuma
 * das armadilhas de mexer em transform-origin no meio da animação.
 * O parallax por hover é pausado enquanto ampliado e volta a funcionar
 * normalmente assim que clica de novo pra sair (retorno simétrico:
 * x/y voltam a 0, escala volta à base — o mesmo estado de repouso do
 * hover, então não há salto nem readaptação ao reativar o hover).
 */
const CLICK_ZOOM_SCALE = 3.2;

export function ParallaxMockup() {
  const root = useRef<HTMLDivElement>(null);
  const zoomed = useRef(false);

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

      const onClick = (e: MouseEvent) => {
        zoomed.current = !zoomed.current;
        el.classList.toggle("cursor-zoom-out", zoomed.current);
        el.classList.toggle("cursor-zoom-in", !zoomed.current);

        if (zoomed.current) {
          // Escala a partir do centro (origin nunca muda) e usa x/y pra
          // deslocar o conteúdo de forma que o ponto clicado fique parado
          // sob o cursor — mesmo efeito visual de "zoom nesse ponto", sem
          // depender de transform-origin dinâmico.
          const rect = el.getBoundingClientRect();
          const dx = (e.clientX - rect.left) / rect.width - 0.5;
          const dy = (e.clientY - rect.top) / rect.height - 0.5;
          const tx = -(CLICK_ZOOM_SCALE - 1) * dx * rect.width;
          const ty = -(CLICK_ZOOM_SCALE - 1) * dy * rect.height;

          setters.forEach((s) => {
            s.x(tx);
            s.y(ty);
            s.scaleX(CLICK_ZOOM_SCALE);
            s.scaleY(CLICK_ZOOM_SCALE);
          });
        } else {
          // Retorno simétrico ao mesmo repouso do hover-parallax (x/y a 0,
          // escala na base) — nenhum estado intermediário pra "congelar".
          setters.forEach((s) => {
            s.x(0);
            s.y(0);
            s.scaleX(s.base);
            s.scaleY(s.base);
          });
        }
      };

      el.addEventListener("click", onClick);

      if (reduced) {
        return () => el.removeEventListener("click", onClick);
      }

      const onMove = (e: MouseEvent) => {
        if (zoomed.current) return;

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
        // Segurança: se o mouse sai da imagem enquanto está ampliada,
        // volta ao normal em vez de ficar travada no zoom.
        if (zoomed.current) {
          zoomed.current = false;
          el.classList.remove("cursor-zoom-out");
          el.classList.add("cursor-zoom-in");
        }

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
        el.removeEventListener("click", onClick);
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-full w-full cursor-zoom-in overflow-hidden bg-[#9eb88d]">
      {/* Camada 1: Fundo */}
      <div className="parallax-fundo absolute -left-[18%] -top-[18%] h-[136%] w-[136%]">
        <Image
          src={fundoImg}
          alt=""
          aria-hidden
          placeholder="blur"
          quality={82}
          sizes="(min-width: 1024px) 86vw, 136vw"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Camada 2: Sofá */}
      <div className="parallax-sofa pointer-events-none absolute -left-[18%] -top-[18%] h-[136%] w-[136%]">
        <Image
          src={sofaImg}
          alt=""
          aria-hidden
          placeholder="blur"
          quality={82}
          sizes="(min-width: 1024px) 86vw, 136vw"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Camada 3: Notebook */}
      <div className="parallax-notebook pointer-events-none absolute -left-[18%] -top-[18%] h-[136%] w-[136%]">
        <Image
          src={notebookImg}
          alt="Notebook mostrando a tela de gestão do cardápio da Ficha Técnica Pro, com custo, preço e lucro de cada produto"
          placeholder="blur"
          quality={85}
          sizes="(min-width: 1024px) 172vw, 272vw"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
}
