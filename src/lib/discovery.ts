import { ALL_TOOLS, type CatalogTool } from "./all-tools";
import type { PublicLocale } from "./route-slugs";

/**
 * Intent clusters for internal linking (SEO + bounce).
 * Keys/values use internal catalog slugs.
 */
export const TOOL_JOURNEYS: Record<string, string[]> = {
  porcentaje: ["regla-de-tres", "porcentaje-de-cambio", "propina", "promedio"],
  "regla-de-tres": ["porcentaje", "porcentaje-de-cambio", "promedio", "propina"],
  "porcentaje-de-cambio": ["porcentaje", "regla-de-tres", "propina", "promedio"],
  calculadora: ["porcentaje", "regla-de-tres", "promedio", "mcd-mcm"],
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

  "contador-de-palabras": ["contador-de-caracteres", "limpiar-texto", "frecuencia-palabras", "nivel-lectura"],
  "contador-de-caracteres": ["contador-de-palabras", "limpiar-texto", "frecuencia-palabras", "nivel-lectura"],
  "limpiar-texto": ["contador-de-palabras", "slug-generator", "generador-nombres-archivos", "html-encode"],
  "frecuencia-palabras": ["contador-de-palabras", "nivel-lectura", "limpiar-texto", "contador-de-caracteres"],
  "nivel-lectura": ["contador-de-palabras", "frecuencia-palabras", "limpiar-texto", "contador-de-caracteres"],
  "generador-nombres-archivos": ["slug-generator", "limpiar-texto", "contador-de-palabras", "html-encode"],
  "slug-generator": ["generador-nombres-archivos", "limpiar-texto", "url-encode", "html-encode"],

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

  "validador-cuit": ["uuid-generator", "generador-de-contrasenas", "qr-wifi", "slug-generator"],

  propina: ["porcentaje", "porcentaje-de-cambio", "regla-de-tres", "divisor-gastos"],
  "divisor-gastos": ["propina", "porcentaje", "regla-50-30-20", "porcentaje-de-cambio"],
  "regla-50-30-20": ["propina", "objetivo-de-ahorro", "porcentaje", "porcentaje-de-cambio"],

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
    return es ? "Generar o verificar identificadores relacionados" : "Generate or verify related identifiers";
  }
  if (current.slug === "porcentaje" || current.slug === "regla-de-tres" || current.slug === "porcentaje-de-cambio") {
    return es ? "Más herramientas de porcentajes y proporciones" : "More proportion and percentage tools";
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
