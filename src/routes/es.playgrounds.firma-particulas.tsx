import { createFileRoute, Link } from "@tanstack/react-router";
import { ParticleSignaturePlayground } from "@/components/playgrounds/ParticleSignaturePlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Órbitas atrayentes | UtiliHub";
const description = cleanDescription(
  "Colocá esferas atrayentes y mirá cómo las partículas orbitan. El texto siembra el patrón inicial. Compartible y amigable en móvil.",
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
  component: OrbitasAtrayentesPageEs,
});

function OrbitasAtrayentesPageEs() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Órbitas atrayentes</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Esferas que atraen partículas. Un texto puede sembrar el patrón; el clic suma atrayentes. No forma letras —
          para eso está{" "}
          <Link to="/es/firma-visual" className="font-semibold text-primary hover:underline">
            Firma Visual
          </Link>
          .
        </p>
      </header>
      <ParticleSignaturePlayground locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
