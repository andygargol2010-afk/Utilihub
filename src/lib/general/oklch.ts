/** Convert sRGB hex and CSS OKLCH. Out-of-gamut or empty input does not invent a hex. */
export type OklchResult =
  | { status: "ok"; hex: string; l: number; c: number; h: number | null; css: string; achromatic: boolean }
  | { status: "empty" | "invalid" | "range" | "gamut"; hex: null; l: number | null; c: number | null; h: number | null };

const HEX = /^#?([0-9a-fA-F]{6})$/;
const OKLCH = /^oklch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+)(?:deg)?\s*\)$/i;

function linToSrgb(channel: number): number {
  return channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
}

function srgbToLin(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function inGamut(value: number): boolean {
  return value >= -0.0001 && value <= 1.0001;
}

function toHexChannel(channel: number): string {
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

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function parseLightness(raw: string): number | null {
  if (raw.endsWith("%")) {
    const value = Number(raw.slice(0, -1));
    if (!Number.isFinite(value)) return null;
    return value / 100;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function parseChroma(raw: string): number | null {
  if (raw.endsWith("%")) {
    const value = Number(raw.slice(0, -1));
    if (!Number.isFinite(value)) return null;
    return value / 100;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function convertOklch(input: string): OklchResult {
  const text = input.trim();
  if (!text) return { status: "empty", hex: null, l: null, c: null, h: null };
  if (text.startsWith("#") || HEX.test(text)) {
    const oklch = hexToOklch(text.startsWith("#") ? text : `#${text}`);
    if (!oklch) return { status: "invalid", hex: null, l: null, c: null, h: null };
    const css = oklch.h === null ? `oklch(${oklch.l} 0 0)` : `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
    return { status: "ok", hex: `#${HEX.exec(text.startsWith("#") ? text : `#${text}`)![1].toLowerCase()}`, l: oklch.l, c: oklch.c, h: oklch.h, css, achromatic: oklch.h === null };
  }
  const match = OKLCH.exec(text.replace(/,/g, " "));
  if (!match) return { status: "invalid", hex: null, l: null, c: null, h: null };
  const l = parseLightness(match[1]);
  const c = parseChroma(match[2]);
  const h = Number(match[3]);
  if (l === null || c === null || !Number.isFinite(h)) return { status: "invalid", hex: null, l: null, c: null, h: null };
  if (l < 0 || l > 1 || c < 0 || c > 0.4 || h < 0 || h > 360) return { status: "range", hex: null, l, c, h };
  const rgb = oklchToSrgb(l, c, h);
  if (!rgb) return { status: "invalid", hex: null, l, c, h };
  if (!rgb.gamut) return { status: "gamut", hex: null, l, c, h };
  const rounded = { l: round4(l), c: round4(c), h: c < 0.0005 ? null : Math.round(h * 10) / 10 };
  const css = rounded.h === null ? `oklch(${rounded.l} 0 0)` : `oklch(${rounded.l} ${rounded.c} ${rounded.h})`;
  return { status: "ok", hex: rgb.hex, l: rounded.l, c: rounded.c, h: rounded.h, css, achromatic: rounded.h === null };
}
