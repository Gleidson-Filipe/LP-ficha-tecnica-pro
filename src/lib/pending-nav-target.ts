/**
 * Alvo de navegação (clique no nav/CTA) ainda "em voo". `scroll-restore.tsx`
 * chama `ScrollTrigger.refresh()` no `load` da página e de novo em
 * `document.fonts.ready` — nenhum dos dois é garantido acontecer antes de
 * um clique no nav (imagens e fontes podem terminar de carregar bem depois
 * do clique). Os dois recalculam o espaço reservado pela seção de vídeo
 * (sticky) e o reflow da troca de fonte, o que desloca onde as seções
 * abaixo realmente ficam — se um scroll suave já estiver em voo (alvo
 * calculado ANTES de qualquer um dos dois), ele pousa no lugar errado.
 * Este módulo deixa o header avisar qual foi o último alvo clicado, pra o
 * scroll-restore corrigir a posição se um desses recálculos acontecer no
 * meio do caminho.
 */

let pendingId: string | null = null;
let clearTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Registra o alvo do clique mais recente. Expira sozinho depois de um
 * tempo generoso pra cobrir fontes lentas pra carregar — depois disso, se
 * o usuário já seguiu em frente, um recálculo tardio não deve puxá-lo de
 * volta.
 */
export function setPendingNavTarget(id: string) {
  pendingId = id;
  if (clearTimer) clearTimeout(clearTimer);
  clearTimer = setTimeout(() => {
    pendingId = null;
  }, 4000);
}

/** Lê e limpa o alvo pendente (uso único). */
export function consumePendingNavTarget(): string | null {
  const id = pendingId;
  pendingId = null;
  if (clearTimer) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
  return id;
}
