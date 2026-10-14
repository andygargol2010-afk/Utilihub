import type { ToolSeoOverride } from "./tool-seo-overrides";

/**
 * SEO rank pass: 5 high-intent tools with search demand.
 * Titles/meta/FAQ tuned for CTR + long-tail questions (ES + EN).
 * Spread last so these win over older overrides.
 */
export const TOOL_SEO_OVERRIDES_RANK5: Record<string, ToolSeoOverride> = {
  calculadora: {
    metaTitle: "Online Calculator Free — Basic Math in Your Browser | UtiliHub",
    metaTitleEs: "Calculadora online gratis — suma, resta, × y ÷ | UtiliHub",
    metaDescription:
      "Free online calculator for add, subtract, multiply and divide. Keyboard support, history, no signup. Works offline in your browser.",
    metaDescriptionEs:
      "Calculadora online gratis para sumar, restar, multiplicar y dividir. Teclado físico, historial y sin registro. Funciona en el navegador.",
    about: [
      "A basic online calculator handles the four operations plus percent. Use the on-screen pad or your keyboard; session history shows recent results.",
      "All math runs locally with standard floating-point precision — nothing is sent to a server for this tool.",
      "Ideal when you need a quick answer without installing an app or signing up.",
    ],
    aboutEs: [
      "Una calculadora online básica resuelve suma, resta, multiplicación, división y porcentaje. Podés usar el teclado del dispositivo o los botones en pantalla, con historial de resultados recientes.",
      "Todo el cálculo es local con precisión de punto flotante: no se envía nada a un servidor en esta herramienta.",
      "Útil cuando necesitás un resultado rápido sin instalar apps ni crear cuenta.",
    ],
    steps: [
      "Enter the first number.",
      "Choose an operation (+, −, ×, ÷ or %).",
      "Enter the second number and press = or Enter.",
    ],
    stepsEs: [
      "Ingresá el primer número.",
      "Elegí la operación (+, −, ×, ÷ o %).",
      "Ingresá el segundo número y pulsá = o Enter.",
    ],
    faq: [
      {
        q: "Is this calculator free?",
        a: "Yes. It runs in the browser with no account, install, or payment.",
      },
      {
        q: "Can I use my keyboard?",
        a: "Yes. Digits, operators, Enter, Escape, and Backspace are supported.",
      },
      {
        q: "Are results stored online?",
        a: "No. Calculation is local; only your session history stays on the device.",
      },
    ],
    faqEs: [
      {
        q: "¿Hay una calculadora online gratis sin registro?",
        a: "Sí. Esta calculadora funciona en la página, sin cuenta, sin instalar nada y sin costo.",
      },
      {
        q: "¿Puedo usar el teclado de la computadora?",
        a: "Sí. Números, operadores, Enter, Escape y Retroceso están soportados.",
      },
      {
        q: "¿Se guardan mis cálculos en internet?",
        a: "No. El cálculo es local; el historial solo vive en tu sesión del navegador.",
      },
    ],
  },

  "regla-de-tres": {
    metaTitle: "Rule of Three Calculator — Direct & Inverse Proportion | UtiliHub",
    metaTitleEs: "Calculadora de regla de tres online — directa e inversa | UtiliHub",
    metaDescription:
      "Solve proportions with the rule of three. Enter three known values, get the unknown. Direct or inverse. Free, no signup.",
    metaDescriptionEs:
      "Resolvé proporciones con la regla de tres online. Ingresá tres valores y obtené la incógnita. Directa o inversa. Gratis, sin registro.",
    about: [
      "The rule of three finds a missing value in a proportion. Direct form: if a relates to b as c relates to x, then x = (b × c) ÷ a.",
      "Inverse rule of three applies when more of one quantity means less of the other (e.g. more workers, fewer days).",
      "Use clear units on all three inputs so the unknown stays meaningful.",
    ],
    aboutEs: [
      "La regla de tres calcula el valor que falta en una proporción. En forma directa: si a es a b como c es a x, entonces x = (b × c) ÷ a.",
      "La regla de tres inversa aplica cuando al aumentar una magnitud la otra baja en la misma proporción (ejemplo: más personas, menos días de trabajo).",
      "Usá las mismas unidades en los tres datos conocidos para que la incógnita tenga sentido.",
    ],
    steps: [
      "Choose direct or inverse proportion.",
      "Enter the three known values A, B and C.",
      "Read X and the formula used.",
    ],
    stepsEs: [
      "Elegí proporción directa o inversa.",
      "Ingresá los tres valores conocidos (A, B y C).",
      "Leé la incógnita X y la fórmula aplicada.",
    ],
    faq: [
      {
        q: "What is the rule of three formula?",
        a: "Direct: x = (b × c) ÷ a. Inverse: x = (a × b) ÷ c. a, b, c are the known values.",
      },
      {
        q: "When do I use inverse rule of three?",
        a: "When quantities move in opposite directions proportionally — classic case: workforce size vs days to finish a job.",
      },
      {
        q: "Can I use decimals?",
        a: "Yes. Decimal inputs are supported.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se hace la regla de tres?",
        a: "Directa: x = (b × c) ÷ a. Inversa: x = (a × b) ÷ c. Completá los tres datos conocidos y resolvé la incógnita.",
      },
      {
        q: "¿Cuándo usar la regla de tres inversa?",
        a: "Cuando al subir una variable la otra baja en proporción. Ejemplo: más trabajadores terminan la obra en menos días.",
      },
      {
        q: "¿Hay calculadora de regla de tres online gratis?",
        a: "Sí. Esta herramienta resuelve directa e inversa en el navegador, sin registro.",
      },
      {
        q: "¿Acepta decimales?",
        a: "Sí. Podés ingresar valores decimales en A, B y C.",
      },
    ],
  },

  "contador-de-palabras": {
    metaTitle: "Word Counter Online — Characters, Sentences & Reading Time | UtiliHub",
    metaTitleEs: "Contador de palabras online — caracteres, oraciones y tiempo de lectura | UtiliHub",
    metaDescription:
      "Count words, characters (with/without spaces), sentences and paragraphs live. Free word counter, no signup, private in your browser.",
    metaDescriptionEs:
      "Contá palabras, caracteres (con y sin espacios), oraciones y párrafos al instante. Contador de palabras gratis, sin registro, privado en el navegador.",
    about: [
      "A word counter measures words, characters, sentences and paragraphs as you type or paste. Useful for essays, posts, SEO drafts and character limits.",
      "Reading-time estimates often assume about 200 words per minute for adult silent reading — adjust expectations for technical text.",
      "Counting is local: your draft is not uploaded for this tool.",
    ],
    aboutEs: [
      "Un contador de palabras mide palabras, caracteres, oraciones y párrafos mientras escribís o pegás texto. Sirve para trabajos, publicaciones, borradores SEO y límites de caracteres.",
      "El tiempo de lectura estimado suele usar unas 200 palabras por minuto en lectura silenciosa adulta; en texto técnico puede ser más lento.",
      "El conteo es local: tu texto no se sube a un servidor en esta herramienta.",
    ],
    steps: [
      "Paste or type your text.",
      "Read live word and character counts.",
      "Edit until you hit the limit you need.",
    ],
    stepsEs: [
      "Pegá o escribí tu texto.",
      "Mirá el conteo de palabras y caracteres en vivo.",
      "Editá hasta llegar al límite que necesitás.",
    ],
    faq: [
      {
        q: "How does a word counter count words?",
        a: "Usually any sequence of characters separated by spaces or line breaks counts as one word.",
      },
      {
        q: "Is my text uploaded?",
        a: "No. Analysis runs in your browser only.",
      },
      {
        q: "Characters with or without spaces?",
        a: "Most counters show both so you can match platform rules.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo contar palabras de un texto online?",
        a: "Pegá el texto en el contador: las palabras se separan por espacios o saltos de línea y el total se actualiza al instante.",
      },
      {
        q: "¿El contador de palabras es gratis y sin registro?",
        a: "Sí. Funciona en el navegador sin crear cuenta ni instalar nada.",
      },
      {
        q: "¿Se sube mi texto?",
        a: "No. El análisis es solo local en tu dispositivo.",
      },
      {
        q: "¿Cuenta caracteres con o sin espacios?",
        a: "Muestra ambos, para que puedas ajustarte al límite de cada plataforma o editorial.",
      },
    ],
  },

  "porcentaje-hasta-meta": {
    metaTitle: "Percent Complete Calculator — Progress to Goal | UtiliHub",
    metaTitleEs: "Calculadora de porcentaje de avance online — % de meta y restante | UtiliHub",
    metaDescription:
      "How far are you toward a goal? Get percent complete, percent left and units remaining. Free progress calculator, no signup.",
    metaDescriptionEs:
      "¿Qué porcentaje de la meta llevás? Calculá el % de avance, el % que falta y las unidades restantes. Ideal para ventas, ahorro y proyectos. Gratis.",
    about: [
      "Percent to goal (progress %) is current ÷ target × 100. Remaining units are max(target − current, 0).",
      "Use the same unit for current and target (money, tasks, km). Over 100% means you already beat the goal.",
      "Common for sales quotas, fundraising, savings and project completion.",
    ],
    aboutEs: [
      "El porcentaje de avance responde: ¿qué tanto de mi objetivo ya cumplí? Fórmula: (actual ÷ meta) × 100.",
      "Ejemplo: meta 10.000 y vas 4.200 → 42% de avance; faltan 5.800 (58%).",
      "Sirve para cuotas de ventas, recaudaciones, ahorro, proyectos o cualquier “qué porcentaje llevo”.",
      "Si superás la meta, el avance pasa de 100% y el restante queda en 0.",
    ],
    steps: [
      "Enter current amount and goal amount.",
      "Read percent complete and remaining.",
      "Update current as real progress changes.",
    ],
    stepsEs: [
      "Ingresá lo ya logrado (actual) y la meta total.",
      "Leé el % de avance, unidades que faltan y % pendiente.",
      "Actualizá el actual cuando cambie el progreso real.",
    ],
    faq: [
      {
        q: "How do I calculate percent complete?",
        a: "Divide current by target and multiply by 100. Example: 175 of 500 → 35%.",
      },
      {
        q: "How much is left to the goal?",
        a: "In units: target − current. In percent: 100 − progress %.",
      },
      {
        q: "What if current exceeds the goal?",
        a: "Progress shows above 100%; remaining units are treated as zero.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo sacar el porcentaje de avance?",
        a: "Dividí lo ejecutado entre el total y multiplicá por 100: % = (actual ÷ meta) × 100. Ejemplo: 175 de 500 → 35%.",
      },
      {
        q: "¿Cómo calcular cuánto falta para la meta?",
        a: "En unidades: meta − actual. En porcentaje: 100 − % de avance.",
      },
      {
        q: "¿Qué es el porcentaje hasta la meta?",
        a: "Es el mismo concepto que porcentaje de avance: cuánto del objetivo ya está cubierto, en %.",
      },
      {
        q: "¿Sirve para metas de ventas o ahorro?",
        a: "Sí. Usá la misma unidad (pesos, unidades vendidas, etc.) en actual y meta.",
      },
    ],
  },

  "validador-cuit": {
    metaTitle: "CUIT CUIL Validator Argentina — Check Digit Online Free | UtiliHub",
    metaTitleEs: "Validador de CUIT / CUIL online gratis — dígito verificador AFIP | UtiliHub",
    metaDescription:
      "Validate Argentine CUIT or CUIL with the official check digit. Format XX-XXXXXXXX-X. Free, private, runs in your browser.",
    metaDescriptionEs:
      "Validá CUIT o CUIL argentino con el dígito verificador oficial. Formato XX-XXXXXXXX-X. Gratis, privado, en el navegador — sin registro.",
    about: [
      "Enter 11 digits with or without dashes. The tool checks the AFIP-style check digit and common person/company prefixes.",
      "Useful before invoices, AFIP forms and payroll when you need a fast format check.",
      "Validation is local — the number is not uploaded.",
    ],
    aboutEs: [
      "Ingresá 11 dígitos con o sin guiones. Se verifica el dígito verificador tipo AFIP y se indica si el prefijo es habitual (persona o empresa).",
      "Útil antes de facturar, trámites AFIP o liquidaciones cuando necesitás confirmar formato al instante.",
      "La validación es local: el número no se sube a un servidor.",
    ],
    steps: ["Paste the CUIT/CUIL.", "Validate.", "Read valid/invalid and normalized format."],
    stepsEs: ["Pegá el CUIT/CUIL.", "Validá.", "Leé válido/inválido y el formato normalizado."],
    faq: [
      {
        q: "How do I validate a CUIT online?",
        a: "Paste the 11 digits (with or without dashes). The check digit must match the official algorithm.",
      },
      {
        q: "CUIT vs CUIL?",
        a: "Same 11-digit structure and check digit; prefixes differ for individuals vs companies.",
      },
      {
        q: "Is the number uploaded?",
        a: "No. Validation runs only in your browser.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo validar un CUIT online?",
        a: "Pegá los 11 dígitos (con o sin guiones). El dígito verificador debe coincidir con el algoritmo oficial.",
      },
      {
        q: "¿Cuál es la diferencia entre CUIT y CUIL?",
        a: "Comparten estructura de 11 dígitos y el mismo algoritmo; cambian los prefijos según persona o empresa.",
      },
      {
        q: "¿Qué prefijos son habituales?",
        a: "Personas: 20, 23, 24, 27. Empresas: 30, 33, 34 (entre los más comunes).",
      },
      {
        q: "¿El validador de CUIT es gratis?",
        a: "Sí. Sin registro y sin enviar el número a un servidor.",
      },
    ],
  },
};
