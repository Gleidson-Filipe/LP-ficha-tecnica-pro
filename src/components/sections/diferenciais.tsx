"use client";

import { useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { diferenciais as d } from "@/lib/content";
import { Section } from "@/components/ui/kit";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { ComparisonIcon } from "@/components/ui/comparison-icon";
import { cn } from "@/lib/utils";
import { isNavJumping, deferDuringNavJump, cancelDeferred } from "@/lib/nav-jump";

gsap.registerPlugin(useGSAP);

/* ── Ícones ─────────────────────────────────────────────────────────── */
function DiferencialIcon({ icone }: { icone: string }) {
  switch (icone) {
    case "calculadora":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none"
          stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"
          className="w-8 h-8 text-accent">
          <rect x="40" y="32" width="176" height="192" rx="16" />
          <line x1="80" y1="72" x2="176" y2="72" />
          <circle cx="88" cy="120" r="10" fill="currentColor" />
          <circle cx="128" cy="120" r="10" fill="currentColor" />
          <circle cx="168" cy="120" r="10" fill="currentColor" />
          <circle cx="88" cy="168" r="10" fill="currentColor" />
          <circle cx="128" cy="168" r="10" fill="currentColor" />
          <circle cx="168" cy="168" r="10" fill="currentColor" />
        </svg>
      );
    case "energia":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none"
          stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"
          className="w-8 h-8 text-accent">
          <polygon points="160 16 48 144 120 144 96 240 208 112 136 112 160 16" />
        </svg>
      );
    case "tempo":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none"
          stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"
          className="w-8 h-8 text-accent">
          <circle cx="128" cy="128" r="96" />
          <polyline points="128 72 128 128 176 128" />
        </svg>
      );
    case "embalagem":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none"
          stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"
          className="w-8 h-8 text-accent">
          <polygon points="128 24 224 80 128 136 32 80 128 24" />
          <polyline points="224 80 224 176 128 232 32 176 32 80" />
          <line x1="128" y1="136" x2="128" y2="232" />
          <polyline points="176 52 80 108" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Ícone da frente do card, revelado com o mesmo padrão de entrada em scroll
 * usado no resto do site (WhipInUp/Reveal): o estado inicial escondido é
 * escrito direto no JSX (`opacity:0` no style, abaixo) — nunca só via
 * `gsap.set` dentro do effect, que roda depois do primeiro paint e deixa uma
 * janela onde o ícone pisca visível antes de sumir e reanimar.
 */
function AnimatedDiferencialIcon({ icone }: { icone: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
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
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      className="inline-block"
      style={{ opacity: 0, transform: "scale(0.6) rotate(-8deg)" }}
    >
      <DiferencialIcon icone={icone} />
    </span>
  );
}

/* ── Card individual ─────────────────────────────────────────────────── */
/**
 * Recebe:
 *  - cardRef    → ref callback do elemento que gira
 *  - onFlip     → callback do pai que faz a animação e gerencia o timer
 *  - roundedClasses
 */
function DiferencialCard({
  c,
  idx,
  cardRef,
  onFlip,
  roundedClasses,
  opened,
}: {
  c: (typeof d.cards)[0];
  idx: number;
  cardRef: (el: HTMLDivElement | null) => void;
  onFlip: () => void;
  roundedClasses: string;
  opened: boolean;
}) {

  return (
    /* Wrapper → perspectiva (câmera 3D) */
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      {/* Inner → plataforma que gira com as duas faces */}
      <div
        ref={cardRef}
        className="relative w-full h-[440px] sm:h-[470px] lg:h-[500px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ── FRENTE ── */}
        <div
          className={cn(
            "absolute inset-0 bg-paper p-7 sm:p-8 lg:p-9 flex flex-col justify-between border-black/[0.08] shadow-lg",
            // Divisórias perfeitamente controladas entre as células (sem vazar gap preto)
            idx < 3 ? "border-b lg:border-b-0 lg:border-r" : "border-b-0",
            idx % 2 === 0 ? "sm:border-r" : "sm:border-r-0 lg:border-r",
            idx < 2 ? "sm:border-b lg:border-b-0" : "sm:border-b-0",
            idx === 3 && "lg:border-r-0",
            roundedClasses
          )}
          style={{
            backfaceVisibility: "hidden",
            width: idx < 3 ? "calc(100% + 1px)" : "100%",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <AnimatedDiferencialIcon icone={c.icone} />
              <span className="text-on-paper/20" title="Clique para ver mais">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
            </div>
            <h3 className="font-display font-bold text-xl lg:text-[1.35rem] leading-snug text-on-paper">
              <WhipInUp text={c.titulo} />
            </h3>
          </div>
          <div className="mt-auto pt-6">
            <p className="text-[0.875rem] lg:text-[0.9375rem] text-on-paper-soft leading-relaxed">
              <WhipInUp text={c.texto} />
            </p>
          </div>
        </div>

        {/* ── VERSO ── */}
        <div
          className={cn(
            "absolute inset-0 bg-ink-panel text-on-ink p-7 sm:p-8 lg:p-9 flex flex-col justify-between border border-white/10 shadow-2xl",
            roundedClasses
          )}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Comparativo
            </span>
            <h4 className="mt-3 font-display text-lg lg:text-xl font-bold text-on-ink leading-snug">
              {c.pergunta}
            </h4>
          </div>
          <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2.5 text-sm text-on-ink-soft">
              <ComparisonIcon tipo="falha" active={opened} className="w-6 h-6" />
              <span className="leading-tight">{c.concorrente}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[0.9375rem] font-bold text-white">
              <ComparisonIcon tipo="sucesso" active={opened} className="w-6 h-6" />
              <span className="leading-tight">{c.destaque}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Seção pai ────────────────────────────────────────────────────────── */
/**
 * Orquestra:
 *  - Peek autônomo: um card por vez, aleatório, a cada 7–10 s
 *  - Flip via clique: 180° com auto-desvire após 10 s de inatividade
 */
export function Diferenciais() {
  const sectionRef = useRef<HTMLElement>(null);

  // Refs dos elementos que giram (um por card)
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  // Estado flip por card
  const flippedStatesRef = useRef<boolean[]>(d.cards.map(() => false));
  // Timer de auto-desvire
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Índices já abertos ao menos uma vez — único estado React aqui, só pra
  // disparar o carregamento sob demanda dos lotties do verso (nunca antes
  // do usuário realmente virar o card). O flip em si continua 100%
  // imperativo via refs/GSAP, sem re-render a cada clique.
  const [openedIdx, setOpenedIdx] = useState<Set<number>>(() => new Set());

  /* ── Loop de peek sequencial — só roda enquanto a seção está na tela ── */
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let timeout: ReturnType<typeof setTimeout>;

      const pickAndPeek = () => {
        // Índices disponíveis: cards que existem no DOM e NÃO estão virados
        const available = cardElementsRef.current
          .map((el, i) => (el && !flippedStatesRef.current[i] ? i : -1))
          .filter((i) => i >= 0);

        if (available.length === 0) {
          // Todos virados → tenta de novo em 3 s
          timeout = setTimeout(pickAndPeek, 3000);
          return;
        }

        // Escolhe um índice aleatório entre os disponíveis
        const chosen = available[Math.floor(Math.random() * available.length)];
        const inner = cardElementsRef.current[chosen];
        if (!inner) return;

        const angle = 6 + Math.random() * 4; // 6–10° sutil

        gsap.timeline({
          onComplete: () => {
            // Cooldown aleatório de 7–10 s antes do próximo peek
            const cooldown = 7000 + Math.random() * 3000;
            timeout = setTimeout(pickAndPeek, cooldown);
          },
        })
          .to(inner, { rotateY: angle, duration: 0.8, ease: "power1.inOut" })
          .to(inner, { rotateY: 0, duration: 1.1, ease: "elastic.out(0.8, 0.6)" });
      };

      const stopPeek = () => {
        clearTimeout(timeout);
        cardElementsRef.current.forEach((current) => {
          if (!current) return;
          gsap.killTweensOf(current);
          gsap.set(current, { rotateY: 0 });
        });
      };

      // Sem `pin: true` — a seção nunca fica "presa" fora da tela, então
      // não faz sentido usar ScrollTrigger só pra isso; IntersectionObserver
      // dá play/pause de verdade: entrou, começa; saiu, pára de vez (não só
      // "não dispara mais", o loop existente é morto e os cards voltam à
      // posição neutra), e reentrar recomeça do zero.
      const el = sectionRef.current;
      if (!el) return;

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (isNavJumping()) {
              deferDuringNavJump(el, () => {
                io.unobserve(el);
                io.observe(el);
              });
              return;
            }
            timeout = setTimeout(pickAndPeek, 600);
          } else {
            stopPeek();
          }
        },
        { rootMargin: "0px 0px -25% 0px" }, // equivalente a "top 75%"
      );
      io.observe(el);

      return () => {
        cancelDeferred(el);
        io.disconnect();
        stopPeek();
      };
    },
    { scope: sectionRef }
  );

  // ── Flip via clique (centralizado no pai) ─────────────────────────────
  /** Desvira todos os cards que ainda estiverem virados */
  const unflipAll = useCallback(() => {
    cardElementsRef.current.forEach((current, i) => {
      if (current && flippedStatesRef.current[i]) {
        flippedStatesRef.current[i] = false;
        gsap.killTweensOf(current);
        gsap.to(current, { rotateY: 0, duration: 0.55, ease: "power2.inOut" });
      }
    });
    flipTimerRef.current = null;
  }, []);

  /**
   * Chamado pelo card ao ser clicado:
   * - Anima o flip (0↔180°)
   * - Reseta o timer de 10 s; quando disparar, desvira tudo
   */
  const handleCardFlip = useCallback((idx: number) => {
    const inner = cardElementsRef.current[idx];
    if (!inner) return;

    flippedStatesRef.current[idx] = !flippedStatesRef.current[idx];
    const abrindo = flippedStatesRef.current[idx];
    gsap.killTweensOf(inner);
    gsap.to(inner, {
      rotateY: abrindo ? 180 : 0,
      duration: 0.55,
      ease: "power2.inOut",
      // Só marca o card como "aberto" (disparando o carregamento/play do
      // Lottie) depois que o giro 3D termina — se disparasse no clique, a
      // animação de desenho do ícone rodava com o verso ainda de perfil
      // (quase invisível) e terminava antes do card ficar de frente.
      onComplete: () => {
        if (abrindo) {
          setOpenedIdx((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)));
        }
      },
    });

    // Reinicia o timer de auto-desvire a cada interação
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    const anyFlipped = flippedStatesRef.current.some(Boolean);
    if (anyFlipped) {
      flipTimerRef.current = setTimeout(unflipAll, 10_000);
    }
  }, [unflipAll]);

  return (
    <Section ref={sectionRef} id="diferenciais" tone="ink" className="py-16 md:py-24">
      {/* ── Cabeçalho ── */}
      <div className="pad mb-12 md:mb-16">
        <h2 className="max-w-[26ch] font-display text-h2 text-balance">
          <WhipInUp text={d.titlePre} />
          <WhipInUp text={d.titleMark} />
          <WhipInUp text={d.titlePost} />
        </h2>
      </div>

      {/* ── Grid dos 4 Cards ── */}
      <div className="pad">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-transparent">
          {d.cards.map((c, idx) => {
            const roundedClasses = cn(
              // Mobile (1 col)
              idx === 0 && "rounded-t-2xl sm:rounded-t-none",
              idx === 3 && "rounded-b-2xl sm:rounded-b-none",
              // Tablet (2 cols)
              idx === 0 && "sm:rounded-tl-2xl sm:rounded-tr-none sm:rounded-bl-none sm:rounded-br-none lg:rounded-l-3xl lg:rounded-r-none",
              idx === 1 && "sm:rounded-tr-2xl sm:rounded-tl-none sm:rounded-bl-none sm:rounded-br-none lg:rounded-none lg:rounded-tr-none lg:rounded-tl-none",
              idx === 2 && "sm:rounded-bl-2xl sm:rounded-br-none sm:rounded-tl-none sm:rounded-tr-none lg:rounded-none lg:rounded-bl-none lg:rounded-br-none",
              idx === 3 && "sm:rounded-br-2xl sm:rounded-bl-none sm:rounded-tl-none sm:rounded-tr-none lg:rounded-r-3xl lg:rounded-l-none"
            );

            return (
              <DiferencialCard
                key={c.n}
                c={c}
                idx={idx}
                cardRef={(el) => {
                  cardElementsRef.current[idx] = el;
                }}
                onFlip={() => handleCardFlip(idx)}
                roundedClasses={roundedClasses}
                opened={openedIdx.has(idx)}
              />
            );
          })}
        </div>
      </div>
    </Section>
  );
}
