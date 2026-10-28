// TOOL_SEO_OVERRIDES_BLOCK3 part 1 — split out of ../tool-seo-overrides-block3.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideBlock3 } from "../tool-seo-overrides-block3";

export const TOOL_SEO_OVERRIDES_BLOCK3_1: Record<string, ToolSeoOverrideBlock3> = {
  "base64-decode": {
    metaTitle: "Base64 Decode — Decode to Text Online | UtiliHub",
    metaTitleEs: "Decodificar Base64 a texto online | UtiliHub",
    metaDescription:
      "Decode Base64 to plain text in your browser. Free Base64 decoder for tokens, payloads, and data URLs. No upload.",
    metaDescriptionEs:
      "Decodificá Base64 a texto plano en el navegador. Decoder gratis para tokens, payloads y data URLs. Sin subir archivos.",
    about: [
      "Base64 decoding reverses the encoding step: a 64-character alphabet is mapped back to the original bytes or text. Developers use it for tokens, email attachments, and data URLs.",
      "This tool decodes locally in your browser. If the input is not valid Base64, you should see an error instead of corrupted output.",
      "Decoding is not decryption. Anyone with the string can recover the original data—do not rely on Base64 to hide secrets.",
    ],
    aboutEs: [
      "Decodificar Base64 invierte la codificación: el alfabeto de 64 caracteres vuelve a bytes o texto. Se usa en tokens, adjuntos y data URLs.",
      "Esta herramienta decodifica en local. Si la entrada no es Base64 válido, debería mostrar error y no un resultado corrupto.",
      "Decodificar no es descifrar. Cualquiera con la cadena puede recuperar los datos: no uses Base64 para ocultar secretos.",
    ],
    steps: [
      "Paste the Base64 string.",
      "Decode to readable text.",
      "Copy the result into your editor or API client.",
    ],
    stepsEs: [
      "Pegá la cadena Base64.",
      "Decodificá a texto legible.",
      "Copiá el resultado a tu editor o cliente de API.",
    ],
    faq: [
      {
        q: "Why do I get an error?",
        a: "Common causes: missing padding (=), line breaks, or characters outside the Base64 alphabet. Clean the string and try again.",
      },
      {
        q: "Can it decode images?",
        a: "If the payload is binary, you may see garbled text. For images, use a data-URL or a dedicated image decoder.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué da error?",
        a: "Suele faltar el padding (=), haber saltos de línea o caracteres fuera del alfabeto. Limpiá la cadena e intentá de nuevo.",
      },
      {
        q: "¿Sirve para imágenes?",
        a: "Si el payload es binario, el texto puede verse raro. Para imágenes usá data-URL o un decoder específico.",
      },
    ],
  },

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

  "json-a-csv": {
    metaTitle: "JSON to CSV Converter — Free Online | UtiliHub",
    metaTitleEs: "Convertir JSON a CSV online | UtiliHub",
    metaDescription:
      "Convert a JSON array of objects to CSV in your browser. Export tabular data without uploading files.",
    metaDescriptionEs:
      "Convertí un array JSON de objetos a CSV en el navegador. Exportá datos tabulares sin subir archivos.",
    about: [
      "JSON arrays of flat objects map cleanly to CSV rows: object keys become column headers and each object becomes a row.",
      "Nested objects or arrays need flattening or special handling—this tool targets simple, table-shaped JSON common in exports and APIs.",
      "Conversion is local so sensitive spreadsheets never leave your device during the transform step.",
    ],
    aboutEs: [
      "Los arrays JSON de objetos planos mapean bien a filas CSV: las claves son columnas y cada objeto una fila.",
      "Objetos anidados o arrays requieren aplanarlos; esta herramienta apunta a JSON tabular simple de exports y APIs.",
      "La conversión es local: planillas sensibles no salen de tu dispositivo en este paso.",
    ],
    steps: [
      "Paste a JSON array of objects.",
      "Convert to CSV.",
      "Copy or download the CSV for Excel or Sheets.",
    ],
    stepsEs: [
      "Pegá un array JSON de objetos.",
      "Convertí a CSV.",
      "Copiá o descargá el CSV para Excel o Sheets.",
    ],
    faq: [
      {
        q: "What shape of JSON works best?",
        a: "An array of objects with the same keys, e.g. [{\"name\":\"Ada\",\"age\":36}, …]. Deep nesting may need preprocessing.",
      },
      {
        q: "Are commas escaped?",
        a: "CSV fields that contain commas should be quoted. Check the output if your data has special characters.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué forma de JSON funciona mejor?",
        a: "Un array de objetos con las mismas claves, p. ej. [{\"name\":\"Ada\",\"age\":36}, …]. El anidado profundo puede requerir preprocess.",
      },
      {
        q: "¿Se escapan las comas?",
        a: "Los campos con comas deberían ir entre comillas. Revisá la salida si hay caracteres especiales.",
      },
    ],
  },

};
