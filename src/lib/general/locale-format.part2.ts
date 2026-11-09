// Part 2 of 3 — split from locale-format.ts on 2026-11-04. Edit here; locale-format.ts re-exports.
import { type LocaleFormatInput, type LocaleFormatIssue } from "./locale-format.part1";

/** Returns the canonical tag, or null when Intl rejects it. */
export function canonicalLocale(tag: string): string | null {
  const trimmed = tag.trim().replace(/_/g, "-");
  if (!trimmed) return null;
  try {
    const [canonical] = Intl.getCanonicalLocales(trimmed);
    return canonical ?? null;
  } catch {
    return null;
  }
}

export function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s+/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function parseDate(raw: string): Date | null {
  if (!raw.trim()) return null;
  const value = new Date(raw);
  return Number.isNaN(value.getTime()) ? null : value;
}

export function validCurrency(code: string): boolean {
  if (!/^[A-Z]{3}$/.test(code)) return false;
  try {
    new Intl.NumberFormat("en", { style: "currency", currency: code });
    return true;
  } catch {
    return false;
  }
}

export function validateLocaleInput(input: LocaleFormatInput, es: boolean): LocaleFormatIssue[] {
  const issues: LocaleFormatIssue[] = [];
  if (!canonicalLocale(input.locale)) {
    issues.push({
      field: "locale",
      message: es
        ? "Etiqueta de locale inválida. Usá un formato BCP 47 como es-AR, en-US o zh-Hant-TW."
        : "Invalid locale tag. Use a BCP 47 tag such as en-US, es-AR or zh-Hant-TW.",
    });
  }
  if (!parseDate(input.date)) {
    issues.push({
      field: "date",
      message: es ? "Elegí una fecha y hora válidas." : "Pick a valid date and time.",
    });
  }
  if (parseNumber(input.number) === null) {
    issues.push({
      field: "number",
      message: es
        ? "Escribí el número con punto decimal y sin separador de miles, por ejemplo 1234567.89."
        : "Type the number with a dot as decimal and no thousands separator, e.g. 1234567.89.",
    });
  }
  if (!validCurrency(input.currency.trim().toUpperCase())) {
    issues.push({
      field: "currency",
      message: es
        ? "Código de moneda ISO 4217 inválido (tres letras, como USD, EUR o MXN)."
        : "Invalid ISO 4217 currency code (three letters, such as USD, EUR or JPY).",
    });
  }
  return issues;
}
