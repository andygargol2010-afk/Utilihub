import { createFileRoute, notFound } from "@tanstack/react-router";
import { GameShell } from "@/components/games/GameShell";
import { GamePlayer } from "@/components/games/registry";
import { GameSeoFaq } from "@/components/games/GameSeoFaq";
import { gameBySlug } from "@/lib/games/catalog";
import { gameJsonLd, gameKeywords, gameMetaDescription, gameMetaTitle } from "@/lib/games/seo";
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo";
import { AdsterraBanner } from "@/components/AdsterraBanner";

export const Route = createFileRoute("/es/juegos/$slug")({
  loader: ({ params }) => {
    const game = gameBySlug(params.slug, "es");
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Juego no encontrado | UtiliHub" }, { name: "robots", content: "noindex" }] };
    const { game } = loaderData;
    const title = gameMetaTitle(game, "es");
    const description = gameMetaDescription(game, "es");
    const url = absoluteUrl(`/es/juegos/${game.slugEs}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: gameKeywords(game, "es").join(", ") },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "es_ES" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:image", content: ogImage() },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "es", href: url },
        { rel: "alternate", hrefLang: "en", href: absoluteUrl(`/games/${game.slug}`) },
        { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(`/games/${game.slug}`) },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(gameJsonLd(game, "es")) }],
    };
  },
  component: GamePageEs,
});

function GamePageEs() {
  const { game } = Route.useLoaderData();
  return (
    <>
      <GameShell game={game} locale="es">
        <GamePlayer game={game} locale="es" />
      </GameShell>
      <div className="container-page pb-10">
        <GameSeoFaq game={game} locale="es" />
        <div className="mt-6">
          <AdsterraBanner label="Publicidad" />
        </div>
      </div>
    </>
  );
}
