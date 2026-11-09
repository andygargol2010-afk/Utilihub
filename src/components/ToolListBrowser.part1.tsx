// Part 1 of 3 — split from ToolListBrowser.tsx on 2026-11-04. Edit here; ToolListBrowser.tsx re-exports.

export type BrowseableTool = {
  id: string;
  name: string;
  /** Extra text used only for filtering (summary, keywords…). */
  searchText?: string;
  slug?: string;
  keywords?: string[];
  kind?: string;
  summary?: string;
  category?: string;
};
