export const MAX_RETRIES = 8;

/** Exponential backoff with jitter: ~1s, 2s, 4s ... capped at 15s. `attempt` starts at 1. */
export function backoffDelay(attempt: number, rand: () => number = Math.random): number {
  const base = Math.min(1000 * 2 ** (attempt - 1), 15_000);
  return Math.round(base * (0.5 + rand() * 0.5));
}

export type CloseAction = "retry" | "forbidden" | "exhausted";

/**
 * What to do after the socket closes. `attempt` is the number of consecutive
 * failed attempts including this one (a connection that opened resets it).
 *
 * 4403 = removed by admin / wrong room / origin not allowed: retrying can't help.
 * 4401 = ticket refused: worth a couple of tries with a fresh ticket (e.g. it
 *        expired while a sleeping server was waking up), then give up.
 */
export function closeAction(code: number, attempt: number): CloseAction {
  if (code === 4403) return "forbidden";
  if (code === 4401 && attempt >= 3) return "forbidden";
  if (attempt >= MAX_RETRIES) return "exhausted";
  return "retry";
}
