"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { modulos } from "@/lib/content";
import { Section, Head } from "@/components/ui/kit";

gsap.registerPlugin(useGSAP);

/** Os módulos como abas: a tela cheia de cada aba é o foco. */
export function Modulos() {
  const [i, setI] = useState(0);
  const painel = useRef<HTMLDivElement>(null);
  const item = modulos.items[i];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        painel.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power1.out" },
      );
    },
    { scope: painel, dependencies: [i] },
  );

  return (
    <Section id="modulos" tone="paper" className="rule-t">
      <Head label={modulos.label} title={modulos.title} lead={modulos.lead} />

      <div className="pad pb-20">
        <div
          role="tablist"
          aria-label="Módulos da planilha"
          className="flex flex-wrap gap-2"
        >
          {modulos.items.map((it, idx) => (
            <button
              key={it.tab}
              role="tab"
              id={`aba-${idx}`}
              aria-selected={idx === i}
              aria-controls={`painel-${idx}`}
              data-on={idx === i}
              onClick={() => setI(idx)}
              className="tab rule-box px-5 py-3 font-display text-[0.9375rem] font-semibold"
            >
              {it.tab}
            </button>
          ))}
        </div>

        <div
          ref={painel}
          role="tabpanel"
          id={`painel-${i}`}
          aria-labelledby={`aba-${i}`}
          className="mt-8"
        >
          <div className="flex items-center justify-center rule-box panel p-4 md:p-10">
            <Image
              key={item.image}
              src={item.image}
              alt={`Aba ${item.tab} da Ficha Técnica Pro`}
              width={item.w}
              height={item.h}
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="max-h-[62vh] w-auto max-w-full object-contain"
            />
          </div>

          <div className="mt-8 max-w-[52ch]">
            <h3 className="font-display text-h3">{item.titulo}</h3>
            <p className="mt-3 text-body soft">{item.texto}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
