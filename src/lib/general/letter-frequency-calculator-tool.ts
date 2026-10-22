import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-frecuencia-letras",
  "Letter Frequency Calculator",
  "texto",
  "text",
  "Count the frequency of each letter in a text. Case-insensitive, ignores non-letters.",
  [
    "letter frequency calculator",
    "letter count",
    "calculadora frecuencia letras",
    "frecuencia de letras",
    "letter distribution",
  ],
  {
    title: "Letter Frequency Calculator | UtiliHub",
    description: "Free letter frequency calculator. Paste text to see how often each letter appears. Instant, local, no signup.",
  },
);
tool.faq.push(faq("Does it count uppercase and lowercase as the same?", "Yes. The calculator is case-insensitive and counts only A-Z letters."));

export const LETTER_FREQUENCY_CALCULATOR_TOOLS = [tool];
