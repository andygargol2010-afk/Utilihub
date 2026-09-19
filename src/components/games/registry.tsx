import { lazy, Suspense, type ComponentType } from "react";
import type { GameDef, GameLocale } from "@/lib/games/catalog";

const TicTacToeGame = lazy(() => import("./TicTacToeGame").then((m) => ({ default: m.TicTacToeGame })));
const MemoryGame = lazy(() => import("./MemoryGame").then((m) => ({ default: m.MemoryGame })));
const SnakeGame = lazy(() => import("./SnakeGame").then((m) => ({ default: m.SnakeGame })));
const Game2048 = lazy(() => import("./Game2048").then((m) => ({ default: m.Game2048 })));

const ComingSoon = ({ locale }: { locale: GameLocale }) => (
  <p className="py-16 text-center text-sm font-semibold text-emerald-200/80">
    {locale === "es" ? "Próximamente en esta versión." : "Coming in the next drop."}
  </p>
);

const MAP: Record<string, ComponentType<{ locale?: GameLocale }>> = {
  "tic-tac-toe": TicTacToeGame,
  "tres-en-raya": TicTacToeGame,
  memory: MemoryGame,
  memoria: MemoryGame,
  snake: SnakeGame,
  "2048": Game2048,
};

export function GamePlayer({ game, locale = "en" }: { game: GameDef; locale?: GameLocale }) {
  const Comp = MAP[game.slug] ?? MAP[game.slugEs];
  if (!Comp) return <ComingSoon locale={locale} />;
  return (
    <Suspense
      fallback={
        <p className="py-12 text-center text-sm text-white/60">
          {locale === "es" ? "Cargando juego…" : "Loading game…"}
        </p>
      }
    >
      <Comp locale={locale} />
    </Suspense>
  );
}
