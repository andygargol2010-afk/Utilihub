// Part 1 of 3 — split from cron.ts on 2026-11-04. Edit here; cron.ts re-exports.

export type CronFields = {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
};

export type CronIssue = { field: string; message: string };

export type CronPreview = {
  expression: string;
  fields: CronFields;
  summary: string;
  next: string[];
  domAndDowOr: boolean;
};

export const MONTHS: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};
export const DAYS: Record<string, number> = {
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
};

export const FIELD_SPEC = {
  minute: { min: 0, max: 59, names: {} as Record<string, number> },
  hour: { min: 0, max: 23, names: {} as Record<string, number> },
  dayOfMonth: { min: 1, max: 31, names: {} as Record<string, number> },
  month: { min: 1, max: 12, names: MONTHS },
  dayOfWeek: { min: 0, max: 7, names: DAYS },
} as const;

export type CronFieldName = keyof typeof FIELD_SPEC;

export const FIELD_ORDER: CronFieldName[] = ["minute", "hour", "dayOfMonth", "month", "dayOfWeek"];

export function emptyCron(): CronFields {
  return { minute: "", hour: "", dayOfMonth: "", month: "", dayOfWeek: "" };
}

export function weekdayPreset(): CronFields {
  return { minute: "30", hour: "8", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" };
}

export function every15Preset(): CronFields {
  return { minute: "*/15", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" };
}

export function hourlyPreset(): CronFields {
  return { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" };
}

export function joinCron(fields: CronFields): string {
  return FIELD_ORDER.map((key) => fields[key].trim()).join(" ");
}

export function splitCron(expression: string): CronFields | null {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4],
  };
}

export function tokenValue(token: string, names: Record<string, number>): number | null {
  const upper = token.toUpperCase();
  if (names[upper] !== undefined) return names[upper];
  if (!/^\d+$/.test(token)) return null;
  const value = Number(token);
  if (!Number.isFinite(value)) return null;
  return value;
}
