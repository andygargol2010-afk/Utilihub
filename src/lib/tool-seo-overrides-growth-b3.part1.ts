// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH_B3, split from tool-seo-overrides-growth-b3.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_B3_PART1: Record<string, ToolSeoOverrideGrowth> = {  "mpg-a-litros": {
    metaTitle: "MPG to L/100km Converter — Fuel Economy | UtiliHub",
    metaTitleEs: "Conversor MPG ↔ L/100 km — consumo de combustible | UtiliHub",
    metaDescription:
      "Convert US miles per gallon to liters per 100 kilometers and the reverse for vehicle fuel economy labels.",
    metaDescriptionEs:
      "Convertí millas por galón (EE.UU.) a litros cada 100 km y al revés, para etiquetas de consumo de vehículos.",
    about: [
      "US fuel economy is often stated in MPG; many other regions use L/100 km. The values are inverse-related, not a linear scale.",
      "We use the standard factor ≈ 235.215 to convert between US MPG and L/100 km.",
      "Imperial (UK) gallons differ from US gallons—this tool uses the US definition common on many online specs.",
    ],
    aboutEs: [
      "En EE.UU. el consumo suele ir en MPG; en otras regiones en L/100 km. Son magnitudes inversas, no una escala lineal.",
      "Usamos el factor estándar ≈ 235,215 entre MPG (EE.UU.) y L/100 km.",
      "El galón imperial (UK) no es el de EE.UU.: esta tool usa la definición estadounidense.",
    ],
    steps: [
      "Enter the fuel-economy value.",
      "Choose direction: MPG→L/100 or L/100→MPG.",
      "Read the converted figure for comparison shopping.",
    ],
    stepsEs: [
      "Ingresá el valor de consumo.",
      "Elegí dirección: MPG→L/100 o L/100→MPG.",
      "Leé la cifra convertida para comparar vehículos.",
    ],
    faq: [
      {
        q: "Higher MPG or lower L/100?",
        a: "Both mean better efficiency. 30 MPG is more efficient than 20 MPG; 6 L/100 is more efficient than 9 L/100.",
      },
      {
        q: "City vs highway?",
        a: "Labels often split cycles. Convert each rating separately.",
      },
    ],
    faqEs: [
      {
        q: "¿Más MPG o menos L/100?",
        a: "Ambos indican mejor eficiencia. 30 MPG es mejor que 20; 6 L/100 es mejor que 9.",
      },
      {
        q: "¿Ciudad o ruta?",
        a: "Las etiquetas suelen separar ciclos. Convertí cada valor por separado.",
      },
    ],
  },
};
