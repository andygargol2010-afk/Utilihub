// TOOL_SEO_OVERRIDES_RANK7 part 3 — split out of ../tool-seo-overrides-rank7.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RANK7_3: Record<string, ToolSeoOverride> = {
  "calculadora-edad": {
    metaTitle: "Age Calculator Free — Years, Months and Days | UtiliHub",
    metaTitleEs: "Calculadora de edad online gratis — años, meses y días | UtiliHub",
    metaDescription:
      "Calculate exact age from date of birth: years, months and days. Free age calculator, no signup.",
    metaDescriptionEs:
      "Calculá la edad exacta desde la fecha de nacimiento: años, meses y días. Calculadora de edad gratis, sin registro.",
    about: [
      "An age calculator subtracts the birth date from today (or another reference date) and expresses the result in years, months and days.",
      "It accounts for varying month lengths and leap years so the day count stays consistent with the calendar.",
      "Useful for forms, eligibility checks and “how old will I be on this date” questions.",
    ],
    aboutEs: [
      "Una calculadora de edad resta la fecha de nacimiento de hoy (u otra fecha de referencia) y expresa el resultado en años, meses y días.",
      "Tiene en cuenta la duración variable de los meses y los años bisiestos para que el conteo coincida con el calendario.",
      "Útil para formularios, requisitos de edad y preguntas del tipo “qué edad tendré en esta fecha”.",
    ],
    steps: [
      "Enter the date of birth.",
      "Optionally set a reference date (default: today).",
      "Read years, months and days of age.",
    ],
    stepsEs: [
      "Ingresá la fecha de nacimiento.",
      "Opcional: elegí una fecha de referencia (por defecto: hoy).",
      "Leé años, meses y días de edad.",
    ],
    faq: [
      {
        q: "How do I calculate age from date of birth?",
        a: "Subtract birth date from the reference date and convert the interval into years, months and remaining days.",
      },
      {
        q: "Does it handle leap years?",
        a: "Yes. Calendar rules including February 29 are applied.",
      },
      {
        q: "Is this age calculator free?",
        a: "Yes. It runs in the browser with no account.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calcular la edad a partir de la fecha de nacimiento?",
        a: "Restá la fecha de nacimiento de la fecha de referencia y convertí el intervalo en años, meses y días restantes.",
      },
      {
        q: "¿Tiene en cuenta años bisiestos?",
        a: "Sí. Se aplican las reglas del calendario, incluido el 29 de febrero.",
      },
      {
        q: "¿Hay calculadora de edad online gratis?",
        a: "Sí. Esta muestra años, meses y días en el navegador, sin registro.",
      },
    ],
  },
};
