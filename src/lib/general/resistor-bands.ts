export type BandColor =
  | "black"
  | "brown"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "violet"
  | "gray"
  | "white"
  | "gold"
  | "silver"
  | "none";

export type BandCount = 4 | 5 | 6;

export const DIGIT_COLORS: BandColor[] = ["black", "brown", "red", "orange", "yellow", "green", "blue", "violet", "gray", "white"];
export const MULTIPLIER_COLORS: BandColor[] = [...DIGIT_COLORS, "gold", "silver"];
export const TOLERANCE_COLORS: BandColor[] = ["brown", "red", "green", "blue", "violet", "gray", "gold", "silver", "none"];
export const TCR_COLORS: BandColor[] = ["brown", "red", "orange", "yellow", "blue", "violet"];

const DIGIT: Partial<Record<BandColor, number>> = {
  black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9,
};
const MULTIPLIER: Partial<Record<BandColor, number>> = {
  black: 1, brown: 10, red: 100, orange: 1_000, yellow: 10_000, green: 100_000, blue: 1_000_000,
  violet: 10_000_000, gray: 100_000_000, white: 1_000_000_000, gold: 0.1, silver: 0.01,
};
const TOLERANCE: Partial<Record<BandColor, number>> = {
  brown: 1, red: 2, green: 0.5, blue: 0.25, violet: 0.1, gray: 0.05, gold: 5, silver: 10, none: 20,
};
const TCR: Partial<Record<BandColor, number>> = {
  brown: 100, red: 50, orange: 15, yellow: 25, blue: 10, violet: 5,
};

export const COLOR_HEX: Record<BandColor, string> = {
  black: "#1c1917",
  brown: "#8a5a2b",
  red: "#dc2626",
  orange: "#ea580c",
  yellow: "#eab308",
  green: "#16a34a",
  blue: "#2563eb",
  violet: "#7c3aed",
  gray: "#6b7280",
  white: "#f8fafc",
  gold: "#d4a017",
  silver: "#cbd5e1",
  none: "transparent",
};

export function colorLabel(color: BandColor, es: boolean): string {
  const en: Record<BandColor, string> = {
    black: "Black", brown: "Brown", red: "Red", orange: "Orange", yellow: "Yellow", green: "Green",
    blue: "Blue", violet: "Violet", gray: "Gray", white: "White", gold: "Gold", silver: "Silver", none: "None",
  };
  const sp: Record<BandColor, string> = {
    black: "Negro", brown: "Marrón", red: "Rojo", orange: "Naranja", yellow: "Amarillo", green: "Verde",
    blue: "Azul", violet: "Violeta", gray: "Gris", white: "Blanco", gold: "Dorado", silver: "Plateado", none: "Ninguno",
  };
  return es ? sp[color] : en[color];
}

export type ResistorResult =
  | { status: "invalid"; reason: "digit" | "multiplier" | "tolerance" | "tcr" }
  | { status: "ok"; ohms: number; tolerancePct: number; tcrPpm: number | null; min: number; max: number };

export function decodeResistor(bands: BandColor[], count: BandCount): ResistorResult {
  const digits = count === 4 ? bands.slice(0, 2) : bands.slice(0, 3);
  const multiplier = bands[count === 4 ? 2 : 3];
  const tolerance = bands[count === 4 ? 3 : 4];
  const tcr = count === 6 ? bands[5] : null;
  if (digits.some((c) => DIGIT[c] === undefined)) return { status: "invalid", reason: "digit" };
  if (MULTIPLIER[multiplier] === undefined) return { status: "invalid", reason: "multiplier" };
  if (TOLERANCE[tolerance] === undefined) return { status: "invalid", reason: "tolerance" };
  if (tcr && TCR[tcr] === undefined) return { status: "invalid", reason: "tcr" };
  const base = digits.reduce((acc, c) => acc * 10 + (DIGIT[c] ?? 0), 0);
  const ohms = base * (MULTIPLIER[multiplier] ?? 1);
  const tolerancePct = TOLERANCE[tolerance] ?? 20;
  const span = ohms * (tolerancePct / 100);
  return {
    status: "ok",
    ohms,
    tolerancePct,
    tcrPpm: tcr ? TCR[tcr] ?? null : null,
    min: ohms - span,
    max: ohms + span,
  };
}

export function formatOhms(ohms: number, es: boolean): string {
  const abs = Math.abs(ohms);
  const unit = es ? "Ω" : "Ω";
  if (abs >= 1_000_000) return `${trim(ohms / 1_000_000)} M${unit}`;
  if (abs >= 1_000) return `${trim(ohms / 1_000)} k${unit}`;
  return `${trim(ohms)} ${unit}`;
}

function trim(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const rounded = Math.round(n * 1000) / 1000;
  return String(rounded);
}

export const RESISTOR_PRESETS: { id: string; count: BandCount; bands: BandColor[] }[] = [
  { id: "1k5", count: 4, bands: ["brown", "black", "red", "gold"] },
  { id: "10k1", count: 5, bands: ["brown", "black", "black", "red", "brown"] },
  { id: "4k7", count: 4, bands: ["yellow", "violet", "red", "gold"] },
];
