// Part 2 of 3 — split from DownloadTimeTool.tsx on 2026-11-04. Edit here; DownloadTimeTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-2 text-sm";
export const buttonClass = "h-10 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
export const primaryBtn = `${buttonClass} bg-primary text-primary-foreground`;

export const SIZE_UNITS = [
  { value: "B", factor: 1 },
  { value: "KB", factor: 1024 },
  { value: "MB", factor: 1024 * 1024 },
  { value: "GB", factor: 1024 * 1024 * 1024 },
  { value: "TB", factor: 1024 * 1024 * 1024 * 1024 },
];

export const SPEED_UNITS = [
  { value: "bps", factor: 1 },
  { value: "Kbps", factor: 1000 },
  { value: "Mbps", factor: 1000 * 1000 },
  { value: "Gbps", factor: 1000 * 1000 * 1000 },
  { value: "KB/s", factor: 1024 * 8 },
  { value: "MB/s", factor: 1024 * 1024 * 8 },
];

export function formatTime(seconds: number, es: boolean): string {
  if (!isFinite(seconds) || seconds < 0) return es ? "Inválido" : "Invalid";
  if (seconds < 1) return es ? "Menos de 1 segundo" : "Less than 1 second";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d) parts.push(`${d} ${es ? (d === 1 ? "día" : "días") : d === 1 ? "day" : "days"}`);
  if (h) parts.push(`${h} ${es ? (h === 1 ? "hora" : "horas") : h === 1 ? "hour" : "hours"}`);
  if (m) parts.push(`${m} ${es ? (m === 1 ? "minuto" : "minutos") : m === 1 ? "minute" : "minutes"}`);
  if (s || parts.length === 0) parts.push(`${s} ${es ? (s === 1 ? "segundo" : "segundos") : s === 1 ? "second" : "seconds"}`);
  return parts.join(es ? ", " : ", ");
}
