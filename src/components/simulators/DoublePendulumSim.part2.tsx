// Part 2 of 3 — split from DoublePendulumSim.tsx on 2026-11-04. Edit here; DoublePendulumSim.tsx re-exports.
import { W } from "./DoublePendulumSim.part1";

export const H = 380;
export const PIVOT_X = W / 2;
export const PIVOT_Y = 48;
export const TRAIL_MAX = 240;
export const PX_PER_M = 140;
export const DT = 1 / 90;
export const TWIN_DELTA = 0.0015;

export const PRESETS = {
  classic: { th1: Math.PI / 2, th2: 0, labelEn: "Classic", labelEs: "Clásico" },
  butterfly: { th1: Math.PI * 0.85, th2: Math.PI * 0.35, labelEn: "Butterfly", labelEs: "Mariposa" },
  low: { th1: Math.PI * 0.35, th2: Math.PI * 0.15, labelEn: "Low energy", labelEs: "Baja energía" },
} as const;
