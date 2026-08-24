import { CATEGORIES, TOOLS, type Tool } from "./tools";
import { FINANCIAL_TOOLS } from "./financial-tools";
import { GENERAL_CATEGORIES, GENERAL_TOOLS } from "./general";

export type CatalogTool = Omit<Tool, "category"> & { category: string };

const FINANCIAL_CATEGORY = {
  slug: "finanzas",
  name: "Finanzas",
  title: "Calculadoras financieras online | UtiliHub",
  description: "Calculadoras y herramientas financieras gratuitas para inversión, ahorro, préstamos, inflación y carteras.",
  intro: "Herramientas financieras que ejecutan sus cálculos en el navegador. Incluyen inversión, préstamos, ahorro, inflación, carteras, jubilación y renta fija.",
};

export const ALL_CATEGORIES = [...CATEGORIES, FINANCIAL_CATEGORY, ...GENERAL_CATEGORIES];

const financialCards: CatalogTool[] = FINANCIAL_TOOLS.map((tool) => ({
  ...tool,
  title: `${tool.name} | UtiliHub`,
  category: "finanzas",
  about: [tool.description],
  steps: [
    "Introduce los valores que quieras analizar.",
    "Pulsa «Calcular» para ejecutar la fórmula.",
    "Revisa los resultados y sus unidades.",
  ],
  faq: [
    {
      q: "¿Estos resultados son asesoramiento financiero?",
      a: "No. Son cálculos matemáticos orientativos y no sustituyen asesoramiento profesional.",
    },
  ],
}));

const generalCards: CatalogTool[] = GENERAL_TOOLS.map((tool) => ({ ...tool }));

// General tools take precedence over legacy entries with the same slug.
// This keeps each tool unique in search/category listings and lets the newer
// mathematical catalog own entries such as "regla-de-tres".
const uniqueBySlug = (tools: CatalogTool[]) => {
  const seen = new Set<string>();
  return tools.filter((tool) => {
    if (seen.has(tool.slug)) return false;
    seen.add(tool.slug);
    return true;
  });
};

export const ALL_TOOLS: CatalogTool[] = uniqueBySlug([
  ...generalCards,
  ...financialCards,
  ...TOOLS,
]);

export const allToolBySlug = (slug: string) => ALL_TOOLS.find((tool) => tool.slug === slug);
export const allToolsByCategory = (slug: string) => ALL_TOOLS.filter((tool) => tool.category === slug);
export const allCategoryBySlug = (slug: string) => ALL_CATEGORIES.find((category) => category.slug === slug);
