import { GAMES, gameName, gamePath, type GameLocale } from "@/lib/games/catalog";

/** Soft CTA after a tool session — funnel traffic to high-retention games. */
const PICKS = ["snake", "2048", "sudoku", "minesweeper"] as const;

type Props = {
  locale?: GameLocale;
};

export function ToolGamesBreak({ locale = "en" }: Props) {
  const isEs = locale === "es";
  const hub = isEs ? "/es/juegos" : "/games";
  const games = PICKS.map((slug) => GAMES.find((g) => g.slug === slug)).filter(
    (g): g is (typeof GAMES)[number] => Boolean(g),
  );

  return (
    <section
      className="mt-8 rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-50/90 to-card p-4 sm:p-5"
      aria-labelledby="tool-games-break"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-700">
            {isEs ? "Pausa rápida" : "Quick break"}
          </p>
          <h2 id="tool-games-break" className="mt-1 text-base font-black">
            {isEs ? "¿Un descanso? Jugá un clásico" : "Need a break? Play a classic"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEs
              ? "Juegos cortos en el navegador, sin registro."
              : "Short browser games — no signup required."}
          </p>
        </div>
        <a
          href={hub}
          className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-bold text-emerald-800 hover:bg-emerald-100/80"
        >
          {isEs ? "Ver todos →" : "View all →"}
        </a>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {games.map((game) => (
          <a
            key={game.slug}
            href={gamePath(game, locale)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-500/40 hover:text-emerald-800"
          >
            <span aria-hidden>{game.emoji}</span>
            {gameName(game, locale)}
          </a>
        ))}
      </div>
    </section>
  );
}
