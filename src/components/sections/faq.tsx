"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { faq } from "@/lib/content";
import { Section } from "@/components/ui/kit";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { isNavJumping, deferDuringNavJump, cancelDeferred } from "@/lib/nav-jump";

gsap.registerPlugin(useGSAP);

function FaqRow({
  item,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const isFirstRender = useRef(true);
  // A resposta anima com WhipInUp só na primeira vez que a pergunta abre.
  // Marca ao FECHAR (nunca ao abrir): se marcasse na abertura, o re-render
  // causado pelo próprio setState derrubaria o WhipInUp antes dele
  // terminar de animar — mesmo cuidado do modulos.tsx/calculo.tsx. Como
  // aqui o conteúdo nunca desmonta (só encolhe via height:0), a troca de
  // ramo (WhipInUp vs texto puro) é o que evita reanimar.
  const [everOpened, setEverOpened] = useState(false);

  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        if (!isOpen && contentRef.current) {
          gsap.set(contentRef.current, { height: 0, opacity: 0 });
        }
        return;
      }

      if (isOpen) {
        // Transição suave de fundo da linha de ponta a ponta
        gsap.to(rowRef.current, {
          backgroundColor: "#0f0f11",
          duration: 0.45,
          ease: "power2.out",
        });

        // Cor do título
        gsap.to(titleRef.current, {
          color: "#ffffff",
          duration: 0.35,
          ease: "power2.out",
        });

        // Badge circular Phosphor
        gsap.to(badgeRef.current, {
          backgroundColor: "#ffffff",
          color: "#0f0f11",
          scale: 1.05,
          duration: 0.35,
          ease: "power2.out",
        });

        // Rotação do ícone em 45 graus
        gsap.to(iconRef.current, {
          rotate: 45,
          duration: 0.4,
          ease: "power2.out",
        });

        // Expansão fluida de altura com GSAP
        gsap.to(contentRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
        });

        // Revelação do texto: na primeira vez, o próprio WhipInUp cuida
        // (ver JSX) — nas próximas, o texto já nasce pronto, sem tween.
      } else {
        // Fundo voltando suavemente para transparente
        gsap.to(rowRef.current, {
          backgroundColor: "transparent",
          duration: 0.35,
          ease: "power2.inOut",
        });

        // Título voltando para cor escura
        gsap.to(titleRef.current, {
          color: "#0f0f11",
          duration: 0.3,
          ease: "power2.inOut",
        });

        // Badge voltando ao estado padrão
        gsap.to(badgeRef.current, {
          backgroundColor: "#0f0f11",
          color: "#ffffff",
          scale: 1,
          duration: 0.35,
          ease: "power2.inOut",
        });

        // Rotação do ícone voltando a 0
        gsap.to(iconRef.current, {
          rotate: 0,
          duration: 0.35,
          ease: "power2.inOut",
        });

        // Recolhimento fluido de altura
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.inOut",
        });

        if (!everOpened) setEverOpened(true);
      }
    },
    { dependencies: [isOpen], scope: rowRef }
  );

  // Entrada do badge "+" em scroll — mesmo padrão dos ícones da frente dos
  // cards de Diferenciais (fade+scale+rotate, zero-flash via `style` no
  // JSX abaixo, nunca só `gsap.set` dentro do effect). `clearProps` no fim
  // devolve o elemento ao controle de CSS puro (a classe `group-hover:*`
  // some com o hover normal antes do primeiro toggle, mas com a
  // transformação ainda inline via GSAP ela ficaria bloqueada depois —
  // mesmo problema de especificidade já visto no calculo.tsx).
  useGSAP(
    () => {
      const el = badgeRef.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { clearProps: "transform,opacity" });
        return;
      }

      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          if (isNavJumping()) {
            deferDuringNavJump(el, () => {
              io.unobserve(el);
              io.observe(el);
            });
            return;
          }
          gsap.to(el, {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.6,
            ease: "back.out(1.8)",
            clearProps: "transform,opacity",
          });
          io.disconnect();
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);

      return () => {
        cancelDeferred(el);
        io.disconnect();
      };
    },
    { scope: rowRef },
  );

  // Mesmo realce de fundo ao passar o mouse usado nas faixas da seção
  // "Precificação Inteligente" (calculo.tsx): tingir sutilmente a linha
  // inteira, não só o texto. Só ativo com a pergunta fechada — aberta, o
  // fundo já é o escuro do estado ativo e não deve reagir ao hover.
  const handleMouseEnter = () => {
    if (isOpen) return;
    gsap.to(rowRef.current, {
      backgroundColor: "rgba(234, 232, 217, 0.25)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(badgeRef.current, { scale: 1.05, duration: 0.2, ease: "power2.out" });
  };
  const handleMouseLeave = () => {
    if (isOpen) return;
    gsap.to(rowRef.current, {
      backgroundColor: "transparent",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(badgeRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full will-change-[background-color]"
    >
      {/* Botão ocupa a linha INTEIRA (borda a borda) — o padding/centralização
          fica no conteúdo de dentro, não no botão, pra clicar em qualquer
          ponto da linha abrir a pergunta, não só em cima do texto. */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left cursor-pointer select-none group focus-visible:outline-2 focus-visible:outline-accent"
        aria-expanded={isOpen}
      >
        <div className="pad max-w-4xl mx-auto w-full py-5 sm:py-6 flex items-center justify-between gap-4">
          <span
            ref={titleRef}
            className="font-display text-[1rem] sm:text-[1.125rem] md:text-[1.1875rem] font-bold leading-snug text-ink transition-colors duration-200"
          >
            <WhipInUp text={item.q} />
          </span>

          {/* Badge circular Phosphor Icons */}
          <span
            ref={badgeRef}
            aria-hidden
            style={{ borderRadius: "9999px", opacity: 0, transform: "scale(0.6) rotate(-8deg)" }}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-ink text-white flex items-center justify-center shrink-0"
          >
            <svg
              ref={iconRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="none"
              stroke="currentColor"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-current"
            >
              <line x1="40" y1="128" x2="216" y2="128" />
              <line x1="128" y1="40" x2="128" y2="216" />
            </svg>
          </span>
        </div>
      </button>

      {/* Resposta com animação GSAP */}
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="pad max-w-4xl mx-auto w-full">
          <p
            ref={textRef}
            className={`pb-7 text-sm sm:text-base leading-relaxed max-w-[65ch] ${
              isOpen ? "text-on-ink-soft" : "text-ink/75"
            }`}
          >
            {everOpened ? item.a : <WhipInUp text={item.a} />}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <Section id="faq" tone="paper" className="py-16 sm:py-20 md:py-24 rule-t overflow-hidden">
      {/* ── Título Centralizado ── */}
      <div className="pad max-w-4xl mx-auto w-full text-center mb-12 sm:mb-16">
        <h2 className="font-display text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.25rem] font-bold tracking-tight text-ink">
          <WhipInUp text={faq.title} />
        </h2>
      </div>

      {/* ── Lista de Perguntas Full-Bleed ── */}
      <div className="w-full border-t border-b border-ink/20 divide-y divide-ink/15">
        {faq.items.map((item, index) => (
          <FaqRow
            key={item.q}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => toggle(index)}
          />
        ))}
      </div>
    </Section>
  );
}
