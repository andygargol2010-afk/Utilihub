// Part 2 of 3 — split from GaltonBoardSim.tsx on 2026-11-04. Edit here; GaltonBoardSim.tsx re-exports.

export const H = 560;

export type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  row: number;
  col: number;
  active: boolean;
  bin?: number;
};
