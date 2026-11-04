// Part 1 of 3 — split from catalog.ts on 2026-11-04. Edit here; catalog.ts re-exports.

export type GameLocale = "en" | "es" | "pt";

export type GameTag = "puzzle" | "arcade" | "board";

export type GameDef = {
  /** Canonical EN slug used in /games/$slug */
  slug: string;
  /** ES path slug under /es/juegos/$slug */
  slugEs: string;
  nameEn: string;
  nameEs: string;
  tag: GameTag;
  emoji: string;
  summaryEn: string;
  summaryEs: string;
  /** Whether a local high-score makes sense */
  hasScore: boolean;
};
