import { type CronFields, type CronIssue, type CronPreview, joinCron } from "./cron.part1";
import { matchesCron, sets, pad, isStar, validateCron, formatLocal } from "./cron.part2";
export { emptyCron, weekdayPreset, every15Preset, hourlyPreset, joinCron, splitCron } from "./cron.part1";
export type { CronFields, CronIssue, CronPreview, CronFieldName } from "./cron.part1";
export { validateCron, matchesCron, formatLocal } from "./cron.part2";

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
