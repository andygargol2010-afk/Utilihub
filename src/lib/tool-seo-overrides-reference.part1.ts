// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_REFERENCE, split from tool-seo-overrides-reference.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_REFERENCE_PART1: Record<string, ToolSeoOverride> = {  "conversor-onzas-gramos": {
    about: [],
    aboutEs: [
      "Convierte onzas a gramos y gramos a onzas con el factor exacto: 1 onza avoirdupois = 28,349523125 g. Es la onza que usan las recetas y los envases de EE. UU. y el Reino Unido.",
      "No sirve para onzas líquidas (fl oz), que miden volumen: para eso está el conversor de onzas a ml.",
    ],
    steps: [],
    stepsEs: ["Escribe la cantidad en onzas.", "Lee el resultado en gramos al instante.", "Para el camino inverso, divide los gramos por 28,3495."],
    faq: [
      { q: "How many grams are in an ounce?", a: "1 ounce (avoirdupois) = 28.349523125 grams, usually rounded to 28.35 g." },
      { q: "How many grams is 16 oz?", a: "16 oz is 1 pound, which is 453.59 grams." },
      { q: "How do I convert grams to ounces?", a: "Divide grams by 28.3495. For example, 100 g ÷ 28.3495 = 3.53 oz." },
      { q: "Is a fluid ounce the same as an ounce?", a: "No. A fluid ounce measures volume (29.57 ml in the US). It only weighs about 29.6 g for water; other liquids differ." },
      { q: "What is a troy ounce?", a: "A troy ounce, used for gold and silver, is 31.1035 g, about 10 % heavier than a regular ounce." },
    ],
    faqEs: [
      { q: "¿Cuántos gramos tiene una onza?", a: "1 onza (avoirdupois) = 28,349523125 gramos; se redondea a 28,35 g." },
      { q: "¿Cuántos gramos son 16 onzas?", a: "16 onzas son 1 libra, es decir 453,59 gramos." },
      { q: "¿Cómo paso de gramos a onzas?", a: "Divide los gramos por 28,3495. Por ejemplo, 100 g ÷ 28,3495 = 3,53 oz." },
      { q: "¿La onza líquida es lo mismo que la onza?", a: "No. La onza líquida mide volumen (29,57 ml en EE. UU.). Solo en el agua pesa unos 29,6 g; otros líquidos varían." },
      { q: "¿Qué es una onza troy?", a: "La onza troy, usada para oro y plata, equivale a 31,1035 g, un 10 % más que la onza común." },
    ],
  },
};
