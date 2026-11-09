// Part 2 of 3 — split from RomanNumeralsConverterTool.tsx on 2026-11-04. Edit here; RomanNumeralsConverterTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export const ROMAN_MAP: [number, string][] = [
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

export function toRoman(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) return "";
  let result = "";
  for (const [value, symbol] of ROMAN_MAP) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

export function fromRoman(roman: string): number | null {
  const s = roman.toUpperCase().trim();
  if (!s || !/^[IVXLCDM]+$/.test(s)) return null;
  let i = 0;
  let total = 0;
  for (const [value, symbol] of ROMAN_MAP) {
    while (s.startsWith(symbol, i)) {
      total += value;
      i += symbol.length;
    }
  }
  if (i !== s.length) return null;
  // Validate subtractive correctness by round-trip
  if (toRoman(total) !== s) return null;
  return total;
}
