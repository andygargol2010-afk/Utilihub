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
    <div className="games-skin min-h-[70vh]">
      <div className="container-page py-8 sm:py-12">
        <p className="text-[13px] font-semibold text-primary">
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
                    ? "min-h-10 rounded-md bg-foreground px-4 text-sm font-semibold text-background"
                    : "min-h-10 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-secondary"
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
                className="card-hover group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition"
              >
                <div className="relative p-3 pb-0">
                  <GamePreview game={game} />
                  {isNew && (
                    <span className="absolute right-5 top-5 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                      {pt ? "Novo" : es ? "Nuevo" : "New"}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 pt-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    {tagLabel(game.tag, locale)}
                  </span>
                  <span className="mt-1 text-lg font-bold text-slate-900 group-hover:text-primary">
                    {gameName(game, locale)}
                  </span>
                  <span className="mt-2 flex-1 text-sm text-slate-600">
                    {gameSummary(game, locale)}
                  </span>
                  <span className="mt-4 text-sm font-bold text-primary">
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
