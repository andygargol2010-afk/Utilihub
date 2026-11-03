import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-palabras-por-oracion",
  "Words per Sentence Calculator",
  "texto",
  "calculator",
  "Calculate the average number of words per sentence in a text.",
  [
    "words per sentence",
    "average sentence length",
    "calculadora palabras por oración",
    "longitud media de oración",
    "sentence length calculator",
  ],
  {
    title: "Words per Sentence Calculator | UtiliHub",
    description:
      "Free words per sentence calculator. Paste text and get the average words per sentence. Useful for readability. EN+ES. Runs in the browser.",
    summaryEs: "Calcula el promedio de palabras por oración de un texto.",
  },
);
tool.faq.push(
  faq(
    "How are sentences counted?",
    "Sentences are split on . ! ? and similar terminators. Empty segments are ignored.",
  ),
);
tool.faq.push(
  faq(
    "What is a good average?",
    "For general readability, 15–20 words per sentence is often recommended. Academic texts may be longer.",
  ),
);

export const WORDS_PER_SENTENCE_CALCULATOR_TOOLS = [tool];
