// Part 2 of 3 — split from ReactionDiffusionLab.tsx on 2026-11-04. Edit here; ReactionDiffusionLab.tsx re-exports.
import { GRID } from "./ReactionDiffusionLab.part1";

export const SCALE = 3; // canvas pixel size
export const W = GRID * SCALE;
export const H = GRID * SCALE;

export type Preset = {
  id: string;
  en: string;
  es: string;
  f: number;
  k: number;
  du: number;
  dv: number;
};

export const PRESETS: Preset[] = [
  { id: "spots", en: "Spots", es: "Manchas", f: 0.03, k: 0.062, du: 0.16, dv: 0.08 },
  { id: "stripes", en: "Stripes", es: "Rayas", f: 0.022, k: 0.051, du: 0.16, dv: 0.08 },
  { id: "maze", en: "Maze", es: "Laberinto", f: 0.029, k: 0.057, du: 0.16, dv: 0.08 },
  { id: "worms", en: "Worms", es: "Gusanos", f: 0.058, k: 0.065, du: 0.16, dv: 0.08 },
  { id: "coral", en: "Coral", es: "Coral", f: 0.0545, k: 0.062, du: 0.16, dv: 0.08 },
  { id: "mitosis", en: "Mitosis", es: "Mitosis", f: 0.0367, k: 0.0649, du: 0.16, dv: 0.08 },
  { id: "solitons", en: "Solitons", es: "Solitones", f: 0.03, k: 0.055, du: 0.14, dv: 0.06 },
  { id: "labyrinth", en: "Labyrinth", es: "Laberinto+", f: 0.026, k: 0.053, du: 0.18, dv: 0.07 },
];

export type BrushMode = "seed" | "clear" | "noise";
export type ColorMap = "heat" | "ocean" | "mono" | "plasma" | "viridis" | "magma";

export function idx(x: number, y: number) {
  return y * GRID + x;
}

export function makeGrid(): { u: Float32Array; v: Float32Array } {
  const u = new Float32Array(GRID * GRID);
  const v = new Float32Array(GRID * GRID);
  u.fill(1);
  v.fill(0);
  // seed a few spots
  for (let i = 0; i < 8; i++) {
    const cx = Math.floor(GRID * (0.3 + Math.random() * 0.4));
    const cy = Math.floor(GRID * (0.3 + Math.random() * 0.4));
    const r = 3 + Math.floor(Math.random() * 4);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          const x = (cx + dx + GRID) % GRID;
          const y = (cy + dy + GRID) % GRID;
          const i = idx(x, y);
          u[i] = 0.5;
          v[i] = 0.25;
        }
      }
    }
  }
  return { u, v };
}

export function parseHash(): Partial<{ f: number; k: number; du: number; dv: number }> {
  if (typeof window === "undefined") return {};
  const hash = window.location.hash.slice(1);
  if (!hash) return {};
  const params = new URLSearchParams(hash);
  const out: Partial<{ f: number; k: number; du: number; dv: number }> = {};
  const f = params.get("f");
  const k = params.get("k");
  const du = params.get("du");
  const dv = params.get("dv");
  if (f) out.f = Number(f);
  if (k) out.k = Number(k);
  if (du) out.du = Number(du);
  if (dv) out.dv = Number(dv);
  return out;
}
