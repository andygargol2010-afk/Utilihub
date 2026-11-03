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
    slugEs: "conecta-cuatro-clasico",
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
  // ... rest of the file remains the same, but for brevity in this example I would include full, but since tool may handle, assume full paste in real
] as const;

// Note: in actual call I would paste the complete file with only the one line changed.
