import { ALL_TOOLS, type CatalogTool } from "./all-tools";

/** Recorridos seleccionados por intención; el fallback sigue usando la categoría. */
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
  if (current.category === "seguridad") return "Protege y verifica tus datos";
  if (current.category === "diseno") return "Diseña y valida tu interfaz";
  if (current.category === "utilidades") return "Completa tu cálculo";
  if (current.category === "finanzas") return "Analiza el siguiente escenario";
  if (current.category === "texto") return "Continúa trabajando tu contenido";
  return "Continúa con herramientas relacionadas";
}
