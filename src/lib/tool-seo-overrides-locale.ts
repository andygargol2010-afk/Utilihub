import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_LOCALE: Record<string, ToolSeoOverride> = {
  "conversor-locale": {
    metaTitle: "Locale Converter Online — Dates, Numbers & Currency by BCP 47 | UtiliHub",
    metaTitleEs: "Conversor de locale online — fechas, números y monedas por país | UtiliHub",
    metaDescription:
      "Free locale converter: see how a date, number and currency amount look in en-US, de-DE, es-MX, ja-JP or any BCP 47 tag. Uses Intl, runs in your browser.",
    metaDescriptionEs:
      "Conversor de locale gratis: mirá cómo se escribe una fecha, un número y un importe en es-ES, es-MX, en-US, de-DE o cualquier etiqueta BCP 47. Usa Intl, sin registro.",
    about: [
      "A locale (BCP 47 tag such as en-US, es-AR or zh-Hant-TW) decides how dates, numbers and money are written: 3/14/26 in en-US, 14/3/26 in es-ES, 14.03.26 in de-DE.",
      "The same number 1234567.891 becomes 1,234,567.891 in en-US, 1.234.567,891 in de-DE and 1’234’567.891 in de-CH. Currency symbols move too: €1,234,567.89 vs 1.234.567,89 €.",
      "This converter uses the browser's built-in Intl API (DateTimeFormat and NumberFormat), the same engine your JavaScript code uses, so the output matches what toLocaleString() would print.",
    ],
    aboutEs: [
      "Un locale (etiqueta BCP 47 como es-AR, en-US o zh-Hant-TW) define cómo se escriben fechas, números y montos: 14/3/26 en es-ES, 3/14/26 en en-US, 14.03.26 en de-DE.",
      "El mismo número 1234567.891 queda 1,234,567.891 en en-US, 1.234.567,891 en de-DE y 1’234’567.891 en de-CH. El símbolo de moneda también cambia de lugar: €1,234,567.89 frente a 1.234.567,89 €.",
      "El conversor usa la API Intl del navegador (DateTimeFormat y NumberFormat), la misma que usa tu código JavaScript, así que el resultado coincide con lo que imprime toLocaleString().",
    ],
    steps: [
      "Type a BCP 47 tag (en-US, es-MX, pt-BR, ja-JP…) or tap one of the preset locales.",
      "Pick a date and time, a number with a dot as decimal, and a three-letter currency code.",
      "Read the full, short and date-time formats, the number, percent, compact and currency output, plus the decimal and thousands separators.",
      "Copy everything in one click. Nothing is uploaded.",
    ],
    stepsEs: [
      "Escribí una etiqueta BCP 47 (es-MX, en-US, pt-BR, ja-JP…) o tocá uno de los locales sugeridos.",
      "Elegí fecha y hora, un número con punto decimal y un código de moneda de tres letras.",
      "Leé la fecha completa, corta y con hora, el número, el porcentaje, el formato compacto y la moneda, más los separadores decimal y de miles.",
      "Copiá todo con un clic. No se sube nada.",
    ],
    faq: [
      {
        q: "What is a locale code like en-US or es-MX?",
        a: "It is a BCP 47 language tag: a language (en, es) plus an optional script (Hant) and region (US, MX). Tags are case-insensitive and es_MX is accepted as es-MX.",
      },
      {
        q: "How do I format a number for a locale in JavaScript?",
        a: "Use new Intl.NumberFormat('de-DE').format(1234567.891) → 1.234.567,891, or add { style: 'currency', currency: 'EUR' } for money. This tool shows the same output.",
      },
      {
        q: "Why do some locales use a space or apostrophe as thousands separator?",
        a: "Each region has its own convention: fr-FR uses a narrow no-break space (1 234 567,89), de-CH an apostrophe (1’234’567.89) and hi-IN groups lakhs and crores (12,34,567.89).",
      },
      {
        q: "Does the currency code change the exchange rate?",
        a: "No. It only changes the symbol and formatting. To convert money between currencies use a currency converter.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué es un código de locale como es-MX o en-US?",
        a: "Es una etiqueta de idioma BCP 47: idioma (es, en) más un script opcional (Hant) y una región (MX, US). No distingue mayúsculas y es_MX se acepta como es-MX.",
      },
      {
        q: "¿Cómo formatear un número según el país en JavaScript?",
        a: "Con new Intl.NumberFormat('es-ES').format(1234567.891) → 1.234.567,891, o agregando { style: 'currency', currency: 'EUR' } para importes. Esta herramienta muestra el mismo resultado.",
      },
      {
        q: "¿Por qué algunos países usan espacio o apóstrofo como separador de miles?",
        a: "Cada región tiene su convención: fr-FR usa un espacio fino (1 234 567,89), de-CH un apóstrofo (1’234’567.89) y hi-IN agrupa en lakhs y crores (12,34,567.89).",
      },
      {
        q: "¿El código de moneda convierte el tipo de cambio?",
        a: "No. Solo cambia el símbolo y el formato. Para pasar de una moneda a otra usá un conversor de divisas.",
      },
    ],
  },
};
