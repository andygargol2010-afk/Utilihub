/** Unique SEO copy overrides for high-priority general tools (by internal slug). */

export type ToolSeoOverride = {
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

export const TOOL_SEO_OVERRIDES: Record<string, ToolSeoOverride> = {
  "propina-y-cuenta-compartida": {
    metaTitle: "Tip Calculator — Split the Bill Online | UtiliHub",
    metaTitleEs: "Calculadora de propina y cuenta compartida | UtiliHub",
    metaDescription:
      "Free tip calculator and bill splitter. Add tip percent, divide by number of people, see total and per person. No signup.",
    metaDescriptionEs:
      "Calculadora de propina gratis. Sumá el porcentaje, dividí por personas y mirá el total por cabeza. Sin registro.",
    about: [
      "A tip calculator turns a restaurant or service bill into a clear total and a fair split. You enter the bill amount, choose a tip percentage, and optionally how many people are paying.",
      "Useful defaults vary by country and service quality (often 10–20%). This tool does the arithmetic in your browser so you can adjust the percent or party size before you pay.",
      "It does not include tax rules for every region—if tax is already on the bill, tip on the amount your group agrees on (pre-tax or post-tax) and use the result as a guide.",
    ],
    aboutEs: [
      "Una calculadora de propina convierte la cuenta en un total claro y un reparto justo. Ingresás el monto, elegís el porcentaje y, si querés, cuántas personas pagan.",
      "Los usos habituales van del 10 al 20% según el país y el servicio. La cuenta se hace en tu navegador para que ajustes el % o el grupo antes de pagar.",
      "No aplica impuestos de cada región: si el tax ya está en la cuenta, propiná sobre el monto que acuerden y usá el resultado como guía.",
    ],
    steps: [
      "Enter the bill total.",
      "Choose a tip percentage (or try a few).",
      "Set how many people share the bill.",
      "Read total with tip and amount per person.",
    ],
    stepsEs: [
      "Ingresá el total de la cuenta.",
      "Elegí el porcentaje de propina (o probá varios).",
      "Indicá cuántas personas comparten la cuenta.",
      "Leé el total con propina y el monto por persona.",
    ],
    faq: [
      {
        q: "Should I tip on tax?",
        a: "Customs differ. Some people tip on the pre-tax subtotal; others on the final total. Agree with your group and enter that base amount here.",
      },
      {
        q: "What if one person ordered more?",
        a: "This tool splits evenly. For uneven shares, calculate a personal subtotal first, then run the tip on that amount.",
      },
    ],
    faqEs: [
      {
        q: "¿Propina sobre el impuesto?",
        a: "Depende de la costumbre. Algunos propinan sobre el subtotal sin tax; otros sobre el total final. Acordalo en el grupo e ingresá esa base acá.",
      },
      {
        q: "¿Y si uno consumió más?",
        a: "Esta herramienta reparte en partes iguales. Si el consumo fue desigual, calculá un subtotal personal y después la propina sobre ese monto.",
      },
    ],
  },

  "password-strength": {
    metaTitle: "Password Strength Checker — Free Online | UtiliHub",
    metaTitleEs: "Analizador de fortaleza de contraseña | UtiliHub",
    metaDescription:
      "Check password strength in your browser: length, character variety, and approximate entropy. Nothing is uploaded.",
    metaDescriptionEs:
      "Revisá la fortaleza de tu contraseña en el navegador: longitud, variedad de caracteres y entropía aproximada. Nada se sube.",
    about: [
      "A strong password is long and unpredictable. Strength checkers estimate how hard it would be to guess or brute-force a string from length and character classes (lower, upper, digits, symbols).",
      "This tool evaluates the password you type locally. It does not send the value to a server and does not check against breach databases—use a reputable password manager for that.",
      "Aim for length first (12+ characters is a practical baseline for many accounts), then mix character types. Avoid single dictionary words and reused passwords across sites.",
    ],
    aboutEs: [
      "Una contraseña fuerte es larga y difícil de adivinar. Los analizadores estiman el esfuerzo de fuerza bruta según longitud y clases de caracteres (minúsculas, mayúsculas, números, símbolos).",
      "Esta herramienta evalúa lo que escribís en local. No envía el valor a un servidor ni consulta filtraciones: para eso usá un gestor de contraseñas de confianza.",
      "Priorizá la longitud (12+ caracteres es un piso razonable en muchas cuentas) y después la variedad. Evitá una sola palabra del diccionario y reutilizar la misma clave en todos lados.",
    ],
    steps: [
      "Type or paste the password you want to evaluate.",
      "Review length, diversity signals, and the strength estimate.",
      "Improve the password (longer, less predictable) until you are satisfied.",
      "Store it in a password manager instead of reusing it.",
    ],
    stepsEs: [
      "Escribí o pegá la contraseña a evaluar.",
      "Revisá longitud, variedad y la estimación de fortaleza.",
      "Mejorala (más larga, menos predecible) hasta quedar conforme.",
      "Guardala en un gestor en lugar de reutilizarla.",
    ],
    faq: [
      {
        q: "Is my password sent to UtiliHub?",
        a: "No. The check runs in your browser. For maximum privacy, avoid testing production passwords on any shared device.",
      },
      {
        q: "Why is a long passphrase better than a short complex password?",
        a: "Length multiplies the search space. A memorable multi-word passphrase often beats a short string with a few symbols.",
      },
    ],
    faqEs: [
      {
        q: "¿Se envía mi contraseña a UtiliHub?",
        a: "No. El análisis corre en tu navegador. Por privacidad, evitá probar claves reales en dispositivos compartidos.",
      },
      {
        q: "¿Por qué una frase larga es mejor que una clave corta “compleja”?",
        a: "La longitud multiplica el espacio de búsqueda. Una passphrase de varias palabras suele superar a una cadena corta con un par de símbolos.",
      },
    ],
  },

  "generador-de-contrasenas": {
    metaTitle: "Password Generator — Strong Random Passwords | UtiliHub",
    metaTitleEs: "Generador de contraseñas seguras gratis | UtiliHub",
    metaDescription:
      "Generate strong random passwords in your browser. Control length, symbols, and character sets. Free, no signup.",
    metaDescriptionEs:
      "Generá contraseñas aleatorias fuertes en el navegador. Controlá longitud, símbolos y tipos de caracteres. Gratis, sin registro.",
    about: [
      "A password generator creates random strings so you do not rely on human-chosen patterns. You pick length and whether to include symbols, numbers, and mixed case.",
      "Generation happens locally. Copy the result into a password manager and enable 2FA where the site supports it.",
      "Never email yourself new passwords or reuse the same generated string on multiple important accounts.",
    ],
    aboutEs: [
      "Un generador crea cadenas al azar para no depender de patrones humanos. Elegís longitud y si incluir símbolos, números y mayúsculas/minúsculas.",
      "La generación es local. Copiá el resultado a un gestor de contraseñas y activá 2FA donde el sitio lo permita.",
      "No te envíes las claves por mail ni reutilices la misma cadena en varias cuentas importantes.",
    ],
    steps: [
      "Choose length and character options.",
      "Generate a password.",
      "Copy it to your password manager.",
      "Use a unique password per important site.",
    ],
    stepsEs: [
      "Elegí longitud y opciones de caracteres.",
      "Generá la contraseña.",
      "Copiala a tu gestor.",
      "Usá una distinta en cada sitio importante.",
    ],
    faq: [
      {
        q: "How long should a password be?",
        a: "For most accounts, 12–16+ random characters is a solid baseline. Critical accounts benefit from longer strings or a manager-generated secret.",
      },
      {
        q: "Are generated passwords stored?",
        a: "No. They exist only in your browser session until you copy or leave the page.",
      },
    ],
    faqEs: [
      {
        q: "¿De qué longitud?",
        a: "Para la mayoría de cuentas, 12–16+ caracteres al azar es un buen piso. Cuentas críticas conviene alargarlas o usar el secreto del gestor.",
      },
      {
        q: "¿Se guardan las contraseñas generadas?",
        a: "No. Solo existen en la sesión del navegador hasta que las copiás o salís de la página.",
      },
    ],
  },

  porcentaje: {
    metaTitle: "Percentage Calculator — Free Online | UtiliHub",
    metaTitleEs: "Calculadora de porcentajes gratis | UtiliHub",
    metaDescription:
      "Free percentage calculator for discounts, increases, and proportions. What is X% of Y, or what percent is A of B.",
    metaDescriptionEs:
      "Calculadora de porcentajes gratis: descuentos, aumentos y proporciones. Cuánto es el X% de Y, o qué % es A de B.",
    about: [
      "Percentage problems show up in discounts, tips, taxes, grades, and growth rates. This calculator handles common cases: finding a percent of a number, finding what percent one number is of another, and percent change.",
      "All math runs locally so you can check store prices, markups, or homework without a spreadsheet.",
      "Percent change is (new − old) / old. Be careful with the base: “20% off” applies to the original price, not to a price that was already discounted unless the offer says so.",
    ],
    aboutEs: [
      "Los porcentajes aparecen en descuentos, propinas, impuestos, notas y tasas de crecimiento. Esta calculadora cubre casos habituales: un % de un número, qué % es un valor de otro, y el cambio porcentual.",
      "El cálculo es local: precios, recargos o deberes sin planilla.",
      "El cambio porcentual es (nuevo − viejo) / viejo. Cuidado con la base: “20% off” se aplica al precio original, no a uno ya rebajado, salvo que la oferta diga otra cosa.",
    ],
    steps: [
      "Pick the mode you need (percent of, reverse percent, or change).",
      "Enter the numbers involved.",
      "Read the result and units (amount vs percentage points).",
      "Double-check the base amount for discounts and increases.",
    ],
    stepsEs: [
      "Elegí el modo (porcentaje de, porcentaje inverso o cambio).",
      "Ingresá los números.",
      "Leé el resultado y las unidades (monto vs puntos porcentuales).",
      "Revisá la base en descuentos y aumentos.",
    ],
    faq: [
      {
        q: "How do I calculate a discount?",
        a: "Multiply the original price by (1 − discount%). Example: $80 with 25% off → 80 × 0.75 = $60.",
      },
      {
        q: "Percent vs percentage points?",
        a: "If a rate goes from 10% to 12%, that is a rise of 2 percentage points, or a 20% relative increase.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calculo un descuento?",
        a: "Multiplicá el precio original por (1 − % de descuento). Ejemplo: $80 con 25% off → 80 × 0.75 = $60.",
      },
      {
        q: "¿Porcentaje o puntos porcentuales?",
        a: "Si una tasa pasa de 10% a 12%, sube 2 puntos porcentuales, o un 20% en términos relativos.",
      },
    ],
  },

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

  "edad-exacta": {
    metaTitle: "Age Calculator — Exact Years, Months, Days | UtiliHub",
    metaTitleEs: "Calculadora de edad exacta online | UtiliHub",
    metaDescription:
      "Calculate exact age from a birth date: years, months, and days. Free age calculator, no signup.",
    metaDescriptionEs:
      "Calculá la edad exacta desde la fecha de nacimiento: años, meses y días. Gratis, sin registro.",
    about: [
      "An age calculator subtracts a birth date from today (or another reference date) and expresses the result in years, months, and days.",
      "Useful for forms, eligibility checks, and personal milestones. Calendar quirks (month lengths, leap years) are handled by standard date arithmetic in the browser.",
      "Legal age definitions can depend on local rules (e.g. “turns 18 at the beginning of the day”). When in doubt, confirm with the authority that requested the age.",
    ],
    aboutEs: [
      "Una calculadora de edad resta la fecha de nacimiento a hoy (u otra fecha de referencia) y expresa el resultado en años, meses y días.",
      "Sirve para formularios, requisitos de edad y fechas personales. Los meses de distinta duración y los años bisiestos los resuelve la aritmética de fechas del navegador.",
      "La definición legal de edad puede depender de normas locales. Si hay duda, confirmá con quien pidió el dato.",
    ],
    steps: [
      "Enter the date of birth.",
      "Optionally set a reference date (defaults to today).",
      "Read age in years, months, and days.",
    ],
    stepsEs: [
      "Ingresá la fecha de nacimiento.",
      "Opcionalmente elegí una fecha de referencia (por defecto hoy).",
      "Leé la edad en años, meses y días.",
    ],
    faq: [
      {
        q: "Why do results differ by a day?",
        a: "Time zones and whether the current day counts as completed can shift day-level results. For legal deadlines, use the official rule, not only a web calculator.",
      },
      {
        q: "Can I calculate age on a past or future date?",
        a: "Yes—set the reference date to the day you care about (event, exam, contract).",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué a veces difiere un día?",
        a: "Zonas horarias y si el día actual ya cuenta como cumplido pueden mover el resultado. En plazos legales, usá la norma oficial.",
      },
      {
        q: "¿Puedo calcular la edad en otra fecha?",
        a: "Sí: poné la fecha de referencia en el día del evento, examen o contrato.",
      },
    ],
  },

  "base64-encode": {
    metaTitle: "Base64 Encode — Text to Base64 Online | UtiliHub",
    metaTitleEs: "Codificar Base64 online gratis | UtiliHub",
    metaDescription:
      "Encode text to Base64 in your browser for tokens, data URLs, and safe transport. Free Base64 encoder.",
    metaDescriptionEs:
      "Codificá texto a Base64 en el navegador para tokens, data URLs y transporte seguro. Encoder Base64 gratis.",
    about: [
      "Base64 represents binary or text data using a 64-character alphabet so it can travel safely in JSON, URLs, and text protocols.",
      "This encoder converts your input to Base64 locally. Decoding is available as a separate tool when you need the reverse operation.",
      "Base64 is encoding, not encryption: anyone can decode it. Do not treat it as a way to hide secrets.",
    ],
    aboutEs: [
      "Base64 representa datos con un alfabeto de 64 caracteres para enviarlos en JSON, URLs y protocolos de texto.",
      "Este encoder convierte tu entrada a Base64 en local. La operación inversa está en la herramienta de decode.",
      "Base64 es codificación, no cifrado: cualquiera puede decodificarlo. No sirve para ocultar secretos.",
    ],
    steps: [
      "Paste the text to encode.",
      "Copy the Base64 output.",
      "Use it in headers, data URLs, or APIs as needed.",
    ],
    stepsEs: [
      "Pegá el texto a codificar.",
      "Copiá la salida Base64.",
      "Usala en headers, data URLs o APIs.",
    ],
    faq: [
      {
        q: "Why does Base64 output look longer?",
        a: "Encoding expands size by roughly 33% because every 3 bytes become 4 characters.",
      },
      {
        q: "Is Base64 secure?",
        a: "No. It is reversible encoding. Use proper encryption or hashing when you need secrecy or integrity.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué el Base64 es más largo?",
        a: "La codificación aumenta el tamaño ~33%: cada 3 bytes pasan a 4 caracteres.",
      },
      {
        q: "¿Base64 es seguro?",
        a: "No. Es reversible. Para secreto o integridad usá cifrado o hash adecuados.",
      },
    ],
  },

  "json-formatter": {
    metaTitle: "JSON Formatter — Pretty Print & Validate | UtiliHub",
    metaTitleEs: "Formateador JSON online gratis | UtiliHub",
    metaDescription:
      "Pretty-print and inspect JSON in your browser. Format messy JSON for debugging. Free, no upload.",
    metaDescriptionEs:
      "Formateá e inspeccioná JSON en el navegador. Ordená JSON desordenado para depurar. Gratis, sin subir archivos.",
    about: [
      "Messy minified JSON is hard to read. A formatter parses the structure and reprints it with indentation so objects and arrays are visible.",
      "Use this when debugging API responses, config files, or logs. Invalid JSON should surface a parse error instead of silent corruption.",
      "Processing is local: paste only data you are comfortable handling on your device.",
    ],
    aboutEs: [
      "El JSON minificado es difícil de leer. Un formateador parsea la estructura y la reimprime con sangría para ver objetos y arrays.",
      "Úsalo al depurar respuestas de API, configs o logs. Un JSON inválido debería mostrar error de parseo, no corromperse en silencio.",
      "Todo es local: pegá solo datos que te sientas cómodo manejando en tu dispositivo.",
    ],
    steps: [
      "Paste raw JSON.",
      "Format / pretty-print the document.",
      "Fix errors if the parser reports invalid syntax.",
      "Copy the cleaned JSON back to your editor or API client.",
    ],
    stepsEs: [
      "Pegá el JSON crudo.",
      "Formatealo / pretty-print.",
      "Corregí errores si el parser reporta sintaxis inválida.",
      "Copiá el JSON limpio a tu editor o cliente de API.",
    ],
    faq: [
      {
        q: "Why is my JSON invalid?",
        a: "Common issues: trailing commas, single quotes instead of double quotes, or unquoted keys. Strict JSON requires double-quoted strings and keys.",
      },
      {
        q: "Does formatting change the data?",
        a: "Pretty-print should preserve values and only change whitespace. Minify does the reverse.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué mi JSON es inválido?",
        a: "Suele fallar por comas finales, comillas simples en lugar de dobles, o claves sin comillas. El JSON estricto usa comillas dobles en strings y claves.",
      },
      {
        q: "¿El formato cambia los datos?",
        a: "El pretty-print debería conservar valores y solo tocar espacios. Minify hace lo inverso.",
      },
    ],
  },
};

export function toolSeoOverride(slug: string): ToolSeoOverride | undefined {
  return TOOL_SEO_OVERRIDES[slug];
}

/** Merge catalog tool fields with SEO override when present. */
export function resolvedToolSeo(tool: {
  slug: string;
  name: string;
  about: string[];
  steps: string[];
  faq?: { q: string; a: string }[];
  description?: string;
  title?: string;
}) {
  const o = toolSeoOverride(tool.slug);
  if (!o) {
    return {
      title: tool.title,
      description: tool.description,
      about: tool.about,
      steps: tool.steps,
      faq: tool.faq ?? [],
    };
  }
  return {
    title: o.metaTitle ?? tool.title,
    description: o.metaDescription ?? tool.description,
    about: o.about.length ? o.about : tool.about,
    steps: o.steps.length ? o.steps : tool.steps,
    faq: o.faq.length ? o.faq : tool.faq ?? [],
  };
}
