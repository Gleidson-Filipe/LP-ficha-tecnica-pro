"use client";

import { useState } from "react";
import { preco as p, CHECKOUT } from "@/lib/content";
import { Section, Label } from "@/components/ui/kit";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { AnimatedCheck } from "@/components/ui/animated-check";
import { ChecklistReveal } from "@/components/ui/checklist-reveal";

/* ── Ícones Phosphor estruturais ── */
function BenefitIcon({ icone }: { icone: string }) {
  const shared = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 256 256",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 16,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-6 h-6 text-accent",
  };
  switch (icone) {
    case "escudo":
      return (
        <svg {...shared}>
          <path d="M208,40H48A8,8,0,0,0,40,48v64c0,72,80,112,88,112s88-40,88-112V48A8,8,0,0,0,208,40Z" />
          <polyline points="88 120 112 144 168 88" />
        </svg>
      );
    case "lupa":
      return (
        <svg {...shared}>
          <circle cx="112" cy="112" r="80" />
          <line x1="168.49" y1="168.49" x2="224" y2="224" />
        </svg>
      );
    case "queda":
      return (
        <svg {...shared}>
          <polyline points="232 144 232 208 168 208" />
          <polyline points="232 208 136 112 88 160 24 96" />
        </svg>
      );
    case "relogio":
      return (
        <svg {...shared}>
          <circle cx="128" cy="128" r="96" />
          <polyline points="128 72 128 128 176 128" />
        </svg>
      );
    default:
      return null;
  }
}

export function Preco() {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <Section id="preco" tone="ink" className="py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* ── Grid Principal: Linhas conectadas diretamente ao Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-0 items-start">
        
        {/* ▎COLUNA ESQUERDA: Linhas encostando no canto esquerdo da tela e no card */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          {/* Cabeçalho alinhado ao padding padrão */}
          <div className="pl-[var(--pad)] pr-6 lg:pr-8 mb-8 md:mb-10">
            <Label>{p.label}</Label>
            <h2 className="mt-4 font-display text-[1.85rem] sm:text-[2.25rem] lg:text-[2.1rem] xl:text-[2.55rem] 2xl:text-[2.85rem] font-bold leading-[1.08] tracking-tight">
              <span className="block sm:whitespace-nowrap">
                <WhipInUp text="Assuma o controle da precificação" />
              </span>
              <span className="block sm:whitespace-nowrap">
                <WhipInUp text="do seu negócio agora." />
              </span>
            </h2>
          </div>

          {/* Linhas de Tabela que tocam o canto esquerdo da tela e a borda do card */}
          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {p.beneficios.map((b) => (
              <div
                key={b.titulo}
                className="pl-[var(--pad)] pr-6 lg:pr-8 py-5 sm:py-6 flex items-start gap-4 sm:gap-5 group hover:bg-white/[0.015] transition-colors"
              >
                <div className="mt-0.5">
                  <BenefitIcon icone={b.icone} />
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                    <WhipInUp text={b.titulo} />
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-on-ink-soft leading-relaxed max-w-[50ch]">
                    <WhipInUp text={b.texto} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ▎COLUNA DIREITA: Coluna com padding do grid da página */}
        <div className="lg:col-span-5 pr-[var(--pad)] pl-4 sm:pl-[var(--pad)] lg:pl-0 pt-2 lg:pt-0">
          
          {/* Card Wrapper com profundidade 3D */}
          <div className="relative h-full">
            {/* Camada de Profundidade 3D Offset (muda para rosa ao passar o mouse apenas sobre o botão) */}
            <div
              aria-hidden
              className={`absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-3.5 sm:translate-y-3.5 transition-colors duration-300 pointer-events-none ${
                btnHovered ? "bg-accent" : "bg-[#f5f4ea]"
              }`}
            />

            <div className="relative bg-ink-panel rule-box h-full flex flex-col justify-between overflow-hidden">
              {/* Corpo Principal da Oferta */}
              <div className="p-7 sm:p-8 lg:p-9 flex-1 flex flex-col justify-between">
                <div>
                  {/* Título do Produto */}
                  <div className="border-b border-white/10 pb-5">
                    <p className="text-[0.6875rem] sm:text-xs uppercase text-accent font-semibold tracking-wider font-display">
                      Licença Definitiva
                    </p>
                    <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
                      Ficha Técnica Pro
                    </h3>
                  </div>

                  {/* Bloco de Valor */}
                  <div className="py-6 border-b border-white/10">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-semibold soft">
                        R$
                      </span>
                      <span className="num text-[4.5rem] sm:text-[5.25rem] leading-[0.85] text-white">
                        {p.valor}
                      </span>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm uppercase text-accent tracking-wider font-semibold">
                      / {p.nota}
                    </p>
                  </div>

                  {/* Checklist dos Entregáveis com Lottie Animado */}
                  <ChecklistReveal className="py-6 border-b border-white/10">
                    <ul className="space-y-3.5 text-xs sm:text-sm">
                      {p.inclui.map((item) => (
                        <li key={item} className="chk-item flex items-center gap-3 text-on-ink font-medium">
                          <AnimatedCheck className="h-6 w-6 shrink-0" />
                          <span className="leading-snug">
                            <WhipInUp text={item} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </ChecklistReveal>

                  {/* Botão de Ação (Gatilho exclusivo do efeito 3D rosa) */}
                  <div className="pt-6">
                    <a
                      href={CHECKOUT}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setBtnHovered(true)}
                      onMouseLeave={() => setBtnHovered(false)}
                      className="w-full inline-flex items-center justify-center bg-accent hover:bg-accent-deep text-white font-display font-bold text-xs sm:text-sm md:text-base py-4.5 px-4 sm:px-6 transition-colors active:translate-y-px text-center uppercase tracking-wide leading-tight"
                    >
                      {p.cta}
                    </a>
                    <p className="mt-2.5 text-center text-xs soft">
                      🔒 Pagamento seguro · Acesso vitalício imediato
                    </p>
                  </div>
                </div>

                {/* Box de Garantia Integrada */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-accent shrink-0"
                    >
                      <path d="M208,40H48A8,8,0,0,0,40,48v64c0,72,80,112,88,112s88-40,88-112V48A8,8,0,0,0,208,40Z" />
                      <polyline points="88 120 112 144 168 88" />
                    </svg>
                    <h4 className="font-display text-sm font-bold text-white">
                      {p.garantiaTitulo}
                    </h4>
                  </div>
                  <p className="text-xs soft leading-relaxed">
                    {p.garantiaTexto}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Section>
  );
}
