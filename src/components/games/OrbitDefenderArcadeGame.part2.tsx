// Part 2 of 3 — split from OrbitDefenderArcadeGame.tsx on 2026-11-04. Edit here; OrbitDefenderArcadeGame.tsx re-exports.
import { W } from "./OrbitDefenderArcadeGame.part1";

export const H = 520;
export const PLANET_R = 28;
export const PLANET_X = W / 2;
export const PLANET_Y = H / 2;

export type Asteroid = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  hp: number;
  rot: number;
  points: number[];
};

export type Shot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
};

export type PowerUp = {
  x: number;
  y: number;
  kind: "shield" | "rapid" | "slow" | "spread";
  life: number;
};

export function makeAsteroidShape(r: number) {
  const pts: number[] = [];
  const n = 7 + Math.floor(Math.random() * 4);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.72 + Math.random() * 0.5);
    pts.push(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  return pts;
}
