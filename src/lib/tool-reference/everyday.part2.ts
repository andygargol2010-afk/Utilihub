// Part 2 of 3 — everyday converters and calculators (task 26, 2026-11-18). Edit here; everyday.ts re-exports.
import type { ToolReference } from "./types";

export const GRAMS_POUNDS_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Grams to pounds formula",
      es: "Fórmula de gramos a libras",
    },
    lines: [
      {
        en: "pounds = grams ÷ 453.59237",
        es: "libras = gramos ÷ 453,59237",
      },
      {
        en: "grams = pounds × 453.59237",
        es: "gramos = libras × 453,59237",
      },
      {
        en: "1 lb = 16 oz = 453.59237 g exactly (avoirdupois pound).",
        es: "1 lb = 16 oz = 453,59237 g exactos (libra avoirdupois).",
      },
    ],
  },
  table: {
    caption: {
      en: "Grams to pounds chart",
      es: "Tabla de gramos a libras",
    },
    headers: [
      {
        en: "Grams (g)",
        es: "Gramos (g)",
      },
      {
        en: "Pounds (lb)",
        es: "Libras (lb)",
      },
    ],
    rows: [
      {
        en: ["100 g", "0.220 lb"],
        es: ["100 g", "0,220 lb"],
      },
      {
        en: ["250 g", "0.551 lb"],
        es: ["250 g", "0,551 lb"],
      },
      {
        en: ["454 g", "1.001 lb"],
        es: ["454 g", "1,001 lb"],
      },
      {
        en: ["500 g", "1.102 lb"],
        es: ["500 g", "1,102 lb"],
      },
      {
        en: ["750 g", "1.653 lb"],
        es: ["750 g", "1,653 lb"],
      },
      {
        en: ["1,000 g", "2.205 lb"],
        es: ["1.000 g", "2,205 lb"],
      },
      {
        en: ["2,000 g", "4.409 lb"],
        es: ["2.000 g", "4,409 lb"],
      },
      {
        en: ["5,000 g", "11.023 lb"],
        es: ["5.000 g", "11,023 lb"],
      },
    ],
  },
  examples: [
    {
      en: "A 500 g pack of pasta weighs 500 ÷ 453.59 = 1.102 lb.",
      es: "Un paquete de pasta de 500 g pesa 500 ÷ 453,59 = 1,102 lb.",
    },
    {
      en: "A 3 lb package of meat is 3 × 453.59 = 1,360.8 g.",
      es: "Un paquete de carne de 3 lb son 3 × 453,59 = 1.360,8 g.",
    },
    {
      en: "Leftover ounces: 0.102 lb × 16 = 1.6 oz, so 500 g ≈ 1 lb 1.6 oz.",
      es: "Onzas sobrantes: 0,102 lb × 16 = 1,6 oz, así que 500 g ≈ 1 lb 1,6 oz.",
    },
  ],
};

export const ACRES_HECTARES_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Acres to hectares formula",
      es: "Fórmula de acres a hectáreas",
    },
    lines: [
      {
        en: "hectares = acres × 0.40468564224",
        es: "hectáreas = acres × 0,40468564224",
      },
      {
        en: "acres = hectares × 2.4710538",
        es: "acres = hectáreas × 2,4710538",
      },
      {
        en: "1 hectare = 10,000 m² (a 100 m × 100 m square). 1 acre = 4,046.86 m².",
        es: "1 hectárea = 10.000 m² (un cuadrado de 100 m × 100 m). 1 acre = 4.046,86 m².",
      },
    ],
  },
  table: {
    caption: {
      en: "Acres to hectares chart",
      es: "Tabla de acres a hectáreas",
    },
    headers: [
      {
        en: "Acres (ac)",
        es: "Acres (ac)",
      },
      {
        en: "Hectares (ha)",
        es: "Hectáreas (ha)",
      },
    ],
    rows: [
      {
        en: ["0.25 ac", "0.101 ha"],
        es: ["0,25 ac", "0,101 ha"],
      },
      {
        en: ["0.50 ac", "0.202 ha"],
        es: ["0,50 ac", "0,202 ha"],
      },
      {
        en: ["1.00 ac", "0.405 ha"],
        es: ["1,00 ac", "0,405 ha"],
      },
      {
        en: ["2.50 ac", "1.012 ha"],
        es: ["2,50 ac", "1,012 ha"],
      },
      {
        en: ["5.00 ac", "2.023 ha"],
        es: ["5,00 ac", "2,023 ha"],
      },
      {
        en: ["10.00 ac", "4.047 ha"],
        es: ["10,00 ac", "4,047 ha"],
      },
      {
        en: ["40.00 ac", "16.187 ha"],
        es: ["40,00 ac", "16,187 ha"],
      },
      {
        en: ["100.00 ac", "40.469 ha"],
        es: ["100,00 ac", "40,469 ha"],
      },
    ],
  },
  examples: [
    {
      en: "A 40-acre farm is 40 × 0.4047 = 16.19 ha.",
      es: "Una granja de 40 acres son 40 × 0,4047 = 16,19 ha.",
    },
    {
      en: "A 3 ha field is 3 × 2.471 = 7.41 acres.",
      es: "Un campo de 3 ha son 3 × 2,471 = 7,41 acres.",
    },
    {
      en: "A quarter-acre house lot is 0.25 × 4,046.86 = 1,011.7 m².",
      es: "Un lote de un cuarto de acre son 0,25 × 4.046,86 = 1.011,7 m².",
    },
  ],
};

export const KCAL_KJ_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "kcal to kJ formula",
      es: "Fórmula de kcal a kJ",
    },
    lines: [
      {
        en: "kJ = kcal × 4.184",
        es: "kJ = kcal × 4,184",
      },
      {
        en: "kcal = kJ ÷ 4.184",
        es: "kcal = kJ ÷ 4,184",
      },
      {
        en: 'Food "Calories" (capital C) are kilocalories. EU and Australian labels show both kJ and kcal.',
        es: 'Las "Calorías" de los alimentos son kilocalorías. Las etiquetas de la UE y Australia muestran kJ y kcal.',
      },
    ],
  },
  table: {
    caption: {
      en: "kcal to kJ chart",
      es: "Tabla de kcal a kJ",
    },
    headers: [
      {
        en: "Kilocalories (kcal)",
        es: "Kilocalorías (kcal)",
      },
      {
        en: "Kilojoules (kJ)",
        es: "Kilojulios (kJ)",
      },
    ],
    rows: [
      {
        en: ["1 kcal", "4.2 kJ"],
        es: ["1 kcal", "4,2 kJ"],
      },
      {
        en: ["50 kcal", "209.2 kJ"],
        es: ["50 kcal", "209,2 kJ"],
      },
      {
        en: ["100 kcal", "418.4 kJ"],
        es: ["100 kcal", "418,4 kJ"],
      },
      {
        en: ["250 kcal", "1,046.0 kJ"],
        es: ["250 kcal", "1.046,0 kJ"],
      },
      {
        en: ["500 kcal", "2,092.0 kJ"],
        es: ["500 kcal", "2.092,0 kJ"],
      },
      {
        en: ["1,000 kcal", "4,184.0 kJ"],
        es: ["1.000 kcal", "4.184,0 kJ"],
      },
      {
        en: ["2,000 kcal", "8,368.0 kJ"],
        es: ["2.000 kcal", "8.368,0 kJ"],
      },
      {
        en: ["2,500 kcal", "10,460.0 kJ"],
        es: ["2.500 kcal", "10.460,0 kJ"],
      },
    ],
  },
  examples: [
    {
      en: "A 2,000 kcal daily diet is 2,000 × 4.184 = 8,368 kJ (labels round it to 8,400 kJ).",
      es: "Una dieta diaria de 2.000 kcal son 2.000 × 4,184 = 8.368 kJ (las etiquetas lo redondean a 8.400 kJ).",
    },
    {
      en: "A snack bar labeled 850 kJ has 850 ÷ 4.184 = 203 kcal.",
      es: "Una barrita con 850 kJ en la etiqueta tiene 850 ÷ 4,184 = 203 kcal.",
    },
    {
      en: "Quick estimate: kJ ÷ 4 gives kcal about 4.6 % high.",
      es: "Estimación rápida: kJ ÷ 4 da las kcal con un 4,6 % de más.",
    },
  ],
};

export const PSI_BAR_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "PSI to bar formula",
      es: "Fórmula de PSI a bar",
    },
    lines: [
      {
        en: "bar = psi × 0.0689476",
        es: "bar = psi × 0,0689476",
      },
      {
        en: "psi = bar × 14.5038",
        es: "psi = bar × 14,5038",
      },
      {
        en: "1 bar = 100 kPa, close to atmospheric pressure at sea level (1.01325 bar). Tire gauges show gauge pressure, above atmospheric.",
        es: "1 bar = 100 kPa, cerca de la presión atmosférica a nivel del mar (1,01325 bar). Los manómetros de neumáticos miden presión relativa, por encima de la atmosférica.",
      },
    ],
  },
  table: {
    caption: {
      en: "PSI to bar chart",
      es: "Tabla de PSI a bar",
    },
    headers: [
      {
        en: "PSI",
        es: "PSI",
      },
      {
        en: "Bar",
        es: "Bar",
      },
    ],
    rows: [
      {
        en: ["14.5 psi", "1.00 bar"],
        es: ["14,5 psi", "1,00 bar"],
      },
      {
        en: ["30.0 psi", "2.07 bar"],
        es: ["30,0 psi", "2,07 bar"],
      },
      {
        en: ["32.0 psi", "2.21 bar"],
        es: ["32,0 psi", "2,21 bar"],
      },
      {
        en: ["35.0 psi", "2.41 bar"],
        es: ["35,0 psi", "2,41 bar"],
      },
      {
        en: ["40.0 psi", "2.76 bar"],
        es: ["40,0 psi", "2,76 bar"],
      },
      {
        en: ["44.0 psi", "3.03 bar"],
        es: ["44,0 psi", "3,03 bar"],
      },
      {
        en: ["100.0 psi", "6.89 bar"],
        es: ["100,0 psi", "6,89 bar"],
      },
      {
        en: ["3,000.0 psi", "206.84 bar"],
        es: ["3.000,0 psi", "206,84 bar"],
      },
    ],
  },
  examples: [
    {
      en: "A car tire at 32 psi is 32 × 0.06895 = 2.21 bar.",
      es: "Un neumático a 32 psi tiene 32 × 0,06895 = 2,21 bar.",
    },
    {
      en: "A 2.5 bar tire spec is 2.5 × 14.504 = 36.3 psi.",
      es: "Una especificación de 2,5 bar son 2,5 × 14,504 = 36,3 psi.",
    },
    {
      en: "A full 200 bar scuba tank is 200 × 14.504 = 2,901 psi.",
      es: "Un tanque de buceo lleno a 200 bar son 200 × 14,504 = 2.901 psi.",
    },
  ],
};

export const YARDS_METERS_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Yards to meters formula",
      es: "Fórmula de yardas a metros",
    },
    lines: [
      {
        en: "meters = yards × 0.9144",
        es: "metros = yardas × 0,9144",
      },
      {
        en: "yards = meters ÷ 0.9144 (≈ meters × 1.09361)",
        es: "yardas = metros ÷ 0,9144 (≈ metros × 1,09361)",
      },
      {
        en: "1 yd = 3 ft = 36 in = 0.9144 m exactly.",
        es: "1 yd = 3 ft = 36 in = 0,9144 m exactos.",
      },
    ],
  },
  table: {
    caption: {
      en: "Yards to meters chart",
      es: "Tabla de yardas a metros",
    },
    headers: [
      {
        en: "Yards (yd)",
        es: "Yardas (yd)",
      },
      {
        en: "Meters (m)",
        es: "Metros (m)",
      },
    ],
    rows: [
      {
        en: ["1 yd", "0.91 m"],
        es: ["1 yd", "0,91 m"],
      },
      {
        en: ["5 yd", "4.57 m"],
        es: ["5 yd", "4,57 m"],
      },
      {
        en: ["10 yd", "9.14 m"],
        es: ["10 yd", "9,14 m"],
      },
      {
        en: ["25 yd", "22.86 m"],
        es: ["25 yd", "22,86 m"],
      },
      {
        en: ["50 yd", "45.72 m"],
        es: ["50 yd", "45,72 m"],
      },
      {
        en: ["100 yd", "91.44 m"],
        es: ["100 yd", "91,44 m"],
      },
      {
        en: ["220 yd", "201.17 m"],
        es: ["220 yd", "201,17 m"],
      },
      {
        en: ["1,760 yd", "1,609.34 m"],
        es: ["1.760 yd", "1.609,34 m"],
      },
    ],
  },
  examples: [
    {
      en: "A 100-yard football field is 100 × 0.9144 = 91.44 m between goal lines.",
      es: "Una cancha de fútbol americano de 100 yardas mide 100 × 0,9144 = 91,44 m entre líneas de gol.",
    },
    {
      en: "A 25-yard pool is 22.86 m, shorter than a 25 m pool.",
      es: "Una piscina de 25 yardas mide 22,86 m, menos que una de 25 m.",
    },
    {
      en: "3 m of fabric in yards: 3 ÷ 0.9144 = 3.28 yd.",
      es: "3 m de tela en yardas: 3 ÷ 0,9144 = 3,28 yd.",
    },
  ],
};
