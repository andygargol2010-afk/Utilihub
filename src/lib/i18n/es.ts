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

const WORDS: Record<string, string> = {
  calculator: "calculadora", calculators: "calculadoras", percentage: "porcentaje", rule: "regla", three: "tres",
  date: "fecha", difference: "diferencia", word: "palabras", counter: "contador", password: "contraseñas",
  generator: "generador", temperature: "temperatura", converter: "conversor", length: "longitud", weight: "peso",
  unit: "unidades", units: "unidades", finance: "finanzas", financial: "financiero", math: "matemáticas",
  text: "texto", security: "seguridad", science: "ciencia", education: "educación", productivity: "productividad",
  design: "diseño", color: "color", developer: "desarrollo", development: "desarrollo", time: "tiempo",
  cooking: "cocina", travel: "viajes", home: "hogar", utility: "utilidad", utilities: "utilidades",
  converter: "conversor", convert: "convertir", calculator: "calculadora", online: "online", free: "gratis",
  advanced: "avanzada", basic: "básica", average: "promedio", random: "aleatorio", number: "número",
  numbers: "números", text: "texto", characters: "caracteres", words: "palabras", time: "tiempo",
};

const EXACT_NAMES: Record<string, string> = {
  calculadora: "Calculadora",
  "calculadora-de-porcentajes": "Calculadora de porcentajes",
  "regla-de-tres": "Regla de tres",
  "calculadora-de-fechas": "Diferencia entre fechas",
  "contador-de-palabras": "Contador de palabras",
  "generador-de-contrasenas": "Generador de contraseñas",
  "conversor-de-temperatura": "Conversor de temperatura",
  "conversor-de-longitud": "Conversor de longitud",
  "conversor-de-peso": "Conversor de peso",
  "conversor-de-unidades": "Conversor de unidades",
};

export function spanishCategoryName(slug: string) {
  return ES_CATEGORY_NAMES[slug] ?? slug;
}

export function spanishToolName(tool: Pick<CatalogTool, "slug" | "name">) {
  if (EXACT_NAMES[tool.slug]) return EXACT_NAMES[tool.slug];
  const translated = tool.slug.split("-").map((part) => WORDS[part] ?? part).join(" ");
  return translated.charAt(0).toUpperCase() + translated.slice(1);
}

export function spanishToolPath(tool: Pick<CatalogTool, "slug" | "category">) {
  return tool.category === "finanzas" ? `/es/finanzas/${tool.slug}` : `/es/herramientas/${tool.slug}`;
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
