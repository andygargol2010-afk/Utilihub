// Part 1 of 3 — split from registry.tsx on 2026-11-04. Edit here; registry.tsx re-exports.
import { lazy } from "react";

export const TicTacToeGame = lazy(() => import("./TicTacToeGame").then((m) => ({ default: m.TicTacToeGame })));
export const MemoryGame = lazy(() => import("./MemoryGame").then((m) => ({ default: m.MemoryGame })));
export const SnakeGame = lazy(() => import("./SnakeGame").then((m) => ({ default: m.SnakeGame })));
export const Game2048 = lazy(() => import("./Game2048").then((m) => ({ default: m.Game2048 })));
export const ConnectFourGame = lazy(() => import("./ConnectFourGame").then((m) => ({ default: m.ConnectFourGame })));
export const ConnectFourClassicGame = lazy(() => import("./ConnectFourClassicGame").then((m) => ({ default: m.ConnectFourClassicGame })));
export const MinesweeperGame = lazy(() => import("./MinesweeperGame").then((m) => ({ default: m.MinesweeperGame })));
export const MinesweeperClassicGame = lazy(() => import("./MinesweeperClassicGame").then((m) => ({ default: m.MinesweeperClassicGame })));
export const HangmanGame = lazy(() => import("./HangmanGame").then((m) => ({ default: m.HangmanGame })));
export const PongGame = lazy(() => import("./PongGame").then((m) => ({ default: m.PongGame })));
export const SudokuGame = lazy(() => import("./SudokuGame").then((m) => ({ default: m.SudokuGame })));
export const SudokuClassicGame = lazy(() => import("./SudokuClassicGame").then((m) => ({ default: m.SudokuClassicGame })));
export const PacManGame = lazy(() => import("./PacManGame").then((m) => ({ default: m.PacManGame })));
export const TetrisGame = lazy(() => import("./TetrisGame").then((m) => ({ default: m.TetrisGame })));
export const CodeTypeRaceGame = lazy(() =>
  import("./CodeTypeRaceGame").then((m) => ({ default: m.CodeTypeRaceGame })),
);
export const FormulaMemoryGame = lazy(() =>
  import("./FormulaMemoryGame").then((m) => ({ default: m.FormulaMemoryGame })),
);
export const BudgetSurvivorGame = lazy(() =>
  import("./BudgetSurvivorGame").then((m) => ({ default: m.BudgetSurvivorGame })),
);
export const PathfinderGame = lazy(() =>
  import("./PathfinderGame").then((m) => ({ default: m.PathfinderGame })),
);
export const RefractionChallengeGame = lazy(() =>
  import("./RefractionChallengeGame").then((m) => ({ default: m.RefractionChallengeGame })),
);
export const LightsOutGame = lazy(() => import("./LightsOutGame").then((m) => ({ default: m.LightsOutGame })));
export const MagneticLetterCatcherGame = lazy(() =>
  import("./MagneticLetterCatcherGame").then((m) => ({ default: m.MagneticLetterCatcherGame })),
);
export const PulseCatchArenaGame = lazy(() =>
  import("./PulseCatchArenaGame").then((m) => ({ default: m.PulseCatchArenaGame })),
);
