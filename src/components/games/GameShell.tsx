import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { GameDef, GameLocale } from "@/lib/games/catalog";
import { gameName, gamePath, gameSummary, tagLabel } from "@/lib/games/catalog";

type Props = {
  game: GameDef;
  locale?: GameLocale;
  children: ReactNode;
  toolbar?: ReactNode;
  status?: ReactNode;
};

/** Arcade-style chrome. Ads must never be placed inside children (play surface). */
export function GameShell({ game, locale = "en", children, toolbar, status }: Props) {
  const es = locale === "es";
  const hub = es ? "/es/juegos" : "/games";
  const title = gameName(game, locale);

  return (
    <div className="games-skin min-h-[70vh]">
      <div className="container-page py-6 sm:py-8">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to={es ? "/es" : "/"} className="hover:text-foreground">
            {es ? "Inicio" : "Home"}
          </Link>
          <span aria-hidden>/</span>
          <Link to={hub} className="hover:text-foreground">
            {es ? "Juegos" : "Games"}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground">{title}</span>
        </nav>

        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600/90">
              {tagLabel(game.tag, locale)} · {game.emoji}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">{gameSummary(game, locale)}</p>
          </div>
          <Link
            to={hub}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            {es ? "Todos los juegos" : "All games"}
          </Link>
        </header>

        {(toolbar || status) && (
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-emerald-900/10 bg-white/80 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            {status && <div className="text-sm font-semibold tabular-nums text-slate-800">{status}</div>}
            {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
          </div>
        )}

        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-3 shadow-[0_24px_60px_-20px_rgba(6,78,59,0.65),0_0_0_1px_rgba(52,211,153,0.08)] sm:p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(52,211,153,0.14),_transparent_50%)]" />
          <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative">{children}</div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {es
            ? "Todo corre en tu navegador. No hace falta cuenta."
            : "Runs entirely in your browser. No account needed."}
        </p>
      </div>
    </div>
  );
}

export function GamePrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 text-sm font-bold text-emerald-950 shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition hover:from-emerald-300 hover:to-emerald-500 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function GameSecondaryButton({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-b from-slate-800 to-slate-950 px-3 text-sm font-semibold text-white ring-2 ring-emerald-400/50 shadow-md"
          : "inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
      }
    >
      {children}
    </button>
  );
}

export function gameHubPath(locale: GameLocale) {
  return locale === "es" ? "/es/juegos" : "/games";
}

export { gamePath };
