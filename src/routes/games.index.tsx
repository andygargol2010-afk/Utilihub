import { createFileRoute, Link } from "@tanstack/react-router";
import { GAMES, gameSummary, tagLabel } from "@/lib/games/catalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Free online games | UtiliHub";
const description = cleanDescription(
  "Play 2048, Tic-Tac-Toe, Snake, Memory, Minesweeper, Connect Four, Pong and Sudoku in your browser. No signup, runs locally.",
);

export const Route = createFileRoute("/games/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/games") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/games") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/games") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/juegos") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/games") },
    ],
  }),
  component: GamesHubEn,
});

function GamesHubEn() {
  return (
    <div className="games-skin min-h-[70vh] bg-gradient-to-b from-emerald-50/80 via-background to-background">
      <div className="container-page py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Arcade · Puzzle · Board</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Games</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Eight classic games that run in your browser. No installs, no accounts — just play.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((game) => (
            <Link
              key={game.slug}
              to="/games/$slug"
              params={{ slug: game.slug }}
              className="group flex flex-col rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden>
                {game.emoji}
              </span>
              <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-emerald-700/80">
                {tagLabel(game.tag, "en")}
              </span>
              <span className="mt-1 text-lg font-bold text-slate-900 group-hover:text-emerald-800">{game.nameEn}</span>
              <span className="mt-2 flex-1 text-sm text-slate-600">{gameSummary(game, "en")}</span>
              <span className="mt-4 text-sm font-bold text-emerald-700">Play →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
