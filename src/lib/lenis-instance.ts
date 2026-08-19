import type Lenis from "lenis";

/**
 * Instância única do Lenis, criada pelo LenisProvider. Compartilhada aqui
 * (em vez de Context) porque quem precisa dela — cliques de nav no header,
 * a correção de scroll em scroll-restore.tsx — não está necessariamente
 * dentro da árvore de um Provider React no momento da chamada (handlers de
 * evento, efeitos fora de contexto).
 */
let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenisInstance(): Lenis | null {
  return instance;
}
