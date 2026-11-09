export const BPM_MIN = 20;
export const BPM_MAX = 300;

export type DelayRow = {
  id: string;
  en: string;
  es: string;
  factor: number;
};

/** Quarter note = 60000 / BPM. Factors are relative to a quarter. */
export const DELAY_ROWS: DelayRow[] = [
  { id: "whole", en: "Whole", es: "Redonda", factor: 4 },
  { id: "half", en: "Half", es: "Blanca", factor: 2 },
  { id: "quarter", en: "Quarter", es: "Negra", factor: 1 },
  { id: "dotted-quarter", en: "Dotted quarter", es: "Negra con punto", factor: 1.5 },
  { id: "eighth", en: "Eighth", es: "Corchea", factor: 0.5 },
  { id: "dotted-eighth", en: "Dotted eighth", es: "Corchea con punto", factor: 0.75 },
  { id: "triplet-quarter", en: "Quarter triplet", es: "Tresillo de negras", factor: 2 / 3 },
  { id: "triplet-eighth", en: "Eighth triplet", es: "Tresillo de corcheas", factor: 1 / 3 },
  { id: "sixteenth", en: "Sixteenth", es: "Semicorchea", factor: 0.25 },
];

export type BpmDelayStatus = "empty" | "invalid" | "ok";

export type BpmDelayResult = {
  status: BpmDelayStatus;
  bpm: number | null;
  quarterMs: number | null;
  hz: number | null;
  rows: { id: string; en: string; es: string; ms: number }[];
};

export function parseBpm(raw: string): BpmDelayResult {
  const trimmed = raw.trim().replace(",", ".");
  if (!trimmed) return { status: "empty", bpm: null, quarterMs: null, hz: null, rows: [] };
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return { status: "invalid", bpm: null, quarterMs: null, hz: null, rows: [] };
  const bpm = Number(trimmed);
  if (!Number.isFinite(bpm) || bpm < BPM_MIN || bpm > BPM_MAX) {
    return { status: "invalid", bpm: null, quarterMs: null, hz: null, rows: [] };
  }
  const quarterMs = 60000 / bpm;
  return {
    status: "ok",
    bpm,
    quarterMs,
    hz: bpm / 60,
    rows: DELAY_ROWS.map((row) => ({ id: row.id, en: row.en, es: row.es, ms: quarterMs * row.factor })),
  };
}

export function formatMs(ms: number): string {
  return ms >= 100 ? ms.toFixed(1) : ms.toFixed(2);
}
