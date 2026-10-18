import { makeTool, faq } from "./types";

const tool = makeTool(
  "contador-frecuencia-palabras",
  "Word Frequency Counter",
  "texto",
  "text",
  "Count how often each word appears in a text and list the most frequent ones.",
  [
    "word frequency counter",
    "word count frequency",
    "contador de frecuencia de palabras",
    "frecuencia palabras texto",
  ],
  {
    title: "Word Frequency Counter — Top Words | UtiliHub",
    description: "Free word frequency counter. Paste text to see the most common words and total/unique counts. Runs in your browser.",
  },
);
tool.faq.push(faq("How does it work?", "It splits on word boundaries (letters and numbers), lowercases, and counts occurrences."));
tool.faq.push(faq("Case sensitive?", "No, it is case-insensitive."));

export const WORD_FREQUENCY_COUNTER_TOOLS = [tool];
