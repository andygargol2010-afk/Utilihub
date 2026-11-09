import { makeTool, faq } from "./types";

const tool = makeTool(
  "contador-oraciones",
  "Sentence Counter",
  "texto",
  "text",
  "Count the number of sentences in a text.",
  [
    "sentence counter",
    "count sentences",
    "contador de oraciones",
    "contar oraciones",
    "cuántas oraciones",
  ],
  {
    title: "Sentence Counter — Count sentences in text | UtiliHub",
    description: "Free sentence counter. Paste text to count sentences. Local browser processing.",
  },
);
tool.faq.push(faq("How are sentences detected?", "Splits on . ! ? followed by space or end."));
tool.faq.push(faq("Empty text?", "Returns 0 sentences."));

export const SENTENCE_COUNTER_TOOLS = [tool];
