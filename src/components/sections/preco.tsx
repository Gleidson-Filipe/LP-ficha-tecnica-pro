import Image from "next/image";
import { preco as p, depoimentos, CTA } from "@/lib/content";
import { Section, Label, Buy } from "@/components/ui/kit";
import { Reveal } from "@/components/ui/reveal";
import { WhipInUp } from "@/components/ui/whip-in-up";

/**
 * Área de conversão. A prova social fica AO LADO do preço — é aqui que a
 * objeção aparece, não na seção de depoimentos lá em cima.
 */
export function Preco() {
  return (
    <Section id="preco" tone="ink">
      <div className="pad py-16 md:py-20">
        <Label>{p.label}</Label>
        <h2 className="mt-7 max-w-[16ch] font-display text-h2 text-balance">
          <WhipInUp text={p.title} />
        </h2>
      </div>

      <Reveal className="cols rule-t lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* Oferta */}
        <div>
          <ul>
            {p.inclui.map((item, i) => (
              <li
                key={item}
                className={`flex items-start gap-4 py-4 text-body ${
                  i < p.inclui.length - 1 ? "rule-b" : ""
                }`}
              >
                <span aria-hidden className="mt-2 block size-2 shrink-0 bg-accent" />
                <WhipInUp text={item} />
              </li>
            ))}
          </ul>

          <div className="mt-10 rule-t pt-10">
            <div className="flex items-start gap-2">
              <span className="mt-3 font-display text-[1.5rem] font-semibold soft">
                <WhipInUp text="R$" />
              </span>
              <span className="num text-[5rem] leading-[0.85] md:text-[6.5rem]">
                <WhipInUp text={p.valor} />
              </span>
            </div>
            <p className="mt-4 text-lead soft">
              <WhipInUp text={p.nota} />
            </p>
            <Buy l1={CTA.preco.l1} l2={CTA.preco.l2} className="mt-9 w-full sm:w-auto" />
          </div>

          <div className="mt-10 rule-t pt-8">
            <h3 className="font-display text-h3">
              <WhipInUp text={p.garantiaTitulo} />
            </h3>
            <p className="measure mt-3 text-body soft">
              <WhipInUp text={p.garantiaTexto} />
            </p>
          </div>
        </div>

        {/* Prova social colada na decisão */}
        <div>
          <p className="text-label uppercase soft">
            <WhipInUp text="Quem já comprou" />
          </p>
          <div className="mt-6 space-y-5">
            {depoimentos.imagens.slice(1, 3).map((img, i) => (
              <Image
                key={img.src}
                src={img.src}
                alt={`Depoimento de cliente da Ficha Técnica Pro ${i + 1}`}
                width={img.w}
                height={img.h}
                sizes="(max-width: 1024px) 90vw, 420px"
                className="h-auto w-full rule-box"
              />
            ))}
          </div>
          <p className="mt-7 text-body soft">
            <span className="num mr-2 text-[1.75rem] leading-none text-accent">
              <WhipInUp text={depoimentos.statN} />
            </span>
            <WhipInUp text={depoimentos.statT} />
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
