import { createFileRoute, notFound } from "@tanstack/react-router";
import { GameShell } from "@/components/games/GameShell";
import { GamePlayer } from "@/components/games/registry";
import { gameBySlug, gameName, gameSummary } from "@/lib/games/catalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { AdsterraBanner } from "@/components/AdsterraBanner";

export const Route = createFileRoute("/games/$slug")({
  loader: ({ params }) => {
    const game = gameBySlug(params.slug, "en");
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Game not found | UtiliHub" }, { name: "robots", content: "noindex" }] };
    const { game } = loaderData;
    const title = `${gameName(game, "en")} — free online game | UtiliHub`;
    const description = cleanDescription(gameSummary(game, "en"));
    const url = absoluteUrl(`/games/${game.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:image", content: ogImage() },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "es", href: absoluteUrl(`/es/juegos/${game.slugEs}`) },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
    };
  },
  component: GamePageEn,
});

function GamePageEn() {
  const { game } = Route.useLoaderData();
  return (
    <>
      <GameShell game={game} locale="en">
        <GamePlayer game={game} locale="en" />
      </GameShell>
      <div className="container-page pb-10">
        <AdsterraBanner />
      </div>
    </>
  );
}
