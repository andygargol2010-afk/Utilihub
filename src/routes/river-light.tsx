import { createFileRoute } from "@tanstack/react-router";
import { RiverOfLightJourney } from "@/components/playgrounds/RiverOfLightJourney";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "River of Light Journey | UtiliHub";
const description = cleanDescription(
  "Place waypoints on a dark field. A continuous glowing river of particles flows between them with persistent afterglows and soft blooms. Control speed, colors, density and loop. Shareable URL + PNG.",
);

export const Route = createFileRoute("/river-light")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/river-light") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/river-light") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/river-light") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/rio-luz") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/river-light") },
    ],
  }),
  component: RiverLightPage,
});

function RiverLightPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Journey · Shareable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">River of Light Journey</h1>
        <p className="mt-3 text-muted-foreground">
          Click to place waypoints. A continuous <strong className="font-semibold text-foreground">glowing river of particles</strong> flows between them, leaving persistent afterglows and soft blooms. Tune flow speed, core/glow colors, density and loop mode. Immediate visual payoff. Share the URL or snapshot PNG.
        </p>
      </header>
      <RiverOfLightJourney locale="en" />

      <PlaygroundNextStep currentId="river-light" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
