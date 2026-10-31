import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_TRIP_FUEL: Record<string, ToolSeoOverride> = {
  "consumo-viaje": {
    metaTitle: "Trip Fuel Cost Calculator — Liters & Price | UtiliHub",
    metaTitleEs: "Calculadora de consumo de viaje gratis — litros y costo | UtiliHub",
    metaDescription:
      "Estimate trip fuel in liters and total cost from distance (km), consumption (L/100 km) and fuel price. Free, instant, in your browser.",
    metaDescriptionEs:
      "Calculá litros y costo de un viaje con distancia (km), consumo (L/100 km) y precio del combustible. Gratis, al instante, sin registro.",
    about: [
      "A trip fuel calculator estimates how many liters you need and what the fuel will cost. Enter distance in kilometers, average consumption in L/100 km, and the price per liter.",
      "Formula: liters = (distance ÷ 100) × consumption; cost = liters × price per liter. Example: 200 km at 7.5 L/100 km and $1.50/L → 15 L and $22.50.",
      "Consumption is an average. City traffic, load, hills, and speed change real use. Treat the result as a planning estimate, not a guarantee.",
      "Calculation stays in your browser. Nothing is uploaded.",
    ],
    aboutEs: [
      "Una calculadora de consumo de viaje estima cuántos litros necesitás y cuánto costará el combustible. Ingresá la distancia en kilómetros, el consumo medio en L/100 km y el precio por litro.",
      "Fórmula: litros = (distancia ÷ 100) × consumo; costo = litros × precio por litro. Ejemplo: 200 km a 7,5 L/100 km y $1,50/L → 15 L y $22,50.",
      "El consumo es un promedio. Ciudad, carga, pendientes y velocidad cambian el uso real. Tomá el resultado como estimación de planificación, no como garantía.",
      "El cálculo queda en tu navegador. No se sube nada.",
    ],
    steps: [
      "Enter trip distance in km.",
      "Enter average consumption in L/100 km.",
      "Enter fuel price per liter.",
      "Read estimated liters and total cost; copy if needed.",
    ],
    stepsEs: [
      "Ingresá la distancia del viaje en km.",
      "Ingresá el consumo medio en L/100 km.",
      "Ingresá el precio del combustible por litro.",
      "Leé los litros estimados y el costo total; copiá si hace falta.",
    ],
    faq: [
      {
        q: "How do I calculate fuel for a trip?",
        a: "Liters = (km ÷ 100) × L/100 km. Cost = liters × price per liter.",
      },
      {
        q: "What does L/100 km mean?",
        a: "Liters of fuel used every 100 kilometers. Lower numbers mean better efficiency.",
      },
      {
        q: "Can I use miles instead of km?",
        a: "This tool expects kilometers and L/100 km. Convert miles to km first (1 mi ≈ 1.609 km).",
      },
      {
        q: "Is this trip fuel calculator free?",
        a: "Yes. It runs in your browser with no account required.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el combustible de un viaje?",
        a: "Litros = (km ÷ 100) × L/100 km. Costo = litros × precio por litro.",
      },
      {
        q: "¿Qué significa L/100 km?",
        a: "Litros de combustible cada 100 kilómetros. Un número más bajo indica mejor eficiencia.",
      },
      {
        q: "¿Sirve con millas?",
        a: "Esta herramienta usa kilómetros y L/100 km. Convertí millas a km antes (1 mi ≈ 1,609 km).",
      },
      {
        q: "¿Hay calculadora de consumo de viaje gratis?",
        a: "Sí. Calcula litros y costo en el navegador, sin registro.",
      },
    ],
  },
};
