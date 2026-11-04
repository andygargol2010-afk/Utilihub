// Part 2 of 3 — split from ProjectileSim.tsx on 2026-11-04. Edit here; ProjectileSim.tsx re-exports.
import { W } from "./ProjectileSim.part1";

export const H = 340;
export const ORIGIN_X = 48;
export const ORIGIN_Y = H - 36;
export const SCALE = 2.35; // px per meter
export const DT = 1 / 120;
export const TRAIL_MAX = 400;

export type Point = { x: number; y: number };

export function idealRange(v0: number, angleDeg: number, g: number) {
  const th = (angleDeg * Math.PI) / 180;
  return (v0 * v0 * Math.sin(2 * th)) / g;
}
export function idealHeight(v0: number, angleDeg: number, g: number) {
  const th = (angleDeg * Math.PI) / 180;
  return (v0 * v0 * Math.sin(th) * Math.sin(th)) / (2 * g);
}
export function idealTime(v0: number, angleDeg: number, g: number) {
  const th = (angleDeg * Math.PI) / 180;
  return (2 * v0 * Math.sin(th)) / g;
}

export function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function worldToScreen(x: number, y: number): Point {
  return { x: ORIGIN_X + x * SCALE, y: ORIGIN_Y - y * SCALE };
}
