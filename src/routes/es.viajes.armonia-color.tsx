import { createFileRoute } from "@tanstack/react-router";
import { ColorHarmonyJourney } from "@/components/journeys/ColorHarmonyJourney";
import { absoluteUrl, hreflangLinks, ogImage, SITE_NAME, cleanDescription } from "@/lib/seo";

const title = "Viaje de armonía de color | UtiliHub";
const description = cleanDescription("Constructor interactivo multi-paso de paleta. Elegí color base y tipo de armonía — complementaria, análoga o triádica. Visualización en vivo HEX y HSL.");

export const Route = createFileRoute("/es/viajes/armonia-color")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/viajes/armonia-color") },
      { property: "og:image", content: ogImage() },
      { property: "og:site_name", content: SITE_NAME },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/viajes/armonia-color") },
      ...hreflangLinks("/journeys/color-harmony", "/es/viajes/armonia-color"),
    ],
  }),
  component: ArmoniaColorPage,
});

function ArmoniaColorPage() {
  return (
    <main className="container-page py-8">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Viaje</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Armonía de color</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Construí una paleta en dos pasos. La previsualización se actualiza en vivo al cambiar el color base o el tipo de armonía.
        </p>
      </header>
      <ColorHarmonyJourney locale="es" />
    </main>
  );
}
