import { TOOL_SEO_OVERRIDES_RANK5_1 } from "./tool-seo-data/rank5-1";
import { TOOL_SEO_OVERRIDES_RANK5_2 } from "./tool-seo-data/rank5-2";
import { TOOL_SEO_OVERRIDES_RANK5_3 } from "./tool-seo-data/rank5-3";
import type { ToolSeoOverride } from "./tool-seo-overrides";

/**
 * SEO rank pass: 5 high-intent tools with search demand.
 * Titles/meta/FAQ tuned for CTR + long-tail questions (ES + EN).
 * Spread last so these win over older overrides.
 */
// Entries live in ./tool-seo-data/rank5-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_RANK5: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_RANK5_1,
  ...TOOL_SEO_OVERRIDES_RANK5_2,
  ...TOOL_SEO_OVERRIDES_RANK5_3,
};
