// TOOL_SEO_OVERRIDES part 04 — split out of ../tool-seo-overrides.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_ATTENDANCE } from "../tool-seo-overrides-attendance";
import { TOOL_SEO_OVERRIDES_HOURS } from "../tool-seo-overrides-hours";
import { TOOL_SEO_OVERRIDES_HARMONIC_MEAN } from "../tool-seo-overrides-harmonic-mean";
import { TOOL_SEO_OVERRIDES_SYLLABLES } from "../tool-seo-overrides-syllables";
import { TOOL_SEO_OVERRIDES_TEMPERATURE } from "../tool-seo-overrides-temperature";
import { TOOL_SEO_OVERRIDES_TRIP_FUEL } from "../tool-seo-overrides-trip-fuel";
import { TOOL_SEO_OVERRIDES_GSC_QUERIES } from "../tool-seo-overrides-gsc-queries";
import { TOOL_SEO_OVERRIDES_REFERENCE } from "../tool-seo-overrides-reference";
import { TOOL_SEO_OVERRIDES_WORK } from "../tool-seo-overrides-work";
import { TOOL_SEO_OVERRIDES_POWER } from "../tool-seo-overrides-power";

export const TOOL_SEO_OVERRIDES_PART_04: Record<string, ToolSeoOverride> = {
  "calculadora-bac": {
    metaTitle: "BAC Calculator — Estimate Blood Alcohol Content | UtiliHub",
    metaTitleEs: "Calculadora de alcoholemia (BAC) — fórmula de Widmark | UtiliHub",
    metaDescription:
      "Free BAC estimator. Enter number of standard drinks, body weight, gender and hours since first drink. Approximate Widmark calculation in the browser.",
    metaDescriptionEs:
      "Calculadora de alcoholemia gratis (BAC). Ingresá bebidas estándar, peso, sexo y horas desde la primera bebida para estimar el BAC con la fórmula de Widmark. Cálculo local, sin registro.",
    about: [
      "The BAC calculator estimates blood alcohol content with the Widmark formula from the number of standard drinks, body weight, gender, and hours elapsed since the first drink.",
      "The result is an approximation only: real BAC depends on food, metabolism, and drinking pace. Never use it to decide whether you can drive.",
    ],
    aboutEs: [
      "La calculadora de alcoholemia estima el BAC con la fórmula de Widmark a partir de bebidas estándar, peso corporal, sexo y horas transcurridas desde la primera bebida.",
      "El resultado es solo una aproximación: el BAC real depende de la comida, el metabolismo y el ritmo de consumo. Nunca lo uses para decidir si podés conducir.",
    ],
    steps: [
      "Enter how many standard drinks you had, your body weight, and your gender.",
      "Enter the hours elapsed since your first drink.",
      "Read the estimated BAC and the safety note; remember it is an estimate, not a measurement.",
    ],
    stepsEs: [
      "Ingresá cuántas bebidas estándar tomiste, tu peso corporal y tu sexo.",
      "Ingresá las horas transcurridas desde la primera bebida.",
      "Leé el BAC estimado y la advertencia: es un estimado, no una medición.",
    ],
    faq: [
      {
        q: "How accurate is this?",
        a: "This is a rough estimate only. Real BAC depends on many factors. Never use it to decide if you can drive.",
      },
      {
        q: "What is a standard drink?",
        a: "Approximately 14 grams of pure alcohol (one beer, one glass of wine, or one shot).",
      },
    ],
    faqEs: [
      {
        q: "¿Qué tan preciso es el resultado?",
        a: "Es solo un estimado aproximado. El BAC real depende de muchos factores. Nunca lo uses para decidir si podés conducir.",
      },
      {
        q: "¿Qué es una bebida estándar?",
        a: "Aproximadamente 14 gramos de alcohol puro (una cerveza, una copa de vino o un trago).",
      },
    ],
  },
  ...TOOL_SEO_OVERRIDES_ATTENDANCE,
  ...TOOL_SEO_OVERRIDES_HOURS,
  ...TOOL_SEO_OVERRIDES_HARMONIC_MEAN,
  ...TOOL_SEO_OVERRIDES_SYLLABLES,
  ...TOOL_SEO_OVERRIDES_TEMPERATURE,
  ...TOOL_SEO_OVERRIDES_TRIP_FUEL,
  ...TOOL_SEO_OVERRIDES_GSC_QUERIES,
  ...TOOL_SEO_OVERRIDES_REFERENCE,
  ...TOOL_SEO_OVERRIDES_WORK,
  ...TOOL_SEO_OVERRIDES_POWER,
};
