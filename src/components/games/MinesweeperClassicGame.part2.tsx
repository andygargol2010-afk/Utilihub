// Part 2 of 3 — split from MinesweeperClassicGame.tsx on 2026-11-04. Edit here; MinesweeperClassicGame.tsx re-exports.
import { type Diff } from "./MinesweeperClassicGame.part1";

export const CONFIG: Record<Diff, { rows: number; cols: number; mines: number }> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

export type FlagState = 0 | 1 | 2; // 0 none, 1 flag, 2 question

export type Cell = {
  mine: boolean;
  open: boolean;
  flag: FlagState;
  n: number;
};

export function neighbors(r: number, c: number, rows: number, cols: number) {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) out.push([rr, cc]);
    }
  }
  return out;
}

export function makeEmpty(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, open: false, flag: 0 as FlagState, n: 0 })),
  );
}

export function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function placeMines(board: Cell[][], mines: number, safeR: number, safeC: number, seed?: number): Cell[][] {
  const rows = board.length;
  const cols = board[0]!.length;
  const next = board.map((row) => row.map((c) => ({ ...c })));
  const rand = seed != null ? mulberry32(seed) : Math.random;
  let placed = 0;
  let guard = 0;
  while (placed < mines && guard < 8000) {
    guard++;
    const r = Math.floor(rand() * rows);
    const c = Math.floor(rand() * cols);
    if ((r === safeR && c === safeC) || next[r]![c]!.mine) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    next[r]![c]!.mine = true;
    placed++;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (next[r]![c]!.mine) continue;
      next[r]![c]!.n = neighbors(r, c, rows, cols).filter(([rr, cc]) => next[rr]![cc]!.mine).length;
    }
  }
  return next;
}

export function floodOpen(board: Cell[][], r: number, c: number): Cell[][] {
  const rows = board.length;
  const cols = board[0]!.length;
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  const stack: [number, number][] = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const cell = next[cr]![cc]!;
    if (cell.open || cell.flag === 1) continue;
    cell.open = true;
    if (cell.mine || cell.n > 0) continue;
    for (const [nr, nc] of neighbors(cr, cc, rows, cols)) {
      if (!next[nr]![nc]!.open && next[nr]![nc]!.flag !== 1) stack.push([nr, nc]);
    }
  }
  return next;
}
