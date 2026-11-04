// Part 1 of 3 — split from oklch.ts on 2026-11-04. Edit here; oklch.ts re-exports.

/** Convert sRGB hex and CSS OKLCH. Out-of-gamut or empty input does not invent a hex. */
export type OklchResult =
  | { status: "ok"; hex: string; l: number; c: number; h: number | null; css: string; achromatic: boolean }
  | { status: "empty" | "invalid" | "range" | "gamut"; hex: null; l: number | null; c: number | null; h: number | null };

export const HEX = /^#?([0-9a-fA-F]{6})$/;
export const OKLCH = /^oklch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+)(?:deg)?\s*\)$/i;

export function linToSrgb(channel: number): number {
  return channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
}

export function srgbToLin(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function inGamut(value: number): boolean {
  return value >= -0.0001 && value <= 1.0001;
}

export function toHexChannel(channel: number): string {
  return Math.round(Math.min(1, Math.max(0, channel)) * 255).toString(16).padStart(2, "0");
}

export function oklchToSrgb(l: number, c: number, h: number): { hex: string; gamut: boolean } | null {
  if (!Number.isFinite(l) || !Number.isFinite(c) || !Number.isFinite(h)) return null;
  const hue = (h * Math.PI) / 180;
  const a = c * Math.cos(hue);
  const b = c * Math.sin(hue);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const ll = l_ ** 3;
  const mm = m_ ** 3;
  const ss = s_ ** 3;
  const rl = 4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss;
  const gl = -1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss;
  const bl = -0.0041960863 * ll - 0.7034186147 * mm + 1.707614701 * ss;
  const r = linToSrgb(rl);
  const g = linToSrgb(gl);
  const bch = linToSrgb(bl);
  const gamut = inGamut(r) && inGamut(g) && inGamut(bch);
  return { hex: `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(bch)}`, gamut };
}
