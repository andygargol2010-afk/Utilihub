import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { ALL_CATEGORIES } from "@/lib/all-tools";
import { spanishCategoryName } from "@/lib/i18n/es";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const navLink = "rounded-full px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-accent";
const navLinkMuted = "rounded-full px-3.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground";
const activeNav = { className: "bg-accent text-primary ring-1 ring-primary/70" };
const mobileLink = "min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-accent";
const mobileLinkMuted = "min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-accent";

export function SpanishSiteHeader() {
  const [open, setOpen] = useState(false);
  const categoryShortcuts = ALL_CATEGORIES.filter((c) => c.slug !== "finanzas").slice(0, 4);

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
          <Link to="/es" className={navLink} activeOptions={{ exact: true }} activeProps={activeNav}>Inicio</Link>
          <Link to="/es/herramientas" className={navLink} activeProps={activeNav}>Herramientas</Link>
          <Link to="/es/kits" className={navLink} activeProps={activeNav}>Kits</Link>
          <Link to="/es/hubs/documentos-y-archivos" className={navLink} activeProps={activeNav}>Documentos</Link>
          <Link to="/es/finanzas" className={navLink} activeProps={activeNav}>Finanzas</Link>
          <Link to="/es/juegos" className={navLink} activeProps={activeNav}>Juegos</Link>
          {categoryShortcuts.map((c) => (
            <Link key={c.slug} to="/es/categoria/$slug" params={{ slug: c.slug }} className={navLinkMuted} activeProps={activeNav}>
              {spanishCategoryName(c.slug)}
            </Link>
          ))}
          <LanguageSwitcher locale="es" />
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageSwitcher locale="es" />
          <button type="button" className="grid size-11 place-items-center rounded-xl border border-border bg-card shadow-sm" aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Menú móvil" className="border-t border-border bg-background lg:hidden">
          <div className="container-page grid gap-1 py-2">
            <Link to="/es" onClick={() => setOpen(false)} className={mobileLink}>Inicio</Link>
            <Link to="/es/herramientas" onClick={() => setOpen(false)} className={mobileLink}>Todas las herramientas</Link>
            <Link to="/es/kits" onClick={() => setOpen(false)} className={mobileLink}>Kits por objetivo</Link>
            <Link to="/es/hubs/documentos-y-archivos" onClick={() => setOpen(false)} className={mobileLink}>Documentos y archivos</Link>
            <Link to="/es/finanzas" onClick={() => setOpen(false)} className={mobileLink}>Finanzas</Link>
            <Link to="/es/juegos" onClick={() => setOpen(false)} className={mobileLink}>Juegos</Link>
            {ALL_CATEGORIES.filter((c) => c.slug !== "finanzas").map((c) => (
              <Link key={c.slug} to="/es/categoria/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)} className={mobileLinkMuted}>
                {spanishCategoryName(c.slug)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
