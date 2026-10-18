import { createFileRoute } from "@tanstack/react-router";
import { WaypointRiverComposer } from "@/components/journeys/WaypointRiverComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Waypoint River Composer | UtiliHub";
const description = cleanDescription(
  "Place sequential waypoints on a canvas to compose a flowing light-river journey. Animated particles travel the path with color gradients by stage. Touch-friendly visual progression.",
);

export const Route = createFileRoute("/journeys/waypoint-river-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/journeys/waypoint-river-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/journeys/waypoint-river-composer") },
      ...hreflangLinks("/journeys/waypoint-river-composer", "/es/viajes/compositor-rio-waypoints"),
    ],
  }),
  component: WaypointRiverPage,
});

function WaypointRiverPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Journey · Progression</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Waypoint River Composer</h1>
        <p className="mt-3 text-muted-foreground">
          Place sequential waypoints to compose a progressive light-river. Particles travel the path with stage-based color gradients for a strong sense of forward motion and visual payoff.
        </p>
      </header>
      <WaypointRiverComposer locale="en" />

      <PlaygroundNextStep currentId="waypoint-river-composer" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
