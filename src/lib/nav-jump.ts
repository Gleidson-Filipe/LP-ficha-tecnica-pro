/**
 * Coordena o "voo" de um scroll de navegação (clique no nav/CTA/logo).
 *
 * Historicamente isso cobria uma animação de vários frames que podia
 * atravessar várias seções (interrompível por wheel/teclado/touch, com
 * timeout de segurança caso nunca "chegasse"). Hoje `scrollToId`/`scrollToTop`
 * (smooth-scroll.ts) pulam DIRETO pro destino (`immediate: true`) — não há
 * mais voo de várias etapas pra interromper, então toda a detecção de
 * interrupção foi removida daqui. `beginNavJump`/`endCurrentNavJump` seguem
 * existindo como um par estritamente síncrono: abre e fecha na mesma volta
 * de execução, só pra manter o contrato que outros componentes (WhipInUp,
 * Modulos, Diferenciais, SiteHeader) já leem via `isNavJumping`/
 * `deferDuringNavJump`/`onNavJumpEnd` — na prática esses hooks nunca chegam
 * a observar uma janela "em voo" de verdade (o token abre e fecha antes de
 * qualquer IntersectionObserver/scroll assíncrono rodar), mas o contrato
 * continua válido caso o salto volte a ser animado no futuro.
 */

export type NavJumpToken = number;

type ReobserveFn = () => void;

let currentToken: NavJumpToken = 0;
let queue = new Map<Element, ReobserveFn>();
const endListeners = new Set<() => void>();

function drain() {
  const items = queue;
  queue = new Map();
  requestAnimationFrame(() => {
    for (const reobserve of items.values()) {
      try {
        reobserve();
      } catch {
        // Silencioso se o elemento tiver sido desmontado
      }
    }
  });
}

function notifyEnd() {
  for (const fn of endListeners) {
    try {
      fn();
    } catch {
      // Ignora erro em listener individual
    }
  }
}

/** Abre um voo de navegação. */
export function beginNavJump(): NavJumpToken {
  currentToken += 1;
  return currentToken;
}

export function endNavJump(
  token: NavJumpToken,
): void {
  if (token === 0 || token !== currentToken) return;
  currentToken = 0;
  drain();
  notifyEnd();
}

/** Encerra o voo atual diretamente (ex.: chamado logo após o lenis.scrollTo). */
export function endCurrentNavJump(): void {
  if (currentToken !== 0) {
    endNavJump(currentToken);
  }
}

export function isNavJumping(): boolean {
  return currentToken !== 0;
}

/**
 * Registra um elemento para ser reobservado assim que o voo de navegação terminar.
 * Retorna `true` se estamos em voo (chamador deve adiar), `false` se pode rodar normal.
 */
export function deferDuringNavJump(el: Element, reobserve: ReobserveFn): boolean {
  if (currentToken === 0) return false;
  queue.set(el, reobserve);
  return true;
}

/** Remove da fila — chamar no cleanup de todo consumidor. */
export function cancelDeferred(el: Element): void {
  queue.delete(el);
}

/** Notifica o fim do voo (ex.: site-header ressincroniza o destaque do nav). */
export function onNavJumpEnd(fn: () => void): () => void {
  endListeners.add(fn);
  return () => endListeners.delete(fn);
}
