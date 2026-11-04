// Part 2 of 3 — split from DocumentTool.tsx on 2026-11-04. Edit here; DocumentTool.tsx re-exports.
import { type Operation } from "./DocumentTool.part1";

export const documentOperationMarkers: Record<Operation, () => true> = { "pdf-metadata": () => true, "text-diff": () => true, "csv-inspector": () => true, "markdown-html": () => true, "file-name-batch": () => true };
export const escapeHtml = (value: string) => value.replace(/&/g, "&"+"amp;").replace(/</g, "&"+"lt;").replace(/>/g, "&"+"gt;").replace(/\"/g, "&"+"quot;");
export const normalizeFileName = (value: string) => value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
