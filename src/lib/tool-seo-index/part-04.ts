// TOOL_SEO_OVERRIDES part 04 — split out of ../tool-seo-overrides.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_ATTENDANCE } from "../tool-seo-overrides-attendance";
import { TOOL_SEO_OVERRIDES_HOURS } from "../tool-seo-overrides-hours";
import { TOOL_SEO_OVERRIDES_HARMONIC_MEAN } from "../tool-seo-overrides-harmonic-mean";
import { TOOL_SEO_OVERRIDES_SYLLABLES } from "../tool-seo-overrides-syllables";
import { TOOL_SEO_OVERRIDES_TEMPERATURE } from "../tool-seo-overrides-temperature";
import { TOOL_SEO_OVERRIDES_TRIP_FUEL } from "../tool-seo-overrides-trip-fuel";
import { TOOL_SEO_OVERRIDES_GSC_QUERIES } from "../tool-seo-overrides-gsc-queries";
import { TOOL_SEO_OVERRIDES_REFERENCE } from "../tool-seo-overrides-reference";
import { TOOL_SEO_OVERRIDES_WORK } from "../tool-seo-overrides-work";
import { TOOL_SEO_OVERRIDES_POWER } from "../tool-seo-overrides-power";

export const TOOL_SEO_OVERRIDES_PART_04: Record<string, ToolSeoOverride> = {
  "calculadora-bac": {
    metaTitle: "BAC Calculator — Estimate Blood Alcohol Content | UtiliHub",
    metaTitleEs: "Calculadora de alcoholemia (BAC) — fórmula de Widmark | UtiliHub",
    metaDescription:
      "Free BAC estimator. Enter number of standard drinks, body weight, gender and hours since first drink. Approximate Widmark calculation in the browser.",
    metaDescriptionEs:
      "Calculadora de alcoholemia gratis (BAC). Ingresá bebidas estándar, peso, sexo y horas desde la primera bebida para estimar el BAC con la fórmula de Widmark. Cálculo local, sin registro.",
    about: [
      "The BAC calculator estimates blood alcohol content with the Widmark formula from the number of standard drinks, body weight, gender, and hours elapsed since the first drink.",
      "The result is an approximation only: real BAC depends on food, metabolism, and drinking pace. Never use it to decide whether you can drive.",
    ],
    aboutEs: [
      "La calculadora de alcoholemia estima el BAC con la fórmula de Widmark a partir de bebidas estándar, peso corporal, sexo y horas transcurridas desde la primera bebida.",
      "El resultado es solo una aproximación: el BAC real depende de la comida, el metabolismo y el ritmo de consumo. Nunca lo uses para decidir si podés conducir.",
    ],
    steps: [
      "Enter how many standard drinks you had, your body weight, and your gender.",
      "Enter the hours elapsed since your first drink.",
      "Read the estimated BAC and the safety note; remember it is an estimate, not a measurement.",
    ],
    stepsEs: [
      "Ingresá cuántas bebidas estándar tomiste, tu peso corporal y tu sexo.",
      "Ingresá las horas transcurridas desde la primera bebida.",
      "Leé el BAC estimado y la advertencia: es un estimado, no una medición.",
    ],
    faq: [
      {
        q: "How accurate is this?",
        a: "This is a rough estimate only. Real BAC depends on many factors. Never use it to decide if you can drive.",
      },
      {
        q: "What is a standard drink?",
        a: "Approximately 14 grams of pure alcohol (one beer, one glass of wine, or one shot).",
      },
    ],
    faqEs: [
      {
        q: "¿Qué tan preciso es el resultado?",
        a: "Es solo un estimado aproximado. El BAC real depende de muchos factores. Nunca lo uses para decidir si podés conducir.",
      },
      {
        q: "¿Qué es una bebida estándar?",
        a: "Aproximadamente 14 gramos de alcohol puro (una cerveza, una copa de vino o un trago).",
      },
    ],
  },
  "generador-codigo-qr": {
    metaTitle: "QR Code Generator — Create QR codes online free | UtiliHub",
    metaTitleEs: "Generador de código QR gratis — crear QR de texto o URL | UtiliHub",
    metaDescription:
      "Free online QR code generator. Enter text or a URL to generate a QR code instantly and download it as PNG. No signup, runs in your browser.",
    metaDescriptionEs:
      "Generador de código QR gratis: escribí texto o una URL y descargá el QR en PNG al instante. Sin registro, todo se genera en tu navegador.",
    about: [
      "A QR code encodes text, a URL, a phone number, or a short message in a square pattern any phone camera can scan.",
      "This generator builds the QR locally in your browser and lets you download it as a PNG image ready to print or share.",
    ],
    aboutEs: [
      "Un código QR codifica texto, una URL, un número de teléfono o un mensaje corto en un patrón que cualquier cámara de celular puede escanear.",
      "Este generador crea el QR localmente en tu navegador y te permite descargarlo como imagen PNG lista para imprimir o compartir.",
    ],
    steps: [
      "Type or paste the text or URL you want to encode.",
      "The QR updates instantly; scan it with a phone to test it.",
      "Download it as PNG or share it wherever you need it.",
    ],
    stepsEs: [
      "Escribí o pegá el texto o la URL que querés codificar.",
      "El QR se actualiza al instante; escanealo con un celular para probarlo.",
      "Descargalo como PNG o compartilo donde lo necesites.",
    ],
    faq: [
      {
        q: "What can I encode in a QR code?",
        a: "Any text, URL, phone number, or short message. Very long text produces a denser QR that is harder to scan.",
      },
      {
        q: "Do QR codes expire?",
        a: "No. A static QR stores the content in the pattern itself, so it works forever and needs no server.",
      },
      {
        q: "Is the QR generated locally?",
        a: "Yes. The QR is created entirely in your browser and nothing is uploaded.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué puedo codificar en un código QR?",
        a: "Cualquier texto, URL, número de teléfono o mensaje corto. Un texto muy largo genera un QR más denso y difícil de escanear.",
      },
      {
        q: "¿Vencen los códigos QR?",
        a: "No. Un QR estático guarda el contenido en el propio patrón, así que funciona siempre y no necesita servidor.",
      },
      {
        q: "¿El QR se genera localmente?",
        a: "Sí. El código se crea por completo en tu navegador y no se sube ningún dato.",
      },
    ],
  },
  "calculadora-porciones-pizza": {
    metaTitle: "Pizza Portions Calculator — How Many Pizzas to Order | UtiliHub",
    metaTitleEs: "Calculadora de porciones de pizza — cuántas pizzas pedir | UtiliHub",
    metaDescription:
      "Free pizza portions calculator: enter guests, slices per person and slices per pizza to get how many pizzas to order. Formula included, runs in your browser.",
    metaDescriptionEs:
      "Calculadora de porciones de pizza gratis: ingresá personas, porciones por persona y porciones por pizza para saber cuántas pizzas pedir. Con fórmula, en el navegador.",
    about: [
      "Pizzas needed = ceil(guests × slices per person ÷ slices per pizza). Example: 10 guests, 3 slices each, 8-slice pizzas → ceil(30 ÷ 8) = 4 pizzas.",
      "Typical appetite: 2–4 slices per adult and 1–2 per child; add a slice per person if there are few side dishes.",
    ],
    aboutEs: [
      "Pizzas necesarias = techo(personas × porciones por persona ÷ porciones por pizza). Ejemplo: 10 personas, 3 porciones cada una, pizzas de 8 porciones → techo(30 ÷ 8) = 4 pizzas.",
      "Apetito típico: 2–4 porciones por adulto y 1–2 por niño; sumá una porción por persona si hay pocos acompañamientos.",
    ],
    steps: [
      "Enter the number of guests.",
      "Enter slices per person and slices per pizza.",
      "Read how many pizzas to order, rounded up.",
    ],
    stepsEs: [
      "Ingresá la cantidad de personas.",
      "Ingresá porciones por persona y porciones por pizza.",
      "Leé cuántas pizzas pedir, redondeado hacia arriba.",
    ],
    faq: [
      {
        q: "How many pizzas for 10 people?",
        a: "With 3 slices per person and 8-slice pizzas: 10 × 3 ÷ 8 = 3.75, rounded up to 4 pizzas.",
      },
      {
        q: "How many slices per person should I plan?",
        a: "Adults usually eat 2–4 slices and kids 1–2. Adjust for appetite and how much other food you serve.",
      },
      {
        q: "Why round up?",
        a: "You cannot order a fraction of a pizza, so the tool always rounds up to the next whole pizza.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuántas pizzas para 10 personas?",
        a: "Con 3 porciones por persona y pizzas de 8 porciones: 10 × 3 ÷ 8 = 3,75, redondeado a 4 pizzas.",
      },
      {
        q: "¿Cuántas porciones por persona debo calcular?",
        a: "Los adultos suelen comer 2–4 porciones y los niños 1–2. Ajustá según el apetito y la comida que acompañe.",
      },
      {
        q: "¿Por qué se redondea hacia arriba?",
        a: "No se puede pedir una fracción de pizza, así que la herramienta siempre redondea a la pizza entera siguiente.",
      },
    ],
  },
  "calculadora-tmb": {
    metaTitle: "BMR Calculator — Mifflin-St Jeor, kcal/day | UtiliHub",
    metaTitleEs: "Calculadora TMB — tasa metabólica basal (Mifflin-St Jeor) | UtiliHub",
    metaDescription:
      "Free BMR calculator using the Mifflin-St Jeor equation: enter age, weight, height and sex to get your basal metabolic rate in kcal/day. No signup.",
    metaDescriptionEs:
      "Calculadora de TMB gratis con la ecuación de Mifflin-St Jeor: ingresá edad, peso, altura y sexo y obtené tu tasa metabólica basal en kcal/día. Sin registro.",
    about: [
      "BMR (basal metabolic rate) is the energy your body burns at rest. This tool uses the Mifflin-St Jeor equation, in kcal/day.",
      "Formula: men: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5; women: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161.",
      "Example: 30-year-old man, 75 kg, 178 cm → 10 × 75 + 6.25 × 178 − 5 × 30 + 5 = 1,717.5 kcal/day. Multiply BMR by an activity factor (about 1.2–1.9) to estimate total daily needs (TDEE).",
    ],
    aboutEs: [
      "La TMB (tasa metabólica basal) es la energía que tu cuerpo quema en reposo. Esta herramienta usa la ecuación de Mifflin-St Jeor, en kcal/día.",
      "Fórmula: varones: TMB = 10 × peso(kg) + 6,25 × altura(cm) − 5 × edad + 5; mujeres: TMB = 10 × peso(kg) + 6,25 × altura(cm) − 5 × edad − 161.",
      "Ejemplo: varón de 30 años, 75 kg y 178 cm → 10 × 75 + 6,25 × 178 − 5 × 30 + 5 = 1.717,5 kcal/día. Multiplicá la TMB por un factor de actividad (aprox. 1,2–1,9) para estimar el gasto total diario (TDEE).",
    ],
    steps: [
      "Enter your age in years, weight in kilograms and height in centimeters.",
      "Select your sex (1 = male, 0 = female).",
      "Read your BMR in kcal/day; multiply by your activity level for total daily calories.",
    ],
    stepsEs: [
      "Ingresá tu edad en años, peso en kilogramos y altura en centímetros.",
      "Elegí tu sexo (1 = varón, 0 = mujer).",
      "Leé tu TMB en kcal/día; multiplicala por tu nivel de actividad para el total de calorías diarias.",
    ],
    faq: [
      {
        q: "What is the Mifflin-St Jeor equation?",
        a: "BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5 for men, and − 161 instead of + 5 for women. It is the standard estimate for basal metabolic rate.",
      },
      {
        q: "What is the difference between BMR and TDEE?",
        a: "BMR is the energy burned at rest. TDEE multiplies BMR by an activity factor (about 1.2 sedentary to 1.9 very active) and represents total daily calorie needs.",
      },
      {
        q: "Is BMR the same for men and women?",
        a: "The formula differs by a constant (+5 for men, −161 for women) because average body composition differs. It is an estimate, not a medical measurement.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué es la ecuación de Mifflin-St Jeor?",
        a: "TMB = 10 × peso(kg) + 6,25 × altura(cm) − 5 × edad + 5 en varones, y − 161 en lugar de + 5 en mujeres. Es la estimación estándar de la tasa metabólica basal.",
      },
      {
        q: "¿Cuál es la diferencia entre TMB y TDEE?",
        a: "La TMB es la energía en reposo. El TDEE multiplica la TMB por un factor de actividad (aprox. 1,2 sedentario a 1,9 muy activo) y representa las calorías totales del día.",
      },
      {
        q: "¿La TMB es igual para hombres y mujeres?",
        a: "La fórmula cambia por una constante (+5 varones, −161 mujeres) por diferencias medias de composición corporal. Es una estimación, no una medición médica.",
      },
    ],
  },
  "calculadora-precio-original-descuento": {
    metaTitle: "Original Price from Discount Calculator — Price before the Sale | UtiliHub",
    metaTitleEs: "Calculadora del precio original antes de un descuento | UtiliHub",
    metaDescription:
      "Find the original price before a percentage discount: original = final / (1 - d/100). Example: 80 after 20% off was 100. Free, in your browser.",
    metaDescriptionEs:
      "Obtené el precio original antes de un descuento porcentual: original = final / (1 − d/100). Ejemplo: 80 con 20% de descuento era 100. Gratis, en el navegador.",
    about: [
      "The original price is the discounted price divided by (1 - discount/100): divide by the fraction of the price that was actually paid.",
      "Example: a product that costs 80 after a 20% discount cost 80 / 0.8 = 100 before the discount.",
      "A 100% or higher discount has no original price (division by zero), so the tool rejects those values.",
    ],
    aboutEs: [
      "El precio original es el precio con descuento dividido por (1 − descuento/100): se divide por la fracción del precio efectivamente pagada.",
      "Ejemplo: un producto que cuesta 80 tras un descuento del 20% costaba 80 / 0,8 = 100 antes del descuento.",
      "Un descuento del 100% o más no tiene precio original (división por cero), así que la herramienta rechaza esos valores.",
    ],
    steps: [
      "Enter the final price you paid (or saw advertised).",
      "Enter the discount percentage applied.",
      "Read the original price; copy it if you need it elsewhere.",
    ],
    stepsEs: [
      "Ingresá el precio final que pagaste (o viste anunciado).",
      "Ingresá el porcentaje de descuento aplicado.",
      "Leé el precio original; copialo si lo necesitás en otro lado.",
    ],
    faq: [
      {
        q: "What is the formula for the original price?",
        a: "Original = final price / (1 - discount%/100). Example: 80 with 20% off → 80 / 0.8 = 100.",
      },
      {
        q: "What if the discount is 100%?",
        a: "The final price would be 0 and the original price is undefined (division by zero). The tool rejects discounts of 100% or higher.",
      },
      {
        q: "Is this the same as applying a discount?",
        a: "No. Applying a discount multiplies by (1 - d/100); this tool undoes it with the inverse division, and the two operations cancel each other.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuál es la fórmula del precio original?",
        a: "Original = precio final / (1 − descuento%/100). Ejemplo: 80 con 20% de descuento → 80 / 0,8 = 100.",
      },
      {
        q: "¿Qué pasa si el descuento es del 100%?",
        a: "El precio final sería 0 y el precio original queda indefinido (división por cero). La herramienta rechaza descuentos del 100% o más.",
      },
      {
        q: "¿Es lo mismo que aplicar un descuento?",
        a: "No. Aplicar un descuento multiplica por (1 − d/100); esta herramienta lo deshace con la división inversa, y ambas operaciones se cancelan entre sí.",
      },
    ],
  },
  ...TOOL_SEO_OVERRIDES_ATTENDANCE,
  ...TOOL_SEO_OVERRIDES_HOURS,
  ...TOOL_SEO_OVERRIDES_HARMONIC_MEAN,
  ...TOOL_SEO_OVERRIDES_SYLLABLES,
  ...TOOL_SEO_OVERRIDES_TEMPERATURE,
  ...TOOL_SEO_OVERRIDES_TRIP_FUEL,
  ...TOOL_SEO_OVERRIDES_GSC_QUERIES,
  ...TOOL_SEO_OVERRIDES_REFERENCE,
  ...TOOL_SEO_OVERRIDES_WORK,
  ...TOOL_SEO_OVERRIDES_POWER,
};
