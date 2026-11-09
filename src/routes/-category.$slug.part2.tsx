// Part 2 of 3 — split from category.$slug.tsx on 2026-11-04. Edit here; category.$slug.tsx re-exports.
import { lazy } from "react";

// ToolCard → CompactToolRow statically pulls ALL_CATEGORIES, i18n, favorites,
// and route-slugs. Keep that off the category route chunk so the shell hydrates
// without the catalog module; the list Suspense already reserves the slot.
export const ToolCard = lazy(() =>
  import("@/components/ToolCard").then((m) => ({ default: m.ToolCard })),
);

export type CategoryPayload = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
};

export type Neighbor = { slug: string; name: string };
