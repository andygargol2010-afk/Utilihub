import { CATEGORIES, TOOLS, type Tool } from "./tools";
import { FINANCIAL_TOOLS } from "./financial-tools";
import { GENERAL_CATEGORIES, GENERAL_TOOLS } from "./general";
import { LEGACY_CATEGORY_REDIRECTS } from "./category-catalog";

export type CatalogTool = Omit<Tool, "category"> & { category: string };

const FINANCIAL_CATEGORY = {
  slug: "finanzas",
  name: "Finanzas",
  title: "Calculadoras financieras online | UtiliHub",
  description: "Calculadoras y herramientas financieras gratuitas para inversión, ahorro, préstamos, inflación y carteras.",
  intro: "Herramientas financieras que ejecutan sus cálculos en el navegador. Incluyen inversión, préstamos, ahorro, inflación, carteras, jubilación y renta fija.",
};

export const ALL_CATEGORIES = [FINANCIAL_CATEGORY, ...GENERAL_CATEGORIES];

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
const canonicalSlugs = new Set([...generalCards, ...financialCards].map((tool) => tool.slug));
const legacyCards: CatalogTool[] = TOOLS
  .map((tool) => ({ ...tool, category: LEGACY_CATEGORY_REDIRECTS[tool.category] ?? tool.category }))
  .filter((tool) => !canonicalSlugs.has(tool.slug));

const catalogSources = [...generalCards, ...financialCards, ...legacyCards];
const duplicateSlugs = Array.from(
  catalogSources.reduce((map, tool) => map.set(tool.slug, (map.get(tool.slug) ?? 0) + 1), new Map<string, number>())
    .entries()
).filter(([, count]) => count > 1).map(([slug]) => slug);

export const CATALOG_DUPLICATE_SLUGS = duplicateSlugs;

if (duplicateSlugs.length) {
  throw new Error(`UtiliHub catalog integrity error: duplicate tool slugs: ${duplicateSlugs.join(", ")}`);
}

export const ALL_TOOLS: CatalogTool[] = catalogSources;
export const allToolBySlug = (slug: string) => ALL_TOOLS.find((tool) => tool.slug === slug);
export const allToolsByCategory = (slug: string) => ALL_TOOLS.filter((tool) => tool.category === slug);
export const allCategoryBySlug = (slug: string) => {
  const canonical = LEGACY_CATEGORY_REDIRECTS[slug] ?? slug;
  return ALL_CATEGORIES.find((category) => category.slug === canonical);
};
export const legacyCategoryBySlug = (slug: string) => CATEGORIES.find((category) => category.slug === slug);
export const toolHref = (tool: Pick<CatalogTool, "slug" | "category">) =>
  tool.category === "finanzas" ? `/finanzas/${tool.slug}` : `/herramientas/${tool.slug}`;
