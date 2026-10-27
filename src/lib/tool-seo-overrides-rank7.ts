import type { ToolSeoOverride } from "./tool-seo-overrides";

/**
 * SEO rank pass #3: another 5 high-intent tools.
 * Spread after RANK6 so these win on their slugs.
 */
export const TOOL_SEO_OVERRIDES_RANK7: Record<string, ToolSeoOverride> = {
  "calculadora-de-fechas": {
    metaTitle: "Date Difference Calculator — Days Between Two Dates | UtiliHub",
    metaTitleEs: "Calculadora de diferencia de fechas online — días entre dos fechas | UtiliHub",
    metaDescription:
      "Calculate days, weeks, months, years and business days between two dates. Free date difference calculator, no signup.",
    metaDescriptionEs:
      "Calculá días, semanas, meses, años y días hábiles entre dos fechas. Calculadora de diferencia de fechas gratis, sin registro.",
    about: [
      "A date difference tool measures the interval between two calendar dates. It can report total days, weeks, months, years, and often business days (Monday–Friday).",
      "Leap years are included because the calculation uses the real Gregorian calendar. Local public holidays are usually not subtracted — they vary by country.",
      "Useful for contracts, project deadlines, pregnancy weeks, and “how many days until” planning.",
    ],
    aboutEs: [
      "Una calculadora de diferencia de fechas mide el intervalo entre dos fechas del calendario. Puede mostrar días totales, semanas, meses, años y días hábiles (lunes a viernes).",
      "Los años bisiestos se tienen en cuenta porque se usa el calendario gregoriano real. Los feriados locales no suelen restarse: cambian por país y región.",
      "Útil para contratos, plazos de proyectos, semanas de embarazo y planificar “cuántos días faltan”.",
    ],
    steps: [
      "Select the start date.",
      "Select the end date.",
      "Read days, weeks, months and business days.",
    ],
    stepsEs: [
      "Elegí la fecha de inicio.",
      "Elegí la fecha de fin.",
      "Leé días, semanas, meses y días hábiles.",
    ],
    faq: [
      {
        q: "How do I calculate days between two dates?",
        a: "Pick start and end dates; the tool counts the interval. If you need the end day included as a full day, add one to total days.",
      },
      {
        q: "Does it subtract holidays?",
        a: "No. Business days here mean Monday–Friday only, not country-specific holidays.",
      },
      {
        q: "Does it handle leap years?",
        a: "Yes. February 29 is included when it falls in the range.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calcular los días entre dos fechas?",
        a: "Elegí fecha inicio y fin; la herramienta cuenta el intervalo. Si necesitás contar el día final como día completo, sumá uno al total de días.",
      },
      {
        q: "¿Resta feriados?",
        a: "No. Los días hábiles aquí son lunes a viernes, sin feriados locales.",
      },
      {
        q: "¿Tiene en cuenta años bisiestos?",
        a: "Sí. El 29 de febrero se incluye cuando cae en el rango.",
      },
      {
        q: "¿Hay calculadora de diferencia de fechas online gratis?",
        a: "Sí. Esta calcula días y desglose en el navegador, sin registro.",
      },
    ],
  },

  "conversor-de-temperatura": {
    metaTitle: "Temperature Converter — °C, °F and Kelvin Free | UtiliHub",
    metaTitleEs: "Conversor de temperatura online gratis — °C, °F y Kelvin | UtiliHub",
    metaDescription:
      "Convert Celsius, Fahrenheit and Kelvin instantly with formulas shown. Free temperature converter, no signup.",
    metaDescriptionEs:
      "Convertí Celsius, Fahrenheit y Kelvin al instante, con las fórmulas a la vista. Conversor de temperatura gratis, sin registro.",
    about: [
      "Temperature conversion uses fixed formulas: °F = °C × 9/5 + 32; K = °C + 273.15; and the inverse relations.",
      "Type a value in any scale and the other two update. Handy for cooking, weather, science and travel.",
      "All math runs in the browser — no account required.",
    ],
    aboutEs: [
      "La conversión de temperatura usa fórmulas fijas: °F = °C × 9/5 + 32; K = °C + 273,15; y las relaciones inversas.",
      "Escribí un valor en cualquier escala y las otras dos se actualizan. Útil para cocina, clima, ciencia y viajes.",
      "Todo el cálculo corre en el navegador, sin cuenta.",
    ],
    steps: [
      "Enter the temperature you know.",
      "Read the other two scales.",
      "Check the formula under the converter if needed.",
    ],
    stepsEs: [
      "Ingresá la temperatura que conocés.",
      "Leé las otras dos escalas.",
      "Revisá la fórmula debajo del conversor si hace falta.",
    ],
    faq: [
      {
        q: "How do I convert Celsius to Fahrenheit?",
        a: "°F = °C × 9/5 + 32. Example: 100 °C → 212 °F.",
      },
      {
        q: "What is 100 °F in Celsius?",
        a: "(100 − 32) × 5/9 ≈ 37.78 °C.",
      },
      {
        q: "How do I convert Celsius to Kelvin?",
        a: "K = °C + 273.15. Example: 0 °C → 273.15 K.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo pasar de Celsius a Fahrenheit?",
        a: "°F = °C × 9/5 + 32. Ejemplo: 100 °C → 212 °F.",
      },
      {
        q: "¿Cuánto es 100 °F en Celsius?",
        a: "(100 − 32) × 5/9 ≈ 37,78 °C.",
      },
      {
        q: "¿Cómo pasar de Celsius a Kelvin?",
        a: "K = °C + 273,15. Ejemplo: 0 °C → 273,15 K.",
      },
      {
        q: "¿Hay conversor de temperatura online gratis?",
        a: "Sí. Este convierte °C, °F y K en el navegador, sin registro.",
      },
    ],
  },

  "conversor-de-unidades": {
    metaTitle: "Unit Converter Online – Length, Weight, Temp | UtiliHub",
    metaTitleEs: "Conversor de unidades online gratis — longitud, peso, temp, volumen | UtiliHub",
    metaDescription:
      "Convert length, weight, temperature, volume, area and time instantly. Standard factors, runs in your browser, free.",
    metaDescriptionEs:
      "Convertí longitud, peso, temperatura, volumen, área y tiempo en una sola herramienta. Conversor de unidades gratis, factores estándar, sin registro.",
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
        a: "Length, mass, temperature, volume, area and time, depending on the tool’s options.",
      },
      {
        q: "Are conversion factors exact?",
        a: "Internationally defined factors are used; only the displayed digits may be rounded.",
      },
      {
        q: "Is this unit converter free?",
        a: "Yes. It runs in the browser with no account.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué magnitudes puedo convertir?",
        a: "Longitud, masa, temperatura, volumen, área y tiempo, según las opciones de la herramienta.",
      },
      {
        q: "¿Los factores son exactos?",
        a: "Se usan factores definidos internacionalmente; solo pueden redondearse los dígitos en pantalla.",
      },
      {
        q: "¿Hay conversor de unidades online gratis?",
        a: "Sí. Este convierte varias magnitudes en el navegador, sin registro.",
      },
    ],
  },

  propina: {
    metaTitle: "Tip Calculator Free — Tip % and Total Bill | UtiliHub",
    metaTitleEs: "Calculadora de propina online gratis — % y total de la cuenta | UtiliHub",
    metaDescription:
      "Calculate tip amount and grand total from bill and tip percent. Optional split per person. Free tip calculator, no signup.",
    metaDescriptionEs:
      "Calculá el monto de propina y el total a partir de la cuenta y el %. Opcional: dividir por persona. Calculadora de propina gratis, sin registro.",
    about: [
      "A tip calculator multiplies the bill by the tip rate (e.g. 10% or 15%) and adds that to the total.",
      "Many people also split the total among diners: total ÷ number of people.",
      "Rates are social custom, not law — choose what fits the service and local norms.",
    ],
    aboutEs: [
      "Una calculadora de propina multiplica la cuenta por el porcentaje (p. ej. 10% o 15%) y suma ese monto al total.",
      "Muchas veces también se divide el total entre comensales: total ÷ cantidad de personas.",
      "El % es costumbre social, no una ley: elegí lo que corresponda al servicio y al lugar.",
    ],
    steps: [
      "Enter the bill amount.",
      "Choose or type the tip percentage.",
      "Read tip, total and optional per-person share.",
    ],
    stepsEs: [
      "Ingresá el monto de la cuenta.",
      "Elegí o escribí el porcentaje de propina.",
      "Leé propina, total y, si aplica, el monto por persona.",
    ],
    faq: [
      {
        q: "How do I calculate a tip?",
        a: "Tip = bill × (percent ÷ 100). Total = bill + tip. Example: $80 with 15% → $12 tip, $92 total.",
      },
      {
        q: "How do I split the bill with tip?",
        a: "Compute total with tip, then divide by the number of people.",
      },
      {
        q: "Is this tip calculator free?",
        a: "Yes. No signup required.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calcular la propina?",
        a: "Propina = cuenta × (% ÷ 100). Total = cuenta + propina. Ejemplo: $80 con 15% → $12 de propina, $92 en total.",
      },
      {
        q: "¿Cómo dividir la cuenta con propina?",
        a: "Calculá el total con propina y dividilo por la cantidad de personas.",
      },
      {
        q: "¿Qué porcentaje de propina es habitual?",
        a: "Depende del país y del servicio; en muchos lugares se usa entre 10% y 15% como referencia.",
      },
      {
        q: "¿Hay calculadora de propina online gratis?",
        a: "Sí. Esta calcula propina y total en el navegador, sin registro.",
      },
    ],
  },

  "calculadora-edad": {
    metaTitle: "Age Calculator Free — Years, Months and Days | UtiliHub",
    metaTitleEs: "Calculadora de edad online gratis — años, meses y días | UtiliHub",
    metaDescription:
      "Calculate exact age from date of birth: years, months and days. Free age calculator, no signup.",
    metaDescriptionEs:
      "Calculá la edad exacta desde la fecha de nacimiento: años, meses y días. Calculadora de edad gratis, sin registro.",
    about: [
      "An age calculator subtracts the birth date from today (or another reference date) and expresses the result in years, months and days.",
      "It accounts for varying month lengths and leap years so the day count stays consistent with the calendar.",
      "Useful for forms, eligibility checks and “how old will I be on this date” questions.",
    ],
    aboutEs: [
      "Una calculadora de edad resta la fecha de nacimiento de hoy (u otra fecha de referencia) y expresa el resultado en años, meses y días.",
      "Tiene en cuenta la duración variable de los meses y los años bisiestos para que el conteo coincida con el calendario.",
      "Útil para formularios, requisitos de edad y preguntas del tipo “qué edad tendré en esta fecha”.",
    ],
    steps: [
      "Enter the date of birth.",
      "Optionally set a reference date (default: today).",
      "Read years, months and days of age.",
    ],
    stepsEs: [
      "Ingresá la fecha de nacimiento.",
      "Opcional: elegí una fecha de referencia (por defecto: hoy).",
      "Leé años, meses y días de edad.",
    ],
    faq: [
      {
        q: "How do I calculate age from date of birth?",
        a: "Subtract birth date from the reference date and convert the interval into years, months and remaining days.",
      },
      {
        q: "Does it handle leap years?",
        a: "Yes. Calendar rules including February 29 are applied.",
      },
      {
        q: "Is this age calculator free?",
        a: "Yes. It runs in the browser with no account.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calcular la edad a partir de la fecha de nacimiento?",
        a: "Restá la fecha de nacimiento de la fecha de referencia y convertí el intervalo en años, meses y días restantes.",
      },
      {
        q: "¿Tiene en cuenta años bisiestos?",
        a: "Sí. Se aplican las reglas del calendario, incluido el 29 de febrero.",
      },
      {
        q: "¿Hay calculadora de edad online gratis?",
        a: "Sí. Esta muestra años, meses y días en el navegador, sin registro.",
      },
    ],
  },
};
