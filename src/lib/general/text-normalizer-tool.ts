import { makeTool, faq } from "./types";

const tool = makeTool(
  "normalizador-texto",
  "Text Normalizer",
  "texto",
  "text",
  "Clean and normalize text: trim whitespace, collapse multiple spaces, remove empty lines, and standardize line breaks.",
  [
    "text normalizer",
    "clean text whitespace",
    "remove extra spaces",
    "normalizador de texto",
    "limpiar espacios en blanco",
    "colapsar espacios",
  ],
  {
    title: "Text Normalizer — Clean Whitespace and Format Text | UtiliHub",
    description: "Free text normalizer. Remove extra spaces, empty lines, and clean formatting. Runs entirely in your browser.",
  },
);
tool.faq.push(faq("What does it clean?", "It trims leading/trailing spaces, collapses multiple spaces/tabs into single spaces, removes empty lines, and normalizes line endings."));
tool.faq.push(faq("Does it change the content?", "Only whitespace is modified. Words and punctuation stay the same."));

export const TEXT_NORMALIZER_TOOLS = [tool];
