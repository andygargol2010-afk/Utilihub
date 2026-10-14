import { createFileRoute } from "@tanstack/react-router";
import { KaleidoscopeMandalaStudio } from "@/components/playgrounds/KaleidoscopeMandalaStudio";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Estudio de Mandalas Caleidoscópico | UtiliHub";
const description = cleanDescription(
  "Dibujá con el mouse o el dedo y mirá cómo la simetría rotacional florece en mandalas al instante. Pinceles neón, chispas, resplandor y tinta. Exportá PNG.",
);

export const Route = createFileRoute("/es/playgrounds/kaleidoscopio-mandala")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/kaleidoscopio-mandala") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/kaleidoscopio-mandala") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/kaleidoscopio-mandala") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/kaleidoscope-mandala") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/kaleidoscope-mandala") },
    ],
  }),
  component: KaleidoscopePageEs,
});

function KaleidoscopePageEs() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Estudio de Mandalas Caleidoscópico</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Dibujá libremente. Cada trazo se refleja en tiempo real con simetría rotacional de 4, 6 u 8 pliegues — mandalas que florecen al instante. Cambiá pinceles y colores en vivo. Exportá PNG de alta resolución o compartí.
        </p>
      </header>
      <KaleidoscopeMandalaStudio locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
