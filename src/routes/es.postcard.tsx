import { createFileRoute, Link } from "@tanstack/react-router";
import { ParticlePostcard } from "@/components/playgrounds/ParticlePostcard";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Postal de Partículas | UtiliHub";
const description = cleanDescription(
  "Escribí un mensaje corto. Las partículas se agrupan para formar texto brillante. Ajustá densidad, fuerza y colores de ánimo. Enlace compartible, botones sociales y descarga PNG.",
);

export const Route = createFileRoute("/es/postcard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/postcard") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/postcard") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/postcard") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/postcard") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/postcard") },
    ],
  }),
  component: PostcardPageEs,
});

function PostcardPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Experiencia · Compartible</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Postal de Partículas</h1>
        <p className="mt-3 text-muted-foreground">
          Escribí un mensaje corto. Las partículas <strong className="font-semibold text-foreground">se agrupan para formar el texto</strong> con estelas brillantes.
          Ajustá densidad, fuerza del enjambre y colores de ánimo — luego compartí el enlace o descargá un PNG.
        </p>
      </header>
      <ParticlePostcard locale="es" />
      <section className="mt-10">
        <h2 className="text-lg font-bold">Seguí explorando</h2>
        <Link to="/es/experiences" className="mt-3 inline-block text-sm font-bold text-violet-700 hover:underline">
          Hub de Experiencias →
        </Link>
      </section>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
