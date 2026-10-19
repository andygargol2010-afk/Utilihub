/** Spanish footer — plain anchors only (same hydration rule as SiteFooter). */
const FEATURED = [
  { href: "/es/finanzas", label: "Finanzas" },
  { href: "/es/categoria/texto", label: "Texto" },
  { href: "/es/categoria/diseno", label: "Diseño y color" },
  { href: "/es/categoria/seguridad", label: "Seguridad" },
] as const;

const INFO = [
  { href: "/es/herramientas", label: "Todas las herramientas" },
  { href: "/es/juegos", label: "Juegos" },
  { href: "/es/simuladores", label: "Simuladores" },
  { href: "/es/kits", label: "Kits por objetivo" },
  { href: "/es/hubs/documentos-y-archivos", label: "Documentos y archivos" },
  { href: "/es/acerca", label: "Acerca de" },
  { href: "/es/aviso-legal", label: "Aviso legal" },
  { href: "/es/privacidad", label: "Privacidad" },
  { href: "/es/cookies", label: "Política de Cookies" },
  { href: "/es/terminos", label: "Términos de Uso" },
  { href: "/es/contacto", label: "Contacto" },
  { href: "/", label: "Versión en inglés" },
] as const;

export function SpanishSiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-surface/55">
      <div className="container-page grid gap-10 py-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:py-12">
        <div>
          <a href="/es" className="flex min-h-11 items-center gap-2 font-extrabold tracking-tight">
            <img
              src="/page-logo-96.webp"
              alt=""
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="brand-mark size-8"
            />
            UtiliHub
          </a>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Herramientas online gratuitas para calcular, convertir y resolver tareas sin complicaciones.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[.16em] text-primary">
            Sin registro · Privacidad local
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">Explorar</p>
          <nav aria-label="Explorar" className="mt-3 grid gap-2">
            {FEATURED.map((item) => (
              <a key={item.href} href={item.href} className="w-fit text-sm font-semibold hover:text-primary">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">UtiliHub</p>
          <nav aria-label="Información" className="mt-3 grid gap-2">
            {INFO.map((item) => (
              <a key={item.href} href={item.href} className="w-fit text-sm font-semibold hover:text-primary">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-border/70 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} UtiliHub</span>
        <span>Creado para resolver problemas, no para crearlos.</span>
      </div>
    </footer>
  );
}
