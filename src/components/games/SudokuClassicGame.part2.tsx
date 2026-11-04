// Part 2 of 3 — split from SudokuClassicGame.tsx on 2026-11-04. Edit here; SudokuClassicGame.tsx re-exports.
import { type Diff } from "./SudokuClassicGame.part1";

export type Board = number[][];
export type Notes = Set<number>[][];
export type Snapshot = { grid: Board; notes: Notes };

export function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
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

export function solve(board: Board, rng: () => number): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r]![c] !== 0) continue;
      for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng)) {
        if (!isValid(board, r, c, n)) continue;
        board[r]![c] = n;
        if (solve(board, rng)) return true;
        board[r]![c] = 0;
      }
      return false;
    }
  }
  return true;
}

export function generate(diff: Diff, seed: number): { puzzle: Board; solution: Board } {
  const rng = mulberry32(seed);
  const solution: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(solution, rng);
  const puzzle = solution.map((row) => row.slice());
  const holes = diff === "easy" ? 36 : diff === "medium" ? 46 : 54;
  const cells = shuffle(Array.from({ length: 81 }, (_, i) => i), rng);
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

export function emptyNotes(): Notes {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>()));
}

export function cloneNotes(n: Notes): Notes {
  return n.map((row) => row.map((s) => new Set(s)));
}

export function sameBox(r1: number, c1: number, r2: number, c2: number): boolean {
  return Math.floor(r1 / 3) === Math.floor(r2 / 3) && Math.floor(c1 / 3) === Math.floor(c2 / 3);
}

export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function computePossible(board: Board, r: number, c: number): Set<number> {
  const possibles = new Set<number>();
  if (board[r]![c] !== 0) return possibles;
  for (let n = 1; n <= 9; n++) {
    if (isValid(board, r, c, n)) possibles.add(n);
  }
  return possibles;
}

export function autoFillNotes(board: Board): Notes {
  const next = emptyNotes();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r]![c] === 0) {
        next[r]![c] = computePossible(board, r, c);
      }
    }
  }
  return next;
}
