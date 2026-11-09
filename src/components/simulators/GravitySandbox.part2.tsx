// Part 2 of 3 — split from GravitySandbox.tsx on 2026-11-04. Edit here; GravitySandbox.tsx re-exports.
import { type Body } from "./GravitySandbox.part1";

export type Preset = "orbit" | "binary" | "cluster";

export const W = 480;
export const H = 340;
export const SOFT = 14;
export const TRAIL_MAX = 110;
export const MAX_BODIES = 28;
export const DT = 1 / 60;

export function hueForMass(m: number) {
  return Math.max(18, Math.min(210, 220 - m * 12));
}
export function emptyTrail() {
  return {
    trail: Array.from({ length: TRAIL_MAX }, () => ({ x: 0, y: 0 })),
    trailHead: 0,
    trailLen: 0,
  };
}
export function withTrail(p: Omit<Body, "trail" | "trailHead" | "trailLen">): Body {
  return { ...p, ...emptyTrail() };
}
export function pushTrail(b: Body, x: number, y: number) {
  b.trail[b.trailHead] = { x, y };
  b.trailHead = (b.trailHead + 1) % TRAIL_MAX;
  if (b.trailLen < TRAIL_MAX) b.trailLen++;
}
export function clearTrail(b: Body) {
  b.trailHead = 0;
  b.trailLen = 0;
}
export function makeOrbit(): Body[] {
  return [
    withTrail({ x: W / 2, y: H / 2, vx: 0, vy: 0, m: 20, hue: 42 }),
    withTrail({ x: W / 2 + 120, y: H / 2, vx: 0, vy: 1.5, m: 2.4, hue: 195 }),
    withTrail({ x: W / 2 - 75, y: H / 2 + 45, vx: 0.32, vy: -1.85, m: 1.5, hue: 160 }),
  ];
}
export function makeBinary(): Body[] {
  return [
    withTrail({ x: W / 2 - 60, y: H / 2, vx: 0, vy: -0.88, m: 9, hue: 35 }),
    withTrail({ x: W / 2 + 60, y: H / 2, vx: 0, vy: 0.88, m: 9, hue: 200 }),
    withTrail({ x: W / 2, y: H / 2 - 110, vx: 1.3, vy: 0, m: 1.3, hue: 140 }),
  ];
}
export function makeCluster(): Body[] {
  const list: Body[] = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const r = 42 + (i % 4) * 20;
    list.push(
      withTrail({
        x: W / 2 + Math.cos(a) * r,
        y: H / 2 + Math.sin(a) * r * 0.72,
        vx: -Math.sin(a) * 0.52,
        vy: Math.cos(a) * 0.42,
        m: 1.2 + (i % 3) * 0.85,
        hue: 40 + i * 12,
      }),
    );
  }
  return list;
}
export function fromPreset(p: Preset) {
  return p === "binary" ? makeBinary() : p === "cluster" ? makeCluster() : makeOrbit();
}
export function radiusOf(m: number) {
  return 3.5 + Math.sqrt(m) * 2.6;
}
export function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
