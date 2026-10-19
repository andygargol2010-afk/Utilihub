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
    emoji: "\ud83d\udd22",
    summaryEn: "Slide tiles, merge numbers, reach 2048.",
    summaryEs: "Desliz\u00e1 fichas, combin\u00e1 n\u00fameros y lleg\u00e1 a 2048.",
    hasScore: true,
  },
  {
    slug: "tic-tac-toe",
    slugEs: "tres-en-raya",
    nameEn: "Tic-Tac-Toe",
    nameEs: "Tres en raya",
    tag: "board",
    emoji: "\u2b55",
    summaryEn: "Classic 3\u00d73. Play a friend or the CPU.",
    summaryEs: "Cl\u00e1sico 3\u00d73. Jug\u00e1 contra un amigo o la CPU.",
    hasScore: false,
  },
  {
    slug: "connect-four",
    slugEs: "conecta-4",
    nameEn: "Connect Four",
    nameEs: "Conecta 4",
    tag: "board",
    emoji: "\ud83d\udd34",
    summaryEn: "Drop discs and connect four in a row.",
    summaryEs: "Tir\u00e1s fichas y conect\u00e1s cuatro en l\u00ednea.",
    hasScore: false,
  },
  {
    slug: "minesweeper",
    slugEs: "buscaminas",
    nameEn: "Minesweeper",
    nameEs: "Buscaminas",
    tag: "puzzle",
    emoji: "\ud83d\udca3",
    summaryEn: "Classic Minesweeper online: clear the board without hitting a mine. Free browser puzzle with timer and flags.",
    summaryEs: "Buscaminas online cl\u00e1sico: limpi\u00e1 el tablero sin pisar una mina. Puzzle gratis en el navegador con tiempo y banderas.",
    hasScore: true,
  },
  {
    slug: "snake",
    slugEs: "snake",
    nameEn: "Snake",
    nameEs: "Snake",
    tag: "arcade",
    emoji: "\ud83d\udc0d",
    summaryEn: "Eat, grow, don't hit the walls.",
    summaryEs: "Com\u00e9, crec\u00e9 y no choques con las paredes.",
    hasScore: true,
  },
  {
    slug: "pong",
    slugEs: "pong",
    nameEn: "Pong",
    nameEs: "Pong",
    tag: "arcade",
    emoji: "\ud83c\udfd3",
    summaryEn: "Classic paddle duel against the CPU.",
    summaryEs: "Duelo cl\u00e1sico de paletas contra la CPU.",
    hasScore: true,
  },
  {
    slug: "memory",
    slugEs: "memoria",
    nameEn: "Memory Match",
    nameEs: "Memoria",
    tag: "puzzle",
    emoji: "\ud83c\udccf",
    summaryEn: "Flip cards and find every pair.",
    summaryEs: "Volte\u00e1 cartas y encontr\u00e1 todos los pares.",
    hasScore: true,
  },
  {
    slug: "sudoku",
    slugEs: "sudoku",
    nameEn: "Sudoku",
    nameEs: "Sudoku",
    tag: "puzzle",
    emoji: "\ud83d\udd39",
    summaryEn: "Fill the grid: no repeats in row, column, or box.",
    summaryEs: "Complet\u00e1 la grilla sin repetir en fila, columna o bloque.",
    hasScore: true,
  },
  {
    slug: "pacman",
    slugEs: "pacman",
    nameEn: "Pac-Man",
    nameEs: "Pac-Man",
    tag: "arcade",
    emoji: "\ud83d\udfe1",
    summaryEn: "Classic maze chase: eat every pellet, dodge ghosts, grab power pellets.",
    summaryEs: "Laberinto cl\u00e1sico: com\u00e9 todos los puntos, evit\u00e1 fantasmas y agarr\u00e1 power pellets.",
    hasScore: true,
  },
  {
    slug: "tetris",
    slugEs: "tetris",
    nameEn: "Tetris",
    nameEs: "Tetris",
    tag: "arcade",
    emoji: "\ud83e\uddf1",
    summaryEn: "Stack tetrominoes, clear lines, chase a high score.",
    summaryEs: "Apil\u00e1 tetromin\u00f3s, limpi\u00e1 l\u00edneas y busc\u00e1 el high score.",
    hasScore: true,
  },
  {
    slug: "code-type-race",
    slugEs: "carrera-de-codigo",
    nameEn: "Code Type Race",
    nameEs: "Carrera de c\u00f3digo",
    tag: "arcade",
    emoji: "\u2328\ufe0f",
    summaryEn: "Type real JS and Python snippets. Race the clock for WPM and accuracy.",
    summaryEs: "Escrib\u00ed snippets reales de JS y Python. Compet\u00ed por WPM y precisi\u00f3n.",
    hasScore: true,
  },
  {
    slug: "formula-memory",
    slugEs: "memoria-formulas",
    nameEn: "Formula Memory",
    nameEs: "Memoria de f\u00f3rmulas",
    tag: "puzzle",
    emoji: "\u222b",
    summaryEn: "Match each formula name with its equation \u2014 physics, geometry, and finance.",
    summaryEs: "Emparej\u00e1 el nombre de cada f\u00f3rmula con su ecuaci\u00f3n: f\u00edsica, geometr\u00eda y finanzas.",
    hasScore: true,
  },
  {
    slug: "budget-survivor",
    slugEs: "supervivencia-presupuesto",
    nameEn: "Budget Survivor",
    nameEs: "Supervivencia de presupuesto",
    tag: "puzzle",
    emoji: "\ud83d\udcb8",
    summaryEn: "Survive a month of random bills and surprises without going broke.",
    summaryEs: "Sobreviv\u00ed un mes de gastos y sorpresas sin quedar en cero.",
    hasScore: true,
  },
  {
    slug: "pathfinder",
    slugEs: "busca-caminos",
    nameEn: "Pathfinder",
    nameEs: "Busca caminos",
    tag: "puzzle",
    emoji: "\ud83d\uddfa\ufe0f",
    summaryEn: "Draw walls, then watch BFS or A* find a path step by step.",
    summaryEs: "Dibuj\u00e1 paredes y mir\u00e1 c\u00f3mo BFS o A* encuentran el camino paso a paso.",
    hasScore: true,
  },
  {
    slug: "refraction-challenge",
    slugEs: "desafio-refraccion",
    nameEn: "Refraction Challenge",
    nameEs: "Desaf\u00edo de refracci\u00f3n",
    tag: "arcade",
    emoji: "\ud83d\udd26",
    summaryEn: "Aim a laser through lenses and hit the target. Bend light, clear levels.",
    summaryEs: "Apunt\u00e1 un l\u00e1ser a trav\u00e9s de lentes y pegale al blanco. Dobl\u00e1 la luz y pas\u00e1 niveles.",
    hasScore: true,
  },
  {
    slug: "lights-out",
    slugEs: "luces-fuera",
    nameEn: "Lights Out",
    nameEs: "Luces fuera",
    tag: "puzzle",
    emoji: "\ud83d\udca1",
    summaryEn: "Toggle lights and neighbors. Turn the whole grid off.",
    summaryEs: "Apag\u00e1 luces y vecinas. Dej\u00e1 toda la grilla apagada.",
    hasScore: false,
  },
  {
    slug: "magnetic-letter-catcher",
    slugEs: "atrapa-letras-magneticas",
    nameEn: "Magnetic Letter Catcher",
    nameEs: "Atrapa Letras Magn\u00e9ticas",
    tag: "arcade",
    emoji: "\ud83e\uddf2",
    summaryEn: "Catch floating letters of your name in order with magnetic attractor. Combos, modes, shareable PNG.",
    summaryEs: "Atrap\u00e1 las letras flotantes de tu nombre en orden con el atractor magn\u00e9tico. Combos, modos y PNG compartible.",
    hasScore: true,
  },
  {
    slug: "pulse-catch-arena",
    slugEs: "pulse-catch-arena",
    nameEn: "Pulse Catch Arena",
    nameEs: "Pulse Catch Arena",
    tag: "arcade",
    emoji: "\u26a1",
    summaryEn: "Catch falling neon pulses with your bar. Build combos, lose lives on misses, rising difficulty. Particle bursts on every catch.",
    summaryEs: "Atrap\u00e1 pulsos ne\u00f3n que caen con tu barra. Constru\u00ed combos, perd\u00e9s vidas si fall\u00e1s, dificultad creciente. Explosiones de part\u00edculas en cada captura.",
    hasScore: true,
  },
  {
    slug: "orbit-defender-arcade",
    slugEs: "arcade-defensor-orbita",
    nameEn: "Orbit Defender Arcade",
    nameEs: "Arcade Defensor \u00d3rbita",
    tag: "arcade",
    emoji: "\ud83c\udf0c",
    summaryEn: "Defend a glowing planet from asteroid waves. Aim interceptors, build combos, unlock power-ups, survive escalating difficulty.",
    summaryEs: "Defend\u00e9 un planeta brillante de olas de asteroides. Apunt\u00e1 interceptores, constru\u00ed combos, desbloque\u00e1 power-ups y sobreviv\u00ed dificultad creciente.",
    hasScore: true,
  },
] as const;

/** Next-step games for retention (first = primary). Keys = EN slug. */
export const GAME_JOURNEYS: Record<string, string[]> = {
  "2048": ["sudoku", "minesweeper", "memory", "lights-out"],
  "tic-tac-toe": ["connect-four", "memory", "sudoku", "minesweeper"],
  "connect-four": ["tic-tac-toe", "minesweeper", "memory", "sudoku"],
  minesweeper: ["sudoku", "2048", "memory", "lights-out"],
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
