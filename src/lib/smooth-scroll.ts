import { getLenisInstance } from "@/lib/lenis-instance";
import { beginNavJump, isNavJumping, renewNavJump } from "@/lib/nav-jump";

/**
 * Scroll suave via Lenis quando disponível (ver lenis-provider.tsx), com
 * fallback pro scrollIntoView/scrollTo nativo — cobre o instante antes do
 * Lenis montar (raro, mas o clique pode acontecer bem cedo) e o caso de
 * prefers-reduced-motion (LenisProvider não cria instância nesse caso).
 *
 * `lenis.scrollTo(elemento)` recebe o ELEMENTO, não um Y calculado uma vez
 * e congelado — ele mesmo lê getBoundingClientRect() (e scroll-margin-top
 * nativo) no momento em que a animação começa. Diferente do
 * scrollIntoView nativo, o Lenis também tem estado de animação próprio
 * (via seu Animate interno), então chamar scrollTo() de novo com um alvo
 * atualizado substitui a animação em voo de forma administrada pelo
 * próprio Lenis, em vez do comportamento de "reiniciar do zero" do scroll
 * nativo do navegador.
 *
 * `scrollToId`/`scrollToTop` ficam "burros" de propósito: não abrem voo
 * (ver nav-jump.ts) sozinhos, só renovam um voo já em andamento — é o
 * caminho usado por `correctPendingTarget` (scroll-restore.tsx), que
 * re-mira o Lenis sem ser um clique de nav novo. Quem inicia navegação de
 * verdade usa `navigateToId`/`navigateToTop`.
 */
function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const lenis = getLenisInstance();
  if (lenis) {
    if (isNavJumping()) renewNavJump();
    lenis.scrollTo(target);
  } else {
    target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
  }
}

export function scrollToTop() {
  const lenis = getLenisInstance();
  if (lenis) {
    if (isNavJumping()) renewNavJump();
    lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  }
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
