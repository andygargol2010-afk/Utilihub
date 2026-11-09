export type Hemisphere = "N" | "S" | "E" | "W";

export type Dms = {
  degrees: number;
  minutes: number;
  seconds: number;
  hemisphere: Hemisphere;
};

export type DecimalResult =
  | { status: "ok"; latDms: string; lonDms: string; pair: string }
  | { status: "empty" | "invalid"; message: "empty" | "lat" | "lon" | "range" };

export type DmsResult =
  | { status: "ok"; lat: string; lon: string; pair: string }
  | { status: "empty" | "invalid"; message: "empty" | "minutes" | "seconds" | "range" };

function formatFixed(n: number): string {
  return n.toFixed(6);
}

export function decimalToDms(value: number, kind: "lat" | "lon"): Dms {
  const hemisphere: Hemisphere = kind === "lat" ? (value < 0 ? "S" : "N") : value < 0 ? "W" : "E";
  const abs = Math.abs(value);
  let degrees = Math.floor(abs + 1e-10);
  const minuteFloat = (abs - degrees) * 60;
  let minutes = Math.floor(minuteFloat + 1e-10);
  let seconds = Math.round((minuteFloat - minutes) * 60 * 100) / 100;
  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    degrees += 1;
  }
  return { degrees, minutes, seconds, hemisphere };
}

export function formatDms(dms: Dms): string {
  return `${dms.degrees}° ${dms.minutes}' ${dms.seconds.toFixed(2)}" ${dms.hemisphere}`;
}

export function dmsToDecimal(dms: Dms): number {
  const abs = dms.degrees + dms.minutes / 60 + dms.seconds / 3600;
  return dms.hemisphere === "S" || dms.hemisphere === "W" ? -abs : abs;
}

function parseNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(",", ".");
  if (!trimmed || !/^[+-]?\d+(\.\d+)?$/.test(trimmed)) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export function fromDecimal(latRaw: string, lonRaw: string): DecimalResult {
  if (!latRaw.trim() && !lonRaw.trim()) return { status: "empty", message: "empty" };
  const lat = parseNumber(latRaw);
  const lon = parseNumber(lonRaw);
  if (lat === null) return { status: "invalid", message: "lat" };
  if (lon === null) return { status: "invalid", message: "lon" };
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return { status: "invalid", message: "range" };
  const latDms = formatDms(decimalToDms(lat, "lat"));
  const lonDms = formatDms(decimalToDms(lon, "lon"));
  return { status: "ok", latDms, lonDms, pair: `${latDms}, ${lonDms}` };
}

export function fromDms(
  lat: { degrees: string; minutes: string; seconds: string; hemisphere: "N" | "S" },
  lon: { degrees: string; minutes: string; seconds: string; hemisphere: "E" | "W" },
): DmsResult {
  const fields = [lat.degrees, lat.minutes, lat.seconds, lon.degrees, lon.minutes, lon.seconds];
  if (fields.every((field) => !field.trim())) return { status: "empty", message: "empty" };
  const ld = parseNumber(lat.degrees);
  const lm = parseNumber(lat.minutes);
  const ls = parseNumber(lat.seconds);
  const od = parseNumber(lon.degrees);
  const om = parseNumber(lon.minutes);
  const os = parseNumber(lon.seconds);
  if ([ld, lm, ls, od, om, os].some((n) => n === null) || ld! < 0 || od! < 0) {
    return { status: "invalid", message: "range" };
  }
  if (lm! < 0 || om! < 0 || lm! >= 60 || om! >= 60) return { status: "invalid", message: "minutes" };
  if (ls! < 0 || os! < 0 || ls! >= 60 || os! >= 60) return { status: "invalid", message: "seconds" };
  const latDec = dmsToDecimal({ degrees: ld!, minutes: lm!, seconds: ls!, hemisphere: lat.hemisphere });
  const lonDec = dmsToDecimal({ degrees: od!, minutes: om!, seconds: os!, hemisphere: lon.hemisphere });
  if (Math.abs(latDec) > 90 || Math.abs(lonDec) > 180) return { status: "invalid", message: "range" };
  const latText = formatFixed(latDec);
  const lonText = formatFixed(lonDec);
  return { status: "ok", lat: latText, lon: lonText, pair: `${latText}, ${lonText}` };
}
