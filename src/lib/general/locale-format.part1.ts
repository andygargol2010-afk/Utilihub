// Part 1 of 3 — split from locale-format.ts on 2026-11-04. Edit here; locale-format.ts re-exports.

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
