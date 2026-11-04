"use client";
// Part 1 of 3 — split from ArithmeticSuiteTool.tsx on 2026-11-04. Edit here; ArithmeticSuiteTool.tsx re-exports.

export type Locale = "en" | "es";

export function parse(v: string) {
  const t = String(v).trim();
  if (!t) return Number.NaN;
  return Number(t.replace(",", "."));
}

export function fmt(n: number, d = 8) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-15) return "0";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  const t = n.toPrecision(d).replace(/\.?0+e/, "e");
  return t;
}

export type Card = { label: string; value: string; hint?: string };

export function factorize(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let x = n;
  while (x % 2 === 0) {
    factors.set(2, (factors.get(2) ?? 0) + 1);
    x /= 2;
  }
  for (let p = 3; p * p <= x; p += 2) {
    while (x % p === 0) {
      factors.set(p, (factors.get(p) ?? 0) + 1);
      x /= p;
    }
  }
  if (x > 1) factors.set(x, (factors.get(x) ?? 0) + 1);
  return factors;
}

export function isPrime(n: number): boolean {
  if (n <= 1 || !Number.isInteger(n)) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function nextPrime(n: number): number {
  let x = Math.max(2, Math.ceil(n));
  if (x === n && isPrime(n)) return n;
  if (x <= 2) return 2;
  if (x % 2 === 0) x++;
  while (!isPrime(x)) x += 2;
  return x;
}

export function countSigFigs(raw: string): number {
  const s = raw.trim().replace(",", ".").toLowerCase();
  if (!s) return 0;
  const sci = s.match(/^([+-]?\d*\.?\d+)e[+-]?\d+$/);
  const body = sci ? sci[1]! : s;
  const digits = body.replace(/^[+-]/, "").replace(".", "");
  if (body.includes(".")) {
    const stripped = digits.replace(/^0+/, "");
    return stripped.length || 0;
  }
  const noLead = digits.replace(/^0+/, "");
  const noTrail = noLead.replace(/0+$/, "");
  return noTrail.length || (noLead.length ? 1 : 0);
}

export function roundSigFigs(n: number, sig: number): number {
  if (!Number.isFinite(n) || n === 0) return n;
  if (sig < 1) throw new Error("sig");
  const d = Math.ceil(Math.log10(Math.abs(n)));
  const power = sig - d;
  const magnitude = Math.pow(10, power);
  return Math.round(n * magnitude) / magnitude;
}
