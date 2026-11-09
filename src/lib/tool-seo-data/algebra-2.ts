// TOOL_SEO_OVERRIDES_ALGEBRA part 2 — split out of ../tool-seo-overrides-algebra.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideAlgebra } from "../tool-seo-overrides-algebra";
import { TOOL_SEO_OVERRIDES_ALGEBRA_2_PART1 } from "./algebra-2.part1";
import { TOOL_SEO_OVERRIDES_ALGEBRA_2_PART2 } from "./algebra-2.part2";


export const TOOL_SEO_OVERRIDES_ALGEBRA_2: Record<string, ToolSeoOverrideAlgebra> = {
  ...TOOL_SEO_OVERRIDES_ALGEBRA_2_PART1,
  ...TOOL_SEO_OVERRIDES_ALGEBRA_2_PART2,
  "pendiente-dos-puntos": {
    metaTitle: "Slope From Two Points Calculator — m and Line Equation | UtiliHub",
    metaTitleEs: "Calculadora de pendiente entre dos puntos — m y ecuación | UtiliHub",
    metaDescription:
      "Find slope m=(y₂−y₁)/(x₂−x₁) plus point-slope and slope-intercept forms. Detects vertical lines.",
    metaDescriptionEs:
      "Obtené m=(y₂−y₁)/(x₂−x₁) más las formas punto-pendiente y pendiente-ordenada. Detecta rectas verticales.",
    about: [
      "Slope is rise over run between two distinct points on a line.",
      "The tool also writes point-slope and y=mx+b forms when the slope is defined.",
      "Matching x-coordinates produce a vertical line with undefined slope.",
    ],
    aboutEs: [
      "La pendiente es el cociente de subida entre corrida entre dos puntos de una recta.",
      "También escribe las formas punto-pendiente y y=mx+b cuando m está definida.",
      "Si las x coinciden, la recta es vertical y la pendiente es indefinida.",
    ],
    steps: [
      "Enter (x₁,y₁) and (x₂,y₂).",
      "Calculate slope and line equations.",
      "Watch for the vertical-line case when x₁=x₂.",
    ],
    stepsEs: [
      "Ingresá (x₁,y₁) y (x₂,y₂).",
      "Calculá la pendiente y las ecuaciones de la recta.",
      "Atención al caso vertical cuando x₁=x₂.",
    ],
    faq: [
      { q: "Horizontal line?", a: "Equal y values → m = 0 and y equals that constant." },
      { q: "Undefined slope?", a: "Equal x values → vertical line x = constant." },
    ],
    faqEs: [
      { q: "¿Recta horizontal?", a: "Igual y → m = 0 e y constante." },
      { q: "¿Pendiente indefinida?", a: "Igual x → recta vertical x = constante." },
    ],
  },
};
