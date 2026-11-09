import { makeTool, faq } from "./types";

const tool = makeTool(
  "contador-caracteres",
  "Character Counter",
  "productividad",
  "text",
  "Count characters, words, lines and sentences in any text instantly in your browser.",
  [
    "character counter",
    "word counter",
    "letter counter",
    "contador de caracteres",
    "contador de palabras",
    "contador de letras",
  ],
  {
    title: "Character Counter — Count characters, words and lines | UtiliHub",
    description: "Free online character, word and line counter. Paste text and get instant counts. Private, runs in your browser.",
  },
);
tool.faq.push(faq("Does it count spaces?", "Yes. The character count includes spaces, punctuation and line breaks."));
tool.faq.push(faq("What is a word?", "Words are separated by whitespace. Empty lines are ignored for word count."));

export const CHARACTER_COUNTER_TOOLS = [tool];
