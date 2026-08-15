import { problema as p } from "@/lib/content";
import { Section, Label } from "@/components/ui/kit";
import { Reveal } from "@/components/ui/reveal";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { TiltCard } from "@/components/unlumen-ui/tilt-card";
import { cn } from "@/lib/utils";

/**
 * Uma seção, três movimentos:
 *   A. "Para quem é"     → público e tipos de negócio
 *   B. "O problema"      → comparação hoje × planilha
 *   C. "O rateio"        → o erro mais grave, em bloco próprio com prova
 *
 * O rateio NÃO entra na tabela: como mais uma linha ele se diluía, e é o
 * argumento mais forte da seção. Ganha headline, os dois parágrafos
 * originais e a prova em números.
 */
export function Problema() {
  const { comparacao: c, rateio: r } = p;

  return (
    <Section id="problema" tone="ink" className="rule-t">
      {/* ─── A. PARA QUEM É ─────────────────────────────────────── */}
      <div className="pad py-16 md:py-20">
        <Label>{p.label}</Label>
        <h2 className="mt-7 max-w-[20ch] font-display text-h2 text-balance">
          <WhipInUp text={p.title} />
        </h2>
        <p className="measure mt-6 text-lead soft">
          <WhipInUp text={p.lead} />
        </p>
      </div>

      <Reveal stagger={0.08} className="cols rule-t md:grid-cols-3">
        {p.gruposNegocio.map((g) => (
          <div key={g.grupo}>
            <p className="num text-[1.125rem] leading-none text-accent">{g.n}</p>
            <h3 className="mt-5 font-display text-h3">
              <WhipInUp text={g.grupo} />
            </h3>
            <p className="mt-2 text-[0.9375rem] soft">
              <WhipInUp text={g.desc} />
            </p>

            <ul className="mt-6 space-y-2.5 rule-t pt-6">
              {g.itens.map((i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 font-display text-[1.0625rem] font-semibold"
                >
                  <span aria-hidden className="size-1.5 shrink-0 bg-accent" />
                  <WhipInUp text={i} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>

      {/* ─── B. O PROBLEMA (ESTRUTURA HORIZONTAL 4 COLUNAS - REFERÊNCIA BAAA4078) ─── */}
      <div className="t-paper bg-paper rule-t">
        {/* CABEÇALHO E GRID 4 COLUNAS (MANTIDO INTACTO COMO O USUÁRIO GOSTOU) */}
        <div className="pad py-16 md:py-20">
          <Label>{p.problemaLabel}</Label>
          <h2 className="mt-7 max-w-[20ch] font-display text-h2 text-balance">
            <WhipInUp text="O faturamento engana." /><br />
            <WhipInUp text="A falta de controle de custos quebra." />
          </h2>

          {/* GRID DE 4 COLUNAS COM DIVISORES VERTICAIS */}
          <Reveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rule-t rule-b mt-12">
            {c.linhas.map((l, index) => (
              <div
                key={l.n}
                className={`${index < 3 ? "lg:rule-r" : ""} ${
                  index % 2 === 0 ? "sm:rule-r" : ""
                }`}
              >
                <TiltCard
                  title={l.antes}
                  description={l.antesTexto}
                  className={cn(
                    "!h-full w-full !bg-transparent !border-0 !rounded-none !shadow-none hover:!scale-100",
                    `py-8 sm:py-10 ${index === 0 ? "pl-8" : ""} ${
                      index < 3 ? "lg:pr-8" : ""
                    } ${index % 2 === 0 ? "sm:pr-8" : "sm:pl-8"} ${
                      index > 0 ? "lg:pl-8" : ""
                    }`,
                    "[&>div:first-child]:!px-0 [&>div:first-child]:!py-0",
                    "[&_.flex-col>div:last-child]:order-first [&_.flex-col>div:last-child]:!mt-0 [&_.flex-col>div:last-child]:mb-6",
                    "[&_h2]:font-display [&_h2]:text-[1.25rem] [&_h2]:font-bold [&_h2]:text-on-paper [&_h2]:transition-colors [&_h2]:duration-300 hover:[&_h2]:!text-on-ink",
                    "[&_p]:text-[0.9375rem] [&_p]:leading-relaxed [&_p]:text-on-paper-soft [&_p]:transition-colors [&_p]:duration-300 hover:[&_p]:!text-on-ink-soft",
                  )}
                >
                  <span className="font-display font-light text-[4.5rem] md:text-[5.5rem] leading-none text-on-paper/30 select-none transition-colors duration-300 group-hover:text-accent">
                    {l.n}
                  </span>
                </TiltCard>
              </div>
            ))}
          </Reveal>
        </div>

        {/* PARTE 2: O ERRO DOS RATEIOS GENÉRICOS (TEMA ESCURO, CENTRALIZADO) */}
        <div className="t-ink rule-t pad py-16 md:py-24">
          <div className="mx-auto max-w-[46rem] text-center">
            <div className="flex justify-center">
              <Label>{r.label}</Label>
            </div>
            <h2 className="mx-auto mt-7 font-display text-h2 text-balance">
              <WhipInUp text={r.titlePre} />
              <span className="underline decoration-accent decoration-[5px] underline-offset-[10px]">
                <WhipInUp text={`"${r.titleMark}"`} />
              </span>
              <WhipInUp text={r.titlePost} />
            </h2>

            <div className="mx-auto mt-8 space-y-4 text-lead soft leading-relaxed">
              <p className="text-[1.125rem] font-medium text-on-ink">
                <WhipInUp text={r.p1} />
              </p>
              <p className="text-[1rem] soft">
                <WhipInUp text={r.p2} />
              </p>
            </div>

            {/* Citação Editorial de Impacto */}
            <p className="mx-auto mt-10 font-display text-[1.5rem] md:text-[1.875rem] font-bold leading-snug text-on-ink">
              <WhipInUp text={r.remate} />
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
