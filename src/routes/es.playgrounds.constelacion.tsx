import { createFileRoute } from "@tanstack/react-router";
import { ConstellationStudio } from "@/components/playgrounds/ConstellationStudio";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Estudio de Constelaciones | UtiliHub";
const description = cleanDescription(
  "Arrastrá estrellas, conectá líneas, cargá mitos y compartí tu constelación por URL. Vista previa del cielo en vivo.",
);

export const Route = createFileRoute("/es/playgrounds/constelacion")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/constelacion") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/constelacion") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/constelacion") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/constellation") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/constellation") },
    ],
  }),
  component: ConstelacionPageEs,
});

function ConstelacionPageEs() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Estudio de Constelaciones</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Arrastrá estrellas en el cielo nocturno, conectalas con líneas, cargá mitos clásicos y compartí la constelación exacta con un enlace.
        </p>
      </header>
      <ConstellationStudio locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
