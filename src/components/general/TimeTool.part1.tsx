// Part 1 of 3 — split from TimeTool.tsx on 2026-11-04. Edit here; TimeTool.tsx re-exports.

export const iso = (d: Date) => d.toISOString().slice(0, 10);
