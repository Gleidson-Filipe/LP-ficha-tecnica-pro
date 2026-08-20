"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import { cn } from "@/lib/utils";

type Tipo = "sucesso" | "falha";

// O Lottie de sucesso desenha o círculo bem menor dentro do próprio canvas
// (~52% de preenchimento) do que o de falha (~90%) — os dois arquivos vêm
// de fontes diferentes e não têm a mesma proporção interna. Sem isso o
// check aparece visivelmente menor que o X mesmo com o mesmo container.
const COMPENSACAO_ESCALA: Record<Tipo, number> = {
  sucesso: 1.7,
  falha: 1,
};

/**
 * Ícone animado (Lottie) do comparativo no verso dos cards de Diferenciais.
 * Ao contrário do AnimatedCheck (carregado por proximidade de scroll), aqui
 * o gatilho é `active` — só vira `true` quando o pai detecta que o card foi
 * virado pela primeira vez. Isso garante que o player (lottie_light) e o
 * JSON da animação nunca são baixados no carregamento da página, só na
 * interação real do usuário.
 */
export function ComparisonIcon({ tipo, active, className }: { tipo: Tipo; active: boolean; className?: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const el = container.current;
    if (!el) return;

    let anim: AnimationItem | null = null;
    let cancelado = false;

    (async () => {
      const [{ default: lottie }, { default: animData }] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        tipo === "sucesso"
          ? import("@/lib/lottie/success-check.json")
          : import("@/lib/lottie/failure-error.json"),
      ]);
      if (cancelado || !container.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: false,
        autoplay: !reduced,
        animationData: animData,
      });
      if (reduced) anim.goToAndStop(anim.totalFrames - 1, true);
    })();

    return () => {
      cancelado = true;
      anim?.destroy();
    };
  }, [active, tipo]);

  return (
    <span aria-hidden className={cn("relative inline-flex shrink-0", className)}>
      <div
        ref={container}
        className="h-full w-full"
        style={{ transform: `scale(${COMPENSACAO_ESCALA[tipo]})` }}
      />
    </span>
  );
}
