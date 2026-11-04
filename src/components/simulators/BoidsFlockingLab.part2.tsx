// Part 2 of 3 — split from BoidsFlockingLab.tsx on 2026-11-04. Edit here; BoidsFlockingLab.tsx re-exports.
import { type Boid } from "./BoidsFlockingLab.part1";

export const W = 520;
export const H = 380;
export const MAX_BOIDS = 140;
export const TRAIL_MAX = 18;

export const PRESETS = [
  { id: "school", en: "School", es: "Cardumen", sep: 1.2, align: 1.4, coh: 1.3, speed: 1.1, perc: 85, wander: 0.3 },
  { id: "scatter", en: "Scatter", es: "Dispersar", sep: 2.0, align: 0.4, coh: 0.3, speed: 1.0, perc: 60, wander: 0.8 },
  { id: "tight", en: "Tight", es: "Compacto", sep: 0.8, align: 1.1, coh: 1.6, speed: 0.8, perc: 45, wander: 0.2 },
  { id: "free", en: "Free", es: "Libre", sep: 1.4, align: 1.0, coh: 1.0, speed: 1.0, perc: 70, wander: 0.5 },
  { id: "swirl", en: "Swirl", es: "Remolino", sep: 0.9, align: 1.6, coh: 0.7, speed: 1.3, perc: 95, wander: 0.4 },
];

export function makeBoid(x?: number, y?: number): Boid {
  const ang = Math.random() * Math.PI * 2;
  const sp = 1.2 + Math.random() * 1.4;
  return {
    x: x ?? Math.random() * W,
    y: y ?? Math.random() * H,
    vx: Math.cos(ang) * sp,
    vy: Math.sin(ang) * sp,
    hue: 180 + Math.random() * 80,
    trail: [],
  };
}
