// TOOL_SEO_OVERRIDES_PERCENT part 1 — split out of ../tool-seo-overrides-percent.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverridePercent } from "../tool-seo-overrides-percent";
import { TOOL_SEO_OVERRIDES_PERCENT_1_PART1 } from "./percent-1.part1";
import { TOOL_SEO_OVERRIDES_PERCENT_1_PART2 } from "./percent-1.part2";


export const TOOL_SEO_OVERRIDES_PERCENT_1: Record<string, ToolSeoOverridePercent> = {
  ...TOOL_SEO_OVERRIDES_PERCENT_1_PART1,
  ...TOOL_SEO_OVERRIDES_PERCENT_1_PART2,
  "diferencia-porcentual": {
    metaTitle: "Percentage Difference Calculator — Symmetric Comparison | UtiliHub",
    metaTitleEs: "Calculadora de diferencia porcentual — comparación simétrica | UtiliHub",
    metaDescription:
      "Symmetric percentage difference of two values versus their average. Free peer-comparison tool.",
    metaDescriptionEs:
      "Diferencia porcentual simétrica entre dos valores respecto a su promedio. Herramienta gratis.",
    about: [
      "Percentage difference treats both numbers as peers by dividing the gap by their midpoint.",
      "Swapping A and B does not change the result — unlike percentage change, which needs a baseline.",
      "Use it for lab replicates, competing quotes, or any pair without a clear “before” value.",
    ],
    aboutEs: [
      "La diferencia porcentual trata ambos números como pares al dividir la brecha por el punto medio.",
      "Intercambiar A y B no cambia el resultado, a diferencia del cambio porcentual.",
      "Útil en réplicas de laboratorio, cotizaciones rivales o pares sin un “antes” claro.",
    ],
    steps: [
      "Enter value A and value B.",
      "Calculate to get the percentage difference.",
      "Prefer percentage change if one value is the official baseline.",
    ],
    stepsEs: [
      "Ingresá el valor A y el valor B.",
      "Calculá la diferencia porcentual.",
      "Preferí el cambio porcentual si uno de los valores es la base oficial.",
    ],
    faq: [
      { q: "Why the average in the denominator?", a: "The midpoint keeps the measure symmetric for unordered pairs." },
      { q: "Both zero?", a: "Undefined — there is no scale to compare." },
    ],
    faqEs: [
      { q: "¿Por qué el promedio en el denominador?", a: "El punto medio mantiene la medida simétrica para pares sin orden." },
      { q: "¿Ambos en cero?", a: "Indefinido: no hay escala para comparar." },
    ],
  },
  "porcentaje-de-porcentaje": {
    metaTitle: "Percent of a Percent Calculator — Multiply Two Rates | UtiliHub",
    metaTitleEs: "Calculadora porcentaje de un porcentaje — producto de tasas | UtiliHub",
    metaDescription:
      "What is 30% of 40%? Multiply percentage rates correctly (result: 12%). Free stacked-percent tool.",
    metaDescriptionEs:
      "¿Cuánto es 30% de 40%? Multiplicá tasas porcentuales bien (resultado: 12%). Herramienta gratis.",
    about: [
      "Stacked percentages multiply as decimals: 30% of 40% is 0.12 of the whole, written 12%.",
      "People often add rates by mistake (30+40=70). This calculator prevents that error.",
      "An example card scales the combined rate onto a base of 1000 for intuition.",
    ],
    aboutEs: [
      "Los porcentajes encadenados se multiplican en decimal: 30% de 40% es 0,12 del total (12%).",
      "Es habitual sumar por error (30+40=70). Esta calculadora evita ese fallo.",
      "Una tarjeta de ejemplo aplica la tasa combinada sobre una base de 1000.",
    ],
    steps: [
      "Enter the first percent and the second percent.",
      "Calculate the combined percent of the whole.",
      "Use the example-on-1000 card to sanity-check magnitude.",
    ],
    stepsEs: [
      "Ingresá el primer y el segundo porcentaje.",
      "Calculá el porcentaje combinado del total.",
      "Usá el ejemplo sobre 1000 para validar la magnitud.",
    ],
    faq: [
      { q: "Compound interest?", a: "No — this multiplies two static rates, not growth over periods." },
      { q: "Does order matter?", a: "No for the product of two rates." },
    ],
    faqEs: [
      { q: "¿Es interés compuesto?", a: "No: multiplica dos tasas fijas, no un crecimiento por periodos." },
      { q: "¿Importa el orden?", a: "No para el producto de dos tasas." },
    ],
  },
};
