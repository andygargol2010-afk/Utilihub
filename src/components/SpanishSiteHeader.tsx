import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const navLink = "rounded-full px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-accent";
const activeNav = { className: "bg-accent text-primary ring-1 ring-primary/70" };
const mobileLink = "min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-accent";
const mobileMuted =
  "min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground";

/** Atajos de categoría en el desplegable Explorar */
const BROWSE = [
  { href: "/es/categoria/matematicas", label: "Matemáticas" },
  { href: "/es/categoria/texto", label: "Texto" },
  { href: "/es/categoria/desarrollo", label: "Desarrollo" },
  { href: "/es/finanzas", label: "Finanzas" },
] as const;

export function SpanishSiteHeader() {
  const [open, setOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const browseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!browseOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (browseRef.current && !browseRef.current.contains(e.target as Node)) {
        setBrowseOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBrowseOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [browseOpen]);

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/es" className="brand-lockup flex min-h-11 min-w-0 items-center gap-2.5" aria-label="Inicio de UtiliHub">
          <img src="/utilihub-logo.svg" alt="" className="brand-mark size-9 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold tracking-tight">UtiliHub</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground sm:block">
              Resuélvelo en segundos
            </span>
          </span>
        </Link>

        <nav aria-label="Principal" className="site-nav hidden items-center gap-0.5 lg:flex">
          <Link to="/es/herramientas" className={navLink} activeProps={activeNav}>
            Herramientas
          </Link>
          <Link to="/es/kits" className={navLink} activeProps={activeNav}>
            Kits
          </Link>
          <Link to="/es/simuladores" className={navLink} activeProps={activeNav}>
            Simuladores
          </Link>
          <Link to="/es/juegos" className={navLink} activeProps={activeNav}>
            Juegos
          </Link>

          <div className="relative" ref={browseRef}>
            <button
              type="button"
              className={`inline-flex items-center gap-1 ${navLink} ${browseOpen ? "bg-accent text-primary ring-1 ring-primary/70" : ""}`}
              aria-expanded={browseOpen}
              aria-haspopup="menu"
              onClick={() => setBrowseOpen((v) => !v)}
            >
              Explorar
              <ChevronDown className={`size-3.5 transition ${browseOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {browseOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full z-50 mt-1.5 min-w-[11rem] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg"
              >
                {BROWSE.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className="block px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
                    onClick={() => setBrowseOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="my-1 border-t border-border/70" />
                <Link
                  to="/es/herramientas"
                  role="menuitem"
                  className="block px-3.5 py-2.5 text-sm font-semibold text-primary hover:bg-accent"
                  onClick={() => setBrowseOpen(false)}
                >
                  Todas las herramientas →
                </Link>
              </div>
            )}
          </div>

          <LanguageSwitcher locale="es" />
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageSwitcher locale="es" />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl border border-border bg-card shadow-sm"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Menú móvil" className="border-t border-border bg-background lg:hidden">
          <div className="container-page grid gap-1 py-2">
            <Link to="/es" onClick={() => setOpen(false)} className={mobileLink}>
              Inicio
            </Link>
            <Link to="/es/herramientas" onClick={() => setOpen(false)} className={mobileLink}>
              Herramientas
            </Link>
            <Link to="/es/kits" onClick={() => setOpen(false)} className={mobileLink}>
              Kits
            </Link>
            <Link to="/es/simuladores" onClick={() => setOpen(false)} className={mobileLink}>
              Simuladores
            </Link>
            <Link to="/es/juegos" onClick={() => setOpen(false)} className={mobileLink}>
              Juegos
            </Link>
            <p className="mt-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Categorías
            </p>
            {BROWSE.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className={mobileMuted}>
                {item.label}
              </a>
            ))}
            <a href="/es/hubs/documentos-y-archivos" onClick={() => setOpen(false)} className={mobileMuted}>
              Documentos
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
