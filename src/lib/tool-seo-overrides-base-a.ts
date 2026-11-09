import { TOOL_SEO_OVERRIDES_BASE_A_1 } from "./tool-seo-data/base-a-1";
import { TOOL_SEO_OVERRIDES_BASE_A_2 } from "./tool-seo-data/base-a-2";
/** SEO overrides base A (security, tip, percentage). */

export type ToolSeoOverrideBase = {
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

// Entries live in ./tool-seo-data/base-a-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_BASE_A: Record<string, ToolSeoOverrideBase> = {
  ...TOOL_SEO_OVERRIDES_BASE_A_1,
  ...TOOL_SEO_OVERRIDES_BASE_A_2,
};
