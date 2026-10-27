import type { ToolSeoOverride } from "./tool-seo-overrides";

/**
 * CTR Phase A batch 1 — spread right after CTR in tool-seo-overrides.ts. Keys that also live in
 * WATER_CONSUMPTION / RANK6 / RANK7 (richer content) are shadowed there; combustible-necesario wins here.
 */
export const TOOL_SEO_OVERRIDES_CTR_BATCH1: Record<string, ToolSeoOverride> = {
  "conversor-de-unidades": {
    metaTitle: "Unit Converter Online — Length, Weight, Temp | UtiliHub",
    metaTitleEs: "Conversor de unidades online — longitud, peso, temp | UtiliHub",
    metaDescription:
      "Convert length, weight, temperature, volume, area and time instantly. Standard factors, works offline in your browser, free.",
    metaDescriptionEs:
      "Convertí longitud, peso, temperatura, volumen, área y tiempo al instante. Factores estándar, en el navegador, gratis.",
    about: [
      "A unit converter applies internationally defined factors between metric and common imperial units.",
      "Pick the quantity (length, mass, temperature, volume, area or time), enter a value, and choose source and target units.",
      "Results are for practical use; display may round while underlying factors stay exact where defined.",
    ],
    aboutEs: [
      "Un conversor de unidades aplica factores definidos internacionalmente entre el sistema métrico y unidades imperiales habituales.",
      "Elegí la magnitud (longitud, masa, temperatura, volumen, área o tiempo), ingresá el valor y las unidades de origen y destino.",
      "Los resultados son prácticos; la pantalla puede redondear mientras los factores subyacentes siguen siendo exactos donde están definidos.",
    ],
    steps: [
      "Choose the quantity to convert.",
      "Enter the value and units.",
      "Read the result immediately.",
    ],
    stepsEs: [
      "Elegí la magnitud a convertir.",
      "Ingresá el valor y las unidades.",
      "Leé el resultado al instante.",
    ],
    faq: [
      {
        q: "Which quantities can I convert?",
        a: "Length, mass, temperature, volume, area and time.",
      },
      {
        q: "Is this unit converter free?",
        a: "Yes. It runs in the browser with no account.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué magnitudes puedo convertir?",
        a: "Longitud, masa, temperatura, volumen, área y tiempo.",
      },
      {
        q: "¿Es gratis?",
        a: "Sí. Corre en el navegador sin cuenta.",
      },
    ],
  },
  "calculadora-de-porcentajes": {
    metaTitle: "Percentage Calculator — Of, Change & Discount | UtiliHub",
    metaTitleEs: "Calculadora de porcentaje — de, cambio y descuento | UtiliHub",
    metaDescription:
      "Find % of a number, what % X is of Y, and % change or discount. Free percentage calculator with clear formulas, no signup.",
    metaDescriptionEs:
      "Calculá el % de un número, qué % es X de Y, y el cambio o descuento porcentual. Fórmulas claras, gratis, sin registro.",
    about: [
      "Covers the three everyday percentage cases: part of a whole, reverse percentage, and change between two values.",
      "Discount and markup are percentage-change problems with a clear base amount.",
    ],
    aboutEs: [
      "Cubre los tres casos habituales: parte de un total, porcentaje inverso y cambio entre dos valores.",
      "Descuento y recargo son cambios porcentuales con una base clara.",
    ],
    steps: [
      "Choose the calculation type.",
      "Enter the two numbers.",
      "Read the result and formula.",
    ],
    stepsEs: [
      "Elegí el tipo de cálculo.",
      "Ingresá los dos números.",
      "Leé el resultado y la fórmula.",
    ],
    faq: [
      {
        q: "How do I calculate a discount?",
        a: "Use percentage change from the original price to the final price.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calculo un descuento?",
        a: "Usá el cambio porcentual entre el precio original y el final.",
      },
    ],
  },
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
