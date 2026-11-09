// Part 2 of 3 — split from PomodoroTimerTool.tsx on 2026-11-04. Edit here; PomodoroTimerTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";
export const primaryBtn = `${buttonClass} bg-primary text-primary-foreground`;

export type Phase = "work" | "shortBreak" | "longBreak";
