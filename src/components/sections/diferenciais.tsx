import { diferenciais as d } from "@/lib/content";
import { Section, Label } from "@/components/ui/kit";
import { Reveal } from "@/components/ui/reveal";
import { WhipInUp } from "@/components/ui/whip-in-up";

/**
 * A virada: sai do escuro (a dor) para o claro (a resposta).
 * Layout dos 4 blocos numerados definido pelo cliente.
 */
export function Diferenciais() {
  return (
    <Section id="diferenciais" tone="ink">
      <div className="pad py-16 md:py-20">
        <Label>{d.label}</Label>
        <h2 className="mt-7 max-w-[17ch] font-display text-h2 text-balance">
          <WhipInUp text={d.titlePre} />
          <span className="underline decoration-accent decoration-[5px] underline-offset-[10px]">
            <WhipInUp text={d.titleMark} />
          </span>
          <WhipInUp text={d.titlePost} />
        </h2>
      </div>

      <Reveal stagger={0.09} className="cols rule-t sm:grid-cols-2 lg:grid-cols-4">
        {d.cards.map((c) => (
          <article key={c.n}>
            <p className="num text-[2rem] leading-none text-accent">{c.n}</p>
            <h3 className="mt-6 font-display text-h3">
              <WhipInUp text={c.titulo} />
            </h3>
            <p className="mt-3 text-body soft">
              <WhipInUp text={c.texto} />
            </p>
          </article>
        ))}
      </Reveal>
    </Section>
  );
}
