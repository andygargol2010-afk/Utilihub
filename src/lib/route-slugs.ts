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

export function buildEnglishToolIndex(tools: readonly CatalogTool[]) {
  englishEntries.clear();
  englishCollisions.clear();

  for (const tool of tools) {
    const slug = englishToolSlug(tool);
    const previous = englishEntries.get(slug);
    if (previous) {
      const names = englishCollisions.get(slug) ?? [previous.name];
      names.push(tool.name);
      englishCollisions.set(slug, names);
      continue;
    }
    englishEntries.set(slug, tool);
  }

  if (englishCollisions.size) {
    const details = [...englishCollisions.entries()].map(([slug, names]) => `${slug}: ${names.join(" | ")}`);
    throw new Error(`UtiliHub route slug collision: ${details.join("; ")}`);
  }

  return new Map(englishEntries);
}

export function allEnglishRouteSlugs(tools: readonly CatalogTool[]) {
  return tools.map(englishToolSlug);
}

export function toolByEnglishSlug(tools: readonly CatalogTool[], slug: string) {
  return buildEnglishToolIndex(tools).get(slug);
}

export function englishCategoryPath(categorySlug: string) {
  return `/category/${categorySlug}`;
}
