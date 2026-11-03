/** FAQ and Spanish guide for converters with GSC impressions but poor position (task 18, 2026-11-03). */
// EN about/steps stay empty so resolvedToolSeo keeps the catalog copy. Never rewrite this file wholesale.
import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_REFERENCE: Record<string, ToolSeoOverride> = {
  "conversor-onzas-gramos": {
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
  "conversor-kg-libras": {
    about: [],
    aboutEs: [
      "Convierte kilogramos a libras y libras a kilogramos. La libra internacional se define como 0,45359237 kg exactos, así que 1 kg = 2,20462262 lb.",
      "Útil para pesos corporales, equipaje, recetas y equipamiento de gimnasio que vienen en libras.",
    ],
    steps: [],
    stepsEs: ["Escribe el peso en kilogramos (o en libras para el camino inverso).", "Lee el resultado convertido al instante.", "Redondea según el uso: 1 decimal para peso corporal, 2 para cocina."],
    faq: [
      { q: "How many pounds are in a kilogram?", a: "1 kg = 2.20462262 lb, commonly rounded to 2.2 lb." },
      { q: "How do I convert lbs to kg?", a: "Multiply pounds by 0.45359237 (or divide by 2.2046). 150 lb = 68.04 kg." },
      { q: "Why is it written lbs?", a: "lb comes from the Latin libra; lbs is an informal plural. Both mean the same unit." },
      { q: "What is a stone in kg?", a: "1 stone = 14 lb = 6.35 kg. It is still used in the UK for body weight." },
    ],
    faqEs: [
      { q: "¿Cuántas libras tiene un kilo?", a: "1 kg = 2,20462262 lb; se suele redondear a 2,2 lb." },
      { q: "¿Cómo paso de libras a kilos?", a: "Multiplica las libras por 0,45359237 (o divide por 2,2046). 150 lb = 68,04 kg." },
      { q: "¿Por qué se escribe lbs?", a: "lb viene del latín libra; lbs es un plural informal. Ambos son la misma unidad." },
      { q: "¿Cuántos kilos es un stone?", a: "1 stone = 14 lb = 6,35 kg. Se usa todavía en el Reino Unido para el peso corporal." },
    ],
  },
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
