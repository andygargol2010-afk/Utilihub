// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_BASE_B, split from tool-seo-overrides-base-b.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideBase } from "./tool-seo-overrides-base-a";

export const TOOL_SEO_OVERRIDES_BASE_B_PART1: Record<string, ToolSeoOverrideBase> = {  "edad-exacta": {
    metaTitle: "Age Calculator — Exact Years, Months, Days | UtiliHub",
    metaTitleEs: "Calculadora de edad exacta online | UtiliHub",
    metaDescription:
      "Calculate exact age from a birth date: years, months, and days. Free age calculator, no signup.",
    metaDescriptionEs:
      "Calculá la edad exacta desde la fecha de nacimiento: años, meses y días. Gratis, sin registro.",
    about: [
      "An age calculator subtracts a birth date from today (or another reference date) and expresses the result in years, months, and days.",
      "Useful for forms, eligibility checks, and personal milestones. Calendar quirks (month lengths, leap years) are handled by standard date arithmetic in the browser.",
      "Legal age definitions can depend on local rules (e.g. turns 18 at the beginning of the day). When in doubt, confirm with the authority that requested the age.",
    ],
    aboutEs: [
      "Una calculadora de edad resta la fecha de nacimiento a hoy (u otra fecha de referencia) y expresa el resultado en años, meses y días.",
      "Sirve para formularios, requisitos de edad y fechas personales. Los meses de distinta duración y los años bisiestos los resuelve la aritmética de fechas del navegador.",
      "La definición legal de edad puede depender de normas locales. Si hay duda, confirmá con quien pidió el dato.",
    ],
    steps: [
      "Enter the date of birth.",
      "Optionally set a reference date (defaults to today).",
      "Read age in years, months, and days.",
    ],
    stepsEs: [
      "Ingresá la fecha de nacimiento.",
      "Opcionalmente elegí una fecha de referencia (por defecto hoy).",
      "Leé la edad en años, meses y días.",
    ],
    faq: [
      {
        q: "Why do results differ by a day?",
        a: "Time zones and whether the current day counts as completed can shift day-level results. For legal deadlines, use the official rule, not only a web calculator.",
      },
      {
        q: "Can I calculate age on a past or future date?",
        a: "Yes—set the reference date to the day you care about (event, exam, contract).",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué a veces difiere un día?",
        a: "Zonas horarias y si el día actual ya cuenta como cumplido pueden mover el resultado. En plazos legales, usá la norma oficial.",
      },
      {
        q: "¿Puedo calcular la edad en otra fecha?",
        a: "Sí: poné la fecha de referencia en el día del evento, examen o contrato.",
      },
    ],
  },
};
