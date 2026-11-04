// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GAP_2, split from gap-2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GAP_2_PART1: Record<string, ToolSeoOverride> = {  "validador-palindromo": {
    metaTitle: "Palindrome Checker — Words & Phrases | UtiliHub",
    metaTitleEs: "Verificador de palíndromos — Palabras y frases | UtiliHub",
    metaDescription: "Check if a word or phrase reads the same forwards and backwards. Free, local, no signup.",
    metaDescriptionEs: "Comprobá si una palabra o frase se lee igual al derecho y al revés. Gratis, local, sin registro.",
    about: [
      "Paste a word or full phrase. Letters are normalized so spaces and accents do not break the check.",
    ],
    aboutEs: [
      "Pegá una palabra o frase completa. Las letras se normalizan para que espacios y tildes no rompan la comprobación.",
    ],
    steps: ["Enter the text.", "Press Process.", "See yes/no with normalized form."],
    stepsEs: ["Ingresá el texto.", "Pulsá Procesar.", "Mirá sí/no con la forma normalizada."],
    faq: [
      { q: "Do spaces count?", a: "No. Only letters and digits are compared." },
    ],
    faqEs: [
      { q: "¿Cuentan los espacios?", a: "No. Solo se comparan letras y dígitos." },
    ],
  },  "numeros-a-palabras": {
    metaTitle: "Numbers to Words — English & Spanish | UtiliHub",
    metaTitleEs: "Números a palabras — Español e inglés | UtiliHub",
    metaDescription: "Spell out integers in English or Spanish up to 999,999,999. Browser-only converter.",
    metaDescriptionEs: "Escribí enteros en palabras en español o inglés hasta 999.999.999. Conversor solo en el navegador.",
    about: [
      "Enter a non-negative integer. On English pages you get English words; on Spanish pages, Spanish wording including un millón / millones.",
    ],
    aboutEs: [
      "Ingresá un entero no negativo. En páginas en español obtenés la forma en español (un millón / millones); en inglés, la forma inglesa.",
    ],
    steps: ["Type digits only.", "Press Process.", "Copy the spelled-out number."],
    stepsEs: ["Escribí solo dígitos.", "Pulsá Procesar.", "Copiá el número en palabras."],
    faq: [
      { q: "What is the maximum?", a: "999,999,999 (nine hundred ninety-nine million)." },
      { q: "Decimals?", a: "Not supported — use whole numbers only." },
    ],
    faqEs: [
      { q: "¿Cuál es el máximo?", a: "999.999.999 (novecientos noventa y nueve millones)." },
      { q: "¿Decimales?", a: "No — solo enteros." },
    ],
  },
};
