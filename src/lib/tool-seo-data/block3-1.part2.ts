// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_BLOCK3_1, split from block3-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideBlock3 } from "../tool-seo-overrides-block3";

export const TOOL_SEO_OVERRIDES_BLOCK3_1_PART2: Record<string, ToolSeoOverrideBlock3> = {
  "json-validator": {
    metaTitle: "JSON Validator — Check Syntax Online | UtiliHub",
    metaTitleEs: "Validador JSON online gratis | UtiliHub",
    metaDescription:
      "Validate JSON syntax in your browser. Catch trailing commas, bad quotes, and parse errors before production.",
    metaDescriptionEs:
      "Validá la sintaxis JSON en el navegador. Detectá comas finales, comillas incorrectas y errores de parseo antes de producción.",
    about: [
      "A JSON validator parses your document with strict rules: double-quoted keys and strings, no trailing commas, and valid structure.",
      "Use it when an API rejects a body, a config file fails to load, or a minified blob looks suspicious. Feedback should point to where parsing stopped.",
      "Validation runs locally—paste only data you are comfortable handling on your device.",
    ],
    aboutEs: [
      "Un validador JSON parsea el documento con reglas estrictas: claves y strings con comillas dobles, sin comas finales y estructura válida.",
      "Úsalo cuando una API rechaza el body, un config falla al cargar o un blob minificado se ve raro. El feedback debería indicar dónde cortó el parseo.",
      "La validación es local: pegá solo datos que te sientas cómodo manejando en tu dispositivo.",
    ],
    steps: [
      "Paste the JSON to check.",
      "Run validation.",
      "Fix reported syntax issues and re-check.",
    ],
    stepsEs: [
      "Pegá el JSON a revisar.",
      "Ejecutá la validación.",
      "Corregí los errores de sintaxis y volvé a validar.",
    ],
    faq: [
      {
        q: "Why are trailing commas invalid?",
        a: "Standard JSON does not allow a comma after the last item in an object or array. Some languages allow it; JSON parsers usually do not.",
      },
      {
        q: "Single quotes?",
        a: "JSON requires double quotes for strings and keys. Single quotes will fail validation.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué fallan las comas finales?",
        a: "El JSON estándar no permite coma después del último ítem. Algunos lenguajes sí; los parsers JSON suelen no.",
      },
      {
        q: "¿Comillas simples?",
        a: "JSON exige comillas dobles en strings y claves. Las simples invalidan el documento.",
      },
    ],
  },
};
