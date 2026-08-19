"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(CustomEase, useGSAP);

/**
 * Curva do "whipInUp" do cult-ui (biblioteca original é Framer Motion —
 * aqui é a mesma curva de bezier recriada em GSAP via CustomEase, este
 * projeto usa GSAP em tudo, nunca Framer Motion).
 */
let whipEaseReady = false;
function ensureWhipEase() {
  if (whipEaseReady) return;
  CustomEase.create("whipInUp", "0.5, -0.15, 0.25, 1.05");
  whipEaseReady = true;
}

/**
 * Observer único compartilhado por todas as instâncias de WhipInUp/CountUp
 * da página (podem passar de 100). Um `new IntersectionObserver` por
 * componente significa dezenas de observers alocados na hidratação, todos
 * fazendo o mesmo trabalho de bookkeeping — um só observer com um mapa de
 * callbacks faz o mesmo (dispara uma vez, ao entrar na tela) por uma fração
 * do custo.
 */
let sharedIO: IntersectionObserver | null = null;
const ioCallbacks = new Map<Element, () => void>();

function ensureSharedIO() {
  if (sharedIO) return sharedIO;
  sharedIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cb = ioCallbacks.get(entry.target);
        if (!cb) continue;
        ioCallbacks.delete(entry.target);
        sharedIO?.unobserve(entry.target);
        cb();
      }
    },
    // Sem margem: dispara exatamente quando o elemento cruza a borda real
    // do viewport, nunca antes — não é sobre "entrar na seção", é sobre o
    // elemento em si entrar na área visível da tela.
    { rootMargin: "0px" },
  );
  return sharedIO;
}

function observeOnce(el: Element, cb: () => void) {
  const io = ensureSharedIO();
  ioCallbacks.set(el, cb);
  io.observe(el);
  return () => {
    ioCallbacks.delete(el);
    io.unobserve(el);
  };
}

/**
 * Quebra uma palavra (texto puro) em spans por letra, prontos para o tween
 * de entrada. Espelho exato de `revertWord` (abaixo) na direção contrária —
 * roda só no instante em que a animação vai disparar, nunca no mount, para
 * a página não nascer com milhares de spans de letra de seções inteiras que
 * ninguém está vendo.
 */
function splitWord(wordEl: HTMLElement, word: string) {
  wordEl.style.overflow = "hidden";
  wordEl.textContent = "";
  for (const ch of word) {
    const letter = document.createElement("span");
    letter.className = "wiu-letter inline-block";
    letter.textContent = ch;
    wordEl.appendChild(letter);
  }
}

/**
 * Texto que "chicoteia" de baixo para cima, letra a letra, cada palavra
 * mascarada em overflow-hidden (permite quebra de linha normal). Dispara
 * uma vez quando entra no viewport — inclusive no load, se já nascer
 * visível (ex.: Hero), sem precisar de scroll.
 *
 * Por padrão nasce como texto puro (sem spans de letra) e só quebra em
 * letras dentro do próprio callback do IntersectionObserver, no instante em
 * que vai animar — ver `splitWord`/`revertWord`. O root nasce com
 * opacity:0 (evita o "flash" de aparecer pronto) e só é revelado depois de
 * splitWord + gsap.set posicionarem as letras, tudo na mesma volta
 * síncrona, então não existe frame intermediário onde o texto apareça
 * pronto ou fora de posição.
 *
 * `eager`: para o texto que já nasce visível no primeiro paint (Hero,
 * SiteHeader) — medido que quebrar em letras ali DENTRO do callback custa
 * caro demais bem no momento mais crítico (CPU 4× real: LCP saltou de
 * ~2.000ms pra ~3.600ms). Esses continuam quebrados em letras já no JSX
 * (como sempre foram, sem custo de criação de DOM em runtime), só a
 * `opacity:0` no root em vez de por letra. Reservar pra conteúdo que
 * realmente aparece sem scroll: o resto da página (>85% do texto) usa o
 * modo padrão e é onde está o ganho real de leveza.
 *
 * Usa IntersectionObserver nativo (não ScrollTrigger): com dezenas dessas
 * animações na mesma página, o bookkeeping interno do ScrollTrigger para
 * "elemento já ativo no momento da criação" ficava dessincronizado do DOM
 * (o tween reportava progresso mas o transform não era escrito) — o
 * IntersectionObserver dispara de forma confiável em ambos os casos:
 * elemento já visível no mount ou entrando depois via scroll.
 */
export function WhipInUp({
  text,
  className,
  eager = false,
}: {
  text: string;
  className?: string;
  eager?: boolean;
}) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const wordEls = el?.querySelectorAll<HTMLElement>(".wiu-word");
      if (!el || !wordEls?.length) return;

      // Quebrar em letras (spans) só enquanto a animação precisa delas.
      // Feito o tween, cada palavra volta a ser um texto único — sem isso,
      // a página inteira fica permanentemente cheia de spans por letra, o
      // que quebra a seleção (o navegador desenha um retângulo por span,
      // ficando "picotada") e o copy/paste (o espaçamento entre palavras é
      // feito via margin, não caractere de espaço real, então colar gruda
      // as palavras). Recomendação da própria autora do GSAP SplitText
      // (Cassie Evans) para esse exato problema: reverter o split assim
      // que a animação terminar, em vez de manter o DOM fragmentado.
      //
      // Importante: o revert some com as letras, mas mantém o <span> de
      // cada palavra (o wrapper com align-top/padding que evita cortar
      // rabichos de letras como "g" e "j" durante o slide). Trocar isso por
      // texto solto (sem wrapper nenhum) muda a métrica vertical da linha —
      // o texto "salta" ~6px pra cima no instante do revert, porque o
      // wrapper tem alinhamento/altura diferentes do fluxo normal de texto.
      // Mantendo o wrapper e só limpando as letras de dentro dele, a caixa
      // nunca muda: revert fica imperceptível.
      //
      // O "overflow-hidden" em si só existe pra mascarar o slide da letra
      // durante a animação — uma vez revertido não sobra nada pra cortar, e
      // deixá-lo ligado faz o Chrome pintar a seleção de texto com uma
      // reentrância exatamente no espaço entre palavras (cada wrapper vira
      // seu próprio "clipping container" e a marcação de seleção nele fica
      // ligeiramente destacada da marcação do espaço ao lado). Desligar o
      // overflow no revert não mexe em tamanho/posição — só no que fica
      // visível — então é seguro e resolve o serrilhado da seleção.
      const revertWord = (wordEl: HTMLElement, word: string) => {
        wordEl.textContent = word;
        wordEl.style.overflow = "visible";
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (!eager) {
          // Modo lazy nasceu como texto puro — nada a reverter, só revelar.
        } else {
          wordEls.forEach((w) => revertWord(w, w.dataset.word ?? ""));
        }
        el.style.opacity = "1";
        return;
      }

      const words = Array.from(wordEls);

      // fromTo com "from" explícito (nunca .to()/.set() puro): reduz o
      // trabalho do GSAP, mas NÃO elimina a leitura de DOM — para
      // propriedades CSS customizadas (o `--wiu-p` daqui), o CSSPlugin do
      // GSAP sempre chama getComputedStyle no target pra descobrir o
      // startValue, mesmo com os dois lados explícitos (isso só vale pra
      // propriedades numéricas comuns). Medido via trace de performance:
      // com várias instâncias de WhipInUp entrando no viewport juntas (ex.:
      // título + parágrafo + botão do rodapé), esse getComputedStyle cai
      // logo depois do splitWord (que acabou de invalidar o layout ao
      // recriar os spans de letra) — leitura-logo-após-escrita é a receita
      // clássica de reflow forçado. Empurrar o tween pro próximo frame via
      // rAF deixa TODOS os splitWord (escrita) deste lote de interseção
      // terminarem antes de QUALQUER leitura começar, em vez de intercalar
      // escrita/leitura/escrita/leitura a cada instância.
      const runTween = () => {
        requestAnimationFrame(() => {
          const letters = el.querySelectorAll<HTMLElement>(".wiu-letter");
          gsap.fromTo(
            letters,
            { "--wiu-p": 200 },
            {
              "--wiu-p": 0,
              duration: 0.58,
              ease: "whipInUp",
              stagger: 0.007,
              onComplete: () => {
                words.forEach((w) => revertWord(w, w.dataset.word ?? ""));
              },
            },
          );
        });
      };

      if (eager) {
        // Já nasce quebrado em letras via JSX, com --wiu-p:200 já no
        // inline style (ver JSX) — nada a posicionar aqui, só revelar.
        ensureWhipEase();
        el.style.opacity = "1";
        return observeOnce(el, runTween);
      }

      return observeOnce(el, () => {
        ensureWhipEase();
        words.forEach((w) => splitWord(w, w.dataset.word ?? ""));
        el.style.opacity = "1";
        runTween();
      });
    },
    { scope: root },
  );

  const words = text.split(" ");

  return (
    // font-kerning:none nos dois estados (letras separadas e texto puro) —
    // sem isso, o navegador aplica kerning só no texto puro (letras
    // separadas nunca têm kerning entre si), e a diferença de largura entre
    // pares de letras kerned mudaria a largura da palavra entre os dois
    // estados, deslocando o texto no instante da quebra/reversão.
    <span
      ref={root}
      className={className}
      style={{ fontKerning: "none", opacity: 0 }}
    >
      {words.map((word, wi) => (
        <span key={wi}>
          <span
            className="wiu-word inline-block align-top"
            data-word={word}
            style={
              eager
                ? { overflow: "hidden", paddingBottom: "0.2em", marginBottom: "-0.2em" }
                : { paddingBottom: "0.2em", marginBottom: "-0.2em" }
            }
          >
            {eager
              ? Array.from(word).map((ch, ci) => (
                  <span
                    key={ci}
                    className="wiu-letter inline-block"
                    style={{ "--wiu-p": 200 } as CSSProperties}
                  >
                    {ch}
                  </span>
                ))
              : word}
          </span>
          {wi < words.length - 1 ? (
            <span style={{ verticalAlign: "top" }}> </span>
          ) : (
            ""
          )}
        </span>
      ))}
    </span>
  );
}

/**
 * Número que "chicoteia" pra cima como o WhipInUp e, na sequência, cresce
 * suavemente de um valor menor até `to` (em vez de já nascer no valor final).
 * Dispara junto com o resto do texto ao redor, mesmo gatilho de viewport.
 */
export function CountUpStat({
  to,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const wrapEl = wrap.current;
      const el = num.current;
      if (!wrapEl || !el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = `${prefix}${to}${suffix}`;
        gsap.set(el, { clearProps: "transform,opacity" });
        return;
      }

      const from = 0;
      const counter = { val: from };
      el.textContent = `${prefix}${from}${suffix}`;
      gsap.set(el, { yPercent: 200, opacity: 1 });

      return observeOnce(wrapEl, () => {
        ensureWhipEase();
        gsap
          .timeline()
          .to(el, { yPercent: 0, duration: 0.58, ease: "whipInUp" })
          .to(
            counter,
            {
              val: to,
              duration: 1.3,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
              },
            },
            "+=0.04",
          );
      });
    },
    { scope: wrap },
  );

  return (
    <span
      ref={wrap}
      className="inline-block overflow-hidden align-top"
      style={{ paddingBottom: "0.2em", marginBottom: "-0.2em" }}
    >
      <span
        ref={num}
        className={cn("inline-block tabular-nums", className)}
        style={{ opacity: 0 }}
      >
        {prefix}
        {to}
        {suffix}
      </span>
    </span>
  );
}

/**
 * Componente que recebe uma string como "6", "100%", "30s", "7 dias",
 * executa o efeito de chicotear de baixo para cima (Whip In Up) e,
 * imediatamente após assentar, dispara a contagem (Counter Up) de 0 até o valor final.
 */
export function CountUpWhip({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const wrap = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  const match = value.match(/^([^\d]*?)(\d+)(.*)$/);
  const prefix = match ? match[1] : "";
  const to = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : "";

  useGSAP(
    () => {
      const wrapEl = wrap.current;
      const el = num.current;
      if (!wrapEl || !el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = value;
        gsap.set(el, { clearProps: "transform,opacity" });
        return;
      }

      const counter = { val: 0 };
      el.textContent = `${prefix}0${suffix}`;
      gsap.set(el, { yPercent: 200, opacity: 1 });

      return observeOnce(wrapEl, () => {
        ensureWhipEase();
        gsap
          .timeline()
          .to(el, { yPercent: 0, duration: 0.58, ease: "whipInUp" })
          .to(
            counter,
            {
              val: to,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
              },
            },
            "+=0.04",
          );
      });
    },
    { scope: wrap },
  );

  return (
    <span
      ref={wrap}
      className="inline-block overflow-hidden align-top"
      style={{ paddingBottom: "0.2em", marginBottom: "-0.2em" }}
    >
      <span
        ref={num}
        className={cn("inline-block tabular-nums", className)}
        style={{ opacity: 0 }}
      >
        {value}
      </span>
    </span>
  );
}
