import { CATEGORIES, TOOLS, type Tool } from "./tools";
import { FINANCIAL_TOOLS } from "./financial-tools";
import { GENERAL_CATEGORIES, GENERAL_TOOLS } from "./general";
import { LEGACY_CATEGORY_REDIRECTS, SECONDARY_CATEGORY_MAP } from "./category-catalog";
import { englishToolPath } from "./route-slugs";

export type CatalogTool = Omit<Tool, "category"> & { category: string };

const FINANCIAL_CATEGORY = {
  slug: "finanzas",
  name: "Finance",
  title: "Online financial calculators | UtiliHub",
  description: "Free financial calculators and tools for investing, savings, loans, inflation, and portfolios.",
  intro: "Financial tools that run their calculations in the browser. Includes investing, loans, savings, inflation, portfolios, retirement, and fixed income.",
};

export const ALL_CATEGORIES = [FINANCIAL_CATEGORY, ...GENERAL_CATEGORIES];

const financialCards: CatalogTool[] = FINANCIAL_TOOLS.map((tool) => ({
  ...tool,
  title: `${tool.name} | UtiliHub`,
  category: "finanzas",
  about: [tool.description],
  steps: [
    "Enter the values you want to analyze.",
    "Click «Calculate» to run the formula.",
    "Review the results and their units.",
  ],
  faq: [
    {
      q: "Are these results financial advice?",
      a: "No. They are indicative mathematical calculations and do not replace professional advice.",
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
const unknownSecondaryTools = Object.keys(SECONDARY_CATEGORY_MAP).filter((slug) => !ALL_TOOLS.some((tool) => tool.slug === slug));
if (unknownSecondaryTools.length) {
  throw new Error(`UtiliHub catalog integrity error: unknown secondary category tools: ${unknownSecondaryTools.join(", ")}`);
}
export const allToolBySlug = (slug: string) => ALL_TOOLS.find((tool) => tool.slug === slug);
export const allToolsByCategory = (slug: string) => ALL_TOOLS.filter((tool) => tool.category === slug || SECONDARY_CATEGORY_MAP[tool.slug]?.includes(slug));
export const allCategoryBySlug = (slug: string) => {
  const canonical = LEGACY_CATEGORY_REDIRECTS[slug] ?? slug;
  return ALL_CATEGORIES.find((category) => category.slug === canonical);
};
export const legacyCategoryBySlug = (slug: string) => CATEGORIES.find((category) => category.slug === slug);
export const toolHref = (tool: Pick<CatalogTool, "name" | "category">) => englishToolPath(tool);
