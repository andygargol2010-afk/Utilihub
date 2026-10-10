import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_ENTROPY: Record<string, ToolSeoOverride> = {
  "analizador-entropia": {
    metaTitle: "Password Entropy Calculator — Pool and Shannon bits | UtiliHub",
    metaTitleEs: "Calculadora de entropía de contraseñas — Bits de pool y Shannon | UtiliHub",
    metaDescription:
      "Estimate password entropy in bits: pool bits (length x log2 of the alphabet) and Shannon bits. Strength bands at 28, 50, and 70 bits. Nothing leaves your browser.",
    metaDescriptionEs:
      "Estimá la entropía de una contraseña en bits: bits de pool (largo x log2 del alfabeto) y bits de Shannon. Bandas de fuerza en 28, 50 y 70 bits. Nada sale de tu navegador.",
    about: [
      "Pool bits are an upper bound: character length times log2 of the detected alphabet (lowercase 26, uppercase 26, digits 10, symbols 33, space 1).",
      "Shannon bits measure the actual character variety of the typed password, so repeated characters lower the score.",
      "Bands: below 28 bits is low, below 50 is fair, below 70 is strong, and 70 or more is very strong.",
      "A dictionary phrase like correcthorsebatterystaple can be weaker than its pool bits suggest.",
    ],
    aboutEs: [
      "Los bits de pool son un límite superior: largo en caracteres por log2 del alfabeto detectado (minúsculas 26, mayúsculas 26, dígitos 10, símbolos 33, espacio 1).",
      "Los bits de Shannon miden la variedad real de caracteres escritos: repetir caracteres baja la puntuación.",
      "Bandas: menos de 28 bits es baja, menos de 50 es media, menos de 70 es alta y 70 o más es muy alta.",
      "Una frase de diccionario como correcthorsebatterystaple puede ser más débil de lo que sugieren sus bits de pool.",
    ],
    steps: [
      "Type the password; it is never uploaded.",
      "Read pool bits, Shannon bits, alphabet size, and the strength band.",
      "Toggle hide/show and copy the summary if you need it.",
    ],
    stepsEs: [
      "Escribí la contraseña; nunca se sube.",
      "Mirá los bits de pool, los bits de Shannon, el alfabeto y la banda de fuerza.",
      "Alterná ocultar/mostrar y copiá el resumen si lo necesitás.",
    ],
    faq: [
      {
        q: "How is password entropy calculated?",
        a: "Pool bits = length x log2(alphabet size). A 12-character password using lowercase, uppercase, and digits has an alphabet of 62, so 12 x log2(62) is about 71.4 bits.",
      },
      {
        q: "What is the difference between pool bits and Shannon bits?",
        a: "Pool bits assume every position is a uniform random pick over the alphabet. Shannon bits also account for repeated characters, so a password with many repeats scores lower.",
      },
      {
        q: "How many bits should a password have?",
        a: "Bands used here: under 28 bits is low, under 50 is fair, under 70 is strong, and 70 or more is very strong.",
      },
      {
        q: "Is my password sent anywhere?",
        a: "No. The estimate runs entirely in your browser and the field is never uploaded.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la entropía de una contraseña?",
        a: "Bits de pool = largo x log2(tamaño del alfabeto). Una contraseña de 12 caracteres con minúsculas, mayúsculas y dígitos tiene alfabeto 62, así que 12 x log2(62) da unos 71,4 bits.",
      },
      {
        q: "¿Qué diferencia hay entre bits de pool y bits de Shannon?",
        a: "Los bits de pool asumen que cada posición es una elección aleatoria uniforme del alfabeto. Los bits de Shannon también consideran los caracteres repetidos: muchas repeticiones puntúan más bajo.",
      },
      {
        q: "¿Cuántos bits debería tener una contraseña?",
        a: "Bandas usadas aquí: menos de 28 bits es baja, menos de 50 es media, menos de 70 es alta y 70 o más es muy alta.",
      },
      {
        q: "¿Se envía mi contraseña a algún servidor?",
        a: "No. La estimación corre por completo en tu navegador y el campo nunca se sube.",
      },
    ],
  },
};
