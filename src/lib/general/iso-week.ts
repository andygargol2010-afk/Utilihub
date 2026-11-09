export type IsoWeekParts = { year: number; week: number; weekday: number };

export type IsoWeekResult =
  | { status: "empty"; label: null; error: "empty" }
  | { status: "invalid"; label: null; error: "date" | "week" | "weekday" | "range" }
  | { status: "ok"; label: string; error: null; parts: IsoWeekParts; date: string };

export const ISO_WEEK_SAMPLE_DATE = "2021-01-01";
export const ISO_WEEK_SAMPLE_WEEK = "2024-W01-1";

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const WEEK_RE = /^(\d{4})-W(\d{2})-([1-7])$/;

function utcDate(year: number, month: number, day: number): Date | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

function pad(value: number, width: number): string {
  return String(value).padStart(width, "0");
}

export function formatIsoWeek(parts: IsoWeekParts): string {
  return `${parts.year}-W${pad(parts.week, 2)}-${parts.weekday}`;
}

export function formatIsoDate(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1, 2)}-${pad(date.getUTCDate(), 2)}`;
}

/** ISO 8601 week: Monday start, week 1 contains the first Thursday. */
export function dateToIsoWeek(raw: string): IsoWeekResult {
  const trimmed = raw.trim();
  if (!trimmed) return { status: "empty", label: null, error: "empty" };
  const match = DATE_RE.exec(trimmed);
  if (!match) return { status: "invalid", label: null, error: "date" };
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = utcDate(year, month, day);
  if (!date || year < 1 || year > 9999) return { status: "invalid", label: null, error: "date" };

  const weekday = date.getUTCDay() || 7;
  const thursday = new Date(date);
  thursday.setUTCDate(date.getUTCDate() + 4 - weekday);
  const weekYear = thursday.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const week = Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const parts = { year: weekYear, week, weekday };
  return { status: "ok", label: formatIsoWeek(parts), error: null, parts, date: formatIsoDate(date) };
}

export function isoWeekToDate(raw: string): IsoWeekResult {
  const trimmed = raw.trim().toUpperCase();
  if (!trimmed) return { status: "empty", label: null, error: "empty" };
  const match = WEEK_RE.exec(trimmed);
  if (!match) return { status: "invalid", label: null, error: "week" };
  const year = Number(match[1]);
  const week = Number(match[2]);
  const weekday = Number(match[3]);
  if (year < 1 || year > 9999) return { status: "invalid", label: null, error: "range" };
  if (week < 1 || week > 53) return { status: "invalid", label: null, error: "week" };
  if (weekday < 1 || weekday > 7) return { status: "invalid", label: null, error: "weekday" };

  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Weekday = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - (jan4Weekday - 1) + (week - 1) * 7 + (weekday - 1));
  const date = formatIsoDate(monday);
  const back = dateToIsoWeek(date);
  if (back.status !== "ok" || back.parts.year !== year || back.parts.week !== week || back.parts.weekday !== weekday) {
    return { status: "invalid", label: null, error: "range" };
  }
  return { status: "ok", label: date, error: null, parts: { year, week, weekday }, date };
}
