/** Block 3 high-priority SEO overrides (merged via toolSeoOverride). */

export type ToolSeoOverrideBlock3 = {
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

export const TOOL_SEO_OVERRIDES_BLOCK3: Record<string, ToolSeoOverrideBlock3> = {
  "base64-decode": {
    metaTitle: "Base64 Decode — Decode to Text Online | UtiliHub",
    metaTitleEs: "Decodificar Base64 a texto online | UtiliHub",
    metaDescription:
      "Decode Base64 to plain text in your browser. Free Base64 decoder for tokens, payloads, and data URLs. No upload.",
    metaDescriptionEs:
      "Decodificá Base64 a texto plano en el navegador. Decoder gratis para tokens, payloads y data URLs. Sin subir archivos.",
    about: [
      "Base64 decoding reverses the encoding step: a 64-character alphabet is mapped back to the original bytes or text. Developers use it for tokens, email attachments, and data URLs.",
      "This tool decodes locally in your browser. If the input is not valid Base64, you should see an error instead of corrupted output.",
      "Decoding is not decryption. Anyone with the string can recover the original data—do not rely on Base64 to hide secrets.",
    ],
    aboutEs: [
      "Decodificar Base64 invierte la codificación: el alfabeto de 64 caracteres vuelve a bytes o texto. Se usa en tokens, adjuntos y data URLs.",
      "Esta herramienta decodifica en local. Si la entrada no es Base64 válido, debería mostrar error y no un resultado corrupto.",
      "Decodificar no es descifrar. Cualquiera con la cadena puede recuperar los datos: no uses Base64 para ocultar secretos.",
    ],
    steps: [
      "Paste the Base64 string.",
      "Decode to readable text.",
      "Copy the result into your editor or API client.",
    ],
    stepsEs: [
      "Pegá la cadena Base64.",
      "Decodificá a texto legible.",
      "Copiá el resultado a tu editor o cliente de API.",
    ],
    faq: [
      {
        q: "Why do I get an error?",
        a: "Common causes: missing padding (=), line breaks, or characters outside the Base64 alphabet. Clean the string and try again.",
      },
      {
        q: "Can it decode images?",
        a: "If the payload is binary, you may see garbled text. For images, use a data-URL or a dedicated image decoder.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué da error?",
        a: "Suele faltar el padding (=), haber saltos de línea o caracteres fuera del alfabeto. Limpiá la cadena e intentá de nuevo.",
      },
      {
        q: "¿Sirve para imágenes?",
        a: "Si el payload es binario, el texto puede verse raro. Para imágenes usá data-URL o un decoder específico.",
      },
    ],
  },

  "json-validator": {
    metaTitle: "JSON Validator — Check Syntax Online | UtiliHub",
    metaTitleEs: "Validador JSON online gratis | UtiliHub",
    metaDescription:
      "Validate JSON syntax in your browser. Catch trailing commas, bad quotes, and parse errors before production.",
    metaDescriptionEs:
      "Validá la sintaxis JSON en el navegador. Detectá comas finales, comillas mal y errores de parseo antes de producción.",
    about: [
      "A JSON validator parses your document with strict rules: double-quoted keys and strings, no trailing commas, and valid structure.",
      "Use it when an API rejects a body, a config file fails to load, or a minified blob looks suspicious. Feedback should point to where parsing stopped.",
      "Validation runs locally—paste only data you are comfortable handling on your device.",
    ],
    aboutEs: [
      "Un validador JSON parsea el documento con reglas estrictas: claves y strings con comillas dobles, sin comas finales y estructura válida.",
      "Úsalo cuando una API rechaza el body, un config falla al cargar o un blob minificado se ve raro. El feedback debería indicar dónde cortó el parseo.",
      "La validación es local: pegá solo datos que te sientas cómodo manejando en tu dispositivo.",
    ],
    steps: [
      "Paste the JSON to check.",
      "Run validation.",
      "Fix reported syntax issues and re-check.",
    ],
    stepsEs: [
      "Pegá el JSON a revisar.",
      "Ejecutá la validación.",
      "Corregí los errores de sintaxis y volvé a validar.",
    ],
    faq: [
      {
        q: "Why are trailing commas invalid?",
        a: "Standard JSON does not allow a comma after the last item in an object or array. Some languages allow it; JSON parsers usually do not.",
      },
      {
        q: "Single quotes?",
        a: "JSON requires double quotes for strings and keys. Single quotes will fail validation.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué fallan las comas finales?",
        a: "El JSON estándar no permite coma después del último ítem. Algunos lenguajes sí; los parsers JSON suelen no.",
      },
      {
        q: "¿Comillas simples?",
        a: "JSON exige comillas dobles en strings y claves. Las simples invalidan el documento.",
      },
    ],
  },

  "json-a-csv": {
    metaTitle: "JSON to CSV Converter — Free Online | UtiliHub",
    metaTitleEs: "Convertir JSON a CSV online | UtiliHub",
    metaDescription:
      "Convert a JSON array of objects to CSV in your browser. Export tabular data without uploading files.",
    metaDescriptionEs:
      "Convertí un array JSON de objetos a CSV en el navegador. Exportá datos tabulares sin subir archivos.",
    about: [
      "JSON arrays of flat objects map cleanly to CSV rows: object keys become column headers and each object becomes a row.",
      "Nested objects or arrays need flattening or special handling—this tool targets simple, table-shaped JSON common in exports and APIs.",
      "Conversion is local so sensitive spreadsheets never leave your device during the transform step.",
    ],
    aboutEs: [
      "Los arrays JSON de objetos planos mapean bien a filas CSV: las claves son columnas y cada objeto una fila.",
      "Objetos anidados o arrays requieren aplanarlos; esta herramienta apunta a JSON tabular simple de exports y APIs.",
      "La conversión es local: planillas sensibles no salen de tu dispositivo en este paso.",
    ],
    steps: [
      "Paste a JSON array of objects.",
      "Convert to CSV.",
      "Copy or download the CSV for Excel or Sheets.",
    ],
    stepsEs: [
      "Pegá un array JSON de objetos.",
      "Convertí a CSV.",
      "Copiá o descargá el CSV para Excel o Sheets.",
    ],
    faq: [
      {
        q: "What shape of JSON works best?",
        a: "An array of objects with the same keys, e.g. [{\"name\":\"Ada\",\"age\":36}, …]. Deep nesting may need preprocessing.",
      },
      {
        q: "Are commas escaped?",
        a: "CSV fields that contain commas should be quoted. Check the output if your data has special characters.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué forma de JSON funciona mejor?",
        a: "Un array de objetos con las mismas claves, p. ej. [{\"name\":\"Ada\",\"age\":36}, …]. El anidado profundo puede requerir preprocess.",
      },
      {
        q: "¿Se escapan las comas?",
        a: "Los campos con comas deberían ir entre comillas. Revisá la salida si hay caracteres especiales.",
      },
    ],
  },

  "conversor-de-peso": {
    metaTitle: "Weight Converter — kg, lb, oz Online | UtiliHub",
    metaTitleEs: "Conversor de peso kg libras onzas | UtiliHub",
    metaDescription:
      "Convert kilograms, pounds, ounces, grams, and stones. Free weight (mass) converter in your browser.",
    metaDescriptionEs:
      "Convertí kilogramos, libras, onzas, gramos y stones. Conversor de peso gratis en el navegador.",
    about: [
      "Everyday weight converters actually convert mass units: kilogram, gram, pound, ounce, and stone. Cooking, shipping, and gym logs all switch between metric and imperial.",
      "Factors follow international definitions (e.g. 1 lb = 0.45359237 kg). Enter a value in one unit and read the others.",
      "For legal trade or pharmacy dosing, confirm the precision and regulations that apply in your country.",
    ],
    aboutEs: [
      "Los conversores de peso cotidianos convierten unidades de masa: kilogramo, gramo, libra, onza y stone. Cocina, envíos y gym pasan del métrico al imperial.",
      "Los factores siguen definiciones internacionales (p. ej. 1 lb = 0.45359237 kg). Ingresá un valor en una unidad y leé el resto.",
      "En comercio legal o dosificación, confirmá la precisión y la norma de tu país.",
    ],
    steps: [
      "Enter the amount you know.",
      "Choose source and target units.",
      "Copy the converted value.",
    ],
    stepsEs: [
      "Ingresá el monto que conocés.",
      "Elegí unidad de origen y destino.",
      "Copiá el valor convertido.",
    ],
    faq: [
      {
        q: "How many pounds in a kilogram?",
        a: "About 2.20462 pounds per kilogram.",
      },
      {
        q: "What is a stone?",
        a: "A British unit equal to 14 pounds, still used for body weight in some regions.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuántas libras es un kilo?",
        a: "Aproximadamente 2.20462 libras por kilogramo.",
      },
      {
        q: "¿Qué es un stone?",
        a: "Una unidad británica de 14 libras, aún usada para el peso corporal en algunas regiones.",
      },
    ],
  },

  "uuid-generator": {
    metaTitle: "UUID Generator — Random UUID v4 Online | UtiliHub",
    metaTitleEs: "Generador de UUID v4 online | UtiliHub",
    metaDescription:
      "Generate random UUID v4 identifiers in your browser for APIs, databases, and testing. Free, no signup.",
    metaDescriptionEs:
      "Generá identificadores UUID v4 al azar en el navegador para APIs, bases de datos y testing. Gratis, sin registro.",
    about: [
      "A UUID (Universally Unique Identifier) is a 128-bit value usually shown as 36 characters with hyphens. Version 4 UUIDs are random and widely used as primary keys and correlation IDs.",
      "This generator uses browser cryptographic randomness when available so IDs are suitable for development and many production patterns.",
      "UUIDs are unique with extremely high probability—they are not secret tokens. Do not treat them as passwords.",
    ],
    aboutEs: [
      "Un UUID es un valor de 128 bits, suele mostrarse en 36 caracteres con guiones. El UUID v4 es aleatorio y se usa como clave primaria o ID de correlación.",
      "Este generador usa aleatoriedad criptográfica del navegador cuando está disponible, apto para desarrollo y muchos usos en producción.",
      "Los UUID son únicos con altísima probabilidad, no son secretos. No los uses como contraseñas.",
    ],
    steps: [
      "Click generate to create a new UUID v4.",
      "Copy the value into your code or database.",
      "Generate again whenever you need another ID.",
    ],
    stepsEs: [
      "Generá un UUID v4 nuevo.",
      "Copiá el valor a tu código o base de datos.",
      "Volvé a generar cada vez que necesites otro ID.",
    ],
    faq: [
      {
        q: "UUID v4 vs v1?",
        a: "v1 can embed time and node info; v4 is random. Most modern apps prefer v4 unless they need sortable time-based IDs.",
      },
      {
        q: "Can two UUIDs collide?",
        a: "Theoretically yes, practically vanishingly rare for v4 at normal volumes.",
      },
    ],
    faqEs: [
      {
        q: "¿UUID v4 o v1?",
        a: "v1 puede incluir tiempo y nodo; v4 es aleatorio. La mayoría de apps modernas prefieren v4 salvo que necesiten IDs ordenables por tiempo.",
      },
      {
        q: "¿Pueden colisionar dos UUID?",
        a: "En teoría sí; en la práctica es extremadamente raro en v4 a volúmenes normales.",
      },
    ],
  },

  "url-encode": {
    metaTitle: "URL Encode — Percent-Encode Online | UtiliHub",
    metaTitleEs: "Codificar URL online (percent-encode) | UtiliHub",
    metaDescription:
      "Percent-encode text for query strings and safe URLs. Free URL encoder in your browser.",
    metaDescriptionEs:
      "Codificá texto para query strings y URLs seguras. Encoder de URL gratis en el navegador.",
    about: [
      "URL encoding (percent-encoding) replaces reserved characters with %HH sequences so query parameters and path segments travel safely.",
      "Spaces often become %20 (or + in some form encodings). Always encode user input before placing it in a URL.",
      "Encoding is local and reversible with a URL decoder—it is not encryption.",
    ],
    aboutEs: [
      "La codificación de URL (percent-encoding) reemplaza caracteres reservados por secuencias %HH para que parámetros y paths viajen seguros.",
      "Los espacios suelen pasar a %20 (o + en algunos formularios). Codificá siempre el input del usuario antes de meterlo en una URL.",
      "La codificación es local y reversible con un decoder: no es cifrado.",
    ],
    steps: [
      "Paste the text or parameter value.",
      "Encode and copy the result.",
      "Insert it into your query string or path.",
    ],
    stepsEs: [
      "Pegá el texto o valor del parámetro.",
      "Codificá y copiá el resultado.",
      "Insertalo en el query string o path.",
    ],
    faq: [
      {
        q: "When should I encode?",
        a: "Any time user-controlled or special characters go into a URL—spaces, &, =, non-ASCII, etc.",
      },
      {
        q: "%20 vs + for spaces?",
        a: "In the query component, application/x-www-form-urlencoded often uses +. Path segments typically use %20.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuándo codificar?",
        a: "Cuando metés input del usuario o caracteres especiales en una URL: espacios, &, =, no ASCII, etc.",
      },
      {
        q: "¿%20 o + para espacios?",
        a: "En query, form-urlencoded suele usar +. En paths suele usarse %20.",
      },
    ],
  },

  propina: {
    metaTitle: "Tip Calculator — Bill Total Online | UtiliHub",
    metaTitleEs: "Calculadora de propina gratis | UtiliHub",
    metaDescription:
      "Calculate tip and total bill from amount and tip percent. Free tip calculator, no signup.",
    metaDescriptionEs:
      "Calculá propina y total de la cuenta según monto y porcentaje. Calculadora de propina gratis, sin registro.",
    about: [
      "A tip calculator multiplies the bill by a tip percentage and adds it to the total so you can pay quickly at restaurants or for delivery.",
      "Typical tip rates vary by country and service. Adjust the percent and see the tip amount and grand total instantly.",
      "This is arithmetic guidance only—local customs and service charges may already be included on the bill.",
    ],
    aboutEs: [
      "Una calculadora de propina multiplica la cuenta por un porcentaje y suma el total para pagar rápido en restaurantes o delivery.",
      "Las tasas típicas varían por país y servicio. Ajustá el % y mirá propina y total al instante.",
      "Es solo guía aritmética: la costumbre local o un service charge pueden ya estar en la cuenta.",
    ],
    steps: [
      "Enter the bill amount.",
      "Choose a tip percentage.",
      "Read tip and total to pay.",
    ],
    stepsEs: [
      "Ingresá el monto de la cuenta.",
      "Elegí el porcentaje de propina.",
      "Leé la propina y el total a pagar.",
    ],
    faq: [
      {
        q: "Is tax included in the tip base?",
        a: "Depends on local custom. Enter the base your group agrees on (pre-tax or post-tax).",
      },
      {
        q: "Need to split the bill?",
        a: "Use the tip and split bill tool if you want per-person amounts.",
      },
    ],
    faqEs: [
      {
        q: "¿Propina sobre el impuesto?",
        a: "Depende de la costumbre. Ingresá la base que acuerden (con o sin tax).",
      },
      {
        q: "¿Hay que dividir la cuenta?",
        a: "Usá la herramienta de propina y cuenta compartida si querés el monto por persona.",
      },
    ],
  },
};
