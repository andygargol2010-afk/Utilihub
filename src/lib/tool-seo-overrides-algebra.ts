import { TOOL_SEO_OVERRIDES_ALGEBRA_1 } from "./tool-seo-data/algebra-1";
import { TOOL_SEO_OVERRIDES_ALGEBRA_2 } from "./tool-seo-data/algebra-2";
/** Unique SEO for algebra-suite calculators — no generic templates. */

export type ToolSeoOverrideAlgebra = {
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  about: string[];
  aboutEs?: string[];
  steps: string[];
  stepsEs?: string[];
  faq: { q: string; a: string }[];
  faqEs?: { q: string; a: string }[];
};

// Entries live in ./tool-seo-data/algebra-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_ALGEBRA: Record<string, ToolSeoOverrideAlgebra> = {
  ...TOOL_SEO_OVERRIDES_ALGEBRA_1,
  ...TOOL_SEO_OVERRIDES_ALGEBRA_2,
};
