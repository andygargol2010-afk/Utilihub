// Part 2 of 3 — split from es.categoria.$slug.tsx on 2026-11-04. Edit here; es.categoria.$slug.tsx re-exports.
import { lazy } from "react";

// Same as the English category route: ToolCard pulls CompactToolRow + all-tools.
// The listing Suspense already reserves the slot, so the card chunk can wait.
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

export type Neighbor = { slug: string };
