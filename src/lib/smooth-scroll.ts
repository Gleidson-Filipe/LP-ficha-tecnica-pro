import { getLenisInstance } from "@/lib/lenis-instance";
import { beginNavJump, endCurrentNavJump } from "@/lib/nav-jump";

/**
 * Scroll suave via Lenis quando disponível (ver lenis-provider.tsx), com
 * fallback pro scrollIntoView/scrollTo nativo — cobre o instante antes do
 * Lenis montar (raro, mas o clique pode acontecer bem cedo) e o caso de
 * prefers-reduced-motion (LenisProvider não cria instância nesse caso).
 *
 * `lenis.scrollTo(elemento)` recebe o ELEMENTO, não um Y calculado uma vez
 * e congelado — ele mesmo lê getBoundingClientRect() (e scroll-margin-top
 * nativo) no momento em que a animação começa.
 *
 * Pulo instantâneo (immediate: true / behavior: "auto"), sem voo animado —
 * navegação por clique de nav/CTA vai direto pro destino.
 */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(target, { immediate: true });
  } else {
    target.scrollIntoView({ behavior: "auto" });
  }
  endCurrentNavJump();
}

export function scrollToTop() {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  endCurrentNavJump();
}

/** Como `scrollToId`, mas abre um voo de navegação — usar nos cliques de nav/CTA. */
export function navigateToId(id: string) {
  beginNavJump();
  scrollToId(id);
}

/** Como `scrollToTop`, mas abre um voo de navegação — usar no clique do logo. */
export function navigateToTop() {
  beginNavJump();
  scrollToTop();
}

