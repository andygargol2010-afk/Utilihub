import type { ToolSeoOverride } from "./tool-seo-overrides";

/** GSC top queries by impressions+clicks (2026-10-31). One cycle SEO batch. */
export const TOOL_SEO_OVERRIDES_GSC_QUERIES: Record<string, ToolSeoOverride> = {
  "conversor-locale": {
    metaTitle: "Locale Converter Online — Dates, Numbers & Money | UtiliHub",
    metaTitleEs: "Locale converter online — fechas, números, moneda | UtiliHub",
    metaDescription:
      "Locale converter online: see how dates, numbers and currency look in en-US, es-MX, de-DE, ja-JP or any BCP 47 tag. Free and instant. Try a locale now.",
    metaDescriptionEs:
      "Locale converter online: mirá cómo se ven fechas, números y monedas en es-ES, es-MX, en-US, de-DE o cualquier locale BCP 47. Gratis. Probalo ahora.",
    about: [
      "People search for “locale converter online” and “locale online” when they need to see how a date, number or amount looks in another country format before shipping UI or documents.",
      "A BCP 47 locale tag (en-US, es-AR, pt-BR, zh-Hans) controls separators, order of day/month, and where the currency symbol goes.",
      "This tool uses the browser Intl API so the preview matches toLocaleString() and production front-ends.",
    ],
    aboutEs: [
      "Quien busca “locale converter online” o “locale online” quiere ver cómo queda una fecha, un número o un importe en el formato de otro país antes de publicar UI o documentos.",
      "Una etiqueta BCP 47 (es-AR, en-US, pt-BR, zh-Hans) define separadores, orden día/mes y posición del símbolo de moneda.",
      "Usa la API Intl del navegador: el resultado coincide con toLocaleString() y con front-ends en producción.",
    ],
    faq: [
      {
        q: "What is a locale converter online?",
        a: "It formats the same date, number and currency value under different BCP 47 locales so you can compare en-US, es-MX, de-DE and others side by side.",
      },
      {
        q: "Is this locale converter free?",
        a: "Yes. It runs fully in your browser with no signup and no upload.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué es un locale converter online?",
        a: "Formatea la misma fecha, número e importe bajo distintos locales BCP 47 para comparar es-ES, en-US, de-DE, etc.",
      },
      {
        q: "¿Es gratis el locale converter?",
        a: "Sí. Corre en el navegador, sin registro y sin subir datos.",
      },
    ],
  },
  "conversor-de-unidades": {
    metaTitle: "Unit Converter — Length, Weight, Temp & More | UtiliHub",
    metaTitleEs: "Conversor de unidades — longitud, peso y más | UtiliHub",
    metaDescription:
      "Free unit converter for length, weight, temperature, volume, area and time. Get instant metric ↔ imperial results in your browser. Pick units and convert.",
    metaDescriptionEs:
      "Conversor de unidades gratis: longitud, peso, temperatura, volumen, área y tiempo. Resultados métricos ↔ imperiales al instante. Elegí unidades y convertí.",
    about: [
      "A unit converter applies fixed international factors between metric and common imperial units so you can switch length, mass, temperature, volume, area and time in one place.",
      "Typical searches include “unit converter”, “convert units” and “online converter” when someone needs a quick, trustworthy conversion without installing an app.",
    ],
    aboutEs: [
      "Un conversor de unidades aplica factores internacionales fijos entre el sistema métrico y unidades imperiales habituales: longitud, masa, temperatura, volumen, área y tiempo.",
      "Las búsquedas “unit converter” y “conversor de unidades” suelen buscar una conversión rápida y fiable sin instalar nada.",
    ],
    faq: [
      {
        q: "Is this unit converter free?",
        a: "Yes. All conversions run locally in the browser.",
      },
      {
        q: "Which quantities can I convert?",
        a: "Length, mass, temperature, volume, area and time with common metric and imperial units.",
      },
    ],
    faqEs: [
      {
        q: "¿El conversor de unidades es gratis?",
        a: "Sí. Todo el cálculo corre en el navegador.",
      },
      {
        q: "¿Qué magnitudes puedo convertir?",
        a: "Longitud, masa, temperatura, volumen, área y tiempo, con unidades métricas e imperiales habituales.",
      },
    ],
  },
  "conversor-millas-km": {
    metaTitle: "Miles to Km Converter — 1 mile = 1.609344 km | UtiliHub",
    metaTitleEs: "Millas a km — conversor de millas a kilómetros | UtiliHub",
    metaDescription:
      "Convert miles to km instantly: 1 mile = 1.609344 km. Free miles to kilometers converter for running, maps and road trips. Enter miles and get km now.",
    metaDescriptionEs:
      "Convertí millas a km al instante: 1 milla = 1,609344 km. Conversor gratis de millas a kilómetros para carreras, mapas y viajes. Ingresá las millas y listo.",
    about: [
      "Miles to km is one of the most common distance conversions: multiply miles by 1.609344 to get kilometers (exact international mile).",
      "Use it for road trips, running routes, aviation charts or any map that mixes US customary and metric units.",
    ],
    aboutEs: [
      "Millas a km es una de las conversiones de distancia más buscadas: multiplicá millas por 1,609344 para obtener kilómetros (milla internacional exacta).",
      "Útil para viajes en ruta, running, cartas aeronáuticas o mapas que mezclan unidades US y métricas.",
    ],
    faq: [
      {
        q: "How many km is 1 mile?",
        a: "Exactly 1.609344 kilometers per international mile.",
      },
      {
        q: "How do I convert miles to km?",
        a: "Multiply the number of miles by 1.609344. Example: 10 miles × 1.609344 = 16.09344 km.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuántos km es 1 milla?",
        a: "Exactamente 1,609344 kilómetros por milla internacional.",
      },
      {
        q: "¿Cómo convertir millas a km?",
        a: "Multiplicá las millas por 1,609344. Ejemplo: 10 millas × 1,609344 = 16,09344 km.",
      },
    ],
  },
  "calculadora-tiempo-de-lectura": {
    metaTitle: "Words to Minutes — Reading Time Calculator (WPM) | UtiliHub",
    metaTitleEs: "Palabras a minutos — calculadora de tiempo de lectura (PPM) | UtiliHub",
    metaDescription:
      "Words to minutes converter: estimate reading time from word count and words-per-minute. Free reading time calculator for articles and scripts.",
    metaDescriptionEs:
      "Palabras a minutos: estimá el tiempo de lectura con el número de palabras y las palabras por minuto. Calculadora gratis para artículos y guiones.",
    about: [
      "“Words to minutes” and “words to time” queries ask how long a text takes to read or speak at a given words-per-minute rate.",
      "Formula: minutes = word count ÷ WPM. Typical silent reading is about 200–250 WPM; spoken narration is often ~130–150 WPM.",
    ],
    aboutEs: [
      "Las búsquedas “words to minutes” o “palabras a minutos” preguntan cuánto tarda un texto en leerse o narrarse a cierta velocidad (palabras por minuto).",
      "Fórmula: minutos = palabras ÷ PPM. Lectura silenciosa típica: 200–250 PPM; narración hablada: ~130–150 PPM.",
    ],
    faq: [
      {
        q: "How do I convert words to minutes?",
        a: "Divide the number of words by your reading or speaking speed in words per minute. Example: 1000 words at 200 WPM ≈ 5 minutes.",
      },
      {
        q: "What WPM should I use?",
        a: "Around 200–250 for silent reading adults; slower for technical text; ~150 for spoken audio scripts.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo paso palabras a minutos?",
        a: "Dividí la cantidad de palabras por la velocidad en palabras por minuto. Ejemplo: 1000 palabras a 200 PPM ≈ 5 minutos.",
      },
      {
        q: "¿Qué PPM uso?",
        a: "Unas 200–250 para lectura silenciosa de adultos; menos en texto técnico; ~150 para guiones hablados.",
      },
    ],
  },
  "calculadora-energia-cinetica": {
    metaTitle: "Kinetic Energy Calculator — KE = ½ mv² Online | UtiliHub",
    metaTitleEs: "Calculadora de energía cinética — KE = ½ mv² online | UtiliHub",
    metaDescription:
      "Free kinetic energy calculator. Enter mass and velocity to get KE = ½mv² in joules. Instant physics tool, no signup.",
    metaDescriptionEs:
      "Calculadora de energía cinética gratis. Ingresá masa y velocidad y obtené KE = ½mv² en julios. Física al instante, sin registro.",
    about: [
      "Kinetic energy is the energy of motion: KE = ½ × mass × velocity². With mass in kg and velocity in m/s, the result is in joules (J).",
      "Use the calculator for homework, engineering estimates or quick checks without a spreadsheet.",
    ],
    aboutEs: [
      "La energía cinética es la energía del movimiento: KE = ½ × masa × velocidad². Con masa en kg y velocidad en m/s, el resultado está en julios (J).",
      "Útil para deberes, estimaciones de ingeniería o comprobaciones rápidas sin hoja de cálculo.",
    ],
    faq: [
      {
        q: "What is the kinetic energy formula?",
        a: "KE = ½ × m × v², where m is mass and v is speed. Double the speed and kinetic energy quadruples.",
      },
      {
        q: "Which units should I use?",
        a: "SI units: kilograms and meters per second yield joules. Convert other units before entering values if needed.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuál es la fórmula de energía cinética?",
        a: "KE = ½ × m × v². Si duplicás la velocidad, la energía se multiplica por cuatro.",
      },
      {
        q: "¿Qué unidades uso?",
        a: "Sistema SI: kilogramos y metros por segundo dan julios. Convertí otras unidades antes de ingresar los valores.",
      },
    ],
  },
  "calculadora-horas-extras": {
    metaTitle: "Calculadora de Horas Extra Online — Pago Overtime | UtiliHub",
    metaTitleEs: "Calculadora de horas extra online — pago overtime | UtiliHub",
    metaDescription:
      "Calculadora de horas extra: ingresá tarifa, horas normales y horas extra con multiplicador 1,5x o 2x. Resultado de pago total al instante.",
    metaDescriptionEs:
      "Calculadora de horas extras online: tarifa por hora, horas normales y extra con 1,5x o 2x. Calculá el pago total al instante, sin registro.",
    about: [
      "An overtime pay calculator multiplies overtime hours by the hourly rate and a multiplier (often 1.5 for time-and-a-half or 2 for double time), then adds regular pay.",
      "Spanish searches such as “calculadora de horas extra” and “calcular valor hora extra online” expect a clear total with regular and overtime lines.",
    ],
    aboutEs: [
      "Una calculadora de horas extra multiplica las horas extra por la tarifa y un multiplicador (suele ser 1,5 o 2) y suma el pago de horas normales.",
      "Búsquedas como “calculadora de horas extra” o “calcular valor hora extra online” esperan un total claro con línea normal y línea extra.",
    ],
    faq: [
      {
        q: "¿Cómo se calcula el valor de la hora extra?",
        a: "Hora extra = tarifa horaria × multiplicador (por ejemplo 1,5). El total es (horas normales × tarifa) + (horas extra × tarifa × multiplicador).",
      },
      {
        q: "¿Puedo usar 1,5x y 2x?",
        a: "Sí. Elegí el multiplicador habitual de tu contrato o convenio.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el valor de la hora extra?",
        a: "Hora extra = tarifa horaria × multiplicador (por ejemplo 1,5). Total = (horas normales × tarifa) + (horas extra × tarifa × multiplicador).",
      },
      {
        q: "¿Puedo usar 1,5x y 2x?",
        a: "Sí. Usá el multiplicador de tu contrato o convenio.",
      },
    ],
  },
};
