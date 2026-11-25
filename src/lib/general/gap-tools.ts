import { faq, makeTool } from "./types";

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
  extra: Record<string, unknown> = {},
) => makeTool(slug, name, category, kind, summary, keywords, { mode: "seo-growth", ...extra });

const wifiQr = growth(
  "qr-wifi",
  "WiFi QR code generator",
  "generadores",
  "generator",
  "Generate a WiFi QR code with SSID, security type, and password.",
  ["wifi qr", "qr wifi", "wifi qr code", "código qr wifi"],
  {
    title: "WiFi QR Code Generator — SSID + Password to QR | UtiliHub",
    description:
      "Free WiFi QR code generator. Turn your network SSID, security type, and password into a scannable WIFI: QR payload. Local, private, no signup.",
    summaryEs: "Genera un código QR de WiFi con SSID, tipo de seguridad y contraseña.",
  },
);
wifiQr.faq.push(
  faq(
    "What is a WiFi QR code?",
    "A QR that encodes the standard WIFI: payload (SSID, security type, password). Scanning it with a phone connects to the network without typing the password.",
  ),
  faq(
    "Which security types are supported?",
    "WPA, WEP, or nopass (open network). The payload follows the WIFI:T:<type>;S:<SSID>;P:<password>; format, and special characters like ; , \" and backslash are escaped.",
  ),
  faq(
    "Is the password stored anywhere?",
    "No. The payload is built in your browser and nothing is uploaded to a server.",
  ),
);

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
  wifiQr,
  // validador-iban lives in iban-tool.ts (dedicated UI + MOD-97). Do not re-register here.
  growth(
    "validador-cuit",
    "CUIT/CUIL validator",
    "productividad",
    "utility",
    "Validate Argentine CUIT/CUIL with the official AFIP check digit (format XX-XXXXXXXX-X). Free, local, no signup.",
    ["cuit", "cuil", "cuit validator", "cuil validator", "afip check digit", "validador cuit", "cuit argentina"],
    {
      title: "CUIT/CUIL Validator — AFIP Check Digit Online | UtiliHub",
      description:
        "Validate Argentine CUIT/CUIL numbers with the official check-digit algorithm. Format XX-XXXXXXXX-X, free, runs in your browser.",
    },
  ),
];
