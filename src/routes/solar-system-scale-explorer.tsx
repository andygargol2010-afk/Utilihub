import { createFileRoute } from "@tanstack/react-router";
import { SolarSystemScaleExplorer } from "@/components/playgrounds/SolarSystemScaleExplorer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Solar System Scale Explorer | UtiliHub";
const description = cleanDescription(
  "Interactive canvas to explore true relative sizes and distances of the solar system. Toggle size-only, distance-only or both scales. Drag planets, zoom and pan. Feel how far Neptune really is and how small Earth is next to Jupiter.",
);

export const Route = createFileRoute("/solar-system-scale-explorer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/solar-system-scale-explorer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/solar-system-scale-explorer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/solar-system-scale-explorer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/solar-system-scale-explorer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/solar-system-scale-explorer") },
    ],
  }),
  component: SolarSystemPage,
});

function SolarSystemPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Explorer · Educational</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Solar System Scale Explorer</h1>
        <p className="mt-3 text-muted-foreground">
          Open Canvas experience to feel the <strong className="font-semibold text-foreground">true relative sizes and distances</strong> of the solar system. Toggle between size-only, distance-only or both modes. Drag planets, zoom and pan. Labels and orbital trails help you compare Earth to Jupiter (~11× diameter) and appreciate that Neptune sits at ~30 AU.
        </p>
      </header>
      <SolarSystemScaleExplorer locale="en" />

      <section className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-bold text-foreground">Why solar system scale is hard to grasp</h2>
        <p className="mt-2">
          Most diagrams shrink the vast distances so planets fit on a page. In reality, if Earth is a marble, the Sun is a large beach ball about 15 meters away, and Neptune is roughly a kilometer further. This explorer keeps the proportions closer to reality so you can zoom in on size differences or pull back to see the emptiness of space.
        </p>
        <p className="mt-2">
          Search intents this page answers: “solar system scale”, “planet size comparison”, “how far is Neptune”, “Earth vs Jupiter size”.
        </p>
      </section>

      <PlaygroundNextStep currentId="solar-system-scale-explorer" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
