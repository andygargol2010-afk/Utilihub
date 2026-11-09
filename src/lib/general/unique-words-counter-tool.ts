import { makeTool, faq } from "./types";

const tool = makeTool(
  "contador-palabras-unicas",
  "Unique Words Counter",
  "texto",
  "counter",
  "Count unique words in any text (case-insensitive, punctuation normalized).",
  [
    "unique words counter",
    "count unique words",
    "contador palabras unicas",
    "palabras distintas",
    "vocabulary size text",
  ],
  {
    title: "Unique Words Counter — vocabulary size of any text | UtiliHub",
    description: "Free unique words counter. Paste text to see how many distinct words it contains. Local browser calculation.",
  },
);
tool.faq.push(
  faq(
    "Are uppercase and lowercase treated as the same word?",
    "Yes. Everything is lowercased before counting so Cat and cat count as one.",
  ),
);

export const UNIQUE_WORDS_COUNTER_TOOLS = [tool];
