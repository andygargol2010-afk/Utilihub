/** SEO overrides base A2 (temperature, length, word count). */
import type { ToolSeoOverrideBase } from "./tool-seo-overrides-base-a";
import { TOOL_SEO_OVERRIDES_BASE_A2_PART1 } from "./tool-seo-overrides-base-a2.part1";
import { TOOL_SEO_OVERRIDES_BASE_A2_PART2 } from "./tool-seo-overrides-base-a2.part2";


export const TOOL_SEO_OVERRIDES_BASE_A2: Record<string, ToolSeoOverrideBase> = {
  ...TOOL_SEO_OVERRIDES_BASE_A2_PART1,
  ...TOOL_SEO_OVERRIDES_BASE_A2_PART2,

  "contador-de-palabras": {
    metaTitle: "Word Counter — Characters, Words, Reading Time | UtiliHub",
    metaTitleEs: "Contador de palabras y caracteres online | UtiliHub",
    metaDescription:
      "Free word counter: words, characters, sentences, and estimated reading time as you type. Private, in-browser.",
    metaDescriptionEs:
      "Contador de palabras gratis: palabras, caracteres, oraciones y tiempo de lectura mientras escribís. Privado, en el navegador.",
    about: [
      "Writers, students, and marketers track word and character limits for essays, posts, and ads. A word counter updates as you type so you stay inside the limit.",
      "This tool counts words, characters (with and without spaces when available), and can estimate reading time from a typical words-per-minute assumption.",
      "Counts can differ slightly between tools depending on how hyphenated words or emojis are treated—use the same counter your publisher recommends when the limit is strict.",
    ],
    aboutEs: [
      "Escritores, estudiantes y marketers cuidan límites de palabras y caracteres en ensayos, posts y anuncios. Un contador se actualiza al escribir para no pasarte.",
      "Esta herramienta cuenta palabras, caracteres (con y sin espacios cuando aplica) y puede estimar tiempo de lectura con un ritmo típico de palabras por minuto.",
      "Los conteos pueden variar un poco entre herramientas según guiones o emojis: si el límite es estricto, usá el contador que pida tu editorial o plataforma.",
    ],
    steps: [
      "Paste or type your text.",
      "Read live word and character counts.",
      "Trim or expand the text to hit your limit.",
    ],
    stepsEs: [
      "Pegá o escribí tu texto.",
      "Mirá el conteo de palabras y caracteres en vivo.",
      "Recortá o ampliá hasta llegar al límite.",
    ],
    faq: [
      {
        q: "Does it count spaces?",
        a: "Character counts usually offer both with and without spaces. Word counts split on whitespace.",
      },
      {
        q: "Is text uploaded?",
        a: "No. Counting runs locally in your browser.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuenta los espacios?",
        a: "El conteo de caracteres suele mostrar con y sin espacios. Las palabras se separan por espacios en blanco.",
      },
      {
        q: "¿Se sube el texto?",
        a: "No. El conteo es local en tu navegador.",
      },
    ],
  },
};
