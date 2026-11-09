// Part 2 of 3 — split from GamesCatalog.tsx on 2026-11-04. Edit here; GamesCatalog.tsx re-exports.
import { type GameDef } from "@/lib/games/catalog";
import { type Filter } from "./GamesCatalog.part1";

export const FILTERS: { id: Filter; en: string; es: string; pt: string }[] = [
  { id: "all", en: "All", es: "Todos", pt: "Todos" },
  { id: "arcade", en: "Arcade", es: "Arcade", pt: "Arcade" },
  { id: "puzzle", en: "Puzzle", es: "Puzzle", pt: "Puzzle" },
  { id: "board", en: "Board", es: "Tablero", pt: "Tabuleiro" },
];

export const NEW_SLUGS = new Set(["tetris", "pacman", "pulse-catch-arena"]);

/** Soft background per game — large centered emoji only */
export const PREVIEW_BG: Record<string, string> = {
  "2048": "from-amber-50 to-orange-100",
  "tic-tac-toe": "from-slate-50 to-slate-100",
  "connect-four": "from-blue-50 to-blue-100",
  minesweeper: "from-zinc-100 to-slate-200",
  snake: "from-emerald-50 to-green-100",
  pong: "from-slate-800 to-slate-950",
  memory: "from-violet-50 to-fuchsia-100",
  sudoku: "from-teal-50 to-cyan-100",
  pacman: "from-indigo-950 to-blue-950",
  tetris: "from-slate-900 to-cyan-950",
  "pulse-catch-arena": "from-slate-950 to-cyan-950",
};

export function GamePreview({ game }: { game: GameDef }) {
  const bg = PREVIEW_BG[game.slug] ?? "from-emerald-50 to-teal-100";
  const dark = ["pong", "pacman", "tetris", "pulse-catch-arena"].includes(game.slug);
  return (
    <div
      className={`relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${bg}`}
      aria-hidden
    >
      <span
        className={`select-none text-6xl leading-none drop-shadow-sm transition duration-200 group-hover:scale-110 ${
          dark ? "opacity-95" : ""
        }`}
      >
        {game.emoji}
      </span>
    </div>
  );
}
