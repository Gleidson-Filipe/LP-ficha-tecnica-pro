import { getLenisInstance } from "@/lib/lenis-instance";

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
 */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(target);
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

export function scrollToTop() {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
