/** SEO overrides base A2 (temperature, length, word count). */
import type { ToolSeoOverrideBase } from "./tool-seo-overrides-base-a";

export const TOOL_SEO_OVERRIDES_BASE_A2: Record<string, ToolSeoOverrideBase> = {
  "conversor-de-temperatura": {
    metaTitle: "Temperature Converter — °C, °F, Kelvin | UtiliHub",
    metaTitleEs: "Conversor de temperatura °C °F Kelvin | UtiliHub",
    metaDescription:
      "Convert Celsius, Fahrenheit, and Kelvin instantly. Free temperature converter in your browser.",
    metaDescriptionEs:
      "Convertí Celsius, Fahrenheit y Kelvin al instante. Conversor de temperatura gratis en el navegador.",
    about: [
      "Temperature scales differ by region and science context: everyday weather often uses °C or °F, while science frequently uses Kelvin.",
      "This converter applies the standard linear relationships between the scales so you can switch units for cooking, travel, or lab notes without memorizing formulas.",
      "Kelvin is an absolute scale (0 K is absolute zero). Negative Kelvin values are not physical; the tool still shows the arithmetic if you enter edge cases.",
    ],
    aboutEs: [
      "Las escalas de temperatura cambian según el país y el contexto: el clima cotidiano usa °C o °F; en ciencia suele usarse Kelvin.",
      "Este conversor aplica las relaciones lineales estándar para pasar de una unidad a otra en cocina, viajes o notas de laboratorio.",
      "Kelvin es una escala absoluta (0 K es el cero absoluto). Valores negativos de Kelvin no son físicos; la herramienta igual muestra la cuenta si ingresás casos extremos.",
    ],
    steps: [
      "Enter a value in any supported unit.",
      "Read the equivalent in the other scales.",
      "Use the result for recipes, weather, or science notes.",
    ],
    stepsEs: [
      "Ingresá un valor en cualquier unidad soportada.",
      "Leé el equivalente en las otras escalas.",
      "Usá el resultado en recetas, clima o notas científicas.",
    ],
    faq: [
      {
        q: "How do I convert °C to °F?",
        a: "°F = (°C × 9/5) + 32. Example: 20°C → 68°F.",
      },
      {
        q: "What about Kelvin?",
        a: "K = °C + 273.15. Room temperature ≈ 293 K.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo paso de °C a °F?",
        a: "°F = (°C × 9/5) + 32. Ejemplo: 20°C → 68°F.",
      },
      {
        q: "¿Y Kelvin?",
        a: "K = °C + 273.15. Temperatura ambiente ≈ 293 K.",
      },
    ],
  },

  "conversor-de-longitud": {
    metaTitle: "Length Converter — m, ft, in, km, mi | UtiliHub",
    metaTitleEs: "Conversor de longitud m pies pulgadas | UtiliHub",
    metaDescription:
      "Convert meters, feet, inches, kilometers, and miles online. Free length unit converter.",
    metaDescriptionEs:
      "Convertí metros, pies, pulgadas, kilómetros y millas online. Conversor de longitud gratis.",
    about: [
      "Length conversion bridges metric and imperial units used in construction, travel, sports, and product specs.",
      "Enter a value in one unit and read equivalents in the others. Factors follow standard SI definitions (e.g. 1 in = 25.4 mm exactly).",
      "For surveying or legal measurements, always confirm the precision and standard required in your jurisdiction.",
    ],
    aboutEs: [
      "La conversión de longitud une el sistema métrico y el imperial en obra, viajes, deporte y fichas de producto.",
      "Ingresá un valor en una unidad y mirá el resto. Los factores siguen definiciones SI habituales (p. ej. 1 in = 25.4 mm exactos).",
      "En mediciones legales o topografía, confirmá la precisión y la norma de tu jurisdicción.",
    ],
    steps: [
      "Choose the unit you have.",
      "Enter the numeric value.",
      "Read conversions to other length units.",
    ],
    stepsEs: [
      "Elegí la unidad de partida.",
      "Ingresá el valor numérico.",
      "Leé la conversión a las otras unidades.",
    ],
    faq: [
      {
        q: "How many centimeters in an inch?",
        a: "Exactly 2.54 cm per inch by international agreement.",
      },
      {
        q: "Miles vs kilometers?",
        a: "1 mile ≈ 1.60934 km. 1 km ≈ 0.621371 miles.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuántos cm tiene una pulgada?",
        a: "Exactamente 2.54 cm por pulgada, por acuerdo internacional.",
      },
      {
        q: "¿Millas y kilómetros?",
        a: "1 milla ≈ 1.60934 km. 1 km ≈ 0.621371 millas.",
      },
    ],
  },

  "contador-de-palabras": {
    metaTitle: "Word Counter — Characters, Words, Reading Time | UtiliHub",
    metaTitleEs: "Contador de palabras y caracteres online | UtiliHub",
    metaDescription:
      "Free word counter: words, characters, sentences, and estimated reading time as you type. Private, in-browser.",
    metaDescriptionEs:
      "Contador de palabras gratis: palabras, caracteres, oraciones y tiempo de lectura mientras escribís. Privado, en el navegador.",
    about: [
      "Writers, students, and marketers track word and character limits for essays, posts, and ads. A word counter updates as you type so you stay inside the limit.",
      "This tool counts words, characters (with and without spaces when available), and can estimate reading time from a typical words-per-minute assumption.",
      "Counts can differ slightly between tools depending on how hyphenated words or emojis are treated—use the same counter your publisher recommends when the limit is strict.",
    ],
    aboutEs: [
      "Escritores, estudiantes y marketers cuidan límites de palabras y caracteres en ensayos, posts y anuncios. Un contador se actualiza al escribir para no pasarte.",
      "Esta herramienta cuenta palabras, caracteres (con y sin espacios cuando aplica) y puede estimar tiempo de lectura con un ritmo típico de palabras por minuto.",
      "Los conteos pueden variar un poco entre herramientas según guiones o emojis: si el límite es estricto, usá el contador que pida tu editorial o plataforma.",
    ],
    steps: [
      "Paste or type your text.",
      "Read live word and character counts.",
      "Trim or expand the text to hit your limit.",
    ],
    stepsEs: [
      "Pegá o escribí tu texto.",
      "Mirá el conteo de palabras y caracteres en vivo.",
      "Recortá o ampliá hasta llegar al límite.",
    ],
    faq: [
      {
        q: "Does it count spaces?",
        a: "Character counts usually offer both with and without spaces. Word counts split on whitespace.",
      },
      {
        q: "Is text uploaded?",
        a: "No. Counting runs locally in your browser.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuenta los espacios?",
        a: "El conteo de caracteres suele mostrar con y sin espacios. Las palabras se separan por espacios en blanco.",
      },
      {
        q: "¿Se sube el texto?",
        a: "No. El conteo es local en tu navegador.",
      },
    ],
  },
};
