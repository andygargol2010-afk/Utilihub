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
    slug: "connect-four-classic",
    slugEs: "conecta-cuatro",
    nameEn: "Connect Four Classic",
    nameEs: "Conecta Cuatro Clásico",
    tag: "board",
    emoji: "🔴",
    summaryEn: "Classic gravity-drop Connect Four. Two players or vs CPU. Connect four to win. Shareable board.",
    summaryEs: "Conecta Cuatro clásico por gravedad. Dos jugadores o vs CPU. Conectá cuatro para ganar. Tablero compartible.",
    hasScore: false,
  },
  {
    slug: "sudoku-classic",
    slugEs: "sudoku-clasico",
    nameEn: "Sudoku Classic",
    nameEs: "Sudoku Clásico",
    tag: "puzzle",
    emoji: "🔢",
    summaryEn: "Classic Sudoku: fill the 9×9 grid with uniqueness in rows, columns and boxes. Difficulties, conflicts, shareable board.",
    summaryEs: "Sudoku clásico: completá la grilla 9×9 con unicidad en filas, columnas y bloques. Dificultades, conflictos y tablero compartible.",
    hasScore: false,
  },
  {
    slug: "minesweeper",
    slugEs: "buscaminas",
    nameEn: "Minesweeper",
    nameEs: "Buscaminas",
    tag: "puzzle",
    emoji: "💣",
    summaryEn: "Classic Minesweeper online: clear the board without hitting a mine. Free browser puzzle with timer and flags.",
    summaryEs: "Buscaminas online clásico: limpiá el tablero sin pisar una mina. Puzzle gratis en el navegador con tiempo y banderas.",
    hasScore: true,
  },
  {
    slug: "minesweeper-classic",
    slugEs: "buscaminas-clasico",
    nameEn: "Minesweeper Classic",
    nameEs: "Buscaminas Clásico",
    tag: "puzzle",
    emoji: "💣",
    summaryEn: "Classic Minesweeper: standard Easy 9×9/10, Medium 16×16/40, Hard 16×30/99. Flood-fill, flags, timer, first-click safe, shareable seed.",
    summaryEs: "Buscaminas clásico: Fácil 9×9/10, Medio 16×16/40, Difícil 16×30/99. Inundación de ceros, banderas, temporizador, primer clic seguro, semilla compartible.",
    hasScore: true,
  },
  {
    slug: "hangman",
    slugEs: "ahorcado",
    nameEn: "Hangman",
    nameEs: "Ahorcado",
    tag: "puzzle",
    emoji: "🔤",
    summaryEn: "Classic Hangman: guess the hidden word letter by letter before you run out of misses.",
    summaryEs: "Ahorcado clásico: adiviná la palabra oculta letra a letra antes de agotar los fallos.",
    hasScore: false,
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
    emoji: "🔷",
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
    summaryEs: "Laberinto clásico: comé todos los puntos, esquivá fantasmas y agarrá las píldoras de poder.",
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
    summaryEs: "Apilá tetrominós, limpiá líneas y buscate el récord.",
    hasScore: true,
  },
  {
    slug: "code-type-race",
    slugEs: "carrera-de-codigo",
    nameEn: "Code Type Race",
    nameEs: "Carrera de código",
    tag: "arcade",
    emoji: "⌨️",
    summaryEn: "Type real JS and Python snippets. Race the clock for WPM and accuracy.",
    summaryEs: "Escribí snippets reales de JS y Python. Competí por WPM y precisión.",
    hasScore: true,
  },
  {
    slug: "formula-memory",
    slugEs: "memoria-formulas",
    nameEn: "Formula Memory",
    nameEs: "Memoria de fórmulas",
    tag: "puzzle",
    emoji: "∫",
    summaryEn: "Match each formula name with its equation — physics, geometry, and finance.",
    summaryEs: "Emparejá el nombre de cada fórmula con su ecuación: física, geometría y finanzas.",
    hasScore: true,
  },
  {
    slug: "budget-survivor",
    slugEs: "supervivencia-presupuesto",
    nameEn: "Budget Survivor",
    nameEs: "Supervivencia de presupuesto",
    tag: "puzzle",
    emoji: "💸",
    summaryEn: "Survive a month of random bills and surprises without going broke.",
    summaryEs: "Sobreviví un mes de gastos y sorpresas sin quedar en cero.",
    hasScore: true,
  },
  {
    slug: "pathfinder",
    slugEs: "busca-caminos",
    nameEn: "Pathfinder",
    nameEs: "Busca caminos",
    tag: "puzzle",
    emoji: "🗺️",
    summaryEn: "Draw walls, then watch BFS or A* find a path step by step.",
    summaryEs: "Dibujá paredes y mirá cómo BFS o A* encuentran el camino paso a paso.",
    hasScore: true,
  },
  {
    slug: "refraction-challenge",
    slugEs: "desafio-refraccion",
    nameEn: "Refraction Challenge",
    nameEs: "Desafío de refracción",
    tag: "arcade",
    emoji: "🔦",
    summaryEn: "Aim a laser through lenses and hit the target. Bend light, clear levels.",
    summaryEs: "Apuntá un láser a través de lentes y pegale al blanco. Doblá la luz y pasá niveles.",
    hasScore: true,
  },
  {
    slug: "lights-out",
    slugEs: "luces-fuera",
    nameEn: "Lights Out",
    nameEs: "Luces fuera",
    tag: "puzzle",
    emoji: "💡",
    summaryEn: "Toggle lights and neighbors. Turn the whole grid off.",
    summaryEs: "Apagá luces y vecinas. Dejá toda la grilla apagada.",
    hasScore: false,
  },
  {
    slug: "magnetic-letter-catcher",
    slugEs: "atrapa-letras-magneticas",
    nameEn: "Magnetic Letter Catcher",
    nameEs: "Atrapa Letras Magnéticas",
    tag: "arcade",
    emoji: "🧲",
    summaryEn: "Catch floating letters of your name in order with magnetic attractor. Combos, modes, shareable PNG.",
    summaryEs: "Atrapá las letras flotantes de tu nombre en orden con el atractor magnético. Combos, modos y PNG compartible.",
    hasScore: true,
  },
  {
    slug: "pulse-catch-arena",
    slugEs: "pulse-catch-arena",
    nameEn: "Pulse Catch Arena",
    nameEs: "Pulse Catch Arena",
    tag: "arcade",
    emoji: "⚡",
    summaryEn: "Catch falling neon pulses with your bar. Build combos, lose lives on misses, rising difficulty. Particle bursts on every catch.",
    summaryEs: "Atrapá pulsos neón que caen con tu barra. Construí combos, perdé vidas si fallás, dificultad creciente. Explosiones de partículas en cada captura.",
    hasScore: true,
  },
  {
    slug: "orbit-defender-arcade",
    slugEs: "arcade-defensor-orbita",
    nameEn: "Orbit Defender Arcade",
    nameEs: "Arcade Defensor Órbita",
    tag: "arcade",
    emoji: "🌌",
    summaryEn: "Defend a glowing planet from asteroid waves. Aim interceptors, build combos, unlock power-ups, survive escalating difficulty.",
    summaryEs: "Defendé un planeta brillante de olas de asteroides. Apuntá interceptores, construí combos, desbloqueá power-ups y sobreviví dificultad creciente.",
    hasScore: true,
  },
  {
    slug: "orbit-pulse-catcher",
    slugEs: "atrapa-pulsos-orbita",
    nameEn: "Orbit Pulse Catcher",
    nameEs: "Atrapa Pulsos Órbita",
    tag: "arcade",
    emoji: "🔴",
    summaryEn: "Time your taps on colored zones to catch orbiting matching pulses. Combos, levels, particle bursts, PNG share.",
    summaryEs: "Sincronizá tus toques en zonas de color para atrapar pulsos orbitantes coincidentes. Combos, niveles, explosiones de partículas, PNG compartible.",
    hasScore: true,
  },
  {
    slug: "simon-sequence-memory",
    slugEs: "memoria-secuencia-simon",
    nameEn: "Simon Sequence Memory",
    nameEs: "Memoria de Secuencia Simon",
    tag: "puzzle",
    emoji: "🎨",
    summaryEn: "Classic Simon: watch the growing color sequence with tones, then repeat it. Levels, best score, sound toggle.",
    summaryEs: "Simon clásico: mirá la secuencia de colores con tonos que crece y repetila. Niveles, mejor puntaje, sonido.",
    hasScore: true,
  },
  {
    slug: "memory-match-classic",
    slugEs: "memoria-pares",
    nameEn: "Memory Match Classic",
    nameEs: "Memoria de Pares Clásica",
    tag: "puzzle",
    emoji: "🃏",
    summaryEn: "Classic memory match: flip cards to find pairs. Choose grid size, track moves, win with celebration. Shareable later.",
    summaryEs: "Memoria de pares clásica: volteá cartas para encontrar pares. Elegí tamaño de grilla, contá movimientos y ganá con celebración.",
    hasScore: true,
  },
] as const;

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
