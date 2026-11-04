import { type IsbnIssue, normalizeIsbn, type IsbnResult, checkDigit10, checkDigit13 } from "./isbn.part1";
import { to13, hyphenate13, to10 } from "./isbn.part2";
export { normalizeIsbn, checkDigit13, checkDigit10 } from "./isbn.part1";
export type { IsbnIssue, IsbnResult } from "./isbn.part1";
export { hyphenate13 } from "./isbn.part2";

export function validateIsbn(raw: string, es: boolean): IsbnIssue[] {
  const compact = normalizeIsbn(raw);
  if (!compact) {
    return [{ field: "isbn", message: es ? "Pegá un ISBN. Los espacios y guiones se ignoran." : "Paste an ISBN. Spaces and hyphens are ignored." }];
  }
  if (/[^0-9X]/.test(compact) || (compact.includes("X") && !compact.endsWith("X"))) {
    return [{ field: "isbn", message: es ? "Solo dígitos, y X solo como dígito de control de ISBN-10." : "Digits only, and X only as the ISBN-10 check digit." }];
  }
  if (compact.length !== 10 && compact.length !== 13) {
    return [{ field: "isbn", message: es ? "Un ISBN tiene 10 o 13 caracteres, sin contar guiones." : "An ISBN has 10 or 13 characters, not counting hyphens." }];
  }
  if (compact.length === 13 && !/^\d{13}$/.test(compact)) {
    return [{ field: "isbn", message: es ? "El ISBN-13 no usa X. El dígito de control es 0–9." : "ISBN-13 does not use X. The check digit is 0–9." }];
  }
  if (compact.length === 13 && !compact.startsWith("978") && !compact.startsWith("979")) {
    return [{ field: "isbn", message: es ? "El prefijo ISBN-13 tiene que ser 978 o 979." : "The ISBN-13 prefix must be 978 or 979." }];
  }
  return [];
}

export function analyzeIsbn(raw: string): IsbnResult | null {
  const compact = normalizeIsbn(raw);
  if (compact.length !== 10 && compact.length !== 13) return null;
  if (compact.length === 10) {
    if (!/^\d{9}[\dX]$/.test(compact)) return null;
    const expected = checkDigit10(compact.slice(0, 9));
    const isbn13 = to13(compact);
    return {
      kind: "isbn-10",
      compact,
      valid: expected === compact[9],
      expectedCheck: expected,
      actualCheck: compact[9],
      isbn13,
      isbn10: compact.slice(0, 9) + expected,
      hyphenated: hyphenate13(isbn13),
      group: hyphenate13(isbn13)?.split("-")[1] ?? null,
    };
  }
  if (!/^\d{13}$/.test(compact) || (!compact.startsWith("978") && !compact.startsWith("979"))) return null;
  const expected = checkDigit13(compact.slice(0, 12));
  const isbn10 = compact.startsWith("978") ? to10(compact.slice(0, 12) + expected) : null;
  return {
    kind: "isbn-13",
    compact,
    valid: expected === compact[12],
    expectedCheck: expected,
    actualCheck: compact[12],
    isbn13: compact.slice(0, 12) + expected,
    isbn10,
    hyphenated: hyphenate13(compact.slice(0, 12) + expected),
    group: hyphenate13(compact.slice(0, 12) + expected)?.split("-")[1] ?? null,
  };
}
