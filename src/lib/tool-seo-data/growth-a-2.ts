// TOOL_SEO_OVERRIDES_GROWTH_A part 2 — split out of ../tool-seo-overrides-growth-a.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideGrowth } from "../tool-seo-overrides-growth";
import { TOOL_SEO_OVERRIDES_GROWTH_A_2_PART1 } from "./growth-a-2.part1";
import { TOOL_SEO_OVERRIDES_GROWTH_A_2_PART2 } from "./growth-a-2.part2";


export const TOOL_SEO_OVERRIDES_GROWTH_A_2: Record<string, ToolSeoOverrideGrowth> = {
  ...TOOL_SEO_OVERRIDES_GROWTH_A_2_PART1,
  ...TOOL_SEO_OVERRIDES_GROWTH_A_2_PART2,

  fracciones: {
    metaTitle: "Fraction Calculator — Add Subtract Multiply Divide | UtiliHub",
    metaTitleEs: "Calculadora de fracciones — suma resta producto cociente | UtiliHub",
    metaDescription:
      "Add, subtract, multiply, or divide two fractions and simplify the result to lowest terms.",
    metaDescriptionEs:
      "Sumá, restá, multiplicá o dividí dos fracciones y simplificá el resultado a términos mínimos.",
    about: [
      "Fraction arithmetic uses common denominators for addition/subtraction and cross-multiplication rules for products and quotients.",
      "Results are reduced with the greatest common divisor so 2/4 becomes 1/2 automatically.",
      "Useful for homework checks, recipe scaling, and quick ratios without a full CAS.",
    ],
    aboutEs: [
      "La aritmética de fracciones usa denominadores comunes en suma/resta y reglas de producto y cociente.",
      "El resultado se reduce con el máximo común divisor: 2/4 pasa a 1/2.",
      "Sirve para deberes, recetas y ratios rápidos sin un sistema algebraico completo.",
    ],
    steps: [
      "Enter numerators and denominators for both fractions.",
      "Choose the operation code (add, subtract, multiply, divide).",
      "Read the simplified fraction and decimal form.",
    ],
    stepsEs: [
      "Ingresá numeradores y denominadores de ambas fracciones.",
      "Elegí la operación (suma, resta, producto, división).",
      "Leé la fracción simplificada y su forma decimal.",
    ],
    faq: [
      {
        q: "Zero denominators?",
        a: "They are rejected. A fraction must have a non-zero denominator.",
      },
      {
        q: "Mixed numbers?",
        a: "Convert mixed numbers to improper fractions first (e.g. 1 1/2 → 3/2).",
      },
    ],
    faqEs: [
      {
        q: "¿Denominador cero?",
        a: "Se rechaza. Toda fracción necesita denominador distinto de cero.",
      },
      {
        q: "¿Números mixtos?",
        a: "Convertí primero a fracción impropia (p. ej. 1 1/2 → 3/2).",
      },
    ],
  },
};
