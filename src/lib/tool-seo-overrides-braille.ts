import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_BRAILLE: Record<string, ToolSeoOverride> = {
  "traductor-braille": {
    metaTitle: "Braille Translator — Text to Grade-1 Braille and Back | UtiliHub",
    metaTitleEs: "Traductor de braille grado 1 — texto a braille y viceversa | UtiliHub",
    metaDescription:
      "Convert text to grade-1 Unicode braille and back. hola becomes ⠓⠕⠇⠁, capitals use ⠠, numbers use ⠼, and ñ á é í ó ú ü stay distinct. Free in the browser.",
    metaDescriptionEs:
      "Pasá texto a braille Unicode grado 1 y al revés. hola queda ⠓⠕⠇⠁, las mayúsculas usan ⠠, los números ⠼, y ñ á é í ó ú ü siguen distinguibles. Gratis en el navegador.",
    about: [
      "Translate plain text to grade-1 Unicode braille and braille back to text. Every letter keeps its own cell, so word breaks and accents are preserved.",
      "Spanish characters are distinct cells: ñ is ⠻ and á é í ó ú ü keep their marks instead of collapsing to plain vowels.",
      "Capitals are marked with ⠠ before a letter and digits with ⠼ followed by a–j cells until a space. Unsupported characters stop the run and are named, never skipped.",
    ],
    aboutEs: [
      "Traducí texto plano a braille Unicode grado 1 y braille a texto. Cada letra tiene su celda, así que no se pierden espacios ni acentos.",
      "Los caracteres del español tienen celda propia: ñ es ⠻ y á é í ó ú ü mantienen su tilde en vez de volverse vocales simples.",
      "Las mayúsculas se marcan con ⠠ antes de la letra y los números con ⠼ seguido de las celdas a–j hasta un espacio. Un carácter no soportado detiene la conversión y se nombra; nunca se salta en silencio.",
    ],
    steps: [
      "Type or paste the text to translate, or paste braille cells to read them back as text.",
      "Pick the direction: text to braille or braille to text.",
      "Copy the result. If the tool names an unsupported character, remove or replace it and run it again.",
    ],
    stepsEs: [
      "Escribí o pegá el texto a traducir, o pegá celdas braille para leerlas como texto.",
      "Elegí la dirección: de texto a braille o de braille a texto.",
      "Copiá el resultado. Si nombra un carácter no soportado, sacalo o cambialo y volvé a convertir.",
    ],
    faq: [
      { q: "Does hola become the same cells as a chart?", a: "Yes. hola is ⠓⠕⠇⠁. Spaces stay spaces, so word breaks are not dropped." },
      { q: "How are numbers and capitals marked?", a: "A capital uses the ⠠ indicator before one letter. Digits use the ⠼ indicator, then a–j cells for 1–0, until a space." },
      { q: "What happens with an unsupported character?", a: "The tool stops and names the character. It does not skip emoji, @, or unknown cells." },
    ],
    faqEs: [
      { q: "¿Hola da las mismas celdas que en una tabla braille?", a: "Sí. hola es ⠓⠕⠇⠁. Los espacios se mantienen, así que no se pierden las separaciones entre palabras." },
      { q: "¿Cómo se marcan los números y las mayúsculas?", a: "Una mayúscula usa el indicador ⠠ antes de la letra. Los dígitos usan ⠼ y luego las celdas a–j para 1–0, hasta un espacio." },
      { q: "¿Qué pasa con un carácter no soportado?", a: "La herramienta se detiene y nombra el carácter. No saltea emojis, @ ni celdas desconocidas." },
    ],
  },
};
