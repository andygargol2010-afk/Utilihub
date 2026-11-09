export type RutChileResult =
  | { status: "empty"; formatted: null; expected: null; error: "empty" }
  | { status: "invalid"; formatted: string | null; expected: string | null; error: "length" | "body" | "digit" }
  | { status: "ok"; formatted: string; expected: string; error: null };

export const RUT_CHILE_SAMPLE = "12.345.678-5";

export function rutCheckDigit(body: string): string {
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += Number(body[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return "0";
  if (remainder === 10) return "K";
  return String(remainder);
}

export function formatRut(body: string, digit: string): string {
  const grouped = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${grouped}-${digit}`;
}

export function checkRutChile(raw: string): RutChileResult {
  const trimmed = raw.trim();
  if (!trimmed) return { status: "empty", formatted: null, expected: null, error: "empty" };

  const compact = trimmed.replace(/[.\s]/g, "").toUpperCase();
  const match = compact.match(/^(\d+)(-?[0-9K])?$/);
  if (!match) return { status: "invalid", formatted: null, expected: null, error: "body" };

  const hasDigit = Boolean(match[2]);
  const body = hasDigit ? match[1] : match[1];
  const given = hasDigit ? match[2].replace("-", "") : null;
  if (!/^\d+$/.test(body) || body.length < 7 || body.length > 8) {
    return { status: "invalid", formatted: null, expected: null, error: "length" };
  }

  const expected = rutCheckDigit(body);
  const formatted = formatRut(body, given ?? expected);
  if (given && given !== expected) {
    return { status: "invalid", formatted: formatRut(body, expected), expected, error: "digit" };
  }
  return { status: "ok", formatted: formatRut(body, expected), expected, error: null };
}
