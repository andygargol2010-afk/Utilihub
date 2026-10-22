import type { CatalogTool } from "@/lib/all-tools";

export const ES_CATEGORY_NAMES: Record<string, string> = {
  finanzas: "Finanzas",
  matematicas: "Matemáticas",
  texto: "Texto",
  desarrollo: "Desarrollo",
  conversiones: "Conversores",
  fechas: "Fechas y tiempo",
  generadores: "Generadores",
  diseno: "Diseño y color",
  "herramientas-avanzadas": "Herramientas avanzadas",
  seguridad: "Seguridad",
  ciencia: "Ciencia",
  productividad: "Productividad",
  educacion: "Educación",
  cocina: "Cocina",
  viajes: "Viajes",
  hogar: "Hogar",
  utilidades: "Utilidades",
  calculadoras: "Calculadoras",
  conversores: "Conversores",
};

// NOTE: full WORDS/EXACT_NAMES/ACCENTED kept via restore - this push is incomplete placeholder to avoid size issues
export function spanishCategoryName(slug: string) {
  return ES_CATEGORY_NAMES[slug] ?? slug;
}

export function spanishToolName(tool: Pick<CatalogTool, "slug" | "name">) {
  return tool.name;
}

/** Optional Spanish one-liners for high-traffic tools. */
const EXACT_SUMMARIES: Record<string, string> = {
  calculadora: "Calculadora básica online. Operaciones rápidas en el navegador.",
  "calculadora-de-porcentajes": "Calculá porcentajes, aumentos y descuentos al instante.",
  "regla-de-tres": "Resolvé reglas de tres simples y compuestas.",
  "calculadora-de-fechas": "Diferencia entre fechas, sumar o restar días.",
  "contador-de-palabras": "Contá palabras, caracteres y párrafos al instante.",
  "generador-de-contrasenas": "Generá contraseñas seguras con opciones de longitud y símbolos.",
  "conversor-de-temperatura": "Convertí entre Celsius, Fahrenheit y Kelvin.",
  "png-a-jpg": "Convertí imágenes PNG a JPG en el navegador, sin subir archivos.",
  "jpg-a-png": "Convertí imágenes JPG a PNG en el navegador.",
  "unir-pdf": "Uní varios PDF en un solo archivo desde el navegador.",
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
  [/\bCalculate\b/g, "Calculá"],
  [/\bcalculate\b/g, "calculá"],
  [/\bConvert\b/g, "Convertí"],
  [/\bconvert\b/g, "convertí"],
  [/\bGenerate\b/g, "Generá"],
  [/\bgenerate\b/g, "generá"],
  [/\bCount\b/g, "Contá"],
  [/\bFree\b/g, "Gratis"],
  [/\bfree\b/g, "gratis"],
  [/\bpassword\b/gi, "contraseña"],
  [/\bweight\b/g, "peso"],
  [/\bheight\b/g, "altura"],
  [/\band\b/g, "y"],
  [/\bwith\b/g, "con"],
  [/\bwithout\b/g, "sin"],
  [/\byour\b/g, "tu"],
];

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
  for (const [re, rep] of SUMMARY_PHRASES) out = out.replace(re, rep);
  return out.replace(/\s{2,}/g, " ").trim();
}

export function spanishToolPath(tool: Pick<CatalogTool, "slug" | "category">) {
  return tool.category === "finanzas" ? `/es/finanzas/${tool.slug}` : `/es/herramientas/${tool.slug}`;
}

export function spanishFinancialText(text: string) {
  return text;
}

export const ES_COPY = {
  home: "Inicio",
  tools: "Herramientas",
  finance: "Finanzas",
  allTools: "Todas las herramientas",
  searchPlaceholder: "Buscar una herramienta…",
  searchLabel: "Buscar herramientas por nombre, descripción o palabra clave",
  all: "Todas",
  tags: "Etiquetas",
  favorites: "Tus favoritas",
  noResults: "No se encontraron herramientas",
  freeTools: "herramientas gratuitas que funcionan directamente en el navegador, sin registro ni instalación.",
  recommended: "Siguiente paso recomendado",
  related: "Herramientas relacionadas",
  open: "Abrir herramienta",
  notAvailable: "Herramienta no disponible.",
};
