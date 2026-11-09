import { TOOL_SEO_OVERRIDES_RANK7_1 } from "./tool-seo-data/rank7-1";
import { TOOL_SEO_OVERRIDES_RANK7_2 } from "./tool-seo-data/rank7-2";
import { TOOL_SEO_OVERRIDES_RANK7_3 } from "./tool-seo-data/rank7-3";
import type { ToolSeoOverride } from "./tool-seo-overrides";

/**
 * SEO rank pass #3: another 5 high-intent tools.
 * Spread after RANK6 so these win on their slugs.
 */
// Entries live in ./tool-seo-data/rank7-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_RANK7: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_RANK7_1,
  ...TOOL_SEO_OVERRIDES_RANK7_2,
  ...TOOL_SEO_OVERRIDES_RANK7_3,
};
