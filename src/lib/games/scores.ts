/** Local high scores only (global ranking is phase 2). */

const PREFIX = "utilihub_game_best_";

export function readBestScore(gameSlug: string): number {
  try {
    const v = Number(localStorage.getItem(PREFIX + gameSlug) || "0");
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
}

export function writeBestScore(gameSlug: string, score: number): number {
  const prev = readBestScore(gameSlug);
  const next = Math.max(prev, score);
  try {
    localStorage.setItem(PREFIX + gameSlug, String(next));
  } catch {
    /* ignore */
  }
  return next;
}

/** Lower is better (times, moves). */
export function readBestLow(gameSlug: string): number | null {
  try {
    const raw = localStorage.getItem(PREFIX + gameSlug + "_low");
    if (raw == null) return null;
    const v = Number(raw);
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

export function writeBestLow(gameSlug: string, value: number): number {
  const prev = readBestLow(gameSlug);
  const next = prev == null ? value : Math.min(prev, value);
  try {
    localStorage.setItem(PREFIX + gameSlug + "_low", String(next));
  } catch {
    /* ignore */
  }
  return next;
}
