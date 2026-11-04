// Part 1 of 3 — split from iso-duration.ts on 2026-11-04. Edit here; iso-duration.ts re-exports.

/** ISO 8601 duration builder. Weeks are exclusive of Y/M/D (ISO 8601-1). */

export type IsoDurationInput = {
  years: string;
  months: string;
  weeks: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export type IsoIssue = { field: string; message: string };

export type IsoDurationResult = {
  duration: string;
  datePart: string;
  timePart: string;
  approximateSeconds: number;
  note: string;
  noteEs: string;
};

export function emptyIsoDuration(): IsoDurationInput {
  return { years: "", months: "", weeks: "", days: "", hours: "", minutes: "", seconds: "" };
}

export function meetingPreset(): IsoDurationInput {
  return { years: "0", months: "0", weeks: "0", days: "0", hours: "1", minutes: "30", seconds: "0" };
}

export function sprintPreset(): IsoDurationInput {
  return { years: "0", months: "0", weeks: "2", days: "0", hours: "0", minutes: "0", seconds: "0" };
}

export function leasePreset(): IsoDurationInput {
  return { years: "1", months: "2", weeks: "0", days: "3", hours: "4", minutes: "0", seconds: "0" };
}

export function parsePart(value: string) {
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return { ok: true as const, n: 0, blank: true };
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    if (trimmed.startsWith("-")) return { ok: false as const, reason: "neg" as const };
    return { ok: false as const, reason: "nan" as const };
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return { ok: false as const, reason: "nan" as const };
  if (n < 0) return { ok: false as const, reason: "neg" as const };
  if (!Number.isInteger(n)) return { ok: false as const, reason: "frac" as const };
  if (n > 9999) return { ok: false as const, reason: "big" as const };
  return { ok: true as const, n, blank: false };
}
