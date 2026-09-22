import { ArrowRight } from "lucide-react";
import { GAMES, gameName, gamePath, gameSummary, type GameLocale } from "@/lib/games/catalog";

/** Featured games on home — high retention surface. */
const FEATURED_SLUGS = ["snake", "2048", "minesweeper", "sudoku", "tic-tac-toe", "pong", "memory", "connect-four"] as const;

type Props = {
  locale?: GameLocale;
};

export function HomeGamesSection({ locale = "en" }: Props) {
  const isEs = locale === "es";
  const hubPath = isEs ? "/es/juegos" : "/games";
  const featured = FEATURED_SLUGS.map((slug) => GAMES.find((g) => g.slug === slug)).filter(
    (g): g is (typeof GAMES)[number] => Boolean(g),
  );

  return (
    <section
      className="mt-4 rounded-2xl border border-emerald-900/10 bg-gradient-to-b from-emerald-50/90 via-card to-card p-5 sm:p-6"
      aria-labelledby="home-games-title"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-700">
            {isEs ? "Arcade · Puzzle · Tablero" : "Arcade · Puzzle · Board"}
          </p>
          <h2 id="home-games-title" className="mt-1 text-2xl font-black tracking-tight">
            {isEs ? "Juegos online gratis" : "Free online games"}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {isEs
              ? "Clásicos en el navegador, sin registro. Ideales para una pausa rápida."
              : "Browser classics, no signup. Perfect for a quick break."}
          </p>
        </div>
        <a
          href={hubPath}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold text-emerald-800 hover:bg-emerald-100/80"
        >
          {isEs ? "Ver todos" : "View all"} <ArrowRight className="size-4" />
        </a>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((game) => (
          <a
            key={game.slug}
            href={gamePath(game, locale)}
            className="group flex flex-col rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>
              {game.emoji}
            </span>
            <span className="mt-2 text-base font-bold text-slate-900 group-hover:text-emerald-800">
              {gameName(game, locale)}
            </span>
            <span className="mt-1 line-clamp-2 flex-1 text-xs text-slate-600">{gameSummary(game, locale)}</span>
            <span className="mt-3 text-sm font-bold text-emerald-700">{isEs ? "Jugar →" : "Play →"}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
