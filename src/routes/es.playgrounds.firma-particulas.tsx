import { createFileRoute } from "@tanstack/react-router";
import { ParticleSignaturePlayground } from "@/components/playgrounds/ParticleSignaturePlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Firma de Partículas | UtiliHub";
const description = cleanDescription(
  "Escribí un nombre o frase para generar una firma única de partículas compartible. Miralas orbitar los atrayentes. Funciona en móvil, enlace instantáneo.",
);

export const Route = createFileRoute("/es/playgrounds/firma-particulas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/firma-particulas") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/firma-particulas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/firma-particulas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/particle-signature") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/particle-signature") },
    ],
  }),
  component: FirmaParticulasPageEs,
});

function FirmaParticulasPageEs() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Firma de Partículas</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Generá una firma visual única a partir de cualquier nombre o frase. Las partículas orbitan los atrayentes generados. Compartí el enlace.
        </p>
      </header>
      <ParticleSignaturePlayground locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
