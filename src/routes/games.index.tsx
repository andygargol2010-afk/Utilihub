import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const GamesCatalog = lazy(() =>
  import("@/components/games/GamesCatalog").then((m) => ({ default: m.GamesCatalog })),
);

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

function GamesListingSlot() {
  return (
    <div className="container-page py-8 sm:py-12" aria-busy="true">
      <div className="h-4 w-32 rounded bg-muted" />
      <div className="mt-2 h-10 w-48 max-w-full rounded bg-muted" />
      <div className="mt-3 h-5 w-96 max-w-full rounded bg-muted/70" />
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-9 w-20 rounded-full bg-muted" />
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-64 rounded-3xl border border-border/70 bg-card" />
        ))}
      </div>
    </div>
  );
}

function GamesHubEn() {
  return (
    <Suspense fallback={<GamesListingSlot />}>
      <GamesCatalog locale="en" />
    </Suspense>
  );
}
