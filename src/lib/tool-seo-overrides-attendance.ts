import type { ToolSeoOverride } from "./tool-seo-overrides";

/** SEO override for the attendance percentage calculator (educacion) — bilingual, non-generic. */
export const TOOL_SEO_OVERRIDES_ATTENDANCE: Record<string, ToolSeoOverride> = {
  "calculadora-porcentaje-asistencia": {
    metaTitle: "Attendance Percentage Calculator — Classes & Meetings | UtiliHub",
    metaTitleEs: "Calculadora de porcentaje de asistencia — Clases y reuniones | UtiliHub",
    metaDescription:
      "Free attendance percentage calculator for classes, school, or work meetings. Formula: (attended / total) × 100. Instant, browser-only, no signup.",
    metaDescriptionEs:
      "Calcula el porcentaje de asistencia a clases o reuniones con la fórmula (asistidas / totales) × 100. Gratis, sin registro y con ejemplos prácticos.",
    about: [
      "The attendance percentage compares the classes or meetings you attended with the total scheduled: (attended ÷ total) × 100.",
      "It is useful for school attendance requirements, course minimums, and work or team meeting tracking.",
      "The calculation runs entirely in your browser; nothing is sent to a server.",
    ],
    aboutEs: [
      "El porcentaje de asistencia compara las clases o reuniones a las que asististe con el total programado: (asistidas ÷ totales) × 100.",
      "Sirve para requisitos mínimos de asistencia escolar, corte de cursos y seguimiento de reuniones de trabajo o equipo.",
      "El cálculo corre por completo en tu navegador; no se envía nada a un servidor.",
    ],
    steps: [
      "Enter the total number of classes or meetings scheduled.",
      "Enter how many you attended.",
      "Read the attendance percentage instantly.",
    ],
    stepsEs: [
      "Ingresá el total de clases o reuniones programadas.",
      "Ingresá cuántas asististe.",
      "Leé el porcentaje de asistencia al instante.",
    ],
    faq: [
      {
        q: "How is attendance percentage calculated?",
        a: "Attended classes divided by total classes, times 100: (attended / total) × 100. Example: 18 attended out of 20 total = 90%.",
      },
      {
        q: "What if attended is greater than total?",
        a: "No result is shown. Attended must be between 0 and the total number of classes.",
      },
      {
        q: "Does a passing attendance threshold matter?",
        a: "Many schools require around 75–80% minimum. Compare your result with your institution's rule.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el porcentaje de asistencia?",
        a: "Clases asistidas divididas por el total, multiplicado por 100: (asistidas / totales) × 100. Ejemplo: 18 asistidas de 20 totales = 90%.",
      },
      {
        q: "¿Qué pasa si las asistidas son mayores que el total?",
        a: "No se muestra resultado. Las asistidas deben estar entre 0 y el total de clases.",
      },
      {
        q: "¿Qué asistencia mínima se exige normalmente?",
        a: "Muchas instituciones piden entre 75% y 80% de mínimo. Compará tu resultado con la regla de tu institución.",
      },
    ],
  },
};
