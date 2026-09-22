import { Link } from "@tanstack/react-router";
import { GAMES, gameName, gamePath } from "@/lib/games/catalog";

export function SpanishSiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-surface/55">
      <div className="container-page grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:py-12">
        <div>
          <Link to="/es" className="flex min-h-11 items-center gap-2 font-extrabold tracking-tight">
            <img src="/utilihub-logo.svg" alt="" className="brand-mark size-8" />
            UtiliHub
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Herramientas online gratuitas para calcular, convertir y resolver tareas sin complicaciones.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[.16em] text-primary">Sin registro · Privacidad local</p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">Explorar</p>
          <nav aria-label="Explorar" className="mt-3 grid gap-2">
            <Link to="/es/finanzas" className="w-fit text-sm font-semibold hover:text-primary">
              Finanzas
            </Link>
            <Link to="/es/categoria/$slug" params={{ slug: "texto" }} className="w-fit text-sm font-semibold hover:text-primary">
              Texto
            </Link>
            <Link to="/es/categoria/$slug" params={{ slug: "diseno" }} className="w-fit text-sm font-semibold hover:text-primary">
              Diseño y color
            </Link>
            <Link to="/es/categoria/$slug" params={{ slug: "seguridad" }} className="w-fit text-sm font-semibold hover:text-primary">
              Seguridad
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">Juegos</p>
          <nav aria-label="Juegos" className="mt-3 grid gap-2">
            <Link to="/es/juegos" className="w-fit text-sm font-semibold hover:text-primary">
              Todos los juegos
            </Link>
            {GAMES.map((game) => (
              <a key={game.slug} href={gamePath(game, "es")} className="w-fit text-sm font-semibold hover:text-primary">
                {gameName(game, "es")}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">UtiliHub</p>
          <nav aria-label="Información" className="mt-3 grid gap-2">
            <Link to="/es/herramientas" className="w-fit text-sm font-semibold hover:text-primary">
              Todas las herramientas
            </Link>
            <Link to="/es/kits" className="w-fit text-sm font-semibold hover:text-primary">
              Kits por objetivo
            </Link>
            <Link to="/es/hubs/documentos-y-archivos" className="w-fit text-sm font-semibold hover:text-primary">
              Documentos y archivos
            </Link>
            <Link to="/es/aviso-legal" className="w-fit text-sm font-semibold hover:text-primary">
              Aviso legal
            </Link>
            <Link to="/es/privacidad" className="w-fit text-sm font-semibold hover:text-primary">
              Privacidad
            </Link>
            <Link to="/es/contacto" className="w-fit text-sm font-semibold hover:text-primary">
              Contacto
            </Link>
            <Link to="/" className="w-fit text-sm font-semibold hover:text-primary">
              Versión en inglés
            </Link>
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
