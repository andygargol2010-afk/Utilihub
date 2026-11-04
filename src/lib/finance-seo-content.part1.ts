// Part 1 of 3 — split from finance-seo-content.ts on 2026-11-04. Edit here; finance-seo-content.ts re-exports.

/** Unique on-page SEO copy for high-priority finance tools. */

export type FinanceSeoBlock = {
  metaTitle: string;
  metaTitleEs: string;
  metaDescription: string;
  metaDescriptionEs: string;
  intro: string;
  introEs: string;
  about: string[];
  aboutEs: string[];
  steps: string[];
  stepsEs: string[];
  faq: { q: string; a: string }[];
  faqEs: { q: string; a: string }[];
};
