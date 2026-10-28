import { TOOL_SEO_OVERRIDES_BLOCK3_1 } from "./tool-seo-data/block3-1";
import { TOOL_SEO_OVERRIDES_BLOCK3_2 } from "./tool-seo-data/block3-2";
import { TOOL_SEO_OVERRIDES_BLOCK3_3 } from "./tool-seo-data/block3-3";
/** Block 3 high-priority SEO overrides (merged via toolSeoOverride). */

export type ToolSeoOverrideBlock3 = {
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

// Entries live in ./tool-seo-data/block3-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_BLOCK3: Record<string, ToolSeoOverrideBlock3> = {
  ...TOOL_SEO_OVERRIDES_BLOCK3_1,
  ...TOOL_SEO_OVERRIDES_BLOCK3_2,
  ...TOOL_SEO_OVERRIDES_BLOCK3_3,
};
