import { makeTool } from "./types";

/** Gap: "locale converter online" landed on an unrelated page; this formats dates, numbers and money per BCP 47 tag. */
export const LOCALE_CONVERTER_TOOLS = [
  makeTool(
    "conversor-locale",
    "Locale Converter",
    "desarrollo",
    "converter",
    "Locale converter online: see a date, a number and a currency amount formatted for any locale or BCP 47 tag (en-US, es-MX, de-DE…), side by side.",
    [
      "locale converter online",
      "locale converter",
      "bcp 47 locale formatter",
      "intl number format by locale",
      "date format by country",
      "conversor de locale",
      "formato de fecha por país",
      "formato de números por idioma",
    ],
    {
      title: "Locale Converter Online — Dates, Numbers & Currency by BCP 47 | UtiliHub",
      description:
        "Free locale converter: see how a date, number and currency amount look in en-US, de-DE, es-MX, ja-JP or any BCP 47 tag. Uses Intl, runs in your browser.",
      summaryEs:
        "Locale converter online: mirá una fecha, un número y un importe con el formato de cualquier locale o etiqueta BCP 47 (es-MX, en-US, de-DE…), lado a lado.",
    },
  ),
];
