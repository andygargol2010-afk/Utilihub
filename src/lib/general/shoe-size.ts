/** Retail Mondopoint-style adult shoe chart. Planning conversion, not a brand fit. */

export type ShoeSystem = "cm" | "eu" | "uk" | "usM" | "usW";

export type ShoeRow = {
  cm: number;
  eu: string;
  uk: string;
  usM: string;
  usW: string;
};

export const SHOE_ROWS: ShoeRow[] = [
  { cm: 22.0, eu: "35", uk: "2.5", usM: "3.5", usW: "5" },
  { cm: 22.5, eu: "35.5", uk: "3", usM: "4", usW: "5.5" },
  { cm: 23.0, eu: "36", uk: "3.5", usM: "4.5", usW: "6" },
  { cm: 23.5, eu: "37", uk: "4", usM: "5", usW: "6.5" },
  { cm: 24.0, eu: "37.5", uk: "4.5", usM: "5.5", usW: "7" },
  { cm: 24.5, eu: "38", uk: "5", usM: "6", usW: "7.5" },
  { cm: 25.0, eu: "39", uk: "5.5", usM: "6.5", usW: "8" },
  { cm: 25.5, eu: "40", uk: "6", usM: "7", usW: "8.5" },
  { cm: 26.0, eu: "40.5", uk: "7", usM: "8", usW: "9.5" },
  { cm: 26.5, eu: "41", uk: "7.5", usM: "8.5", usW: "10" },
  { cm: 27.0, eu: "42", uk: "8", usM: "9", usW: "10.5" },
  { cm: 27.5, eu: "42.5", uk: "8.5", usM: "9.5", usW: "11" },
  { cm: 28.0, eu: "43", uk: "9", usM: "10", usW: "11.5" },
  { cm: 28.5, eu: "44", uk: "9.5", usM: "10.5", usW: "12" },
  { cm: 29.0, eu: "44.5", uk: "10", usM: "11", usW: "12.5" },
  { cm: 29.5, eu: "45", uk: "10.5", usM: "11.5", usW: "13" },
  { cm: 30.0, eu: "46", uk: "11", usM: "12", usW: "13.5" },
  { cm: 30.5, eu: "47", uk: "12", usM: "13", usW: "14.5" },
  { cm: 31.0, eu: "48", uk: "13", usM: "14", usW: "15.5" },
];

export const SHOE_PRESETS = {
  eu42: { system: "eu" as ShoeSystem, value: "42" },
  usW8: { system: "usW" as ShoeSystem, value: "8" },
};

export type ShoeStatus = "empty" | "invalid" | "range" | "ok";

export type ShoeMatch = {
  status: ShoeStatus;
  row: ShoeRow | null;
  delta: number | null;
  exact: boolean;
};

function labelOf(row: ShoeRow, system: ShoeSystem): string {
  if (system === "cm") return String(row.cm);
  return row[system];
}

function numeric(value: string): number | null {
  const cleaned = value.trim().replace(",", ".");
  if (!cleaned) return null;
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function matchShoeSize(system: ShoeSystem, raw: string): ShoeMatch {
  const n = numeric(raw);
  if (raw.trim() === "") return { status: "empty", row: null, delta: null, exact: false };
  if (n === null) return { status: "invalid", row: null, delta: null, exact: false };

  const scored = SHOE_ROWS.map((row) => {
    const label = Number(labelOf(row, system));
    return { row, delta: Math.abs(label - n), exact: label === n };
  });
  scored.sort((a, b) => a.delta - b.delta || a.row.cm - b.row.cm);
  const best = scored[0];
  const span = system === "cm" ? 1.2 : 1;
  if (best.delta > span) return { status: "range", row: best.row, delta: best.delta, exact: false };
  return { status: "ok", row: best.row, delta: best.delta, exact: best.exact };
}
