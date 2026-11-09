// Part 1 of 3 — split from FinanceTool.tsx on 2026-11-04. Edit here; FinanceTool.tsx re-exports.

export const num = (v: string) => Number(String(v).trim().replace(",", "."));
export const money = (v: number, es: boolean) =>
  v.toLocaleString(es ? "es-ES" : "en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
export const pct = (v: number, es: boolean) =>
  `${v.toLocaleString(es ? "es-ES" : "en-US", { maximumFractionDigits: 4 })}%`;

export function pmt(principal: number, annualRatePct: number, months: number) {
  if (months <= 0) throw new Error("Term must be positive.");
  if (principal <= 0) throw new Error("Principal must be positive.");
  const r = annualRatePct / 100 / 12;
  if (Math.abs(r) < 1e-12) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

export function remainingBalance(principal: number, annualRatePct: number, months: number, paid: number) {
  if (paid < 0 || paid > months) throw new Error("Payments made must be between 0 and the term.");
  const r = annualRatePct / 100 / 12;
  const payment = pmt(principal, annualRatePct, months);
  if (Math.abs(r) < 1e-12) return Math.max(0, principal - payment * paid);
  return principal * Math.pow(1 + r, paid) - payment * ((Math.pow(1 + r, paid) - 1) / r);
}
