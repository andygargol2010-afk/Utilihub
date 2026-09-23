import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { SimDef, SimLocale, SimTheme } from "@/lib/simulators/catalog";
import { simName, simSummary, simTagLabel, simBadge } from "@/lib/simulators/catalog";

type Props = {
  sim: SimDef;
  locale?: SimLocale;
  children: ReactNode;
};

const THEME: Record<
  SimTheme,
  {
    page: string;
    accent: string;
    frame: string;
    glowA: string;
    glowB: string;
    wash: string;
    btnPrimary: string;
    btnActive: string;
  }
> = {
  lab: {
    page: "from-teal-50/90 via-cyan-50/40 to-background",
    accent: "text-teal-700",
    frame:
      "border-teal-400/25 bg-gradient-to-b from-[#0a1620] via-[#071018] to-[#03080c] shadow-[0_28px_70px_-24px_rgba(20,184,166,0.55),0_0_0_1px_rgba(45,212,191,0.12)]",
    glowA: "bg-teal-400/15",
    glowB: "bg-cyan-500/10",
    wash: "bg-[radial-gradient(ellipse_at_top,_rgba(45,212,191,0.14),_transparent_55%)]",
    btnPrimary:
      "bg-gradient-to-b from-teal-300 to-teal-600 text-teal-950 shadow-[0_4px_16px_rgba(20,184,166,0.4)] hover:from-teal-200 hover:to-teal-500",
    btnActive: "ring-2 ring-teal-400/60 bg-gradient-to-b from-teal-900 to-slate-950 text-teal-50",
  },
  cosmos: {
    page: "from-indigo-50/90 via-violet-50/40 to-background",
    accent: "text-violet-700",
    frame:
      "border-violet-400/25 bg-gradient-to-b from-[#0c0a1a] via-[#080614] to-[#030208] shadow-[0_28px_70px_-24px_rgba(139,92,246,0.55),0_0_0_1px_rgba(167,139,250,0.12)]",
    glowA: "bg-violet-500/15",
    glowB: "bg-fuchsia-500/10",
    wash: "bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.16),_transparent_55%)]",
    btnPrimary:
      "bg-gradient-to-b from-violet-300 to-violet-600 text-violet-950 shadow-[0_4px_16px_rgba(139,92,246,0.4)] hover:from-violet-200 hover:to-violet-500",
    btnActive: "ring-2 ring-violet-400/60 bg-gradient-to-b from-violet-900 to-slate-950 text-violet-50",
  },
  clockwork: {
    page: "from-amber-50/90 via-orange-50/30 to-background",
    accent: "text-amber-800",
    frame:
      "border-amber-500/30 bg-gradient-to-b from-[#1a1208] via-[#120c06] to-[#080502] shadow-[0_28px_70px_-24px_rgba(245,158,11,0.45),0_0_0_1px_rgba(251,191,36,0.14)]",
    glowA: "bg-amber-500/15",
    glowB: "bg-orange-600/10",
    wash: "bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.14),_transparent_55%)]",
    btnPrimary:
      "bg-gradient-to-b from-amber-300 to-amber-600 text-amber-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)] hover:from-amber-200 hover:to-amber-500",
    btnActive: "ring-2 ring-amber-400/60 bg-gradient-to-b from-amber-900 to-stone-950 text-amber-50",
  },
};

/** Chrome for graphic simulators. Ads must never sit inside children (canvas surface). */
export function SimShell({ sim, locale = "en", children }: Props) {
  const es = locale === "es";
  const hub = es ? "/es/simuladores" : "/simulators";
  const title = simName(sim, locale);
  const t = THEME[sim.theme];

  return (
    <div className={`sim-skin min-h-[70vh] bg-gradient-to-b ${t.page}`}>
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
            <p className={`text-xs font-bold uppercase tracking-[0.16em] ${t.accent}`}>
              {simTagLabel(sim.tag, locale)} · {simBadge(sim, locale)}
            </p>
            <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              <span aria-hidden className="text-3xl sm:text-4xl">
                {sim.emoji}
              </span>
              {title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">{simSummary(sim, locale)}</p>
          </div>
          <Link
            to={hub}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 px-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
          >
            {es ? "Todos los simuladores" : "All simulators"}
          </Link>
        </header>

        <div className={`relative overflow-hidden rounded-[1.75rem] border p-3 sm:p-5 ${t.frame}`}>
          <div className={`pointer-events-none absolute inset-0 ${t.wash}`} />
          <div className={`pointer-events-none absolute -left-24 top-0 h-48 w-48 rounded-full blur-3xl ${t.glowA}`} />
          <div className={`pointer-events-none absolute -right-20 bottom-0 h-44 w-44 rounded-full blur-3xl ${t.glowB}`} />
          <div className="relative" data-sim-theme={sim.theme}>
            {children}
          </div>
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
  theme = "lab",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  theme?: SimTheme;
}) {
  const t = THEME[theme];
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-bold transition disabled:opacity-50 ${t.btnPrimary}`}
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
  theme = "lab",
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
  theme?: SimTheme;
}) {
  const t = THEME[theme];
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={
        active
          ? `inline-flex min-h-10 items-center justify-center rounded-full px-3 text-sm font-semibold shadow-md ${t.btnActive}`
          : "inline-flex min-h-10 items-center justify-center rounded-full border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white/90 backdrop-blur-sm hover:bg-white/15"
      }
    >
      {children}
    </button>
  );
}
