// Part 2 of 3 — split from ColorHarmonyJourney.tsx on 2026-11-04. Edit here; ColorHarmonyJourney.tsx re-exports.
import { type Harmony } from "./ColorHarmonyJourney.part1";

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generatePalette(baseHex: string, harmony: Harmony): string[] {
  const { h, s, l } = hexToHsl(baseHex);
  const base = baseHex.toUpperCase();
  if (harmony === "complementary") {
    return [base, hslToHex(h + 180, s, l)];
  }
  if (harmony === "analogous") {
    return [hslToHex(h - 30, s, l), base, hslToHex(h + 30, s, l)];
  }
  // triadic
  return [base, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)];
}

export const LABELS = {
  en: {
    step1: "Step 1: Choose base color",
    step2: "Step 2: Select harmony type",
    base: "Base color",
    complementary: "Complementary",
    analogous: "Analogous",
    triadic: "Triadic",
    palette: "Generated palette",
    hex: "HEX",
    hsl: "HSL",
    live: "Live preview updates as you change values.",
  },
  es: {
    step1: "Paso 1: Elegir color base",
    step2: "Paso 2: Tipo de armonía",
    base: "Color base",
    complementary: "Complementaria",
    analogous: "Análoga",
    triadic: "Triádica",
    palette: "Paleta generada",
    hex: "HEX",
    hsl: "HSL",
    live: "La visualización se actualiza en vivo al cambiar los valores.",
  },
} as const;
