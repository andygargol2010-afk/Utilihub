/** Unique SEO copy overrides for high-priority general tools (by internal slug). */

import { TOOL_SEO_OVERRIDES_BASE_A } from "./tool-seo-overrides-base-a";
import { TOOL_SEO_OVERRIDES_BASE_A2 } from "./tool-seo-overrides-base-a2";
import { TOOL_SEO_OVERRIDES_BASE_B } from "./tool-seo-overrides-base-b";
import { TOOL_SEO_OVERRIDES_BLOCK3 } from "./tool-seo-overrides-block3";
import { TOOL_SEO_OVERRIDES_BLOCK4 } from "./tool-seo-overrides-block4";
import { TOOL_SEO_OVERRIDES_GROWTH } from "./tool-seo-overrides-growth";

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
  ...(TOOL_SEO_OVERRIDES_BASE_A as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_BASE_A2 as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_BASE_B as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_BLOCK3 as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_BLOCK4 as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_GROWTH as Record<string, ToolSeoOverride>),
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
