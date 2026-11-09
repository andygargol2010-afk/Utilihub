// Part 2 of 3 — split from TimezoneConverterTool.tsx on 2026-11-04. Edit here; TimezoneConverterTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export const COMMON_ZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

export function formatInZone(date: Date, zone: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: zone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return null;
  }
}
