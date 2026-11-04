// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH_B3, split from tool-seo-overrides-growth-b3.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_B3_PART2: Record<string, ToolSeoOverrideGrowth> = {
  "ppi-pantalla": {
    metaTitle: "PPI Calculator — Pixels Per Inch from Diagonal | UtiliHub",
    metaTitleEs: "Calculadora de PPI de pantalla | UtiliHub",
    metaDescription:
      "Compute screen pixel density (PPI) from resolution width, height, and diagonal size in inches.",
    metaDescriptionEs:
      "Calculá la densidad de píxeles (PPI) a partir de la resolución y la diagonal en pulgadas.",
    about: [
      "Pixels per inch measures how densely pixels are packed on a diagonal-specified panel. Higher PPI generally looks sharper at the same viewing distance.",
      "PPI = √(width² + height²) / diagonal_inches using the resolution’s pixel counts.",
      "Marketing “Retina” claims depend on viewing distance; use PPI as a neutral comparison between monitors and phones.",
    ],
    aboutEs: [
      "Los píxeles por pulgada miden qué tan juntos están los píxeles en un panel definido por su diagonal. Más PPI suele verse más nítido a igual distancia.",
      "PPI = √(ancho² + alto²) / diagonal_en_pulgadas usando la resolución en píxeles.",
      "Las promesas tipo “Retina” dependen de la distancia de visionado; usá el PPI como comparación neutral entre monitores y celulares.",
    ],
    steps: [
      "Enter width px, height px, and diagonal inches.",
      "Calculate PPI.",
      "Compare panels before buying or designing UI assets.",
    ],
    stepsEs: [
      "Ingresá ancho px, alto px y diagonal en pulgadas.",
      "Calculá el PPI.",
      "Compará paneles antes de comprar o diseñar assets de UI.",
    ],
    faq: [
      {
        q: "Logical vs physical pixels?",
        a: "Use the panel’s native resolution, not CSS CSS-px after scaling, for hardware PPI.",
      },
      {
        q: "Ultrawide screens?",
        a: "The same formula applies; extreme aspect ratios still use the pixel diagonal over the stated inch size.",
      },
    ],
    faqEs: [
      {
        q: "¿Píxeles lógicos o físicos?",
        a: "Usá la resolución nativa del panel, no los CSS-px tras el escalado, para el PPI de hardware.",
      },
      {
        q: "¿Pantallas ultrawide?",
        a: "Vale la misma fórmula; ratios extremos siguen usando la diagonal en píxeles sobre las pulgadas indicadas.",
      },
    ],
  },
};
