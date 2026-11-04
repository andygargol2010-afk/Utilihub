// Part 2 of 3 — split from ToolListBrowser.tsx on 2026-11-04. Edit here; ToolListBrowser.tsx re-exports.

export function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function letterOf(name: string) {
  const ch = normalize(name).charAt(0);
  return ch >= "a" && ch <= "z" ? ch.toUpperCase() : "#";
}

export const PAGE_SIZE = 20;
