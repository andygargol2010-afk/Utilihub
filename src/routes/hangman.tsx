import { createFileRoute } from "@tanstack/react-router";
import { GameShell } from "@/components/games/GameShell";
import { GamePlayer } from "@/components/games/registry";
import { gameBySlug } from "@/lib/games/catalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const game = gameBySlug("hangman")!;

export const Route = createFileRoute("/hangman")({
  head: () => {
    const title = `${game.nameEn} — free online game | UtiliHub`;
    const description = cleanDescription(game.summaryEn);
    const url = absoluteUrl("/hangman");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en_US" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:image", content: ogImage() },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/ahorcado") },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
    };
  },
  component: HangmanPage,
});

function HangmanPage() {
  return (
    <>
      <GameShell game={game} locale="en">
        <GamePlayer game={game} locale="en" />
      </GameShell>
      <div className="container-page pb-6">
        <PlaygroundNextStep currentId="hangman" locale="en" />
      </div>
      <div className="container-page pb-10">
        <AdsterraBanner />
      </div>
    </>
  );
}
