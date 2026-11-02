import { createFileRoute } from "@tanstack/react-router";
import { GamesCatalog } from "@/components/games/GamesCatalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Jogos online grátis | UtiliHub";
const description = cleanDescription(
  "Jogue Tetris, Pac-Man, 2048, Snake, Pong, Sudoku, Campo Minado e mais no navegador. Sem cadastro, tudo local.",
);

export const Route = createFileRoute("/pt/jogos/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/jogos") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/jogos") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/jogos") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/games") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/juegos") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/games") },
    ],
  }),
  component: GamesHubPt,
});

function GamesHubPt() {
  return <GamesCatalog locale="pt" />;
}
