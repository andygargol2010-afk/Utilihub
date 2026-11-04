import type { CatalogTool } from "@/lib/all-tools";
import { spanishCategoryName } from "./es";
import { SUMMARY_ES } from "./summary-es";
import { PHRASES } from "./es-summaries.part1";
import { WORDS } from "./es-summaries.part2";

function phraseTranslate(raw: string): string {
  let out = raw;
  for (const [re, rep] of PHRASES) out = out.replace(re, rep);
  for (const [re, rep] of WORDS) out = out.replace(re, rep);
  return out
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .replace(/\s+\./g, ".")
    .trim();
}

type ToolLike = Pick<CatalogTool, "slug" | "name" | "summary" | "category"> & {
  summaryEs?: string;
};

/**
 * Spanish one-line summary for catalog cards, search, and home.
 *
 * Priority:
 * 1. tool.summaryEs (from makeTool config)
 * 2. SUMMARY_ES curated map (batch migration)
 * 3. phrase-translate of English summary (interim)
 * 4. category fallback only if no summary at all
 */
export function spanishToolSummary(tool: ToolLike): string {
  const fromTool = tool.summaryEs?.trim();
  if (fromTool) return fromTool;

  const curated = SUMMARY_ES[tool.slug]?.trim();
  if (curated) return curated;

  const raw = (tool.summary || "").trim();
  if (!raw) {
    const cat = spanishCategoryName(tool.category).toLowerCase();
    return `Herramienta de ${cat} gratis en el navegador.`;
  }

  if (/[áéíóúñ¿¡]/i.test(raw) && !/\b(Calculate|Convert|Generate|from weight|in the browser)\b/.test(raw)) {
    return raw;
  }

  return phraseTranslate(raw);
}
