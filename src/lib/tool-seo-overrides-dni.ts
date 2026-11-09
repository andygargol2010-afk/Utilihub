import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_DNI: Record<string, ToolSeoOverride> = {
  "letra-dni-nie": {
    metaTitle: "Spanish DNI and NIE Letter Calculator | UtiliHub",
    metaTitleEs: "Calcular letra del DNI y NIE | UtiliHub",
    metaDescription:
      "Calculate the Spanish DNI or NIE control letter. 12345678 is Z. X1234567 is L. Check a letter you already have. Free in the browser.",
    metaDescriptionEs:
      "Calculá la letra del DNI o NIE. 12345678 es Z. X1234567 es L. Comprobá una letra que ya tengas. Gratis en el navegador.",
    about: [
      "The control letter is the official 23-letter table at the remainder of the number divided by 23: TRWAGMYFPDXBNJZSQVHLCKE.",
      "A NIE replaces the first letter before the division: X is 0, Y is 1, Z is 2, then the seven digits.",
      "Eight-digit DNI values keep leading zeros. A missing letter is filled in. A wrong letter is flagged with the expected one. Empty input stays blank.",
    ],
    aboutEs: [
      "La letra sale de la tabla oficial de 23 caracteres según el resto de dividir por 23: TRWAGMYFPDXBNJZSQVHLCKE.",
      "En el NIE la letra inicial se cambia antes de dividir: X es 0, Y es 1, Z es 2, y después van los siete dígitos.",
      "El DNI de ocho cifras conserva los ceros a la izquierda. Si falta la letra, se completa. Si no coincide, se marca la esperada. Vacío no calcula.",
    ],
    steps: [
      "Type a DNI such as 12345678 or a NIE such as X1234567.",
      "Add the letter only if you want to check it.",
      "Copy the full number with the control letter.",
    ],
    stepsEs: [
      "Escribí un DNI como 12345678 o un NIE como X1234567.",
      "Agregá la letra solo si querés comprobarla.",
      "Copiá el número completo con la letra de control.",
    ],
    faq: [
      { q: "What letter does 12345678 get?", a: "Z. 12345678 divided by 23 leaves remainder 14, and index 14 in the table is Z." },
      { q: "How is a NIE letter calculated?", a: "X, Y, and Z become 0, 1, and 2. X1234567 is treated as 01234567, which gives L." },
      { q: "Does this store the number?", a: "No. The check runs in the browser and nothing is uploaded." },
    ],
    faqEs: [
      { q: "¿Qué letra le toca a 12345678?", a: "Z. 12345678 dividido por 23 deja resto 14, y el índice 14 de la tabla es Z." },
      { q: "¿Cómo se calcula la letra del NIE?", a: "X, Y y Z pasan a 0, 1 y 2. X1234567 se lee como 01234567 y da L." },
      { q: "¿Se guarda el número?", a: "No. La cuenta corre en el navegador y no se sube nada." },
    ],
  },
};
