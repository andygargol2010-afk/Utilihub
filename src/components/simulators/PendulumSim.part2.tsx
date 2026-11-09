// Part 2 of 3 — split from PendulumSim.tsx on 2026-11-04. Edit here; PendulumSim.tsx re-exports.
import { W } from "./PendulumSim.part1";

export const H = 340;
export const PIVOT_X = W / 2;
export const PIVOT_Y = 42;
export const TRAIL_MAX = 120;
export const PX_PER_M = 220;
export const DT = 1 / 60;

export function lengthMeters(ui: number) {
  return (90 + ui * 140) / PX_PER_M;
}

export function gAccel(ui: number) {
  return 3 + ui * 11;
}

export function theoryPeriod(L: number, g: number) {
  if (g <= 0 || L <= 0) return 0;
  return 2 * Math.PI * Math.sqrt(L / g);
}
