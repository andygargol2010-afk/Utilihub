export type BeaufortUnit = "ms" | "kmh" | "kn" | "mph";

export type BeaufortResult =
  | { status: "empty"; force: null; error: "empty" }
  | { status: "invalid"; force: null; error: "number" | "negative" }
  | {
      status: "ok";
      force: number;
      error: null;
      ms: number;
      nameEn: string;
      nameEs: string;
      rangeEn: string;
      rangeEs: string;
    };

export const BEAUFORT_SAMPLE_MS = "10";
export const BEAUFORT_SAMPLE_KMH = "20";

const TO_MS: Record<BeaufortUnit, number> = {
  ms: 1,
  kmh: 1 / 3.6,
  kn: 0.514444,
  mph: 0.44704,
};

/** WMO upper bounds in m/s. Force 0 is below 0.3; force 12 is 32.7 and above. */
const UPPER_MS = [0.3, 1.6, 3.4, 5.5, 8, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7];

const NAMES_EN = [
  "Calm",
  "Light air",
  "Light breeze",
  "Gentle breeze",
  "Moderate breeze",
  "Fresh breeze",
  "Strong breeze",
  "Near gale",
  "Gale",
  "Strong gale",
  "Storm",
  "Violent storm",
  "Hurricane",
];

const NAMES_ES = [
  "Calma",
  "Ventolina",
  "Flojito",
  "Flojo",
  "Bonancible",
  "Fresquito",
  "Fresco",
  "Frescachón",
  "Temporal",
  "Temporal fuerte",
  "Temporal duro",
  "Temporal muy duro",
  "Temporal huracanado",
];

function round(value: number): string {
  return (Math.round(value * 10) / 10).toFixed(1);
}

function fromMs(ms: number, unit: BeaufortUnit): number {
  return ms / TO_MS[unit];
}

function rangeLabel(force: number, unit: BeaufortUnit, es: boolean): string {
  const unitLabel = unit === "ms" ? "m/s" : unit === "kmh" ? "km/h" : unit === "kn" ? "kn" : "mph";
  if (force === 0) {
    return es ? `menos de ${round(fromMs(0.3, unit))} ${unitLabel}` : `under ${round(fromMs(0.3, unit))} ${unitLabel}`;
  }
  if (force === 12) {
    return es ? `${round(fromMs(32.7, unit))} ${unitLabel} o más` : `${round(fromMs(32.7, unit))} ${unitLabel} or more`;
  }
  const low = UPPER_MS[force - 1];
  const high = UPPER_MS[force] - 0.1;
  return es
    ? `${round(fromMs(low, unit))}-${round(fromMs(high, unit))} ${unitLabel}`
    : `${round(fromMs(low, unit))}-${round(fromMs(high, unit))} ${unitLabel}`;
}

export function windToBeaufort(raw: string, unit: BeaufortUnit): BeaufortResult {
  const trimmed = raw.trim().replace(",", ".");
  if (!trimmed) return { status: "empty", force: null, error: "empty" };
  if (!/^[+]?\d+(\.\d+)?$/.test(trimmed)) return { status: "invalid", force: null, error: "number" };
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return { status: "invalid", force: null, error: "number" };
  if (value < 0) return { status: "invalid", force: null, error: "negative" };
  const ms = value * TO_MS[unit];
  let force = 12;
  for (let i = 0; i < UPPER_MS.length; i++) {
    if (ms < UPPER_MS[i]) {
      force = i;
      break;
    }
  }
  return {
    status: "ok",
    force,
    error: null,
    ms,
    nameEn: NAMES_EN[force],
    nameEs: NAMES_ES[force],
    rangeEn: rangeLabel(force, unit, false),
    rangeEs: rangeLabel(force, unit, true),
  };
}
