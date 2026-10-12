import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-lorem-ipsum",
  "Lorem Ipsum Generator",
  "generadores",
  "generator",
  "Generate classic Lorem Ipsum placeholder text by paragraphs or words.",
  [
    "lorem ipsum generator",
    "placeholder text generator",
    "dummy text",
    "generador lorem ipsum",
    "texto de relleno",
  ],
  {
    title: "Lorem Ipsum Generator — Placeholder Text | UtiliHub",
    description: "Free online Lorem Ipsum generator. Create paragraphs or words of classic placeholder text for designs and mockups. Runs locally.",
  },
);
tool.faq.push(faq("What is Lorem Ipsum?", "A standard dummy text used in design and publishing since the 1500s, derived from Latin."));
tool.faq.push(faq("Is the text always the same?", "The classic passage is fixed; the tool repeats and trims it to the requested length."));

export const LOREM_IPSUM_TOOLS = [tool];
