import { TOOL_SEO_OVERRIDES_ARITHMETIC_1 } from "./tool-seo-data/arithmetic-1";
import { TOOL_SEO_OVERRIDES_ARITHMETIC_2 } from "./tool-seo-data/arithmetic-2";
/** Unique SEO for arithmetic-suite calculators — no generic templates. */

export type ToolSeoOverrideArithmetic = {
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

// Entries live in ./tool-seo-data/arithmetic-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_ARITHMETIC: Record<string, ToolSeoOverrideArithmetic> = {
  ...TOOL_SEO_OVERRIDES_ARITHMETIC_1,
  ...TOOL_SEO_OVERRIDES_ARITHMETIC_2,
};
