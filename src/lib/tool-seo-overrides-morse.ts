import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_MORSE: Record<string, ToolSeoOverride> = {
  "traductor-morse": {
    metaTitle: "Morse Code Translator — Text ↔ ITU Morse | UtiliHub",
    metaTitleEs: "Traductor de código Morse — texto ↔ ITU | UtiliHub",
    metaDescription:
      "Translate text to ITU Morse and decode Morse back to letters. Word gaps use a slash. Unknown letters are rejected. Runs locally.",
    metaDescriptionEs:
      "Traducí texto a Morse ITU y decodificá Morse a letras. El espacio entre palabras es una barra. Las letras desconocidas se rechazan. Corre en el navegador.",
    about: [
      "International Morse (ITU) maps A–Z, 0–9, and common punctuation to dots and dashes. This is not Braille and not a radio trainer.",
      "Letters inside a word are separated by a space. Words are separated by a slash, so HELLO WORLD becomes .... . .-.. .-.. --- / .-- --- .-. .-.. -..",
      "Accented vowels fold to A E I O U. Ñ and other unsupported characters are rejected instead of being guessed.",
    ],
    aboutEs: [
      "El Morse internacional (ITU) mapea A–Z, 0–9 y puntuación habitual a puntos y rayas. No es braille ni un entrenador de radio.",
      "Las letras de una palabra se separan con espacio. Las palabras se separan con una barra: HELLO WORLD queda .... . .-.. .-.. --- / .-- --- .-. .-.. -..",
      "Las vocales acentuadas pasan a A E I O U. La Ñ y otros caracteres no soportados se rechazan, no se inventan.",
    ],
    steps: [
      "Type text or Morse. SOS and HELLO WORLD are built-in examples.",
      "Switch direction to decode a slash-separated Morse string.",
      "Copy the result. Empty input does not invent a code.",
    ],
    stepsEs: [
      "Escribí texto o Morse. SOS y HELLO WORLD son ejemplos.",
      "Cambiá la dirección para decodificar una cadena con barras entre palabras.",
      "Copiá el resultado. Una entrada vacía no inventa código.",
    ],
    faq: [
      { q: "Is this the same as Braille?", a: "No. Braille is a cell grid. Morse is dots and dashes with letter spaces and a slash between words." },
      { q: "Why is Ñ rejected?", a: "ITU Morse has no Ñ. The translator reports it instead of folding it to N." },
      { q: "How do I separate words?", a: "Use a slash, with spaces around it if you like: ... --- ... / .-" },
    ],
    faqEs: [
      { q: "¿Es lo mismo que el braille?", a: "No. El braille usa celdas. El Morse usa puntos y rayas, espacios entre letras y una barra entre palabras." },
      { q: "¿Por qué se rechaza la Ñ?", a: "El Morse ITU no tiene Ñ. El traductor lo avisa en vez de convertirla a N." },
      { q: "¿Cómo separo palabras?", a: "Con una barra, con o sin espacios: ... --- ... / .-" },
    ],
  },
};
