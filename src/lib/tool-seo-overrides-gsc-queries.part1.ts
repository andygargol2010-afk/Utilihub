// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GSC_QUERIES, split from tool-seo-overrides-gsc-queries.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GSC_QUERIES_PART1: Record<string, ToolSeoOverride> = {  "conversor-locale": {
    metaTitle: "Locale Converter Online — Dates, Numbers & Money | UtiliHub",
    metaTitleEs: "Locale converter online — fechas, números, moneda | UtiliHub",
    metaDescription:
      "Locale converter online: see how dates, numbers and currency look in en-US, es-MX, de-DE, ja-JP or any BCP 47 tag. Free and instant. Try a locale now.",
    metaDescriptionEs:
      "Locale converter online: mirá cómo se ven fechas, números y monedas en es-ES, es-MX, en-US, de-DE o cualquier locale BCP 47. Gratis. Probalo ahora.",
    about: [
      "People search for “locale converter online” and “locale online” when they need to see how a date, number or amount looks in another country format before shipping UI or documents.",
      "A BCP 47 locale tag (en-US, es-AR, pt-BR, zh-Hans) controls separators, order of day/month, and where the currency symbol goes.",
      "This tool uses the browser Intl API so the preview matches toLocaleString() and production front-ends.",
    ],
    aboutEs: [
      "Quien busca “locale converter online” o “locale online” quiere ver cómo queda una fecha, un número o un importe en el formato de otro país antes de publicar UI o documentos.",
      "Una etiqueta BCP 47 (es-AR, en-US, pt-BR, zh-Hans) define separadores, orden día/mes y posición del símbolo de moneda.",
      "Usa la API Intl del navegador: el resultado coincide con toLocaleString() y con front-ends en producción.",
    ],
    faq: [
      {
        q: "What is a locale converter online?",
        a: "It formats the same date, number and currency value under different BCP 47 locales so you can compare en-US, es-MX, de-DE and others side by side.",
      },
      {
        q: "Is this locale converter free?",
        a: "Yes. It runs fully in your browser with no signup and no upload.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué es un locale converter online?",
        a: "Formatea la misma fecha, número e importe bajo distintos locales BCP 47 para comparar es-ES, en-US, de-DE, etc.",
      },
      {
        q: "¿Es gratis el locale converter?",
        a: "Sí. Corre en el navegador, sin registro y sin subir datos.",
      },
    ],
  },
};
