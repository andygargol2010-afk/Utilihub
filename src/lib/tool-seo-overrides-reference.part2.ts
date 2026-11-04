// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_REFERENCE, split from tool-seo-overrides-reference.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_REFERENCE_PART2: Record<string, ToolSeoOverride> = {  "conversor-kg-libras": {
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
};
