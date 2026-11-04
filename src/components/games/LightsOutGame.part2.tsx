// Part 2 of 3 — split from LightsOutGame.tsx on 2026-11-04. Edit here; LightsOutGame.tsx re-exports.
import { SIZE } from "./LightsOutGame.part1";

export type Board = boolean[]; // true = on (lit)

export function idx(r: number, c: number) {
  return r * SIZE + c;
}

export function neighbors(i: number): number[] {
  const r = Math.floor(i / SIZE);
  const c = i % SIZE;
  const out = [i];
  if (r > 0) out.push(idx(r - 1, c));
  if (r < SIZE - 1) out.push(idx(r + 1, c));
  if (c > 0) out.push(idx(r, c - 1));
  if (c < SIZE - 1) out.push(idx(r, c + 1));
  return out;
}

export function toggleAt(board: Board, i: number): Board {
  const next = board.slice();
  for (const n of neighbors(i)) next[n] = !next[n];
  return next;
}

export function randomSolvable(): Board {
  let board: Board = Array(SIZE * SIZE).fill(false);
  const moves = 8 + Math.floor(Math.random() * 12);
  for (let k = 0; k < moves; k++) {
    const i = Math.floor(Math.random() * board.length);
    board = toggleAt(board, i);
  }
  if (board.every((b) => !b)) return randomSolvable();
  return board;
}
