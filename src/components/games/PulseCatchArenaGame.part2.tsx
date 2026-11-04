// Part 2 of 3 — split from PulseCatchArenaGame.tsx on 2026-11-04. Edit here; PulseCatchArenaGame.tsx re-exports.
import { W } from "./PulseCatchArenaGame.part1";

export const H = 480;
export const BAR_W = 72;
export const BAR_H = 12;
export const BAR_Y = H - 36;

export type PulseKind = "normal" | "rare" | "life" | "power-magnet" | "power-slow" | "power-multi" | "power-shield";

export type Pulse = {
  x: number;
  y: number;
  vy: number;
  r: number;
  kind: PulseKind;
  hue: number;
  trail: { x: number; y: number }[];
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

export type ScorePopup = {
  x: number;
  y: number;
  text: string;
  life: number;
  color: string;
};

export type Announcement = {
  text: string;
  life: number;
  color: string;
};

export type Star = {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
};

export type Shockwave = {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  hue: number;
};

export function makeStars(n: number): Star[] {
  const out: Star[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 0.6 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.04,
    });
  }
  return out;
}
