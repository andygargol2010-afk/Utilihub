/** SEO-growth overrides part b3. */
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";
import { TOOL_SEO_OVERRIDES_GROWTH_B3_PART1 } from "./tool-seo-overrides-growth-b3.part1";
import { TOOL_SEO_OVERRIDES_GROWTH_B3_PART2 } from "./tool-seo-overrides-growth-b3.part2";


export const TOOL_SEO_OVERRIDES_GROWTH_B3: Record<string, ToolSeoOverrideGrowth> = {
  ...TOOL_SEO_OVERRIDES_GROWTH_B3_PART1,
  ...TOOL_SEO_OVERRIDES_GROWTH_B3_PART2,

  "crecimiento-periodico": {
    metaTitle: "Periodic Savings Calculator — Daily or Weekly Adds | UtiliHub",
    metaTitleEs: "Calculadora de ahorro periódico (diario o semanal) | UtiliHub",
    metaDescription:
      "Project a simple total if you add a fixed amount every day or every week for a number of years, plus a starting balance.",
    metaDescriptionEs:
      "Proyectá un total simple si sumás un monto fijo cada día o cada semana durante varios años, más un saldo inicial.",
    about: [
      "This model is linear contribution math: start + contribution × number of periods. It does not apply compound interest (use the compound-interest tool for that).",
      "Daily mode uses 365 periods per year; weekly mode uses 52. Leap days and exact calendar weeks are ignored for simplicity.",
      "Good for “what if I put aside $X a day” planning before you layer returns or inflation.",
    ],
    aboutEs: [
      "El modelo es lineal: inicio + aporte × cantidad de períodos. No aplica interés compuesto (para eso está la tool de interés compuesto).",
      "El modo diario usa 365 períodos por año; el semanal, 52. Se ignoran años bisiestos y semanas exactas por simplicidad.",
      "Sirve para planear “¿y si aparto $X al día?” antes de sumar rendimientos o inflación.",
    ],
    steps: [
      "Enter contribution, frequency, years, and optional starting balance.",
      "Project the total contributions and end balance.",
      "Compare with compound-interest tools if you earn a return.",
    ],
    stepsEs: [
      "Ingresá aporte, frecuencia, años y saldo inicial opcional.",
      "Proyectá aportes totales y saldo final.",
      "Compará con herramientas de interés compuesto si hay rendimiento.",
    ],
    faq: [
      {
        q: "Why not compound here?",
        a: "Keeping contributions separate from returns avoids mixing two questions. Stack tools when you need both.",
      },
      {
        q: "Monthly contributions?",
        a: "Approximate with weekly or scale the daily amount; a dedicated monthly compound tool covers rate-based growth.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué sin interés compuesto?",
        a: "Separar aportes de rendimientos evita mezclar dos preguntas. Combiná tools cuando necesites ambas.",
      },
      {
        q: "¿Aportes mensuales?",
        a: "Aproximá con semanal o escalá el monto diario; una tool de compuesto mensual cubre el crecimiento con tasa.",
      },
    ],
  },
};
