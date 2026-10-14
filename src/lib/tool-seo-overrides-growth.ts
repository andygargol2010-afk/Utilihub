/** Unique SEO for SEO-growth tools (calculadora-imc, gpa, jwt, etc.). Avoid generic makeTool defaults. */

export type ToolSeoOverrideGrowth = {
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  about: string[];
  aboutEs?: string[];
  steps: string[];
  stepsEs?: string[];
  faq: { q: string; a: string }[];
  faqEs?: { q: string; a: string }[];
};

export const TOOL_SEO_OVERRIDES_GROWTH: Record<string, ToolSeoOverrideGrowth> = {
  "imc": {
    metaTitle: "BMI Formula Calculator — Weight & Height in kg/cm | UtiliHub",
    metaTitleEs: "Calculadora de IMC — fórmula con peso y altura (kg/cm) | UtiliHub",
    metaDescription:
      "BMI formula calculator in metric units: enter weight in kg and height in cm, get your body mass index and WHO category instantly. Free, no signup.",
    metaDescriptionEs:
      "Calculadora de IMC con fórmula en unidades métricas: ingresá peso en kg y altura en cm y obtené tu índice de masa corporal y la categoría OMS. Gratis, sin registro.",
    about: [
      "The BMI formula is weight in kilograms divided by height in meters squared: BMI = kg / m². With height in centimeters, divide by 100 first.",
      "Example: 70 kg and 175 cm give 70 / 1.75² = 22.9, in the normal range.",
      "Categories follow the WHO adult cut-offs: under 18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30 and above obesity.",
    ],
    aboutEs: [
      "La fórmula del IMC es peso en kilogramos dividido por la altura en metros al cuadrado: IMC = kg / m². Si la altura está en centímetros, dividí por 100 primero.",
      "Ejemplo: 70 kg y 175 cm dan 70 / 1,75² = 22,9, dentro del rango normal.",
      "Las categorías siguen los umbrales de la OMS en adultos: menos de 18,5 bajo peso; 18,5–24,9 normal; 25–29,9 sobrepeso; 30 o más obesidad.",
    ],
    steps: [
      "Enter your weight in kilograms.",
      "Enter your height in centimeters.",
      "Calculate to read your BMI and its WHO category.",
    ],
    stepsEs: [
      "Ingresá tu peso en kilogramos.",
      "Ingresá tu altura en centímetros.",
      "Calculá para leer tu IMC y su categoría según la OMS.",
    ],
    faq: [
      {
        q: "How do I calculate BMI with kg and cm?",
        a: "BMI = weight in kg divided by (height in cm / 100) squared. Example: 80 kg and 170 cm → 80 / 1.70² = 27.7.",
      },
      {
        q: "Is BMI different for children?",
        a: "Yes. Children and teens use age- and sex-specific percentile charts; these adult cut-offs do not apply.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el IMC con kg y cm?",
        a: "IMC = peso en kg dividido por (altura en cm / 100) al cuadrado. Ejemplo: 80 kg y 170 cm → 80 / 1,70² = 27,7.",
      },
      {
        q: "¿El IMC es igual en niños?",
        a: "No. En niños y adolescentes se usan curvas de percentiles por edad y sexo; estos umbrales de adulto no aplican.",
      },
    ],
  },

  "calculadora-imc": {
    metaTitle: "BMI Calculator — Free Body Mass Index Online | UtiliHub",
    metaTitleEs: "Calculadora de IMC online gratis | UtiliHub",
    metaDescription:
      "Free BMI calculator: enter weight and height, get your body mass index and WHO category in seconds. Private, no signup.",
    metaDescriptionEs:
      "Calculadora de IMC gratis: ingresá peso y altura y obtené tu índice de masa corporal y la categoría OMS al instante. Sin registro.",
    about: [
      "Body mass index (BMI) is weight in kilograms divided by height in meters squared. It is a screening number, not a full health diagnosis.",
      "This calculator uses the standard WHO adult cut-offs: under 18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30+ obesity.",
      "Athletes and older adults can have misleading BMI because muscle and fat distribution differ. Use the result as a starting point, not medical advice.",
    ],
    aboutEs: [
      "El índice de masa corporal (IMC) es el peso en kilogramos dividido por la altura en metros al cuadrado. Es un indicador de cribado, no un diagnóstico.",
      "Usamos los umbrales habituales de la OMS en adultos: menos de 18,5 bajo peso; 18,5–24,9 normal; 25–29,9 sobrepeso; 30 o más obesidad.",
      "En deportistas o personas mayores el IMC puede engañar por la masa muscular. Tomalo como orientación, no como consejo médico.",
    ],
    steps: [
      "Enter weight in kilograms and height in centimeters.",
      "Calculate to get BMI and the category label.",
      "Compare with related tools such as ideal weight if you need more context.",
    ],
    stepsEs: [
      "Ingresá peso en kg y altura en cm.",
      "Calculá para ver el IMC y la categoría.",
      "Si querés más contexto, usá también la calculadora de peso ideal.",
    ],
    faq: [
      {
        q: "Is BMI the same for men and women?",
        a: "The formula is the same. Interpretation categories are usually shared for adults; individual health still depends on many other factors.",
      },
      {
        q: "Do you store my weight?",
        a: "No. The calculation runs in your browser and is not sent to a server for this tool.",
      },
    ],
    faqEs: [
      {
        q: "¿El IMC es igual para hombres y mujeres?",
        a: "La fórmula es la misma. Las categorías de adultos suelen compartirse; la salud individual depende de muchos más factores.",
      },
      {
        q: "¿Guardan mi peso?",
        a: "No. El cálculo corre en tu navegador y no se envía a un servidor en esta herramienta.",
      },
    ],
  },

  "tiempo-lectura": {
    metaTitle: "Words to Minutes Calculator — Reading Time Free | UtiliHub",
    metaTitleEs: "Calculadora words to minutes — Tiempo de lectura gratis | UtiliHub",
    metaDescription:
      "Convert words to minutes of reading time. Paste text or enter word count — adjust WPM. Free estimator, no signup.",
    metaDescriptionEs:
      "Pasá de palabras a minutos de lectura. Pegá texto o ingresá el conteo y ajustá PPM. Estimador gratis, sin registro.",
    about: [
      "Reading-time widgets usually divide word count by a speed such as 200–250 words per minute for adult silent reading.",
      "Paste full text or enter a raw word count. Adjust WPM for technical material (slower) or skimming (faster).",
      "Screen density, language, and images change real duration—this is a planning estimate for blogs and docs.",
    ],
    aboutEs: [
      "Los widgets de tiempo de lectura dividen las palabras por una velocidad típica de 200–250 ppm en lectura silenciosa adulta.",
      "Pegá el texto o un número de palabras. Bajá el PPM en material técnico y subilo si solo se hojea.",
      "Pantalla, idioma e imágenes cambian la duración real: es una estimación para blogs y documentación.",
    ],
    steps: [
      "Paste text or enter a word count.",
      "Optionally set words per minute (default 200).",
      "Read estimated minutes (and seconds if shown).",
    ],
    stepsEs: [
      "Pegá el texto o ingresá un conteo de palabras.",
      "Opcional: definí palabras por minuto (por defecto 200).",
      "Leé los minutos estimados.",
    ],
    faq: [
      {
        q: "What WPM should I use?",
        a: "About 200–250 for adult silent reading; lower for dense technical text.",
      },
      {
        q: "Is this exact?",
        a: "No—it is an estimate. Images, layout, and language change real time.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué PPM uso?",
        a: "Unos 200–250 en lectura silenciosa adulta; menos en texto técnico denso.",
      },
      {
        q: "¿Es exacto?",
        a: "No: es una estimación. Imágenes, diseño e idioma cambian el tiempo real.",
      },
    ],
  },
};
