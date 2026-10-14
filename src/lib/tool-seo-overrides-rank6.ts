import type { ToolSeoOverride } from "./tool-seo-overrides";

/**
 * SEO rank pass #2: another 5 high-intent tools.
 * Spread after RANK5 so these win on their slugs.
 */
export const TOOL_SEO_OVERRIDES_RANK6: Record<string, ToolSeoOverride> = {
  imc: {
    metaTitle: "BMI Calculator Free — kg & cm, WHO Categories | UtiliHub",
    metaTitleEs: "Calculadora de IMC online gratis — kg, cm y categorías OMS | UtiliHub",
    metaDescription:
      "Calculate body mass index from weight (kg) and height (cm). See WHO category instantly. Free BMI calculator, no signup, private in your browser.",
    metaDescriptionEs:
      "Calculá el índice de masa corporal con peso (kg) y altura (cm). Categoría OMS al instante. Calculadora de IMC gratis, sin registro, en el navegador.",
    about: [
      "BMI (body mass index) is weight in kilograms divided by height in meters squared: BMI = kg / m². If height is in cm, convert to meters first (divide by 100).",
      "Example: 70 kg and 175 cm → 70 / 1.75² ≈ 22.9 (normal range for adults).",
      "WHO adult ranges: under 18.5 underweight; 18.5–24.9 normal; 25–29.9 overweight; 30+ obesity. BMI is a screening number, not a full health diagnosis.",
    ],
    aboutEs: [
      "El IMC (índice de masa corporal) es el peso en kilogramos dividido por la altura en metros al cuadrado: IMC = kg / m². Si la altura está en cm, pasala a metros (÷ 100).",
      "Ejemplo: 70 kg y 175 cm → 70 / 1,75² ≈ 22,9 (rango normal en adultos).",
      "Umbrales OMS en adultos: <18,5 bajo peso; 18,5–24,9 normal; 25–29,9 sobrepeso; ≥30 obesidad. El IMC es una cifra de cribado, no un diagnóstico médico completo.",
    ],
    steps: [
      "Enter weight in kilograms.",
      "Enter height in centimeters.",
      "Read BMI and WHO category.",
    ],
    stepsEs: [
      "Ingresá el peso en kilogramos.",
      "Ingresá la altura en centímetros.",
      "Leé el IMC y la categoría según la OMS.",
    ],
    faq: [
      {
        q: "How do I calculate BMI with kg and cm?",
        a: "BMI = kg ÷ (cm ÷ 100)². Example: 80 kg and 170 cm → 80 / 1.70² ≈ 27.7.",
      },
      {
        q: "Is BMI the same for children?",
        a: "No. Children and teens need age- and sex-specific charts; adult cut-offs do not apply.",
      },
      {
        q: "Is this BMI calculator free?",
        a: "Yes. It runs in your browser with no account required.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el IMC con kg y cm?",
        a: "IMC = kg ÷ (cm ÷ 100)². Ejemplo: 80 kg y 170 cm → 80 / 1,70² ≈ 27,7.",
      },
      {
        q: "¿Qué IMC es normal?",
        a: "En adultos, la OMS ubica el rango normal entre 18,5 y 24,9.",
      },
      {
        q: "¿Hay calculadora de IMC online gratis?",
        a: "Sí. Esta herramienta calcula el IMC y la categoría en el navegador, sin registro.",
      },
      {
        q: "¿El IMC sirve para niños?",
        a: "No de la misma forma: en menores se usan percentiles por edad y sexo.",
      },
    ],
  },

  "tiempo-lectura": {
    metaTitle: "Reading Time Calculator — Words to Minutes Online | UtiliHub",
    metaTitleEs: "Calculadora de tiempo de lectura online — palabras a minutos | UtiliHub",
    metaDescription:
      "Estimate how long a text takes to read. Paste words, get minutes at a realistic WPM. Free reading time calculator, no signup.",
    metaDescriptionEs:
      "Estimá cuánto tarda leer un texto. Pegá las palabras y obtené minutos a un ritmo realista. Calculadora de tiempo de lectura gratis, sin registro.",
    about: [
      "Reading time is usually words ÷ words-per-minute. Many tools default near 200–250 WPM for adult silent reading; technical text is slower.",
      "Paste a draft to plan articles, scripts, or study sessions. Counting runs locally in the browser.",
      "Adjust expectations for skimming vs careful reading — the estimate is a planning aid, not a stopwatch.",
    ],
    aboutEs: [
      "El tiempo de lectura suele ser palabras ÷ palabras por minuto. Muchas herramientas usan cerca de 200–250 ppm en lectura silenciosa adulta; el texto técnico es más lento.",
      "Pegá un borrador para planificar artículos, guiones o estudio. El conteo corre en el navegador.",
      "Ajustá la expectativa si leés en diagonal o con mucho detalle: es una ayuda de planificación, no un cronómetro exacto.",
    ],
    steps: [
      "Paste or type the text.",
      "Review word count and estimated minutes.",
      "Trim or expand the draft if needed.",
    ],
    stepsEs: [
      "Pegá o escribí el texto.",
      "Revisá el conteo de palabras y los minutos estimados.",
      "Recortá o ampliá el borrador si hace falta.",
    ],
    faq: [
      {
        q: "How is reading time calculated?",
        a: "Typically total words divided by an assumed reading speed (e.g. ~200 words per minute).",
      },
      {
        q: "Is my text uploaded?",
        a: "No. Estimation runs locally in your browser.",
      },
      {
        q: "Why does another tool show different minutes?",
        a: "Different default WPM or word-splitting rules change the result slightly.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el tiempo de lectura?",
        a: "En general: total de palabras ÷ ritmo (p. ej. ~200 palabras por minuto).",
      },
      {
        q: "¿Se sube el texto?",
        a: "No. El cálculo es local en tu navegador.",
      },
      {
        q: "¿Por qué otro sitio da minutos distintos?",
        a: "Cambian el ritmo por defecto o la forma de contar palabras.",
      },
      {
        q: "¿Hay calculadora de tiempo de lectura gratis?",
        a: "Sí. Esta herramienta estima minutos sin registro ni instalación.",
      },
    ],
  },

  "generador-de-contrasenas": {
    metaTitle: "Password Generator Free — Strong Random Passwords Online | UtiliHub",
    metaTitleEs: "Generador de contraseñas seguras online gratis — aleatorias | UtiliHub",
    metaDescription:
      "Create strong random passwords in your browser. Choose length, symbols and character sets. Free password generator, nothing uploaded.",
    metaDescriptionEs:
      "Creá contraseñas aleatorias fuertes en el navegador. Elegí longitud, símbolos y tipos de caracteres. Generador gratis; no se sube nada.",
    about: [
      "A password generator builds random strings so you avoid human patterns. Prefer long unique passwords stored in a password manager.",
      "This tool uses the browser’s cryptographic randomness (crypto.getRandomValues). Generation is local — the password is not sent to a server.",
      "Enable 2FA where available and never reuse the same password on important accounts.",
    ],
    aboutEs: [
      "Un generador de contraseñas arma cadenas al azar para evitar patrones humanos. Preferí claves largas y únicas guardadas en un gestor.",
      "Esta herramienta usa aleatoriedad criptográfica del navegador (crypto.getRandomValues). La generación es local: la clave no se envía a un servidor.",
      "Activá 2FA donde exista y no reutilices la misma contraseña en cuentas importantes.",
    ],
    steps: [
      "Set length and character options.",
      "Generate a password.",
      "Copy it into your password manager.",
    ],
    stepsEs: [
      "Definí longitud y opciones de caracteres.",
      "Generá la contraseña.",
      "Copiala a tu gestor de contraseñas.",
    ],
    faq: [
      {
        q: "How long should a password be?",
        a: "12–16+ random characters is a solid baseline for most accounts; critical ones can go longer.",
      },
      {
        q: "Are generated passwords stored online?",
        a: "No. They only exist in your browser session until you copy or leave the page.",
      },
      {
        q: "Is this password generator free?",
        a: "Yes. No signup and no upload of the generated string.",
      },
    ],
    faqEs: [
      {
        q: "¿De qué longitud debe ser una contraseña segura?",
        a: "12–16+ caracteres aleatorios es un buen piso para la mayoría; en cuentas críticas, más largo aún.",
      },
      {
        q: "¿Se guardan las contraseñas generadas?",
        a: "No. Solo existen en la sesión del navegador hasta que las copiás o salís de la página.",
      },
      {
        q: "¿Hay generador de contraseñas online gratis?",
        a: "Sí. Este genera claves fuertes en el navegador, sin registro y sin subir datos.",
      },
      {
        q: "¿Puedo evitar caracteres confusos?",
        a: "Sí, si la herramienta ofrece excluir símbolos ambiguos (0/O, 1/l, etc.).",
      },
    ],
  },

  "calculadora-de-porcentajes": {
    metaTitle: "Percentage Calculator Free — Of, Change & Discount | UtiliHub",
    metaTitleEs: "Calculadora de porcentajes online gratis — de un monto, cambio y descuento | UtiliHub",
    metaDescription:
      "Calculate percentage of a number, what percent X is of Y, and percentage change or discount. Free percentage calculator, no signup.",
    metaDescriptionEs:
      "Calculá el porcentaje de un número, qué % es X de Y, y el cambio o descuento porcentual. Calculadora de porcentajes gratis, sin registro.",
    about: [
      "A percentage is a part per hundred. “15% of 240” means 240 × 15 ÷ 100 = 36.",
      "Common cases: percentage of an amount, ratio as a percent, and percentage change between two values (including discounts).",
      "All results update in the browser; enter decimals as needed.",
    ],
    aboutEs: [
      "Un porcentaje es una parte por cada cien. “El 15% de 240” es 240 × 15 ÷ 100 = 36.",
      "Casos habituales: porcentaje de un monto, qué porcentaje representa un valor de otro, y cambio porcentual entre dos cifras (incluye descuentos).",
      "Los resultados se actualizan en el navegador; podés usar decimales.",
    ],
    steps: [
      "Choose the calculation type.",
      "Enter the two numbers.",
      "Read the result and formula.",
    ],
    stepsEs: [
      "Elegí el tipo de cálculo.",
      "Ingresá los dos números.",
      "Leé el resultado y la fórmula.",
    ],
    faq: [
      {
        q: "How do I calculate a percentage of a number?",
        a: "Multiply the number by the percent and divide by 100. Example: 20% of 50 = 10.",
      },
      {
        q: "How do I calculate a discount?",
        a: "Use percentage change from original to sale price, or apply the discount rate to the original price.",
      },
      {
        q: "How do I remove tax from a price?",
        a: "Divide the tax-inclusive price by (1 + rate). With 21% VAT: price ÷ 1.21.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calcular el porcentaje de un número?",
        a: "Multiplicá el número por el porcentaje y dividí por 100. Ejemplo: 20% de 50 = 10.",
      },
      {
        q: "¿Cómo calcular un descuento?",
        a: "Usá el cambio porcentual entre precio original y final, o aplicá el % de descuento al precio original.",
      },
      {
        q: "¿Cómo sacar el IVA de un precio?",
        a: "Dividí el precio con impuesto por (1 + tasa). Con IVA 21%: precio ÷ 1,21.",
      },
      {
        q: "¿Hay calculadora de porcentajes online gratis?",
        a: "Sí. Esta resuelve % de un monto, proporción y cambio, sin registro.",
      },
    ],
  },

  promedio: {
    metaTitle: "Average Calculator Free — Arithmetic Mean Online | UtiliHub",
    metaTitleEs: "Calculadora de promedio online gratis — media aritmética | UtiliHub",
    metaDescription:
      "Calculate the arithmetic mean of a list of numbers. Free average calculator in your browser, no signup.",
    metaDescriptionEs:
      "Calculá la media aritmética de una lista de números. Calculadora de promedio gratis en el navegador, sin registro.",
    about: [
      "The arithmetic mean (average) is the sum of values divided by how many values you have.",
      "Outliers can pull the average up or down; for skewed data, also check the median.",
      "Computation is local — your numbers do not need to leave the device.",
    ],
    aboutEs: [
      "La media aritmética (promedio) es la suma de los valores dividida por la cantidad de datos.",
      "Los valores extremos pueden mover el promedio; en datos sesgados, mirá también la mediana.",
      "El cálculo es local: tus números no necesitan salir del dispositivo.",
    ],
    steps: [
      "Enter or paste a list of numbers.",
      "Calculate the arithmetic mean.",
      "Optionally compare with median on related tools.",
    ],
    stepsEs: [
      "Ingresá o pegá una lista de números.",
      "Calculá la media aritmética.",
      "Si hace falta, compará con la mediana en herramientas relacionadas.",
    ],
    faq: [
      {
        q: "How do I calculate an average?",
        a: "Add all numbers, then divide by the count of numbers. Example: (2+4+6)/3 = 4.",
      },
      {
        q: "Average vs mean?",
        a: "In everyday use “average” usually means the arithmetic mean.",
      },
      {
        q: "Is this average calculator free?",
        a: "Yes. It runs in the browser with no account.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula un promedio?",
        a: "Sumá todos los números y dividí por la cantidad. Ejemplo: (2+4+6)/3 = 4.",
      },
      {
        q: "¿Promedio y media aritmética son lo mismo?",
        a: "En el uso cotidiano, sí: el promedio suele referirse a la media aritmética.",
      },
      {
        q: "¿Hay calculadora de promedio online gratis?",
        a: "Sí. Esta calcula la media en el navegador, sin registro.",
      },
      {
        q: "¿Qué pasa si hay valores atípicos?",
        a: "Pueden sesgar el promedio; conviene mirar también la mediana.",
      },
    ],
  },
};
