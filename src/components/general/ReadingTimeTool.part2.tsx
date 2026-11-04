// Part 2 of 3 — split from ReadingTimeTool.tsx on 2026-11-04. Edit here; ReadingTimeTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export function formatMinutes(minutes: number, es: boolean): string {
  if (minutes < 1) {
    const secs = Math.round(minutes * 60);
    return es ? `${secs} s` : `${secs}s`;
  }
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  if (s === 0) return es ? `${m} min` : `${m} min`;
  return es ? `${m} min ${s} s` : `${m}m ${s}s`;
}
