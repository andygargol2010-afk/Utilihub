import type { ToolSeoOverride } from "./tool-seo-overrides";

/**
 * SEO rank pass #2: another 5 high-intent tools.
 * Spread after RANK5 so these win on their slugs.
 * Restored 2026-10-27 after accidental PLACEHOLDER wipe.
 */
export const TOOL_SEO_OVERRIDES_RANK6: Record<string, ToolSeoOverride> = {
  "calculadora-de-porcentajes": {
    metaTitle: "Percentage Calculator — Of, Change & Discount | UtiliHub",
    metaTitleEs: "Calculadora de porcentaje — de, cambio y descuento | UtiliHub",
    metaDescription:
      "Find % of a number, what % X is of Y, and % change or discount. Free percentage calculator with clear formulas, no signup.",
    metaDescriptionEs:
      "Calculá el % de un número, qué % es X de Y, y el cambio o descuento porcentual. Fórmulas claras, gratis, sin registro.",
    about: [
      "Covers the three everyday percentage cases: part of a whole, reverse percentage, and change between two values.",
      "Discount and markup are percentage-change problems with a clear base amount.",
    ],
    aboutEs: [
      "Cubre los tres casos habituales: parte de un total, porcentaje inverso y cambio entre dos valores.",
      "Descuento y recargo son cambios porcentuales con una base clara.",
    ],
    steps: [
      "Choose the calculation type.",
      "Enter the two numbers.",
      "Read the result and formula.",
    ],
    stepsEs: [
      "Elegí el tipo de cálculo.",
      "Ingresá los dos números.",
      "Leé el resultado y la fórmula.",
    ],
    faq: [
      {
        q: "How do I calculate a discount?",
        a: "Use percentage change from the original price to the final price.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calculo un descuento?",
        a: "Usá el cambio porcentual entre el precio original y el final.",
      },
    ],
  },
};
