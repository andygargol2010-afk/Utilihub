import type { ToolSeoOverride } from "./tool-seo-overrides";

/** SEO override for the syllable counter (texto) — bilingual, non-generic, with FAQ schema. */
export const TOOL_SEO_OVERRIDES_SYLLABLES: Record<string, ToolSeoOverride> = {
  "contador-silabas": {
    metaTitle: "Syllable Counter — Count Syllables in Any Text | UtiliHub",
    metaTitleEs: "Contador de sílabas — cuenta las sílabas de un texto | UtiliHub",
    metaDescription:
      "Free online syllable counter. Paste any text to estimate its total syllable count for poetry, lyrics, haiku, or readability. Runs in your browser, no signup.",
    metaDescriptionEs:
      "Contador de sílabas gratis. Pegá un texto y estimá cuántas sílabas tiene, útil para poesía, haiku, letras o legibilidad. Funciona en el navegador, sin registro.",
    about: [
      "A syllable counter estimates how many syllables a text contains by grouping vowels and vowel sequences.",
      "It is useful for poetry, haiku, song lyrics, and readability metrics that need a per-word or total syllable count.",
      "The count is approximate: the heuristic works best for English and Spanish and does not use a pronunciation dictionary.",
    ],
    aboutEs: [
      "Un contador de sílabas estima cuántas sílabas contiene un texto agrupando vocales y secuencias de vocales.",
      "Es útil para poesía, haiku, letras de canciones y métricas de legibilidad que necesitan el conteo de sílabas.",
      "El conteo es aproximado: la heurística funciona mejor en inglés y español y no usa un diccionario de pronunciación.",
    ],
    steps: [
      "Paste or type your text into the input area.",
      "The estimated syllable count updates automatically as you type.",
      "Use the result for verse structure, haiku syllable limits, or readability checks.",
    ],
    stepsEs: [
      "Pegá o escribí tu texto en el área de entrada.",
      "El conteo estimado de sílabas se actualiza automáticamente mientras escribís.",
      "Usá el resultado para la estructura de versos, los límites del haiku o revisar legibilidad.",
    ],
    faq: [
      {
        q: "How does the syllable counter work?",
        a: "It groups adjacent vowels into syllable nuclei and counts one syllable per group. It is a heuristic, so results are approximate.",
      },
      {
        q: "Which languages does it support?",
        a: "It works best for English and Spanish. Other languages with different syllable rules may give less accurate counts.",
      },
      {
        q: "Is it accurate for haiku (5-7-5)?",
        a: "It gives a close estimate, but for strict haiku or contest rules always review the count manually, since silent endings like -e or -ed can shift it.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo funciona el contador de sílabas?",
        a: "Agrupa las vocales contiguas en núcleos silábicos y cuenta una sílaba por grupo. Es una heurística, así que el resultado es aproximado.",
      },
      {
        q: "¿Qué idiomas admite?",
        a: "Funciona mejor en inglés y español. Otros idiomas con reglas silábicas distintas pueden dar conteos menos precisos.",
      },
      {
        q: "¿Sirve para haiku (5-7-5)?",
        a: "Da una estimación cercana, pero para haiku estricto o concursos revisá el conteo a mano, ya que terminaciones mudas como -e o -ed pueden alterarlo.",
      },
    ],
  },
};
