import { createFileRoute } from "@tanstack/react-router";
import { WaypointRiverComposer } from "@/components/journeys/WaypointRiverComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Compositor Río de Waypoints | UtiliHub";
const description = cleanDescription(
  "Colocá waypoints secuenciales en un lienzo para componer un viaje de río de luz. Partículas animadas recorren el camino con degradados de color por etapa. Progresión visual táctil.",
);

export const Route = createFileRoute("/es/viajes/compositor-rio-waypoints")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/viajes/compositor-rio-waypoints") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/viajes/compositor-rio-waypoints") },
      ...hreflangLinks("/journeys/waypoint-river-composer", "/es/viajes/compositor-rio-waypoints"),
    ],
  }),
  component: CompositorRioPage,
});

function CompositorRioPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Viaje · Progresión</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Compositor Río de Waypoints</h1>
        <p className="mt-3 text-muted-foreground">
          Colocá waypoints secuenciales para componer un río de luz progresivo. Las partículas recorren el camino con degradados de color por etapa para una fuerte sensación de avance y recompensa visual.
        </p>
      </header>
      <WaypointRiverComposer locale="es" />

      <PlaygroundNextStep currentId="waypoint-river-composer" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
