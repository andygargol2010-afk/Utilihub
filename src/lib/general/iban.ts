/** ISO 13616 IBAN check: format, country length, and MOD-97-10. */

export type IbanStatus = "empty" | "format" | "length" | "checksum" | "valid";

export type IbanResult = {
  ok: boolean;
  status: IbanStatus;
  normalized: string;
  grouped: string;
  country: string;
  expectedLength: number | null;
  actualLength: number;
  remainder: number | null;
};

const COUNTRY_LENGTH: Record<string, number> = {
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
  CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24, FI: 18,
  FO: 18, FR: 27, GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28,
  IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28, LC: 32, LI: 21,
  LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31, MU: 30,
  NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24,
  SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26, UA: 29, VG: 24, XK: 20,
};

export const IBAN_PRESETS = {
  gb: "GB82 WEST 1234 5698 7654 32",
  es: "ES91 2100 0418 4502 0005 1332",
} as const;

export function expectedIbanLength(country: string): number | null {
  return COUNTRY_LENGTH[country] ?? null;
}

function lettersToDigits(value: string): string {
  let out = "";
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) out += String(code - 55);
    else out += ch;
  }
  return out;
}

export function ibanMod97(numeric: string): number {
  let remainder = 0;
  for (const ch of numeric) {
    remainder = (remainder * 10 + (ch.charCodeAt(0) - 48)) % 97;
  }
  return remainder;
}

export function groupIban(normalized: string): string {
  return normalized.replace(/(.{4})/g, "$1 ").trim();
}

export function checkIban(raw: string): IbanResult {
  const normalized = raw.replace(/[\s-]+/g, "").toUpperCase();
  const country = normalized.slice(0, 2);
  const expectedLength = /^[A-Z]{2}/.test(country) ? expectedIbanLength(country) : null;
  const base = {
    normalized,
    grouped: groupIban(normalized),
    country: /^[A-Z]{2}/.test(country) ? country : "",
    expectedLength,
    actualLength: normalized.length,
    remainder: null as number | null,
  };
  if (!normalized) return { ok: false, status: "empty", ...base, grouped: "" };
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(normalized) || normalized.length > 34) {
    return { ok: false, status: "format", ...base };
  }
  if (expectedLength != null && normalized.length !== expectedLength) {
    return { ok: false, status: "length", ...base };
  }
  const rearranged = normalized.slice(4) + normalized.slice(0, 4);
  const remainder = ibanMod97(lettersToDigits(rearranged));
  const ok = remainder === 1;
  return { ok, status: ok ? "valid" : "checksum", ...base, remainder };
}
