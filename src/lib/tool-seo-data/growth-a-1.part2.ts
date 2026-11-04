// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH_A_1, split from growth-a-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "../tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_A_1_PART2: Record<string, ToolSeoOverrideGrowth> = {
  gpa: {
    metaTitle: "GPA Calculator — Weighted Grade Point Average | UtiliHub",
    metaTitleEs: "Calculadora de GPA (promedio ponderado) | UtiliHub",
    metaDescription:
      "Compute a credit-weighted GPA from grades and credit hours. Supports a second course entry for quick multi-class averages.",
    metaDescriptionEs:
      "Calculá un GPA ponderado por créditos a partir de notas y horas de crédito. Incluye una segunda materia para promedios rápidos.",
    about: [
      "GPA is usually the sum of (grade × credits) divided by total credits. Scales differ by school (4.0, 5.0, or 0–10); enter grades in the scale your institution uses.",
      "This tool weights each course by its credits so a 4-credit class counts more than a 1-credit seminar.",
      "Always confirm your registrar’s rounding rules—some schools truncate, others round to two or three decimals.",
    ],
    aboutEs: [
      "El GPA suele ser la suma de (nota × créditos) dividida por el total de créditos. La escala depende de la institución (4.0, 5.0 o 0–10).",
      "Esta herramienta pondera cada materia por sus créditos para que un curso de 4 créditos pese más que uno de 1.",
      "Confirmá las reglas de redondeo de tu facultad: algunas truncan y otras redondean a dos o tres decimales.",
    ],
    steps: [
      "Enter grade and credits for each course (optional second pair).",
      "Calculate the weighted GPA.",
      "Compare with your official transcript if numbers differ slightly due to rounding.",
    ],
    stepsEs: [
      "Ingresá nota y créditos de cada materia (segundo par opcional).",
      "Calculá el GPA ponderado.",
      "Compará con el historial oficial si hay pequeñas diferencias de redondeo.",
    ],
    faq: [
      {
        q: "Can I mix 4.0 and percentage grades?",
        a: "No—convert everything to one scale first, or the average is meaningless.",
      },
      {
        q: "Pass/fail courses?",
        a: "Usually excluded from GPA. Only graded courses with credits should be entered here.",
      },
    ],
    faqEs: [
      {
        q: "¿Puedo mezclar escala 4.0 y porcentajes?",
        a: "No: convertí todo a una sola escala primero o el promedio no tiene sentido.",
      },
      {
        q: "¿Cursos aprobado/desaprobado?",
        a: "Suelen quedar fuera del GPA. Solo ingresá materias con nota y créditos.",
      },
    ],
  },
};
