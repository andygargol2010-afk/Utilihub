import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, ogImage, SITE_NAME, cleanDescription } from "@/lib/seo";

const title = "Jornadas | UtiliHub";
const description = cleanDescription("Jornadas interativas multi-passo. Construa paletas de cores, planeje celebrações e mais experiências guiadas no navegador.");

export const Route = createFileRoute("/pt/jornadas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/jornadas") },
      { property: "og:image", content: ogImage() },
      { property: "og:site_name", content: SITE_NAME },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/jornadas") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/jornadas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/journeys") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/viajes") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/journeys") },
    ],
  }),
  component: JornadasIndex,
});

function JornadasIndex() {
  return (
    <main className="container-page py-8">
      <h1 className="text-3xl font-black tracking-tight">Jornadas</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Experiências guiadas multi-passo. Comece com a harmonia de cores ou planeje uma celebração.</p>
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/journeys/color-harmony"
          className="surface-card group block p-6 hover:-translate-y-0.5 hover:border-primary/40"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Cor</p>
          <h2 className="mt-1 text-xl font-black group-hover:text-primary">Jornada de Harmonia de Cores</h2>
          <p className="mt-2 text-sm text-muted-foreground">Escolha uma cor base e um tipo de harmonia. Veja a paleta ao vivo com HEX e HSL.</p>
          <span className="mt-4 inline-block text-sm font-bold text-primary">Começar jornada →</span>
        </Link>
        <Link
          to="/journeys/celebration"
          className="surface-card group block p-6 hover:-translate-y-0.5 hover:border-primary/40"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Celebração</p>
          <h2 className="mt-1 text-xl font-black group-hover:text-primary">Jornada de Celebração</h2>
          <p className="mt-2 text-sm text-muted-foreground">Planeje ocasião, convidados, orçamento, checklist e cartão de convite ao vivo. Estado compartilhável.</p>
          <span className="mt-4 inline-block text-sm font-bold text-primary">Começar jornada →</span>
        </Link>
        <Link
          to="/journeys/waypoint-river-composer"
          className="surface-card group block p-6 hover:-translate-y-0.5 hover:border-primary/40"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Progressão</p>
          <h2 className="mt-1 text-xl font-black group-hover:text-primary">Compositor Rio de Waypoints</h2>
          <p className="mt-2 text-sm text-muted-foreground">Coloque waypoints sequenciais. Partículas fluem um rio de luz com gradientes de cor por etapa.</p>
          <span className="mt-4 inline-block text-sm font-bold text-primary">Começar jornada →</span>
        </Link>
      </section>
    </main>
  );
}
