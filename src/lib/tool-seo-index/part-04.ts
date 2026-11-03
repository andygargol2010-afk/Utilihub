// TOOL_SEO_OVERRIDES part 04 — split out of ../tool-seo-overrides.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_ATTENDANCE } from "../tool-seo-overrides-attendance";
import { TOOL_SEO_OVERRIDES_HOURS } from "../tool-seo-overrides-hours";
import { TOOL_SEO_OVERRIDES_HARMONIC_MEAN } from "../tool-seo-overrides-harmonic-mean";
import { TOOL_SEO_OVERRIDES_TEMPERATURE } from "../tool-seo-overrides-temperature";
import { TOOL_SEO_OVERRIDES_TRIP_FUEL } from "../tool-seo-overrides-trip-fuel";
import { TOOL_SEO_OVERRIDES_GSC_QUERIES } from "../tool-seo-overrides-gsc-queries";
import { TOOL_SEO_OVERRIDES_REFERENCE } from "../tool-seo-overrides-reference";
import { TOOL_SEO_OVERRIDES_WORK } from "../tool-seo-overrides-work";

export const TOOL_SEO_OVERRIDES_PART_04: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_ATTENDANCE,
  ...TOOL_SEO_OVERRIDES_HOURS,
  ...TOOL_SEO_OVERRIDES_HARMONIC_MEAN,
  ...TOOL_SEO_OVERRIDES_TEMPERATURE,
  ...TOOL_SEO_OVERRIDES_TRIP_FUEL,
  ...TOOL_SEO_OVERRIDES_GSC_QUERIES,
  ...TOOL_SEO_OVERRIDES_REFERENCE,
  ...TOOL_SEO_OVERRIDES_WORK,
};
