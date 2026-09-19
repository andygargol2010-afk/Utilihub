import { createFileRoute, Link } from "@tanstack/react-router";
import { GAMES, gameSummary, tagLabel } from "@/lib/games/catalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Juegos online gratis | UtiliHub";
const description = cleanDescription(
  "Jugá 2048, Tres en raya, Snake, Memoria, Buscaminas, Conecta 4, Pong y Sudoku en el navegador. Sin registro, todo local.",
);

export const Route = createFileRoute("/es/juegos/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/juegos") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/juegos") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/juegos") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/games") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/games") },
    ],
  }),
  component: GamesHubEs,
});

function GamesHubEs() {
  return (
    <div className="games-skin min-h-[70vh] bg-gradient-to-b from-emerald-50/80 via-background to-background">
      <div className="container-page py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Arcade · Puzzle · Tablero</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Juegos</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Ocho clásicos que corren en tu navegador. Sin instalaciones ni cuentas: solo jugar.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((game) => (
            <Link
              key={game.slugEs}
              to="/es/juegos/$slug"
              params={{ slug: game.slugEs }}
              className="group flex flex-col rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden>
                {game.emoji}
              </span>
              <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-emerald-700/80">
                {tagLabel(game.tag, "es")}
              </span>
              <span className="mt-1 text-lg font-bold text-slate-900 group-hover:text-emerald-800">{game.nameEs}</span>
              <span className="mt-2 flex-1 text-sm text-slate-600">{gameSummary(game, "es")}</span>
              <span className="mt-4 text-sm font-bold text-emerald-700">Jugar →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
