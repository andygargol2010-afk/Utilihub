import { TOOL_SEO_OVERRIDES_GAP_1 } from "./tool-seo-data/gap-1";
import { TOOL_SEO_OVERRIDES_GAP_2 } from "./tool-seo-data/gap-2";
import { TOOL_SEO_OVERRIDES_GAP_3 } from "./tool-seo-data/gap-3";
import type { ToolSeoOverride } from "./tool-seo-overrides";

/** Unique SEO for the 10 gap tools — bilingual, non-generic. */
// Entries live in ./tool-seo-data/gap-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_GAP: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_GAP_1,
  ...TOOL_SEO_OVERRIDES_GAP_2,
  ...TOOL_SEO_OVERRIDES_GAP_3,
};
