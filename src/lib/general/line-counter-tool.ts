import { makeTool, faq } from "./types";

const tool = makeTool(
  "contador-lineas",
  "Line Counter",
  "texto",
  "text",
  "Count the number of lines in a text. Includes empty lines.",
  [
    "line counter",
    "count lines",
    "contador de lineas",
    "contar lineas",
    "lines in text",
  ],
  {
    title: "Line Counter — Count Lines in Text | UtiliHub",
    description: "Free line counter. Paste text to count lines instantly. Runs in your browser.",
  },
);
tool.faq.push(faq("Does it count empty lines?", "Yes, empty lines are counted."));

export const LINE_COUNTER_TOOLS = [tool];
