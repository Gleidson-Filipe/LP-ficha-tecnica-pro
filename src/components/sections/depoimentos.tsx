import Image from "next/image";
import { depoimentos as d } from "@/lib/content";
import { Section, Label, Fill } from "@/components/ui/kit";
import { Reveal } from "@/components/ui/reveal";

/** Colunas CSS: as fotos têm proporções diferentes e nenhuma pode ser cortada. */
export function Depoimentos() {
  return (
    <Section id="depoimentos" tone="paper">
      <div className="pad py-16 md:py-20">
        <Label>{d.label}</Label>
        <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[17ch] font-display text-h2 text-balance">
            {d.titlePre}
            <Fill>{d.titleFill}</Fill>
            {d.titlePost}
          </h2>
          <p className="max-w-[28ch] text-body soft">
            <span className="num mr-2 text-[2rem] leading-none text-accent">
              {d.statN}
            </span>
            {d.statT}
          </p>
        </div>
      </div>

      <div className="pad columns-1 gap-5 pb-20 sm:columns-2 lg:columns-3">
        {d.imagens.map((img, i) => (
          <Reveal key={img.src} className="mb-5 break-inside-avoid">
            <Image
              src={img.src}
              alt={`Depoimento de cliente da Ficha Técnica Pro ${i + 1}`}
              width={img.w}
              height={img.h}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
              className="h-auto w-full rule-box"
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
