// Part 1 of 3 — split from isbn.ts on 2026-11-04. Edit here; isbn.ts re-exports.

/** ISBN-10 and ISBN-13 check digits. Hyphens and spaces are ignored. ISBN-10 check may be X. */

export type IsbnIssue = { field: string; message: string };

export type IsbnResult = {
  kind: "isbn-10" | "isbn-13";
  compact: string;
  valid: boolean;
  expectedCheck: string;
  actualCheck: string;
  isbn13: string;
  isbn10: string | null;
  hyphenated: string | null;
  group: string | null;
};

export function normalizeIsbn(raw: string) {
  return raw.replace(/[\s-]/g, "").toUpperCase();
}

export function checkDigit13(body12: string) {
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(body12[i]) * (i % 2 === 0 ? 1 : 3);
  return String((10 - (sum % 10)) % 10);
}

export function checkDigit10(body9: string) {
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(body9[i]) * (10 - i);
  const remainder = (11 - (sum % 11)) % 11;
  return remainder === 10 ? "X" : String(remainder);
}

export function group978(rest: string) {
  const n = rest;
  if (/^[0-7]/.test(n)) return { group: n.slice(0, 1), body: n.slice(1) };
  const two = Number(n.slice(0, 2));
  if (two >= 80 && two <= 94) return { group: n.slice(0, 2), body: n.slice(2) };
  const three = Number(n.slice(0, 3));
  if (three >= 950 && three <= 989) return { group: n.slice(0, 3), body: n.slice(3) };
  const four = Number(n.slice(0, 4));
  if (four >= 9900 && four <= 9989) return { group: n.slice(0, 4), body: n.slice(4) };
  const five = Number(n.slice(0, 5));
  if (five >= 99900 && five <= 99999) return { group: n.slice(0, 5), body: n.slice(5) };
  return null;
}
