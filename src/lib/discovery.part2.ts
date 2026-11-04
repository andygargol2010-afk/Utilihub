// Part 2 of 3 — split from discovery.ts on 2026-11-04. Edit here; discovery.ts re-exports.
import { ALL_TOOLS, type CatalogTool } from "./all-tools";
import { TOOL_JOURNEYS } from "./discovery.part1";

export function journeyTools(current: Pick<CatalogTool, "slug" | "category">): CatalogTool[] {
  const curated = (TOOL_JOURNEYS[current.slug] ?? [])
    .map((slug) => ALL_TOOLS.find((tool) => tool.slug === slug))
    .filter((tool): tool is CatalogTool => Boolean(tool) && tool.slug !== current.slug);

  if (curated.length >= 4) return curated.slice(0, 4);

  const used = new Set([current.slug, ...curated.map((t) => t.slug)]);
  const sameCategory = ALL_TOOLS.filter((tool) => tool.category === current.category && !used.has(tool.slug));

  const tokens = current.slug.split("-").filter((t) => t.length > 2);
  const scored = sameCategory
    .map((tool) => {
      const hay = `${tool.slug} ${tool.name} ${(tool.keywords ?? []).join(" ")}`.toLowerCase();
      const score = tokens.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
      return { tool, score };
    })
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .map((x) => x.tool);

  return [...curated, ...scored].slice(0, 4);
}
