import { createFileRoute, notFound } from "@tanstack/react-router";
import { GameShell } from "@/components/games/GameShell";
import { GamePlayer } from "@/components/games/registry";
import { gameBySlug, gameName, gameSummary } from "@/lib/games/catalog";
import { absoluteUrl, cleanDescription, interactiveAppJsonLd, ogImage, SITE_NAME } from "@/lib/seo";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

export const Route = createFileRoute("/pt/jogos/$slug")({
  loader: ({ params }) => {
    const game = gameBySlug(params.slug, "pt");
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Jogo não encontrado | UtiliHub" }, { name: "robots", content: "noindex" }] };
    const { game } = loaderData;
    const title = `${gameName(game, "pt")} — jogo online grátis | UtiliHub`;
    const description = cleanDescription(`${gameSummary(game, "pt").replace(/[.\s]+$/, "")}. Jogue grátis no navegador: sem download e sem cadastro.`);
    const url = absoluteUrl(`/pt/jogos/${game.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:image", content: ogImage() },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "pt", href: url },
        { rel: "alternate", hrefLang: "en", href: absoluteUrl(`/games/${game.slug}`) },
        { rel: "alternate", hrefLang: "es", href: absoluteUrl(`/es/juegos/${game.slugEs}`) },
        { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(`/games/${game.slug}`) },
      ],
      scripts: [
        interactiveAppJsonLd({
          kind: "game",
          name: gameName(game, "pt"),
          description,
          path: `/pt/jogos/${game.slug}`,
          locale: "pt",
          breadcrumbs: [{ name: "Início", path: "/pt" }, { name: "Jogos", path: "/pt/jogos" }, { name: gameName(game, "pt") }],
        }),
      ],
    };
  },
  component: GamePagePt,
});

function GamePagePt() {
  const { game } = Route.useLoaderData();
  return (
    <>
      <GameShell game={game} locale="pt">
        <GamePlayer game={game} locale="pt" />
      </GameShell>
      <div className="container-page pb-6">
        <PlaygroundNextStep currentId={game.slug} locale="pt" />
      </div>
      <div className="container-page pb-10">
        <AdsterraBanner label="Publicidade" />
      </div>
    </>
  );
}
