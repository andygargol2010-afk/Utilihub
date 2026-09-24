import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  GAMES,
  type GameDef,
  type GameLocale,
  type GameTag,
  gameName,
  gameSummary,
  tagLabel,
} from "@/lib/games/catalog";

type Filter = "all" | GameTag;

const FILTERS: { id: Filter; en: string; es: string }[] = [
  { id: "all", en: "All", es: "Todos" },
  { id: "arcade", en: "Arcade", es: "Arcade" },
  { id: "puzzle", en: "Puzzle", es: "Puzzle" },
  { id: "board", en: "Board", es: "Tablero" },
];

const NEW_SLUGS = new Set(["tetris", "pacman"]);

function GamePreview({ game }: { game: GameDef }) {
  const base =
    "relative flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl";
  const slug = game.slug;

  if (slug === "tetris") {
    return (
      <div className={`${base} bg-gradient-to-br from-slate-900 to-slate-800`}>
        <div className="flex gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="block size-4 rounded-sm bg-cyan-400 animate-bounce"
              style={{ animationDelay: `${i * 80}ms`, animationDuration: "0.9s" }}
            />
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-2 right-2 text-2xl opacity-80">{game.emoji}</span>
      </div>
    );
  }
  if (slug === "snake") {
    return (
      <div className={`${base} bg-gradient-to-br from-lime-600 to-green-800`}>
        <div className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="size-3 rounded-full bg-lime-300"
              style={{
                animation: "pulse 1.2s ease-in-out infinite",
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
          <span className="ml-1 size-2.5 rounded-full bg-red-400 animate-ping" />
        </div>
        <span className="pointer-events-none absolute bottom-2 right-2 text-2xl opacity-90">{game.emoji}</span>
      </div>
    );
  }
  if (slug === "pong") {
    return (
      <div className={`${base} bg-gradient-to-br from-slate-950 to-indigo-950`}>
        <div className="relative h-16 w-28">
          <span className="absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-full bg-white" />
          <span className="absolute right-0 top-1/3 h-8 w-1.5 rounded-full bg-white/80" />
          <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 animate-bounce" />
        </div>
        <span className="pointer-events-none absolute bottom-2 right-2 text-2xl opacity-90">{game.emoji}</span>
      </div>
    );
  }
  if (slug === "pacman") {
    return (
      <div className={`${base} bg-gradient-to-br from-slate-950 to-blue-950`}>
        <span className="text-4xl animate-pulse">{game.emoji}</span>
        <div className="absolute inset-x-6 bottom-4 flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="size-1.5 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      </div>
    );
  }
  if (slug === "2048") {
    return (
      <div className={`${base} bg-gradient-to-br from-amber-100 to-orange-200`}>
        <div className="grid grid-cols-2 gap-1">
          {["2", "4", "8", "16"].map((n, i) => (
            <span
              key={n}
              className="grid size-9 place-items-center rounded-md bg-amber-400/90 text-xs font-black text-amber-950 shadow-sm"
              style={{ animation: "pulse 2s ease-in-out infinite", animationDelay: `${i * 120}ms` }}
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (slug === "minesweeper") {
    return (
      <div className={`${base} bg-gradient-to-br from-slate-200 to-slate-400`}>
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className={`size-6 rounded-sm border border-slate-500/40 ${i === 4 ? "bg-red-500 text-[10px] grid place-items-center text-white" : "bg-slate-300"}`}
            >
              {i === 4 ? "💣" : ""}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (slug === "tic-tac-toe" || slug === "connect-four") {
    return (
      <div className={`${base} bg-gradient-to-br from-sky-100 to-blue-200`}>
        <span className="text-5xl drop-shadow-sm transition group-hover:scale-110">{game.emoji}</span>
      </div>
    );
  }
  if (slug === "memory") {
    return (
      <div className={`${base} bg-gradient-to-br from-violet-100 to-fuchsia-200`}>
        <div className="flex gap-2">
          <span className="grid size-10 place-items-center rounded-lg bg-violet-600 text-white shadow animate-pulse">?</span>
          <span className="grid size-10 place-items-center rounded-lg bg-fuchsia-500 text-lg shadow">{game.emoji}</span>
        </div>
      </div>
    );
  }
  if (slug === "sudoku") {
    return (
      <div className={`${base} bg-gradient-to-br from-emerald-50 to-teal-100`}>
        <div className="grid grid-cols-3 gap-px rounded border border-emerald-800/30 bg-emerald-800/20 p-0.5">
          {["5", "", "3", "", "7", "", "", "", "1"].map((n, i) => (
            <span key={i} className="grid size-5 place-items-center bg-white text-[9px] font-bold text-slate-700">
              {n}
            </span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={`${base} bg-gradient-to-br from-emerald-100 to-teal-200`}>
      <span className="text-5xl transition duration-300 group-hover:scale-110 group-hover:rotate-6">{game.emoji}</span>
    </div>
  );
}

export function GamesCatalog({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    if (filter === "all") return [...GAMES];
    return GAMES.filter((g) => g.tag === filter);
  }, [filter]);

  return (
    <div className="games-skin min-h-[70vh] bg-gradient-to-b from-emerald-50/80 via-background to-background">
      <div className="container-page py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          {es ? "Arcade · Puzzle · Tablero" : "Arcade · Puzzle · Board"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{es ? "Juegos" : "Games"}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {es
            ? `${GAMES.length} juegos que corren en tu navegador. Sin instalaciones ni cuentas: solo jugar.`
            : `${GAMES.length} games that run in your browser. No installs, no accounts — just play.`}
        </p>

        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label={es ? "Filtrar por tipo" : "Filter by type"}>
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={
                  active
                    ? "rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm"
                    : "rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500/40 hover:bg-emerald-50"
                }
              >
                {es ? f.es : f.en}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((game) => {
            const hrefSlug = es ? game.slugEs : game.slug;
            const isNew = NEW_SLUGS.has(game.slug);
            return (
              <Link
                key={game.slug}
                to={es ? "/es/juegos/$slug" : "/games/$slug"}
                params={{ slug: hrefSlug }}
                className="card-hover group flex flex-col overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
              >
                <div className="relative p-3 pb-0">
                  <GamePreview game={game} />
                  {isNew && (
                    <span className="absolute right-5 top-5 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow">
                      New
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
                  <span className="mt-2 flex-1 text-sm text-slate-600">{gameSummary(game, locale)}</span>
                  <span className="mt-4 text-sm font-bold text-emerald-700">{es ? "Jugar →" : "Play →"}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            {es ? "No hay juegos en este filtro." : "No games in this filter."}
          </p>
        )}
      </div>
    </div>
  );
}
