// Part 1 of 3 — split from route-slugs.ts on 2026-11-04. Edit here; route-slugs.ts re-exports.
import type { CatalogTool } from "./all-tools";
import { FINANCIAL_CATALOG } from "./financial/catalog";

export const FINANCIAL_ROUTE_SLUGS = new Set(FINANCIAL_CATALOG.map((tool) => tool.slug));

/** Only the dedicated financial calculators live under /finance and /es/finanzas; general tools tagged "finanzas" use /tools and /es/herramientas. */
export function usesFinanceRoute(tool: { category: string; slug?: string }) {
  return tool.category === "finanzas" && (!tool.slug || FINANCIAL_ROUTE_SLUGS.has(tool.slug));
}

export type PublicLocale = "en" | "es";

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export const englishEntries = new Map<string, CatalogTool>();
export const englishCollisions = new Map<string, string[]>();
