// Part 1 of 3 — everyday converters and calculators (task 26, 2026-11-18). Edit here; everyday.ts re-exports.
import type { ToolReference } from "./types";

export const MILES_KM_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Miles to kilometers formula",
      es: "Fórmula de millas a kilómetros",
    },
    lines: [
      {
        en: "km = miles × 1.609344",
        es: "km = millas × 1,609344",
      },
      {
        en: "miles = km ÷ 1.609344 (≈ km × 0.621371)",
        es: "millas = km ÷ 1,609344 (≈ km × 0,621371)",
      },
      {
        en: "1.609344 is exact: the international mile was defined in 1959 as 1,609.344 m. Nautical miles (1.852 km) are a different unit.",
        es: "1,609344 es exacto: la milla internacional se fijó en 1959 en 1.609,344 m. La milla náutica (1,852 km) es otra unidad.",
      },
    ],
  },
  table: {
    caption: {
      en: "Miles to km chart",
      es: "Tabla de millas a km",
    },
    headers: [
      {
        en: "Miles (mi)",
        es: "Millas (mi)",
      },
      {
        en: "Kilometers (km)",
        es: "Kilómetros (km)",
      },
    ],
    rows: [
      {
        en: ["1.0 mi", "1.61 km"],
        es: ["1,0 mi", "1,61 km"],
      },
      {
        en: ["3.1 mi", "4.99 km"],
        es: ["3,1 mi", "4,99 km"],
      },
      {
        en: ["5.0 mi", "8.05 km"],
        es: ["5,0 mi", "8,05 km"],
      },
      {
        en: ["10.0 mi", "16.09 km"],
        es: ["10,0 mi", "16,09 km"],
      },
      {
        en: ["13.1 mi", "21.08 km"],
        es: ["13,1 mi", "21,08 km"],
      },
      {
        en: ["26.2 mi", "42.16 km"],
        es: ["26,2 mi", "42,16 km"],
      },
      {
        en: ["50.0 mi", "80.47 km"],
        es: ["50,0 mi", "80,47 km"],
      },
      {
        en: ["100.0 mi", "160.93 km"],
        es: ["100,0 mi", "160,93 km"],
      },
    ],
  },
  examples: [
    {
      en: "A 5K race is 3.1 mi, and 3.1 × 1.609344 = 4.99 km.",
      es: "Una carrera de 5K son 3,1 mi, y 3,1 × 1,609344 = 4,99 km.",
    },
    {
      en: "A 65 mph speed limit is 65 × 1.609344 = 104.6 km/h.",
      es: "Un límite de 65 mph equivale a 65 × 1,609344 = 104,6 km/h.",
    },
    {
      en: "Quick estimate: multiply miles by 1.6, or add 60 %: 40 mi ≈ 64 km (exact 64.37 km).",
      es: "Estimación rápida: multiplicar las millas por 1,6, o sumar un 60 %: 40 mi ≈ 64 km (exacto 64,37 km).",
    },
  ],
};

export const INCHES_CM_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Inches to centimeters formula",
      es: "Fórmula de pulgadas a centímetros",
    },
    lines: [
      {
        en: "cm = inches × 2.54",
        es: "cm = pulgadas × 2,54",
      },
      {
        en: "inches = cm ÷ 2.54",
        es: "pulgadas = cm ÷ 2,54",
      },
      {
        en: "2.54 is exact by definition (international inch, 1959). 12 inches make 1 foot (30.48 cm).",
        es: "2,54 es exacto por definición (pulgada internacional, 1959). 12 pulgadas forman 1 pie (30,48 cm).",
      },
    ],
  },
  table: {
    caption: {
      en: "Inches to cm chart",
      es: "Tabla de pulgadas a cm",
    },
    headers: [
      {
        en: "Inches (in)",
        es: "Pulgadas (in)",
      },
      {
        en: "Centimeters (cm)",
        es: "Centímetros (cm)",
      },
    ],
    rows: [
      {
        en: ["0.5 in", "1.27 cm"],
        es: ["0,5 in", "1,27 cm"],
      },
      {
        en: ["1.0 in", "2.54 cm"],
        es: ["1,0 in", "2,54 cm"],
      },
      {
        en: ["6.0 in", "15.24 cm"],
        es: ["6,0 in", "15,24 cm"],
      },
      {
        en: ["12.0 in", "30.48 cm"],
        es: ["12,0 in", "30,48 cm"],
      },
      {
        en: ["24.0 in", "60.96 cm"],
        es: ["24,0 in", "60,96 cm"],
      },
      {
        en: ["32.0 in", "81.28 cm"],
        es: ["32,0 in", "81,28 cm"],
      },
      {
        en: ["55.0 in", "139.70 cm"],
        es: ["55,0 in", "139,70 cm"],
      },
      {
        en: ["65.0 in", "165.10 cm"],
        es: ["65,0 in", "165,10 cm"],
      },
    ],
  },
  examples: [
    {
      en: "A 55-inch TV has a 55 × 2.54 = 139.7 cm diagonal.",
      es: "Un televisor de 55 pulgadas tiene una diagonal de 55 × 2,54 = 139,7 cm.",
    },
    {
      en: "A 32-inch waist (jeans size W32) is 32 × 2.54 = 81.28 cm.",
      es: "Una cintura de 32 pulgadas (talle W32) mide 32 × 2,54 = 81,28 cm.",
    },
    {
      en: "170 cm in inches: 170 ÷ 2.54 = 66.93 in, that is 5 ft 6.9 in.",
      es: "170 cm en pulgadas: 170 ÷ 2,54 = 66,93 in, o sea 5 ft 6,9 in.",
    },
  ],
};

export const CELSIUS_FAHRENHEIT_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Celsius to Fahrenheit formula",
      es: "Fórmula de Celsius a Fahrenheit",
    },
    lines: [
      {
        en: "°F = °C × 9/5 + 32",
        es: "°F = °C × 9/5 + 32",
      },
      {
        en: "°C = (°F − 32) × 5/9",
        es: "°C = (°F − 32) × 5/9",
      },
      {
        en: "The scales meet at −40 (−40 °C = −40 °F). A change of 1 °C equals a change of 1.8 °F.",
        es: "Las escalas coinciden en −40 (−40 °C = −40 °F). Una variación de 1 °C equivale a 1,8 °F.",
      },
    ],
  },
  table: {
    caption: {
      en: "Celsius to Fahrenheit chart",
      es: "Tabla de Celsius a Fahrenheit",
    },
    headers: [
      {
        en: "Celsius (°C)",
        es: "Celsius (°C)",
      },
      {
        en: "Fahrenheit (°F)",
        es: "Fahrenheit (°F)",
      },
    ],
    rows: [
      {
        en: ["-40 °C", "-40.0 °F"],
        es: ["-40 °C", "-40,0 °F"],
      },
      {
        en: ["-10 °C", "14.0 °F"],
        es: ["-10 °C", "14,0 °F"],
      },
      {
        en: ["0 °C", "32.0 °F"],
        es: ["0 °C", "32,0 °F"],
      },
      {
        en: ["10 °C", "50.0 °F"],
        es: ["10 °C", "50,0 °F"],
      },
      {
        en: ["20 °C", "68.0 °F"],
        es: ["20 °C", "68,0 °F"],
      },
      {
        en: ["25 °C", "77.0 °F"],
        es: ["25 °C", "77,0 °F"],
      },
      {
        en: ["37 °C", "98.6 °F"],
        es: ["37 °C", "98,6 °F"],
      },
      {
        en: ["100 °C", "212.0 °F"],
        es: ["100 °C", "212,0 °F"],
      },
    ],
  },
  examples: [
    {
      en: "Body temperature 37 °C: 37 × 1.8 + 32 = 98.6 °F.",
      es: "Temperatura corporal 37 °C: 37 × 1,8 + 32 = 98,6 °F.",
    },
    {
      en: "A 75 °F day in Celsius: (75 − 32) × 5/9 = 23.9 °C.",
      es: "Un día de 75 °F en Celsius: (75 − 32) × 5/9 = 23,9 °C.",
    },
    {
      en: "Mental shortcut: double the °C and add 30 (20 °C → 70 °F, exact 68 °F); it drifts more above 30 °C.",
      es: "Atajo mental: duplicar los °C y sumar 30 (20 °C → 70 °F, exacto 68 °F); se desvía más por encima de 30 °C.",
    },
  ],
};

export const LITERS_GALLONS_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Liters to US gallons formula",
      es: "Fórmula de litros a galones (EE. UU.)",
    },
    lines: [
      {
        en: "US gallons = liters ÷ 3.785411784",
        es: "galones US = litros ÷ 3,785411784",
      },
      {
        en: "liters = US gallons × 3.785411784",
        es: "litros = galones US × 3,785411784",
      },
      {
        en: "This tool uses the US liquid gallon. The UK imperial gallon is larger: 4.54609 L.",
        es: "Esta herramienta usa el galón líquido de EE. UU. El galón imperial británico es mayor: 4,54609 L.",
      },
    ],
  },
  table: {
    caption: {
      en: "Liters to US gallons chart",
      es: "Tabla de litros a galones US",
    },
    headers: [
      {
        en: "Liters (L)",
        es: "Litros (L)",
      },
      {
        en: "US gallons (gal)",
        es: "Galones US (gal)",
      },
    ],
    rows: [
      {
        en: ["1 L", "0.264 gal"],
        es: ["1 L", "0,264 gal"],
      },
      {
        en: ["2 L", "0.528 gal"],
        es: ["2 L", "0,528 gal"],
      },
      {
        en: ["4 L", "1.057 gal"],
        es: ["4 L", "1,057 gal"],
      },
      {
        en: ["5 L", "1.321 gal"],
        es: ["5 L", "1,321 gal"],
      },
      {
        en: ["10 L", "2.642 gal"],
        es: ["10 L", "2,642 gal"],
      },
      {
        en: ["20 L", "5.283 gal"],
        es: ["20 L", "5,283 gal"],
      },
      {
        en: ["50 L", "13.209 gal"],
        es: ["50 L", "13,209 gal"],
      },
      {
        en: ["100 L", "26.417 gal"],
        es: ["100 L", "26,417 gal"],
      },
    ],
  },
  examples: [
    {
      en: "A 50 L fuel tank holds 50 ÷ 3.7854 = 13.21 US gallons.",
      es: "Un tanque de 50 L carga 50 ÷ 3,7854 = 13,21 galones US.",
    },
    {
      en: "A 5-gallon water jug is 5 × 3.7854 = 18.93 L.",
      es: "Un bidón de agua de 5 galones son 5 × 3,7854 = 18,93 L.",
    },
    {
      en: "Fuel at $3.50 per gallon costs 3.50 ÷ 3.7854 = $0.92 per liter.",
      es: "Combustible a 3,50 USD el galón cuesta 3,50 ÷ 3,7854 = 0,92 USD por litro.",
    },
  ],
};

export const METERS_FEET_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Meters to feet formula",
      es: "Fórmula de metros a pies",
    },
    lines: [
      {
        en: "feet = meters ÷ 0.3048 (≈ meters × 3.28084)",
        es: "pies = metros ÷ 0,3048 (≈ metros × 3,28084)",
      },
      {
        en: "meters = feet × 0.3048",
        es: "metros = pies × 0,3048",
      },
      {
        en: "1 ft = 0.3048 m exactly, and 1 ft = 12 in. For height, split the decimal part: 0.75 ft × 12 = 9 in.",
        es: "1 ft = 0,3048 m exactos, y 1 ft = 12 in. Para estaturas, separar la parte decimal: 0,75 ft × 12 = 9 in.",
      },
    ],
  },
  table: {
    caption: {
      en: "Meters to feet chart",
      es: "Tabla de metros a pies",
    },
    headers: [
      {
        en: "Meters (m)",
        es: "Metros (m)",
      },
      {
        en: "Feet (ft)",
        es: "Pies (ft)",
      },
    ],
    rows: [
      {
        en: ["1.00 m", "3.28 ft"],
        es: ["1,00 m", "3,28 ft"],
      },
      {
        en: ["1.50 m", "4.92 ft"],
        es: ["1,50 m", "4,92 ft"],
      },
      {
        en: ["1.70 m", "5.58 ft"],
        es: ["1,70 m", "5,58 ft"],
      },
      {
        en: ["1.80 m", "5.91 ft"],
        es: ["1,80 m", "5,91 ft"],
      },
      {
        en: ["2.00 m", "6.56 ft"],
        es: ["2,00 m", "6,56 ft"],
      },
      {
        en: ["3.00 m", "9.84 ft"],
        es: ["3,00 m", "9,84 ft"],
      },
      {
        en: ["10.00 m", "32.81 ft"],
        es: ["10,00 m", "32,81 ft"],
      },
      {
        en: ["100.00 m", "328.08 ft"],
        es: ["100,00 m", "328,08 ft"],
      },
    ],
  },
  examples: [
    {
      en: "A height of 1.75 m is 5.74 ft, that is 5 ft 8.9 in.",
      es: "Una estatura de 1,75 m son 5,74 ft, o sea 5 ft 8,9 in.",
    },
    {
      en: "A 2.4 m ceiling is 2.4 ÷ 0.3048 = 7.87 ft.",
      es: "Un techo de 2,4 m mide 2,4 ÷ 0,3048 = 7,87 ft.",
    },
    {
      en: "A 30,000 ft cruising altitude is 30,000 × 0.3048 = 9,144 m.",
      es: "Una altitud de crucero de 30.000 ft son 30.000 × 0,3048 = 9.144 m.",
    },
  ],
};
