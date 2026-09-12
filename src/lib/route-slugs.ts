import type { CatalogTool } from "./all-tools";

export type PublicLocale = "en" | "es";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const englishEntries = new Map<string, CatalogTool>();
const englishCollisions = new Map<string, string[]>();
let indexedToolsRef: readonly CatalogTool[] | null = null;

export const ENGLISH_CATEGORY_SLUGS: Record<string, string> = {
  finanzas: "finance",
  matematicas: "math",
  texto: "text",
  desarrollo: "developer",
  conversiones: "converters",
  fechas: "date-time",
  generadores: "generators",
  diseno: "design-color",
  seguridad: "security",
  ciencia: "science",
  productividad: "productivity",
  educacion: "education",
  cocina: "cooking",
  viajes: "travel",
  hogar: "home",
  utilidades: "utilities",
};

const INTERNAL_CATEGORY_BY_ENGLISH_SLUG = new Map(
  Object.entries(ENGLISH_CATEGORY_SLUGS).map(([internal, english]) => [english, internal]),
);

export function englishToolSlug(tool: Pick<CatalogTool, "name">) {
  return slugify(tool.name);
}

export function spanishToolSlug(tool: Pick<CatalogTool, "slug">) {
  return tool.slug;
}

export function englishToolPath(tool: Pick<CatalogTool, "name" | "category">) {
  const slug = englishToolSlug(tool);
  return tool.category === "finanzas" ? `/finance/${slug}` : `/tools/${slug}`;
}

export function spanishToolPath(tool: Pick<CatalogTool, "slug" | "category">) {
  return tool.category === "finanzas" ? `/es/finanzas/${tool.slug}` : `/es/herramientas/${tool.slug}`;
}

export function publicToolPath(tool: CatalogTool, locale: PublicLocale = "en") {
  return locale === "es" ? spanishToolPath(tool) : englishToolPath(tool);
}

export function englishCategorySlug(internalCategorySlug: string) {
  return ENGLISH_CATEGORY_SLUGS[internalCategorySlug] ?? internalCategorySlug;
}

export function internalCategorySlugFromEnglish(publicCategorySlug: string) {
  return INTERNAL_CATEGORY_BY_ENGLISH_SLUG.get(publicCategorySlug) ?? publicCategorySlug;
}

export function englishCategoryPath(internalCategorySlug: string) {
  return `/category/${englishCategorySlug(internalCategorySlug)}`;
}

export function buildEnglishToolIndex(tools: readonly CatalogTool[]) {
  // Rebuild only when the tools array identity changes.
  if (indexedToolsRef === tools && englishEntries.size) {
    return new Map(englishEntries);
  }

  englishEntries.clear();
  englishCollisions.clear();

  for (const tool of tools) {
    const slug = englishToolSlug(tool);
    const previous = englishEntries.get(slug);
    if (previous) {
      const names = englishCollisions.get(slug) ?? [previous.name];
      names.push(tool.name);
      englishCollisions.set(slug, names);
      // Keep the first tool; do not throw — collisions must not break production routes.
      continue;
    }
    englishEntries.set(slug, tool);
    // Also index by internal Spanish slug so legacy links still resolve.
    if (!englishEntries.has(tool.slug)) {
      englishEntries.set(tool.slug, tool);
    }
  }

  if (englishCollisions.size && typeof console !== "undefined") {
    const details = [...englishCollisions.entries()].map(([slug, names]) => `${slug}: ${names.join(" | ")}`);
    console.warn(`UtiliHub route slug collision (kept first): ${details.join("; ")}`);
  }

  indexedToolsRef = tools;
  return new Map(englishEntries);
}

export function allEnglishRouteSlugs(tools: readonly CatalogTool[]) {
  return tools.map(englishToolSlug);
}

export function toolByEnglishSlug(tools: readonly CatalogTool[], slug: string) {
  const byEnglish = buildEnglishToolIndex(tools).get(slug);
  if (byEnglish) return byEnglish;
  // Fallback: match internal catalog slug (Spanish) if URL still uses it.
  return tools.find((tool) => tool.slug === slug);
}
