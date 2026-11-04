// TOOL_SEO_OVERRIDES_PERCENT part 2 — split out of ../tool-seo-overrides-percent.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverridePercent } from "../tool-seo-overrides-percent";
import { TOOL_SEO_OVERRIDES_PERCENT_2_PART1 } from "./percent-2.part1";
import { TOOL_SEO_OVERRIDES_PERCENT_2_PART2 } from "./percent-2.part2";


export const TOOL_SEO_OVERRIDES_PERCENT_2: Record<string, ToolSeoOverridePercent> = {
  ...TOOL_SEO_OVERRIDES_PERCENT_2_PART1,
  ...TOOL_SEO_OVERRIDES_PERCENT_2_PART2,
  "tiempo-duplicacion": {
    metaTitle: "Doubling Time Calculator — Growth Rate to Periods | UtiliHub",
    metaTitleEs: "Calculadora de tiempo de duplicación — tasa a periodos | UtiliHub",
    metaDescription:
      "Exact doubling time from a constant growth rate: ln(2)/ln(1+r/100). Includes rule-of-72 comparison.",
    metaDescriptionEs:
      "Tiempo de duplicación exacto con tasa constante: ln(2)/ln(1+r/100). Incluye comparación con la regla del 72.",
    about: [
      "Doubling time asks how many periods until a quantity multiplies by two at a steady percent rate.",
      "The exact formula uses natural logs; the rule of 72 is a fast mental estimate shown alongside.",
      "The period unit must match how the rate was measured (per year, per month, etc.).",
    ],
    aboutEs: [
      "El tiempo de duplicación pregunta cuántos periodos faltan para multiplicar por dos a una tasa constante.",
      "La fórmula exacta usa logaritmos naturales; la regla del 72 es la estimación rápida que mostramos al lado.",
      "La unidad del periodo debe coincidir con cómo mediste la tasa (año, mes, etc.).",
    ],
    steps: [
      "Enter growth rate as percent per period.",
      "Calculate periods to double.",
      "Compare with the rule-of-72 approximation.",
    ],
    stepsEs: [
      "Ingresá la tasa de crecimiento en % por periodo.",
      "Calculá los periodos para duplicar.",
      "Compará con la aproximación de la regla del 72.",
    ],
    faq: [
      { q: "Rule of 72 accuracy?", a: "It is close for mid-single-digit rates; this tool’s log formula is exact under constant growth." },
      { q: "Negative rates?", a: "Decline has no doubling time — the rate must be positive." },
    ],
    faqEs: [
      { q: "¿Qué tan precisa es la regla del 72?", a: "Aproxima bien en tasas de un dígito medio; la fórmula logarítmica es exacta con crecimiento constante." },
      { q: "¿Tasas negativas?", a: "La caída no tiene tiempo de duplicación: la tasa debe ser positiva." },
    ],
  },
};
