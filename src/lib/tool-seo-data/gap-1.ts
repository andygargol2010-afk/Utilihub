// TOOL_SEO_OVERRIDES_GAP part 1 — split out of ../tool-seo-overrides-gap.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GAP_1: Record<string, ToolSeoOverride> = {
  "codigo-morse": {
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
  "texto-binario": {
    metaTitle: "Text to Binary Converter — UTF-8 Online | UtiliHub",
    metaTitleEs: "Conversor de texto a binario — UTF-8 online | UtiliHub",
    metaDescription: "Convert text to UTF-8 binary and binary back to text. Works offline in the browser. Free and private.",
    metaDescriptionEs: "Convertí texto a binario UTF-8 y binario a texto. Funciona offline en el navegador. Gratis y privado.",
    about: [
      "Encode any string as 8-bit UTF-8 binary groups, or decode a stream of 0s and 1s back into readable text.",
      "Binary input must be a multiple of 8 bits. Spaces between bytes are optional.",
    ],
    aboutEs: [
      "Codificá cualquier cadena como grupos binarios UTF-8 de 8 bits, o decodificá un flujo de 0 y 1 a texto legible.",
      "La entrada binaria debe ser múltiplo de 8 bits. Los espacios entre bytes son opcionales.",
    ],
    steps: ["Enter text or binary (0/1).", "Press Process.", "Copy the output."],
    stepsEs: ["Ingresá texto o binario (0/1).", "Pulsá Procesar.", "Copiá el resultado."],
    faq: [
      { q: "What encoding is used?", a: "UTF-8, so emojis and non-Latin scripts work when encoding text to binary." },
      { q: "Why did I get an error on binary input?", a: "Length must be a multiple of 8. Incomplete bytes are rejected." },
    ],
    faqEs: [
      { q: "¿Qué codificación usa?", a: "UTF-8, así que emojis y scripts no latinos funcionan al pasar de texto a binario." },
      { q: "¿Por qué falla mi binario?", a: "La longitud debe ser múltiplo de 8. Los bytes incompletos se rechazan." },
    ],
  },
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
