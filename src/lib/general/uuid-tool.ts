import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-uuid",
  "UUID Generator",
  "generadores",
  "generator",
  "Generate version 4 UUIDs (random) locally in the browser.",
  [
    "uuid generator",
    "uuid v4 generator",
    "generate uuid",
    "generador uuid",
    "generar uuid v4",
  ],
  {
    title: "UUID Generator — Free UUID v4 Generator | UtiliHub",
    description: "Generate random UUID version 4 identifiers instantly in your browser. Copy one or many. No signup, local only.",
  },
);
tool.faq.push(faq("What is a UUID?", "A Universally Unique Identifier. Version 4 is randomly generated and has a very low chance of collision."));
tool.faq.push(faq("Is it secure?", "It uses the browser's crypto.getRandomValues for randomness. Suitable for most non-security-critical uses."));

export const UUID_TOOLS = [tool];
