import { makeTool } from "./types";

/** Gap tools not present in the main catalog — text, dev, and seo-growth. */
const text = (slug: string, name: string, summary: string, keywords: string[] = []) =>
  makeTool(slug, name, "texto", "text", summary, keywords);

const dev = (slug: string, name: string, summary: string, keywords: string[] = []) =>
  makeTool(slug, name, "desarrollo", "code", summary, keywords);

const growth = (
  slug: string,
  name: string,
  category: string,
  kind: string,
  summary: string,
  keywords: string[] = [],
) => makeTool(slug, name, category, kind, summary, keywords, { mode: "seo-growth" });

export const GAP_TOOLS = [
  text(
    "codigo-morse",
    "Morse code translator",
    "Convert text to Morse code and Morse code back to text in the browser.",
    ["morse code", "morse translator", "código morse", "traductor morse"],
  ),
  text(
    "texto-binario",
    "Text to binary converter",
    "Convert text to UTF-8 binary and binary back to text locally.",
    ["text to binary", "binary to text", "texto a binario", "binario a texto"],
  ),
  text(
    "frecuencia-palabras",
    "Word frequency counter",
    "Count word occurrences and percentages in any text.",
    ["word frequency", "word count frequency", "frecuencia de palabras", "contador de frecuencia"],
  ),
  text(
    "nivel-lectura",
    "Reading level calculator",
    "Estimate reading ease with Flesch (English) or Fernández-Huerta (Spanish).",
    ["flesch reading ease", "reading level", "nivel de lectura", "fernández huerta"],
  ),
  text(
    "anagramas",
    "Anagram checker",
    "Check whether two words or phrases are anagrams of each other.",
    ["anagram checker", "anagrams", "anagramas", "verificador de anagramas"],
  ),
  text(
    "palindromo",
    "Palindrome checker",
    "Check if a word or phrase reads the same forwards and backwards.",
    ["palindrome checker", "palindrome", "palíndromo", "verificador de palíndromos"],
  ),
  text(
    "numeros-a-palabras",
    "Numbers to words",
    "Convert integers to words in English or Spanish (up to 999,999,999).",
    ["numbers to words", "number to text", "números a palabras", "número a texto"],
  ),
  dev(
    "csv-a-json",
    "CSV to JSON converter",
    "Convert CSV tables to JSON arrays of objects in the browser.",
    ["csv to json", "csv json converter", "csv a json", "convertir csv"],
  ),
  growth(
    "qr-wifi",
    "WiFi QR code generator",
    "generadores",
    "generator",
    "Generate a WiFi QR code with SSID, security type, and password.",
    ["wifi qr", "qr wifi", "wifi qr code", "código qr wifi"],
  ),
  growth(
    "validador-cuit",
    "CUIT/CUIL validator",
    "productividad",
    "utility",
    "Validate Argentine CUIT/CUIL numbers with check digit verification.",
    ["cuit", "cuil", "validador cuit", "cuit argentina"],
  ),
];
