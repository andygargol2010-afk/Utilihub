import { type OklchResult, HEX, OKLCH, oklchToSrgb } from "./oklch.part1";
import { hexToOklch, parseLightness, round4 } from "./oklch.part2";
export { oklchToSrgb } from "./oklch.part1";
export type { OklchResult } from "./oklch.part1";
export { hexToOklch } from "./oklch.part2";

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
