// Part 2 of 3 — split from GreatCircleDistanceCalculatorTool.tsx on 2026-11-04. Edit here; GreatCircleDistanceCalculatorTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function toRad(d: number) {
  return (d * Math.PI) / 180;
}

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number | { error: string } {
  if (!Number.isFinite(lat1) || lat1 < -90 || lat1 > 90) return { error: "lat1" };
  if (!Number.isFinite(lon1) || lon1 < -180 || lon1 > 180) return { error: "lon1" };
  if (!Number.isFinite(lat2) || lat2 < -90 || lat2 > 90) return { error: "lat2" };
  if (!Number.isFinite(lon2) || lon2 < -180 || lon2 > 180) return { error: "lon2" };
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
