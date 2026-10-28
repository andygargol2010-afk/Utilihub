import { TOOL_SEO_OVERRIDES_GEOMETRY_1 } from "./tool-seo-data/geometry-1";
import { TOOL_SEO_OVERRIDES_GEOMETRY_2 } from "./tool-seo-data/geometry-2";
/** Unique SEO for geometry-suite calculators — no generic templates. */

export type ToolSeoOverrideGeometry = {
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

// Entries live in ./tool-seo-data/geometry-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_GEOMETRY: Record<string, ToolSeoOverrideGeometry> = {
  ...TOOL_SEO_OVERRIDES_GEOMETRY_1,
  ...TOOL_SEO_OVERRIDES_GEOMETRY_2,
};
