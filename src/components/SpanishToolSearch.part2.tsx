// Part 2 of 3 — split from SpanishToolSearch.tsx on 2026-11-04. Edit here; SpanishToolSearch.tsx re-exports.
import { lazy } from "react";

export const STOP = new Set(["de", "la", "el", "los", "las", "para", "por", "un", "una", "y", "o", "en", "the", "a", "an", "and", "or", "for", "to", "of", "in"]);
export const categoryButtonClass = "min-h-11 shrink-0 rounded-full px-3 text-xs font-semibold";
export const PAGE_SIZE = 30;

// Same as EN: keep ToolCard (and its row/catalog deps) off the SpanishToolSearch chunk.
export const ToolCard = lazy(() => import("@/components/ToolCard").then((m) => ({ default: m.ToolCard })));
