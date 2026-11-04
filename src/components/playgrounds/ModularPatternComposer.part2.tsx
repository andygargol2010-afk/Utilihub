// Part 2 of 3 — split from ModularPatternComposer.tsx on 2026-11-04. Edit here; ModularPatternComposer.tsx re-exports.
import { type Tile } from "./ModularPatternComposer.part1";

export type Layer = { id: number; tiles: (Tile | null)[][]; opacity: number; blend: string };

export type Palette = "neon" | "aurora" | "sunset" | "cyber";
export type Symmetry = "none" | "mirror" | "radial";
export type Anim = "flow" | "pulse" | "morph";

export const PALETTES: Record<Palette, string[]> = {
  neon: ["#ff00ff", "#00ffff", "#39ff14", "#ff073a", "#fe019a", "#0ff0fc"],
  aurora: ["#7df9ff", "#b388ff", "#80ffdb", "#c77dff", "#48bfe3", "#64dfdf"],
  sunset: ["#ff6b6b", "#ff8e53", "#ffd93d", "#ff6b9d", "#c44569", "#f8b500"],
  cyber: ["#00f5ff", "#ff00aa", "#b026ff", "#00ff9f", "#ffea00", "#ff2e97"],
};

export const TILE_TYPES = ["square", "circle", "triangle", "cross", "particle"];

export const GRID = 12;
