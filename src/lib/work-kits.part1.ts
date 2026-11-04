// Part 1 of 3 — split from work-kits.ts on 2026-11-04. Edit here; work-kits.ts re-exports.

// kitTools lives in work-kits-tools.ts: importing all-tools here put the whole
// catalog in the client entry chunk via kit route loaders and the sitemap route.

export type WorkKit = {
  /** Internal / Spanish path slug (stable for ES routes). */
  slug: string;
  /** Public English path segment for /kits/$slug */
  englishSlug: string;
  name: string;
  eyebrow: string;
  description: string;
  outcome: string;
  toolSlugs: string[];
};
