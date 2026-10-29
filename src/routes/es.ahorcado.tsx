import { createFileRoute } from "@tanstack/react-router";
import { GameShell } from "@/components/games/GameShell";
import { GamePlayer } from "@/components/games/registry";
import { gameBySlug } from "@/lib/games/catalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const game = gameBySlug("ahorcado", "es")!;

export const Route = createFileRoute("/es/ahorcado")({
  head: () => {
    const title = `${game.nameEs} — juego online gratis | UtiliHub`;
    const description = cleanDescription(game.summaryEs);
    const url = absoluteUrl("/es/ahorcado");
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
        { rel: "alternate", hrefLang: "en", href: absoluteUrl("/hangman") },
        { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/hangman") },
      ],
    };
  },
  component: AhorcadoPage,
});

function AhorcadoPage() {
  return (
    <>
      <GameShell game={game} locale="es">
        <GamePlayer game={game} locale="es" />
      </GameShell>
      <div className="container-page pb-6">
        <PlaygroundNextStep currentId="hangman" locale="es" />
      </div>
      <div className="container-page pb-10">
        <AdsterraBanner />
      </div>
    </>
  );
}
