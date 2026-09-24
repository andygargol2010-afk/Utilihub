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

/** Classic-inspired card thumbnails — readable, balanced, no noisy animation */
function GamePreview({ game }: { game: GameDef }) {
  const shell =
    "relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl";
  const slug = game.slug;

  if (slug === "pacman") {
    return (
      <div className={`${shell} bg-[#0a0a2e]`}>
        <svg viewBox="0 0 120 80" className="h-20 w-[7.5rem]" aria-hidden>
          {/* dots */}
          <circle cx="72" cy="40" r="3.5" fill="#FFB8AE" />
          <circle cx="88" cy="40" r="3.5" fill="#FFB8AE" />
          <circle cx="104" cy="40" r="3.5" fill="#FFB8AE" />
          {/* Pac-Man body (wedge) */}
          <path
            d="M40 40 L62 18 A28 28 0 1 0 62 62 Z"
            fill="#FFCC00"
          />
          {/* eye */}
          <circle cx="38" cy="28" r="3.2" fill="#0a0a2e" />
        </svg>
      </div>
    );
  }

  if (slug === "tetris") {
    const C = [
      "#00f0f0",
      "#a000f0",
      "#f0f000",
      "#00f000",
      "#f0a000",
      "#f00000",
      "#0000f0",
    ];
    // 4x4 mini stack
    const grid = [
      null, 1, null, null,
      0, 1, 2, null,
      0, 3, 4, 5,
      0, 3, 4, 5,
    ];
    return (
      <div className={`${shell} bg-[#0d1117]`}>
        <div className="grid grid-cols-4 gap-[3px]">
          {grid.map((c, i) => (
            <span
              key={i}
              className="size-[18px] rounded-[2px]"
              style={{
                background: c === null ? "transparent" : C[c],
                boxShadow: c === null ? undefined : "inset 0 1px 0 rgba(255,255,255,.35)",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (slug === "snake") {
    return (
      <div className={`${shell} bg-[#0f3d1f]`}>
        <div className="flex items-center gap-[3px]">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={
                i === 0
                  ? "size-4 rounded-full bg-[#7CFC00] ring-2 ring-[#b8ff6a]"
                  : "size-3.5 rounded-sm bg-[#4ade80]"
              }
            />
          ))}
          <span className="ml-2 size-3.5 rounded-full bg-[#ff4d4d] shadow-[0_0_8px_#ff4d4d]" />
        </div>
      </div>
    );
  }

  if (slug === "pong") {
    return (
      <div className={`${shell} bg-black`}>
        <div className="relative h-[72px] w-[140px]">
          <span className="absolute left-0 top-[18px] h-9 w-[5px] rounded-sm bg-white" />
          <span className="absolute right-0 top-[28px] h-9 w-[5px] rounded-sm bg-white" />
          <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          <span className="absolute left-1/2 top-1 h-[calc(100%-8px)] w-px -translate-x-1/2 border-l border-dashed border-white/35" />
        </div>
      </div>
    );
  }

  if (slug === "2048") {
    const tiles = [
      { n: "2", bg: "#eee4da", fg: "#776e65" },
      { n: "4", bg: "#ede0c8", fg: "#776e65" },
      { n: "8", bg: "#f2b179", fg: "#f9f6f2" },
      { n: "16", bg: "#f59563", fg: "#f9f6f2" },
    ];
    return (
      <div className={`${shell} bg-[#bbada0]`}>
        <div className="grid grid-cols-2 gap-1.5 p-1">
          {tiles.map((t) => (
            <span
              key={t.n}
              className="grid size-12 place-items-center rounded-md text-[15px] font-black shadow-sm"
              style={{ background: t.bg, color: t.fg }}
            >
              {t.n}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (slug === "minesweeper") {
    const cells: (string | number | null)[] = [1, null, null, null, "mine", 2, null, 1, null];
    return (
      <div className={`${shell} bg-[#9e9e9e]`}>
        <div
          className="grid grid-cols-3 gap-0 border-2 p-0.5"
          style={{ borderColor: "#fff #808080 #808080 #fff" }}
        >
          {cells.map((c, i) => {
            const raised = c === null;
            return (
              <span
                key={i}
                className="grid size-8 place-items-center text-sm font-bold"
                style={{
                  background: "#c0c0c0",
                  border: raised
                    ? "2px solid"
                    : "1px solid #808080",
                  borderColor: raised
                    ? "#fff #808080 #808080 #fff"
                    : "#808080",
                  color: c === 1 ? "#0000ff" : c === 2 ? "#008000" : undefined,
                }}
              >
                {c === "mine" ? (
                  <span className="text-base leading-none">●</span>
                ) : c === null ? (
                  ""
                ) : (
                  c
                )}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (slug === "tic-tac-toe") {
    const board = ["X", "O", "", "O", "X", "", "", "", "X"];
    return (
      <div className={`${shell} bg-[#f1f5f9]`}>
        <div className="grid grid-cols-3 gap-0 rounded-md border-2 border-slate-500 bg-white shadow-sm">
          {board.map((v, i) => (
            <span
              key={i}
              className="grid size-9 place-items-center border border-slate-300 text-lg font-black"
            >
              {v === "X" && <span className="text-slate-800">✕</span>}
              {v === "O" && <span className="text-rose-500">○</span>}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (slug === "connect-four") {
    // 3 rows x 5 cols simplified board
    const row = (colors: (string | null)[]) =>
      colors.map((c, i) => (
        <span
          key={i}
          className="size-[18px] rounded-full"
          style={{ background: c ?? "#0c1a4a" }}
        />
      ));
    return (
      <div className={`${shell} bg-[#1d4ed8]`}>
        <div className="rounded-lg bg-[#1e3a8a] p-2 shadow-inner">
          <div className="grid grid-cols-5 gap-1">
            {row([null, null, null, null, null])}
            {row([null, "#ef4444", "#ef4444", "#facc15", null])}
            {row(["#ef4444", "#facc15", "#ef4444", "#facc15", "#ef4444"])}
          </div>
        </div>
      </div>
    );
  }

  if (slug === "memory") {
    return (
      <div className={`${shell} bg-gradient-to-br from-violet-100 to-fuchsia-50`}>
        <div className="flex gap-3">
          <span className="grid h-16 w-12 place-items-center rounded-xl bg-violet-600 text-2xl font-black text-white shadow-lg ring-2 ring-violet-300/50">
            ?
          </span>
          <span className="grid h-16 w-12 place-items-center rounded-xl bg-fuchsia-500 text-2xl shadow-lg ring-2 ring-fuchsia-300/50">
            ♠
          </span>
        </div>
      </div>
    );
  }

  if (slug === "sudoku") {
    const nums = ["5", "", "3", "", "7", "", "", "", "1", "6", "", "", "1", "9", "5", "", "", ""];
    return (
      <div className={`${shell} bg-slate-100`}>
        <div className="grid grid-cols-3 gap-px border-2 border-slate-800 bg-slate-800 shadow-sm">
          {nums.slice(0, 9).map((n, i) => (
            <span
              key={i}
              className="grid size-7 place-items-center bg-white text-xs font-bold text-slate-800"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${shell} bg-gradient-to-br from-emerald-100 to-teal-50`}>
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
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{es ? "Juegos" : "Games"}</h1>
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
