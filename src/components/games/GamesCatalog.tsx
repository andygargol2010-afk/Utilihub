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

/**
 * Clean, flat card art — recognizable silhouette of each classic game,
 * modern app-icon style. No Win95 chrome, no muddy texture recreations.
 */
function GamePreview({ game }: { game: GameDef }) {
  const shell =
    "relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl";
  const slug = game.slug;

  /* Pac-Man — yellow wedge + dots on deep blue (logo silhouette) */
  if (slug === "pacman") {
    return (
      <div className={`${shell} bg-[#0b1026]`}>
        <svg viewBox="0 0 120 72" className="h-[72px] w-[120px]" aria-hidden>
          <circle cx="70" cy="36" r="4" fill="#FFB8AE" />
          <circle cx="88" cy="36" r="4" fill="#FFB8AE" />
          <circle cx="106" cy="36" r="4" fill="#FFB8AE" />
          <path d="M42 36 L64 14 A28 28 0 1 0 64 58 Z" fill="#FFCC00" />
          <circle cx="40" cy="24" r="3.5" fill="#0b1026" />
        </svg>
      </div>
    );
  }

  /* Tetris — flat tetromino colors, no fake 3D */
  if (slug === "tetris") {
    const cells = [
      null, "#a855f7", null, null,
      "#22d3ee", "#a855f7", "#eab308", null,
      "#22d3ee", "#22c55e", "#f97316", "#ef4444",
      "#22d3ee", "#22c55e", "#f97316", "#ef4444",
    ];
    return (
      <div className={`${shell} bg-[#0f172a]`}>
        <div className="grid grid-cols-4 gap-1">
          {cells.map((c, i) => (
            <span
              key={i}
              className="size-5 rounded-md"
              style={{ background: c ?? "transparent" }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* Snake — simple green chain + apple */
  if (slug === "snake") {
    return (
      <div className={`${shell} bg-[#052e16]`}>
        <div className="flex items-center gap-1">
          <span className="size-4 rounded-full bg-[#4ade80]" />
          <span className="size-3.5 rounded-full bg-[#4ade80]" />
          <span className="size-3.5 rounded-full bg-[#4ade80]" />
          <span className="size-3.5 rounded-full bg-[#4ade80]" />
          <span className="size-3.5 rounded-full bg-[#4ade80]" />
          <span className="ml-2 size-3.5 rounded-full bg-[#f87171]" />
        </div>
      </div>
    );
  }

  /* Pong — minimal white on black */
  if (slug === "pong") {
    return (
      <div className={`${shell} bg-black`}>
        <div className="relative h-16 w-36">
          <span className="absolute left-0 top-3 h-10 w-1.5 rounded-full bg-white" />
          <span className="absolute right-0 top-6 h-10 w-1.5 rounded-full bg-white" />
          <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        </div>
      </div>
    );
  }

  /* 2048 — soft rounded tiles, classic palette, no beige mud field */
  if (slug === "2048") {
    return (
      <div className={`${shell} bg-[#faf8ef]`}>
        <div className="grid grid-cols-2 gap-2">
          <span className="grid size-11 place-items-center rounded-xl bg-[#eee4da] text-sm font-black text-[#776e65]">2</span>
          <span className="grid size-11 place-items-center rounded-xl bg-[#ede0c8] text-sm font-black text-[#776e65]">4</span>
          <span className="grid size-11 place-items-center rounded-xl bg-[#f2b179] text-sm font-black text-white">8</span>
          <span className="grid size-11 place-items-center rounded-xl bg-[#f59563] text-sm font-black text-white">16</span>
        </div>
      </div>
    );
  }

  /* Minesweeper — flat modern: soft slate + flag + numbers, no Win95 borders */
  if (slug === "minesweeper") {
    return (
      <div className={`${shell} bg-slate-200`}>
        <div className="grid grid-cols-3 gap-1.5">
          <span className="grid size-8 place-items-center rounded-lg bg-white text-sm font-bold text-blue-600 shadow-sm">1</span>
          <span className="grid size-8 place-items-center rounded-lg bg-slate-300 shadow-sm" />
          <span className="grid size-8 place-items-center rounded-lg bg-slate-300 shadow-sm" />
          <span className="grid size-8 place-items-center rounded-lg bg-slate-300 shadow-sm" />
          <span className="grid size-8 place-items-center rounded-lg bg-white text-base shadow-sm">🚩</span>
          <span className="grid size-8 place-items-center rounded-lg bg-white text-sm font-bold text-green-600 shadow-sm">2</span>
          <span className="grid size-8 place-items-center rounded-lg bg-slate-300 shadow-sm" />
          <span className="grid size-8 place-items-center rounded-lg bg-white text-sm font-bold text-blue-600 shadow-sm">1</span>
          <span className="grid size-8 place-items-center rounded-lg bg-slate-300 shadow-sm" />
        </div>
      </div>
    );
  }

  /* Tic-Tac-Toe — clean grid */
  if (slug === "tic-tac-toe") {
    return (
      <div className={`${shell} bg-slate-50`}>
        <div className="grid grid-cols-3 gap-0 rounded-xl border-2 border-slate-300 bg-white p-0.5 shadow-sm">
          {(["X", "O", "", "O", "X", "", "", "", "X"] as const).map((v, i) => (
            <span
              key={i}
              className="grid size-9 place-items-center border border-slate-200 text-lg font-black"
            >
              {v === "X" && <span className="text-slate-800">✕</span>}
              {v === "O" && <span className="text-rose-500">○</span>}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* Connect Four — blue frame, flat discs */
  if (slug === "connect-four") {
    const disc = (c: string | null) => (
      <span
        className="size-5 rounded-full"
        style={{ background: c ?? "rgba(15,23,42,0.35)" }}
      />
    );
    return (
      <div className={`${shell} bg-[#2563eb]`}>
        <div className="rounded-2xl bg-[#1d4ed8] p-2.5">
          <div className="grid grid-cols-4 gap-1.5">
            {disc(null)}
            {disc(null)}
            {disc(null)}
            {disc(null)}
            {disc("#ef4444")}
            {disc("#ef4444")}
            {disc("#facc15")}
            {disc(null)}
            {disc("#facc15")}
            {disc("#ef4444")}
            {disc("#facc15")}
            {disc("#ef4444")}
          </div>
        </div>
      </div>
    );
  }

  /* Memory — two soft cards */
  if (slug === "memory") {
    return (
      <div className={`${shell} bg-gradient-to-br from-violet-50 to-fuchsia-50`}>
        <div className="flex gap-3">
          <span className="grid h-14 w-11 place-items-center rounded-2xl bg-violet-600 text-xl font-black text-white shadow-md">
            ?
          </span>
          <span className="grid h-14 w-11 place-items-center rounded-2xl bg-fuchsia-500 text-xl text-white shadow-md">
            ♠
          </span>
        </div>
      </div>
    );
  }

  /* Sudoku — clean white grid */
  if (slug === "sudoku") {
    const n = ["5", "", "3", "", "7", "", "", "", "1"];
    return (
      <div className={`${shell} bg-white`}>
        <div className="grid grid-cols-3 gap-px rounded-lg border-2 border-slate-800 bg-slate-800">
          {n.map((v, i) => (
            <span
              key={i}
              className="grid size-7 place-items-center bg-white text-xs font-bold text-slate-800"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${shell} bg-gradient-to-br from-emerald-50 to-teal-50`}>
      <span className="text-5xl">{game.emoji}</span>
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
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {es ? "Juegos" : "Games"}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {es
            ? `${GAMES.length} juegos que corren en tu navegador. Sin instalaciones ni cuentas: solo jugar.`
            : `${GAMES.length} games that run in your browser. No installs, no accounts — just play.`}
        </p>

        <div
          className="mt-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label={es ? "Filtrar por tipo" : "Filter by type"}
        >
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
                  <span className="mt-2 flex-1 text-sm text-slate-600">
                    {gameSummary(game, locale)}
                  </span>
                  <span className="mt-4 text-sm font-bold text-emerald-700">
                    {es ? "Jugar →" : "Play →"}
                  </span>
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
