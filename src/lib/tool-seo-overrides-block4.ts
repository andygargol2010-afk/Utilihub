import { TOOL_SEO_OVERRIDES_BLOCK4_1 } from "./tool-seo-data/block4-1";
import { TOOL_SEO_OVERRIDES_BLOCK4_2 } from "./tool-seo-data/block4-2";
/** Block 4 SEO overrides (math + everyday). */

export type ToolSeoOverrideBlock4 = {
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

// Entries live in ./tool-seo-data/block4-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_BLOCK4: Record<string, ToolSeoOverrideBlock4> = {
  ...TOOL_SEO_OVERRIDES_BLOCK4_1,
  ...TOOL_SEO_OVERRIDES_BLOCK4_2,
};
