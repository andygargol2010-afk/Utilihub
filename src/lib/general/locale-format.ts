import { type LocaleFormatInput, type LocaleFormatResult } from "./locale-format.part1";
import { canonicalLocale, parseDate, parseNumber, validCurrency } from "./locale-format.part2";
export { LOCALE_PRESETS, defaultLocaleInput } from "./locale-format.part1";
export type { LocaleFormatInput, LocaleFormatResult, LocaleFormatIssue } from "./locale-format.part1";
export { canonicalLocale, validateLocaleInput } from "./locale-format.part2";

export function formatForLocale(input: LocaleFormatInput, uiLocale: string): LocaleFormatResult | null {
  const canonical = canonicalLocale(input.locale);
  const date = parseDate(input.date);
  const value = parseNumber(input.number);
  const currency = input.currency.trim().toUpperCase();
  if (!canonical || !date || value === null || !validCurrency(currency)) return null;

  let displayName = canonical;
  try {
    displayName = new Intl.DisplayNames([uiLocale], { type: "language" }).of(canonical) ?? canonical;
  } catch {
    // Older engines without DisplayNames keep the raw tag.
  }

  const parts = new Intl.NumberFormat(canonical).formatToParts(1234567.5);
  const decimalSeparator = parts.find((p) => p.type === "decimal")?.value ?? ".";
  const groupSeparator = parts.find((p) => p.type === "group")?.value ?? "";

  return {
    canonical,
    displayName,
    dateFull: new Intl.DateTimeFormat(canonical, { dateStyle: "full" }).format(date),
    dateShort: new Intl.DateTimeFormat(canonical, { dateStyle: "short" }).format(date),
    dateTime: new Intl.DateTimeFormat(canonical, { dateStyle: "medium", timeStyle: "short" }).format(date),
    number: new Intl.NumberFormat(canonical, { maximumFractionDigits: 3 }).format(value),
    percent: new Intl.NumberFormat(canonical, { style: "percent", maximumFractionDigits: 2 }).format(value / 100),
    compact: new Intl.NumberFormat(canonical, { notation: "compact", maximumFractionDigits: 1 }).format(value),
    currency: new Intl.NumberFormat(canonical, { style: "currency", currency }).format(value),
    decimalSeparator,
    groupSeparator,
  };
}

/** Makes invisible separators (narrow no-break space, etc.) readable in the UI. */
export function describeSeparator(sep: string, es: boolean): string {
  if (sep === "") return es ? "ninguno" : "none";
  if (sep === ".") return es ? "punto (.)" : "dot (.)";
  if (sep === ",") return es ? "coma (,)" : "comma (,)";
  if (sep === "'" || sep === "’") return es ? `apóstrofo (${sep})` : `apostrophe (${sep})`;
  if (sep === " ") return es ? "espacio duro" : "no-break space";
  if (sep === " ") return es ? "espacio fino" : "narrow no-break space";
  if (sep === " ") return es ? "espacio" : "space";
  return `${sep} (U+${sep.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")})`;
}
