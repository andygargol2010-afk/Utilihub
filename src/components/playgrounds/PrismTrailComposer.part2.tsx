// Part 2 of 3 — split from PrismTrailComposer.tsx on 2026-11-04. Edit here; PrismTrailComposer.tsx re-exports.
import { type Point } from "./PrismTrailComposer.part1";

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

export type Trail = { points: Point[]; created: number };

export type ColorScheme = "rainbow" | "neon" | "pastel" | "fire";
export type BgPreset = "void" | "nebula" | "grid" | "midnight";

export const SCHEMES: Record<ColorScheme, string[]> = {
  rainbow: ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#8b00ff"],
  neon: ["#ff00ff", "#00ffff", "#39ff14", "#ff073a", "#fe019a", "#0ff0fc", "#bc13fe"],
  pastel: ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff"],
  fire: ["#ff6b00", "#ff9500", "#ffb700", "#ffd000", "#ff4d00", "#e63900", "#c1121f"],
};
