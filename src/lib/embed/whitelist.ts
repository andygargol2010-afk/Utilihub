// Embed Studio — curated whitelist of self-contained games that may be embedded via /embed/{slug}.
// Only games with no site chrome dependencies and traditional/generic mechanics belong here.
import { gameBySlug, gameName, type GameDef } from "@/lib/games/catalog";

export type EmbedLocale = "en" | "es";
export type EmbedTheme = "light" | "dark";

/** EN game slugs allowed to be embedded. Extend only with self-contained, lazy-loaded games. */
export const EMBED_GAME_SLUGS = [
  "2048",
  "tic-tac-toe",
  "memory-match-classic",
  "hangman-classic",
  "sudoku-classic",
  "minesweeper-classic",
  "connect-four-classic",
  "simon-sequence-memory",
  "lights-out",
  "snake",
  "othello-classic",
  "checkers-classic",
] as const;

export type EmbedSlug = (typeof EMBED_GAME_SLUGS)[number];

export function isEmbeddable(slug: string): slug is EmbedSlug {
  return (EMBED_GAME_SLUGS as readonly string[]).includes(slug);
}

export function embedGame(slug: string): GameDef | undefined {
  if (!isEmbeddable(slug)) return undefined;
  return gameBySlug(slug, "en");
}

export function embedGames(): GameDef[] {
  return EMBED_GAME_SLUGS.map((s) => gameBySlug(s, "en")).filter((g): g is GameDef => Boolean(g));
}

export const EMBED_THEMES: readonly EmbedTheme[] = ["light", "dark"];

export function parseEmbedLocale(v: unknown): EmbedLocale {
  return v === "es" ? "es" : "en";
}

export function parseEmbedTheme(v: unknown): EmbedTheme {
  return v === "dark" ? "dark" : "light";
}

/** Canonical (non-embed) page of an embeddable game, used for attribution + canonical link. */
export function embedSourcePath(game: GameDef, locale: EmbedLocale): string {
  return locale === "es" ? `/es/juegos/${game.slugEs}` : `/games/${game.slug}`;
}

export function embedLabel(game: GameDef, locale: EmbedLocale): string {
  return gameName(game, locale);
}
