import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-nombres-empresa",
  "Company Name Generator",
  "generadores",
  "generator",
  "Generate creative company and brand name ideas. Instant and local.",
  [
    "company name generator",
    "business name generator",
    "brand name ideas",
    "generador de nombres de empresa",
    "nombres para negocios",
    "generador de marcas",
  ],
  {
    title: "Company Name Generator — Free Brand Ideas Online | UtiliHub",
    description:
      "Free company name generator. Create unique business and brand name suggestions instantly in your browser. No signup required.",
  },
);
tool.faq.push(
  faq(
    "How does it generate names?",
    "It combines random prefixes, keywords, and suffixes using browser randomness for creative suggestions.",
  ),
);
tool.faq.push(
  faq(
    "Can I use these names commercially?",
    "These are ideas only. Always check trademark and domain availability before using a name.",
  ),
);

export const COMPANY_NAME_GENERATOR_TOOLS = [tool];
