import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_CASE_CONVERTER: Record<string, ToolSeoOverride> = {
  "convertidor-casos-texto": {
    metaTitle: "Text Case Converter — UPPER, lower, Title, camel, snake | UtiliHub",
    metaTitleEs: "Convertidor de casos de texto — MAYÚSCULAS, título, camel, snake | UtiliHub",
    metaDescription:
      "Convert any text between uppercase, lowercase, title case, sentence case, camelCase, snake_case and kebab-case. Instant, private, and free in the browser.",
    metaDescriptionEs:
      "Convertí cualquier texto entre mayúsculas, minúsculas, Title Case, oración, camelCase, snake_case y kebab-case. Instantáneo, privado y gratis en el navegador.",
    about: [
      "One tool handles seven common text cases used in writing, code, filenames and headings.",
      "Title Case capitalizes the first letter of each word. Sentence case capitalizes after periods.",
      "camelCase, snake_case and kebab-case are useful for variable names, database columns and URLs.",
      "All processing happens locally; your text never leaves the browser.",
    ],
    aboutEs: [
      "Una sola herramienta cubre siete casos de texto habituales en escritura, código, nombres de archivo y títulos.",
      "Title Case pone en mayúscula la primera letra de cada palabra. El caso oración mayuscula después de puntos.",
      "camelCase, snake_case y kebab-case sirven para nombres de variables, columnas y URLs.",
      "Todo el procesamiento es local; tu texto nunca sale del navegador.",
    ],
    steps: [
      "Paste or type the text you want to transform.",
      "Choose the target case from the buttons.",
      "Copy the result or reset to start over.",
    ],
    stepsEs: [
      "Pegá o escribí el texto que querés transformar.",
      "Elegí el caso de destino entre los botones.",
      "Copiá el resultado o limpiá para empezar de nuevo.",
    ],
    faq: [
      {
        q: "What is the difference between Title Case and Sentence case?",
        a: "Title Case capitalizes the first letter of every word. Sentence case capitalizes only the first letter of each sentence.",
      },
      {
        q: "Does camelCase remove spaces and punctuation?",
        a: "Yes. It lowercases everything then capitalizes after non-alphanumeric characters and removes them.",
      },
      {
        q: "Is the conversion case-sensitive for existing camelCase input?",
        a: "The tools normalize first (to lower or by the rules of each mode) so mixed input produces consistent output.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué diferencia hay entre Title Case y caso oración?",
        a: "Title Case pone en mayúscula la primera letra de cada palabra. El caso oración solo mayuscula la primera letra de cada oración.",
      },
      {
        q: "¿camelCase elimina espacios y puntuación?",
        a: "Sí. Pasa todo a minúsculas, mayuscula después de caracteres no alfanuméricos y los elimina.",
      },
      {
        q: "¿El resultado es consistente si el texto ya tiene mezcla de mayúsculas?",
        a: "Sí. Cada modo normaliza primero, así que la salida es predecible.",
      },
    ],
  },
};
