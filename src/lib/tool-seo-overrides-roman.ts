import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_ROMAN: Record<string, ToolSeoOverride> = {
  "conversor-numeros-romanos": {
    metaTitle: "Roman Numeral Converter — Number to Roman 1–3999 | UtiliHub",
    metaTitleEs: "Conversor de números romanos — 1 a 3999 | UtiliHub",
    metaDescription:
      "Convert 1 to 3999 into standard Roman numerals and decode subtractive forms such as XIV and MCMXCIV. IIII and IC are rejected. Runs locally.",
    metaDescriptionEs:
      "Convertí del 1 al 3999 a romanos estándar y decodificá formas sustractivas como XIV y MCMXCIV. IIII e IC se rechazan. Corre en el navegador.",
    about: [
      "Standard Roman numerals use subtractive pairs: IV, IX, XL, XC, CD, and CM. This is not a clock face that writes IIII.",
      "The converter covers 1 through 3999. Zero, negatives, and 4000 are out of range because they need a different notation.",
      "A Roman string is accepted only if it matches the canonical form of its value, so IIII, IC, and VX fail instead of being guessed.",
    ],
    aboutEs: [
      "Los romanos estándar usan pares sustractivos: IV, IX, XL, XC, CD y CM. No es la esfera de reloj que escribe IIII.",
      "Cubre del 1 al 3999. El cero, los negativos y el 4000 quedan fuera porque piden otra notación.",
      "Una cadena romana se acepta solo si coincide con la forma canónica de su valor. IIII, IC y VX fallan, no se inventan.",
    ],
    steps: [
      "Type 1994 or MCMXCIV. Both are built-in examples.",
      "Switch direction to decode a Roman numeral or to encode an integer.",
      "Copy the result. Empty input and IIII do not invent a value.",
    ],
    stepsEs: [
      "Escribí 1994 o MCMXCIV. Los dos son ejemplos.",
      "Cambiá la dirección para decodificar un romano o para codificar un entero.",
      "Copiá el resultado. Una entrada vacía o IIII no inventa un valor.",
    ],
    faq: [
      { q: "Why is IIII rejected?", a: "Standard subtractive notation writes 4 as IV. Clock faces sometimes use IIII; this converter does not." },
      { q: "What is 1994 in Roman numerals?", a: "MCMXCIV: 1000 + 900 + 90 + 4." },
      { q: "Can I convert 4000?", a: "No. The range stops at 3999 (MMMCMXCIX). Overlines are not used." },
    ],
    faqEs: [
      { q: "¿Por qué se rechaza IIII?", a: "La notación sustractiva estándar escribe 4 como IV. Algunos relojes usan IIII; este conversor no." },
      { q: "¿Cuánto es 1994 en romanos?", a: "MCMXCIV: 1000 + 900 + 90 + 4." },
      { q: "¿Puedo convertir 4000?", a: "No. El rango llega a 3999 (MMMCMXCIX). No se usan rayas superiores." },
    ],
  },
};
