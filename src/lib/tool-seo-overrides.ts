/** Unique SEO copy overrides for high-priority general tools (by internal slug). */

import { TOOL_SEO_OVERRIDES_BASE_A } from "./tool-seo-overrides-base-a";
import { TOOL_SEO_OVERRIDES_BASE_A2 } from "./tool-seo-overrides-base-a2";
import { TOOL_SEO_OVERRIDES_BASE_B } from "./tool-seo-overrides-base-b";
import { TOOL_SEO_OVERRIDES_BLOCK3 } from "./tool-seo-overrides-block3";
import { TOOL_SEO_OVERRIDES_BLOCK4 } from "./tool-seo-overrides-block4";
import { TOOL_SEO_OVERRIDES_GROWTH } from "./tool-seo-overrides-growth";
import { TOOL_SEO_OVERRIDES_GROWTH_A } from "./tool-seo-overrides-growth-a";
import { TOOL_SEO_OVERRIDES_GROWTH_A2 } from "./tool-seo-overrides-growth-a2";
import { TOOL_SEO_OVERRIDES_GROWTH_B1 } from "./tool-seo-overrides-growth-b1";
import { TOOL_SEO_OVERRIDES_GROWTH_B2 } from "./tool-seo-overrides-growth-b2";
import { TOOL_SEO_OVERRIDES_GROWTH_B3 } from "./tool-seo-overrides-growth-b3";
import { TOOL_SEO_OVERRIDES_GAP } from "./tool-seo-overrides-gap";
import { TOOL_SEO_OVERRIDES_PERCENT } from "./tool-seo-overrides-percent";
import { TOOL_SEO_OVERRIDES_ALGEBRA } from "./tool-seo-overrides-algebra";
import { TOOL_SEO_OVERRIDES_GEOMETRY } from "./tool-seo-overrides-geometry";
import { TOOL_SEO_OVERRIDES_ARITHMETIC } from "./tool-seo-overrides-arithmetic";
import { TOOL_SEO_OVERRIDES_SEQUENCE } from "./tool-seo-overrides-sequence";
import { TOOL_SEO_OVERRIDES_TRIG } from "./tool-seo-overrides-trig";
import { TOOL_SEO_OVERRIDES_EXPLOG } from "./tool-seo-overrides-explog";
import { TOOL_SEO_OVERRIDES_MATRIX } from "./tool-seo-overrides-matrix";
import { TOOL_SEO_OVERRIDES_CORE } from "./tool-seo-overrides-core";
import { TOOL_SEO_OVERRIDES_OVERTIME } from "./tool-seo-overrides-overtime";
import { TOOL_SEO_OVERRIDES_UTM } from "./tool-seo-overrides-utm";
import { TOOL_SEO_OVERRIDES_TILE } from "./tool-seo-overrides-tile";
import { TOOL_SEO_OVERRIDES_VAT } from "./tool-seo-overrides-vat";
import { TOOL_SEO_OVERRIDES_AC } from "./tool-seo-overrides-ac";
import { TOOL_SEO_OVERRIDES_CONCRETE } from "./tool-seo-overrides-concrete";
import { TOOL_SEO_OVERRIDES_WALLPAPER } from "./tool-seo-overrides-wallpaper";
import { TOOL_SEO_OVERRIDES_DRYWALL } from "./tool-seo-overrides-drywall";
import { TOOL_SEO_OVERRIDES_MEETING } from "./tool-seo-overrides-meeting";
import { TOOL_SEO_OVERRIDES_PAINT } from "./tool-seo-overrides-paint";
import { TOOL_SEO_OVERRIDES_FENCE } from "./tool-seo-overrides-fence";
import { TOOL_SEO_OVERRIDES_STAIR } from "./tool-seo-overrides-stair";
import { TOOL_SEO_OVERRIDES_GRAVEL } from "./tool-seo-overrides-gravel";
import { TOOL_SEO_OVERRIDES_FLOORING } from "./tool-seo-overrides-flooring";
import { TOOL_SEO_OVERRIDES_AIRFRYER } from "./tool-seo-overrides-airfryer";
import { TOOL_SEO_OVERRIDES_DECK } from "./tool-seo-overrides-deck";
import { TOOL_SEO_OVERRIDES_ROOF } from "./tool-seo-overrides-roof";
import { TOOL_SEO_OVERRIDES_POOL } from "./tool-seo-overrides-pool";
import { TOOL_SEO_OVERRIDES_PAVER } from "./tool-seo-overrides-paver";
import { TOOL_SEO_OVERRIDES_SOD } from "./tool-seo-overrides-sod";
import { TOOL_SEO_OVERRIDES_GUTTER } from "./tool-seo-overrides-gutter";

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
  ...(TOOL_SEO_OVERRIDES_GROWTH_A as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_GROWTH_A2 as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_GROWTH_B1 as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_GROWTH_B2 as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_GROWTH_B3 as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_GAP as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_PERCENT as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_ALGEBRA as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_GEOMETRY as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_ARITHMETIC as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_SEQUENCE as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_TRIG as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_EXPLOG as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_MATRIX as Record<string, ToolSeoOverride>),
  ...(TOOL_SEO_OVERRIDES_CORE as Record<string, ToolSeoOverride>),
  ...TOOL_SEO_OVERRIDES_OVERTIME,
  ...TOOL_SEO_OVERRIDES_UTM,
  ...TOOL_SEO_OVERRIDES_TILE,
  ...TOOL_SEO_OVERRIDES_VAT,
  ...TOOL_SEO_OVERRIDES_AC,
  ...TOOL_SEO_OVERRIDES_CONCRETE,
  ...TOOL_SEO_OVERRIDES_WALLPAPER,
  ...TOOL_SEO_OVERRIDES_DRYWALL,
  ...TOOL_SEO_OVERRIDES_MEETING,
  ...TOOL_SEO_OVERRIDES_PAINT,
  ...TOOL_SEO_OVERRIDES_FENCE,
  ...TOOL_SEO_OVERRIDES_STAIR,
  ...TOOL_SEO_OVERRIDES_GRAVEL,
  ...TOOL_SEO_OVERRIDES_FLOORING,
  ...TOOL_SEO_OVERRIDES_AIRFRYER,
  ...TOOL_SEO_OVERRIDES_DECK,
  ...TOOL_SEO_OVERRIDES_ROOF,
  ...TOOL_SEO_OVERRIDES_POOL,
  ...TOOL_SEO_OVERRIDES_PAVER,
  ...TOOL_SEO_OVERRIDES_SOD,
  ...TOOL_SEO_OVERRIDES_GUTTER,
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
