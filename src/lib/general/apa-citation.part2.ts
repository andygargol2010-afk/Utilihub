// Part 2 of 3 — split from apa-citation.ts on 2026-11-04. Edit here; apa-citation.ts re-exports.
import { formatAuthorName, clean, MONTHS_ES, MONTHS_EN } from "./apa-citation.part1";

export function formatAuthorList(raw: string, es: boolean): string {
  const people = raw
    .split(/[;\n]+/)
    .map(formatAuthorName)
    .filter(Boolean);
  if (!people.length) return "";
  const join = es ? " y " : " & ";
  if (people.length === 1) return people[0];
  if (people.length === 2) return `${people[0]}${join}${people[1]}`;
  if (people.length <= 20) return `${people.slice(0, -1).join(", ")},${join}${people[people.length - 1]}`;
  return `${people.slice(0, 19).join(", ")}, ... ${people[people.length - 1]}`;
}

export function formatApaDate(year: string, month: string, day: string, es: boolean): string {
  const y = clean(year);
  const m = Number(month);
  const d = Number(day);
  if (!y) return es ? "s. f." : "n.d.";
  if (!m || m < 1 || m > 12) return y;
  const monthName = es ? MONTHS_ES[m - 1] : MONTHS_EN[m - 1];
  if (!d || d < 1 || d > 31) return es ? `${y}, ${monthName}` : `${y}, ${monthName}`;
  return es ? `${y}, ${d} de ${monthName}` : `${y}, ${monthName} ${d}`;
}

export function normalizeUrl(raw: string): { url: string; warning: boolean } {
  const value = clean(raw);
  if (!value) return { url: "", warning: false };
  if (/^https?:\/\//i.test(value) || /^doi:/i.test(value)) return { url: value, warning: false };
  if (/^10\.\d{4,}\//.test(value)) return { url: `https://doi.org/${value}`, warning: false };
  if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(value)) return { url: `https://${value}`, warning: true };
  return { url: value, warning: true };
}
