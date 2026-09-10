import { Link } from "@tanstack/react-router";
import { ALL_CATEGORIES } from "@/lib/all-tools";

export function SiteFooter() {
  const featured = ALL_CATEGORIES.filter((category) => ["finanzas", "texto", "diseno", "seguridad"].includes(category.slug));
  return <footer className="mt-16 border-t border-border/70 bg-surface/55">
    <div className="container-page grid gap-10 py-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:py-12">
      <div><Link to="/" className="flex min-h-11 items-center gap-2 font-extrabold tracking-tight"><img src="/utilihub-logo.svg" alt="" className="brand-mark size-8" />UtiliHub</Link><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Free online tools to calculate, convert, and get things done without the hassle.</p><p className="mt-4 text-xs font-semibold uppercase tracking-[.16em] text-primary">No signup · Local privacy</p></div>
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">Explore</p><nav aria-label="Featured categories" className="mt-3 grid gap-2">{featured.map((category) => <Link key={category.slug} to="/categoria/$slug" params={{ slug: category.slug }} className="w-fit text-sm font-semibold hover:text-primary">{category.name}</Link>)}</nav></div>
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">UtiliHub</p><nav aria-label="Information" className="mt-3 grid gap-2"><Link to="/herramientas" className="w-fit text-sm font-semibold hover:text-primary">All tools</Link><Link to="/kits" className="w-fit text-sm font-semibold hover:text-primary">Goal-based kits</Link><Link to="/hubs/documentos-y-archivos" className="w-fit text-sm font-semibold hover:text-primary">Documents & files</Link><Link to="/aviso-legal" className="w-fit text-sm font-semibold hover:text-primary">Legal notice</Link><Link to="/privacidad" className="w-fit text-sm font-semibold hover:text-primary">Privacy</Link><Link to="/contacto" className="w-fit text-sm font-semibold hover:text-primary">Contact</Link></nav></div>
    </div>
    <div className="container-page flex flex-col gap-2 border-t border-border/70 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} UtiliHub</span><span>Built to solve problems, not create them.</span></div>
  </footer>;
}
