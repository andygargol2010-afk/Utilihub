import { createFileRoute, Link } from "@tanstack/react-router";
import { ParticleSignaturePlayground } from "@/components/playgrounds/ParticleSignaturePlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Firma Visual | UtiliHub";
const description = cleanDescription(
  "Escribí tu nombre y generá una firma visual única de partículas. Compartible, instantánea y lista para explorar más experiencias en UtiliHub.",
);

export const Route = createFileRoute("/es/firma-visual")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/firma-visual") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/firma-visual") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/firma-visual") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/visual-signature") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/visual-signature") },
    ],
  }),
  component: FirmaVisualPage,
});

function FirmaVisualPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 text-center sm:text-left">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Experiencia visual
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Firma Visual
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Escribí tu nombre o una frase y mirá cómo nace una firma única de partículas.
          Compartila con un enlace o seguí explorando más experiencias.
        </p>
      </header>

      <ParticleSignaturePlayground locale="es" />

      <div className="mt-8 flex flex-col items-center gap-3 sm:items-start">
        <Link
          to="/es/experiences"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Explorar más experiencias →
        </Link>
        <p className="text-xs text-muted-foreground">
          Playgrounds, simuladores, juegos y estudios interactivos.
        </p>
      </div>

      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
