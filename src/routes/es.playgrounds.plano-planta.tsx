import { createFileRoute } from "@tanstack/react-router";
import { FloorPlanStudio } from "@/components/playgrounds/FloorPlanStudio";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Estudio de plano de planta | UtiliHub";
const description = cleanDescription(
  "Compositor interactivo de plano de planta 2D. Agregá, mové y rotá habitaciones y muebles. Cálculo de área en vivo, colores de paredes y enlace para compartir.",
);

export const Route = createFileRoute("/es/playgrounds/plano-planta")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/plano-planta") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/plano-planta") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/plano-planta") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/floor-plan") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/floor-plan") },
    ],
  }),
  component: PlanoPlantaPageEs,
});

function PlanoPlantaPageEs() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Estudio</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Estudio de plano de planta</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Componé habitaciones y muebles en un canvas en vivo. Arrastrá para mover, rotá, cambiá colores de paredes y mirá el área total actualizarse al instante. Compartí tu plano por URL.
        </p>
      </header>
      <FloorPlanStudio locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
