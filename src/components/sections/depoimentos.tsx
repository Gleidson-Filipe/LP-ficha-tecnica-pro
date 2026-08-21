import { depoimentos as d } from "@/lib/content";
import { Section } from "@/components/ui/kit";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

export function Depoimentos() {
  const col1 = d.imagens.slice(0, 3);
  const col2 = d.imagens.slice(3, 6);
  const col3 = d.imagens.slice(6, 9);

  return (
    <Section id="depoimentos" tone="paper" className="py-16 md:py-24 relative overflow-hidden w-full">
      {/* ── Cabeçalho com Título na Esquerda ── */}
      <div className="pad mb-10 md:mb-14">
        <div className="max-w-[min(100%,120rem)] mx-auto flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[22ch] font-display text-h2 text-balance text-left">
            <WhipInUp text={d.title} />
          </h2>
          <p className="max-w-[28ch] text-body soft text-left">
            <span className="num mr-2 text-[2rem] leading-none text-accent">
              <WhipInUp text={d.statN} />
            </span>
            <WhipInUp text={d.statT} />
          </p>
        </div>
      </div>

      {/* ── 3 Colunas Infinitas com Fade Vertical e 9 Imagens Únicas ── */}
      <div className="pad">
        <div className="max-w-[min(100%,120rem)] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_88%,transparent_100%)] max-h-[40rem] md:max-h-[45rem] overflow-hidden">
            <TestimonialsColumn testimonials={col1} duration={26} />
            <TestimonialsColumn testimonials={col2} className="hidden sm:block" duration={32} />
            <TestimonialsColumn testimonials={col3} className="hidden lg:block" duration={28} />
          </div>
        </div>
      </div>
    </Section>
  );
}
