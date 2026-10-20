import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-lorem-ipsum",
  "Lorem Ipsum Generator",
  "generadores",
  "generator",
  "Generate placeholder Lorem Ipsum text by paragraphs or words.",
  [
    "lorem ipsum generator",
    "generador lorem ipsum",
    "placeholder text",
    "dummy text",
  ],
  {
    title: "Lorem Ipsum Generator — Placeholder Text | UtiliHub",
    description: "Free Lorem Ipsum generator. Choose number of paragraphs or words. Instant browser generation.",
  },
);
tool.faq.push(faq("What is Lorem Ipsum?", "Dummy placeholder text used in design and publishing."));

export const LOREM_IPSUM_GENERATOR_TOOLS = [tool];
