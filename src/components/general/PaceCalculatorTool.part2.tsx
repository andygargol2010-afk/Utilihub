// Part 2 of 3 — split from PaceCalculatorTool.tsx on 2026-11-04. Edit here; PaceCalculatorTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function parseTime(str: string): number | null {
  // Accept mm:ss or h:mm:ss or minutes as number
  const cleaned = str.trim();
  if (!cleaned) return null;
  if (/^\d+(\.\d+)?$/.test(cleaned)) return parseFloat(cleaned) * 60; // minutes to seconds
  const parts = cleaned.split(":").map((p) => parseInt(p, 10));
  if (parts.some(isNaN)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "—";
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatPace(secondsPerUnit: number): string {
  if (!isFinite(secondsPerUnit) || secondsPerUnit <= 0) return "—";
  return formatTime(secondsPerUnit);
}
