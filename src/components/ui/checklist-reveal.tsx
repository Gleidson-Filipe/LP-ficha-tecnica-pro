"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { AnimationItem } from "lottie-web";

gsap.registerPlugin(useGSAP);

type LottieHost = HTMLElement & { __lottie?: AnimationItem };

/**
 * Lista de checkboxes (Lottie: círculo + tique desenhando) com animação
 * "dominó". Descendo a página, a cascata começa no primeiro item (topo);
 * subindo, começa no último (base) — só a ORDEM muda com a direção, cada
 * item sempre toca a animação pra frente (nunca ao contrário). Dispara de
 * novo toda vez que a lista passa pela tela.
 *
 * Usa IntersectionObserver (não ScrollTrigger onEnter/onEnterBack): igual
 * ao WhipInUp, quando o elemento já nasce dentro da zona de ativação (esta
 * seção ocupa a viewport inteira, então isso acontece com frequência), o
 * ScrollTrigger dispara onEnter no mesmo tick da criação — antes do
 * navegador pintar o estado inicial — e a animação "some". O
 * IntersectionObserver dispara de forma assíncrona (próximo frame),
 * garantindo que o estado inicial sempre é pintado antes do tween começar.
 */
export function ChecklistReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(".chk-item"));
      if (!items.length) return;

      const lotties = items.map((it) => it.querySelector<LottieHost>(".chk-lottie")!);

      const playLottie = (host: LottieHost | undefined) => {
        const anim = host?.__lottie;
        if (!anim) return;
        anim.setDirection(1);
        anim.goToAndStop(0, true);
        anim.play();
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        lotties.forEach((host) => {
          const anim = host?.__lottie;
          anim?.goToAndStop(anim.totalFrames - 1, true);
        });
        return;
      }

      let lastY = window.scrollY;
      let goingDown = true;
      const onScroll = () => {
        const y = window.scrollY;
        goingDown = y >= lastY;
        lastY = y;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const play = (from: "start" | "end") => {
        const order = from === "start" ? items.map((_, i) => i) : items.map((_, i) => i).reverse();
        const each = 0.3;
        const master = gsap.timeline();

        order.forEach((idx, seq) => {
          master.call(() => playLottie(lotties[idx]), undefined, seq * each);
        });
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          play(goingDown ? "start" : "end");
        },
        { rootMargin: "0px", threshold: 0.1 },
      );
      io.observe(el);

      return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
