import { lazy, Suspense, type ComponentType } from "react";
import type { GameDef, GameLocale } from "@/lib/games/catalog";

const TicTacToeGame = lazy(() => import("./TicTacToeGame").then((m) => ({ default: m.TicTacToeGame })));
const MemoryGame = lazy(() => import("./MemoryGame").then((m) => ({ default: m.MemoryGame })));
const SnakeGame = lazy(() => import("./SnakeGame").then((m) => ({ default: m.SnakeGame })));
const Game2048 = lazy(() => import("./Game2048").then((m) => ({ default: m.Game2048 })));
const ConnectFourGame = lazy(() => import("./ConnectFourGame").then((m) => ({ default: m.ConnectFourGame })));
const ConnectFourClassicGame = lazy(() => import("./ConnectFourClassicGame").then((m) => ({ default: m.ConnectFourClassicGame })));
const MinesweeperGame = lazy(() => import("./MinesweeperGame").then((m) => ({ default: m.MinesweeperGame })));
const HangmanGame = lazy(() => import("./HangmanGame").then((m) => ({ default: m.HangmanGame })));
const PongGame = lazy(() => import("./PongGame").then((m) => ({ default: m.PongGame })));
const SudokuGame = lazy(() => import("./SudokuGame").then((m) => ({ default: m.SudokuGame })));
const SudokuClassicGame = lazy(() => import("./SudokuClassicGame").then((m) => ({ default: m.SudokuClassicGame })));
const PacManGame = lazy(() => import("./PacManGame").then((m) => ({ default: m.PacManGame })));
const TetrisGame = lazy(() => import("./TetrisGame").then((m) => ({ default: m.TetrisGame })));
const CodeTypeRaceGame = lazy(() =>
  import("./CodeTypeRaceGame").then((m) => ({ default: m.CodeTypeRaceGame })),
);
const FormulaMemoryGame = lazy(() =>
  import("./FormulaMemoryGame").then((m) => ({ default: m.FormulaMemoryGame })),
);
const BudgetSurvivorGame = lazy(() =>
  import("./BudgetSurvivorGame").then((m) => ({ default: m.BudgetSurvivorGame })),
);
const PathfinderGame = lazy(() =>
  import("./PathfinderGame").then((m) => ({ default: m.PathfinderGame })),
);
const RefractionChallengeGame = lazy(() =>
  import("./RefractionChallengeGame").then((m) => ({ default: m.RefractionChallengeGame })),
);
const LightsOutGame = lazy(() => import("./LightsOutGame").then((m) => ({ default: m.LightsOutGame })));
const MagneticLetterCatcherGame = lazy(() =>
  import("./MagneticLetterCatcherGame").then((m) => ({ default: m.MagneticLetterCatcherGame })),
);
const PulseCatchArenaGame = lazy(() =>
  import("./PulseCatchArenaGame").then((m) => ({ default: m.PulseCatchArenaGame })),
);
const OrbitDefenderArcadeGame = lazy(() =>
  import("./OrbitDefenderArcadeGame").then((m) => ({ default: m.OrbitDefenderArcadeGame })),
);
const OrbitPulseCatcherGame = lazy(() =>
  import("./OrbitPulseCatcherGame").then((m) => ({ default: m.OrbitPulseCatcherGame })),
);
const SimonSequenceMemoryGame = lazy(() =>
  import("./SimonSequenceMemoryGame").then((m) => ({ default: m.SimonSequenceMemoryGame })),
);

const MAP: Record<string, ComponentType<{ locale?: GameLocale }>> = {
  "tic-tac-toe": TicTacToeGame,
  "tres-en-raya": TicTacToeGame,
  memory: MemoryGame,
  memoria: MemoryGame,
  snake: SnakeGame,
  "2048": Game2048,
  "connect-four": ConnectFourGame,
  "conecta-4": ConnectFourGame,
  "connect-four-classic": ConnectFourClassicGame,
  "conecta-cuatro": ConnectFourClassicGame,
  minesweeper: MinesweeperGame,
  buscaminas: MinesweeperGame,
  hangman: HangmanGame,
  ahorcado: HangmanGame,
  pong: PongGame,
  sudoku: SudokuGame,
  "sudoku-classic": SudokuClassicGame,
  "sudoku-clasico": SudokuClassicGame,
  pacman: PacManGame,
  tetris: TetrisGame,
  "code-type-race": CodeTypeRaceGame,
  "carrera-de-codigo": CodeTypeRaceGame,
  "formula-memory": FormulaMemoryGame,
  "memoria-formulas": FormulaMemoryGame,
  "budget-survivor": BudgetSurvivorGame,
  "supervivencia-presupuesto": BudgetSurvivorGame,
  pathfinder: PathfinderGame,
  "busca-caminos": PathfinderGame,
  "refraction-challenge": RefractionChallengeGame,
  "desafio-refraccion": RefractionChallengeGame,
  "lights-out": LightsOutGame,
  "luces-fuera": LightsOutGame,
  "magnetic-letter-catcher": MagneticLetterCatcherGame,
  "atrapa-letras-magneticas": MagneticLetterCatcherGame,
  "pulse-catch-arena": PulseCatchArenaGame,
  "orbit-defender-arcade": OrbitDefenderArcadeGame,
  "arcade-defensor-orbita": OrbitDefenderArcadeGame,
  "orbit-pulse-catcher": OrbitPulseCatcherGame,
  "atrapa-pulsos-orbita": OrbitPulseCatcherGame,
  "simon-sequence-memory": SimonSequenceMemoryGame,
  "memoria-secuencia-simon": SimonSequenceMemoryGame,
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
