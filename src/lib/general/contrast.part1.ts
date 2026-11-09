// Part 1 of 3 — split from contrast.ts on 2026-11-04. Edit here; contrast.ts re-exports.

/** WCAG 2.x contrast ratio from sRGB relative luminance. */

export type ContrastInput = { foreground: string; background: string };

export type ContrastIssue = { field: string; message: string };

export type ContrastLevel = "fail" | "aa-large" | "aa" | "aaa";

export type ContrastResult = {
  foreground: string;
  background: string;
  ratio: number;
  ratioLabel: string;
  normalAa: boolean;
  normalAaa: boolean;
  largeAa: boolean;
  largeAaa: boolean;
  uiAa: boolean;
  level: ContrastLevel;
  suggestion: string | null;
  suggestionRatio: number | null;
};

export function emptyContrast(): ContrastInput {
  return { foreground: "", background: "" };
}

export function bodyPreset(): ContrastInput {
  return { foreground: "#0F172A", background: "#FFFFFF" };
}

export function borderlinePreset(): ContrastInput {
  return { foreground: "#767676", background: "#FFFFFF" };
}

export function failPreset(): ContrastInput {
  return { foreground: "#FF6B6B", background: "#FFFFFF" };
}

export function parseHex(value: string): { ok: true; hex: string } | { ok: false; reason: "empty" | "bad" } {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, reason: "empty" };
  const raw = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  if (!/^[0-9a-fA-F]+$/.test(raw)) return { ok: false, reason: "bad" };
  if (raw.length === 3) {
    const hex = raw.split("").map((c) => c + c).join("");
    return { ok: true, hex: hex.toUpperCase() };
  }
  if (raw.length === 6) return { ok: true, hex: raw.toUpperCase() };
  return { ok: false, reason: "bad" };
}
