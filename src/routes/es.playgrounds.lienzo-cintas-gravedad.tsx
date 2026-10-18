import { createFileRoute } from "@tanstack/react-router";
import { GravityRibbonCanvas } from "@/components/playgrounds/GravityRibbonCanvas";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Lienzo de Cintas de Gravedad | UtiliHub";
const description = cleanDescription(
  "Dibujá caminos libres que se convierten en cintas de gravedad. Las partículas las siguen con estelas brillantes. Ajustá atracción, velocidad y temas. Compatible con toque.",
);

export const Route = createFileRoute("/es/playgrounds/lienzo-cintas-gravedad")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/lienzo-cintas-gravedad") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/lienzo-cintas-gravedad") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/gravity-ribbon-canvas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/lienzo-cintas-gravedad") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/gravity-ribbon-canvas") },
    ],
  }),
  component: GravityRibbonPageEs,
});

function GravityRibbonPageEs() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Lienzo de Cintas de Gravedad</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Dibujá cintas libres. Las partículas se atraen hacia ellas y dejan estelas brillantes persistentes que forman firmas temporales. Varias cintas interactúan.
        </p>
      </header>
      <GravityRibbonCanvas locale="es" />

      <PlaygroundNextStep currentId="gravity-ribbon-canvas" locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
