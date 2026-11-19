import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { GAMES, type GameLocale, gameName, gameSummary, tagLabel } from "@/lib/games/catalog";
import { type Filter } from "./GamesCatalog.part1";
import { FILTERS, NEW_SLUGS, GamePreview } from "./GamesCatalog.part2";

export function GamesCatalog({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const pt = locale === "pt";
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    if (filter === "all") return [...GAMES];
    return GAMES.filter((g) => g.tag === filter);
  }, [filter]);

  const title = pt ? "Jogos" : es ? "Juegos" : "Games";
  const subtitle = pt
    ? `${GAMES.length} jogos que rodam no seu navegador. Sem instalações nem contas: só jogar.`
    : es
      ? `${GAMES.length} juegos que corren en tu navegador. Sin instalaciones ni cuentas: solo jugar.`
      : `${GAMES.length} games that run in your browser. No installs, no accounts — just play.`;
  const filterLabel = pt ? "Filtrar por tipo" : es ? "Filtrar por tipo" : "Filter by type";
  const playLabel = pt ? "Jogar →" : es ? "Jugar →" : "Play →";
  const emptyLabel = pt ? "Não há jogos neste filtro." : es ? "No hay juegos en este filtro." : "No games in this filter.";
  const eyebrow = pt ? "Arcade · Puzzle · Tabuleiro" : es ? "Arcade · Puzzle · Tablero" : "Arcade · Puzzle · Board";

  return (
    <div className="games-skin min-h-[70vh] bg-gradient-to-b from-emerald-50/80 via-background to-background">
      <div className="container-page py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {subtitle}
        </p>

        <div
          className="mt-6 flex flex-wrap gap-2"
          role="group"
          aria-label={filterLabel}
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            const label = pt ? f.pt : es ? f.es : f.en;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={
                  active
                    ? "rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm"
                    : "rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500/40 hover:bg-emerald-50"
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((game) => {
            const hrefSlug = es ? game.slugEs : game.slug;
            const isNew = NEW_SLUGS.has(game.slug);
            const to = pt ? "/pt/jogos/$slug" : es ? "/es/juegos/$slug" : "/games/$slug";
            return (
              <Link
                key={game.slug}
                to={to}
                params={{ slug: hrefSlug }}
                className="card-hover group flex flex-col overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
              >
                <div className="relative p-3 pb-0">
                  <GamePreview game={game} />
                  {isNew && (
                    <span className="absolute right-5 top-5 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow">
                      {pt ? "Novo" : es ? "Nuevo" : "New"}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700/80">
                    {tagLabel(game.tag, locale)}
                  </span>
                  <span className="mt-1 text-lg font-bold text-slate-900 group-hover:text-emerald-800">
                    {gameName(game, locale)}
                  </span>
                  <span className="mt-2 flex-1 text-sm text-slate-600">
                    {gameSummary(game, locale)}
                  </span>
                  <span className="mt-4 text-sm font-bold text-emerald-700">
                    {playLabel}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            {emptyLabel}
          </p>
        )}
      </div>
    </div>
  );
}
