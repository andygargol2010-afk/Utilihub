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

const EXACT_NAMES: Record<string, string> = {
  "json-a-csv": "JSON a CSV",
  "csv-a-json": "CSV a JSON",
  "conversor-xml-json": "Conversor XML a JSON",
};

export function spanishCategoryName(slug: string) {
  return ES_CATEGORY_NAMES[slug] ?? slug;
}

export function spanishToolName(tool: Pick<CatalogTool, "slug" | "name">) {
  if (EXACT_NAMES[tool.slug]) return EXACT_NAMES[tool.slug];
  if (tool.name) return tool.name;
  return tool.slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function spanishToolPath(tool: Pick<CatalogTool, "slug" | "category">) {
  return tool.category === "finanzas"
    ? `/es/finanzas/${tool.slug}`
    : `/es/herramientas/${tool.slug}`;
}

export function spanishFinancialText(text: string) {
  const exact: Record<string, string> = {
    Calculate: "Calcular",
    "Could not get a valid result with those values.":
      "No se pudo obtener un resultado válido con esos valores.",
    "Could not calculate the result.": "No se pudo calcular el resultado.",
    "Continue your analysis": "Continúa tu análisis",
    "Related calculators to explore more financial scenarios.":
      "Calculadoras relacionadas para explorar más escenarios financieros.",
    "About this calculator": "Acerca de esta calculadora",
    "How to use it": "Cómo usarla",
    "Enter the values for the scenario you want to analyze.":
      "Introduce los valores del escenario que quieres analizar.",
    "Run the calculation and review each result.": "Ejecuta el cálculo y revisa cada resultado.",
    "Compare scenarios and verify real conditions before deciding.":
      "Compara escenarios y verifica las condiciones reales antes de decidir.",
  };
  if (exact[text]) return exact[text];
  return text
    .replace(/\bCalculate\b/g, "Calcular")
    .replace(/\bResult\b/g, "Resultado")
    .replace(/\bResults\b/g, "Resultados")
    .replace(/\bValue\b/g, "Valor")
    .replace(/\bAmount\b/g, "Importe")
    .replace(/\bRate\b/g, "Tasa")
    .replace(/\bInvestment\b/g, "Inversión")
    .replace(/\bLoan\b/g, "Préstamo")
    .replace(/\bPayment\b/g, "Pago")
    .replace(/\bInterest\b/g, "Interés")
    .replace(/\bSavings\b/g, "Ahorro")
    .replace(/\bInflation\b/g, "Inflación")
    .replace(/\bYear\b/g, "Año")
    .replace(/\bYears\b/g, "Años")
    .replace(/\bMonth\b/g, "Mes")
    .replace(/\bMonths\b/g, "Meses")
    .replace(/\bTotal\b/g, "Total");
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
  freeTools:
    "herramientas gratuitas que funcionan directamente en el navegador, sin registro ni instalación.",
  recommended: "Siguiente paso recomendado",
  related: "Herramientas relacionadas",
  open: "Abrir herramienta",
  notAvailable: "Herramienta no disponible.",
};
