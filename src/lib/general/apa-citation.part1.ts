// Part 1 of 3 — split from apa-citation.ts on 2026-11-04. Edit here; apa-citation.ts re-exports.

export type CitationKind = "webpage" | "book" | "journal";

export type CitationInput = {
  kind: CitationKind;
  authors: string;
  year: string;
  month: string;
  day: string;
  title: string;
  container: string;
  volume: string;
  issue: string;
  pages: string;
  url: string;
};

export type CitationResult =
  | { status: "empty" }
  | { status: "ok"; citation: string; warning: "url" | null };

export const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const MONTHS_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/** "García Márquez, Gabriel" → "García Márquez, G."; "Gabriel García" → "García, G." */
export function formatAuthorName(raw: string): string {
  const value = clean(raw).replace(/\.$/, "");
  if (!value) return "";
  if (value.includes(",")) {
    const [surname, given = ""] = value.split(",").map(clean);
    const initials = given
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => `${part[0].toUpperCase()}.`)
      .join(" ");
    return initials ? `${surname}, ${initials}` : surname;
  }
  const parts = value.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0];
  const surname = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map((part) => `${part[0].toUpperCase()}.`).join(" ");
  return `${surname}, ${initials}`;
}
