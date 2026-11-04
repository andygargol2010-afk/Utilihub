// Part 2 of 3 — split from SudokuGame.tsx on 2026-11-04. Edit here; SudokuGame.tsx re-exports.
import { type Diff } from "./SudokuGame.part1";

export type Board = number[][];

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function isValid(board: Board, r: number, c: number, n: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[r]![i] === n || board[i]![c] === n) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[br + i]![bc + j] === n) return false;
    }
  }
  return true;
}

export function solve(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r]![c] !== 0) continue;
      for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        if (!isValid(board, r, c, n)) continue;
        board[r]![c] = n;
        if (solve(board)) return true;
        board[r]![c] = 0;
      }
      return false;
    }
  }
  return true;
}

export function generate(diff: Diff): { puzzle: Board; solution: Board } {
  const solution: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(solution);
  const puzzle = solution.map((row) => row.slice());
  const holes = diff === "easy" ? 36 : diff === "medium" ? 46 : 54;
  const cells = shuffle(Array.from({ length: 81 }, (_, i) => i));
  let removed = 0;
  for (const idx of cells) {
    if (removed >= holes) break;
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    if (puzzle[r]![c] === 0) continue;
    puzzle[r]![c] = 0;
    removed++;
  }
  return { puzzle, solution };
}

export function hasConflict(board: Board, r: number, c: number): boolean {
  const n = board[r]![c]!;
  if (!n) return false;
  for (let i = 0; i < 9; i++) {
    if (i !== c && board[r]![i] === n) return true;
    if (i !== r && board[i]![c] === n) return true;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const rr = br + i;
      const cc = bc + j;
      if ((rr !== r || cc !== c) && board[rr]![cc] === n) return true;
    }
  }
  return false;
}
