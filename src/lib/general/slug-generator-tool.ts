import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-slug",
  "Slug Generator",
  "texto",
  "generator",
  "Convert any text into a clean URL-friendly slug. Instant browser generation with options for separator and case.",
  [
    "slug generator",
    "url slugify",
    "text to slug",
    "generador de slug",
    "convertir texto a slug",
    "slug para url",
  ],
  {
    title: "Slug Generator — URL-Friendly Text Slugs | UtiliHub",
    description:
      "Free online slug generator. Turn titles and phrases into clean URL slugs. Runs locally in the browser, no signup.",
  },
);
tool.faq.push(
  faq(
    "What is a slug?",
    "A slug is a URL-friendly version of a string: lowercase, spaces replaced by hyphens, special characters removed or transliterated.",
  ),
);
tool.faq.push(
  faq(
    "Does it support accents and special characters?",
    "Yes. Accents are stripped (é → e) and most special characters are removed or turned into separators.",
  ),
);

export const SLUG_GENERATOR_TOOLS = [tool];
