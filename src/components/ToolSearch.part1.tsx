// Part 1 of 3 — split from ToolSearch.tsx on 2026-11-04. Edit here; ToolSearch.tsx re-exports.

export function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
