// Part 2 of 3 — split from isbn.ts on 2026-11-04. Edit here; isbn.ts re-exports.
import { group978, checkDigit13, checkDigit10 } from "./isbn.part1";

export function registrantLength(group: string, body: string) {
  const head = body;
  if (group === "0") {
    const two = Number(head.slice(0, 2));
    if (two >= 0 && two <= 19) return 2;
    if (two >= 20 && two <= 69) return 3;
    const four = Number(head.slice(0, 4));
    if (four >= 7000 && four <= 8499) return 4;
    const five = Number(head.slice(0, 5));
    if (five >= 85000 && five <= 89999) return 5;
    const six = Number(head.slice(0, 6));
    if (six >= 900000 && six <= 949999) return 6;
    const seven = Number(head.slice(0, 7));
    if (seven >= 9500000 && seven <= 9999999) return 7;
  }
  if (group === "1") {
    const two = Number(head.slice(0, 2));
    if (two >= 0 && two <= 9) return 2;
    if (two >= 10 && two <= 39) return 3;
    const four = Number(head.slice(0, 4));
    if (four >= 4000 && four <= 5499) return 4;
    const five = Number(head.slice(0, 5));
    if (five >= 55000 && five <= 86979) return 5;
    const six = Number(head.slice(0, 6));
    if (six >= 869800 && six <= 998999) return 6;
    const seven = Number(head.slice(0, 7));
    if (seven >= 9990000 && seven <= 9999999) return 7;
  }
  return null;
}

export function hyphenate13(isbn13: string) {
  if (!/^978\d{10}$/.test(isbn13)) return null;
  const grouped = group978(isbn13.slice(3, 12));
  if (!grouped) return null;
  const length = registrantLength(grouped.group, grouped.body);
  if (!length || grouped.body.length <= length) return null;
  const registrant = grouped.body.slice(0, length);
  const publication = grouped.body.slice(length);
  return `978-${grouped.group}-${registrant}-${publication}-${isbn13[12]}`;
}

export function to13(compact: string) {
  if (compact.length === 13) return compact;
  const body = `978${compact.slice(0, 9)}`;
  return body + checkDigit13(body);
}

export function to10(isbn13: string) {
  if (!isbn13.startsWith("978")) return null;
  const body = isbn13.slice(3, 12);
  return body + checkDigit10(body);
}
