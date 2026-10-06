import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_NATO: Record<string, ToolSeoOverride> = {
  "traductor-fonetico-otan": {
    metaTitle: "NATO Phonetic Alphabet Translator — ICAO Spelling | UtiliHub",
    metaTitleEs: "Traductor alfabeto fonético OTAN — deletreo ICAO | UtiliHub",
    metaDescription:
      "Spell letters and digits with the ICAO/NATO alphabet. UTILIHUB becomes Uniform Tango India Lima India Hotel Uniform Bravo. 9 is Niner.",
    metaDescriptionEs:
      "Deletreá letras y dígitos con el alfabeto ICAO/OTAN. UTILIHUB queda Uniform Tango India Lima India Hotel Uniform Bravo. El 9 es Niner.",
    about: [
      "Radio and aviation use the ICAO spelling alphabet so similar letters are not confused. This page maps A–Z and 0–9 locally, without uploading the text.",
      "It is not Morse code and not a binary encoder. The output is the spoken word for each character.",
    ],
    aboutEs: [
      "Radio y aviación usan el alfabeto ICAO para no confundir letras parecidas. Esta página mapea A–Z y 0–9 en el navegador, sin subir el texto.",
      "No es código Morse ni un codificador binario. La salida es la palabra hablada de cada carácter.",
    ],
    steps: [
      "Paste a call sign, plate, or word. Empty input stays blank. A minus sign is a hyphen, not a number error.",
      "Choose ICAO digits (Tree, Niner) or plain English digits. Optionally keep spaces and punctuation labels.",
      "Read the spelled line. Accents are stripped before lookup so Á maps to Alfa.",
      "Copy the line or reset. Nothing leaves the browser.",
    ],
    stepsEs: [
      "Pegá un indicativo, patente o palabra. Vacío queda en blanco. Un menos es un guion, no un error numérico.",
      "Elegí dígitos ICAO (Tree, Niner) o dígitos en inglés plano. Opcional: conservar espacios y etiquetas de puntuación.",
      "Leé la línea deletreada. Los acentos se quitan antes del mapa, así Á es Alfa.",
      "Copiá la línea o reiniciá. Nada sale del navegador.",
    ],
    faq: [
      {
        q: "How is UTILIHUB spelled?",
        a: "Uniform Tango India Lima India Hotel Uniform Bravo. Each letter is one ICAO word, joined by spaces.",
      },
      {
        q: "What does AB-19 become with ICAO digits?",
        a: "Alfa Bravo Hyphen One Niner if punctuation is labeled. Without the hyphen label it is Alfa Bravo One Niner. 3 is Tree and 9 is Niner in the ICAO digit list.",
      },
      {
        q: "Which table and units are used?",
        a: "ICAO Annex 10 spelling alphabet: A Alfa through Z Zulu. Digits: 0 Zero, 1 One, 2 Two, 3 Tree, 4 Four, 5 Five, 6 Six, 7 Seven, 8 Eight, 9 Niner. There is no SI unit; the output is words.",
      },
      {
        q: "What happens with empty text, 0, a minus, or NaN?",
        a: "Empty text produces no words. Digit 0 is Zero. A leading minus is Hyphen if punctuation is labeled, otherwise skipped. The letters in NaN spell November Alfa November.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se deletrea UTILIHUB?",
        a: "Uniform Tango India Lima India Hotel Uniform Bravo. Cada letra es una palabra ICAO, separada por espacios.",
      },
      {
        q: "¿En qué queda AB-19 con dígitos ICAO?",
        a: "Alfa Bravo Hyphen One Niner si se etiqueta la puntuación. Sin el guion: Alfa Bravo One Niner. El 3 es Tree y el 9 es Niner en la lista ICAO.",
      },
      {
        q: "¿Qué tabla y unidades se usan?",
        a: "Alfabeto ICAO del Anexo 10: A Alfa hasta Z Zulu. Dígitos: 0 Zero, 1 One, 2 Two, 3 Tree, 4 Four, 5 Five, 6 Six, 7 Seven, 8 Eight, 9 Niner. No hay unidad SI; la salida son palabras.",
      },
      {
        q: "¿Qué pasa con texto vacío, 0, un menos o NaN?",
        a: "El texto vacío no produce palabras. El dígito 0 es Zero. Un menos inicial es Hyphen si se etiqueta la puntuación; si no, se omite. Las letras de NaN se leen November Alfa November.",
      },
    ],
  },
};
