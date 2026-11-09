// Part 2 of 3 — split from ShareAndExportActions.tsx on 2026-11-04. Edit here; ShareAndExportActions.tsx re-exports.
import { type ExportRow } from "./ShareAndExportActions.part1";

export type Locale = "en" | "es";

export function collectRows(container: HTMLElement): ExportRow[] {
  return Array.from(container.querySelectorAll("[data-export-field]"))
    .map((field) => {
      const el = field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      return { Field: el.getAttribute("data-export-field") || el.getAttribute("aria-label") || el.name || "Value", Value: el.value };
    })
    .filter((row) => row.Value !== "");
}

export function collectTable(container: HTMLElement): ExportRow[] {
  const table = container.querySelector<HTMLTableElement>("[data-export-table]");
  if (!table) return [];
  const headers = Array.from(table.querySelectorAll("thead th")).map((cell) => cell.textContent?.trim() || "Column");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  if (!headers.length || !rows.length) return [];
  return rows.map((row) => {
    const values = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent?.trim() || "");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

export function collectResult(container: HTMLElement): string {
  return Array.from(container.querySelectorAll("[data-export-result]"))
    .map((element) => element.textContent?.trim() || "")
    .filter(Boolean)
    .join("\n");
}

export function filename(title: string, extension: string) {
  const safe = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `${safe || "utilihub-export"}.${extension}`;
}
