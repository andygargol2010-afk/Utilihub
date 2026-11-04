// Part 2 of 3 — split from registry.tsx on 2026-11-04. Edit here; registry.tsx re-exports.
import { lazy, type ComponentType } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { TicTacToeGame, MemoryGame, SnakeGame, Game2048, ConnectFourGame, ConnectFourClassicGame, MinesweeperGame, MinesweeperClassicGame, HangmanGame, PongGame, SudokuGame, SudokuClassicGame, PacManGame, TetrisGame, CodeTypeRaceGame, FormulaMemoryGame, BudgetSurvivorGame, PathfinderGame, RefractionChallengeGame, LightsOutGame, MagneticLetterCatcherGame, PulseCatchArenaGame } from "./registry.part1";

export const OrbitDefenderArcadeGame = lazy(() =>
  import("./OrbitDefenderArcadeGame").then((m) => ({ default: m.OrbitDefenderArcadeGame })),
);
export const OrbitPulseCatcherGame = lazy(() =>
  import("./OrbitPulseCatcherGame").then((m) => ({ default: m.OrbitPulseCatcherGame })),
);
export const SimonSequenceMemoryGame = lazy(() =>
  import("./SimonSequenceMemoryGame").then((m) => ({ default: m.SimonSequenceMemoryGame })),
);
export const MemoryMatchClassicGame = lazy(() =>
  import("./MemoryMatchClassicGame").then((m) => ({ default: m.MemoryMatchClassicGame })),
);
export const OthelloClassicGame = lazy(() =>
  import("./OthelloClassicGame").then((m) => ({ default: m.OthelloClassicGame })),
);

export const MAP: Record<string, ComponentType<{ locale?: GameLocale }>> = {
  "tic-tac-toe": TicTacToeGame,
  "tres-en-raya": TicTacToeGame,
  memory: MemoryGame,
  memoria: MemoryGame,
  snake: SnakeGame,
  "2048": Game2048,
  "connect-four": ConnectFourGame,
  "conecta-4": ConnectFourGame,
  "connect-four-classic": ConnectFourClassicGame,
  "conecta-cuatro-clasico": ConnectFourClassicGame,
  minesweeper: MinesweeperGame,
  buscaminas: MinesweeperGame,
  "minesweeper-classic": MinesweeperClassicGame,
  "buscaminas-clasico": MinesweeperClassicGame,
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
  "memory-match-classic": MemoryMatchClassicGame,
  "memoria-pares": MemoryMatchClassicGame,
  "othello-classic": OthelloClassicGame,
  "othello": OthelloClassicGame,
};
