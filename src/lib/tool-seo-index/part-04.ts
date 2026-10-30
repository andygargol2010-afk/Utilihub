// TOOL_SEO_OVERRIDES part 04 — split out of ../tool-seo-overrides.ts on 2026-10-28 (same spread order).
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_ATTENDANCE } from "../tool-seo-overrides-attendance";
import { TOOL_SEO_OVERRIDES_HOURS } from "../tool-seo-overrides-hours";
import { TOOL_SEO_OVERRIDES_HARMONIC_MEAN } from "../tool-seo-overrides-harmonic-mean";

export const TOOL_SEO_OVERRIDES_PART_04: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_ATTENDANCE,
  ...TOOL_SEO_OVERRIDES_HOURS,
  ...TOOL_SEO_OVERRIDES_HARMONIC_MEAN,
};
