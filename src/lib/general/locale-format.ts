/**
 * Locale converter: format one date, number and amount for any BCP 47 tag with Intl.
 * Pure helpers so the UI and tests share the same validation.
 */

export type LocaleFormatInput = {
  locale: string;
  date: string;
  number: string;
  currency: string;
};

export type LocaleFormatResult = {
  canonical: string;
  displayName: string;
  dateFull: string;
  dateShort: string;
  dateTime: string;
  number: string;
  percent: string;
  compact: string;
  currency: string;
  decimalSeparator: string;
  groupSeparator: string;
};

export type LocaleFormatIssue = { field: keyof LocaleFormatInput; message: string };

export const LOCALE_PRESETS: { tag: string; en: string; es: string }[] = [
  { tag: "en-US", en: "English (US)", es: "Inglés (EE. UU.)" },
  { tag: "en-GB", en: "English (UK)", es: "Inglés (Reino Unido)" },
  { tag: "es-ES", en: "Spanish (Spain)", es: "Español (España)" },
  { tag: "es-MX", en: "Spanish (Mexico)", es: "Español (México)" },
  { tag: "es-AR", en: "Spanish (Argentina)", es: "Español (Argentina)" },
  { tag: "pt-BR", en: "Portuguese (Brazil)", es: "Portugués (Brasil)" },
  { tag: "fr-FR", en: "French (France)", es: "Francés (Francia)" },
  { tag: "de-DE", en: "German (Germany)", es: "Alemán (Alemania)" },
  { tag: "de-CH", en: "German (Switzerland)", es: "Alemán (Suiza)" },
  { tag: "hi-IN", en: "Hindi (India)", es: "Hindi (India)" },
  { tag: "ja-JP", en: "Japanese (Japan)", es: "Japonés (Japón)" },
  { tag: "ar-EG", en: "Arabic (Egypt)", es: "Árabe (Egipto)" },
];

export function defaultLocaleInput(): LocaleFormatInput {
  return { locale: "de-DE", date: "2026-03-14T15:09", number: "1234567.891", currency: "EUR" };
}

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

function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s+/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function parseDate(raw: string): Date | null {
  if (!raw.trim()) return null;
  const value = new Date(raw);
  return Number.isNaN(value.getTime()) ? null : value;
}

function validCurrency(code: string): boolean {
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
