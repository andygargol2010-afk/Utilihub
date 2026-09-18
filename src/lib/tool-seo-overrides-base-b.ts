/** SEO overrides base B. */
import type { ToolSeoOverrideBase } from "./tool-seo-overrides-base-a";

export const TOOL_SEO_OVERRIDES_BASE_B: Record<string, ToolSeoOverrideBase> = {
  "edad-exacta": {
    metaTitle: "Age Calculator — Exact Years, Months, Days | UtiliHub",
    metaTitleEs: "Calculadora de edad exacta online | UtiliHub",
    metaDescription:
      "Calculate exact age from a birth date: years, months, and days. Free age calculator, no signup.",
    metaDescriptionEs:
      "Calculá la edad exacta desde la fecha de nacimiento: años, meses y días. Gratis, sin registro.",
    about: [
      "An age calculator subtracts a birth date from today (or another reference date) and expresses the result in years, months, and days.",
      "Useful for forms, eligibility checks, and personal milestones. Calendar quirks (month lengths, leap years) are handled by standard date arithmetic in the browser.",
      "Legal age definitions can depend on local rules (e.g. turns 18 at the beginning of the day). When in doubt, confirm with the authority that requested the age.",
    ],
    aboutEs: [
      "Una calculadora de edad resta la fecha de nacimiento a hoy (u otra fecha de referencia) y expresa el resultado en años, meses y días.",
      "Sirve para formularios, requisitos de edad y fechas personales. Los meses de distinta duración y los años bisiestos los resuelve la aritmética de fechas del navegador.",
      "La definición legal de edad puede depender de normas locales. Si hay duda, confirmá con quien pidió el dato.",
    ],
    steps: [
      "Enter the date of birth.",
      "Optionally set a reference date (defaults to today).",
      "Read age in years, months, and days.",
    ],
    stepsEs: [
      "Ingresá la fecha de nacimiento.",
      "Opcionalmente elegí una fecha de referencia (por defecto hoy).",
      "Leé la edad en años, meses y días.",
    ],
    faq: [
      {
        q: "Why do results differ by a day?",
        a: "Time zones and whether the current day counts as completed can shift day-level results. For legal deadlines, use the official rule, not only a web calculator.",
      },
      {
        q: "Can I calculate age on a past or future date?",
        a: "Yes—set the reference date to the day you care about (event, exam, contract).",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué a veces difiere un día?",
        a: "Zonas horarias y si el día actual ya cuenta como cumplido pueden mover el resultado. En plazos legales, usá la norma oficial.",
      },
      {
        q: "¿Puedo calcular la edad en otra fecha?",
        a: "Sí: poné la fecha de referencia en el día del evento, examen o contrato.",
      },
    ],
  },

  "base64-encode": {
    metaTitle: "Base64 Encode — Text to Base64 Online | UtiliHub",
    metaTitleEs: "Codificar Base64 online gratis | UtiliHub",
    metaDescription:
      "Encode text to Base64 in your browser for tokens, data URLs, and safe transport. Free Base64 encoder.",
    metaDescriptionEs:
      "Codificá texto a Base64 en el navegador para tokens, data URLs y transporte seguro. Encoder Base64 gratis.",
    about: [
      "Base64 represents binary or text data using a 64-character alphabet so it can travel safely in JSON, URLs, and text protocols.",
      "This encoder converts your input to Base64 locally. Decoding is available as a separate tool when you need the reverse operation.",
      "Base64 is encoding, not encryption: anyone can decode it. Do not treat it as a way to hide secrets.",
    ],
    aboutEs: [
      "Base64 representa datos con un alfabeto de 64 caracteres para enviarlos en JSON, URLs y protocolos de texto.",
      "Este encoder convierte tu entrada a Base64 en local. La operación inversa está en la herramienta de decode.",
      "Base64 es codificación, no cifrado: cualquiera puede decodificarlo. No sirve para ocultar secretos.",
    ],
    steps: [
      "Paste the text to encode.",
      "Copy the Base64 output.",
      "Use it in headers, data URLs, or APIs as needed.",
    ],
    stepsEs: [
      "Pegá el texto a codificar.",
      "Copiá la salida Base64.",
      "Usala en headers, data URLs o APIs.",
    ],
    faq: [
      {
        q: "Why does Base64 output look longer?",
        a: "Encoding expands size by roughly 33% because every 3 bytes become 4 characters.",
      },
      {
        q: "Is Base64 secure?",
        a: "No. It is reversible encoding. Use proper encryption or hashing when you need secrecy or integrity.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué el Base64 es más largo?",
        a: "La codificación aumenta el tamaño ~33%: cada 3 bytes pasan a 4 caracteres.",
      },
      {
        q: "¿Base64 es seguro?",
        a: "No. Es reversible. Para secreto o integridad usá cifrado o hash adecuados.",
      },
    ],
  },

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
