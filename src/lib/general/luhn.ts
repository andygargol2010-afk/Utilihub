export type LuhnStatus = "empty" | "nondigit" | "short" | "valid" | "invalid";

export type LuhnResult = {
  status: LuhnStatus;
  digits: string;
  length: number;
  brand: string;
  checkDigit: string;
  expectedCheck: string;
  sum: number;
  remainder: number;
};

const BRANDS: { name: string; test: (d: string) => boolean }[] = [
  { name: "American Express", test: (d) => d.startsWith("34") || d.startsWith("37") },
  { name: "Mastercard", test: (d) => /^5[1-5]/.test(d) || (d.length >= 4 && Number(d.slice(0, 4)) >= 2221 && Number(d.slice(0, 4)) <= 2720) },
  { name: "Visa", test: (d) => d.startsWith("4") },
  { name: "Discover", test: (d) => d.startsWith("6011") || d.startsWith("65") },
  { name: "Diners Club", test: (d) => d.startsWith("36") },
];

export function luhnSum(digits: string): number {
  let sum = 0;
  const parity = digits.length % 2;
  for (let i = 0; i < digits.length; i++) {
    let n = digits.charCodeAt(i) - 48;
    if (i % 2 === parity) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum;
}

export function expectedCheckDigit(payload: string): string {
  const sum = luhnSum(`${payload}0`);
  return String((10 - (sum % 10)) % 10);
}

export function brandOf(digits: string): string {
  return BRANDS.find((brand) => brand.test(digits))?.name ?? "Unknown";
}

export function checkLuhn(raw: string): LuhnResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { status: "empty", digits: "", length: 0, brand: "Unknown", checkDigit: "", expectedCheck: "", sum: 0, remainder: 0 };
  }
  const compact = trimmed.replace(/[\s-]/g, "");
  if (!/^\d+$/.test(compact)) {
    return { status: "nondigit", digits: compact.replace(/\D/g, ""), length: compact.replace(/\D/g, "").length, brand: "Unknown", checkDigit: "", expectedCheck: "", sum: 0, remainder: 0 };
  }
  if (compact.length < 2 || compact.length > 19) {
    return { status: "short", digits: compact, length: compact.length, brand: brandOf(compact), checkDigit: compact.slice(-1), expectedCheck: "", sum: 0, remainder: 0 };
  }
  const sum = luhnSum(compact);
  const remainder = sum % 10;
  const checkDigit = compact.slice(-1);
  const expectedCheck = expectedCheckDigit(compact.slice(0, -1));
  return {
    status: remainder === 0 ? "valid" : "invalid",
    digits: compact,
    length: compact.length,
    brand: brandOf(compact),
    checkDigit,
    expectedCheck,
    sum,
    remainder,
  };
}

export const LUHN_PRESETS = {
  visa: "4111 1111 1111 1111",
  visaBad: "4111 1111 1111 1112",
  amex: "3782 822463 10005",
};
