/** Unix timestamp (seconds or milliseconds) ↔ local date. Invalid input returns null. */
export function timestampToDate(value: string): Date | null {
  const n = Number(value.trim());
  if (!Number.isFinite(n)) return null;
  const ms = Math.abs(n) < 1e12 ? n * 1000 : n;
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function dateToTimestamp(isoOrLocal: string, inMs = false): number | null {
  const d = new Date(isoOrLocal);
  if (Number.isNaN(d.getTime())) return null;
  return inMs ? d.getTime() : Math.floor(d.getTime() / 1000);
}

export const UNIX_SAMPLE_TS = "1700000000";
export const UNIX_SAMPLE_ISO = "2023-11-14T22:13:20.000Z";
