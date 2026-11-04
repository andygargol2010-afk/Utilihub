// TOOL_SEO_OVERRIDES_GAP part 1 — split out of ../tool-seo-overrides-gap.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_GAP_1_PART1 } from "./gap-1.part1";
import { TOOL_SEO_OVERRIDES_GAP_1_PART2 } from "./gap-1.part2";


export const TOOL_SEO_OVERRIDES_GAP_1: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_GAP_1_PART1,
  ...TOOL_SEO_OVERRIDES_GAP_1_PART2,
  "frecuencia-palabras": {
    metaTitle: "Word Frequency Counter — Rank Words in Text | UtiliHub",
    metaTitleEs: "Contador de frecuencia de palabras | UtiliHub",
    metaDescription: "Count how often each word appears in your text, with rankings and percentages. Free browser tool.",
    metaDescriptionEs: "Contá cuántas veces aparece cada palabra en tu texto, con ranking y porcentajes. Herramienta gratis en el navegador.",
    about: [
      "Paste any article, essay, or notes and get a ranked list of word frequencies with percentages.",
      "Useful for SEO drafts, writing analysis, and vocabulary checks.",
    ],
    aboutEs: [
      "Pegá un artículo, ensayo o notas y obtené un ranking de frecuencias con porcentajes.",
      "Útil para borradores SEO, análisis de escritura y vocabulario.",
    ],
    steps: ["Paste your text.", "Press Process.", "Review the ranked list."],
    stepsEs: ["Pegá tu texto.", "Pulsá Procesar.", "Revisá el ranking."],
    faq: [
      { q: "Are stop words removed?", a: "No. Every token is counted so you control filtering." },
      { q: "Is it case sensitive?", a: "No. Words are normalized to lowercase before counting." },
    ],
    faqEs: [
      { q: "¿Se eliminan palabras vacías?", a: "No. Se cuenta cada token para que vos filtres." },
      { q: "¿Distingue mayúsculas?", a: "No. Se normaliza a minúsculas antes de contar." },
    ],
  },
  "nivel-lectura": {
    metaTitle: "Reading Level Calculator (Flesch) | UtiliHub",
    metaTitleEs: "Calculadora de nivel de lectura | UtiliHub",
    metaDescription: "Estimate reading ease with Flesch (English) or Fernández-Huerta (Spanish). Free, private, in-browser.",
    metaDescriptionEs: "Estimá la facilidad de lectura con Flesch (inglés) o Fernández-Huerta (español). Gratis y privado en el navegador.",
    about: [
      "Paste several sentences to estimate reading ease. English uses Flesch Reading Ease; Spanish-leaning text uses Fernández-Huerta.",
      "Scores help editors match content to audience skill level.",
    ],
    aboutEs: [
      "Pegá varias oraciones para estimar la facilidad de lectura. El inglés usa Flesch; textos en español usan Fernández-Huerta.",
      "Los puntajes ayudan a adaptar el contenido al nivel del público.",
    ],
    steps: ["Paste a few sentences.", "Press Process.", "Read the score and level label."],
    stepsEs: ["Pegá unas oraciones.", "Pulsá Procesar.", "Leé el puntaje y la etiqueta de nivel."],
    faq: [
      { q: "Why is my score above 100?", a: "Very easy short texts can exceed 100 on Fernández-Huerta; that is expected." },
      { q: "How is language detected?", a: "Heuristics look for Spanish markers; otherwise Flesch is used." },
    ],
    faqEs: [
      { q: "¿Por qué el puntaje pasa de 100?", a: "Textos muy fáciles pueden superar 100 en Fernández-Huerta; es normal." },
      { q: "¿Cómo detecta el idioma?", a: "Busca marcas del español; si no, usa Flesch." },
    ],
  },
  anagramas: {
    metaTitle: "Anagram Checker — Compare Two Phrases | UtiliHub",
    metaTitleEs: "Verificador de anagramas — Compará dos frases | UtiliHub",
    metaDescription: "Check if two words or phrases are anagrams. Ignores spaces, punctuation, and accents. Free online.",
    metaDescriptionEs: "Comprobá si dos palabras o frases son anagramas. Ignora espacios, puntuación y tildes. Gratis online.",
    about: [
      "Enter two words or phrases. The tool normalizes letters (accents stripped) and compares sorted character bags.",
    ],
    aboutEs: [
      "Ingresá dos palabras o frases. Se normalizan las letras (sin tildes) y se comparan los multiconjuntos de caracteres.",
    ],
    steps: ["Type the first phrase.", "Type the second phrase.", "Press Process."],
    stepsEs: ["Escribí la primera frase.", "Escribí la segunda.", "Pulsá Procesar."],
    faq: [
      { q: "Do spaces matter?", a: "No. Spaces and punctuation are ignored." },
      { q: "Roma and Amor?", a: "Yes — classic Spanish anagram pair." },
    ],
    faqEs: [
      { q: "¿Importan los espacios?", a: "No. Se ignoran espacios y puntuación." },
      { q: "¿Roma y Amor?", a: "Sí — el par clásico de anagramas." },
    ],
  },
};
