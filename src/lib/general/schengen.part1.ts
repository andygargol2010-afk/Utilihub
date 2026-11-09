// Part 1 of 3 — split from schengen.ts on 2026-11-04. Edit here; schengen.ts re-exports.

/** Schengen short-stay day count: 90 days in any rolling 180-day window. Dates are inclusive calendar days. */

export type SchengenStay = { id: string; entry: string; exit: string };

export type SchengenIssue = { field: string; message: string };

export type SchengenStayResult = {
  id: string;
  days: number;
  inWindow: number;
};

export type SchengenResult = {
  used: number;
  remaining: number;
  overstay: number;
  windowStart: string;
  windowEnd: string;
  stays: SchengenStayResult[];
  nextFreeDate: string | null;
  daysUntilOneFree: number | null;
};

export function newStayId() {
  return Math.random().toString(36).slice(2, 8);
}

export function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIso(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

export function formatIso(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86400000);
}

export function inclusiveDays(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
}
