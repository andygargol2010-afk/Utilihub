import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_WATER_CONSUMPTION: Record<string, ToolSeoOverride> = {
  "consumo-agua": {
    metaTitle: "Water Consumption Calculator — Daily Liters × Days | UtiliHub",
    metaTitleEs: "Calculadora de consumo de agua — litros por día | UtiliHub",
    metaDescription:
      "Calculate total water use from daily consumption in liters and number of days. Example: 150 L per day for 30 days = 4500 L. Free, in the browser.",
    metaDescriptionEs:
      "Calculá el consumo total de agua a partir de los litros por día y la cantidad de días. Ejemplo: 150 L por día durante 30 días = 4500 L. Gratis, en el navegador.",
    about: [
      "Water consumption here is a simple product: daily use in liters multiplied by the number of days. The result is the total volume in liters.",
      "Enter your average daily consumption (from a bill, a meter, or a per-person estimate) and the period you want to cover: a week, a month, or a year.",
      "To compare with a utility bill in cubic meters, divide the liters by 1000: 4500 L is 4.5 m³. The calculation runs locally in the browser.",
    ],
    aboutEs: [
      "El consumo de agua es un producto simple: los litros diarios por la cantidad de días. El resultado es el volumen total en litros.",
      "Ingresá tu consumo diario promedio (de la factura, del medidor o de una estimación por persona) y el período a cubrir: una semana, un mes o un año.",
      "Para comparar con una factura en metros cúbicos, dividí los litros por 1000: 4500 L son 4,5 m³. El cálculo corre localmente en el navegador.",
    ],
    steps: [
      "Enter the daily consumption in liters.",
      "Enter the number of days.",
      "Read the total water use in liters.",
    ],
    stepsEs: [
      "Ingresá el consumo diario en litros.",
      "Ingresá la cantidad de días.",
      "Leé el consumo total de agua en litros.",
    ],
    faq: [
      { q: "What is the formula for total water consumption?", a: "Total liters = daily consumption (L) × number of days. Example: 150 L per day × 30 days = 4500 L." },
      { q: "How do I convert the result to cubic meters?", a: "1 cubic meter equals 1000 liters, so divide by 1000: 4500 L = 4.5 m³." },
      { q: "Where do I get my daily consumption in liters?", a: "Divide the liters on a water bill by the days it covers, or read your meter at the same hour on two consecutive days and subtract." },
    ],
    faqEs: [
      { q: "¿Cuál es la fórmula del consumo total de agua?", a: "Litros totales = consumo diario (L) × cantidad de días. Ejemplo: 150 L por día × 30 días = 4500 L." },
      { q: "¿Cómo convierto el resultado a metros cúbicos?", a: "1 metro cúbico equivale a 1000 litros: dividí por 1000. 4500 L = 4,5 m³." },
      { q: "¿De dónde saco mi consumo diario en litros?", a: "Dividí los litros de una factura por los días que cubre, o leé el medidor a la misma hora en dos días seguidos y restá." },
    ],
  },
};
