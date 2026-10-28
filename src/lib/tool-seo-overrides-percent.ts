import { TOOL_SEO_OVERRIDES_PERCENT_1 } from "./tool-seo-data/percent-1";
import { TOOL_SEO_OVERRIDES_PERCENT_2 } from "./tool-seo-data/percent-2";
import { TOOL_SEO_OVERRIDES_PERCENT_3 } from "./tool-seo-data/percent-3";
/** Unique SEO for percentage-suite calculators — no generic templates. */

export type ToolSeoOverridePercent = {
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

// Entries live in ./tool-seo-data/percent-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_PERCENT: Record<string, ToolSeoOverridePercent> = {
  ...TOOL_SEO_OVERRIDES_PERCENT_1,
  ...TOOL_SEO_OVERRIDES_PERCENT_2,
  ...TOOL_SEO_OVERRIDES_PERCENT_3,
};
