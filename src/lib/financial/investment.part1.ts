// Part 1 of 3 — split from investment.ts on 2026-11-04. Edit here; investment.ts re-exports.

export const f = (key: string, label: string, defaultValue: number, unit = "") => ({
  key,
  label,
  defaultValue,
  unit,
});
