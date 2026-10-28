/** Unique SEO copy overrides for high-priority general tools (by internal slug). */

// Per-tool override modules are imported in ./tool-seo-index/part-NN.ts (split 2026-10-28).
// Add new entries in the smallest file of ./tool-seo-index/; never rewrite files wholesale.
import { TOOL_SEO_OVERRIDES_PART_01 } from "./tool-seo-index/part-01";
import { TOOL_SEO_OVERRIDES_PART_02 } from "./tool-seo-index/part-02";
import { TOOL_SEO_OVERRIDES_PART_03 } from "./tool-seo-index/part-03";
import { TOOL_SEO_OVERRIDES_PART_04 } from "./tool-seo-index/part-04";

export type ToolSeoOverride = {
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

export const TOOL_SEO_OVERRIDES: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_PART_01,
  ...TOOL_SEO_OVERRIDES_PART_02,
  ...TOOL_SEO_OVERRIDES_PART_03,
  ...TOOL_SEO_OVERRIDES_PART_04,
};

export function toolSeoOverride(slug: string): ToolSeoOverride | undefined {
  return TOOL_SEO_OVERRIDES[slug];
}

/** Merge catalog tool fields with SEO override when present. */
export function resolvedToolSeo(tool: {
  slug: string;
  name: string;
  about: string[];
  steps: string[];
  faq?: { q: string; a: string }[];
  description?: string;
  title?: string;
}) {
  const o = toolSeoOverride(tool.slug);
  if (!o) {
    return {
      title: tool.title,
      description: tool.description,
      about: tool.about,
      steps: tool.steps,
      faq: tool.faq ?? [],
    };
  }
  return {
    title: o.metaTitle ?? tool.title,
    description: o.metaDescription ?? tool.description,
    about: o.about.length ? o.about : tool.about,
    steps: o.steps.length ? o.steps : tool.steps,
    faq: o.faq.length ? o.faq : tool.faq ?? [],
  };
}
