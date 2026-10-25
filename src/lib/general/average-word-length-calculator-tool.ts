import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-longitud-promedio-palabra",
  "Average Word Length Calculator",
  "texto",
  "calculator",
  "Calculate the average number of characters per word in a text. Useful for writing and readability analysis.",
  [
    "average word length calculator",
    "calculadora longitud promedio palabra",
    "word length average",
    "longitud media palabras",
    "characters per word calculator",
  ],
  {
    title: "Average Word Length Calculator — Characters per Word | UtiliHub",
    description: "Free average word length calculator. Paste text to get average characters per word. Browser-only.",
    summaryEs: "Calcula la longitud promedio de las palabras en un texto. Útil para análisis de legibilidad.",
  },
);
tool.faq.push(
  faq(
    "How is average word length calculated?",
    "Total characters in all words divided by the number of words (spaces and punctuation are ignored for word splitting).",
  ),
);

export const AVERAGE_WORD_LENGTH_CALCULATOR_TOOLS = [tool];
