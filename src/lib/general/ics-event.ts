import { type IcsInput, parseDate, escapeIcsText, dateStamp, parseTime, toUtcStamp, toFloatingStamp, addDays, pad } from "./ics-event.part1";
import { parseCount, foldIcsLine } from "./ics-event.part2";
export { emptyIcsInput, meetingPreset, allDayPreset, weeklyPreset, escapeIcsText } from "./ics-event.part1";
export type { IcsTimezone, IcsInput, IcsIssue } from "./ics-event.part1";
export { foldIcsLine, validateIcs } from "./ics-event.part2";

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
