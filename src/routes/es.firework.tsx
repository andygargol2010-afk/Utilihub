import { createFileRoute, Link } from "@tanstack/react-router";
import { FireworkSignature } from "@/components/playgrounds/FireworkSignature";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Firma de Fuegos Artificiales | UtiliHub";
const description = cleanDescription(
  "Escribí un nombre o frase corta. Los fuegos artificiales se lanzan, forman las letras y explotan en una constelación de colores única. Ajustá tamaño de estallido, densidad de chispas y ánimo. Enlace compartible, botones sociales y descarga PNG.",
);

export const Route = createFileRoute("/es/firework")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/firework") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/firework") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/firework") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/firework") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/firework") },
    ],
  }),
  component: FireworkPageEs,
});

function FireworkPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Experiencia · Compartible</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Firma de Fuegos Artificiales</h1>
        <p className="mt-3 text-muted-foreground">
          Escribí un nombre o frase corta. Las partículas <strong className="font-semibold text-foreground">se lanzan como fuegos artificiales que forman las letras</strong> y luego explotan en una constelación de colores única.
          Ajustá el tamaño de estallido, densidad de chispas y colores de ánimo — luego compartí el enlace o descargá un PNG.
        </p>
      </header>
      <FireworkSignature locale="es" />
      <section className="mt-10">
        <h2 className="text-lg font-bold">Seguí explorando</h2>
        <Link to="/es/experiences" className="mt-3 inline-block text-sm font-bold text-amber-700 hover:underline">
          Hub de Experiencias →
        </Link>
      </section>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
