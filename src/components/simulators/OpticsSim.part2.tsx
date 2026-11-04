// Part 2 of 3 — split from OpticsSim.tsx on 2026-11-04. Edit here; OpticsSim.tsx re-exports.
import { type Device } from "./OpticsSim.part1";

export const W = 560;
export const H = 340;
export const AXIS_Y = H / 2 + 8;
export const ELEM_X = 300;

export function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function uToX(uCm: number) {
  return ELEM_X - uCm * 2.15;
}
export function vToX(vCm: number, isMirror: boolean) {
  return isMirror ? ELEM_X - vCm * 2.15 : ELEM_X + vCm * 2.15;
}

export function computeImage(device: Device, u: number, fAbs: number) {
  const converging = device === "convex-lens" || device === "concave-mirror";
  const f = converging ? fAbs : -fAbs;
  const isMirror = device.includes("mirror");
  if (Math.abs(u - f) < 0.05) {
    return { v: Infinity as number, m: Infinity as number, real: false, inverted: false, atInfinity: true, f, isMirror };
  }
  const v = 1 / (1 / f - 1 / u);
  const m = -v / u;
  return { v, m, real: v > 0, inverted: m < 0, atInfinity: false, f, isMirror };
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function deviceLabel(d: Device, es: boolean) {
  const map: Record<Device, [string, string]> = {
    "convex-lens": ["Convex lens", "Lente convergente"],
    "concave-lens": ["Concave lens", "Lente divergente"],
    "concave-mirror": ["Concave mirror", "Espejo cóncavo"],
    "convex-mirror": ["Convex mirror", "Espejo convexo"],
  };
  return es ? map[d][1] : map[d][0];
}
