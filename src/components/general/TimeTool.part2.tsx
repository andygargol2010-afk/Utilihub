// Part 2 of 3 — split from TimeTool.tsx on 2026-11-04. Edit here; TimeTool.tsx re-exports.

export const parseDate = (s: string) => {
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};
export const pad = (n: number) => String(n).padStart(2, "0");
export const formatMs = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};
export const TIMER_SLUGS = new Set(["cronometro", "temporizador", "temporizador-cocina", "pomodoro"]);
