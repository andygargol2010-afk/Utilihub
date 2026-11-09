// Part 2 of 3 — split from investment.ts on 2026-11-04. Edit here; investment.ts re-exports.

export const futureDca = (
  initial: number,
  monthly: number,
  annualRate: number,
  months: number,
) => {
  const r = annualRate / 100 / 12;
  if (months <= 0) return initial;
  if (r === 0) return initial + monthly * months;
  const factor = Math.pow(1 + r, months);
  return initial * factor + monthly * (factor - 1) / r;
};
