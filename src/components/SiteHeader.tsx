import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { ALL_CATEGORIES } from "@/lib/all-tools";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/92 backdrop-blur-lg">
    <div className="container-page flex h-14 items-center justify-between gap-3">
      <Link to="/" className="flex min-h-11 items-center gap-2" aria-label="UtiliHub inicio"><span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground">U</span><span className="text-base font-extrabold tracking-tight">UtiliHub</span></Link>
      <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex"><Link to="/herramientas" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-accent">Todas</Link><Link to="/finanzas" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-accent">Finanzas</Link>{ALL_CATEGORIES.filter(c => c.slug !== "finanzas").slice(0, 4).map(c => <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">{c.name}</Link>)}</nav>
      <button type="button" className="grid size-11 place-items-center rounded-lg border border-border bg-card lg:hidden" aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(v => !v)}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
    </div>
    {open && <nav aria-label="Móvil" className="border-t border-border bg-background lg:hidden"><div className="container-page grid gap-1 py-2">{ALL_CATEGORIES.map(c => <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)} className="min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-accent">{c.name}</Link>)}</div></nav>}
  </header>;
}
