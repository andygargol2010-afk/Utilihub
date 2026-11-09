import type { ToolSeoOverride } from "./tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_CTR_BATCH1_PART1 } from "./tool-seo-overrides-ctr-batch1.part1";
import { TOOL_SEO_OVERRIDES_CTR_BATCH1_PART2 } from "./tool-seo-overrides-ctr-batch1.part2";


/**
 * CTR Phase A batch 1 — spread right after CTR in tool-seo-overrides.ts. Keys that also live in
 * WATER_CONSUMPTION / RANK6 / RANK7 (richer content) are shadowed there; combustible-necesario wins here.
 */
export const TOOL_SEO_OVERRIDES_CTR_BATCH1: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_CTR_BATCH1_PART1,
  ...TOOL_SEO_OVERRIDES_CTR_BATCH1_PART2,
  "calculadora-consumo-agua": {
    metaTitle: "Water Consumption Calculator — Liters × Days | UtiliHub",
    metaTitleEs: "Calculadora de consumo de agua — litros × días | UtiliHub",
    metaDescription:
      "Total water use from daily liters × days (e.g. 150 L × 30 = 4,500 L). Free water consumption calculator, no signup.",
    metaDescriptionEs:
      "Consumo total de agua: litros diarios × días (ej. 150 L × 30 = 4.500 L). Gratis, sin registro.",
    about: [
      "Multiplies daily consumption in liters by the number of days for a period total.",
      "Useful for household planning and comparing usage across months.",
    ],
    aboutEs: [
      "Multiplica el consumo diario en litros por la cantidad de días del período.",
      "Útil para planificar el hogar y comparar meses.",
    ],
    steps: [
      "Enter liters per day.",
      "Enter number of days.",
      "Read total liters for the period.",
    ],
    stepsEs: [
      "Ingresá litros por día.",
      "Ingresá la cantidad de días.",
      "Leé el total de litros del período.",
    ],
    faq: [
      {
        q: "How is it calculated?",
        a: "Total = liters per day × number of days.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula?",
        a: "Total = litros por día × cantidad de días.",
      },
    ],
  },
  "consumo-agua": {
    metaTitle: "Water Consumption Calculator — Liters × Days | UtiliHub",
    metaTitleEs: "Calculadora de consumo de agua — litros × días | UtiliHub",
    metaDescription:
      "Total water use from daily liters × days (e.g. 150 L × 30 = 4,500 L). Free water consumption calculator, no signup.",
    metaDescriptionEs:
      "Consumo total de agua: litros diarios × días (ej. 150 L × 30 = 4.500 L). Gratis, sin registro.",
    about: [
      "Multiplies daily consumption in liters by the number of days for a period total.",
    ],
    aboutEs: [
      "Multiplica el consumo diario en litros por la cantidad de días del período.",
    ],
    steps: [
      "Enter liters per day.",
      "Enter number of days.",
      "Read total liters.",
    ],
    stepsEs: [
      "Ingresá litros por día.",
      "Ingresá días.",
      "Leé el total.",
    ],
    faq: [],
  },
  "combustible-necesario": {
    metaTitle: "Fuel Needed Calculator – Distance × L/100 km | UtiliHub",
    metaTitleEs: "Calculadora de combustible — distancia × L/100 km | UtiliHub",
    metaDescription:
      "Estimate liters needed from distance and L/100 km (e.g. 300 km at 7 L/100 km = 21 L). Free fuel calculator, no signup.",
    metaDescriptionEs:
      "Estimá litros según distancia y L/100 km (ej. 300 km a 7 L/100 km → 21 L). Gratis, sin registro.",
    about: [
      "Fuel needed ≈ distance (km) × consumption (L/100 km) / 100.",
      "Helps plan trips from a known average consumption.",
    ],
    aboutEs: [
      "Combustible ≈ distancia (km) × consumo (L/100 km) / 100.",
      "Sirve para planificar viajes con un consumo medio conocido.",
    ],
    steps: [
      "Enter distance in km.",
      "Enter consumption in L/100 km.",
      "Read liters required.",
    ],
    stepsEs: [
      "Ingresá la distancia en km.",
      "Ingresá el consumo en L/100 km.",
      "Leé los litros necesarios.",
    ],
    faq: [
      {
        q: "What units?",
        a: "Distance in kilometers and consumption in liters per 100 km.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué unidades?",
        a: "Distancia en kilómetros y consumo en litros cada 100 km.",
      },
    ],
  },
};
