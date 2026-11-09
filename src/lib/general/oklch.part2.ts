// Part 2 of 3 — split from oklch.ts on 2026-11-04. Edit here; oklch.ts re-exports.
import { HEX, srgbToLin } from "./oklch.part1";

export function hexToOklch(hex: string): { l: number; c: number; h: number | null } | null {
  const match = HEX.exec(hex.trim());
  if (!match) return null;
  const n = Number.parseInt(match[1], 16);
  const r = srgbToLin(((n >> 16) & 255) / 255);
  const g = srgbToLin(((n >> 8) & 255) / 255);
  const b = srgbToLin((n & 255) / 255);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.hypot(A, B);
  if (C < 0.0005) return { l: round4(L), c: 0, h: null };
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: round4(L), c: round4(C), h: Math.round(H * 10) / 10 };
}

export function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export function parseLightness(raw: string): number | null {
  if (raw.endsWith("%")) {
    const value = Number(raw.slice(0, -1));
    if (!Number.isFinite(value)) return null;
    return value / 100;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}
