"use client";

import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";
import checkAnim from "@/lib/lottie/checkmark-circle.json";
import { cn } from "@/lib/utils";

/**
 * Checkmark animado (círculo + tique desenhando), Lottie. O ChecklistReveal
 * controla o replay item a item (dominó): acha a instância guardada em
 * `.chk-lottie.__lottie` e chama play()/goToAndStop() nela diretamente —
 * evita precisar de ref/imperative-handle cruzando a árvore de children.
 */
export function AnimatedCheck({ className }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const anim = lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: checkAnim,
    });
    anim.goToAndStop(0, true);
    (el as HTMLDivElement & { __lottie?: AnimationItem }).__lottie = anim;
    return () => anim.destroy();
  }, []);

  return (
    <span aria-hidden className={cn("relative inline-flex h-9 w-9 shrink-0", className)}>
      <div ref={container} className="chk-lottie h-full w-full" />
    </span>
  );
}
