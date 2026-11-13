import { createFileRoute, notFound } from "@tanstack/react-router";
import { GameShell } from "@/components/games/GameShell";
import { GamePlayer } from "@/components/games/registry";
import { gameBySlug, gameName, gameSummary } from "@/lib/games/catalog";
import { absoluteUrl, cleanDescription, interactiveAppJsonLd, ogImage, SITE_NAME } from "@/lib/seo";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

export const Route = createFileRoute("/es/juegos/$slug")({
  loader: ({ params }) => {
    const game = gameBySlug(params.slug, "es");
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Juego no encontrado | UtiliHub" }, { name: "robots", content: "noindex" }] };
    const { game } = loaderData;
    const title = `${gameName(game, "es")} — juego online gratis | UtiliHub`;
    const description = cleanDescription(`${gameSummary(game, "es").replace(/[.\s]+$/, "")}. Juega gratis en el navegador: sin descargas ni registro.`);
    const url = absoluteUrl(`/es/juegos/${game.slugEs}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "es_ES" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:image", content: ogImage() },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "es", href: url },
        { rel: "alternate", hrefLang: "en", href: absoluteUrl(`/games/${game.slug}`) },
        { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(`/games/${game.slug}`) },
      ],
      scripts: [
        interactiveAppJsonLd({
          kind: "game",
          name: gameName(game, "es"),
          description,
          path: `/es/juegos/${game.slugEs}`,
          locale: "es",
          breadcrumbs: [{ name: "Inicio", path: "/es" }, { name: "Juegos", path: "/es/juegos" }, { name: gameName(game, "es") }],
        }),
      ],
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
      <div className="container-page pb-6">
        <PlaygroundNextStep currentId={game.slug} locale="es" />
      </div>
      <div className="container-page pb-10">
        <AdsterraBanner label="Publicidad" />
      </div>
    </>
  );
}
