// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GAP_1, split from gap-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GAP_1_PART1: Record<string, ToolSeoOverride> = {  "codigo-morse": {
    metaTitle: "Morse Code Translator — Text ↔ Morse Online | UtiliHub",
    metaTitleEs: "Traductor de código Morse — Texto ↔ Morse online | UtiliHub",
    metaDescription:
      "Convert text to Morse code and Morse back to text in your browser. Supports letters, numbers, and common punctuation. Free, private, no signup.",
    metaDescriptionEs:
      "Convertí texto a código Morse y Morse a texto en el navegador. Letras, números y puntuación. Gratis, privado, sin registro.",
    about: [
      "This Morse code translator works entirely in your browser. Type plain text to get dots and dashes, or paste Morse to decode it back to letters.",
      "Spaces separate letters; a slash separates words. You can use dots (.), dashes (-), or middle dots (·).",
      "Nothing is uploaded. Ideal for learning Morse, quick messages, or checking practice drills.",
    ],
    aboutEs: [
      "Este traductor de código Morse funciona en el navegador. Escribí texto plano para obtener puntos y rayas, o pegá Morse para decodificarlo.",
      "Los espacios separan letras; la barra separa palabras. Podés usar puntos (.), rayas (-) o puntos medios (·).",
      "Nada se sube a un servidor. Ideal para aprender Morse, mensajes rápidos o verificar ejercicios.",
    ],
    steps: [
      "Paste or type text (to encode) or Morse symbols (to decode).",
      "Press Process — the tool auto-detects direction from the input.",
      "Copy the result and use it wherever you need.",
    ],
    stepsEs: [
      "Pegá o escribí texto (para codificar) o símbolos Morse (para decodificar).",
      "Pulsá Procesar — la herramienta detecta la dirección según la entrada.",
      "Copiá el resultado y usalo donde lo necesites.",
    ],
    faq: [
      { q: "Does it support Spanish characters?", a: "Accented letters are skipped when encoding. Stick to a–z, 0–9, and common punctuation for best results." },
      { q: "How are words separated in Morse?", a: "A slash (/) marks a word boundary. Spaces separate individual letter codes." },
      { q: "Is my text stored?", a: "No. Conversion runs locally in the browser and is never uploaded." },
    ],
    faqEs: [
      { q: "¿Soporta caracteres del español?", a: "Las letras con tilde se omiten al codificar. Usá a–z, 0–9 y puntuación habitual para mejores resultados." },
      { q: "¿Cómo se separan las palabras en Morse?", a: "Una barra (/) marca el límite de palabra. Los espacios separan códigos de cada letra." },
      { q: "¿Se guarda mi texto?", a: "No. La conversión corre en el navegador y no se sube a ningún servidor." },
    ],
  },
};
