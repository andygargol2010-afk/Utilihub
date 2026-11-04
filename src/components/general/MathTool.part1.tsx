// Part 1 of 3 — split from MathTool.tsx on 2026-11-04. Edit here; MathTool.tsx re-exports.

/** Split on commas, semicolons, newlines, or any whitespace (spaces/tabs). */
export const values = (s: string) =>
  s
    .split(/[\n,;\s]+/)
    .map((x) => Number(x.trim().replace(",", ".")))
    .filter(Number.isFinite);
export const median = (xs: number[]) => {
  const a = [...xs].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};
