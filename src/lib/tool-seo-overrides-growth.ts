import { TOOL_SEO_OVERRIDES_GROWTH_PART1 } from "./tool-seo-overrides-growth.part1";
import { TOOL_SEO_OVERRIDES_GROWTH_PART2 } from "./tool-seo-overrides-growth.part2";
/** Unique SEO for SEO-growth tools (calculadora-imc, gpa, jwt, etc.). Avoid generic makeTool defaults. */

export type ToolSeoOverrideGrowth = {
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  about: string[];
  aboutEs?: string[];
  steps: string[];
  stepsEs?: string[];
  faq: { q: string; a: string }[];
  faqEs?: { q: string; a: string }[];
};

export const TOOL_SEO_OVERRIDES_GROWTH: Record<string, ToolSeoOverrideGrowth> = {
  ...TOOL_SEO_OVERRIDES_GROWTH_PART1,
  ...TOOL_SEO_OVERRIDES_GROWTH_PART2,

  "tiempo-lectura": {
    metaTitle: "Reading Time Calculator — Words to Minutes Free | UtiliHub",
    metaTitleEs: "Calculadora de tiempo de lectura — palabras a minutos | UtiliHub",
    metaDescription:
      "Estimate reading time from word count or pasted text. Adjust WPM for blogs, docs, and school work. Free, no signup.",
    metaDescriptionEs:
      "Calculá el tiempo de lectura a partir del texto o del número de palabras. Ajustá PPM para blogs, docs y trabajos. Gratis, sin registro.",
    about: [
      "Reading-time widgets usually divide word count by a speed such as 200–250 words per minute for adult silent reading.",
      "Paste full text or enter a raw word count. Adjust WPM for technical material (slower) or skimming (faster).",
      "Screen density, language, and images change real duration—this is a planning estimate for blogs and docs.",
    ],
    aboutEs: [
      "Los widgets de tiempo de lectura dividen las palabras por una velocidad típica de 200–250 ppm en lectura silenciosa adulta.",
      "Pegá el texto o un número de palabras. Bajá el PPM en material técnico y subilo si solo se hojea.",
      "Pantalla, idioma e imágenes cambian la duración real: es una estimación para blogs y documentación.",
    ],
    steps: [
      "Paste text or enter a word count.",
      "Optionally set words per minute (default 200).",
      "Read estimated minutes (and seconds if shown).",
    ],
    stepsEs: [
      "Pegá el texto o ingresá un conteo de palabras.",
      "Opcional: definí palabras por minuto (por defecto 200).",
      "Leé los minutos estimados.",
    ],
    faq: [
      {
        q: "What WPM should I use?",
        a: "About 200–250 for adult silent reading; lower for dense technical text.",
      },
      {
        q: "Is this exact?",
        a: "No—it is an estimate. Images, layout, and language change real time.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué PPM uso?",
        a: "Unos 200–250 en lectura silenciosa adulta; menos en texto técnico denso.",
      },
      {
        q: "¿Es exacto?",
        a: "No: es una estimación. Imágenes, diseño e idioma cambian el tiempo real.",
      },
    ],
  },
};
