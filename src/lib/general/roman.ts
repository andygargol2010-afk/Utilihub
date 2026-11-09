export type RomanDirection = "to-roman" | "to-number";

export type RomanResult =
  | { status: "empty"; output: null; issue: "empty"; detail: null }
  | { status: "invalid"; output: null; issue: "range" | "form" | "number"; detail: string }
  | { status: "ok"; output: string; issue: null; detail: null; value: number };

const PAIRS: ReadonlyArray<readonly [number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

const VALUES: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

export function numberToRoman(input: string): RomanResult {
  const raw = input.trim();
  if (!raw) return { status: "empty", output: null, issue: "empty", detail: null };
  if (!/^[0-9]+$/.test(raw)) return { status: "invalid", output: null, issue: "number", detail: raw };
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > 3999) {
    return { status: "invalid", output: null, issue: "range", detail: raw };
  }
  let rest = value;
  let roman = "";
  for (const [amount, glyph] of PAIRS) {
    while (rest >= amount) {
      roman += glyph;
      rest -= amount;
    }
  }
  return { status: "ok", output: roman, issue: null, detail: null, value };
}

export function romanToNumber(input: string): RomanResult {
  const raw = input.trim().toUpperCase();
  if (!raw) return { status: "empty", output: null, issue: "empty", detail: null };
  if (!/^[IVXLCDM]+$/.test(raw)) return { status: "invalid", output: null, issue: "form", detail: raw };
  let total = 0;
  for (let i = 0; i < raw.length; i += 1) {
    const current = VALUES[raw[i]];
    const next = VALUES[raw[i + 1]] ?? 0;
    total += current < next ? -current : current;
  }
  if (total < 1 || total > 3999) return { status: "invalid", output: null, issue: "range", detail: raw };
  const canonical = numberToRoman(String(total));
  if (canonical.status !== "ok" || canonical.output !== raw) {
    return { status: "invalid", output: null, issue: "form", detail: raw };
  }
  return { status: "ok", output: String(total), issue: null, detail: null, value: total };
}
