// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_BASE_A2, split from tool-seo-overrides-base-a2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideBase } from "./tool-seo-overrides-base-a";

export const TOOL_SEO_OVERRIDES_BASE_A2_PART1: Record<string, ToolSeoOverrideBase> = {  "conversor-de-temperatura": {
    metaTitle: "Temperature Converter — °C to °F to Kelvin Free | UtiliHub",
    metaTitleEs: "Conversor de temperatura online gratis (°C °F K) | UtiliHub",
    metaDescription:
      "Convert temperature instantly between Celsius, Fahrenheit, and Kelvin. Free online converter — no signup.",
    metaDescriptionEs:
      "Convertí temperatura al instante entre Celsius, Fahrenheit y Kelvin. Conversor online gratis, sin registro.",
    about: [
      "Temperature scales differ by region and science context: everyday weather often uses °C or °F, while science frequently uses Kelvin.",
      "This converter applies the standard linear relationships between the scales so you can switch units for cooking, travel, or lab notes without memorizing formulas.",
      "Kelvin is an absolute scale (0 K is absolute zero). Negative Kelvin values are not physical; the tool still shows the arithmetic if you enter edge cases.",
    ],
    aboutEs: [
      "Las escalas de temperatura cambian según el país y el contexto: el clima cotidiano usa °C o °F; en ciencia suele usarse Kelvin.",
      "Este conversor aplica las relaciones lineales estándar para pasar de una unidad a otra en cocina, viajes o notas de laboratorio.",
      "Kelvin es una escala absoluta (0 K es el cero absoluto). Valores negativos de Kelvin no son físicos; la herramienta igual muestra la cuenta si ingresás casos extremos.",
    ],
    steps: [
      "Enter a value in any supported unit.",
      "Read the equivalent in the other scales.",
      "Use the result for recipes, weather, or science notes.",
    ],
    stepsEs: [
      "Ingresá un valor en cualquier unidad soportada.",
      "Leé el equivalente en las otras escalas.",
      "Usá el resultado en recetas, clima o notas científicas.",
    ],
    faq: [
      {
        q: "How do I convert °C to °F?",
        a: "°F = (°C × 9/5) + 32. Example: 20°C → 68°F.",
      },
      {
        q: "What about Kelvin?",
        a: "K = °C + 273.15. Room temperature ≈ 293 K.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo paso de °C a °F?",
        a: "°F = (°C × 9/5) + 32. Ejemplo: 20°C → 68°F.",
      },
      {
        q: "¿Y Kelvin?",
        a: "K = °C + 273.15. Temperatura ambiente ≈ 293 K.",
      },
    ],
  },
};
