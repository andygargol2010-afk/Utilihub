// Part 2 of 3 — split from SimShell.tsx on 2026-11-04. Edit here; SimShell.tsx re-exports.
import { Link } from "@tanstack/react-router";
import { simName, simSummary, simTagLabel, simBadge, relatedSims } from "@/lib/simulators/catalog";
import { type Props, THEME } from "./SimShell.part1";

/** Chrome for graphic simulators. Ads must never sit inside children (canvas surface). */
export function SimShell({ sim, locale = "en", children }: Props) {
  const es = locale === "es";
  const hub = es ? "/es/simuladores" : "/simulators";
  const title = simName(sim, locale);
  const t = THEME[sim.theme];
  const related = relatedSims(sim);
  const next = related[0];

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

        {next && (
          <section className="mt-6 rounded-2xl border border-primary/20 bg-accent/40 p-4 sm:p-5">
            <p className={`text-xs font-bold uppercase tracking-[.14em] ${t.accent}`}>
              {es ? "Siguiente simulador recomendado" : "Recommended next simulator"}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {es
                    ? `Después de ${title}, probá ${next.nameEs}`
                    : `After ${title}, try ${next.nameEn}`}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {es ? next.summaryEs : next.summaryEn}
                </p>
              </div>
              <Link
                to={es ? `/es/simuladores/${next.slugEs}` : `/simulators/${next.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
              >
                {es ? "Abrir siguiente" : "Open next"}
              </Link>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={es ? `/es/simuladores/${r.slugEs}` : `/simulators/${r.slug}`}
                    className="flex min-h-11 items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/40"
                  >
                    <span aria-hidden>{r.emoji}</span>
                    {es ? r.nameEs : r.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {es
            ? "Simulación didáctica en tu navegador. No hace falta cuenta."
            : "Educational simulation in your browser. No account needed."}
        </p>
      </div>
    </div>
  );
}
