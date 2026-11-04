// Part 2 of 3 — split from Game2048.tsx on 2026-11-04. Edit here; Game2048.tsx re-exports.

export type Tile = {
  id: number;
  value: number;
  r: number;
  c: number;
  born?: boolean;
  merged?: boolean;
};

export const GAP = 10;
export const CELL = 72;
export const PAD = 12;
export const BOARD = PAD * 2 + CELL * 4 + GAP * 3;
