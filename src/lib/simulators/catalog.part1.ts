// Part 1 of 3 — split from catalog.ts on 2026-11-04. Edit here; catalog.ts re-exports.

export type SimLocale = "en" | "es" | "pt";

export type SimTag = "physics" | "chemistry" | "math";

/** Visual theme drives shell + hub card — not a generic dark box. */
export type SimTheme = "lab" | "cosmos" | "clockwork";

export type SimDef = {
  /** Canonical EN slug used in /simulators/$slug */
  slug: string;
  /** ES path slug under /es/simuladores/$slug */
  slugEs: string;
  nameEn: string;
  nameEs: string;
  tag: SimTag;
  theme: SimTheme;
  emoji: string;
  summaryEn: string;
  summaryEs: string;
  /** Short badge on hub cards */
  badgeEn: string;
  badgeEs: string;
};
