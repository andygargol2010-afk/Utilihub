// Part 1 of 3 — split from BoidsFlockingLab.tsx on 2026-11-04. Edit here; BoidsFlockingLab.tsx re-exports.

export type Boid = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  trail: { x: number; y: number; a: number }[];
};
