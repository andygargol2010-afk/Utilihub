import { createFileRoute } from "@tanstack/react-router";
import { GamesCatalog } from "@/components/games/GamesCatalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Free online games | UtiliHub";
const description = cleanDescription(
  "Play Tetris, Pac-Man, 2048, Snake, Pong, Sudoku, Minesweeper and more in your browser. No signup, runs locally.",
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
  return <GamesCatalog locale="en" />;
}
