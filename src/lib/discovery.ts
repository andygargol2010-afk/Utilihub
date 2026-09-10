import { ALL_TOOLS, type CatalogTool } from "./all-tools";

/** Journeys selected by intent; fallback still uses the category. */
export const TOOL_JOURNEYS: Record<string, string[]> = {
  "contador-de-palabras": ["contador-de-caracteres", "contador-de-lineas", "limpiar-texto", "diferencia-textos"],
  "diferencia-textos": ["contador-de-palabras", "limpiar-texto", "markdown-a-html"],
  "comparador-de-textos": ["generador-nombres-archivos", "contador-de-caracteres", "diferencia-textos"],
  "markdown-a-html": ["html-a-texto", "markdown-tabla", "limpiar-texto"],
  "generador-nombres-archivos": ["limpiar-texto", "slug-generator", "contador-de-palabras"],
  "generador-claves-api": ["token-seguro", "hmac-sha256", "comparador-hashes"],
  "analizador-entropia": ["password-strength", "passphrase", "generador-claves-api"],
  "mezclador-de-colores": ["generador-paleta", "paleta-complementaria", "contraste-wcag"],
  "contraste-wcag": ["selector-color", "mezclador-de-colores", "paleta-complementaria"],
  "generador-gradiente": ["generador-paleta", "generador-sombra-css", "css-grid-generator"],
  "regla-50-30-20": ["propina-y-cuenta-compartida", "porcentaje-de-cambio", "objetivo-de-ahorro"],
  "propina-y-cuenta-compartida": ["regla-50-30-20", "porcentaje-de-cambio", "precio-con-impuesto"],
  "interes-compuesto": ["objetivo-de-ahorro", "ahorro-periodico", "rentabilidad-real"],
  "valoracion-dcf": ["calculadora-wacc", "calculadora-roic", "valor-actual-neto"],
};

export function journeyTools(current: Pick<CatalogTool, "slug" | "category">): CatalogTool[] {
  const curated = TOOL_JOURNEYS[current.slug] ?? [];
  const selected = curated.map((slug) => ALL_TOOLS.find((tool) => tool.slug === slug)).filter((tool): tool is CatalogTool => Boolean(tool));
  if (selected.length >= 3) return selected.slice(0, 4);
  const fallback = ALL_TOOLS.filter((tool) => tool.category === current.category && tool.slug !== current.slug && !selected.some((item) => item.slug === tool.slug));
  return [...selected, ...fallback].slice(0, 4);
}

export function journeyLabel(current: Pick<CatalogTool, "slug" | "category">): string {
  if (current.category === "seguridad") return "Protect and verify your data";
  if (current.category === "diseno") return "Design and validate your interface";
  if (current.category === "utilidades") return "Complete your calculation";
  if (current.category === "finanzas") return "Analyze the next scenario";
  if (current.category === "texto") return "Keep working on your content";
  return "Continue with related tools";
}
