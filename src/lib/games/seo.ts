import type { GameDef, GameLocale } from "@/lib/games/catalog";
import { gameName, gamePath, gameSummary } from "@/lib/games/catalog";
import { absoluteUrl, cleanDescription, SITE_NAME, SITE_URL } from "@/lib/seo";

export type GameFaqItem = { q: string; a: string };

type GameSeoPack = {
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  keywordsEn: string[];
  keywordsEs: string[];
  faqEn: GameFaqItem[];
  faqEs: GameFaqItem[];
};

const COMMON_FAQ_EN: GameFaqItem[] = [
  {
    q: "Do I need an account to play?",
    a: "No. Every UtiliHub game runs in your browser with no signup and no install.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. Games are playable on phones and tablets with touch controls where needed.",
  },
  {
    q: "Is my progress saved?",
    a: "High scores and best times stay on your device (local storage). Nothing is uploaded to a server.",
  },
];

const COMMON_FAQ_ES: GameFaqItem[] = [
  {
    q: "¿Hace falta registrarse para jugar?",
    a: "No. Todos los juegos de UtiliHub corren en el navegador, sin cuenta y sin instalar nada.",
  },
  {
    q: "¿Funciona en el celular?",
    a: "Sí. Podés jugar en el teléfono o tablet; donde hace falta hay controles táctiles.",
  },
  {
    q: "¿Se guarda mi progreso?",
    a: "Los récords y mejores tiempos se guardan en tu dispositivo (almacenamiento local). No se sube nada a un servidor.",
  },
];

const SEO: Record<string, GameSeoPack> = {
  "2048": {
    titleEn: "Play 2048 online free — no download | UtiliHub",
    titleEs: "Jugar 2048 online gratis — sin descargar | UtiliHub",
    descriptionEn:
      "Slide tiles, merge numbers, and reach 2048 in your browser. Free 2048 game, no signup, works on mobile and desktop.",
    descriptionEs:
      "Deslizá fichas, combiná números y llegá a 2048 en el navegador. Juego 2048 gratis, sin registro, en celular y PC.",
    keywordsEn: ["2048", "play 2048 online", "2048 free", "2048 no download"],
    keywordsEs: ["2048", "jugar 2048 online", "2048 gratis", "2048 sin descargar"],
    faqEn: [
      { q: "How do you play 2048?", a: "Use arrow keys or swipe to slide all tiles. Matching numbers merge into their sum. Reach the 2048 tile to win." },
      { q: "Can I undo a move?", a: "Each new game starts fresh. Plan ahead — once tiles merge, the move cannot be undone." },
      ...COMMON_FAQ_EN,
    ],
    faqEs: [
      { q: "¿Cómo se juega al 2048?", a: "Usá las flechas o deslizá para mover todas las fichas. Los números iguales se combinan. El objetivo es llegar a la ficha 2048." },
      { q: "¿Se puede deshacer una jugada?", a: "Cada partida empieza de cero. Planificá bien: una vez combinadas, las fichas no se deshacen." },
      ...COMMON_FAQ_ES,
    ],
  },
  "tic-tac-toe": {
    titleEn: "Tic-Tac-Toe online vs CPU or friend | UtiliHub",
    titleEs: "Tres en raya online vs CPU o amigo | UtiliHub",
    descriptionEn:
      "Classic 3×3 tic-tac-toe in the browser. Play against the CPU (easy to hard) or a friend. Free, no signup.",
    descriptionEs:
      "Clásico tres en raya 3×3 en el navegador. Jugá contra la CPU (fácil a difícil) o un amigo. Gratis, sin registro.",
    keywordsEn: ["tic tac toe", "tic-tac-toe online", "noughts and crosses", "play vs CPU"],
    keywordsEs: ["tres en raya", "tres en raya online", "tatetí", "jugar vs CPU"],
    faqEn: [
      { q: "Can I play against the computer?", a: "Yes. Choose Easy, Medium, or Hard CPU difficulty, or play two players on the same device." },
      { q: "Who starts?", a: "You play as X and move first in single-player mode." },
      ...COMMON_FAQ_EN,
    ],
    faqEs: [
      { q: "¿Puedo jugar contra la computadora?", a: "Sí. Elegí dificultad Fácil, Media o Difícil, o jugá de a dos en el mismo dispositivo." },
      { q: "¿Quién empieza?", a: "En modo un jugador vos sos X y movés primero." },
      ...COMMON_FAQ_ES,
    ],
  },
  "connect-four": {
    titleEn: "Connect Four online free vs CPU | UtiliHub",
    titleEs: "Conecta 4 online gratis vs CPU | UtiliHub",
    descriptionEn:
      "Drop discs and connect four in a row. Play Connect Four against the CPU or a friend in your browser — free, no signup.",
    descriptionEs:
      "Tirás fichas y conectás cuatro en línea. Jugá Conecta 4 contra la CPU o un amigo en el navegador — gratis, sin registro.",
    keywordsEn: ["connect four", "connect 4 online", "four in a row", "play connect four free"],
    keywordsEs: ["conecta 4", "conecta cuatro online", "4 en línea", "jugar conecta 4 gratis"],
    faqEn: [
      { q: "How do you win Connect Four?", a: "Be the first to get four of your discs in a row — horizontal, vertical, or diagonal." },
      { q: "Is there a CPU opponent?", a: "Yes. Pick a difficulty and play against the computer, or share the board with a friend." },
      ...COMMON_FAQ_EN,
    ],
    faqEs: [
      { q: "¿Cómo se gana en Conecta 4?", a: "Sé el primero en alinear cuatro fichas seguidas — horizontal, vertical o diagonal." },
      { q: "¿Hay rival CPU?", a: "Sí. Elegí una dificultad y jugá contra la máquina, o compartí el tablero con un amigo." },
      ...COMMON_FAQ_ES,
    ],
  },
  minesweeper: {
    titleEn: "Minesweeper online free — classic puzzle | UtiliHub",
    titleEs: "Buscaminas online gratis — puzzle clásico | UtiliHub",
    descriptionEn:
      "Clear the board without hitting a mine. Free Minesweeper with Easy, Medium, and Hard boards. No download, runs in the browser.",
    descriptionEs:
      "Limpiá el tablero sin pisar una mina. Buscaminas gratis con niveles Fácil, Medio y Difícil. Sin descargar, en el navegador.",
    keywordsEn: ["minesweeper", "minesweeper online", "play minesweeper free", "classic minesweeper"],
    keywordsEs: ["buscaminas", "buscaminas online", "jugar buscaminas gratis", "buscaminas clásico"],
    faqEn: [
      { q: "How do flags work?", a: "Right-click (or long-press on mobile) to flag a suspected mine. Clear all safe cells to win." },
      { q: "What do the numbers mean?", a: "Each number shows how many mines touch that cell — use them to deduce safe squares." },
      ...COMMON_FAQ_EN,
    ],
    faqEs: [
      { q: "¿Cómo funcionan las banderas?", a: "Clic derecho (o mantener pulsado en el celular) para marcar una mina sospechosa. Limpiá todas las celdas seguras para ganar." },
      { q: "¿Qué significan los números?", a: "Cada número indica cuántas minas tocan esa casilla: usalos para deducir las casillas seguras." },
      ...COMMON_FAQ_ES,
    ],
  },
  snake: {
    titleEn: "Snake game online free — eat and grow | UtiliHub",
    titleEs: "Snake online gratis — comé y crecé | UtiliHub",
    descriptionEn:
      "Play the classic Snake game in your browser. Eat apples, grow longer, avoid walls and yourself. Free, mobile-friendly, no signup.",
    descriptionEs:
      "Jugá al Snake clásico en el navegador. Comé manzanas, crecé y evitá paredes y tu propio cuerpo. Gratis, en celular, sin registro.",
    keywordsEn: ["snake game", "play snake online", "snake free", "classic snake"],
    keywordsEs: ["snake", "jugar snake online", "snake gratis", "serpiente juego"],
    faqEn: [
      { q: "How do I control Snake?", a: "Use arrow keys or on-screen buttons. On mobile you can also swipe on the board." },
      { q: "When does the game end?", a: "The run ends if you hit a wall or your own body. Your best score is kept on this device." },
      ...COMMON_FAQ_EN,
    ],
    faqEs: [
      { q: "¿Cómo se controla Snake?", a: "Usá las flechas o los botones en pantalla. En el celular también podés deslizar sobre el tablero." },
      { q: "¿Cuándo termina la partida?", a: "Si chocás con una pared o con tu cuerpo. El mejor puntaje se guarda en este dispositivo." },
      ...COMMON_FAQ_ES,
    ],
  },
  pong: {
    titleEn: "Pong online free vs CPU | UtiliHub",
    titleEs: "Pong online gratis vs CPU | UtiliHub",
    descriptionEn:
      "Classic paddle duel against the CPU. Play free Pong in the browser with adjustable difficulty — no download required.",
    descriptionEs:
      "Duelo clásico de paletas contra la CPU. Jugá Pong gratis en el navegador con dificultad ajustable — sin descargar.",
    keywordsEn: ["pong", "pong online", "play pong free", "classic pong game"],
    keywordsEs: ["pong", "pong online", "jugar pong gratis", "pong clásico"],
    faqEn: [
      { q: "How do I move the paddle?", a: "Use the mouse, touch, or keyboard controls shown on the game screen." },
      { q: "Can I change difficulty?", a: "Yes. Choose Easy, Medium, or Hard for the CPU opponent." },
      ...COMMON_FAQ_EN,
    ],
    faqEs: [
      { q: "¿Cómo muevo la paleta?", a: "Con el mouse, el tacto o el teclado, según los controles que muestra la pantalla del juego." },
      { q: "¿Puedo cambiar la dificultad?", a: "Sí. Elegí Fácil, Media o Difícil para la CPU." },
      ...COMMON_FAQ_ES,
    ],
  },
  memory: {
    titleEn: "Memory Match online free — card pairs | UtiliHub",
    titleEs: "Memoria online gratis — pares de cartas | UtiliHub",
    descriptionEn:
      "Flip cards and find every pair. Free Memory Match brain game in the browser — no signup, works on phone and desktop.",
    descriptionEs:
      "Volteá cartas y encontrá todos los pares. Juego de memoria gratis en el navegador — sin registro, en celular y PC.",
    keywordsEn: ["memory match", "memory game online", "card pairs", "concentration game"],
    keywordsEs: ["memoria", "juego de memoria online", "pares de cartas", "memotest"],
    faqEn: [
      { q: "How do you score in Memory?", a: "Find all matching pairs in as few moves as possible. Your best run is stored locally." },
      { q: "Is there a time limit?", a: "No strict time limit — play at your own pace and try to beat your move count." },
      ...COMMON_FAQ_EN,
    ],
    faqEs: [
      { q: "¿Cómo se puntúa en Memoria?", a: "Encontrá todos los pares con la menor cantidad de movimientos. Tu mejor marca queda guardada en el dispositivo." },
      { q: "¿Hay límite de tiempo?", a: "No hay límite estricto: jugá a tu ritmo e intentá mejorar la cantidad de movimientos." },
      ...COMMON_FAQ_ES,
    ],
  },
  sudoku: {
    titleEn: "Sudoku online free — fill the grid | UtiliHub",
    titleEs: "Sudoku online gratis — completá la grilla | UtiliHub",
    descriptionEn:
      "Play free Sudoku in your browser. Fill the 9×9 grid with no repeats in any row, column, or box. No signup required.",
    descriptionEs:
      "Jugá Sudoku gratis en el navegador. Completá la grilla 9×9 sin repetir en fila, columna o bloque. Sin registro.",
    keywordsEn: ["sudoku", "sudoku online", "play sudoku free", "sudoku puzzle"],
    keywordsEs: ["sudoku", "sudoku online", "jugar sudoku gratis", "sudoku gratis"],
    faqEn: [
      { q: "What are the rules of Sudoku?", a: "Fill every row, column, and 3×3 box with digits 1–9, each used once. Use logic — no guessing required for a valid puzzle." },
      { q: "Can I get a new puzzle?", a: "Yes. Start a new game anytime for a fresh board difficulty suited to a quick browser session." },
      ...COMMON_FAQ_EN,
    ],
    faqEs: [
      { q: "¿Cuáles son las reglas del Sudoku?", a: "Completá cada fila, columna y bloque 3×3 con los dígitos 1–9 sin repetir. Usá lógica: no hace falta adivinar en un puzzle válido." },
      { q: "¿Puedo pedir un puzzle nuevo?", a: "Sí. Iniciá una partida nueva cuando quieras para otra grilla pensada para una sesión corta en el navegador." },
      ...COMMON_FAQ_ES,
    ],
  },
};

function pack(game: GameDef): GameSeoPack {
  return (
    SEO[game.slug] ?? {
      titleEn: `${game.nameEn} — free online game | UtiliHub`,
      titleEs: `${game.nameEs} — juego online gratis | UtiliHub`,
      descriptionEn: gameSummary(game, "en"),
      descriptionEs: gameSummary(game, "es"),
      keywordsEn: [game.nameEn, "free online game", "UtiliHub"],
      keywordsEs: [game.nameEs, "juego online gratis", "UtiliHub"],
      faqEn: COMMON_FAQ_EN,
      faqEs: COMMON_FAQ_ES,
    }
  );
}

export function gameMetaTitle(game: GameDef, locale: GameLocale = "en") {
  const p = pack(game);
  return locale === "es" ? p.titleEs : p.titleEn;
}

export function gameMetaDescription(game: GameDef, locale: GameLocale = "en") {
  const p = pack(game);
  return cleanDescription(locale === "es" ? p.descriptionEs : p.descriptionEn);
}

export function gameKeywords(game: GameDef, locale: GameLocale = "en") {
  const p = pack(game);
  return locale === "es" ? p.keywordsEs : p.keywordsEn;
}

export function gameFaq(game: GameDef, locale: GameLocale = "en"): GameFaqItem[] {
  const p = pack(game);
  return locale === "es" ? p.faqEs : p.faqEn;
}

/** schema.org VideoGame + FAQPage graph for game pages */
export function gameJsonLd(game: GameDef, locale: GameLocale = "en") {
  const name = gameName(game, locale);
  const description = gameMetaDescription(game, locale);
  const url = absoluteUrl(gamePath(game, locale));
  const faq = gameFaq(game, locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoGame",
        name,
        description,
        url,
        applicationCategory: "GameApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        gamePlatform: "Web browser",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
