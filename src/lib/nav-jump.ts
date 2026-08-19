import type { VirtualScrollData } from "lenis";
import { getLenisInstance } from "@/lib/lenis-instance";
import { clearPendingNavTarget } from "@/lib/pending-nav-target";

/**
 * Coordena o "voo" de um scroll de navegação (clique no nav/CTA/logo): um
 * salto do Lenis que pode atravessar várias seções de uma vez. Sem isso,
 * cada seção no caminho dispara seu trabalho lazy (splitWord do WhipInUp,
 * import do lottie_light, chunk do three.js, leituras de layout do
 * destaque do nav) quase no mesmo frame — medido em produção, até 2s de
 * reflow forçado num único salto.
 *
 * A ideia central: durante o voo, quem tenta disparar não é enfileirado
 * com um estado calculado — é apenas marcado e REOBSERVADO no fim. O
 * próprio IntersectionObserver do consumidor decide o veredito (visível ou
 * não) no frame seguinte, sem nenhuma leitura de layout aqui.
 *
 * Deliberadamente NÃO usa o `onComplete` do `lenis.scrollTo`: uma segunda
 * chamada de `scrollTo` sobrescreve o callback anterior sem chamá-lo, e uma
 * interrupção do usuário para a animação sem nunca disparar `onComplete`.
 * Em ambos os casos o voo ficaria pendurado até o timeout de segurança. O
 * fim do voo é derivado de `targetScroll`/`animatedScroll` (escalares,
 * zero custo de layout) e do evento `virtual-scroll` do próprio Lenis —
 * ambos se autocorrigem, o `onComplete` não.
 */

export type NavJumpToken = number;

type ReobserveFn = () => void;

const LANDING_WINDOW_VH = 1.5;
const ARRIVAL_EPSILON_PX = 2;
const INTERRUPT_MIN_DELTA = 6;
const SAFETY_TIMEOUT_MS = 3000;
const SCROLL_KEYS = new Set([
  " ",
  "Spacebar",
  "PageUp",
  "PageDown",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

let currentToken: NavJumpToken = 0;
let queue = new Map<Element, ReobserveFn>();
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let listenersAttached = false;
const endListeners = new Set<() => void>();

function clearSafetyTimeout() {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function drain() {
  // Snapshot antes de disparar: um `reobserve()` pode gerar entries novas
  // (o elemento volta a intersectar) que tentariam se enfileirar de novo —
  // com `currentToken` já zerado por quem chama `drain()`, `deferDuringNavJump`
  // recusa, então elas não voltam pra fila.
  const items = queue;
  queue = new Map();
  for (const reobserve of items.values()) reobserve();
}

function notifyEnd() {
  for (const fn of endListeners) fn();
}

function attachListenersOnce() {
  if (listenersAttached) return;
  const lenis = getLenisInstance();
  if (!lenis) return;
  listenersAttached = true;

  lenis.on("scroll", () => {
    if (currentToken === 0) return;
    if (Math.abs(lenis.targetScroll - lenis.animatedScroll) <= ARRIVAL_EPSILON_PX) {
      endNavJump(currentToken, "arrived");
    }
  });

  lenis.on("virtual-scroll", (data: VirtualScrollData) => {
    if (currentToken === 0) return;
    if (Math.abs(data.deltaY) > INTERRUPT_MIN_DELTA || Math.abs(data.deltaX) > INTERRUPT_MIN_DELTA) {
      endNavJump(currentToken, "interrupted");
    }
  });

  window.addEventListener(
    "keydown",
    (e) => {
      if (currentToken === 0) return;
      if (SCROLL_KEYS.has(e.key)) endNavJump(currentToken, "interrupted");
    },
    { passive: true },
  );
}

/** Abre um voo. Retorna 0 (= nenhum voo) se não houver instância Lenis — sob
 * `prefers-reduced-motion` o LenisProvider não cria uma, e sem Lenis não
 * existe "voo" pra coordenar (o scroll cai no `scrollIntoView` nativo). */
export function beginNavJump(): NavJumpToken {
  // Chave de segurança: com isto em `true`, nenhum voo nunca abre — todo
  // o resto do arquivo vira no-op (isNavJumping() sempre false,
  // deferDuringNavJump sempre false), então o site volta a se comportar
  // exatamente como antes desse mecanismo existir, em qualquer consumidor,
  // sem precisar reverter cada arquivo. Usado enquanto o bug relatado
  // ("depois do nav, nada anima") não é confirmado/isolado — não removido
  // por completo pra não perder a investigação já feita.
  const KILL_SWITCH = true;
  if (KILL_SWITCH) return 0;

  const lenis = getLenisInstance();
  if (!lenis) return 0;

  attachListenersOnce();

  currentToken += 1;
  const token = currentToken;
  clearSafetyTimeout();
  timeoutId = setTimeout(() => endNavJump(token, "timeout"), SAFETY_TIMEOUT_MS);
  return token;
}

/** Re-mira sem abrir/fechar voo: renova o timeout, mantém o token atual.
 * Usado por `correctPendingTarget` (scroll-restore.tsx), que pode re-chamar
 * `lenis.scrollTo` no meio de um voo já em andamento. */
export function renewNavJump(): void {
  if (currentToken === 0) return;
  const token = currentToken;
  clearSafetyTimeout();
  timeoutId = setTimeout(() => endNavJump(token, "timeout"), SAFETY_TIMEOUT_MS);
}

export function endNavJump(
  token: NavJumpToken,
  reason: "arrived" | "interrupted" | "timeout",
): void {
  if (token === 0 || token !== currentToken) return;
  currentToken = 0;
  clearSafetyTimeout();
  // O usuário assumiu o controle do scroll — nada deve puxá-lo de volta ao
  // alvo do clique original depois disso (ver clearPendingNavTarget).
  if (reason === "interrupted") clearPendingNavTarget();
  drain();
  notifyEnd();
}

export function isNavJumping(): boolean {
  return currentToken !== 0;
}

/**
 * `true` => o chamador não deve rodar nada agora (foi adiado, `reobserve`
 * será chamado no fim do voo). `false` => rode normalmente (sem voo em
 * andamento, ou já dentro da janela de pouso do destino).
 *
 * A janela de pouso precisa ser maior que uma tela cheia: com
 * `rootMargin: "0px"`, o topo da seção de destino cruza a borda da
 * viewport quando ainda falta exatamente 1×innerHeight pra chegar — uma
 * janela menor que isso abriria tarde demais e o primeiro título do
 * destino seria revelado em texto puro em vez de animar.
 */
export function deferDuringNavJump(el: Element, reobserve: ReobserveFn): boolean {
  if (currentToken === 0) return false;

  const lenis = getLenisInstance();
  if (lenis) {
    const remaining = Math.abs(lenis.targetScroll - lenis.animatedScroll);
    if (remaining < LANDING_WINDOW_VH * window.innerHeight) return false;
  }

  queue.set(el, reobserve);
  return true;
}

/** Remove da fila — chamar no cleanup de todo consumidor que usa `deferDuringNavJump`. */
export function cancelDeferred(el: Element): void {
  queue.delete(el);
}

/** Notifica o fim do voo (ex.: site-header ressincroniza o destaque do nav). */
export function onNavJumpEnd(fn: () => void): () => void {
  endListeners.add(fn);
  return () => endListeners.delete(fn);
}
