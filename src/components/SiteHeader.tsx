import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { ALL_CATEGORIES } from "@/lib/all-tools";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header sticky top-0 z-50">
    <div className="container-page flex h-16 items-center justify-between gap-4">
      <Link to="/" className="brand-lockup flex min-h-11 items-center gap-2.5" aria-label="UtiliHub inicio"><img src="/utilihub-logo.svg" alt="" className="brand-mark size-9" /><span><span className="block text-base font-extrabold tracking-tight">UtiliHub</span><span className="hidden text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground sm:block">Resuelve en segundos</span></span></Link>
      <nav aria-label="Principal" className="site-nav hidden items-center gap-0.5 lg:flex"><Link to="/herramientas" className="rounded-full px-3.5 py-2 text-sm font-semibold hover:bg-accent">Herramientas</Link><Link to="/kits" className="rounded-full px-3.5 py-2 text-sm font-semibold text-primary hover:bg-accent">Kits</Link><Link to="/hubs/documentos-y-archivos" className="rounded-full px-3.5 py-2 text-sm font-semibold text-primary hover:bg-accent">Documentos</Link><Link to="/finanzas" className="rounded-full px-3.5 py-2 text-sm font-semibold text-primary hover:bg-accent">Finanzas</Link>{ALL_CATEGORIES.filter(c => c.slug !== "finanzas").slice(0, 4).map(c => <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} className="rounded-full px-3.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">{c.name}</Link>)}</nav>
      <button type="button" className="grid size-11 place-items-center rounded-xl border border-border bg-card shadow-sm lg:hidden" aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(v => !v)}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
    </div>
    {open && <nav aria-label="Móvil" className="border-t border-border bg-background lg:hidden"><div className="container-page grid gap-1 py-2"><Link to="/herramientas" onClick={() => setOpen(false)} className="min-h-11 rounded-lg bg-accent px-3 py-2.5 text-sm font-bold">Explorar todas las herramientas</Link><Link to="/kits" onClick={() => setOpen(false)} className="min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold text-primary hover:bg-accent">Kits por objetivo</Link><Link to="/hubs/documentos-y-archivos" onClick={() => setOpen(false)} className="min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold text-primary hover:bg-accent">Documentos y archivos</Link>{ALL_CATEGORIES.map(c => <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)} className="min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-accent">{c.name}</Link>)}</div></nav>}
  </header>;
}
