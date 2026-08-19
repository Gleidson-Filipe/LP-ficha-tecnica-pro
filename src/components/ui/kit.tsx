"use client";

import { forwardRef, type ReactNode } from "react";
import { CTA, CHECKOUT } from "@/lib/content";
import { cn } from "@/lib/utils";
import { WhipInUp } from "@/components/ui/whip-in-up";
import { useCtaFx, useCrookedIn, CtaGlow, CtaShine, CtaEcho } from "@/components/ui/cta-fx";
import { navigateToId } from "@/lib/smooth-scroll";

/** Bloco de seção. Define o tom (escuro/claro) e o respiro vertical. */
export const Section = forwardRef<
  HTMLElement,
  {
    id?: string;
    tone?: "ink" | "paper";
    className?: string;
    children: ReactNode;
  }
>(function Section({ id, tone = "ink", className, children }, ref) {
  return (
    <section
      ref={ref}
      id={id}
      className={cn(tone === "ink" ? "t-ink" : "t-paper", className)}
    >
      {children}
    </section>
  );
});

/** Etiqueta da seção — uma por seção, em accent. Orienta o olho antes do título. */
export function Label({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-3 text-label uppercase text-accent">
      <span aria-hidden className="inline-block h-[2px] w-7 bg-accent" />
      <WhipInUp text={children} />
    </p>
  );
}

/** Cabeçalho: label + título dominante + lead. A hierarquia vive aqui. */
export function Head({
  label,
  title,
  lead,
}: {
  label?: string;
  title: string;
  lead?: ReactNode;
}) {
  return (
    <div className="pad py-16 md:py-20">
      {label && <Label>{label}</Label>}
      <h2
        className={cn(
          "max-w-[19ch] font-display text-h2 text-balance",
          label && "mt-7",
        )}
      >
        <WhipInUp text={title} />
      </h2>
      {lead && <p className="measure mt-6 text-lead soft">{lead}</p>}
    </div>
  );
}

/** Palavra dentro de uma célula preenchida — o destaque tipográfico da marca. */
export function Fill({ children }: { children: ReactNode }) {
  return (
    <span className="bg-accent px-[0.16em] pb-[0.06em] text-white">
      {children}
    </span>
  );
}

/**
 * Botão de compra. SEMPRE preenchido — um CTA de conversão nunca é vazado
 * nem transparente.
 */
export function Buy({
  href = CHECKOUT,
  className,
  size = "lg",
  variant = "accent",
  l1,
  l2,
}: {
  href?: string;
  className?: string;
  size?: "lg" | "sm";
  variant?: "accent" | "ink";
  /** Linha de apoio (opcional). Cada seção adapta a sua. */
  l1?: string;
  /** Linha principal, sempre presente. */
  l2: string;
}) {
  const fx = useCtaFx<HTMLAnchorElement>();
  useCrookedIn(fx);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
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
    <a
      ref={fx}
      href={href}
      onClick={handleClick}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden text-center",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        variant === "accent"
          ? "cta-btn-fluid text-white focus-visible:outline-accent"
          : "bg-ink text-on-ink hover:bg-ink-raise focus-visible:outline-ink",
        size === "lg" ? "px-10 py-5" : "px-6 py-3.5",
        className,
      )}
      style={{ opacity: 0, transform: "translate(22px, 26px) rotate(6deg)" }}
    >
      {variant === "accent" && <CtaGlow />}
      <CtaShine />
      {/* Uma linha só: texto de apoio em peso normal + a ação em negrito */}
      {size === "sm" && (
        <span className="font-display text-[0.9375rem] font-semibold sm:hidden text-white">
          <CtaEcho>
            <WhipInUp text={CTA.heroMobile.l2} />
          </CtaEcho>
        </span>
      )}
      <span
        className={cn(
          "leading-tight text-white",
          size === "lg" ? "text-[1.0625rem]" : "hidden text-[0.9375rem] sm:inline",
        )}
      >
        <CtaEcho>
          {l1 && (
            <span className="font-normal opacity-90">
              <WhipInUp text={l1} />{" "}
            </span>
          )}
          <span className="font-display font-bold">
            <WhipInUp text={l2} />
          </span>
        </CtaEcho>
      </span>
    </a>
  );
}
