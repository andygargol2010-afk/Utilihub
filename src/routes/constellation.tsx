import { createFileRoute, Link } from "@tanstack/react-router";
import { ConstellationNameMap } from "@/components/playgrounds/ConstellationNameMap";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Constellation Name Map | UtiliHub";
const description = cleanDescription(
  "Type a short name or phrase. Stars form the letters as a living constellation. Mouse or touch creates gravity wells that warp star paths and draw temporary constellation lines. Tune density, gravity and sky moods. Shareable link, social buttons and PNG download.",
);

export const Route = createFileRoute("/constellation")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/constellation") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/constellation") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/constellation") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/constellation") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/constellation") },
    ],
  }),
  component: ConstellationPage,
});

function ConstellationPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Experience · Shareable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Constellation Name Map</h1>
        <p className="mt-3 text-muted-foreground">
          Type a short name or phrase. Stars <strong className="font-semibold text-foreground">form the letters as a living constellation</strong>. Mouse or touch creates gravity wells that warp paths and draw temporary lines.
          Tune star density, gravity strength and sky moods — then share the link or download a PNG.
        </p>
      </header>
      <ConstellationNameMap locale="en" />

      <PlaygroundNextStep currentId="constellation-name" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
