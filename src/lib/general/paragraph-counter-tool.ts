import { makeTool, faq } from "./types";

const tool = makeTool(
  "contador-parrafos",
  "Paragraph Counter",
  "texto",
  "text",
  "Count the number of paragraphs in a text, splitting on blank lines.",
  [
    "paragraph counter",
    "count paragraphs",
    "contador de párrafos",
    "contar párrafos",
    "párrafos en texto",
  ],
  {
    title: "Paragraph Counter — Count paragraphs in text | UtiliHub",
    description: "Free paragraph counter. Paste text to count paragraphs separated by blank lines. Browser-only.",
  },
);
tool.faq.push(faq("How are paragraphs detected?", "Paragraphs are separated by one or more blank lines (double newlines)."));
tool.faq.push(faq("Does it count single newlines as paragraphs?", "No — only blank-line separated blocks."));

export const PARAGRAPH_COUNTER_TOOLS = [tool];
