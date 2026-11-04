// Part 2 of 3 — split from GlowTrailComposer.tsx on 2026-11-04. Edit here; GlowTrailComposer.tsx re-exports.

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

export const PALETTE = ["#ff2d95", "#00f5ff", "#ffd700", "#7cff6b", "#b388ff", "#ff6b35", "#ffffff", "#ff3b30"];
