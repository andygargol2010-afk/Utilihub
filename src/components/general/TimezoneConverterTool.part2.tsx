// Part 2 of 3 — split from TimezoneConverterTool.tsx on 2026-11-04. Edit here; TimezoneConverterTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

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

/** Offset (ms) of `zone` at that instant; null for an invalid zone. */
function zoneOffsetMs(instant: Date, zone: string): number | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(instant);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value ?? "0");
    const asUtc = Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour") % 24,
      get("minute"),
      get("second"),
    );
    return asUtc - instant.getTime();
  } catch {
    return null;
  }
}

/**
 * Interpret a datetime-local wall clock ("YYYY-MM-DDTHH:mm") as the time in an
 * IANA zone (respecting DST at that date) and return the real instant.
 * `new Date(datetime)` would wrongly interpret it in the browser's local zone.
 */
export function wallClockInZone(datetimeLocal: string, zone: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(datetimeLocal.trim());
  if (!match) return null;
  const [, y, mo, d, h, mi, s] = match;
  const asUtc = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), s ? Number(s) : 0);
  let ts = asUtc;
  // Two refinements are enough for DST offset changes at the guess boundary.
  for (let i = 0; i < 3; i++) {
    const off = zoneOffsetMs(new Date(ts), zone);
    if (off === null) return null;
    ts = asUtc - off;
  }
  return Number.isFinite(ts) ? new Date(ts) : null;
}
