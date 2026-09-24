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

/** Soft gradient + large emoji — clean card art, no noisy CSS toys */
const PREVIEW_BG: Record<string, string> = {
  "2048": "from-amber-100 via-orange-50 to-amber-200",
  "tic-tac-toe": "from-sky-100 via-blue-50 to-indigo-100",
  "connect-four": "from-blue-100 via-sky-50 to-cyan-100",
  minesweeper: "from-slate-200 via-slate-100 to-zinc-200",
  snake: "from-lime-200 via-green-100 to-emerald-200",
  pong: "from-slate-800 via-indigo-950 to-slate-900",
  memory: "from-violet-100 via-fuchsia-50 to-pink-100",
  sudoku: "from-emerald-50 via-teal-50 to-cyan-100",
  pacman: "from-slate-900 via-blue-950 to-indigo-950",
  tetris: "from-slate-900 via-cyan-950 to-slate-800",
};

function GamePreview({ game }: { game: GameDef }) {
  const bg = PREVIEW_BG[game.slug] ?? "from-emerald-100 via-teal-50 to-cyan-100";
  const dark = ["pong", "pacman", "tetris"].includes(game.slug);
  return (
    <div
      className={`relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${bg}`}
      aria-hidden
    >
      <span
        className={`select-none text-6xl drop-shadow-sm transition duration-300 group-hover:scale-110 ${
          dark ? "opacity-95" : "opacity-90"
        }`}
      >
        {game.emoji}
      </span>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.06] to-transparent" />
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
