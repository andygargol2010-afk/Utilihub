/** SEO overrides base B. */
import type { ToolSeoOverrideBase } from "./tool-seo-overrides-base-a";
import { TOOL_SEO_OVERRIDES_BASE_B_PART1 } from "./tool-seo-overrides-base-b.part1";
import { TOOL_SEO_OVERRIDES_BASE_B_PART2 } from "./tool-seo-overrides-base-b.part2";


export const TOOL_SEO_OVERRIDES_BASE_B: Record<string, ToolSeoOverrideBase> = {
  ...TOOL_SEO_OVERRIDES_BASE_B_PART1,
  ...TOOL_SEO_OVERRIDES_BASE_B_PART2,

  "json-formatter": {
    metaTitle: "JSON Formatter — Pretty Print & Validate | UtiliHub",
    metaTitleEs: "Formateador JSON online gratis | UtiliHub",
    metaDescription:
      "Pretty-print and inspect JSON in your browser. Format messy JSON for debugging. Free, no upload.",
    metaDescriptionEs:
      "Formateá e inspeccioná JSON en el navegador. Ordená JSON desordenado para depurar. Gratis, sin subir archivos.",
    about: [
      "Messy minified JSON is hard to read. A formatter parses the structure and reprints it with indentation so objects and arrays are visible.",
      "Use this when debugging API responses, config files, or logs. Invalid JSON should surface a parse error instead of silent corruption.",
      "Processing is local: paste only data you are comfortable handling on your device.",
    ],
    aboutEs: [
      "El JSON minificado es difícil de leer. Un formateador parsea la estructura y la reimprime con sangría para ver objetos y arrays.",
      "Úsalo al depurar respuestas de API, configs o logs. Un JSON inválido debería mostrar error de parseo, no corromperse en silencio.",
      "Todo es local: pegá solo datos que te sientas cómodo manejando en tu dispositivo.",
    ],
    steps: [
      "Paste raw JSON.",
      "Format / pretty-print the document.",
      "Fix errors if the parser reports invalid syntax.",
      "Copy the cleaned JSON back to your editor or API client.",
    ],
    stepsEs: [
      "Pegá el JSON crudo.",
      "Formatealo / pretty-print.",
      "Corregí errores si el parser reporta sintaxis inválida.",
      "Copiá el JSON limpio a tu editor o cliente de API.",
    ],
    faq: [
      {
        q: "Why is my JSON invalid?",
        a: "Common issues: trailing commas, single quotes instead of double quotes, or unquoted keys. Strict JSON requires double-quoted strings and keys.",
      },
      {
        q: "Does formatting change the data?",
        a: "Pretty-print should preserve values and only change whitespace. Minify does the reverse.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué mi JSON es inválido?",
        a: "Suele fallar por comas finales, comillas simples en lugar de dobles, o claves sin comillas. El JSON estricto usa comillas dobles en strings y claves.",
      },
      {
        q: "¿El formato cambia los datos?",
        a: "El pretty-print debería conservar valores y solo tocar espacios. Minify hace lo inverso.",
      },
    ],
  },
};
