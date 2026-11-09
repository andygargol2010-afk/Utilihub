// Part 2 of 3 — split from OrbitPulseCatcherGame.tsx on 2026-11-04. Edit here; OrbitPulseCatcherGame.tsx re-exports.
import { W } from "./OrbitPulseCatcherGame.part1";

export const H = 480;
export const CX = W / 2;
export const CY = H / 2 - 20;
export const INNER_R = 48;
export const OUTER_R = 160;
export const BASE_ZONES = 4;
export const MAX_ZONES = 8;
export const ZONE_COLORS = [200, 30, 120, 280, 50, 160, 310, 80]; // hues up to 8

export type Pulse = {
  angle: number;
  radius: number;
  speed: number;
  hue: number;
  zone: number;
  life: number;
  trail: { x: number; y: number }[];
  scale: number;
  isPowerup?: boolean;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
  type: "spark" | "ring";
};

export type CatchRing = {
  x: number;
  y: number;
  r: number;
  life: number;
  hue: number;
};

export type TouchRipple = {
  x: number;
  y: number;
  r: number;
  life: number;
};
