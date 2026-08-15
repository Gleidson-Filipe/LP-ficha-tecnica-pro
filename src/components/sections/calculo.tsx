import Image from "next/image";
import { calculo as c, CTA } from "@/lib/content";
import { Section, Head, Buy } from "@/components/ui/kit";
import { Reveal } from "@/components/ui/reveal";
import { WhipInUp } from "@/components/ui/whip-in-up";

/**
 * As cinco etapas como LINHAS de uma tabela: número, descrição e o quanto
 * cada uma soma ao custo — com a tela correspondente ao lado.
 */
export function Calculo() {
  return (
    <Section id="calculo" tone="ink">
      <Head label={c.label} title={c.title} lead={c.lead} />

      <div className="rule-t">
        {c.etapas.map((e) => (
          <Reveal key={e.n} className="rule-b">
            <article className="pad grid items-center gap-8 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14 md:py-14">
              <div>
                <div className="flex items-baseline gap-5">
                  <span className="num text-[2.25rem] leading-none text-accent">
                    {e.n}
                  </span>
                  <h3 className="font-display text-h3">
                    <WhipInUp text={e.titulo} />
                  </h3>
                </div>
                <p className="measure mt-5 text-body soft">
                  <WhipInUp text={e.texto} />
                </p>
                {e.valor && (
                  <p className="mt-7 inline-flex items-baseline gap-2 rule-box px-5 py-3">
                    <span className="text-label uppercase soft">
                      <WhipInUp text="soma" />
                    </span>
                    <span className="num text-[1.25rem]">
                      <WhipInUp text={`+ R$ ${e.valor}`} />
                    </span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center rule-box panel p-4 md:p-6">
                <Image
                  src={e.image}
                  alt={`Aba de ${e.titulo} na Ficha Técnica Pro`}
                  width={e.w}
                  height={e.h}
                  sizes="(max-width: 768px) 92vw, 44vw"
                  className="max-h-[44vh] w-auto max-w-full object-contain"
                />
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Resultado — a linha de fecho da tabela */}
      <Reveal className="pad py-16 md:py-20">
        <div className="rule-box panel grid gap-10 p-8 md:grid-cols-2 md:items-center md:gap-14 md:p-12">
          <div>
            <h3 className="font-display text-h2">
              <WhipInUp text={c.resultado.titulo} />
            </h3>

            <dl className="mt-9">
              {c.resultado.linhas.map((l) => (
                <div
                  key={l.rotulo}
                  className="flex items-baseline justify-between gap-6 rule-b py-4"
                >
                  <dt className={l.destaque ? "font-semibold" : "soft"}>
                    <WhipInUp text={l.rotulo} />
                  </dt>
                  <dd
                    className={
                      l.destaque
                        ? "num text-[1.75rem] text-accent"
                        : "num text-[1.125rem]"
                    }
                  >
                    <WhipInUp text={l.valor} />
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-[0.875rem] soft">
              <WhipInUp text={c.nota} />
            </p>
          </div>

          <div className="flex items-center justify-center rule-box p-5 md:p-8">
            <Image
              src={c.resultado.image}
              alt="Tela de resultado com preço sugerido, lucro, margem, CMV e markup"
              width={c.resultado.w}
              height={c.resultado.h}
              sizes="(max-width: 768px) 88vw, 40vw"
              className="max-h-[50vh] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      </Reveal>

      <Reveal className="pad flex flex-col items-start gap-6 rule-t py-14 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[32ch] font-display text-h3">
          <WhipInUp text="Faça essa conta para o cardápio inteiro." />
        </p>
        <Buy l1={CTA.calculo.l1} l2={CTA.calculo.l2} />
      </Reveal>
    </Section>
  );
}
