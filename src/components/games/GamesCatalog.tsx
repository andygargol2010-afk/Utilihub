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
 * Card art inspired by each game’s traditional look (not random emoji invents).
 * Pure CSS/SVG — no trademark bitmaps, just the familiar silhouettes.
 */
function GamePreview({ game }: { game: GameDef }) {
  const base =
    "relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl";
  const slug = game.slug;

  /* Pac-Man — classic yellow wedge + dots on navy maze feel */
  if (slug === "pacman") {
    return (
      <div className={`${base} bg-[#0b0b2e]`}>
        <div className="flex items-center gap-3">
          <div
            className="size-14 rounded-full bg-[#FFCC00]"
            style={{
              /* open mouth facing right */
              clipPath: "polygon(100% 50%, 100% 0, 0 0, 0 100%, 100% 100%, 100% 55%, 58% 50%)",
            }}
          />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2 rounded-full bg-[#FFB8AE]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* Tetris — cyan / yellow / magenta / green / orange tetromino tiles on dark */
  if (slug === "tetris") {
    const cell = "size-5 rounded-[3px] shadow-sm";
    return (
      <div className={`${base} bg-[#0f172a]`}>
        <div className="grid grid-cols-4 gap-0.5">
          {/* T-ish / colorful stack silhouette */}
          <span className={`${cell} bg-transparent`} />
          <span className={`${cell} bg-[#a855f7]`} />
          <span className={`${cell} bg-transparent`} />
          <span className={`${cell} bg-transparent`} />
          <span className={`${cell} bg-[#22d3ee]`} />
          <span className={`${cell} bg-[#a855f7]`} />
          <span className={`${cell} bg-[#facc15]`} />
          <span className={`${cell} bg-transparent`} />
          <span className={`${cell} bg-[#22d3ee]`} />
          <span className={`${cell} bg-[#22c55e]`} />
          <span className={`${cell} bg-[#f97316]`} />
          <span className={`${cell} bg-[#ef4444]`} />
          <span className={`${cell} bg-[#22d3ee]`} />
          <span className={`${cell} bg-[#22c55e]`} />
          <span className={`${cell} bg-[#f97316]`} />
          <span className={`${cell} bg-[#ef4444]`} />
        </div>
      </div>
    );
  }

  /* Snake — green segments + red apple, classic phone/arcade feel */
  if (slug === "snake") {
    return (
      <div className={`${base} bg-[#14532d]`}>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`rounded-sm bg-[#4ade80] ${
                i === 0 ? "size-4 rounded-full ring-2 ring-lime-200" : "size-3.5"
              }`}
            />
          ))}
          <span className="ml-2 size-3 rounded-full bg-[#f87171] shadow" />
        </div>
      </div>
    );
  }

  /* Pong — black field, white paddles, white ball */
  if (slug === "pong") {
    return (
      <div className={`${base} bg-black`}>
        <div className="relative h-20 w-36">
          <span className="absolute left-0 top-1/2 h-10 w-1.5 -translate-y-1/2 rounded-sm bg-white" />
          <span className="absolute right-0 top-1/3 h-10 w-1.5 rounded-sm bg-white" />
          <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          {/* dashed mid line */}
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed border-white/40" />
        </div>
      </div>
    );
  }

  /* 2048 — official-ish amber tiles 2/4/8/16 */
  if (slug === "2048") {
    return (
      <div className={`${base} bg-[#bbada0]`}>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { n: "2", c: "bg-[#eee4da] text-[#776e65]" },
            { n: "4", c: "bg-[#ede0c8] text-[#776e65]" },
            { n: "8", c: "bg-[#f2b179] text-white" },
            { n: "16", c: "bg-[#f59563] text-white" },
          ].map((t) => (
            <span
              key={t.n}
              className={`grid size-11 place-items-center rounded-md text-sm font-black shadow-sm ${t.c}`}
            >
              {t.n}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* Minesweeper — Win95-ish gray cells + red mine */
  if (slug === "minesweeper") {
    return (
      <div className={`${base} bg-[#c0c0c0]`}>
        <div className="grid grid-cols-3 gap-0.5 border-2 border-b-white border-r-white border-l-[#808080] border-t-[#808080] p-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className={`grid size-7 place-items-center text-[11px] font-bold ${
                i === 4
                  ? "bg-[#c0c0c0] text-black"
                  : "border border-b-[#808080] border-r-[#808080] border-l-white border-t-white bg-[#c0c0c0]"
              }`}
            >
              {i === 4 ? "💣" : i === 1 ? <span className="text-blue-700">1</span> : i === 6 ? <span className="text-green-700">2</span> : ""}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* Tic-tac-toe — X and O on grid */
  if (slug === "tic-tac-toe") {
    return (
      <div className={`${base} bg-slate-100`}>
        <div className="grid grid-cols-3 gap-0 border-2 border-slate-400">
          {["X", "O", "", "O", "X", "", "", "", "X"].map((v, i) => (
            <span
              key={i}
              className="grid size-8 place-items-center border border-slate-300 text-lg font-black text-slate-700"
            >
              {v === "X" ? <span className="text-slate-800">X</span> : v === "O" ? <span className="text-rose-500">O</span> : ""}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* Connect Four — blue board + red/yellow discs */
  if (slug === "connect-four") {
    return (
      <div className={`${base} bg-[#1d4ed8]`}>
        <div className="grid grid-cols-4 gap-1 rounded-lg bg-[#1e40af] p-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className={`size-5 rounded-full ${
                i === 5 || i === 6
                  ? "bg-[#ef4444]"
                  : i === 7
                    ? "bg-[#facc15]"
                    : "bg-[#0f172a]/40"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  /* Memory — two face-down cards */
  if (slug === "memory") {
    return (
      <div className={`${base} bg-gradient-to-br from-violet-100 to-fuchsia-100`}>
        <div className="flex gap-3">
          <span className="grid size-14 place-items-center rounded-xl bg-violet-600 text-2xl font-black text-white shadow-md">
            ?
          </span>
          <span className="grid size-14 place-items-center rounded-xl bg-fuchsia-500 text-2xl shadow-md">
            🃏
          </span>
        </div>
      </div>
    );
  }

  /* Sudoku — classic grid with a few digits */
  if (slug === "sudoku") {
    return (
      <div className={`${base} bg-white`}>
        <div className="grid grid-cols-3 gap-px border-2 border-slate-800 bg-slate-800">
          {["5", "", "3", "", "7", "", "", "", "1"].map((n, i) => (
            <span
              key={i}
              className="grid size-6 place-items-center bg-white text-[11px] font-bold text-slate-800"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* Fallback */
  return (
    <div className={`${base} bg-gradient-to-br from-emerald-100 to-teal-100`}>
      <span className="text-5xl transition group-hover:scale-110">{game.emoji}</span>
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
