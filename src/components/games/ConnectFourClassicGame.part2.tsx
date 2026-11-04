// Part 2 of 3 — split from ConnectFourClassicGame.tsx on 2026-11-04. Edit here; ConnectFourClassicGame.tsx re-exports.
import { COLS } from "./ConnectFourClassicGame.part1";

export const ROWS = 6;
export type Cell = 0 | 1 | 2;
export type Mode = "cpu" | "pvp";
export type Difficulty = "easy" | "medium" | "hard";
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

export function lowestOpenRow(board: Cell[][], col: number): number | null {
  if (board[0]![col]) return null;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[r]![col]) return r;
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

export function legalMoves(board: Cell[][]): number[] {
  return [3, 2, 4, 1, 5, 0, 6].filter((c) => !board[0]![c]);
}

export function chooseCpuMove(board: Cell[][], difficulty: Difficulty): number {
  const legal = legalMoves(board);
  if (!legal.length) return 3;
  if (difficulty === "easy") return legal[Math.floor(Math.random() * legal.length)]!;

  // Prefer immediate win
  for (const c of legal) {
    const d = drop(board, c, 2);
    if (d && winner(d.board) === 2) return c;
  }
  // Block opponent win
  for (const c of legal) {
    const d = drop(board, c, 1);
    if (d && winner(d.board) === 1) return c;
  }

  if (difficulty === "medium") {
    const centerish = legal.filter((c) => c >= 2 && c <= 4);
    const pool = centerish.length ? centerish : legal;
    return pool[Math.floor(Math.random() * pool.length)]!;
  }

  // Hard: simple score + one-ply look
  let best = legal[0]!;
  let bestScore = -Infinity;
  for (const c of legal) {
    const d = drop(board, c, 2);
    if (!d) continue;
    let score = 0;
    if (winner(d.board) === 2) score = 1000;
    else {
      score += 10 - Math.abs(c - 3) * 2;
      const oppLegal = legalMoves(d.board);
      for (const oc of oppLegal) {
        const od = drop(d.board, oc, 1);
        if (od && winner(od.board) === 1) score -= 50;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}

export function applyMoves(moves: number[], mode: Mode): {
  board: Cell[][];
  turn: Cell;
  result: Cell | "draw" | null;
  lastDrop: { r: number; c: number } | null;
} {
  let board = emptyBoard();
  let turn: Cell = 1;
  let result: Cell | "draw" | null = null;
  let lastDrop: { r: number; c: number } | null = null;
  for (const col of moves) {
    if (result) break;
    if (col < 0 || col >= COLS) continue;
    const dropped = drop(board, col, turn);
    if (!dropped) continue;
    board = dropped.board;
    lastDrop = { r: dropped.row, c: col };
    result = winner(board);
    if (!result) turn = turn === 1 ? 2 : 1;
  }
  return { board, turn, result, lastDrop };
}
