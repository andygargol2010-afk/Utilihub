import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-palabras-unicas",
  "Unique Words Calculator",
  "texto",
  "text",
  "Count unique words, total words and uniqueness ratio in any text.",
  [
    "unique words",
    "word uniqueness",
    "calculadora de palabras únicas",
    "palabras únicas",
  ],
  {
    title: "Unique Words Calculator — Count & Ratio | UtiliHub",
    description: "Free unique words calculator. Paste text to get unique count, total words and uniqueness percentage. Browser-only, no signup.",
    summaryEs: "Cuenta palabras únicas, total y ratio de unicidad en cualquier texto.",
  },
);
tool.faq.push(
  faq(
    "How are unique words counted?",
    "Text is split on whitespace; punctuation is kept with the word. Case-insensitive by default for uniqueness.",
  ),
  faq(
    "Is the ratio useful for writing?",
    "Yes. Higher uniqueness often indicates richer vocabulary; lower may show repetition.",
  ),
);

export const UNIQUE_WORDS_CALCULATOR_TOOLS = [tool];
