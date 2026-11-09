// Part 1 of 3 — split from GravitySandbox.tsx on 2026-11-04. Edit here; GravitySandbox.tsx re-exports.

export type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  m: number;
  hue: number;
  trail: { x: number; y: number }[];
  trailHead: number;
  trailLen: number;
};
