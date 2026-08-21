"use client";

import { problema as p, CHECKOUT } from "@/lib/content";
import { Section } from "@/components/ui/kit";
import { Reveal } from "@/components/ui/reveal";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { SpinDot } from "@/components/ui/spin-dot";
import { TiltCard } from "@/components/unlumen-ui/tilt-card";
import { RateioFocus } from "@/components/sections/rateio-focus";
import { useCtaFx, useCrookedIn, CtaGlow, CtaShine, CtaEcho } from "@/components/ui/cta-fx";
import { navigateToId } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

/**
 * Uma seção, três movimentos naturais e contínuos:
 *   A. "Para quem é"     → público e tipos de negócio
 *   B. "O problema"      → comparação hoje × planilha (fundo claro)
 *   C. "O rateio"        → a falsa margem com foco interativo (fundo escuro)
 */
export function Problema() {
  const { comparacao: c, rateio: r } = p;
  const ctaFx = useCtaFx<HTMLAnchorElement>();
  useCrookedIn(ctaFx);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (CHECKOUT.startsWith("#")) {
      e.preventDefault();
      const id = CHECKOUT.slice(1);
      const target = document.getElementById(id);
      if (target) {
        navigateToId(id);
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    }
  };

  return (
    <Section id="problema" tone="ink" className="rule-t">
      {/* ─── A. PARA QUEM É ─────────────────────────────────────── */}
      <div className="pad py-16 md:py-20 min-[120.0625rem]:px-0">
        <div className="max-w-[min(100%,120rem)] mx-auto min-[120.0625rem]:px-[4rem]">
          <h2 className="max-w-[20ch] font-display text-h2 text-balance">
            <WhipInUp text={p.title} />
          </h2>
          <p className="mt-6 max-w-[46ch] text-lead soft">
            <WhipInUp text={p.lead} />
          </p>
        </div>
      </div>

      <div className="w-full rule-t">
        <div className="w-full min-[120.0625rem]:max-w-[120rem] min-[120.0625rem]:mx-auto min-[120.0625rem]:pl-[4rem] min-[120.0625rem]:pr-0">
          <Reveal
            stagger={0.08}
            className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#212124] min-[120.0625rem]:border-x min-[120.0625rem]:border-[#212124] max-w-[min(100%,120rem)] mx-auto"
          >
            {p.gruposNegocio.map((g) => (
              <div key={g.grupo} className="p-8 lg:p-10">
                <h3 className="font-display text-h3">
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
                      <SpinDot />
                      <WhipInUp text={i} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      {/* ─── Barra de Ação (Abaixo das colunas) ─── */}
      <div className="rule-t pad py-10 md:py-12 min-[120.0625rem]:px-0">
        <div className="max-w-[min(100%,120rem)] mx-auto min-[120.0625rem]:pl-[4rem] min-[120.0625rem]:pr-0 flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-8">
          <p className="text-body soft max-w-[48ch] text-center sm:text-left text-sm sm:text-base leading-relaxed">
            <WhipInUp text="A Ficha Técnica Pro foi feita para se adaptar a qualquer um desses negócios citados acima." />
          </p>
          <a
            ref={ctaFx}
            href={CHECKOUT}
            onClick={handleCtaClick}
            className="group relative inline-flex items-center justify-center overflow-hidden cta-btn-fluid text-white font-body py-4.5 px-8 sm:px-10 text-center shrink-0"
            style={{ opacity: 0, transform: "translate(1.375rem, 1.625rem) rotate(6deg)" }}
          >
            <CtaGlow />
            <CtaShine />
            <CtaEcho className="items-center whitespace-nowrap">
              <span className="font-body font-bold text-[1rem] sm:text-[1.125rem] lg:text-[1.1875rem] whitespace-nowrap text-white">
                <WhipInUp text="Automatizar minha operação" />
              </span>
            </CtaEcho>
          </a>
        </div>
      </div>

      {/* ─── B. O PROBLEMA (FUNDO CLARO COM 4 COLUNAS) ─── */}
      <div className="t-paper bg-paper rule-t w-full py-16 md:py-20">
        <div className="pad min-[120.0625rem]:px-0">
          <div className="max-w-[min(100%,120rem)] mx-auto min-[120.0625rem]:pl-[4rem] min-[120.0625rem]:pr-0">
            <h2 className="max-w-[20ch] font-display text-h2 text-balance">
              <WhipInUp text="O faturamento engana." /><br />
              <WhipInUp text="A falta de controle de custos quebra." />
            </h2>
          </div>
        </div>

        {/* GRID DE 4 COLUNAS EM FAIXA FULL-BLEED */}
        <div className="w-full min-[120.0625rem]:rule-t min-[120.0625rem]:rule-b mt-12">
          <div className="pad min-[120.0625rem]:px-0">
            <div className="max-w-[min(100%,120rem)] mx-auto min-[120.0625rem]:pl-[4rem] min-[120.0625rem]:pr-0">
              <Reveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rule-t rule-b min-[120.0625rem]:rule-t-0 min-[120.0625rem]:rule-b-0 rule-l rule-r">
                {c.linhas.map((l, index) => (
                  <div
                    key={l.n}
                    className={`${index < 3 ? "lg:rule-r" : ""} ${
                      index % 2 === 0 ? "sm:rule-r" : ""
                    }`}
                  >
                    <TiltCard
                      title={<WhipInUp text={l.antes} />}
                      description={<WhipInUp text={l.antesTexto} />}
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
                        <WhipInUp text={l.n} />
                      </span>
                    </TiltCard>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* ─── C. A FALSA MARGEM (FUNDO ESCURO COM FOCO INTERATIVO) ─── */}
      <div className="t-ink bg-ink rule-t pad py-16 md:py-24 flex flex-col justify-center">
        <div className="max-w-[min(100%,120rem)] mx-auto w-full">
          <div className="mx-auto max-w-[46rem] text-center">
            <h2 className="mx-auto font-display text-h2 text-balance">
              <WhipInUp text={`${r.titlePre}"${r.titleMark}"${r.titlePost}`} />
            </h2>
          </div>

          <RateioFocus
            p1={r.p1}
            p1Emphasis={["A maioria", "igualmente", "todos"]}
            p2={r.p2}
            p2Emphasis={["erro fatal", "mascarando", "real"]}
            remate={r.remate}
            remateEmphasis={["sem saber", "lucro de verdade", "prejuízo"]}
          />
        </div>
      </div>
    </Section>
  );
}
