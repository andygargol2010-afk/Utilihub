// Part 2 of 3 — split from DevTool.tsx on 2026-11-04. Edit here; DevTool.tsx re-exports.

export const MIME: Record<string, string> = {
  json: "application/json",
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  txt: "text/plain",
  csv: "text/csv",
  xml: "application/xml",
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
  zip: "application/zip",
};
export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&" + "amp;").replace(/</g, "&" + "lt;").replace(/>/g, "&" + "gt;").replace(/"/g, "&" + "quot;").replace(/'/g, "&" + "#39;");
export const decodeHtml = (s: string) => {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
};
export const minifyHtml = (s: string) => s.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
export const minifyCss = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").trim();
export const minifyJs = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1").replace(/\s+/g, " ").trim();
export const jsonToYaml = (value: unknown, indent = 0): string => {
  const pad = " ".repeat(indent);
  if (Array.isArray(value))
    return value
      .map((v) => `${pad}- ${typeof v === "object" && v !== null ? `\n${jsonToYaml(v, indent + 2)}` : String(v)}`)
      .join("\n");
  if (value && typeof value === "object")
    return Object.entries(value)
      .map(([k, v]) => `${pad}${k}: ${typeof v === "object" && v !== null ? `\n${jsonToYaml(v, indent + 2)}` : JSON.stringify(v)}`)
      .join("\n");
  return JSON.stringify(value);
};
export const jsonToCsv = (value: unknown) => {
  if (!Array.isArray(value) || !value.every((v) => v && typeof v === "object" && !Array.isArray(v)))
    throw new Error("JSON must be an array of objects.");
  const rows = value as Record<string, unknown>[];
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [keys.map(q).join(","), ...rows.map((r) => keys.map((k) => q(r[k])).join(","))].join("\n");
};
export const csvDownload = (text: string) => URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
export const randomId = () => {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};
