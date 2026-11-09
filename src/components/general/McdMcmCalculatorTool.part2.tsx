// Part 2 of 3 — split from McdMcmCalculatorTool.tsx on 2026-11-04. Edit here; McdMcmCalculatorTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.floor(a));
  b = Math.abs(Math.floor(b));
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}
