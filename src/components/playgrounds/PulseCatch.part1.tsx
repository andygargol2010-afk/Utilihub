// Part 1 of 3 — split from PulseCatch.tsx on 2026-11-04. Edit here; PulseCatch.tsx re-exports.

export type Spark = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  radius: number;
  trail: { x: number; y: number }[];
  rare?: boolean;
};
