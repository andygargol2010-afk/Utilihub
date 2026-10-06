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

const MONTHS: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};
const DAYS: Record<string, number> = {
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
};

const FIELD_SPEC = {
  minute: { min: 0, max: 59, names: {} as Record<string, number> },
  hour: { min: 0, max: 23, names: {} as Record<string, number> },
  dayOfMonth: { min: 1, max: 31, names: {} as Record<string, number> },
  month: { min: 1, max: 12, names: MONTHS },
  dayOfWeek: { min: 0, max: 7, names: DAYS },
} as const;

export type CronFieldName = keyof typeof FIELD_SPEC;

const FIELD_ORDER: CronFieldName[] = ["minute", "hour", "dayOfMonth", "month", "dayOfWeek"];

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

function tokenValue(token: string, names: Record<string, number>): number | null {
  const upper = token.toUpperCase();
  if (names[upper] !== undefined) return names[upper];
  if (!/^\d+$/.test(token)) return null;
  const value = Number(token);
  if (!Number.isFinite(value)) return null;
  return value;
}

function expandField(raw: string, field: CronFieldName): number[] | CronIssue {
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

function sets(fields: CronFields): Record<CronFieldName, number[]> {
  const out = {} as Record<CronFieldName, number[]>;
  for (const field of FIELD_ORDER) {
    const expanded = expandField(fields[field], field);
    out[field] = Array.isArray(expanded) ? expanded : [];
  }
  return out;
}

function isStar(value: string): boolean {
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

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatLocal(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function nextRuns(fields: CronFields, from: Date, count = 5): Date[] {
  const start = new Date(from.getTime());
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);
  const found: Date[] = [];
  const limit = 366 * 24 * 60;
  for (let i = 0; i < limit && found.length < count; i++) {
    const candidate = new Date(start.getTime() + i * 60_000);
    if (matchesCron(fields, candidate)) found.push(candidate);
  }
  return found;
}

const MONTH_NAME = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAME_ES = ["", "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DAY_NAME = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAME_ES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

function listLabel(values: number[], names: string[], es: boolean): string {
  if (values.length > 8) return es ? `${values.length} valores` : `${values.length} values`;
  return values.map((value) => names[value] ?? String(value)).join(", ");
}

export function explainCron(fields: CronFields, es: boolean): string {
  const expanded = sets(fields);
  const minute = fields.minute.trim() === "*" ? (es ? "cada minuto" : "every minute") : expanded.minute.join(", ");
  const hour = fields.hour.trim() === "*" ? (es ? "cada hora" : "every hour") : expanded.hour.map(pad).join(", ");
  const month = fields.month.trim() === "*"
    ? (es ? "todos los meses" : "every month")
    : listLabel(expanded.month, es ? MONTH_NAME_ES : MONTH_NAME, es);
  const dom = fields.dayOfMonth.trim() === "*"
    ? (es ? "cualquier día del mes" : "any day of month")
    : expanded.dayOfMonth.join(", ");
  const dow = fields.dayOfWeek.trim() === "*"
    ? (es ? "cualquier día de la semana" : "any weekday")
    : listLabel(expanded.dayOfWeek, es ? DAY_NAME_ES : DAY_NAME, es);
  const orNote = !isStar(fields.dayOfMonth) && !isStar(fields.dayOfWeek)
    ? (es ? " Día del mes y día de la semana se combinan con OR (crontab Vixie)." : " Day-of-month and day-of-week use OR (Vixie crontab).")
    : "";
  return es
    ? `Minutos ${minute}; horas ${hour}; día del mes ${dom}; mes ${month}; día de la semana ${dow}.${orNote}`
    : `Minutes ${minute}; hours ${hour}; day of month ${dom}; month ${month}; weekday ${dow}.${orNote}`;
}

export function issueText(issue: CronIssue, es: boolean): string {
  const label = es
    ? { minute: "minuto", hour: "hora", dayOfMonth: "día del mes", month: "mes", dayOfWeek: "día de la semana" }[issue.field]
    : issue.field;
  if (issue.message === "empty") return es ? `${label}: vacío` : `${label}: empty`;
  if (issue.message === "range") return es ? `${label}: fuera de rango` : `${label}: out of range`;
  return es ? `${label}: valor inválido (negativo, NaN o token)` : `${label}: invalid value (negative, NaN, or token)`;
}

export function previewCron(fields: CronFields, from: Date, es: boolean): CronPreview | null {
  if (validateCron(fields).length) return null;
  return {
    expression: joinCron(fields),
    fields,
    summary: explainCron(fields, es),
    next: nextRuns(fields, from).map(formatLocal),
    domAndDowOr: !isStar(fields.dayOfMonth) && !isStar(fields.dayOfWeek),
  };
}
