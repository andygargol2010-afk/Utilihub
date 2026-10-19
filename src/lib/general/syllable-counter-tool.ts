import { makeTool, faq } from "./types";

const tool = makeTool(
  "contador-silabas",
  "Syllable Counter",
  "texto",
  "counter",
  "Count the approximate number of syllables in a text using a simple heuristic.",
  [
    "syllable counter",
    "count syllables",
    "contador de sílabas",
    "contar sílabas",
  ],
  {
    title: "Syllable Counter — approximate count | UtiliHub",
    description: "Free syllable counter. Paste text to estimate the number of syllables. Local browser calculation.",
  },
);
tool.faq.push(faq("How does it count?", "Uses a basic vowel-group heuristic; accuracy varies by language."));
tool.faq.push(faq("Supported languages?", "Best for English and Spanish; other languages may differ."));

export const SYLLABLE_COUNTER_TOOLS = [tool];
