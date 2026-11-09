import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_PALINDROME: Record<string, ToolSeoOverride> = {
  "validador-palindromo": {
    metaTitle: "Palindrome Validator — A man a plan a canal Panama | UtiliHub",
    metaTitleEs: "Validador de palíndromos — Anita lava la tina | UtiliHub",
    metaDescription:
      "Check if a phrase is a palindrome, ignoring spaces, punctuation, and case. Empty text is not a palindrome. Runs in the browser.",
    metaDescriptionEs:
      "Comprobá si una frase es un palíndromo, ignorando espacios, puntuación y mayúsculas. Un texto vacío no es un palíndromo. Corre en el navegador.",
    about: [
      "A palindrome reads the same forwards and backwards after removing spaces and punctuation and ignoring case.",
      "Classic example: A man, a plan, a canal: Panama.",
      "Empty or whitespace-only input is not treated as a palindrome.",
    ],
    aboutEs: [
      "Un palíndromo se lee igual de adelante hacia atrás después de quitar espacios y puntuación e ignorar mayúsculas.",
      "Ejemplo clásico: Anita lava la tina.",
      "Un texto vacío o solo espacios no se trata como palíndromo.",
    ],
    steps: [
      "Enter a phrase or use the example.",
      "See if it is a palindrome and the cleaned text.",
      "Copy the result. Reset clears the field.",
    ],
    stepsEs: [
      "Ingresá una frase o usá el ejemplo.",
      "Mira si es un palíndromo y el texto limpio.",
      "Copiá el resultado. Reiniciar vacía el campo.",
    ],
    faq: [
      {
        q: "Is 'A man, a plan, a canal: Panama' a palindrome?",
        a: "Yes. After cleaning it becomes 'amanaplanacanalpanama'.",
      },
      {
        q: "Does it ignore punctuation and spaces?",
        a: "Yes. It keeps only letters and numbers and ignores case.",
      },
      {
        q: "What about empty text?",
        a: "Empty or whitespace-only input is not a palindrome.",
      },
    ],
    faqEs: [
      {
        q: "¿'Anita lava la tina' es un palíndromo?",
        a: "Sí. Después de limpiar queda 'anitalavalatina'.",
      },
      {
        q: "¿Ignora puntuación y espacios?",
        a: "Sí. Conserva solo letras y números e ignora mayúsculas.",
      },
      {
        q: "¿Qué pasa con un texto vacío?",
        a: "Un texto vacío o solo espacios no es un palíndromo.",
      },
    ],
  },
};
