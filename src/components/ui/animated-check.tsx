"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import { cn } from "@/lib/utils";

export type LottieHost = HTMLElement & {
  __lottie?: AnimationItem;
  /** Se o ChecklistReveal pedir play() antes do chunk do lottie chegar. */
  __lottiePending?: boolean;
  __lottieStatic?: boolean;
};

/**
 * Checkmark animado (círculo + tique desenhando), Lottie. O ChecklistReveal
 * controla o replay item a item (dominó): acha a instância guardada em
 * `.chk-lottie.__lottie` e chama play()/goToAndStop() nela diretamente —
 * evita precisar de ref/imperative-handle cruzando a árvore de children.
 *
 * O player (lottie_light, ~168KB vs 300KB do build completo — sem
 * expressions, que essa animação não usa) só é baixado quando o item está
 * perto da tela, via IntersectionObserver — nunca no carregamento inicial
 * da página. O JSON da animação (3,8KB) também vai junto no dynamic import.
 */
export function AnimatedCheck({ className }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current as LottieHost | null;
    if (!el) return;

    let anim: AnimationItem | null = null;
    let cancelado = false;

    const carregar = async () => {
      const [{ default: lottie }, { default: checkAnim }] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        import("@/lib/lottie/checkmark-circle.json"),
      ]);
      if (cancelado || !container.current) return;

      anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: checkAnim,
      });
      el.__lottie = anim;

      if (el.__lottieStatic) {
        anim.goToAndStop(anim.totalFrames - 1, true);
      } else if (el.__lottiePending) {
        // O ChecklistReveal já tentou tocar antes do chunk chegar — honra agora.
        el.__lottiePending = false;
        anim.setDirection(1);
        anim.goToAndStop(0, true);
        anim.play();
      } else {
        anim.goToAndStop(0, true);
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.__lottieStatic = true;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        void carregar();
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);

    return () => {
      cancelado = true;
      io.disconnect();
      anim?.destroy();
    };
  }, []);

  return (
    <span aria-hidden className={cn("relative inline-flex h-9 w-9 shrink-0", className)}>
      <div ref={container} className="chk-lottie h-full w-full" />
    </span>
  );
}
