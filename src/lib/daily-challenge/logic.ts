import { GAMES, gamePath, type GameDef, type GameLocale } from "@/lib/games/catalog";

/** Curated games with a clear win goal. Keys = EN slug in the games catalog. */
const GOALS: Record<string, { en: string; es: string }> = {
  "sudoku-classic": { en: "Solve a Sudoku on Easy", es: "Resolvé un Sudoku en Fácil" },
  "minesweeper-classic": { en: "Clear a Minesweeper board on Easy", es: "Despejá un tablero de Buscaminas en Fácil" },
  "hangman-classic": { en: "Guess the hidden word without losing", es: "Adiviná la palabra oculta sin perder" },
  "memory-match-classic": { en: "Match every pair on the easy board", es: "Encontrá todos los pares en el tablero fácil" },
  "connect-four-classic": { en: "Connect four in a row", es: "Conectá cuatro en línea" },
  "2048": { en: "Reach the 256 tile", es: "Llegá a la ficha 256" },
  "lights-out": { en: "Turn every light off", es: "Apagá todas las luces" },
  "tic-tac-toe": { en: "Win a game of tic-tac-toe", es: "Ganá una partida de tres en raya" },
  "simon-sequence-memory": { en: "Repeat a sequence of 6 or more", es: "Repetí una secuencia de 6 o más" },
  "othello-classic": { en: "Finish a game with more discs", es: "Terminá una partida con más fichas" },
  "checkers-classic": { en: "Capture at least one piece", es: "Capturá al menos una pieza" },
  "battleship-classic": { en: "Sink a ship", es: "Hundí un barco" },
};

export type DailyPick = { game: GameDef; goalEn: string; goalEs: string; dayKey: string };

export const DAY_MS = 24 * 60 * 60 * 1000;

/** UTC day key YYYY-MM-DD. */
export function dayKeyOf(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(dayKey: string, delta: number): string {
  return dayKeyOf(Date.parse(`${dayKey}T00:00:00Z`) + delta * DAY_MS);
}

function pool(): GameDef[] {
  return GAMES.filter((g) => GOALS[g.slug]);
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function indexFor(dayKey: string, n: number): number {
  return hash(`utilihub-daily:${dayKey}`) % n;
}

/** Deterministic pick: same UTC day -> same game for every visitor; never repeats yesterday. */
export function pickForDay(dayKey: string): DailyPick | null {
  const games = pool();
  if (games.length === 0) return null;
  let i = indexFor(dayKey, games.length);
  if (games.length > 1 && i === indexFor(addDays(dayKey, -1), games.length)) i = (i + 1) % games.length;
  const game = games[i];
  if (!game) return null;
  return { game, goalEn: GOALS[game.slug]?.en ?? "", goalEs: GOALS[game.slug]?.es ?? "", dayKey };
}

export function pickPath(pick: DailyPick, locale: GameLocale): string {
  return gamePath(pick.game, locale);
}

/** Milliseconds until the next UTC midnight. */
export function msUntilNext(now: number): number {
  return (Math.floor(now / DAY_MS) + 1) * DAY_MS - now;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/** done: dayKey -> game slug completed. */
export type DoneMap = Record<string, string>;
const KEY = "utilihub:daily-challenge";

export function readDone(): DoneMap {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (!raw || typeof raw !== "object") return {};
    const out: DoneMap = {};
    for (const [k, v] of Object.entries(raw)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(k) && typeof v === "string") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function writeDone(done: DoneMap): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(done));
  } catch {
    /* storage unavailable: state stays in memory only */
  }
}

/** Current streak (counts back from today, or from yesterday if today is pending) and best streak. */
export function computeStreaks(done: DoneMap, today: string): { current: number; best: number } {
  const days = Object.keys(done).sort();
  let best = 0;
  let run = 0;
  let prev = "";
  for (const d of days) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    if (run > best) best = run;
    prev = d;
  }
  let cursor = done[today] ? today : addDays(today, -1);
  let current = 0;
  while (done[cursor]) {
    current++;
    cursor = addDays(cursor, -1);
  }
  return { current, best };
}

/** Last n day keys ending today (oldest first). */
export function lastDays(today: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}
