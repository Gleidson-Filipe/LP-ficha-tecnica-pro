/**
 * Alvo de navegação (clique no nav/CTA) ainda "em voo", junto da posição
 * (absoluta, em px) que ele tinha NO MOMENTO DO CLIQUE. A altura da página
 * pode continuar mudando por um tempo depois — fontes com font-display:swap
 * trocando, o espaço reservado pela seção de vídeo (sticky) recalculado
 * pelo ScrollTrigger — e isso desloca onde as seções abaixo realmente
 * ficam. Um scroll suave já em voo (alvo calculado ANTES dessa mudança)
 * pousa no lugar errado.
 *
 * Guardar a posição do clique permite comparar "mudou de verdade desde
 * então?" em vez de só "existe um alvo pendente?" — sem isso, qualquer
 * correção tardia re-chama scrollIntoView incondicionalmente, mesmo
 * quando nada mudou, interrompendo um scroll suave que já estava
 * correto (sentido como a rolagem "gaguejando" em TODA navegação, não só
 * quando há de fato algo pra corrigir).
 */

let pendingId: string | null = null;
let pendingTop: number | null = null;
let clearTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Registra o alvo do clique mais recente e sua posição atual (em px,
 * absoluta no documento). Expira sozinho depois de um tempo generoso pra
 * cobrir rede lenta/reload sem cache — depois disso, se o usuário já
 * seguiu em frente, uma mudança de altura tardia não deve puxá-lo de
 * volta.
 */
export function setPendingNavTarget(id: string, top: number) {
  pendingId = id;
  pendingTop = top;
  if (clearTimer) clearTimeout(clearTimer);
  clearTimer = setTimeout(() => {
    pendingId = null;
    pendingTop = null;
  }, 6000);
}

/**
 * Lê o alvo pendente e sua posição registrada (sem limpar — pode ser lido
 * várias vezes até expirar). `null` se não houver nenhum pendente.
 */
export function peekPendingNavTarget(): { id: string; top: number } | null {
  if (pendingId === null || pendingTop === null) return null;
  return { id: pendingId, top: pendingTop };
}

/** Atualiza a posição registrada pro alvo pendente atual (uso interno da correção). */
export function updatePendingNavTargetTop(top: number) {
  if (pendingId !== null) pendingTop = top;
}

/**
 * Descarta o alvo pendente antes da expiração natural. Usado quando o
 * usuário interrompe o voo de navegação (roda/touch/teclado) — sem isso,
 * uma correção tardia (troca de fonte, resize) dentro da janela de 6s
 * puxaria o usuário de volta ao destino contra a vontade dele, mesmo tendo
 * ele assumido o controle do scroll explicitamente.
 */
export function clearPendingNavTarget() {
  pendingId = null;
  pendingTop = null;
  if (clearTimer) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
}
