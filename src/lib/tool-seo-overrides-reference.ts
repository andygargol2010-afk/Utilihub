/** FAQ and Spanish guide for converters with GSC impressions but poor position (task 18, 2026-11-03). */
// EN about/steps stay empty so resolvedToolSeo keeps the catalog copy. Never rewrite this file wholesale.
import type { ToolSeoOverride } from "./tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_REFERENCE_PART1 } from "./tool-seo-overrides-reference.part1";
import { TOOL_SEO_OVERRIDES_REFERENCE_PART2 } from "./tool-seo-overrides-reference.part2";


export const TOOL_SEO_OVERRIDES_REFERENCE: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_REFERENCE_PART1,
  ...TOOL_SEO_OVERRIDES_REFERENCE_PART2,
  "conversor-cucharadas-ml": {
    about: [],
    aboutEs: [
      "Convierte cucharadas y cucharaditas a mililitros. La cucharada de EE. UU. mide 14,7868 ml, la métrica 15 ml y la australiana 20 ml; revisa cuál usa tu receta.",
      "1 cucharada equivale a 3 cucharaditas y 16 cucharadas de EE. UU. forman 1 taza (236,59 ml).",
    ],
    steps: [],
    stepsEs: ["Escribe la cantidad de cucharadas o cucharaditas.", "Elige la unidad de origen.", "Lee el resultado en mililitros."],
    faq: [
      { q: "How many ml is 1 tablespoon?", a: "1 US tablespoon = 14.79 ml; 1 metric tablespoon = 15 ml; 1 Australian tablespoon = 20 ml." },
      { q: "How many teaspoons are in a tablespoon?", a: "3 teaspoons. A US teaspoon is 4.93 ml, a metric one 5 ml." },
      { q: "How many tablespoons are in a cup?", a: "16 US tablespoons make 1 US cup (236.59 ml)." },
      { q: "How many tablespoons is 100 ml?", a: "About 6.76 US tablespoons, or 6.67 metric tablespoons." },
    ],
    faqEs: [
      { q: "¿Cuántos ml tiene 1 cucharada?", a: "1 cucharada de EE. UU. = 14,79 ml; 1 métrica = 15 ml; 1 australiana = 20 ml." },
      { q: "¿Cuántas cucharaditas tiene una cucharada?", a: "3 cucharaditas. La cucharadita de EE. UU. mide 4,93 ml y la métrica 5 ml." },
      { q: "¿Cuántas cucharadas tiene una taza?", a: "16 cucharadas de EE. UU. forman 1 taza de EE. UU. (236,59 ml)." },
      { q: "¿Cuántas cucharadas son 100 ml?", a: "Unas 6,76 cucharadas de EE. UU., o 6,67 cucharadas métricas." },
    ],
  },
};
