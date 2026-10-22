import type { CatalogTool } from "@/lib/all-tools";
import { spanishCategoryName } from "./es";

/** Optional Spanish one-liners for high-traffic tools. */
const EXACT_SUMMARIES: Record<string, string> = {
  calculadora: "Calculadora básica online. Operaciones rápidas en el navegador.",
  "calculadora-de-porcentajes": "Calculá porcentajes, aumentos y descuentos al instante.",
  "regla-de-tres": "Resolvé reglas de tres simples y compuestas.",
  "calculadora-de-fechas": "Diferencia entre fechas, sumar o restar días.",
  "contador-de-palabras": "Contá palabras, caracteres y párrafos al instante.",
  "generador-de-contrasenas": "Generá contraseñas seguras con opciones de longitud y símbolos.",
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
};

const SUMMARY_PHRASES: Array<[RegExp, string]> = [
  [/Runs fully in the browser\.?/gi, "Funciona por completo en el navegador."],
  [/in the browser\.?/gi, "en el navegador."],
  [/No signup\.?/gi, "Sin registro."],
  [/no signup\.?/gi, "sin registro."],
  [/Free,? no signup,? and with local processing when possible\.?/gi, "Gratis, sin registro y con procesamiento local cuando es posible."],
  [/Free online tool\.?/gi, "Herramienta online gratis."],
  [/Instant classification underweight, normal, overweight or obese\.?/gi, "Clasificación instantánea: bajo peso, normal, sobrepeso u obesidad."],
  [/Calculate Body Mass Index \(BMI\) from weight and height\.?/gi, "Calculá el índice de masa corporal (IMC) a partir del peso y la altura."],
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
];

/**
 * Spanish one-line summary for catalog cards, search, and home.
 * Prefer EXACT_SUMMARIES; else phrase-translate English summary; else category fallback.
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

  if (/[áéíóúñ¿¡]/i.test(raw) || /\b(calculá|convertí|generá|gratis|navegador|sin registro)\b/i.test(raw)) {
    return raw;
  }

  let out = raw;
  for (const [re, rep] of SUMMARY_PHRASES) {
    out = out.replace(re, rep);
  }
  return out.replace(/\s{2,}/g, " ").trim();
}
