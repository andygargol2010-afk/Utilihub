/** Local ICS (RFC 5545) builder. No network. */

export type IcsTimezone = "floating" | "utc";

export type IcsInput = {
  title: string;
  description: string;
  location: string;
  allDay: boolean;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: IcsTimezone;
  reminderMinutes: string;
  weeklyCount: string;
};

export type IcsIssue = { field: string; message: string };

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^(\d{2}):(\d{2})$/;

export function emptyIcsInput(): IcsInput {
  return {
    title: "",
    description: "",
    location: "",
    allDay: false,
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "10:00",
    timezone: "floating",
    reminderMinutes: "",
    weeklyCount: "1",
  };
}

export function meetingPreset(): IcsInput {
  return {
    ...emptyIcsInput(),
    title: "Product review",
    description: "Walk the launch checklist.",
    location: "Room 2",
    startDate: "2026-10-06",
    endDate: "2026-10-06",
    startTime: "09:00",
    endTime: "10:30",
    weeklyCount: "1",
  };
}

export function allDayPreset(): IcsInput {
  return {
    ...emptyIcsInput(),
    title: "Launch day",
    description: "All-day marker. End date is exclusive in the file.",
    allDay: true,
    startDate: "2026-10-06",
    endDate: "2026-10-07",
    weeklyCount: "1",
  };
}

export function weeklyPreset(): IcsInput {
  return {
    ...emptyIcsInput(),
    title: "Weekly standup",
    description: "15 minute sync.",
    location: "Video",
    startDate: "2026-10-06",
    endDate: "2026-10-06",
    startTime: "09:00",
    endTime: "09:15",
    reminderMinutes: "10",
    weeklyCount: "4",
  };
}

function parseDate(value: string): { y: number; m: number; d: number } | null {
  const match = DATE_RE.exec(value.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return { y, m, d };
}

function parseTime(value: string): { h: number; min: number } | null {
  const match = TIME_RE.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const min = Number(match[2]);
  if (h > 23 || min > 59) return null;
  return { h, min };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dateStamp(parts: { y: number; m: number; d: number }) {
  return `${parts.y}${pad(parts.m)}${pad(parts.d)}`;
}

function addDays(parts: { y: number; m: number; d: number }, days: number) {
  const date = new Date(Date.UTC(parts.y, parts.m - 1, parts.d + days));
  return { y: date.getUTCFullYear(), m: date.getUTCMonth() + 1, d: date.getUTCDate() };
}

function toUtcStamp(parts: { y: number; m: number; d: number }, time: { h: number; min: number }) {
  return `${dateStamp(parts)}T${pad(time.h)}${pad(time.min)}00Z`;
}

function toFloatingStamp(parts: { y: number; m: number; d: number }, time: { h: number; min: number }) {
  return `${dateStamp(parts)}T${pad(time.h)}${pad(time.min)}00`;
}

export function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

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

function parseCount(value: string) {
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

export function buildIcs(input: IcsInput, now = new Date()): string {
  const start = parseDate(input.startDate);
  const end = parseDate(input.endDate);
  if (!start || !end) return "";
  const count = parseCount(input.weeklyCount);
  if (!count.ok) return "";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UtiliHub//ICS Generator//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
  ];

  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  lines.push(`DTSTAMP:${stamp}`);
  lines.push(`UID:${stamp.replace(/\W/g, "")}-utilihub@utilihub.local`);
  lines.push(`SUMMARY:${escapeIcsText(input.title.trim())}`);
  if (input.description.trim()) lines.push(`DESCRIPTION:${escapeIcsText(input.description.trim())}`);
  if (input.location.trim()) lines.push(`LOCATION:${escapeIcsText(input.location.trim())}`);

  if (input.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${dateStamp(start)}`);
    lines.push(`DTEND;VALUE=DATE:${dateStamp(end)}`);
  } else {
    const startTime = parseTime(input.startTime);
    const endTime = parseTime(input.endTime);
    if (!startTime || !endTime) return "";
    if (input.timezone === "utc") {
      lines.push(`DTSTART:${toUtcStamp(start, startTime)}`);
      lines.push(`DTEND:${toUtcStamp(end, endTime)}`);
    } else {
      lines.push(`DTSTART:${toFloatingStamp(start, startTime)}`);
      lines.push(`DTEND:${toFloatingStamp(end, endTime)}`);
    }
  }

  if (count.count > 1) lines.push(`RRULE:FREQ=WEEKLY;COUNT=${count.count}`);

  if (input.reminderMinutes.trim()) {
    const reminder = parseCount(input.reminderMinutes);
    if (reminder.ok && reminder.count >= 0) {
      lines.push("BEGIN:VALARM");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:${escapeIcsText(input.title.trim())}`);
      lines.push(`TRIGGER:-PT${reminder.count}M`);
      lines.push("END:VALARM");
    }
  }

  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");
  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

export function exclusiveAllDayEnd(startDate: string) {
  const start = parseDate(startDate);
  if (!start) return "";
  const next = addDays(start, 1);
  return `${next.y}-${pad(next.m)}-${pad(next.d)}`;
}
