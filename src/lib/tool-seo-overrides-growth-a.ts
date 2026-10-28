import { TOOL_SEO_OVERRIDES_GROWTH_A_1 } from "./tool-seo-data/growth-a-1";
import { TOOL_SEO_OVERRIDES_GROWTH_A_2 } from "./tool-seo-data/growth-a-2";
/** SEO-growth overrides part a. */
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

// Entries live in ./tool-seo-data/growth-a-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_GROWTH_A: Record<string, ToolSeoOverrideGrowth> = {
  ...TOOL_SEO_OVERRIDES_GROWTH_A_1,
  ...TOOL_SEO_OVERRIDES_GROWTH_A_2,
};
