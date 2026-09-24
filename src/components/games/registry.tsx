import { lazy, Suspense, type ComponentType } from "react";
import { CardGridSkeleton } from "@/components/ListSkeleton";
import type { GameDef, GameLocale } from "@/lib/games/catalog";

const TicTacToeGame = lazy(() => import("./TicTacToeGame").then((m) => ({ default: m.TicTacToeGame })));
const MemoryGame = lazy(() => import("./MemoryGame").then((m) => ({ default: m.MemoryGame })));
const SnakeGame = lazy(() => import("./SnakeGame").then((m) => ({ default: m.SnakeGame })));
const Game2048 = lazy(() => import("./Game2048").then((m) => ({ default: m.Game2048 })));
const ConnectFourGame = lazy(() => import("./ConnectFourGame").then((m) => ({ default: m.ConnectFourGame })));
const MinesweeperGame = lazy(() => import("./MinesweeperGame").then((m) => ({ default: m.MinesweeperGame })));
const PongGame = lazy(() => import("./PongGame").then((m) => ({ default: m.PongGame })));
const SudokuGame = lazy(() => import("./SudokuGame").then((m) => ({ default: m.SudokuGame })));
const PacManGame = lazy(() => import("./PacManGame").then((m) => ({ default: m.PacManGame })));
const TetrisGame = lazy(() => import("./TetrisGame").then((m) => ({ default: m.TetrisGame })));

const MAP: Record<string, ComponentType<{ locale?: GameLocale }>> = {
  "tic-tac-toe": TicTacToeGame,
  "tres-en-raya": TicTacToeGame,
  memory: MemoryGame,
  memoria: MemoryGame,
  snake: SnakeGame,
  "2048": Game2048,
  "connect-four": ConnectFourGame,
  "conecta-4": ConnectFourGame,
  minesweeper: MinesweeperGame,
  buscaminas: MinesweeperGame,
  pong: PongGame,
  sudoku: SudokuGame,
  pacman: PacManGame,
  tetris: TetrisGame,
};

export function GamePlayer({ game, locale = "en" }: { game: GameDef; locale?: GameLocale }) {
  const Comp = MAP[game.slug] ?? MAP[game.slugEs];
  if (!Comp) {
    return (
      <p className="py-16 text-center text-sm font-semibold text-emerald-200/80">
        {locale === "es" ? "Juego no disponible." : "Game not available."}
      </p>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md py-8">
          <div className="skeleton mx-auto h-48 w-full max-w-sm rounded-2xl" />
          <p className="mt-4 text-center text-xs text-white/50">
            {locale === "es" ? "Cargando…" : "Loading…"}
          </p>
        </div>
      }
    >
      <Comp locale={locale} />
    </Suspense>
  );
}
