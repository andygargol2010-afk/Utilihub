// Part 1 of 3 — split from ics-event.ts on 2026-11-04. Edit here; ics-event.ts re-exports.

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

export const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
export const TIME_RE = /^(\d{2}):(\d{2})$/;

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

export function parseDate(value: string): { y: number; m: number; d: number } | null {
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

export function parseTime(value: string): { h: number; min: number } | null {
  const match = TIME_RE.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const min = Number(match[2]);
  if (h > 23 || min > 59) return null;
  return { h, min };
}

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function dateStamp(parts: { y: number; m: number; d: number }) {
  return `${parts.y}${pad(parts.m)}${pad(parts.d)}`;
}

export function addDays(parts: { y: number; m: number; d: number }, days: number) {
  const date = new Date(Date.UTC(parts.y, parts.m - 1, parts.d + days));
  return { y: date.getUTCFullYear(), m: date.getUTCMonth() + 1, d: date.getUTCDate() };
}

export function toUtcStamp(parts: { y: number; m: number; d: number }, time: { h: number; min: number }) {
  return `${dateStamp(parts)}T${pad(time.h)}${pad(time.min)}00Z`;
}

export function toFloatingStamp(parts: { y: number; m: number; d: number }, time: { h: number; min: number }) {
  return `${dateStamp(parts)}T${pad(time.h)}${pad(time.min)}00`;
}

export function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
