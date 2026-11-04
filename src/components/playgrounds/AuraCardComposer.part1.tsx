// Part 1 of 3 — split from AuraCardComposer.tsx on 2026-11-04. Edit here; AuraCardComposer.tsx re-exports.

export type Particle = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};
