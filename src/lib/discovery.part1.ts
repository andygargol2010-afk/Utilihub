// Part 1 of 3 — split from discovery.ts on 2026-11-04. Edit here; discovery.ts re-exports.

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

  "contador-de-palabras": ["calculadora-tiempo-de-lectura", "limpiar-texto", "contador-de-caracteres", "generador-nombres-archivos"],
  "contador-de-caracteres": ["contador-de-palabras", "calculadora-tiempo-de-lectura", "limpiar-texto", "generador-nombres-archivos"],
  "limpiar-texto": ["contador-de-palabras", "calculadora-tiempo-de-lectura", "generador-nombres-archivos", "contador-de-caracteres"],
  "calculadora-tiempo-de-lectura": ["contador-de-palabras", "limpiar-texto", "contador-de-caracteres", "generador-nombres-archivos"],
  "generador-nombres-archivos": ["limpiar-texto", "contador-de-palabras", "calculadora-tiempo-de-lectura", "contador-de-caracteres"],
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
