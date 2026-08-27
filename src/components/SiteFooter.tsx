import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return <footer className="mt-12 border-t border-border/70 bg-surface/45">
    <div className="container-page flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
      <Link to="/" className="flex min-h-11 items-center gap-2 font-extrabold tracking-tight" aria-label="UtiliHub inicio"><span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground">U</span><span>UtiliHub</span></Link>
      <nav aria-label="Información legal" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
        <Link to="/" className="min-h-11 inline-flex items-center hover:text-primary">Aviso legal</Link>
        <Link to="/" className="min-h-11 inline-flex items-center hover:text-primary">Privacidad</Link>
        <Link to="/" className="min-h-11 inline-flex items-center hover:text-primary">Contacto</Link>
      </nav>
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} UtiliHub</p>
    </div>
  </footer>;
}
