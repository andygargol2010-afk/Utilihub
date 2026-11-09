import { createFileRoute, Link } from "@tanstack/react-router";
import { FluidTypeSignature } from "@/components/playgrounds/FluidTypeSignature";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Firma de Tipo Fluido | UtiliHub";
const description = cleanDescription(
  "Escribí un nombre o frase corta. Las partículas forman las letras como un fluido vivo que responde al mouse o toque (atraer o repeler). Ajustá densidad, viscosidad y ánimo. Enlace compartible, botones sociales y descarga PNG.",
);

export const Route = createFileRoute("/es/fluid-type")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/fluid-type") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/fluid-type") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/fluid-type") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/fluid-type") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/fluid-type") },
    ],
  }),
  component: FluidTypePageEs,
});

function FluidTypePageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">Experiencia · Compartible</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Firma de Tipo Fluido</h1>
        <p className="mt-3 text-muted-foreground">
          Escribí un nombre o frase corta. Las partículas <strong className="font-semibold text-foreground">forman las letras como un fluido vivo</strong> que responde al mouse o toque (modos atraer o repeler).
          Ajustá la densidad de partículas, viscosidad y ánimos de color — luego compartí el enlace o descargá un PNG.
        </p>
      </header>
      <FluidTypeSignature locale="es" />
      <section className="mt-10">
        <h2 className="text-lg font-bold">Seguí explorando</h2>
        <Link to="/es/experiences" className="mt-3 inline-block text-sm font-bold text-sky-700 hover:underline">
          Hub de Experiencias →
        </Link>
      </section>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
