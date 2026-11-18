// Part 3 of 3 — everyday converters and calculators (task 26, 2026-11-18). Edit here; everyday.ts re-exports.
import type { ToolReference } from "./types";

export const KMH_MS_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "km/h to m/s formula",
      es: "Fórmula de km/h a m/s",
    },
    lines: [
      {
        en: "m/s = km/h ÷ 3.6",
        es: "m/s = km/h ÷ 3,6",
      },
      {
        en: "km/h = m/s × 3.6",
        es: "km/h = m/s × 3,6",
      },
      {
        en: "3.6 comes from 1,000 m per km divided by 3,600 s per hour.",
        es: "El 3,6 sale de 1.000 m por km dividido por 3.600 s por hora.",
      },
    ],
  },
  table: {
    caption: {
      en: "km/h to m/s chart",
      es: "Tabla de km/h a m/s",
    },
    headers: [
      {
        en: "km/h",
        es: "km/h",
      },
      {
        en: "m/s",
        es: "m/s",
      },
    ],
    rows: [
      {
        en: ["5 km/h", "1.39 m/s"],
        es: ["5 km/h", "1,39 m/s"],
      },
      {
        en: ["10 km/h", "2.78 m/s"],
        es: ["10 km/h", "2,78 m/s"],
      },
      {
        en: ["30 km/h", "8.33 m/s"],
        es: ["30 km/h", "8,33 m/s"],
      },
      {
        en: ["50 km/h", "13.89 m/s"],
        es: ["50 km/h", "13,89 m/s"],
      },
      {
        en: ["60 km/h", "16.67 m/s"],
        es: ["60 km/h", "16,67 m/s"],
      },
      {
        en: ["90 km/h", "25.00 m/s"],
        es: ["90 km/h", "25,00 m/s"],
      },
      {
        en: ["100 km/h", "27.78 m/s"],
        es: ["100 km/h", "27,78 m/s"],
      },
      {
        en: ["120 km/h", "33.33 m/s"],
        es: ["120 km/h", "33,33 m/s"],
      },
    ],
  },
  examples: [
    {
      en: "At 50 km/h a car covers 50 ÷ 3.6 = 13.89 m every second.",
      es: "A 50 km/h un auto recorre 50 ÷ 3,6 = 13,89 m por segundo.",
    },
    {
      en: "A 10 m/s wind is 10 × 3.6 = 36 km/h.",
      es: "Un viento de 10 m/s son 10 × 3,6 = 36 km/h.",
    },
    {
      en: "Reaction distance at 100 km/h with 1.5 s reaction time: 27.78 m/s × 1.5 = 41.7 m.",
      es: "Distancia de reacción a 100 km/h con 1,5 s de reacción: 27,78 m/s × 1,5 = 41,7 m.",
    },
  ],
};

export const DEGREES_RADIANS_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Degrees to radians formula",
      es: "Fórmula de grados a radianes",
    },
    lines: [
      {
        en: "radians = degrees × π / 180",
        es: "radianes = grados × π / 180",
      },
      {
        en: "degrees = radians × 180 / π",
        es: "grados = radianes × 180 / π",
      },
      {
        en: "A full turn is 360° = 2π rad, so 1 rad ≈ 57.2958°.",
        es: "Una vuelta completa es 360° = 2π rad, así que 1 rad ≈ 57,2958°.",
      },
    ],
  },
  table: {
    caption: {
      en: "Degrees to radians chart",
      es: "Tabla de grados a radianes",
    },
    headers: [
      {
        en: "Degrees (°)",
        es: "Grados (°)",
      },
      {
        en: "Radians (rad)",
        es: "Radianes (rad)",
      },
    ],
    rows: [
      {
        en: ["30°", "π/6 = 0.5236"],
        es: ["30°", "π/6 = 0,5236"],
      },
      {
        en: ["45°", "π/4 = 0.7854"],
        es: ["45°", "π/4 = 0,7854"],
      },
      {
        en: ["60°", "π/3 = 1.0472"],
        es: ["60°", "π/3 = 1,0472"],
      },
      {
        en: ["90°", "π/2 = 1.5708"],
        es: ["90°", "π/2 = 1,5708"],
      },
      {
        en: ["120°", "2π/3 = 2.0944"],
        es: ["120°", "2π/3 = 2,0944"],
      },
      {
        en: ["180°", "π = 3.1416"],
        es: ["180°", "π = 3,1416"],
      },
      {
        en: ["270°", "3π/2 = 4.7124"],
        es: ["270°", "3π/2 = 4,7124"],
      },
      {
        en: ["360°", "2π = 6.2832"],
        es: ["360°", "2π = 6,2832"],
      },
    ],
  },
  examples: [
    {
      en: "75° in radians: 75 × π / 180 = 1.3090 rad (5π/12).",
      es: "75° en radianes: 75 × π / 180 = 1,3090 rad (5π/12).",
    },
    {
      en: "2.5 rad in degrees: 2.5 × 180 / π = 143.24°.",
      es: "2,5 rad en grados: 2,5 × 180 / π = 143,24°.",
    },
    {
      en: "Spreadsheet and JavaScript sin() and cos() expect radians: sin(30°) means sin(0.5236).",
      es: "Las funciones sin() y cos() de hojas de cálculo y JavaScript esperan radianes: sin(30°) es sin(0,5236).",
    },
  ],
};

export const OVEN_F_TO_C_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Oven Fahrenheit to Celsius formula",
      es: "Fórmula de horno Fahrenheit a Celsius",
    },
    lines: [
      {
        en: "°C = (°F − 32) × 5/9",
        es: "°C = (°F − 32) × 5/9",
      },
      {
        en: "Recipes usually round to the nearest 5 or 10 °C, because oven dials step in those increments.",
        es: "Las recetas suelen redondear a los 5 o 10 °C más cercanos, porque los diales del horno van en esos pasos.",
      },
      {
        en: "For a fan (convection) oven, many recipes lower the temperature by about 20 °C (25 °F).",
        es: "En horno con ventilador (convección), muchas recetas bajan la temperatura unos 20 °C (25 °F).",
      },
    ],
  },
  table: {
    caption: {
      en: "Oven temperature chart",
      es: "Tabla de temperaturas de horno",
    },
    headers: [
      {
        en: "Fahrenheit (°F)",
        es: "Fahrenheit (°F)",
      },
      {
        en: "Celsius (°C)",
        es: "Celsius (°C)",
      },
    ],
    rows: [
      {
        en: ["250 °F", "121.1 °C"],
        es: ["250 °F", "121,1 °C"],
      },
      {
        en: ["300 °F", "148.9 °C"],
        es: ["300 °F", "148,9 °C"],
      },
      {
        en: ["325 °F", "162.8 °C"],
        es: ["325 °F", "162,8 °C"],
      },
      {
        en: ["350 °F", "176.7 °C"],
        es: ["350 °F", "176,7 °C"],
      },
      {
        en: ["375 °F", "190.6 °C"],
        es: ["375 °F", "190,6 °C"],
      },
      {
        en: ["400 °F", "204.4 °C"],
        es: ["400 °F", "204,4 °C"],
      },
      {
        en: ["425 °F", "218.3 °C"],
        es: ["425 °F", "218,3 °C"],
      },
      {
        en: ["450 °F", "232.2 °C"],
        es: ["450 °F", "232,2 °C"],
      },
    ],
  },
  examples: [
    {
      en: "Cookies at 350 °F: (350 − 32) × 5/9 = 176.7 °C, set the dial to 180 °C.",
      es: "Galletas a 350 °F: (350 − 32) × 5/9 = 176,7 °C, poner el dial en 180 °C.",
    },
    {
      en: "Roast at 425 °F = 218.3 °C, usually written as 220 °C (200 °C fan).",
      es: "Asado a 425 °F = 218,3 °C, normalmente escrito como 220 °C (200 °C con ventilador).",
    },
    {
      en: "Slow cooking at 275 °F = 135 °C.",
      es: "Cocción lenta a 275 °F = 135 °C.",
    },
  ],
};

export const HOURS_DECIMAL_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Hours and minutes to decimal formula",
      es: "Fórmula de horas y minutos a decimal",
    },
    lines: [
      {
        en: "decimal hours = hours + minutes ÷ 60",
        es: "horas decimales = horas + minutos ÷ 60",
      },
      {
        en: "minutes = decimal part × 60 (0.75 h × 60 = 45 min)",
        es: "minutos = parte decimal × 60 (0,75 h × 60 = 45 min)",
      },
      {
        en: "Payroll and timesheets bill in decimal hours: 7 h 30 min is 7.5 h, not 7.30 h.",
        es: "Las nóminas y planillas de horas usan horas decimales: 7 h 30 min son 7,5 h, no 7,30 h.",
      },
    ],
  },
  table: {
    caption: {
      en: "Minutes to decimal hours chart",
      es: "Tabla de minutos a horas decimales",
    },
    headers: [
      {
        en: "Minutes",
        es: "Minutos",
      },
      {
        en: "Decimal hours",
        es: "Horas decimales",
      },
    ],
    rows: [
      {
        en: ["5 min", "0.083 h"],
        es: ["5 min", "0,083 h"],
      },
      {
        en: ["6 min", "0.100 h"],
        es: ["6 min", "0,100 h"],
      },
      {
        en: ["10 min", "0.167 h"],
        es: ["10 min", "0,167 h"],
      },
      {
        en: ["15 min", "0.250 h"],
        es: ["15 min", "0,250 h"],
      },
      {
        en: ["20 min", "0.333 h"],
        es: ["20 min", "0,333 h"],
      },
      {
        en: ["30 min", "0.500 h"],
        es: ["30 min", "0,500 h"],
      },
      {
        en: ["40 min", "0.667 h"],
        es: ["40 min", "0,667 h"],
      },
      {
        en: ["45 min", "0.750 h"],
        es: ["45 min", "0,750 h"],
      },
    ],
  },
  examples: [
    {
      en: "8 h 45 min = 8 + 45/60 = 8.75 h; at $20/h that is $175.",
      es: "8 h 45 min = 8 + 45/60 = 8,75 h; a 20 USD/h son 175 USD.",
    },
    {
      en: "7 h 20 min = 7.333 h (20 ÷ 60 = 0.333).",
      es: "7 h 20 min = 7,333 h (20 ÷ 60 = 0,333).",
    },
    {
      en: "6.4 h back to clock time: 0.4 × 60 = 24 min, so 6 h 24 min.",
      es: "6,4 h a formato reloj: 0,4 × 60 = 24 min, o sea 6 h 24 min.",
    },
  ],
};

export const MAX_HEART_RATE_REFERENCE: ToolReference = {
  formula: {
    title: {
      en: "Maximum heart rate formula",
      es: "Fórmula de frecuencia cardíaca máxima",
    },
    lines: [
      {
        en: "HRmax ≈ 220 − age (beats per minute)",
        es: "FCmáx ≈ 220 − edad (latidos por minuto)",
      },
      {
        en: "Tanaka alternative: HRmax ≈ 208 − 0.7 × age, often closer for adults over 40.",
        es: "Alternativa de Tanaka: FCmáx ≈ 208 − 0,7 × edad, suele ajustar mejor en mayores de 40.",
      },
      {
        en: "Both are population averages; an individual can differ by 10 to 12 bpm. Only a supervised stress test measures it.",
        es: "Ambas son promedios de población; una persona puede diferir 10 a 12 lpm. Solo una prueba de esfuerzo supervisada la mide.",
      },
    ],
  },
  table: {
    caption: {
      en: "Max heart rate by age (220 − age)",
      es: "Frecuencia cardíaca máxima por edad (220 − edad)",
    },
    headers: [
      {
        en: "Age",
        es: "Edad",
      },
      {
        en: "HRmax (bpm)",
        es: "FCmáx (lpm)",
      },
      {
        en: "Zone 2: 60–70 %",
        es: "Zona 2: 60–70 %",
      },
    ],
    rows: [
      {
        en: ["20", "200", "120–140"],
        es: ["20", "200", "120–140"],
      },
      {
        en: ["25", "195", "117–136"],
        es: ["25", "195", "117–136"],
      },
      {
        en: ["30", "190", "114–133"],
        es: ["30", "190", "114–133"],
      },
      {
        en: ["35", "185", "111–130"],
        es: ["35", "185", "111–130"],
      },
      {
        en: ["40", "180", "108–126"],
        es: ["40", "180", "108–126"],
      },
      {
        en: ["45", "175", "105–122"],
        es: ["45", "175", "105–122"],
      },
      {
        en: ["50", "170", "102–119"],
        es: ["50", "170", "102–119"],
      },
      {
        en: ["60", "160", "96–112"],
        es: ["60", "160", "96–112"],
      },
      {
        en: ["70", "150", "90–105"],
        es: ["70", "150", "90–105"],
      },
    ],
  },
  examples: [
    {
      en: "Age 40: 220 − 40 = 180 bpm; 70 % of that is 126 bpm.",
      es: "Edad 40: 220 − 40 = 180 lpm; el 70 % es 126 lpm.",
    },
    {
      en: "Age 55 with Tanaka: 208 − 0.7 × 55 = 169.5 bpm, versus 165 with 220 − age.",
      es: "Edad 55 con Tanaka: 208 − 0,7 × 55 = 169,5 lpm, contra 165 con 220 − edad.",
    },
    {
      en: "Beta blockers lower heart rate, so these estimates do not apply; ask a doctor for training zones.",
      es: "Los betabloqueantes bajan la frecuencia, así que estas estimaciones no aplican; consultá a un médico por las zonas.",
    },
  ],
};
