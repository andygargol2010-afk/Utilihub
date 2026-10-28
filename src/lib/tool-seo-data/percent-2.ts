// TOOL_SEO_OVERRIDES_PERCENT part 2 — split out of ../tool-seo-overrides-percent.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverridePercent } from "../tool-seo-overrides-percent";

export const TOOL_SEO_OVERRIDES_PERCENT_2: Record<string, ToolSeoOverridePercent> = {
  "porcentaje-hasta-meta": {
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
  "fraccion-a-porcentaje": {
    metaTitle: "Fraction to Percent Calculator — a/b → % | UtiliHub",
    metaTitleEs: "Calculadora fracción a porcentaje — a/b → % | UtiliHub",
    metaDescription:
      "Convert any fraction to a percentage: (numerator ÷ denominator) × 100. Free fraction-to-percent tool.",
    metaDescriptionEs:
      "Convertí cualquier fracción a porcentaje: (numerador ÷ denominador) × 100. Gratis.",
    about: [
      "Fractions map to percents by dividing and scaling by 100 — 3/4 is 75%, 5/4 is 125%.",
      "Teachers and students use this bridge between ratio form and the percent language of reports.",
      "Denominator zero is rejected; improper fractions are fully supported.",
    ],
    aboutEs: [
      "Las fracciones pasan a porcentaje dividiendo y multiplicando por 100: 3/4 es 75%, 5/4 es 125%.",
      "Une la forma de razón con el lenguaje porcentual de informes y exámenes.",
      "Denominador cero se rechaza; las fracciones impropias están soportadas.",
    ],
    steps: [
      "Enter numerator and denominator.",
      "Calculate the percentage and decimal.",
      "Simplify offline if you need lowest terms.",
    ],
    stepsEs: [
      "Ingresá numerador y denominador.",
      "Calculá el porcentaje y el decimal.",
      "Simplificá aparte si necesitás términos mínimos.",
    ],
    faq: [
      { q: "Decimals in the fraction?", a: "Yes — non-integer parts are accepted in either field." },
      { q: "Mixed numbers?", a: "Convert to an improper fraction first (1 1/2 → 3/2)." },
    ],
    faqEs: [
      { q: "¿Decimales en la fracción?", a: "Sí: se aceptan partes no enteras en ambos campos." },
      { q: "¿Números mixtos?", a: "Pasá primero a fracción impropia (1 1/2 → 3/2)." },
    ],
  },
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
