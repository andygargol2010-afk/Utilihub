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

function group978(rest: string) {
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

function registrantLength(group: string, body: string) {
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

function to13(compact: string) {
  if (compact.length === 13) return compact;
  const body = `978${compact.slice(0, 9)}`;
  return body + checkDigit13(body);
}

function to10(isbn13: string) {
  if (!isbn13.startsWith("978")) return null;
  const body = isbn13.slice(3, 12);
  return body + checkDigit10(body);
}

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
