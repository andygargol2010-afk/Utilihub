import type { CatalogTool } from "@/lib/all-tools";
import { spanishCategoryName } from "./es";

/** Exact Spanish one-liners for high-traffic / awkward tools. */
const EXACT_SUMMARIES: Record<string, string> = {
  calculadora: "Calculadora básica online. Operaciones rápidas en el navegador.",
  "calculadora-de-porcentajes": "Calculá porcentajes, aumentos y descuentos al instante.",
  porcentaje: "Calculá porcentajes, aumentos, descuentos y proporciones.",
  "regla-de-tres": "Resolvé reglas de tres simples y compuestas.",
  "calculadora-de-fechas": "Diferencia entre fechas, sumar o restar días.",
  "contador-de-palabras": "Contá palabras, caracteres y párrafos al instante.",
  "generador-de-contrasenas": "Generá contraseñas seguras con longitud y símbolos a medida.",
  "conversor-de-temperatura": "Convertí entre Celsius, Fahrenheit y Kelvin.",
  "conversor-de-longitud": "Convertí metros, pies, pulgadas y más unidades de longitud.",
  "conversor-de-peso": "Convertí kilos, libras, onzas y otras unidades de peso.",
  "conversor-de-unidades": "Conversor general de unidades comunes.",
  "conversor-de-divisas": "Convertí entre divisas con tipos de cambio de referencia.",
  "interes-compuesto": "Simulá el crecimiento de una inversión con interés compuesto.",
  "png-a-jpg": "Convertí imágenes PNG a JPG en el navegador, sin subir archivos.",
  "jpg-a-png": "Convertí imágenes JPG a PNG en el navegador.",
  "unir-pdf": "Uní varios PDF en un solo archivo desde el navegador.",
  "dividir-pdf": "Dividí un PDF por páginas o rangos.",
  imc: "Calculá tu índice de masa corporal (IMC) con peso y altura.",
  "calculadora-imc": "Calculá tu índice de masa corporal (IMC) con peso y altura.",
  "modelador-3d": "Modelado 3D en el navegador para formas y escenas simples.",
  "modelador-casas-3d": "Diseñá planos y volúmenes de casas en 3D.",
  pixelihub: "Estudio de pixel art: capas, paletas y export PNG.",
  "dividir-cuenta": "Repartí la cuenta entre varias personas, con propina opcional.",
  "calculadora-propina": "Calculá la propina y el total a pagar.",
  "propina-compartida": "Calculá la propina y dividí la cuenta entre varias personas.",
  "calculadora-propina-compartida": "Calculá la propina y dividí la cuenta entre varias personas.",
  "generador-nombres-archivos": "Normalizá títulos y generá nombres de archivo consistentes.",
  "generador-de-nombres-de-archivos": "Normalizá títulos y generá nombres de archivo consistentes.",
};

/** Longer phrases first so they win over single-word rules. */
const SUMMARY_PHRASES: Array<[RegExp, string]> = [
  [/Runs fully in the browser\.?/gi, "Funciona por completo en el navegador."],
  [/runs? locally in the browser\.?/gi, "funciona en el navegador de forma local."],
  [/in the browser\.?/gi, "en el navegador."],
  [/No signup\.?/gi, "Sin registro."],
  [/no signup\.?/gi, "sin registro."],
  [/Free,? no signup,? and with local processing when possible\.?/gi, "Gratis, sin registro y con procesamiento local cuando es posible."],
  [/Free online tool\.?/gi, "Herramienta online gratis."],
  [/Instant classification underweight, normal, overweight or obese\.?/gi, "Clasificación instantánea: bajo peso, normal, sobrepeso u obesidad."],
  [/Calculate Body Mass Index \(BMI\) from weight and height\.?/gi, "Calculá el índice de masa corporal (IMC) a partir del peso y la altura."],
  [/equal bill split among several people\.?/gi, "división equitativa de la cuenta entre varias personas."],
  [/bill split among several people\.?/gi, "división de la cuenta entre varias personas."],
  [/among several people\.?/gi, "entre varias personas."],
  [/digital projects\.?/gi, "proyectos digitales."],
  [/file names\.?/gi, "nombres de archivo"],
  [/consistent file names\.?/gi, "nombres de archivo consistentes"],
  [/Normalize titles\.?/gi, "Normalizá títulos"],
  [/create consistent\.?/gi, "creá consistentes"],
  [/Split a restaurant or group bill fairly among people,? including optional tip and rounding\.?/gi, "Repartí la cuenta de un restaurante o grupo de forma equitativa, con propina y redondeo opcionales."],
  [/\bpercentages\b/gi, "porcentajes"],
  [/\bpercentage\b/gi, "porcentaje"],
  [/\bincreases\b/gi, "aumentos"],
  [/\bincrease\b/gi, "aumento"],
  [/\bdiscounts\b/gi, "descuentos"],
  [/\bdiscount\b/gi, "descuento"],
  [/\bproportions\b/gi, "proporciones"],
  [/\bproportion\b/gi, "proporción"],
  [/\btitles\b/gi, "títulos"],
  [/\btitle\b/gi, "título"],
  [/\bprojects\b/gi, "proyectos"],
  [/\bproject\b/gi, "proyecto"],
  [/\bdigital\b/gi, "digitales"],
  [/\bconsistent\b/gi, "consistentes"],
  [/\bnormalize\b/gi, "normalizá"],
  [/\bNormalize\b/g, "Normalizá"],
  [/\bcreate\b/gi, "creá"],
  [/\bCreate\b/g, "Creá"],
  [/\bnames\b/gi, "nombres"],
  [/\bname\b/gi, "nombre"],
  [/\bfiles?\b/gi, "archivos"],
  [/\bfor\b/gi, "para"],
  [/\btip\b/gi, "propina"],
  [/\btotal\b/gi, "total"],
  [/\bequal\b/gi, "equitativa"],
  [/\bbill\b/gi, "cuenta"],
  [/\bsplit\b/gi, "división"],
  [/\bamong\b/gi, "entre"],
  [/\bseveral\b/gi, "varias"],
  [/\bpeople\b/gi, "personas"],
  [/\boptional\b/gi, "opcional"],
  [/\bincluding\b/gi, "incluyendo"],
  [/\brounding\b/gi, "redondeo"],
  [/\bfairly\b/gi, "de forma equitativa"],
  [/\brestaurant\b/gi, "restaurante"],
  [/\bgroup\b/gi, "grupo"],
  [/\bCalculate\b/g, "Calculá"],
  [/\bcalculate\b/g, "calculá"],
  [/\bConvert\b/g, "Convertí"],
  [/\bconvert\b/g, "convertí"],
  [/\bGenerate\b/g, "Generá"],
  [/\bgenerate\b/g, "generá"],
  [/\bCount\b/g, "Contá"],
  [/\bcount\b/g, "contá"],
  [/\bValidate\b/g, "Validá"],
  [/\bvalidate\b/g, "validá"],
  [/\bFormat\b/g, "Formateá"],
  [/\bformat\b/g, "formateá"],
  [/\bEncode\b/g, "Codificá"],
  [/\bencode\b/g, "codificá"],
  [/\bDecode\b/g, "Decodificá"],
  [/\bdecode\b/g, "decodificá"],
  [/\bMerge\b/g, "Uní"],
  [/\bSplit\b/g, "Dividí"],
  [/\bDownload\b/g, "Descargá"],
  [/\bUpload\b/g, "Subí"],
  [/\bEnter\b/g, "Ingresá"],
  [/\bInstant\b/g, "Instantáneo"],
  [/\bFree\b/g, "Gratis"],
  [/\bfree\b/g, "gratis"],
  [/\bpassword\b/gi, "contraseña"],
  [/\bpasswords\b/gi, "contraseñas"],
  [/\bweight\b/g, "peso"],
  [/\bheight\b/g, "altura"],
  [/\bfrom\b/g, "desde"],
  [/\band\b/g, "y"],
  [/\bor\b/g, "o"],
  [/\bwith\b/g, "con"],
  [/\bwithout\b/g, "sin"],
  [/\byour\b/g, "tu"],
  [/\bthe\b/gi, ""],
  [/\ba\b/gi, ""],
  [/\ban\b/gi, ""],
  [/\bto\b/g, "a"],
  [/\bin\b/g, "en"],
  [/\bof\b/g, "de"],
];

const EN_LEFTOVER =
  /\b(the|and|or|with|from|for|into|onto|over|under|about|between|among|each|every|using|based|simple|advanced|online|tool|tools|value|values|result|results|amount|rate|number|numbers|text|data|file|files|image|images|page|pages|user|users|account|signup|browser|device|local|instantly|quickly|easily)\b/i;

function looksMostlyEnglish(text: string): boolean {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;
  let en = 0;
  for (const w of words) {
    if (EN_LEFTOVER.test(w) || /^[A-Za-z]{4,}$/.test(w)) en += 1;
  }
  return en / words.length >= 0.35;
}

function phraseTranslate(raw: string): string {
  let out = raw;
  for (const [re, rep] of SUMMARY_PHRASES) {
    out = out.replace(re, rep);
  }
  return out.replace(/\s{2,}/g, " ").replace(/\s+([,.])/g, "$1").trim();
}

/**
 * Spanish one-line summary for catalog cards, search, and home.
 * 1) Exact map  2) phrase EN→ES  3) category fallback if still mostly English.
 */
export function spanishToolSummary(
  tool: Pick<CatalogTool, "slug" | "name" | "summary" | "category">,
): string {
  const exact = EXACT_SUMMARIES[tool.slug];
  if (exact) return exact;

  const raw = (tool.summary || "").trim();
  if (!raw) {
    const cat = spanishCategoryName(tool.category).toLowerCase();
    return `Herramienta de ${cat} gratis en el navegador.`;
  }

  if (/[áéíóúñ¿¡]/i.test(raw) && !looksMostlyEnglish(raw)) {
    return raw;
  }

  const translated = phraseTranslate(raw);
  if (translated && !looksMostlyEnglish(translated)) {
    return translated;
  }

  const cat = spanishCategoryName(tool.category).toLowerCase();
  return `Herramienta de ${cat} gratis en el navegador.`
}
