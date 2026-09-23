/** SEO for gap batch tools — unique EN/ES copy, not generic makeTool defaults. */

export type ToolSeoOverrideGap = {
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

export const TOOL_SEO_OVERRIDES_GAP: Record<string, ToolSeoOverrideGap> = {
  "codigo-morse": {
    metaTitle: "Morse code translator online | UtiliHub",
    metaTitleEs: "Traductor de código Morse online | UtiliHub",
    metaDescription:
      "Convert text to Morse code and Morse back to text in your browser. Free Morse translator, no signup.",
    metaDescriptionEs:
      "Convertí texto a código Morse y Morse a texto en el navegador. Traductor Morse gratis, sin registro.",
    about: [
      "This Morse code translator maps letters, digits, and common punctuation to standard International Morse sequences using dots and dashes.",
      "Paste plain text to encode, or paste Morse separated by spaces (use / between words) to decode. Processing stays in your browser.",
    ],
    aboutEs: [
      "Este traductor de código Morse convierte letras, números y signos habituales a la secuencia internacional con puntos y rayas.",
      "Pegá texto plano para codificar, o Morse separado por espacios (usá / entre palabras) para decodificar. Todo corre en tu navegador.",
    ],
    steps: [
      "Paste text or Morse code in the input box.",
      "Run the tool: plain text becomes Morse; Morse sequences become text.",
      "Copy the result for radio practice, puzzles, or learning.",
    ],
    stepsEs: [
      "Pegá texto o código Morse en el campo de entrada.",
      "Ejecutá la herramienta: el texto plano pasa a Morse; las secuencias Morse vuelven a texto.",
      "Copiá el resultado para practicar, juegos o aprendizaje.",
    ],
    faq: [
      {
        q: "Which Morse standard is used?",
        a: "International Morse for A–Z, 0–9, and a small set of punctuation. Unknown symbols are skipped when decoding.",
      },
      {
        q: "How should words be separated in Morse?",
        a: "Separate letters with spaces and words with a slash (/). Example: .... . / .-.. .-.. ---",
      },
    ],
    faqEs: [
      {
        q: "¿Qué estándar de Morse se usa?",
        a: "Morse internacional para A–Z, 0–9 y signos básicos. Al decodificar se omiten símbolos desconocidos.",
      },
      {
        q: "¿Cómo se separan las palabras en Morse?",
        a: "Separá letras con espacios y palabras con barra (/). Ejemplo: .... . / .-.. .-.. ---",
      },
    ],
  },
  "csv-a-json": {
    metaTitle: "CSV to JSON converter online | UtiliHub",
    metaTitleEs: "Convertidor CSV a JSON online | UtiliHub",
    metaDescription:
      "Turn CSV tables into JSON arrays of objects in the browser. Free CSV to JSON tool with header row support.",
    metaDescriptionEs:
      "Convertí tablas CSV en arrays JSON de objetos en el navegador. Herramienta gratis CSV a JSON con encabezados.",
    about: [
      "This converter treats the first CSV row as object keys and builds a JSON array. Fields may be quoted; commas inside quotes are preserved.",
      "Ideal for exporting spreadsheets into APIs, configs, or front-end fixtures without uploading files to a server.",
    ],
    aboutEs: [
      "Este convertidor toma la primera fila del CSV como claves y arma un array JSON. Los campos pueden ir entre comillas; las comas internas se respetan.",
      "Útil para pasar hojas de cálculo a APIs, configs o fixtures de front sin subir archivos a un servidor.",
    ],
    steps: [
      "Paste CSV with a header row.",
      "Run the conversion to get pretty-printed JSON.",
      "Copy the JSON into your app or save it locally.",
    ],
    stepsEs: [
      "Pegá un CSV con fila de encabezados.",
      "Ejecutá la conversión para obtener JSON indentado.",
      "Copiá el JSON a tu app o guardalo en local.",
    ],
    faq: [
      {
        q: "Must the CSV have a header?",
        a: "Yes. The first row becomes property names. Rows with a different column count are rejected.",
      },
      {
        q: "Is my CSV uploaded?",
        a: "No. Parsing runs entirely in your browser.",
      },
    ],
    faqEs: [
      {
        q: "¿El CSV necesita encabezado?",
        a: "Sí. La primera fila define los nombres de propiedad. Las filas con otra cantidad de columnas se rechazan.",
      },
      {
        q: "¿Se sube mi CSV?",
        a: "No. El parseo corre solo en tu navegador.",
      },
    ],
  },
  "texto-binario": {
    metaTitle: "Text to binary converter online | UtiliHub",
    metaTitleEs: "Conversor de texto a binario online | UtiliHub",
    metaDescription:
      "Encode text to binary (UTF-8 bytes) or decode binary back to text. Free local converter.",
    metaDescriptionEs:
      "Codificá texto a binario (bytes UTF-8) o decodificá binario a texto. Conversor gratis y local.",
    about: [
      "Encoding uses UTF-8 so accented characters and emoji are preserved as multi-byte sequences shown as 8-bit groups.",
      "Paste binary groups of 0 and 1 (spaces optional) to reverse the process. Invalid bit lengths raise a clear error.",
    ],
    aboutEs: [
      "La codificación usa UTF-8: acentos y emoji se preservan como secuencias multi-byte en grupos de 8 bits.",
      "Pegá grupos binarios de 0 y 1 (espacios opcionales) para invertir el proceso. Longitudes inválidas muestran un error claro.",
    ],
    steps: [
      "Paste text to encode, or binary (0/1) to decode.",
      "The tool auto-detects direction from the input.",
      "Copy the binary string or recovered text.",
    ],
    stepsEs: [
      "Pegá texto para codificar, o binario (0/1) para decodificar.",
      "La herramienta detecta la dirección según la entrada.",
      "Copiá la cadena binaria o el texto recuperado.",
    ],
    faq: [
      {
        q: "Is this the same as decimal↔binary for numbers?",
        a: "No. This tool works on full text via UTF-8 bytes, not on a single integer.",
      },
      {
        q: "How are bytes separated?",
        a: "Encoded output uses spaces between 8-bit groups. Decoding accepts spaces or continuous bits (multiple of 8).",
      },
    ],
    faqEs: [
      {
        q: "¿Es lo mismo que decimal↔binario de números?",
        a: "No. Esta herramienta trabaja con texto completo vía bytes UTF-8, no con un solo entero.",
      },
      {
        q: "¿Cómo se separan los bytes?",
        a: "La salida codificada usa espacios entre grupos de 8 bits. Al decodificar se aceptan espacios o bits continuos (múltiplo de 8).",
      },
    ],
  },
  "frecuencia-palabras": {
    metaTitle: "Word frequency counter online | UtiliHub",
    metaTitleEs: "Contador de frecuencia de palabras online | UtiliHub",
    metaDescription:
      "Rank words by how often they appear in any text. Free word frequency analyzer in the browser.",
    metaDescriptionEs:
      "Ordená las palabras por cuántas veces aparecen en un texto. Analizador de frecuencia gratis en el navegador.",
    about: [
      "The counter tokenizes on letters and numbers, lowercases tokens, and ranks by frequency (ties keep stable order).",
      "Useful for editing, SEO drafts, language learning, or spotting overused terms—without sending text to a server.",
    ],
    aboutEs: [
      "El contador tokeniza letras y números, pasa a minúsculas y ordena por frecuencia (los empates mantienen orden estable).",
      "Sirve para editar, borradores SEO, aprendizaje de idiomas o detectar muletillas—sin enviar el texto a un servidor.",
    ],
    steps: [
      "Paste the full text you want to analyze.",
      "Run the tool to see count and rank per word.",
      "Use the ranking to edit or study the vocabulary.",
    ],
    stepsEs: [
      "Pegá el texto completo que querés analizar.",
      "Ejecutá la herramienta para ver conteo y ranking por palabra.",
      "Usá el ranking para editar o estudiar el vocabulario.",
    ],
    faq: [
      {
        q: "Are punctuation and case ignored?",
        a: "Punctuation is stripped from tokens; comparison is case-insensitive.",
      },
      {
        q: "Is there a limit?",
        a: "Only practical browser memory. Very large pastes may feel slower but still stay local.",
      },
    ],
    faqEs: [
      {
        q: "¿Se ignoran signos y mayúsculas?",
        a: "Los signos se quitan de los tokens; la comparación no distingue mayúsculas.",
      },
      {
        q: "¿Hay un límite?",
        a: "Solo la memoria del navegador. Textos muy largos pueden ir más lentos, pero siguen siendo locales.",
      },
    ],
  },
  "nivel-lectura": {
    metaTitle: "Reading level calculator (Flesch) | UtiliHub",
    metaTitleEs: "Calculadora de nivel de lectura (Flesch) | UtiliHub",
    metaDescription:
      "Estimate text readability with Flesch Reading Ease (English) or Fernández-Huerta (Spanish).",
    metaDescriptionEs:
      "Estimá la legibilidad de un texto con Flesch Reading Ease (inglés) o Fernández-Huerta (español).",
    about: [
      "English text is scored with the classic Flesch Reading Ease formula from average sentence length and syllables per word.",
      "Spanish text uses the Fernández-Huerta adaptation, better aligned with Spanish syllable patterns. Scores are estimates for editing, not formal certification.",
    ],
    aboutEs: [
      "Los textos en inglés se puntúan con Flesch Reading Ease a partir de la longitud media de frase y sílabas por palabra.",
      "En español se usa la adaptación de Fernández-Huerta, más acorde al patrón silábico. Son estimaciones de edición, no un certificado formal.",
    ],
    steps: [
      "Paste a paragraph or article draft.",
      "The tool picks the English or Spanish formula from the language of the text.",
      "Read the score and the short interpretation band.",
    ],
    stepsEs: [
      "Pegá un párrafo o borrador de artículo.",
      "La herramienta elige la fórmula en inglés o español según el idioma del texto.",
      "Revisá el puntaje y la banda de interpretación.",
    ],
    faq: [
      {
        q: "What is a good Flesch score?",
        a: "Roughly 60–70 is plain English for a general audience. Higher is easier; lower is more difficult.",
      },
      {
        q: "Does it count syllables perfectly?",
        a: "No. Syllable counts are heuristic approximations suitable for quick feedback while writing.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué puntaje Flesch es bueno?",
        a: "Alrededor de 60–70 es lectura clara para público general. Más alto es más fácil; más bajo, más difícil.",
      },
      {
        q: "¿Cuenta sílabas a la perfección?",
        a: "No. El conteo de sílabas es heurístico y sirve como feedback rápido al escribir.",
      },
    ],
  },
  anagramas: {
    metaTitle: "Anagram checker online | UtiliHub",
    metaTitleEs: "Comprobador de anagramas online | UtiliHub",
    metaDescription:
      "Check if two phrases are anagrams of each other. Free local anagram tool.",
    metaDescriptionEs:
      "Comprobá si dos frases son anagramas entre sí. Herramienta de anagramas gratis y local.",
    about: [
      "An anagram uses exactly the same letters with the same frequencies, ignoring spaces, punctuation, and case.",
      "Enter the first phrase in the main box and the second in the comparison field, then run the check.",
    ],
    aboutEs: [
      "Un anagrama usa exactamente las mismas letras con la misma frecuencia, ignorando espacios, signos y mayúsculas.",
      "Escribí la primera frase en el campo principal y la segunda en el de comparación; luego ejecutá la prueba.",
    ],
    steps: [
      "Type or paste phrase A.",
      "Type or paste phrase B in the second field.",
      "Run the tool to see whether they are anagrams.",
    ],
    stepsEs: [
      "Escribí o pegá la frase A.",
      "Escribí o pegá la frase B en el segundo campo.",
      "Ejecutá la herramienta para ver si son anagramas.",
    ],
    faq: [
      {
        q: "Do accents matter?",
        a: "Accented letters are treated as distinct from their base letter (é ≠ e).",
      },
      {
        q: "Can I find all anagrams of a word?",
        a: "This tool checks two phrases against each other; it does not search a dictionary.",
      },
    ],
    faqEs: [
      {
        q: "¿Importan los acentos?",
        a: "Las letras acentuadas se tratan distintas de su base (é ≠ e).",
      },
      {
        q: "¿Puedo encontrar todos los anagramas de una palabra?",
        a: "Esta herramienta compara dos frases entre sí; no busca en un diccionario.",
      },
    ],
  },
  palindromo: {
    metaTitle: "Palindrome checker online | UtiliHub",
    metaTitleEs: "Comprobador de palíndromos online | UtiliHub",
    metaDescription:
      "Test whether a word or sentence is a palindrome. Free checker that ignores spaces and punctuation.",
    metaDescriptionEs:
      "Probá si una palabra o frase es un palíndromo. Comprobador gratis que ignora espacios y signos.",
    about: [
      "A palindrome reads the same forwards and backwards. This checker normalizes case and strips spaces and punctuation before comparing.",
      "Works for single words (radar) and classic phrases (A man a plan a canal Panama).",
    ],
    aboutEs: [
      "Un palíndromo se lee igual al derecho y al revés. Este comprobador normaliza mayúsculas y quita espacios y signos antes de comparar.",
      "Sirve para palabras sueltas (reconocer) y frases clásicas.",
    ],
    steps: [
      "Paste the word or phrase.",
      "Run the check.",
      "Read the yes/no result and the normalized form used for comparison.",
    ],
    stepsEs: [
      "Pegá la palabra o frase.",
      "Ejecutá la comprobación.",
      "Mirá el resultado sí/no y la forma normalizada usada para comparar.",
    ],
    faq: [
      {
        q: "Are spaces ignored?",
        a: "Yes. Spaces and most punctuation are removed so sentence palindromes work.",
      },
      {
        q: "What about numbers?",
        a: "Digits are kept, so numeric palindromes like 12321 are supported.",
      },
    ],
    faqEs: [
      {
        q: "¿Se ignoran los espacios?",
        a: "Sí. Se quitan espacios y la mayoría de signos para que funcionen las frases.",
      },
      {
        q: "¿Y los números?",
        a: "Los dígitos se conservan; por ejemplo 12321 se reconoce como palíndromo.",
      },
    ],
  },
  "qr-wifi": {
    metaTitle: "WiFi QR code generator online | UtiliHub",
    metaTitleEs: "Generador de código QR WiFi online | UtiliHub",
    metaDescription:
      "Create a QR code that joins a WiFi network from SSID, password, and security type. Free WiFi QR tool.",
    metaDescriptionEs:
      "Creá un código QR para unirse a una red WiFi con SSID, contraseña y tipo de seguridad. QR WiFi gratis.",
    about: [
      "The tool builds a standard WIFI: QR payload (WPA/WPA2, WEP, or open) so phones can join without typing the password.",
      "The QR image is requested from a public QR rendering API using only the encoded payload; the password is not stored on UtiliHub servers.",
    ],
    aboutEs: [
      "La herramienta arma el payload estándar WIFI: (WPA/WPA2, WEP o abierta) para que el celular se una sin tipear la clave.",
      "La imagen del QR se pide a una API pública de renderizado solo con el payload; UtiliHub no guarda la contraseña.",
    ],
    steps: [
      "Enter the network name (SSID).",
      "Choose security type and enter the password if required.",
      "Generate the QR and scan it with a phone camera.",
    ],
    stepsEs: [
      "Ingresá el nombre de la red (SSID).",
      "Elegí el tipo de seguridad y la contraseña si corresponde.",
      "Generá el QR y escanealo con la cámara del celular.",
    ],
    faq: [
      {
        q: "Does this work offline?",
        a: "Payload generation is local, but the QR image uses an external image URL. For fully offline use, copy the WIFI: string into any offline QR app.",
      },
      {
        q: "Is WPA3 listed?",
        a: "Use the WPA option; most devices accept the same WIFI: payload for WPA2/WPA3 personal networks.",
      },
    ],
    faqEs: [
      {
        q: "¿Funciona sin internet?",
        a: "El payload se genera en local, pero la imagen del QR usa una URL externa. Para uso 100 % offline, copiá la cadena WIFI: a cualquier app de QR offline.",
      },
      {
        q: "¿Y WPA3?",
        a: "Usá la opción WPA; la mayoría de equipos aceptan el mismo payload WIFI: en redes WPA2/WPA3 personales.",
      },
    ],
  },
  "validador-cuit": {
    metaTitle: "CUIT / CUIL validator Argentina | UtiliHub",
    metaTitleEs: "Validador de CUIT / CUIL Argentina | UtiliHub",
    metaDescription:
      "Validate Argentine CUIT or CUIL numbers and verify the check digit offline in your browser.",
    metaDescriptionEs:
      "Validá números de CUIT o CUIL argentinos y verificá el dígito comprobador offline en el navegador.",
    about: [
      "CUIT and CUIL are 11-digit Argentine tax identifiers. This validator checks length, allowed type prefixes, and the official check-digit algorithm.",
      "It does not contact AFIP or any registry: a valid checksum means the number is well-formed, not that it is assigned to a person or company.",
    ],
    aboutEs: [
      "CUIT y CUIL son identificadores fiscales argentinos de 11 dígitos. Este validador revisa longitud, prefijos de tipo admitidos y el algoritmo oficial del dígito verificador.",
      "No consulta AFIP ni ningún padrón: un checksum válido indica que el número está bien formado, no que esté asignado a una persona o empresa.",
    ],
    steps: [
      "Enter the CUIT/CUIL with or without hyphens.",
      "Run the validator.",
      "Read whether the format and check digit are correct.",
    ],
    stepsEs: [
      "Ingresá el CUIT/CUIL con o sin guiones.",
      "Ejecutá el validador.",
      "Revisá si el formato y el dígito verificador son correctos.",
    ],
    faq: [
      {
        q: "Which prefixes are accepted?",
        a: "Common person and company types such as 20, 23, 24, 27, 30, 33, and 34 are accepted.",
      },
      {
        q: "Is this an official AFIP service?",
        a: "No. It only verifies mathematical structure locally.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué prefijos se aceptan?",
        a: "Tipos habituales de persona y empresa como 20, 23, 24, 27, 30, 33 y 34.",
      },
      {
        q: "¿Es un servicio oficial de AFIP?",
        a: "No. Solo verifica la estructura matemática en local.",
      },
    ],
  },
  "numeros-a-palabras": {
    metaTitle: "Number to words converter online | UtiliHub",
    metaTitleEs: "Números a palabras online | UtiliHub",
    metaDescription:
      "Spell out integers in English or Spanish. Free number-to-words converter for amounts and documents.",
    metaDescriptionEs:
      "Escribí enteros en letras en inglés o español. Conversor gratis de números a palabras para montos y documentos.",
    about: [
      "Converts non-negative integers up to 999,999,999 into words. Language follows the site locale (English or Spanish) including compound forms.",
      "Handy for checks, contracts, invoices, and accessibility text alternatives—always review legal wording with a human.",
    ],
    aboutEs: [
      "Convierte enteros no negativos hasta 999.999.999 en palabras. El idioma sigue el locale del sitio (inglés o español), con formas compuestas.",
      "Útil para cheques, contratos, facturas y alternativas de accesibilidad—siempre revisá textos legales con una persona.",
    ],
    steps: [
      "Enter a whole number (digits only).",
      "Run the conversion.",
      "Copy the spelled-out result.",
    ],
    stepsEs: [
      "Ingresá un número entero (solo dígitos).",
      "Ejecutá la conversión.",
      "Copiá el resultado en letras.",
    ],
    faq: [
      {
        q: "Are decimals supported?",
        a: "Not in this version. Round or split the fractional part manually.",
      },
      {
        q: "Which Spanish variant?",
        a: "Uses common Latin American forms (e.g. millón, veintiún).",
      },
    ],
    faqEs: [
      {
        q: "¿Soporta decimales?",
        a: "No en esta versión. Redondeá o separá la parte fraccionaria a mano.",
      },
      {
        q: "¿Qué variante de español?",
        a: "Formas habituales en Latinoamérica (p. ej. millón, veintiún).",
      },
    ],
  },
};
