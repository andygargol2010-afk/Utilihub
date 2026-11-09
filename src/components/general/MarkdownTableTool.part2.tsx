// Part 2 of 3 — split from MarkdownTableTool.tsx on 2026-11-04. Edit here; MarkdownTableTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const ISSUE_COPY: Record<string, { en: string; es: string }> = {
  empty: { en: "Paste at least one row.", es: "Pegá al menos una fila." },
  "one-column": { en: "Only one column detected. Check the delimiter.", es: "Solo se detectó una columna. Revisá el delimitador." },
  uneven: { en: "Some rows have fewer cells. Empty cells were added.", es: "Algunas filas tienen menos celdas. Se agregaron celdas vacías." },
  "header-only": { en: "Header only. The table has no body rows.", es: "Solo encabezado. La tabla no tiene filas de cuerpo." },
};
