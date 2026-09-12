import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function SpanishSiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header sticky top-0 z-50">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/es" className="brand-lockup flex min-h-11 min-w-0 items-center gap-2.5" aria-label="Inicio de UtiliHub">
          <img src="/utilihub-logo.svg" alt="" className="brand-mark size-9 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold tracking-tight">UtiliHub</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground sm:block">Resuélvelo en segundos</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="site-nav hidden items-center gap-0.5 lg:flex">
          <Link to="/es" className="rounded-full px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-accent" activeOptions={{ exact: true }} activeProps={{ className: "bg-accent text-primary ring-1 ring-primary/70" }}>Inicio</Link>
          <Link to="/es/herramientas" className="rounded-full px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-accent" activeProps={{ className: "bg-accent text-primary ring-1 ring-primary/70" }}>Herramientas</Link>
          <Link to="/es/finanzas" className="rounded-full px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-accent" activeProps={{ className: "bg-accent text-primary ring-1 ring-primary/70" }}>Finanzas</Link>
          <LanguageSwitcher locale="es" />
        </nav>

        {/* Mobile: language always visible next to menu */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageSwitcher locale="es" />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl border border-border bg-card shadow-sm"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Menú móvil" className="border-t border-border bg-background lg:hidden">
          <div className="container-page grid gap-1 py-2">
            <Link to="/es" onClick={() => setOpen(false)} className="min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-accent">Inicio</Link>
            <Link to="/es/herramientas" onClick={() => setOpen(false)} className="min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-accent">Herramientas</Link>
            <Link to="/es/finanzas" onClick={() => setOpen(false)} className="min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-accent">Finanzas</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
