import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-oraciones-por-parrafo",
  "Sentences Per Paragraph Calculator",
  "texto",
  "calculator",
  "Calculate the average number of sentences per paragraph.",
  [
    "sentences per paragraph calculator",
    "average sentences per paragraph",
    "calculadora oraciones por parrafo",
    "oraciones por párrafo",
  ],
  {
    title: "Sentences Per Paragraph Calculator | Average | UtiliHub",
    description: "Free calculator for average sentences per paragraph. Enter number of sentences and paragraphs. Browser-only, no signup.",
    summaryEs: "Calcula el número medio de oraciones por párrafo.",
  },
);
tool.faq.push(
  faq(
    "Why measure sentences per paragraph?",
    "It helps assess writing style and readability. Shorter paragraphs with fewer sentences are often easier to read online.",
  ),
  faq(
    "What is a good average?",
    "For web content, 1–3 sentences per paragraph is common. Academic writing may have more.",
  ),
);

export const SENTENCES_PER_PARAGRAPH_CALCULATOR_TOOLS = [tool];
