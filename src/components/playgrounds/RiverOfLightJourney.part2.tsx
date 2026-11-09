// Part 2 of 3 — split from RiverOfLightJourney.tsx on 2026-11-04. Edit here; RiverOfLightJourney.tsx re-exports.

export type Particle = {
  t: number; // progress 0..1 along path
  speed: number;
  size: number;
  life: number;
  color: string;
};

export const PALETTE = ["#00f5ff", "#7cff6b", "#ffd700", "#ff2d95", "#b388ff", "#ffffff", "#ff6b35", "#4fc3f7"];
