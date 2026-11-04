// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_PERCENT_2, split from percent-2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverridePercent } from "../tool-seo-overrides-percent";

export const TOOL_SEO_OVERRIDES_PERCENT_2_PART1: Record<string, ToolSeoOverridePercent> = {  "porcentaje-hasta-meta": {
    metaTitle: "Percent to Goal Calculator — Progress & Remaining | UtiliHub",
    metaTitleEs: "Calculadora de porcentaje de avance — % de meta y lo que falta | UtiliHub",
    metaDescription:
      "Track progress toward a target: percent complete, percent left, and units still needed. Free goal tracker math.",
    metaDescriptionEs:
      "Calculá el porcentaje de avance de una meta: % completado, % que falta y unidades restantes. Ideal para ventas, ahorro y proyectos. Gratis, sin registro.",
    about: [
      "Goal progress is current divided by target, shown as a percent. Remaining units are target minus current when positive.",
      "Fundraising thermometers, sales quotas, and savings goals all use this framing.",
      "Overshooting the goal reports progress above 100% so you can see excess clearly.",
    ],
    aboutEs: [
      "El porcentaje de avance (o porcentaje hasta la meta) responde: ¿qué tanto de mi objetivo ya cumplí? La fórmula es (actual ÷ meta) × 100.",
      "Ejemplo: meta de 10.000 y vas por 4.200 → (4.200 ÷ 10.000) × 100 = 42%. Faltan 5.800 unidades, o sea el 58% pendiente.",
      "Sirve para cuotas de ventas, recaudaciones, metas de ahorro, avance de un proyecto o “qué porcentaje llevo” de cualquier cantidad.",
      "Si te pasás de la meta, el resultado supera el 100% y el restante queda en 0: ves el excedente sin inventar números.",
    ],
    steps: [
      "Enter current amount and goal amount.",
      "Calculate progress and remaining.",
      "Adjust inputs as the real-world total updates.",
    ],
    stepsEs: [
      "Ingresá la cantidad actual (lo ya logrado) y la meta (el total planificado).",
      "Leé el porcentaje de avance, las unidades que faltan y el % pendiente.",
      "Actualizá el valor actual cuando cambie el progreso real.",
    ],
    faq: [
      { q: "Zero goal?", a: "Not allowed — pick a positive target." },
      { q: "Negative current?", a: "Mathematically allowed; unusual for most progress UIs." },
    ],
    faqEs: [
      {
        q: "¿Cómo sacar el porcentaje de avance de una cantidad?",
        a: "Dividí lo ejecutado entre el total planificado y multiplicá por 100: % = (actual ÷ meta) × 100. Ejemplo: 175 de 500 → 35%.",
      },
      {
        q: "¿Cómo calcular cuánto falta para la meta?",
        a: "En unidades: meta − actual. En porcentaje: 100 − % de avance. Con meta 10.000 y actual 4.200 faltan 5.800 (58%).",
      },
      {
        q: "¿Qué es el porcentaje hasta la meta?",
        a: "Es el mismo cálculo que el porcentaje de avance o de progreso: mide qué fracción del objetivo ya alcanzaste.",
      },
      {
        q: "¿Puede superar el 100%?",
        a: "Sí. Si el actual es mayor que la meta, el progreso queda por encima de 100% y el restante en 0 para mostrar el excedente.",
      },
      {
        q: "¿Meta en cero?",
        a: "No permitido: elegí una meta positiva. Dividir por cero no está definido.",
      },
    ],
  },
};
