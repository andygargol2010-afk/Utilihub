import { Link } from "@tanstack/react-router";
import { ALL_CATEGORIES, ALL_TOOLS } from "@/lib/all-tools";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/70">
      <div className="container-page grid gap-12 py-14 md:grid-cols-[1.4fr_.8fr_1.8fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">U</span>
            <span className="text-lg font-extrabold tracking-tight">UtiliHub</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Herramientas web rápidas para cálculos, conversiones, texto y tareas cotidianas. Sin registro y sin complicaciones.
          </p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[.16em] text-foreground/70">Categorías</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {ALL_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to="/categoria/$slug" params={{ slug: c.slug }} className="hover:text-primary">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[.16em] text-foreground/70">Herramientas populares</h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
            {ALL_TOOLS.slice(0, 12).map((t) => (
              <li key={t.slug}>
                <Link to="/herramientas/$slug" params={{ slug: t.slug }} className="hover:text-primary">{t.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground">
          <p>UtiliHub · Hecho para resolver cosas, no para complicarlas.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacidad" className="font-semibold hover:text-primary">Privacidad</Link>
            <Link to="/herramientas" className="font-semibold hover:text-primary">Ver todas →</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
