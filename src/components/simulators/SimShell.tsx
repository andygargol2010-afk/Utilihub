import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { SimDef, SimLocale } from "@/lib/simulators/catalog";
import { simName, simSummary, simTagLabel } from "@/lib/simulators/catalog";

type Props = {
  sim: SimDef;
  locale?: SimLocale;
  children: ReactNode;
};

/** Chrome for graphic simulators. Ads must never sit inside children (canvas surface). */
export function SimShell({ sim, locale = "en", children }: Props) {
  const es = locale === "es";
  const hub = es ? "/es/simuladores" : "/simulators";
  const title = simName(sim, locale);

  return (
    <div className="sim-skin min-h-[70vh]">
      <div className="container-page py-6 sm:py-8">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to={es ? "/es" : "/"} className="hover:text-foreground">
            {es ? "Inicio" : "Home"}
          </Link>
          <span aria-hidden>/</span>
          <Link to={hub} className="hover:text-foreground">
            {es ? "Simuladores" : "Simulators"}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground">{title}</span>
        </nav>

        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600/90">
              {simTagLabel(sim.tag, locale)} · {sim.emoji}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">{simSummary(sim, locale)}</p>
          </div>
          <Link
            to={hub}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            {es ? "Todos los simuladores" : "All simulators"}
          </Link>
        </header>

        <div className="relative overflow-hidden rounded-3xl border border-sky-400/15 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-3 shadow-[0_24px_60px_-20px_rgba(14,165,233,0.45),0_0_0_1px_rgba(56,189,248,0.1)] sm:p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.12),_transparent_55%)]" />
          <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative">{children}</div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {es
            ? "Simulación didáctica en tu navegador. No hace falta cuenta."
            : "Educational simulation in your browser. No account needed."}
        </p>
      </div>
    </div>
  );
}

export function SimPrimaryButton({
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
      className="inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-sky-600 px-4 text-sm font-bold text-sky-950 shadow-[0_4px_14px_rgba(14,165,233,0.35)] transition hover:from-sky-300 hover:to-sky-500 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function SimSecondaryButton({
  children,
  onClick,
  active,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={
        active
          ? "inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-b from-slate-800 to-slate-950 px-3 text-sm font-semibold text-white ring-2 ring-sky-400/50 shadow-md"
          : "inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
      }
    >
      {children}
    </button>
  );
}
