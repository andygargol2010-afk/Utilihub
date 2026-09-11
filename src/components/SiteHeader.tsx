import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { ALL_CATEGORIES } from "@/lib/all-tools";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);

  const acknowledgeNavigation = (href: string) => {
    setPendingNav(href);
    window.setTimeout(() => {
      setPendingNav(current => current === href ? null : current);
    }, 1500);
  };

  const navClass = (href: string, base: string) => `${base}${pendingNav === href ? " nav-clicked" : ""}`;

  return <header className="site-header sticky top-0 z-50">
    <div className="container-page flex h-16 items-center justify-between gap-4">
      <Link to="/" className="brand-lockup flex min-h-11 items-center gap-2.5" aria-label="UtiliHub home"><img src="/utilihub-logo.svg" alt="" className="brand-mark size-9" /><span><span className="block text-base font-extrabold tracking-tight">UtiliHub</span><span className="hidden text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground sm:block">Solve it in seconds</span></span></Link>
      <nav aria-label="Main" className="site-nav hidden items-center gap-0.5 lg:flex">
        <Link to="/herramientas" onClick={() => acknowledgeNavigation("/herramientas")} className={navClass("/herramientas", "rounded-full px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-accent")} activeProps={{ className: "bg-accent text-primary ring-1 ring-primary/70" }}>Tools</Link>
        <Link to="/kits" onClick={() => acknowledgeNavigation("/kits")} className={navClass("/kits", "rounded-full px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-accent")} activeProps={{ className: "bg-accent text-primary ring-1 ring-primary/70" }}>Kits</Link>
        <Link to="/hubs/documentos-y-archivos" onClick={() => acknowledgeNavigation("/hubs/documentos-y-archivos")} className={navClass("/hubs/documentos-y-archivos", "rounded-full px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-accent")} activeProps={{ className: "bg-accent text-primary ring-1 ring-primary/70" }}>Documents</Link>
        <Link to="/finanzas" onClick={() => acknowledgeNavigation("/finanzas")} className={navClass("/finanzas", "rounded-full px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-accent")} activeProps={{ className: "bg-accent text-primary ring-1 ring-primary/70" }}>Finance</Link>
        {ALL_CATEGORIES.filter(c => c.slug !== "finanzas").slice(0, 4).map(c => {
          const href = `/categoria/${c.slug}`;
          return <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} onClick={() => acknowledgeNavigation(href)} className={navClass(href, "rounded-full px-3.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground")} activeProps={{ className: "bg-accent text-primary ring-1 ring-primary/70" }}>{c.name}</Link>;
        })}
      </nav>
      <button type="button" className="grid size-11 place-items-center rounded-xl border border-border bg-card shadow-sm lg:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(v => !v)}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
    </div>
    {open && <nav aria-label="Mobile" className="border-t border-border bg-background lg:hidden"><div className="container-page grid gap-1 py-2"><Link to="/herramientas" onClick={() => { acknowledgeNavigation("/herramientas"); setOpen(false); }} className={navClass("/herramientas", "min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-accent")} activeProps={{ className: "bg-accent text-primary" }}>Browse all tools</Link><Link to="/kits" onClick={() => { acknowledgeNavigation("/kits"); setOpen(false); }} className={navClass("/kits", "min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-accent")} activeProps={{ className: "bg-accent text-primary" }}>Goal-based kits</Link><Link to="/hubs/documentos-y-archivos" onClick={() => { acknowledgeNavigation("/hubs/documentos-y-archivos"); setOpen(false); }} className={navClass("/hubs/documentos-y-archivos", "min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-accent")} activeProps={{ className: "bg-accent text-primary" }}>Documents & files</Link>{ALL_CATEGORIES.map(c => { const href = `/categoria/${c.slug}`; return <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} onClick={() => { acknowledgeNavigation(href); setOpen(false); }} className={navClass(href, "min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-accent")} activeProps={{ className: "bg-accent text-primary" }}>{c.name}</Link>; })}</div></nav>}
  </header>;
}
