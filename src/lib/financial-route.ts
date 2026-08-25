import { financialToolBySlug } from "@/lib/financial-tools";

/** Canonical URL builder for financial tools. */
export function financialToolHref(slug: string): string {
  const tool = financialToolBySlug(slug);
  if (!tool) return "/finanzas";
  return `/finanzas/${encodeURIComponent(tool.slug)}`;
}
