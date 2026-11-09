// Part 1 of 3 — split from es.categoria.$slug.tsx on 2026-11-04. Edit here; es.categoria.$slug.tsx re-exports.
import { lazy } from "react";

export const ToolListBrowser = lazy(() =>
  import("@/components/ToolListBrowser").then((m) => ({ default: m.ToolListBrowser })),
);
