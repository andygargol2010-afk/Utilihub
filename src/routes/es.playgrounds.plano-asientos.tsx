import { createFileRoute } from "@tanstack/react-router";
import { SeatingChartStudio } from "@/components/playgrounds/SeatingChartStudio";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Estudio de Plano de Asientos | UtiliHub";
const description = cleanDescription(
  "Plano de asientos interactivo con arrastre. Asigná invitados a mesas, mirá avisos de capacidad en vivo y compartí el arreglo completo por URL.",
);

export const Route = createFileRoute("/es/playgrounds/plano-asientos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/plano-asientos") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/plano-asientos") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/plano-asientos") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/seating-chart") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/seating-chart") },
    ],
  }),
  component: SeatingChartPageEs,
});

function SeatingChartPageEs() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Estudio</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Estudio de Plano de Asientos</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Arrastrá invitados a mesas visuales. Feedback en vivo de capacidad y avisos. Compartí el arreglo completo por URL.
        </p>
      </header>
      <SeatingChartStudio locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
