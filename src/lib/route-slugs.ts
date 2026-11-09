import type { CatalogTool } from "./all-tools";
import { englishToolSlug, buildEnglishToolIndex } from "./route-slugs.part2";
export { usesFinanceRoute } from "./route-slugs.part1";
export type { PublicLocale } from "./route-slugs.part1";
export { ENGLISH_CATEGORY_SLUGS, englishToolSlug, spanishToolSlug, englishToolPath, spanishToolPath, publicToolPath, publicToolLink, englishCategorySlug, internalCategorySlugFromEnglish, englishCategoryPath, buildEnglishToolIndex } from "./route-slugs.part2";

export function allEnglishRouteSlugs(tools: readonly CatalogTool[]) {
  return tools.map(englishToolSlug);
}

export function toolByEnglishSlug(tools: readonly CatalogTool[], slug: string) {
  const byEnglish = buildEnglishToolIndex(tools).get(slug);
  if (byEnglish) return byEnglish;
  return tools.find((tool) => tool.slug === slug);
}
