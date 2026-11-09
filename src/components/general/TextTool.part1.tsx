// Part 1 of 3 — split from TextTool.tsx on 2026-11-04. Edit here; TextTool.tsx re-exports.

export const words = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);
