// Part 1 of 3 — split from tool-tags.ts on 2026-11-04. Edit here; tool-tags.ts re-exports.

/** Curated intent tags — short, user-meaningful filters (not generic SEO spam). */
export type IntentTag = {
  id: string;
  label: string;
  labelEs: string;
  /** Match against normalized slug + name + keywords + kind */
  match: (hay: string) => boolean;
};

export function has(...parts: string[]) {
  return (hay: string) => parts.some((p) => hay.includes(p));
}

export function hasAll(...parts: string[]) {
  return (hay: string) => parts.every((p) => hay.includes(p));
}
