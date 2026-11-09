// Part 2 of 3 — split from NeonSignatureComposer.tsx on 2026-11-04. Edit here; NeonSignatureComposer.tsx re-exports.
import { type Point } from "./NeonSignatureComposer.part1";

export type Stroke = Point[];
export type Layer = {
  id: string;
  strokes: Stroke[];
  color: string;
  endColor: string;
  width: number;
  opacity: number;
  glow: number;
  gradient: boolean;
};

export const THEMES = [
  { id: "cyan", color: "#00f5ff", end: "#ff2d95", labelEn: "Cyan", labelEs: "Cian" },
  { id: "pink", color: "#ff2d95", end: "#00f5ff", labelEn: "Hot Pink", labelEs: "Rosa intenso" },
  { id: "lime", color: "#7cff6b", end: "#ffd700", labelEn: "Lime", labelEs: "Lima" },
  { id: "gold", color: "#ffd700", end: "#ff2d95", labelEn: "Gold", labelEs: "Oro" },
  { id: "purple", color: "#b388ff", end: "#00f5ff", labelEn: "Purple", labelEs: "Púrpura" },
  { id: "white", color: "#ffffff", end: "#b388ff", labelEn: "White", labelEs: "Blanco" },
];

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function roundPt(p: Point): Point {
  return { x: Math.round(p.x * 1000) / 1000, y: Math.round(p.y * 1000) / 1000 };
}

export function serializeLayers(layers: Layer[]): string {
  try {
    const slim = layers.map((l) => ({
      ...l,
      strokes: l.strokes.map((s) => s.map(roundPt)),
    }));
    return btoa(unescape(encodeURIComponent(JSON.stringify(slim))));
  } catch {
    return "";
  }
}

export function deserializeLayers(data: string): Layer[] | null {
  try {
    const json = decodeURIComponent(escape(atob(data)));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}
