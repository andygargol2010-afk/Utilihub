import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_SRT: Record<string, ToolSeoOverride> = {
  "desfase-srt": {
    metaTitle: "SRT Subtitle Offset — Delay or Advance Cues | UtiliHub",
    metaTitleEs: "Desfase de subtítulos SRT — retrasar o adelantar | UtiliHub",
    metaDescription:
      "Shift SubRip start and end times by milliseconds. Empty or broken cues do not invent a file. Dialogue stays intact. Runs in the browser.",
    metaDescriptionEs:
      "Desplazá inicio y fin de cues SubRip en milisegundos. Vacío o roto no inventa un archivo. El diálogo no se reescribe. Corre en el navegador.",
    about: [
      "This offsets existing SubRip cues. It does not generate dialogue or translate lines.",
      "A positive offset delays the cue. A negative offset advances it. Both start and end move by the same amount.",
      "Times are written with a comma, the SubRip millisecond separator. Dot input is accepted.",
    ],
    aboutEs: [
      "Desfasa cues SubRip que ya existen. No genera diálogo ni traduce líneas.",
      "Un desfase positivo retrasa el cue. Uno negativo lo adelanta. Inicio y fin se mueven igual.",
      "Los tiempos se escriben con coma, el separador de milisegundos de SubRip. La entrada con punto se acepta.",
    ],
    steps: [
      "Paste one or more cues, or use the 1.5 second delay example.",
      "Enter the offset in milliseconds. Positive delays, negative advances.",
      "Copy the SRT. Empty text, a broken stamp, or a time that would go below zero does not produce a file.",
    ],
    stepsEs: [
      "Pegá uno o más cues, o usá el ejemplo de 1,5 segundos de retraso.",
      "Ingresá el desfase en milisegundos. Positivo retrasa, negativo adelanta.",
      "Copiá el SRT. Texto vacío, un sello roto o un tiempo que quedaría bajo cero no produce un archivo.",
    ],
    faq: [
      { q: "What is a 1500 ms delay on a cue from 00:00:01,000 to 00:00:03,000?", a: "The cue becomes 00:00:02,500 --> 00:00:04,500. The dialogue line is unchanged." },
      { q: "What is a 500 ms advance on the same cue?", a: "The cue becomes 00:00:00,500 --> 00:00:02,500." },
      { q: "Is the subtitle file uploaded?", a: "No. The shift runs in the browser. Nothing is sent." },
    ],
    faqEs: [
      { q: "¿Qué es un retraso de 1500 ms en un cue de 00:00:01,000 a 00:00:03,000?", a: "El cue pasa a 00:00:02,500 --> 00:00:04,500. La línea de diálogo no cambia." },
      { q: "¿Y un adelanto de 500 ms en el mismo cue?", a: "El cue pasa a 00:00:00,500 --> 00:00:02,500." },
      { q: "¿Se sube el archivo de subtítulos?", a: "No. El desfase corre en el navegador. No se envía nada." },
    ],
  },
};
