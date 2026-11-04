// Part 2 of 3 — split from ApaCitationTool.tsx on 2026-11-04. Edit here; ApaCitationTool.tsx re-exports.
import { type CitationInput } from "@/lib/general/apa-citation";

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
export const fieldClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

export const EMPTY: CitationInput = {
  kind: "webpage",
  authors: "",
  year: "",
  month: "",
  day: "",
  title: "",
  container: "",
  volume: "",
  issue: "",
  pages: "",
  url: "",
};
