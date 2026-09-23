import type { ToolSeoOverride } from "./tool-seo-overrides";

/** Unique SEO for the 10 gap tools — bilingual, non-generic. */
export const TOOL_SEO_OVERRIDES_GAP: Record<string, ToolSeoOverride> = {
  "codigo-morse": {
    metaTitle: "Morse Code Translator — Text ↔ Morse Online | UtiliHub",
    metaTitleEs: "Traductor de código Morse — Texto ↔ Morse online | UtiliHub",
    metaDescription:
      "Convert text to Morse code and Morse back to text in your browser. Supports letters, numbers, and common punctuation. Free, private, no signup.",
    metaDescriptionEs:
      "Convertí texto a código Morse y Morse a texto en el navegador. Letras, números y puntuación. Gratis, privado, sin registro.",
    about: [
      "This Morse code translator works entirely in your browser. Type plain text to get dots and dashes, or paste Morse to decode it back to letters.",
      "Spaces separate letters; a slash separates words. You can use dots (.), dashes (-), or middle dots (·).",
      "Nothing is uploaded. Ideal for learning Morse, quick messages, or checking practice drills.",
    ],
    aboutEs: [
      "Este traductor de código Morse funciona en el navegador. Escribí texto plano para obtener puntos y rayas, o pegá Morse para decodificarlo.",
      "Los espacios separan letras; la barra separa palabras. Podés usar puntos (.), rayas (-) o puntos medios (·).",
      "Nada se sube a un servidor. Ideal para aprender Morse, mensajes rápidos o verificar ejercicios.",
    ],
    steps: [
      "Paste or type text (to encode) or Morse symbols (to decode).",
      "Press Process — the tool auto-detects direction from the input.",
      "Copy the result and use it wherever you need.",
    ],
    stepsEs: [
      "Pegá o escribí texto (para codificar) o símbolos Morse (para decodificar).",
      "Pulsá Procesar — la herramienta detecta la dirección según la entrada.",
      "Copiá el resultado y usalo donde lo necesites.",
    ],
    faq: [
      { q: "Does it support Spanish characters?", a: "Accented letters are skipped when encoding. Stick to a–z, 0–9, and common punctuation for best results." },
      { q: "How are words separated in Morse?", a: "A slash (/) marks a word boundary. Spaces separate individual letter codes." },
      { q: "Is my text stored?", a: "No. Conversion runs locally in the browser and is never uploaded." },
    ],
    faqEs: [
      { q: "¿Soporta caracteres del español?", a: "Las letras con tilde se omiten al codificar. Usá a–z, 0–9 y puntuación habitual para mejores resultados." },
      { q: "¿Cómo se separan las palabras en Morse?", a: "Una barra (/) marca el límite de palabra. Los espacios separan códigos de cada letra." },
      { q: "¿Se guarda mi texto?", a: "No. La conversión corre en el navegador y no se sube a ningún servidor." },
    ],
  },
  "texto-binario": {
    metaTitle: "Text to Binary Converter — UTF-8 Online | UtiliHub",
    metaTitleEs: "Conversor de texto a binario — UTF-8 online | UtiliHub",
    metaDescription: "Convert text to UTF-8 binary and binary back to text. Works offline in the browser. Free and private.",
    metaDescriptionEs: "Convertí texto a binario UTF-8 y binario a texto. Funciona offline en el navegador. Gratis y privado.",
    about: [
      "Encode any string as 8-bit UTF-8 binary groups, or decode a stream of 0s and 1s back into readable text.",
      "Binary input must be a multiple of 8 bits. Spaces between bytes are optional.",
    ],
    aboutEs: [
      "Codificá cualquier cadena como grupos binarios UTF-8 de 8 bits, o decodificá un flujo de 0 y 1 a texto legible.",
      "La entrada binaria debe ser múltiplo de 8 bits. Los espacios entre bytes son opcionales.",
    ],
    steps: ["Enter text or binary (0/1).", "Press Process.", "Copy the output."],
    stepsEs: ["Ingresá texto o binario (0/1).", "Pulsá Procesar.", "Copiá el resultado."],
    faq: [
      { q: "What encoding is used?", a: "UTF-8, so emojis and non-Latin scripts work when encoding text to binary." },
      { q: "Why did I get an error on binary input?", a: "Length must be a multiple of 8. Incomplete bytes are rejected." },
    ],
    faqEs: [
      { q: "¿Qué codificación usa?", a: "UTF-8, así que emojis y scripts no latinos funcionan al pasar de texto a binario." },
      { q: "¿Por qué falla mi binario?", a: "La longitud debe ser múltiplo de 8. Los bytes incompletos se rechazan." },
    ],
  },
  "frecuencia-palabras": {
    metaTitle: "Word Frequency Counter — Rank Words in Text | UtiliHub",
    metaTitleEs: "Contador de frecuencia de palabras | UtiliHub",
    metaDescription: "Count how often each word appears in your text, with rankings and percentages. Free browser tool.",
    metaDescriptionEs: "Contá cuántas veces aparece cada palabra en tu texto, con ranking y porcentajes. Herramienta gratis en el navegador.",
    about: [
      "Paste any article, essay, or notes and get a ranked list of word frequencies with percentages.",
      "Useful for SEO drafts, writing analysis, and vocabulary checks.",
    ],
    aboutEs: [
      "Pegá un artículo, ensayo o notas y obtené un ranking de frecuencias con porcentajes.",
      "Útil para borradores SEO, análisis de escritura y vocabulario.",
    ],
    steps: ["Paste your text.", "Press Process.", "Review the ranked list."],
    stepsEs: ["Pegá tu texto.", "Pulsá Procesar.", "Revisá el ranking."],
    faq: [
      { q: "Are stop words removed?", a: "No. Every token is counted so you control filtering." },
      { q: "Is it case sensitive?", a: "No. Words are normalized to lowercase before counting." },
    ],
    faqEs: [
      { q: "¿Se eliminan palabras vacías?", a: "No. Se cuenta cada token para que vos filtres." },
      { q: "¿Distingue mayúsculas?", a: "No. Se normaliza a minúsculas antes de contar." },
    ],
  },
  "nivel-lectura": {
    metaTitle: "Reading Level Calculator (Flesch) | UtiliHub",
    metaTitleEs: "Calculadora de nivel de lectura | UtiliHub",
    metaDescription: "Estimate reading ease with Flesch (English) or Fernández-Huerta (Spanish). Free, private, in-browser.",
    metaDescriptionEs: "Estimá la facilidad de lectura con Flesch (inglés) o Fernández-Huerta (español). Gratis y privado en el navegador.",
    about: [
      "Paste several sentences to estimate reading ease. English uses Flesch Reading Ease; Spanish-leaning text uses Fernández-Huerta.",
      "Scores help editors match content to audience skill level.",
    ],
    aboutEs: [
      "Pegá varias oraciones para estimar la facilidad de lectura. El inglés usa Flesch; textos en español usan Fernández-Huerta.",
      "Los puntajes ayudan a adaptar el contenido al nivel del público.",
    ],
    steps: ["Paste a few sentences.", "Press Process.", "Read the score and level label."],
    stepsEs: ["Pegá unas oraciones.", "Pulsá Procesar.", "Leé el puntaje y la etiqueta de nivel."],
    faq: [
      { q: "Why is my score above 100?", a: "Very easy short texts can exceed 100 on Fernández-Huerta; that is expected." },
      { q: "How is language detected?", a: "Heuristics look for Spanish markers; otherwise Flesch is used." },
    ],
    faqEs: [
      { q: "¿Por qué el puntaje pasa de 100?", a: "Textos muy fáciles pueden superar 100 en Fernández-Huerta; es normal." },
      { q: "¿Cómo detecta el idioma?", a: "Busca marcas del español; si no, usa Flesch." },
    ],
  },
  anagramas: {
    metaTitle: "Anagram Checker — Compare Two Phrases | UtiliHub",
    metaTitleEs: "Verificador de anagramas — Compará dos frases | UtiliHub",
    metaDescription: "Check if two words or phrases are anagrams. Ignores spaces, punctuation, and accents. Free online.",
    metaDescriptionEs: "Comprobá si dos palabras o frases son anagramas. Ignora espacios, puntuación y tildes. Gratis online.",
    about: [
      "Enter two words or phrases. The tool normalizes letters (accents stripped) and compares sorted character bags.",
    ],
    aboutEs: [
      "Ingresá dos palabras o frases. Se normalizan las letras (sin tildes) y se comparan los multiconjuntos de caracteres.",
    ],
    steps: ["Type the first phrase.", "Type the second phrase.", "Press Process."],
    stepsEs: ["Escribí la primera frase.", "Escribí la segunda.", "Pulsá Procesar."],
    faq: [
      { q: "Do spaces matter?", a: "No. Spaces and punctuation are ignored." },
      { q: "Roma and Amor?", a: "Yes — classic Spanish anagram pair." },
    ],
    faqEs: [
      { q: "¿Importan los espacios?", a: "No. Se ignoran espacios y puntuación." },
      { q: "¿Roma y Amor?", a: "Sí — el par clásico de anagramas." },
    ],
  },
  palindromo: {
    metaTitle: "Palindrome Checker — Words & Phrases | UtiliHub",
    metaTitleEs: "Verificador de palíndromos — Palabras y frases | UtiliHub",
    metaDescription: "Check if a word or phrase reads the same forwards and backwards. Free, local, no signup.",
    metaDescriptionEs: "Comprobá si una palabra o frase se lee igual al derecho y al revés. Gratis, local, sin registro.",
    about: [
      "Paste a word or full phrase. Letters are normalized so spaces and accents do not break the check.",
    ],
    aboutEs: [
      "Pegá una palabra o frase completa. Las letras se normalizan para que espacios y tildes no rompan la comprobación.",
    ],
    steps: ["Enter the text.", "Press Process.", "See yes/no with normalized form."],
    stepsEs: ["Ingresá el texto.", "Pulsá Procesar.", "Mirá sí/no con la forma normalizada."],
    faq: [
      { q: "Do spaces count?", a: "No. Only letters and digits are compared." },
    ],
    faqEs: [
      { q: "¿Cuentan los espacios?", a: "No. Solo se comparan letras y dígitos." },
    ],
  },
  "numeros-a-palabras": {
    metaTitle: "Numbers to Words — English & Spanish | UtiliHub",
    metaTitleEs: "Números a palabras — Español e inglés | UtiliHub",
    metaDescription: "Spell out integers in English or Spanish up to 999,999,999. Browser-only converter.",
    metaDescriptionEs: "Escribí enteros en palabras en español o inglés hasta 999.999.999. Conversor solo en el navegador.",
    about: [
      "Enter a non-negative integer. On English pages you get English words; on Spanish pages, Spanish wording including un millón / millones.",
    ],
    aboutEs: [
      "Ingresá un entero no negativo. En páginas en español obtenés la forma en español (un millón / millones); en inglés, la forma inglesa.",
    ],
    steps: ["Type digits only.", "Press Process.", "Copy the spelled-out number."],
    stepsEs: ["Escribí solo dígitos.", "Pulsá Procesar.", "Copiá el número en palabras."],
    faq: [
      { q: "What is the maximum?", a: "999,999,999 (nine hundred ninety-nine million)." },
      { q: "Decimals?", a: "Not supported — use whole numbers only." },
    ],
    faqEs: [
      { q: "¿Cuál es el máximo?", a: "999.999.999 (novecientos noventa y nueve millones)." },
      { q: "¿Decimales?", a: "No — solo enteros." },
    ],
  },
  "csv-a-json": {
    metaTitle: "CSV to JSON Converter — Tables to Objects | UtiliHub",
    metaTitleEs: "Conversor CSV a JSON — Tablas a objetos | UtiliHub",
    metaDescription: "Convert CSV tables to JSON arrays of objects in the browser. Handles quoted fields. Free and private.",
    metaDescriptionEs: "Convertí tablas CSV a arrays JSON de objetos en el navegador. Soporta campos entre comillas. Gratis y privado.",
    about: [
      "Paste a CSV with a header row. Each following row becomes a JSON object keyed by column names.",
      "Quoted fields with commas are supported.",
    ],
    aboutEs: [
      "Pegá un CSV con fila de encabezados. Cada fila siguiente se convierte en un objeto JSON con esas claves.",
      "Se admiten campos entre comillas con comas.",
    ],
    steps: ["Paste CSV including headers.", "Press Process.", "Copy the JSON array."],
    stepsEs: ["Pegá el CSV con encabezados.", "Pulsá Procesar.", "Copiá el array JSON."],
    faq: [
      { q: "What if a row has fewer columns?", a: "Missing cells become empty strings." },
      { q: "Is data uploaded?", a: "No — conversion is local." },
    ],
    faqEs: [
      { q: "¿Y si una fila tiene menos columnas?", a: "Las celdas faltantes quedan como cadenas vacías." },
      { q: "¿Se suben los datos?", a: "No — la conversión es local." },
    ],
  },
  "qr-wifi": {
    metaTitle: "WiFi QR Code Generator — SSID & Password | UtiliHub",
    metaTitleEs: "Generador de QR WiFi — SSID y contraseña | UtiliHub",
    metaDescription: "Generate a scannable WiFi QR code with SSID, WPA/WEP, and password. Share network access without typing.",
    metaDescriptionEs: "Generá un QR WiFi escaneable con SSID, WPA/WEP y contraseña. Compartí la red sin escribir la clave.",
    about: [
      "Enter network name, security type, and password. The tool builds the standard WIFI: payload and renders a QR image.",
      "Guests scan the code to join without typing credentials.",
    ],
    aboutEs: [
      "Ingresá el nombre de la red, el tipo de seguridad y la contraseña. Se arma el payload WIFI: y se muestra un QR.",
      "Los invitados escanean el código para unirse sin tipear la clave.",
    ],
    steps: ["Enter SSID.", "Choose security (WPA, WEP, or none).", "Enter password if needed and generate."],
    stepsEs: ["Ingresá el SSID.", "Elegí seguridad (WPA, WEP o ninguna).", "Ingresá la contraseña si hace falta y generá."],
    faq: [
      { q: "Where is the QR image from?", a: "The payload is built locally; the PNG is requested from a public QR API for display." },
      { q: "Is the password stored?", a: "No. It only appears in the QR payload you generate in-session." },
    ],
    faqEs: [
      { q: "¿De dónde sale la imagen del QR?", a: "El payload se arma en local; el PNG se pide a una API pública de QR solo para mostrarlo." },
      { q: "¿Se guarda la contraseña?", a: "No. Solo aparece en el payload del QR que generás en la sesión." },
    ],
  },
  "validador-cuit": {
    metaTitle: "CUIT/CUIL Validator — Argentina Check Digit | UtiliHub",
    metaTitleEs: "Validador CUIT/CUIL Argentina | UtiliHub",
    metaDescription: "Validate Argentine CUIT/CUIL numbers with the official check-digit algorithm and format XX-XXXXXXXX-X.",
    metaDescriptionEs: "Validá CUIT/CUIL argentinos con el algoritmo oficial de dígito verificador y formato XX-XXXXXXXX-X.",
    about: [
      "Enter 11 digits (with or without dashes). The tool verifies the check digit and notes whether the prefix is a common AFIP type.",
    ],
    aboutEs: [
      "Ingresá 11 dígitos (con o sin guiones). Se verifica el dígito verificador y se indica si el prefijo es un tipo habitual de AFIP.",
    ],
    steps: ["Paste the CUIT/CUIL.", "Press Validate.", "Read valid/invalid and formatted output."],
    stepsEs: ["Pegá el CUIT/CUIL.", "Pulsá Validar.", "Leé válido/inválido y el formato."],
    faq: [
      { q: "What prefixes are common?", a: "20, 23, 24, 27 (individuals) and 30, 33, 34 (companies) are typical." },
      { q: "CUIT vs CUIL?", a: "Same 11-digit structure and algorithm; prefixes differ by person vs company use." },
    ],
    faqEs: [
      { q: "¿Qué prefijos son habituales?", a: "20, 23, 24, 27 (personas) y 30, 33, 34 (empresas) son típicos." },
      { q: "¿CUIT o CUIL?", a: "Comparten estructura de 11 dígitos y el mismo algoritmo; cambian los prefijos según persona o empresa." },
    ],
  },
};
