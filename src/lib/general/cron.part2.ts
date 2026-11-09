// Part 2 of 3 — split from cron.ts on 2026-11-04. Edit here; cron.ts re-exports.
import { type CronFieldName, type CronIssue, FIELD_SPEC, tokenValue, type CronFields, FIELD_ORDER } from "./cron.part1";

export function expandField(raw: string, field: CronFieldName): number[] | CronIssue {
  const text = raw.trim();
  if (!text) return { field, message: "empty" };
  if (/nan/i.test(text) || text.includes("-") && text.trim().startsWith("-")) {
    return { field, message: "invalid" };
  }
  const spec = FIELD_SPEC[field];
  const values = new Set<number>();
  for (const part of text.split(",")) {
    const piece = part.trim();
    if (!piece) return { field, message: "invalid" };
    const match = piece.match(/^(\*|[A-Za-z]{3}|\d+)(?:-([A-Za-z]{3}|\d+))?(?:\/(\d+))?$/);
    if (!match) return { field, message: "invalid" };
    const [, startRaw, endRaw, stepRaw] = match;
    if (startRaw === "*" && endRaw) return { field, message: "invalid" };
    const step = stepRaw === undefined ? 1 : Number(stepRaw);
    if (!Number.isInteger(step) || step <= 0) return { field, message: "invalid" };
    const start = startRaw === "*" ? spec.min : tokenValue(startRaw, spec.names);
    const end = endRaw === undefined ? (startRaw === "*" ? spec.max : start) : tokenValue(endRaw, spec.names);
    if (start === null || end === null) return { field, message: "invalid" };
    const from = startRaw === "*" || endRaw !== undefined ? start : start;
    const to = startRaw === "*" ? spec.max : endRaw !== undefined ? end : spec.max;
    const rangeEnd = endRaw !== undefined || startRaw === "*" ? to : stepRaw !== undefined ? spec.max : start;
    if (from < spec.min || rangeEnd > spec.max || from > rangeEnd) return { field, message: "range" };
    for (let value = from; value <= rangeEnd; value += step) values.add(field === "dayOfWeek" && value === 7 ? 0 : value);
  }
  if (values.size === 0) return { field, message: "invalid" };
  return [...values].sort((a, b) => a - b);
}

export function validateCron(fields: CronFields): CronIssue[] {
  const issues: CronIssue[] = [];
  for (const field of FIELD_ORDER) {
    const expanded = expandField(fields[field], field);
    if (!Array.isArray(expanded)) issues.push(expanded);
  }
  return issues;
}

export function sets(fields: CronFields): Record<CronFieldName, number[]> {
  const out = {} as Record<CronFieldName, number[]>;
  for (const field of FIELD_ORDER) {
    const expanded = expandField(fields[field], field);
    out[field] = Array.isArray(expanded) ? expanded : [];
  }
  return out;
}

export function isStar(value: string): boolean {
  return value.trim() === "*";
}

export function matchesCron(fields: CronFields, date: Date): boolean {
  const expanded = sets(fields);
  if (!expanded.minute.includes(date.getMinutes())) return false;
  if (!expanded.hour.includes(date.getHours())) return false;
  if (!expanded.month.includes(date.getMonth() + 1)) return false;
  const domRestricted = !isStar(fields.dayOfMonth);
  const dowRestricted = !isStar(fields.dayOfWeek);
  const domOk = expanded.dayOfMonth.includes(date.getDate());
  const dowOk = expanded.dayOfWeek.includes(date.getDay());
  if (domRestricted && dowRestricted) return domOk || dowOk;
  if (domRestricted) return domOk;
  if (dowRestricted) return dowOk;
  return true;
}

export function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatLocal(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
