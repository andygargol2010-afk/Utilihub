// Part 2 of 3 — split from ConnectFourGame.tsx on 2026-11-04. Edit here; ConnectFourGame.tsx re-exports.
import { COLS } from "./ConnectFourGame.part1";

export const ROWS = 6;
export type Cell = 0 | 1 | 2;
export type Mode = "cpu" | "pvp";
export type CpuLevel = "easy" | "medium" | "hard";
export type Pos = { r: number; c: number };

export function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]);
}

export function drop(board: Cell[][], col: number, player: Cell): { board: Cell[][]; row: number } | null {
  if (board[0]![col]) return null;
  const next = board.map((r) => r.slice() as Cell[]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!next[r]![col]) {
      next[r]![col] = player;
      return { board: next, row: r };
    }
  }
  return null;
}

export function winningLine(board: Cell[][]): Pos[] | null {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ] as const;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = board[r]![c];
      if (!p) continue;
      for (const [dr, dc] of dirs) {
        const cells: Pos[] = [{ r, c }];
        let ok = true;
        for (let k = 1; k < 4; k++) {
          const rr = r + dr * k;
          const cc = c + dc * k;
          if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS || board[rr]![cc] !== p) {
            ok = false;
            break;
          }
          cells.push({ r: rr, c: cc });
        }
        if (ok) return cells;
      }
    }
  }
  return null;
}

export function winner(board: Cell[][]): Cell | "draw" | null {
  const line = winningLine(board);
  if (line) return board[line[0]!.r]![line[0]!.c] as Cell;
  if (board[0]!.every(Boolean)) return "draw";
  return null;
}

export function evaluate(board: Cell[][], player: Cell): number {
  let score = 0;
  const center = board.map((r) => r[3]!);
  score += center.filter((c) => c === player).length * 6;
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ] as const;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const [dr, dc] of dirs) {
        let count = 0;
        let empty = 0;
        let opp = 0;
        for (let k = 0; k < 4; k++) {
          const rr = r + dr * k;
          const cc = c + dc * k;
          if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) {
            count = -99;
            break;
          }
          const v = board[rr]![cc]!;
          if (v === player) count++;
          else if (v === 0) empty++;
          else opp++;
        }
        if (count < 0) continue;
        if (count === 4) score += 100000;
        else if (count === 3 && empty === 1) score += 50;
        else if (count === 2 && empty === 2) score += 8;
        if (opp === 3 && empty === 1) score -= 40;
      }
    }
  }
  return score;
}

export function minimax(
  board: Cell[][],
  depth: number,
  maximizing: boolean,
  alpha: number,
  beta: number,
): { score: number; col: number } {
  const w = winner(board);
  if (w === 2) return { score: 1000000 + depth, col: -1 };
  if (w === 1) return { score: -1000000 - depth, col: -1 };
  if (w === "draw") return { score: 0, col: -1 };
  if (depth === 0) return { score: evaluate(board, 2), col: -1 };

  const order = [3, 2, 4, 1, 5, 0, 6];
  let bestCol = order.find((c) => !board[0]![c]) ?? 0;

  if (maximizing) {
    let value = -Infinity;
    for (const c of order) {
      const dropped = drop(board, c, 2);
      if (!dropped) continue;
      const { score } = minimax(dropped.board, depth - 1, false, alpha, beta);
      if (score > value) {
        value = score;
        bestCol = c;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return { score: value, col: bestCol };
  }

  let value = Infinity;
  for (const c of order) {
    const dropped = drop(board, c, 1);
    if (!dropped) continue;
    const { score } = minimax(dropped.board, depth - 1, true, alpha, beta);
    if (score < value) {
      value = score;
      bestCol = c;
    }
    beta = Math.min(beta, value);
    if (alpha >= beta) break;
  }
  return { score: value, col: bestCol };
}

export const CELL_U = 100;
export const GAP_U = 12;
export const BOARD_W = COLS * CELL_U + (COLS - 1) * GAP_U;
export const BOARD_H = ROWS * CELL_U + (ROWS - 1) * GAP_U;

export function discCenter(r: number, c: number) {
  return {
    x: c * (CELL_U + GAP_U) + CELL_U / 2,
    y: r * (CELL_U + GAP_U) + CELL_U / 2,
  };
}

export function lineCoords(cells: Pos[]) {
  const a = discCenter(cells[0]!.r, cells[0]!.c);
  const b = discCenter(cells[cells.length - 1]!.r, cells[cells.length - 1]!.c);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const pad = 28;
  const ux = (dx / len) * pad;
  const uy = (dy / len) * pad;
  return { x1: a.x - ux, y1: a.y - uy, x2: b.x + ux, y2: b.y + uy, len: len + pad * 2 };
}

export function cpuMove(board: Cell[][], level: CpuLevel): number {
  const legal = [3, 2, 4, 1, 5, 0, 6].filter((col) => !board[0]![col]);
  if (!legal.length) return 0;
  if (level === "easy") {
    if (Math.random() < 0.55) return legal[Math.floor(Math.random() * legal.length)]!;
    return minimax(board, 1, true, -Infinity, Infinity).col;
  }
  if (level === "medium") {
    if (Math.random() < 0.18) return legal[Math.floor(Math.random() * legal.length)]!;
    return minimax(board, 3, true, -Infinity, Infinity).col;
  }
  return minimax(board, 5, true, -Infinity, Infinity).col;
}
