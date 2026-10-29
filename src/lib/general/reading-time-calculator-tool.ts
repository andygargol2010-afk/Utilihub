import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tiempo-de-lectura",
  "Reading Time Calculator",
  "texto",
  "calculator",
  "Estimate reading time from word count and reading speed (words per minute). Instant result for articles and documents. Runs fully in the browser.",
  [
    "reading time calculator",
    "words per minute reading time",
    "calculadora tiempo de lectura",
    "tiempo de lectura",
    "how long to read",
  ],
  {
    title: "Reading Time Calculator — Estimate Minutes from Word Count and WPM | UtiliHub",
    description: "Free reading time calculator. Enter word count and words-per-minute to get estimated reading time. Local, private, no signup.",
    summaryEs: "Calcula el tiempo de lectura estimado a partir del número de palabras y la velocidad de lectura (palabras por minuto).",
  },
);
tool.faq.push(
  faq(
    "How is reading time calculated?",
    "Divide the number of words by the reading speed in words per minute: minutes = words / wpm.",
  ),
);
tool.faq.push(
  faq(
    "What is a typical reading speed?",
    "Average adult silent reading is about 200–250 words per minute. Skimming is faster; careful reading is slower.",
  ),
);

export const READING_TIME_CALCULATOR_TOOLS = [tool];
