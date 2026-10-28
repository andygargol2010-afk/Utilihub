// TOOL_SEO_OVERRIDES_GAP part 2 — split out of ../tool-seo-overrides-gap.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GAP_2: Record<string, ToolSeoOverride> = {
  "validador-palindromo": {
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
  "validador-iban": {
    metaTitle: "IBAN Validator — Mod-97 Checksum Online | UtiliHub",
    metaTitleEs: "Validador IBAN — dígito de control mod-97 | UtiliHub",
    metaDescription: "Validate IBAN numbers with the ISO 13616 mod-97 checksum and country length. Free, local, no signup.",
    metaDescriptionEs: "Validá un IBAN con el checksum mod-97 de ISO 13616 y la longitud del país. Gratis, local y sin registro.",
    about: [
      "Paste an IBAN with or without spaces. The tool checks the country length when known and the ISO 13616 mod-97 checksum.",
      "A valid checksum does not prove the bank account exists — only that the number is well formed.",
    ],
    aboutEs: [
      "Pegá un IBAN con o sin espacios. Se comprueba la longitud del país si está en la tabla y el checksum mod-97 de ISO 13616.",
      "Un checksum válido no prueba que la cuenta exista: solo que el número está bien formado.",
    ],
    steps: ["Paste the IBAN.", "Press Validate.", "Read valid or invalid, the grouped format, and the length note."],
    stepsEs: ["Pegá el IBAN.", "Pulsá Validar.", "Leé válido o inválido, el formato agrupado y la nota de longitud."],
    faq: [
      { q: "Which countries are checked for length?", a: "Common SEPA and several other ISO registries (ES, DE, FR, GB, IT, PT, BR, and others). Unknown countries still get a checksum check if the length is 15–34." },
      { q: "Is the IBAN uploaded?", a: "No. The checksum runs in your browser." },
    ],
    faqEs: [
      { q: "¿Qué países tienen control de longitud?", a: "Los habituales de SEPA y otros del registro ISO (ES, DE, FR, GB, IT, PT, BR y más). Si el país no está en la tabla, igual se valida el checksum si hay entre 15 y 34 caracteres." },
      { q: "¿Se sube el IBAN?", a: "No. El checksum se calcula en el navegador." },
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
