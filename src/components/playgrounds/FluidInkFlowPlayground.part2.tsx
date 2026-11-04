// Part 2 of 3 — split from FluidInkFlowPlayground.tsx on 2026-11-04. Edit here; FluidInkFlowPlayground.tsx re-exports.
import { type Point } from "./FluidInkFlowPlayground.part1";

export type Stroke = { id: string; points: Point[] };
export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
};

export type Props = { locale: "en" | "es" | "fr" | "de" | "pt" };

export const STORAGE_KEY = "utilihub-fluid-ink-flow-v1";

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function blendHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

export function encodeStrokes(strokes: Stroke[]): string {
  try {
    const slim = strokes.map((s) => ({
      id: s.id,
      points: s.points.map((p) => [Math.round(p.x), Math.round(p.y), p.color]),
    }));
    return btoa(unescape(encodeURIComponent(JSON.stringify(slim))));
  } catch {
    return "";
  }
}

export function decodeStrokes(raw: string): Stroke[] {
  try {
    const json = decodeURIComponent(escape(atob(raw)));
    const slim = JSON.parse(json) as { id: string; points: [number, number, string][] }[];
    return slim.map((s) => ({
      id: s.id,
      points: s.points.map(([x, y, color]) => ({ x, y, color })),
    }));
  } catch {
    return [];
  }
}
