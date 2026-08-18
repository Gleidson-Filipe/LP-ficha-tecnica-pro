import { solucao as s } from "@/lib/content";
import { Section, Label, Buy } from "@/components/ui/kit";
import { Reveal } from "@/components/ui/reveal";
import { WhipInUp, CountUpWhip } from "@/components/ui/whip-in-up";
import { ParallaxMockup } from "@/components/ui/parallax-mockup";
import { ChecklistReveal } from "@/components/ui/checklist-reveal";
import { AnimatedCheck } from "@/components/ui/animated-check";

/**
 * Logo depois da falsa margem (fim de Problema): resume em três blocos o
 * que a tela de gestão do cardápio entrega, com o mockup do notebook e a
 * faixa de números por cima da imagem. Texto vem do site antigo
 * (Assets/Solucao); layout é novo.
 */
export function Solucao() {
  return (
    <Section id="solucao" tone="paper" className="rule-t">
      <div className="grid lg:h-[calc(100dvh-73px)] lg:grid-cols-[minmax(0,63%)_minmax(0,37%)]">
        {/* ── Mockup + faixa de números ── */}
        <div className="relative aspect-[1200/909] w-full lg:aspect-auto lg:h-full">
          <ParallaxMockup />

          <div className="t-ink bg-ink relative grid grid-cols-2 sm:grid-cols-4 lg:absolute lg:inset-x-0 lg:bottom-0">
            {s.stats.map((st) => (
              <div key={st.rotulo} className="rule-l first:rule-l-0 px-6 py-5 sm:px-8">
                <p className="font-display text-[1.375rem] font-bold leading-none">
                  <CountUpWhip value={st.valor} />
                </p>
                <p className="mt-1.5 text-[0.8125rem] soft">
                  <WhipInUp text={st.rotulo} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Copy ── */}
        <div className="pad flex flex-col justify-center py-16 md:py-20 lg:py-10">
          <Label>{s.label}</Label>
          <h2 className="mt-5 max-w-[16ch] font-display text-h2 text-balance lg:mt-4">
            <WhipInUp text={s.title} />
          </h2>

          <Reveal stagger={0.1} className="mt-6 space-y-6 rule-t pt-6 lg:mt-5 lg:space-y-5 lg:pt-5">
            <ChecklistReveal>
              {s.blocos.map((b, bi) => (
                <div key={b.n} className={bi > 0 ? "mt-6 lg:mt-5" : undefined}>
                  <p className="flex items-baseline gap-3 font-display text-[1.0625rem] font-semibold">
                    <span className="text-accent">{b.n}.</span>
                    <WhipInUp text={b.titulo} />
                  </p>
                  <ul className="mt-2.5 space-y-1.5 pl-8">
                    {b.itens.map((item) => (
                      <li key={item} className="chk-item flex items-center gap-2.5 text-[0.9375rem] soft">
                        <AnimatedCheck />
                        <WhipInUp text={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ChecklistReveal>
          </Reveal>

          <div className="mt-6 lg:mt-6">
            <Buy href="#modulos" l2={s.cta} />
          </div>
        </div>
      </div>
    </Section>
  );
}
