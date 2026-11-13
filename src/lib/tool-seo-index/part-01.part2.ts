// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_PART_01, split from part-01.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "../tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_GROWTH_B2 } from "../tool-seo-overrides-growth-b2";
import { TOOL_SEO_OVERRIDES_GROWTH_B3 } from "../tool-seo-overrides-growth-b3";
import { TOOL_SEO_OVERRIDES_GAP } from "../tool-seo-overrides-gap";
import { TOOL_SEO_OVERRIDES_GOOGLE_PATHS } from "../tool-seo-overrides-google-paths";
import { TOOL_SEO_OVERRIDES_PERCENT } from "../tool-seo-overrides-percent";
import { TOOL_SEO_OVERRIDES_ALGEBRA } from "../tool-seo-overrides-algebra";
import { TOOL_SEO_OVERRIDES_GEOMETRY } from "../tool-seo-overrides-geometry";
import { TOOL_SEO_OVERRIDES_ARITHMETIC } from "../tool-seo-overrides-arithmetic";
import { TOOL_SEO_OVERRIDES_SEQUENCE } from "../tool-seo-overrides-sequence";
import { TOOL_SEO_OVERRIDES_TRIG } from "../tool-seo-overrides-trig";

export const TOOL_SEO_OVERRIDES_PART_01_PART2: Record<string, ToolSeoOverride> = {  ...(TOOL_SEO_OVERRIDES_GROWTH_B2 as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_GROWTH_B3 as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_GAP as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_GOOGLE_PATHS as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_PERCENT as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_ALGEBRA as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_GEOMETRY as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_ARITHMETIC as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_SEQUENCE as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_TRIG as Record<string, ToolSeoOverride>),
  "calculadora-logaritmo": {
    metaTitle: "Logarithm Calculator — Any Base, Change of Base | UtiliHub",
    metaTitleEs: "Calculadora de logaritmos — cualquier base online | UtiliHub",
    metaDescription:
      "Calculate log of a number in any base with the change-of-base formula log_b(n) = ln(n)/ln(b). Base 10, e, 2 or custom. Free, in your browser.",
    metaDescriptionEs:
      "Calculá el logaritmo de un número en cualquier base con el cambio de base log_b(n) = ln(n)/ln(b). Base 10, e, 2 o personalizada. Gratis, en el navegador.",
    about: [
      "A logarithm answers the question: to what power must the base be raised to get the number? For example, log_2(8) = 3 because 2³ = 8.",
      "Calculators usually only offer base 10 and base e (natural log). Any other base is computed with the change-of-base formula: log_b(n) = ln(n) / ln(b).",
      "Logarithms with custom bases appear in information theory (base 2, bits), chemistry (pH, base 10), and algorithm analysis.",
    ],
    aboutEs: [
      "Un logaritmo responde: ¿a qué potencia hay que elevar la base para obtener el número? Por ejemplo, log_2(8) = 3 porque 2³ = 8.",
      "Las calculadoras suelen ofrecer solo base 10 y base e (logaritmo natural). Cualquier otra base se calcula con el cambio de base: log_b(n) = ln(n) / ln(b).",
      "Los logaritmos con base arbitraria aparecen en teoría de la información (base 2, bits), química (pH, base 10) y análisis de algoritmos.",
    ],
    steps: [
      "Enter the number (the argument of the logarithm).",
      "Enter the base (10, e, 2, or any value greater than 0 and different from 1).",
      "Read the result; it is computed with the change-of-base formula in your browser.",
    ],
    stepsEs: [
      "Ingresá el número (el argumento del logaritmo).",
      "Ingresá la base (10, e, 2, o cualquier valor mayor que 0 y distinto de 1).",
      "Leé el resultado; se calcula con el cambio de base en tu navegador.",
    ],
    faq: [
      {
        q: "How do I calculate a logarithm with any base?",
        a: "Use the change-of-base formula: log_b(n) = ln(n) / ln(b). Example: log_3(81) = ln(81)/ln(3) = 4.",
      },
      {
        q: "Which values are valid?",
        a: "The number must be positive and the base must be greater than 0 and different from 1. Otherwise the logarithm is undefined.",
      },
      {
        q: "What about log of 1 or of the base itself?",
        a: "log_b(1) = 0 for any valid base, and log_b(b) = 1. Those are quick sanity checks for the result.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula un logaritmo en cualquier base?",
        a: "Con el cambio de base: log_b(n) = ln(n) / ln(b). Ejemplo: log_3(81) = ln(81)/ln(3) = 4.",
      },
      {
        q: "¿Qué valores son válidos?",
        a: "El número debe ser positivo y la base mayor que 0 y distinta de 1. En otro caso el logaritmo no está definido.",
      },
      {
        q: "¿Y el logaritmo de 1 o de la propia base?",
        a: "log_b(1) = 0 para cualquier base válida, y log_b(b) = 1. Sirven como verificación rápida del resultado.",
      },
    ],
  },
};
