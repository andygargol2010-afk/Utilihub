import type { CatalogTool } from "@/lib/all-tools";
import { spanishCategoryName } from "./es";
import { SUMMARY_ES } from "./summary-es";

/** Multi-word phrases first (interim for tools not yet in SUMMARY_ES). */
const PHRASES: Array<[RegExp, string]> = [
  [/Calculate Body Mass Index \(BMI\) from weight and height\.?/gi, "Calculá el índice de masa corporal (IMC) a partir del peso y la altura."],
  [/Instant classification underweight, normal, overweight or obese\.?/gi, "Clasificación instantánea: bajo peso, normal, sobrepeso u obesidad."],
  [/Split a restaurant or group bill fairly among people,? including optional tip and rounding\.?/gi, "Repartí la cuenta de un restaurante o grupo de forma equitativa, con propina y redondeo opcionales."],
  [/Calculate tip and total bill amount based on percentage and number of people\.?/gi, "Calculá la propina y el total de la cuenta según el porcentaje y el número de personas."],
  [/Normalize titles and create consistent file names for digital projects\.?/gi, "Normalizá títulos y generá nombres de archivo consistentes para proyectos digitales."],
  [/Runs fully in the browser\.?/gi, "Funciona por completo en el navegador."],
  [/Fully in the browser\.?/gi, "Por completo en el navegador."],
  [/Instant results in the browser\.?/gi, "Resultados al instante en el navegador."],
  [/in the browser\.?/gi, "en el navegador."],
  [/No signup\.?/gi, "Sin registro."],
];

const WORDS: Array<[RegExp, string]> = [
  [/\bCalculate\b/g, "Calculá"],
  [/\bcalculate\b/g, "calculá"],
  [/\bConvert\b/g, "Convertí"],
  [/\bconvert\b/g, "convertí"],
  [/\bGenerate\b/g, "Generá"],
  [/\bgenerate\b/g, "generá"],
  [/\bEstimate\b/g, "Estimá"],
  [/\bestimate\b/g, "estimá"],
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
  [/\bsplit\b/g, "dividí"],
  [/\bNormalize\b/g, "Normalizá"],
  [/\bnormalize\b/g, "normalizá"],
  [/\bCreate\b/g, "Creá"],
  [/\bcreate\b/g, "creá"],
  [/\bInstant\b/g, "Instantáneo"],
  [/\binstantly\b/gi, "al instante"],
  [/\bFree\b/g, "Gratis"],
  [/\bfree\b/g, "gratis"],
  [/\bpercentages\b/gi, "porcentajes"],
  [/\bpercentage\b/gi, "porcentaje"],
  [/\bincreases\b/gi, "aumentos"],
  [/\bdiscounts\b/gi, "descuentos"],
  [/\bproportions\b/gi, "proporciones"],
  [/\btitles\b/gi, "títulos"],
  [/\bprojects\b/gi, "proyectos"],
  [/\bdigital\b/gi, "digitales"],
  [/\bconsistent\b/gi, "consistentes"],
  [/\bnames\b/gi, "nombres"],
  [/\bfile names\b/gi, "nombres de archivo"],
  [/\bfiles\b/gi, "archivos"],
  [/\bfile\b/gi, "archivo"],
  [/\btip\b/gi, "propina"],
  [/\bbill\b/gi, "cuenta"],
  [/\bamong\b/gi, "entre"],
  [/\bseveral\b/gi, "varias"],
  [/\bpeople\b/gi, "personas"],
  [/\boptional\b/gi, "opcional"],
  [/\bincluding\b/gi, "incluyendo"],
  [/\brounding\b/gi, "redondeo"],
  [/\bweight\b/gi, "peso"],
  [/\bheight\b/gi, "altura"],
  [/\bpassword\b/gi, "contraseña"],
  [/\bpasswords\b/gi, "contraseñas"],
  [/\bbrowser\b/gi, "navegador"],
  [/\bresults\b/gi, "resultados"],
  [/\bbased on\b/gi, "según"],
  [/\bbetween\b/gi, "entre"],
  [/\bwithout\b/gi, "sin"],
  [/\bwith\b/gi, "con"],
  [/\bfrom\b/gi, "desde"],
  [/\bfor\b/gi, "para"],
  [/\band\b/g, "y"],
  [/\bor\b/g, "o"],
  [/\byour\b/gi, "tu"],
  [/\bthe\b/gi, ""],
  [/\ba\b/gi, ""],
  [/\ban\b/gi, ""],
  [/\bto\b/g, "a"],
  [/\bin\b/g, "en"],
  [/\bof\b/g, "de"],
];

function phraseTranslate(raw: string): string {
  let out = raw;
  for (const [re, rep] of PHRASES) out = out.replace(re, rep);
  for (const [re, rep] of WORDS) out = out.replace(re, rep);
  return out
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .replace(/\s+\./g, ".")
    .trim();
}

type ToolLike = Pick<CatalogTool, "slug" | "name" | "summary" | "category"> & {
  summaryEs?: string;
};

/**
 * Spanish one-line summary for catalog cards, search, and home.
 *
 * Priority:
 * 1. tool.summaryEs (from makeTool config)
 * 2. SUMMARY_ES curated map (batch migration)
 * 3. phrase-translate of English summary (interim)
 * 4. category fallback only if no summary at all
 */
export function spanishToolSummary(tool: ToolLike): string {
  const fromTool = tool.summaryEs?.trim();
  if (fromTool) return fromTool;

  const curated = SUMMARY_ES[tool.slug]?.trim();
  if (curated) return curated;

  const raw = (tool.summary || "").trim();
  if (!raw) {
    const cat = spanishCategoryName(tool.category).toLowerCase();
    return `Herramienta de ${cat} gratis en el navegador.`;
  }

  if (/[áéíóúñ¿¡]/i.test(raw) && !/\b(Calculate|Convert|Generate|from weight|in the browser)\b/.test(raw)) {
    return raw;
  }

  return phraseTranslate(raw);
}
