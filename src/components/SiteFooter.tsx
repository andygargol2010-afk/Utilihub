export function SiteFooter() {
  return <footer className="mt-12 border-t border-border/70 bg-surface/45">
    <div className="container-page flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
      <span className="flex min-h-11 items-center gap-2 font-extrabold tracking-tight"><span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground">U</span>UtiliHub</span>
      <nav aria-label="Información" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground"><span className="min-h-11 inline-flex items-center">Aviso legal</span><span className="min-h-11 inline-flex items-center">Privacidad</span><span className="min-h-11 inline-flex items-center">Contacto</span></nav>
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} UtiliHub</p>
    </div>
  </footer>;
}
