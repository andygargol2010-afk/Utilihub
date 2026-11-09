// Part 2 of 3 — split from NeonLayerComposer.tsx on 2026-11-04. Edit here; NeonLayerComposer.tsx re-exports.
import { type Point } from "./NeonLayerComposer.part1";

export type Layer = {
  id: number;
  points: Point[];
  color: string;
  opacity: number;
  created: number;
  fade: number;
};
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

export type Palette = "neon" | "aurora" | "sunset" | "cyber";
export type Symmetry = "none" | "mirror" | "radial" | "kaleido";

export const PALETTES: Record<Palette, string[]> = {
  neon: ["#ff00ff", "#00ffff", "#39ff14", "#ff073a", "#fe019a", "#0ff0fc"],
  aurora: ["#7df9ff", "#b388ff", "#80ffdb", "#c77dff", "#48bfe3", "#64dfdf"],
  sunset: ["#ff6b6b", "#ff8e53", "#ffd93d", "#ff6b9d", "#c44569", "#f8b500"],
  cyber: ["#00f5ff", "#ff00aa", "#b026ff", "#00ff9f", "#ffea00", "#ff2e97"],
};
