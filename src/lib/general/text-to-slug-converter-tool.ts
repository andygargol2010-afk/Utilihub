import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-texto-slug",
  "Text to Slug Converter",
  "texto",
  "text",
  "Convert any text into a URL-friendly slug (lowercase, hyphens, no accents).",
  [
    "text to slug",
    "conversor texto slug",
    "slug generator",
    "generador de slug",
    "url slug converter",
  ],
  {
    title: "Text to Slug Converter | UtiliHub",
    description: "Free text to slug converter. Create SEO-friendly URLs from any text. Runs in your browser.",
    summaryEs: "Convierte cualquier texto en un slug amigable para URLs.",
  },
);
tool.faq.push(faq("What is a slug?", "A short, URL-friendly version of a text, usually lowercase with hyphens instead of spaces."));

export const TEXT_TO_SLUG_CONVERTER_TOOLS = [tool];
