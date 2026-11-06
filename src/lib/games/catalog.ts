import { type GameDef, type GameLocale, type GameTag } from "./catalog.part1";
import { GAMES } from "./catalog.part2";
export type { GameLocale, GameTag, GameDef } from "./catalog.part1";
export { GAMES } from "./catalog.part2";
import { PT_GAMES, PT_GAME_TAGS } from "@/lib/i18n/pt-games";

/** Next-step games for retention (first = primary). Keys = EN slug. */
export const GAME_JOURNEYS: Record<string, string[]> = {
  "2048": ["sudoku", "minesweeper", "memory", "lights-out"],
  "tic-tac-toe": ["connect-four", "connect-four-classic", "memory", "sudoku"],
  "connect-four": ["connect-four-classic", "tic-tac-toe", "minesweeper", "memory"],
  "connect-four-classic": ["connect-four", "tic-tac-toe", "minesweeper", "memory"],
  "sudoku-classic": ["sudoku", "minesweeper", "2048", "memory"],
  minesweeper: ["minesweeper-classic", "sudoku", "2048", "memory"],
  "minesweeper-classic": ["minesweeper", "sudoku-classic", "2048", "memory"],
  hangman: ["memory", "minesweeper", "sudoku", "formula-memory"],
  snake: ["pacman", "tetris", "pong", "magnetic-letter-catcher"],
  pong: ["snake", "tetris", "pacman", "refraction-challenge"],
  memory: ["formula-memory", "sudoku", "minesweeper", "2048"],
  sudoku: ["minesweeper", "2048", "memory", "lights-out"],
  pacman: ["snake", "tetris", "pong", "magnetic-letter-catcher"],
  tetris: ["snake", "pacman", "pong", "2048"],
  "code-type-race": ["formula-memory", "pathfinder", "budget-survivor", "sudoku"],
  "formula-memory": ["memory", "code-type-race", "pathfinder", "sudoku"],
  "budget-survivor": ["pathfinder", "formula-memory", "code-type-race", "lights-out"],
  pathfinder: ["lights-out", "sudoku", "refraction-challenge", "formula-memory"],
  "refraction-challenge": ["pathfinder", "pong", "snake", "lights-out"],
  "lights-out": ["sudoku", "minesweeper", "memory", "pathfinder"],
  "magnetic-letter-catcher": ["snake", "pacman", "tetris", "code-type-race"],
  "pulse-catch-arena": ["pong", "snake", "tetris", "magnetic-letter-catcher"],
  "orbit-defender-arcade": ["pulse-catch-arena", "pong", "snake", "tetris"],
  "orbit-pulse-catcher": ["pulse-catch-arena", "orbit-defender-arcade", "pong", "refraction-challenge"],
  "simon-sequence-memory": ["memory", "formula-memory", "hangman", "lights-out"],
  "memory-match-classic": ["memory", "simon-sequence-memory", "hangman", "sudoku-classic"],
  "othello-classic": ["connect-four-classic", "tic-tac-toe", "memory-match-classic", "sudoku-classic"],
};

export function relatedGames(current: Pick<GameDef, "slug" | "tag">): GameDef[] {
  const curated = (GAME_JOURNEYS[current.slug] ?? [])
    .map((slug) => GAMES.find((g) => g.slug === slug))
    .filter((g): g is GameDef => Boolean(g) && g.slug !== current.slug);
  if (curated.length >= 4) return curated.slice(0, 4);
  const used = new Set([current.slug, ...curated.map((g) => g.slug)]);
  const sameTag = GAMES.filter((g) => g.tag === current.tag && !used.has(g.slug));
  const rest = GAMES.filter((g) => !used.has(g.slug) && !sameTag.includes(g));
  return [...curated, ...sameTag, ...rest].slice(0, 4);
}

export function gameBySlug(slug: string, locale: GameLocale = "en"): GameDef | undefined {
  const key = slug.toLowerCase();
  // Strict per-locale lookup: /games/$slug only resolves EN slugs and
  // /es/juegos/$slug only resolves ES slugs. The old cross-locale fallback
  // served the same game under both slugs with a canonical pointing to a
  // different URL (duplicate content / locale leak).
  return GAMES.find((g) => (locale === "es" ? g.slugEs === key : g.slug === key));
}

export function gamePath(game: GameDef, locale: GameLocale = "en") {
  if (locale === "pt") return `/pt/jogos/${game.slug}`;
  return locale === "es" ? `/es/juegos/${game.slugEs}` : `/games/${game.slug}`;
}

export function gameName(game: GameDef, locale: GameLocale = "en") {
  if (locale === "pt") return PT_GAMES[game.slug]?.name ?? game.nameEn;
  return locale === "es" ? game.nameEs : game.nameEn;
}

export function gameSummary(game: GameDef, locale: GameLocale = "en") {
  if (locale === "pt") return PT_GAMES[game.slug]?.summary ?? game.summaryEn;
  return locale === "es" ? game.summaryEs : game.summaryEn;
}

export function tagLabel(tag: GameTag, locale: GameLocale = "en") {
  if (locale === "pt") return PT_GAME_TAGS[tag as keyof typeof PT_GAME_TAGS] ?? tag;
  if (locale === "es") {
    return tag === "puzzle" ? "Puzzle" : tag === "arcade" ? "Arcade" : "Tablero";
  }
  return tag === "puzzle" ? "Puzzle" : tag === "arcade" ? "Arcade" : "Board";
}
