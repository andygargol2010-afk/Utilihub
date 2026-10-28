import { ALL_TOOLS, type CatalogTool } from "./all-tools";
import type { PublicLocale } from "./route-slugs";

/**
 * Intent clusters for internal linking (SEO + bounce).
 * Keys/values use internal catalog slugs.
 */
export const TOOL_JOURNEYS: Record<string, string[]> = {
  // Bounce-heavy landings: first slug = primary next step (must exist in catalog)
  porcentaje: ["regla-de-tres", "calculadora-de-porcentajes", "cambio-porcentual", "promedio"],
  "regla-de-tres": ["porcentaje", "calculadora-de-porcentajes", "cambio-porcentual", "promedio"],
  "cambio-porcentual": ["porcentaje", "regla-de-tres", "calculadora-de-porcentajes", "promedio"],
  calculadora: ["porcentaje", "regla-de-tres", "calculadora-de-porcentajes", "promedio"],
  "calculadora-de-porcentajes": ["porcentaje", "regla-de-tres", "cambio-porcentual", "promedio"],
  promedio: ["mediana", "moda", "rango", "desviacion-estandar"],
  mediana: ["promedio", "moda", "rango", "percentil"],
  moda: ["promedio", "mediana", "rango", "percentil"],
  factorial: ["permutaciones", "combinaciones", "probabilidad", "potencias-y-raices"],
  combinaciones: ["permutaciones", "factorial", "probabilidad", "promedio"],
  permutaciones: ["combinaciones", "factorial", "probabilidad", "promedio"],
  probabilidad: ["combinaciones", "permutaciones", "promedio", "z-score"],

  "calculadora-de-fechas": ["diferencia-fechas", "sumar-dias", "timestamp-to-date", "timestamp-generator"],
  "diferencia-fechas": ["calculadora-de-fechas", "sumar-dias", "timestamp-to-date", "timestamp-generator"],
  "sumar-dias": ["calculadora-de-fechas", "diferencia-fechas", "timestamp-generator", "timestamp-to-date"],
  "timestamp-generator": ["timestamp-to-date", "calculadora-de-fechas", "sumar-dias", "diferencia-fechas"],
  "timestamp-to-date": ["timestamp-generator", "calculadora-de-fechas", "sumar-dias", "diferencia-fechas"],

  "contador-de-palabras": ["calculadora-tiempo-lectura", "limpiar-texto", "contador-de-caracteres", "generador-nombres-archivos"],
  "contador-de-caracteres": ["contador-de-palabras", "calculadora-tiempo-lectura", "limpiar-texto", "generador-nombres-archivos"],
  "limpiar-texto": ["contador-de-palabras", "calculadora-tiempo-lectura", "generador-nombres-archivos", "contador-de-caracteres"],
  "calculadora-tiempo-lectura": ["contador-de-palabras", "limpiar-texto", "contador-de-caracteres", "generador-nombres-archivos"],
  "generador-nombres-archivos": ["limpiar-texto", "contador-de-palabras", "calculadora-tiempo-lectura", "contador-de-caracteres"],
  "modelador-3d": ["modelador-casas-3d", "pixelihub", "relacion-aspecto", "mezclador-de-colores"],
  "modelador-casas-3d": ["modelador-3d", "pintura-superficie", "relacion-aspecto", "ppi-pantalla"],
  /* pixelihub-nextstep-v1 */
  "pixelihub": ["generador-paleta", "selector-color", "mezclador-de-colores", "modelador-3d"],

  "base64-encode": ["base64-decode", "url-encode", "html-encode", "json-formatter"],
  "base64-decode": ["base64-encode", "url-decode", "html-decode", "json-formatter"],
  "url-encode": ["url-decode", "base64-encode", "html-encode", "slug-generator"],
  "url-decode": ["url-encode", "base64-decode", "html-decode", "json-formatter"],
  "html-encode": ["html-decode", "url-encode", "base64-encode", "json-formatter"],
  "html-decode": ["html-encode", "url-decode", "base64-decode", "json-formatter"],
  "json-formatter": ["json-validator", "json-minifier", "json-a-csv", "base64-encode"],
  "json-validator": ["json-formatter", "json-minifier", "json-a-csv", "csv-a-json"],

  "generador-de-contrasenas": ["password-strength", "uuid-generator", "qr-wifi", "slug-generator"],
  "password-strength": ["generador-de-contrasenas", "uuid-generator", "qr-wifi", "analizador-entropia"],
  "uuid-generator": ["generador-de-contrasenas", "password-strength", "qr-wifi", "timestamp-generator"],
  "qr-wifi": ["generador-de-contrasenas", "uuid-generator", "password-strength", "slug-generator"],

  // No other AFIP/AR tax ID tools in catalog — cluster on validate / format / ID workflows
  "validador-cuit": ["validador-iban", "validador-luhn", "password-strength", "uuid-generator"],
  "validador-iban": ["validador-cuit", "validador-luhn", "uuid-generator", "base64-encode"],

  propina: ["porcentaje", "cambio-porcentual", "regla-de-tres", "calculadora-de-porcentajes"],
  "divisor-gastos": ["propina", "porcentaje", "regla-50-30-20", "cambio-porcentual"],
  "regla-50-30-20": ["propina", "objetivo-de-ahorro", "porcentaje", "cambio-porcentual"],

  "interes-compuesto": ["objetivo-de-ahorro", "ahorro-periodico", "rentabilidad-real", "regla-50-30-20"],
  "objetivo-de-ahorro": ["interes-compuesto", "ahorro-periodico", "regla-50-30-20", "propina"],
  "valoracion-dcf": ["calculadora-wacc", "calculadora-roic", "valor-actual-neto", "interes-compuesto"],

  "diferencia-textos": ["contador-de-palabras", "limpiar-texto", "comparador-de-textos", "frecuencia-palabras"],
  "comparador-de-textos": ["diferencia-textos", "contador-de-palabras", "limpiar-texto", "nivel-lectura"],
  "markdown-a-html": ["html-encode", "html-decode", "limpiar-texto", "slug-generator"],
  "generador-claves-api": ["uuid-generator", "generador-de-contrasenas", "password-strength", "base64-encode"],
  "analizador-entropia": ["password-strength", "generador-de-contrasenas", "uuid-generator", "qr-wifi"],
  "mezclador-de-colores": ["generador-paleta", "paleta-complementaria", "contraste-wcag", "generador-gradiente"],
  "contraste-wcag": ["selector-color", "mezclador-de-colores", "paleta-complementaria", "generador-paleta"],
  "generador-gradiente": ["generador-paleta", "mezclador-de-colores", "contraste-wcag", "paleta-complementaria"],
};

export function journeyTools(current: Pick<CatalogTool, "slug" | "category">): CatalogTool[] {
  const curated = (TOOL_JOURNEYS[current.slug] ?? [])
    .map((slug) => ALL_TOOLS.find((tool) => tool.slug === slug))
    .filter((tool): tool is CatalogTool => Boolean(tool) && tool.slug !== current.slug);

  if (curated.length >= 4) return curated.slice(0, 4);

  const used = new Set([current.slug, ...curated.map((t) => t.slug)]);
  const sameCategory = ALL_TOOLS.filter((tool) => tool.category === current.category && !used.has(tool.slug));

  const tokens = current.slug.split("-").filter((t) => t.length > 2);
  const scored = sameCategory
    .map((tool) => {
      const hay = `${tool.slug} ${tool.name} ${(tool.keywords ?? []).join(" ")}`.toLowerCase();
      const score = tokens.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
      return { tool, score };
    })
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .map((x) => x.tool);

  return [...curated, ...scored].slice(0, 4);
}

export function journeyLabel(
  current: Pick<CatalogTool, "slug" | "category">,
  locale: PublicLocale = "en",
): string {
  const es = locale === "es";

  if (current.slug === "validador-cuit") {
    return es
      ? "Después del CUIT: validar datos, IDs y formato"
      : "After CUIT: validate data, IDs, and encoding";
  }
  if (current.slug === "validador-iban") {
    return es
      ? "Después del IBAN: otros identificadores y formatos"
      : "After IBAN: other identifiers and formats";
  }
  if (current.slug === "calculadora") {
    return es
      ? "Después de la calculadora: porcentajes y proporciones"
      : "After the calculator: percentages and proportions";
  }
  if (
    current.slug === "porcentaje" ||
    current.slug === "regla-de-tres" ||
    current.slug === "cambio-porcentual" ||
    current.slug === "calculadora-de-porcentajes"
  ) {
    return es ? "Más herramientas de porcentajes y proporciones" : "More proportion and percentage tools";
  }
  if (
    current.slug === "contador-de-palabras" ||
    current.slug === "tiempo-lectura" ||
    current.slug === "calculadora-tiempo-lectura"
  ) {
    return es
      ? "Seguí con el texto: tiempo de lectura y limpieza"
      : "Keep going with your text: reading time and cleanup";
  }
  if (current.slug === "pixelihub") {
    return es
      ? "Armá una paleta y seguí diseñando sprites"
      : "Build a palette and keep designing sprites";
  }
  if (current.slug === "modelador-3d" || current.slug === "modelador-casas-3d") {
    return es
      ? "Seguí en el estudio o pasá a diseño y color"
      : "Stay in the studio or move to design and color";
  }
  if (current.category === "seguridad") {
    return es ? "Protegé y verificá tus datos" : "Protect and verify your data";
  }
  if (current.category === "diseno") {
    return es ? "Diseñá y validá tu interfaz" : "Design and validate your interface";
  }
  if (current.category === "utilidades") {
    return es ? "Completá tu cálculo" : "Complete your calculation";
  }
  if (current.category === "finanzas") {
    return es ? "Analizá el siguiente escenario" : "Analyze the next scenario";
  }
  if (current.category === "texto") {
    return es ? "Seguí trabajando tu contenido" : "Keep working on your content";
  }
  if (current.category === "matematicas") {
    return es ? "Herramientas de matemáticas relacionadas" : "Related math tools";
  }
  if (current.category === "desarrollo") {
    return es ? "Herramientas de desarrollo relacionadas" : "Related developer tools";
  }
  if (current.category === "fechas") {
    return es ? "Herramientas de fechas relacionadas" : "Related date tools";
  }
  if (current.category === "productividad") {
    return es ? "Herramientas de productividad relacionadas" : "Related productivity tools";
  }
  return es ? "Continuar con herramientas relacionadas" : "Continue with related tools";
}
