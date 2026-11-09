export type GtinKind = "ean-8" | "upc-a" | "ean-13" | "gtin-14";

export type EanResult =
  | { status: "empty" }
  | { status: "invalid"; message: "digits" | "length" }
  | {
      status: "ok";
      kind: GtinKind;
      body: string;
      expected: string;
      given: string | null;
      valid: boolean;
      formatted: string;
    };

const LENGTHS: Record<number, GtinKind> = {
  7: "ean-8",
  8: "ean-8",
  11: "upc-a",
  12: "upc-a",
  13: "ean-13",
  14: "gtin-14",
};

/** GS1 check digit: from the right, odd positions ×3, even ×1. */
export function gtinCheckDigit(body: string): string {
  let sum = 0;
  const digits = body.split("").map(Number);
  for (let i = 0; i < digits.length; i++) {
    const fromRight = digits.length - i;
    sum += digits[i] * (fromRight % 2 === 1 ? 3 : 1);
  }
  return String((10 - (sum % 10)) % 10);
}

export function parseGtin(raw: string): EanResult {
  const trimmed = raw.trim();
  if (!trimmed) return { status: "empty" };
  const compact = trimmed.replace(/[\s-]/g, "");
  if (!/^\d+$/.test(compact)) return { status: "invalid", message: "digits" };
  const kind = LENGTHS[compact.length];
  if (!kind) return { status: "invalid", message: "length" };
  const fullLength = kind === "ean-8" ? 8 : kind === "upc-a" ? 12 : kind === "ean-13" ? 13 : 14;
  const hasCheck = compact.length === fullLength;
  const body = hasCheck ? compact.slice(0, -1) : compact;
  const expected = gtinCheckDigit(body);
  const given = hasCheck ? compact.slice(-1) : null;
  const full = body + expected;
  return {
    status: "ok",
    kind,
    body,
    expected,
    given,
    valid: given === null || given === expected,
    formatted: formatGtin(full, kind),
  };
}

function formatGtin(full: string, kind: GtinKind): string {
  if (kind === "ean-8") return `${full.slice(0, 4)} ${full.slice(4)}`;
  if (kind === "upc-a") return `${full.slice(0, 1)} ${full.slice(1, 6)} ${full.slice(6, 11)} ${full.slice(11)}`;
  if (kind === "ean-13") return `${full.slice(0, 1)} ${full.slice(1, 7)} ${full.slice(7)}`;
  return `${full.slice(0, 1)} ${full.slice(1, 8)} ${full.slice(8)}`;
}
