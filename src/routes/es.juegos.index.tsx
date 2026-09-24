import { createFileRoute } from "@tanstack/react-router";
import { GamesCatalog } from "@/components/games/GamesCatalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Juegos online gratis | UtiliHub";
const description = cleanDescription(
  "Jugá Tetris, Pac-Man, 2048, Snake, Pong, Sudoku, Buscaminas y más en el navegador. Sin registro, todo local.",
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
  return <GamesCatalog locale="es" />;
}
