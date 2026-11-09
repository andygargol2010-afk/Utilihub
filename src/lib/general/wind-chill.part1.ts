// Part 1 of 3 — split from wind-chill.ts on 2026-11-04. Edit here; wind-chill.ts re-exports.

/** NWS 2001 wind-chill. Inputs convert to °F and mph before the formula. */

export type WindUnit = "mph" | "kmh";
export type TempUnit = "F" | "C";

export type WindChillInput = {
  temperature: string;
  tempUnit: TempUnit;
  wind: string;
  windUnit: WindUnit;
};

export type WindChillIssue = { field: string; message: string };

export type WindChillResult = {
  airF: number;
  airC: number;
  windMph: number;
  windKmh: number;
  chillF: number;
  chillC: number;
  formulaApplied: boolean;
  note: string;
  noteEs: string;
  frostbite: string;
  frostbiteEs: string;
};

export function emptyWindChill(): WindChillInput {
  return { temperature: "", tempUnit: "C", wind: "", windUnit: "kmh" };
}

export function walkPreset(): WindChillInput {
  return { temperature: "0", tempUnit: "C", wind: "20", windUnit: "kmh" };
}

export function nwsPreset(): WindChillInput {
  return { temperature: "0", tempUnit: "F", wind: "15", windUnit: "mph" };
}

export function parseNumber(value: string) {
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return { ok: false as const, reason: "empty" };
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return { ok: false as const, reason: "nan" };
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return { ok: false as const, reason: "nan" };
  return { ok: true as const, n };
}

export function toF(temp: number, unit: TempUnit) {
  return unit === "F" ? temp : temp * 9 / 5 + 32;
}

export function toC(tempF: number) {
  return (tempF - 32) * 5 / 9;
}

export function toMph(wind: number, unit: WindUnit) {
  return unit === "mph" ? wind : wind / 1.609344;
}

/** NWS 2001: 35.74 + 0.6215T − 35.75 V^0.16 + 0.4275 T V^0.16, T in °F, V in mph. */
export function nwsWindChillF(tempF: number, windMph: number) {
  const v = Math.pow(windMph, 0.16);
  return 35.74 + 0.6215 * tempF - 35.75 * v + 0.4275 * tempF * v;
}
