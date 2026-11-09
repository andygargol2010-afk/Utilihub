import type { CatalogTool } from "./all-tools";
import { type IntentTag } from "./tool-tags.part1";
import { INTENT_TAGS } from "./tool-tags.part2";
export type { IntentTag } from "./tool-tags.part1";
export { INTENT_TAGS } from "./tool-tags.part2";

/** Which intent tags to surface when browsing a given category (internal slug). */
export const CATEGORY_FACETS: Record<string, string[]> = {
  finanzas: ["loans", "investing", "savings", "inflation", "portfolio", "retirement", "bonds", "tax-income", "compound"],
  matematicas: ["statistics", "geometry", "algebra", "percentages"],
  texto: ["text-transform", "text-count", "diff-compare"],
  desarrollo: ["encode", "json-data", "hash-crypto", "ids-tokens", "regex"],
  conversiones: ["units", "color", "currency", "encode"],
  fechas: ["date-calc", "timers"],
  generadores: ["random-gen", "password", "ids-tokens"],
  diseno: ["color"],
  seguridad: ["password", "hash-crypto", "encode"],
  ciencia: ["physics", "chemistry"],
  productividad: ["timers", "date-calc"],
  educacion: ["quiz", "algebra", "statistics", "geometry"],
  cocina: ["cooking", "units"],
  viajes: ["travel", "currency", "units"],
  hogar: ["home", "units"],
  utilidades: ["units", "percentages", "date-calc"],
};

/** Global chips on /tools when no category is selected — high-intent cross-cutting. */
export const GLOBAL_FACETS = [
  "loans",
  "investing",
  "savings",
  "percentages",
  "statistics",
  "encode",
  "json-data",
  "password",
  "units",
  "color",
  "date-calc",
  "cooking",
  "quiz",
];

function toolHaystack(tool: {
  slug: string;
  name: string;
  keywords?: string[];
  kind?: string;
  summary?: string;
  category?: string;
}): string {
  return [tool.slug, tool.name, tool.kind, tool.summary, ...(tool.keywords ?? [])]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const tagCache = new WeakMap<object, string[]>();

export function tagsForTool(tool: {
  slug: string;
  name: string;
  keywords?: string[];
  kind?: string;
  summary?: string;
  category?: string;
}): string[] {
  const cached = tagCache.get(tool as object);
  if (cached) return cached;
  const hay = toolHaystack(tool);
  const ids = INTENT_TAGS.filter((t) => t.match(hay)).map((t) => t.id);
  tagCache.set(tool as object, ids);
  return ids;
}

export function toolMatchesTag(
  tool: {
    slug: string;
    name: string;
    keywords?: string[];
    kind?: string;
    summary?: string;
  },
  tagId: string,
): boolean {
  return tagsForTool(tool).includes(tagId);
}

export function facetsForCategory(categorySlug: string | "all", locale: "en" | "es" = "en") {
  const ids =
    categorySlug === "all" || !categorySlug
      ? GLOBAL_FACETS
      : CATEGORY_FACETS[categorySlug] ?? GLOBAL_FACETS;
  return ids
    .map((id) => INTENT_TAGS.find((t) => t.id === id))
    .filter((t): t is IntentTag => Boolean(t))
    .map((t) => ({
      id: t.id,
      label: locale === "es" ? t.labelEs : t.label,
    }));
}

/** Count how many tools in a list match each facet (for hiding empty chips). */
export function facetsWithCounts(
  tools: CatalogTool[] | Array<{ slug: string; name: string; keywords?: string[]; kind?: string; summary?: string }>,
  categorySlug: string | "all",
  locale: "en" | "es" = "en",
) {
  return facetsForCategory(categorySlug, locale)
    .map((facet) => ({
      ...facet,
      count: tools.filter((t) => toolMatchesTag(t, facet.id)).length,
    }))
    .filter((f) => f.count > 0);
}
