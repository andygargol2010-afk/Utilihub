// Part 2 of 3 — split from ToolSearch.tsx on 2026-11-04. Edit here; ToolSearch.tsx re-exports.
import { lazy } from "react";

export const STOP = new Set([
  "de",
  "la",
  "el",
  "los",
  "las",
  "para",
  "por",
  "un",
  "una",
  "y",
  "o",
  "en",
  "the",
  "a",
  "an",
  "and",
  "or",
  "for",
  "to",
  "of",
  "in",
]);

export const PAGE_SIZE = 30;

// ToolCard pulls CompactToolRow + catalog bits. Keep it off the ToolSearch chunk;
// the first paint uses StaticListing, and the interactive list waits for idle.
export const ToolCard = lazy(() => import("@/components/ToolCard").then((m) => ({ default: m.ToolCard })));
