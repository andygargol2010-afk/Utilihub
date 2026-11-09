import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_BPM_DELAY: Record<string, ToolSeoOverride> = {
  "convertidor-delay-bpm": {
    metaTitle: "BPM to Milliseconds Delay Converter | UtiliHub",
    metaTitleEs: "Convertidor de delay BPM a milisegundos | UtiliHub",
    metaDescription:
      "Type 120 BPM and read a 500 ms quarter note, 375 ms dotted eighth, and 166.7 ms eighth triplet. Runs in the browser.",
    metaDescriptionEs:
      "Escribí 120 BPM y leé una negra de 500 ms, una corchea con punto de 375 ms y un tresillo de corcheas de 166,7 ms. Corre en el navegador.",
    about: [
      "A quarter note lasts 60000 divided by the BPM. Pedal delays are usually set in milliseconds, not note names.",
      "Chord transpose changes pitch. This only maps tempo to whole, half, quarter, eighth, sixteenth, dotted, and triplet lengths.",
      "Values outside 20–300 BPM, blanks, and letters stop before a fake delay time. Nothing leaves the browser.",
    ],
    aboutEs: [
      "Una negra dura 60000 dividido el BPM. Los delays de pedal se suelen fijar en milisegundos, no en nombres de figura.",
      "El transpositor de acordes cambia la altura. Esto solo mapea el tempo a redonda, blanca, negra, corchea, semicorchea, puntillo y tresillo.",
      "Valores fuera de 20–300 BPM, vacíos y letras se detienen antes de un tiempo falso. Nada sale del navegador.",
    ],
    steps: [
      "Type a tempo between 20 and 300 BPM, or pick 90, 120, or 140.",
      "Read the millisecond column for straight, dotted, and triplet notes.",
      "Copy the table or reset to 120 BPM.",
    ],
    stepsEs: [
      "Escribí un tempo entre 20 y 300 BPM, o elegí 90, 120 o 140.",
      "Leé la columna de milisegundos para figuras rectas, con punto y tresillos.",
      "Copiá la tabla o restablecé a 120 BPM.",
    ],
    faq: [
      { q: "What is 120 BPM in milliseconds?", a: "A quarter note is 500 ms. A dotted eighth is 375 ms. An eighth triplet is 166.7 ms." },
      { q: "What is 90 BPM in milliseconds?", a: "A quarter note is 666.7 ms. A half note is 1333.3 ms. A dotted quarter is 1000 ms." },
      { q: "Why reject 0 or 400 BPM?", a: "Zero cannot divide into a note length. This tool stays in 20–300 BPM, the range used by songs and delay pedals." },
    ],
    faqEs: [
      { q: "¿Cuánto es 120 BPM en milisegundos?", a: "Una negra son 500 ms. Una corchea con punto son 375 ms. Un tresillo de corcheas son 166,7 ms." },
      { q: "¿Cuánto es 90 BPM en milisegundos?", a: "Una negra son 666,7 ms. Una blanca son 1333,3 ms. Una negra con punto son 1000 ms." },
      { q: "¿Por qué rechaza 0 o 400 BPM?", a: "Cero no puede dividir una figura. La herramienta se queda en 20–300 BPM, el rango de canciones y pedales de delay." },
    ],
  },
};
