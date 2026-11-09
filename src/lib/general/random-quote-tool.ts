import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-frases-aleatorias",
  "Random Quote Generator",
  "generadores",
  "generator",
  "Generate random inspirational quotes instantly in the browser.",
  [
    "random quote generator",
    "inspirational quotes",
    "generador de frases",
    "citas aleatorias",
    "quote of the day",
  ],
  {
    title: "Random Quote Generator — Free inspirational quotes online | UtiliHub",
    description: "Generate random quotes for inspiration, testing, or fun. Copy with one click. No signup, runs locally.",
  },
);
tool.faq.push(faq("Are the quotes original?", "No. They are a small curated set of public-domain or commonly attributed inspirational lines for placeholder use."));
tool.faq.push(faq("Can I use them commercially?", "Check attribution if needed. These are short public quotes."));
tool.faq.push(faq("Does it work offline?", "Yes, once the page loads, generation is local."));

export const RANDOM_QUOTE_TOOLS = [tool];
