import { makeTool } from "./types";

/** Gap: "locale converter online" landed on an unrelated page; this formats dates, numbers and money per BCP 47 tag. */
export const LOCALE_CONVERTER_TOOLS = [
  makeTool(
    "conversor-locale",
    "Locale Converter",
    "desarrollo",
    "converter",
    "Format a date, a number and a currency amount for any locale or BCP 47 tag, side by side, with the browser's Intl API.",
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
        "Formateá una fecha, un número y un importe en cualquier locale o etiqueta BCP 47 con la API Intl del navegador.",
    },
  ),
];
