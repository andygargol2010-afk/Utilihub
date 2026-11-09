// Part 2 of 3 — split from ics-event.ts on 2026-11-04. Edit here; ics-event.ts re-exports.
import { type IcsInput, type IcsIssue, parseDate, parseTime } from "./ics-event.part1";

export function foldIcsLine(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const chunks: string[] = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    while (end > start && (bytes[end - 1] & 0xc0) === 0x80) end -= 1;
    if (end === start) end = Math.min(start + limit, bytes.length);
    chunks.push(new TextDecoder().decode(bytes.slice(start, end)));
    start = end;
    limit = 74;
  }
  return chunks.map((chunk, index) => (index === 0 ? chunk : ` ${chunk}`)).join("\r\n");
}

export function parseCount(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false as const, reason: "empty" };
  if (!/^-?\d+$/.test(trimmed)) return { ok: false as const, reason: "nan" };
  const count = Number(trimmed);
  if (!Number.isFinite(count)) return { ok: false as const, reason: "nan" };
  return { ok: true as const, count };
}

export function validateIcs(input: IcsInput, es: boolean): IcsIssue[] {
  const issues: IcsIssue[] = [];
  const title = input.title.trim();
  if (!title) issues.push({ field: "title", message: es ? "El título no puede estar vacío." : "Title cannot be empty." });
  if (title.length > 180) issues.push({ field: "title", message: es ? "El título supera 180 caracteres." : "Title is longer than 180 characters." });

  const start = parseDate(input.startDate);
  const end = parseDate(input.endDate);
  if (!start) issues.push({ field: "startDate", message: es ? "La fecha de inicio no es válida." : "Start date is not valid." });
  if (!end) issues.push({ field: "endDate", message: es ? "La fecha de fin no es válida." : "End date is not valid." });

  const count = parseCount(input.weeklyCount);
  if (!count.ok) {
    issues.push({
      field: "weeklyCount",
      message: es ? "Las repeticiones deben ser un entero (1 = sin RRULE)." : "Repeat count must be an integer (1 = no RRULE).",
    });
  } else if (count.count < 1 || count.count > 52) {
    issues.push({
      field: "weeklyCount",
      message: es ? "Las repeticiones van de 1 a 52. Cero y negativos no generan un archivo." : "Repeat count must be 1 to 52. Zero and negatives do not build a file.",
    });
  }

  if (input.reminderMinutes.trim()) {
    const reminder = parseCount(input.reminderMinutes);
    if (!reminder.ok || reminder.count < 0 || reminder.count > 10080) {
      issues.push({
        field: "reminder",
        message: es ? "El aviso debe ser minutos enteros de 0 a 10080, o vacío." : "Reminder must be whole minutes from 0 to 10080, or empty.",
      });
    }
  }

  if (!input.allDay) {
    const startTime = parseTime(input.startTime);
    const endTime = parseTime(input.endTime);
    if (!startTime) issues.push({ field: "startTime", message: es ? "La hora de inicio no es válida." : "Start time is not valid." });
    if (!endTime) issues.push({ field: "endTime", message: es ? "La hora de fin no es válida." : "End time is not valid." });
    if (start && end && startTime && endTime) {
      const startMs = Date.UTC(start.y, start.m - 1, start.d, startTime.h, startTime.min);
      const endMs = Date.UTC(end.y, end.m - 1, end.d, endTime.h, endTime.min);
      if (endMs <= startMs) {
        issues.push({ field: "end", message: es ? "El fin debe ser posterior al inicio." : "End must be after the start." });
      }
    }
  } else if (start && end) {
    const startMs = Date.UTC(start.y, start.m - 1, start.d);
    const endMs = Date.UTC(end.y, end.m - 1, end.d);
    if (endMs <= startMs) {
      issues.push({
        field: "end",
        message: es
          ? "En todo el día el fin es exclusivo y debe ser posterior al inicio."
          : "All-day end is exclusive and must be after the start.",
      });
    }
  }

  return issues;
}
