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

export const ES_TOOL_NAMES: Record<string, string> = {
  "json-a-csv": "JSON a CSV",
  "csv-a-json": "CSV a JSON",
  "conversor-xml-json": "Conversor XML a JSON",
};

export function spanishCategoryName(slug: string): string {
  return ES_CATEGORY_NAMES[slug] ?? slug;
}

export function spanishToolName(tool: CatalogTool | { slug: string; name?: string }): string {
  const slug = typeof tool === "string" ? tool : tool.slug;
  if (ES_TOOL_NAMES[slug]) return ES_TOOL_NAMES[slug];
  if (typeof tool === "object" && tool.name) return tool.name;
  return slug;
}

export const ES_COPY = {
  search: "Buscar",
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
