export type GameLocale = "en" | "es";

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

export const GAMES: readonly GameDef[] = [
  {
    slug: "2048",
    slugEs: "2048",
    nameEn: "2048",
    nameEs: "2048",
    tag: "puzzle",
    emoji: "🔢",
    summaryEn: "Slide tiles, merge numbers, reach 2048.",
    summaryEs: "Deslizá fichas, combiná números y llegá a 2048.",
    hasScore: true,
  },
  {
    slug: "tic-tac-toe",
    slugEs: "tres-en-raya",
    nameEn: "Tic-Tac-Toe",
    nameEs: "Tres en raya",
    tag: "board",
    emoji: "⭕",
    summaryEn: "Classic 3×3. Play a friend or the CPU.",
    summaryEs: "Clásico 3×3. Jugá contra un amigo o la CPU.",
    hasScore: false,
  },
  {
    slug: "connect-four",
    slugEs: "conecta-4",
    nameEn: "Connect Four",
    nameEs: "Conecta 4",
    tag: "board",
    emoji: "🔴",
    summaryEn: "Drop discs and connect four in a row.",
    summaryEs: "Tirás fichas y conectás cuatro en línea.",
    hasScore: false,
  },
  {
    slug: "minesweeper",
    slugEs: "buscaminas",
    nameEn: "Minesweeper",
    nameEs: "Buscaminas",
    tag: "puzzle",
    emoji: "💣",
    summaryEn: "Clear the board without hitting a mine.",
    summaryEs: "Limpiá el tablero sin pisar una mina.",
    hasScore: true,
  },
  {
    slug: "snake",
    slugEs: "snake",
    nameEn: "Snake",
    nameEs: "Snake",
    tag: "arcade",
    emoji: "🐍",
    summaryEn: "Eat, grow, don't hit the walls.",
    summaryEs: "Comé, crecé y no choques con las paredes.",
    hasScore: true,
  },
  {
    slug: "pong",
    slugEs: "pong",
    nameEn: "Pong",
    nameEs: "Pong",
    tag: "arcade",
    emoji: "🏓",
    summaryEn: "Classic paddle duel against the CPU.",
    summaryEs: "Duelo clásico de paletas contra la CPU.",
    hasScore: true,
  },
  {
    slug: "memory",
    slugEs: "memoria",
    nameEn: "Memory Match",
    nameEs: "Memoria",
    tag: "puzzle",
    emoji: "🃏",
    summaryEn: "Flip cards and find every pair.",
    summaryEs: "Volteá cartas y encontrá todos los pares.",
    hasScore: true,
  },
  {
    slug: "sudoku",
    slugEs: "sudoku",
    nameEn: "Sudoku",
    nameEs: "Sudoku",
    tag: "puzzle",
    emoji: "9️⃣",
    summaryEn: "Fill the grid: no repeats in row, column, or box.",
    summaryEs: "Completá la grilla sin repetir en fila, columna o bloque.",
    hasScore: true,
  },
  {
    slug: "pacman",
    slugEs: "pacman",
    nameEn: "Pac-Man",
    nameEs: "Pac-Man",
    tag: "arcade",
    emoji: "🟡",
    summaryEn: "Classic maze chase: eat every pellet, dodge ghosts, grab power pellets.",
    summaryEs: "Laberinto clásico: comé todos los puntos, evitá fantasmas y agarrá power pellets.",
    hasScore: true,
  },
  {
    slug: "tetris",
    slugEs: "tetris",
    nameEn: "Tetris",
    nameEs: "Tetris",
    tag: "arcade",
    emoji: "🧱",
    summaryEn: "Stack tetrominoes, clear lines, chase a high score.",
    summaryEs: "Apilá tetrominós, limpiá líneas y buscá el high score.",
    hasScore: true,
  },
] as const;

export function gameBySlug(slug: string, locale: GameLocale = "en"): GameDef | undefined {
  const key = slug.toLowerCase();
  return GAMES.find((g) => (locale === "es" ? g.slugEs === key : g.slug === key) || g.slug === key || g.slugEs === key);
}

export function gamePath(game: GameDef, locale: GameLocale = "en") {
  return locale === "es" ? `/es/juegos/${game.slugEs}` : `/games/${game.slug}`;
}

export function gameName(game: GameDef, locale: GameLocale = "en") {
  return locale === "es" ? game.nameEs : game.nameEn;
}

export function gameSummary(game: GameDef, locale: GameLocale = "en") {
  return locale === "es" ? game.summaryEs : game.summaryEn;
}

export function tagLabel(tag: GameTag, locale: GameLocale = "en") {
  if (locale === "es") {
    return tag === "puzzle" ? "Puzzle" : tag === "arcade" ? "Arcade" : "Tablero";
  }
  return tag === "puzzle" ? "Puzzle" : tag === "arcade" ? "Arcade" : "Board";
}
