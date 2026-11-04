/** SEO-growth overrides part a2 (aspect ratio, ideal weight, due date). */
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";
import { TOOL_SEO_OVERRIDES_GROWTH_A2_PART1 } from "./tool-seo-overrides-growth-a2.part1";
import { TOOL_SEO_OVERRIDES_GROWTH_A2_PART2 } from "./tool-seo-overrides-growth-a2.part2";


export const TOOL_SEO_OVERRIDES_GROWTH_A2: Record<string, ToolSeoOverrideGrowth> = {
  ...TOOL_SEO_OVERRIDES_GROWTH_A2_PART1,
  ...TOOL_SEO_OVERRIDES_GROWTH_A2_PART2,

  "fecha-parto": {
    metaTitle: "Due Date Calculator — Naegele from LMP | UtiliHub",
    metaTitleEs: "Calculadora de fecha de parto (regla de Naegele) | UtiliHub",
    metaDescription:
      "Estimate the due date from the first day of the last menstrual period by adding 280 days (Naegele’s rule).",
    metaDescriptionEs:
      "Estimá la fecha probable de parto desde el primer día de la última menstruación sumando 280 días (regla de Naegele).",
    about: [
      "Naegele’s rule approximates the estimated due date (EDD) as about 280 days after the first day of the last menstrual period (LMP).",
      "Ultrasound dating can revise the EDD. Cycle length, ovulation timing, and medical history all affect accuracy.",
      "This is a calendar helper only—not prenatal care. Confirm dates with a qualified clinician.",
    ],
    aboutEs: [
      "La regla de Naegele aproxima la fecha probable de parto (FPP) como unos 280 días después del primer día de la última menstruación (FUM).",
      "La ecografía puede corregir la FPP. La duración del ciclo, la ovulación y la historia clínica influyen en la precisión.",
      "Es solo una ayuda de calendario, no control prenatal. Confirmá fechas con un profesional de la salud.",
    ],
    steps: [
      "Enter the LMP date as YYYY-MM-DD.",
      "Calculate the estimated due date (+280 days).",
      "Bring the estimate to your care provider for confirmation.",
    ],
    stepsEs: [
      "Ingresá la FUM como AAAA-MM-DD.",
      "Calculá la FPP estimada (+280 días).",
      "Llevá la estimación a tu profesional de salud para confirmarla.",
    ],
    faq: [
      {
        q: "What if cycles are irregular?",
        a: "LMP-based dates are less reliable; ultrasound is usually preferred for dating.",
      },
      {
        q: "Conception date instead?",
        a: "If you know conception timing, clinicians may date from that event rather than LMP—this tool follows the LMP+280 convention.",
      },
    ],
    faqEs: [
      {
        q: "¿Ciclos irregulares?",
        a: "Las fechas por FUM son menos fiables; suele preferirse la ecografía para datar.",
      },
      {
        q: "¿Fecha de concepción?",
        a: "Si se conoce la concepción, el equipo médico puede datar desde ahí; esta tool sigue FUM+280.",
      },
    ],
  },
};
