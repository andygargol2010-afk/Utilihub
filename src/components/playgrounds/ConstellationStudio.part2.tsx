// Part 2 of 3 — split from ConstellationStudio.tsx on 2026-11-04. Edit here; ConstellationStudio.tsx re-exports.
import { type Star } from "./ConstellationStudio.part1";

export type Connection = [number, number];

export type Preset = {
  id: string;
  nameEn: string;
  nameEs: string;
  stars: { x: number; y: number; name?: string }[];
  connections: Connection[];
};

export const PRESETS: Preset[] = [
  {
    id: "orion",
    nameEn: "Orion",
    nameEs: "Orión",
    stars: [
      { x: 0.5, y: 0.15, name: "Betelgeuse" },
      { x: 0.35, y: 0.35 },
      { x: 0.65, y: 0.35 },
      { x: 0.5, y: 0.5, name: "Alnilam" },
      { x: 0.4, y: 0.55 },
      { x: 0.6, y: 0.55 },
      { x: 0.45, y: 0.75 },
      { x: 0.55, y: 0.75 },
      { x: 0.3, y: 0.85, name: "Rigel" },
      { x: 0.7, y: 0.85 },
    ],
    connections: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 6],
      [5, 7],
      [6, 8],
      [7, 9],
    ],
  },
  {
    id: "dipper",
    nameEn: "Big Dipper",
    nameEs: "Osa Mayor",
    stars: [
      { x: 0.2, y: 0.6 },
      { x: 0.35, y: 0.45 },
      { x: 0.5, y: 0.4 },
      { x: 0.65, y: 0.5 },
      { x: 0.75, y: 0.35 },
      { x: 0.85, y: 0.45 },
      { x: 0.9, y: 0.3 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    id: "cassiopeia",
    nameEn: "Cassiopeia",
    nameEs: "Casiopea",
    stars: [
      { x: 0.2, y: 0.4 },
      { x: 0.35, y: 0.6 },
      { x: 0.5, y: 0.35 },
      { x: 0.65, y: 0.55 },
      { x: 0.8, y: 0.3 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
];

export function encodeState(stars: Star[], connections: Connection[]): string {
  const payload = {
    s: stars.map((st) => [Math.round(st.x * 1000) / 1000, Math.round(st.y * 1000) / 1000]),
    c: connections,
  };
  return btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeState(hash: string): { stars: Star[]; connections: Connection[] } | null {
  try {
    let b = hash.replace(/-/g, "+").replace(/_/g, "/");
    while (b.length % 4) b += "=";
    const payload = JSON.parse(atob(b));
    if (!payload.s || !Array.isArray(payload.s)) return null;
    const stars: Star[] = payload.s.map((p: number[], i: number) => ({
      id: i,
      x: p[0],
      y: p[1],
    }));
    const connections: Connection[] = Array.isArray(payload.c) ? payload.c : [];
    return { stars, connections };
  } catch {
    return null;
  }
}
