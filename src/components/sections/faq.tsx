import { faq } from "@/lib/content";
import { Section, Label } from "@/components/ui/kit";
import { WhipInUp } from "@/components/ui/whip-in-up";

/** Perguntas como linhas da tabela. <details> nativo: funciona sem JS. */
export function Faq() {
  return (
    <Section id="faq" tone="paper" className="rule-t">
      <div className="pad py-16 md:py-20">
        <Label>{faq.label}</Label>
        <h2 className="mt-7 max-w-[16ch] font-display text-h2 text-balance">
          <WhipInUp text={faq.title} />
        </h2>
      </div>

      <div className="rule-t">
        {faq.items.map((item) => (
          <details key={item.q} className="q rule-b">
            <summary className="pad flex cursor-pointer list-none items-center gap-6 py-7">
              <span className="flex-1 font-display text-[1.125rem] font-semibold md:text-[1.25rem]">
                <WhipInUp text={item.q} />
              </span>
              <span
                aria-hidden
                className="q-sign relative block size-5 shrink-0 text-accent transition-transform duration-300"
              >
                <span className="absolute left-0 top-1/2 h-[2px] w-5 -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-0 h-5 w-[2px] -translate-x-1/2 bg-current" />
              </span>
            </summary>
            <p className="pad measure pb-8 text-body soft">
              <WhipInUp text={item.a} />
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
