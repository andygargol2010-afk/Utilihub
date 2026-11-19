import { createFileRoute, Link } from "@tanstack/react-router";
import { AuroraNameFlow } from "@/components/playgrounds/AuroraNameFlow";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Flujo de Nombre Aurora | UtiliHub";
const description = cleanDescription(
  "Escribí un nombre o frase corta. Las partículas y cintas de luz forman las letras en una aurora fluida. El mouse o toque agita el flujo, dobla las cintas y crea rastros de luz temporales. Ajustá densidad, velocidad y ánimos de aurora. Enlace compartible, botones sociales y descarga PNG.",
);

export const Route = createFileRoute("/es/aurora")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/aurora") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/aurora") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/aurora") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/aurora") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/aurora") },
    ],
  }),
  component: AuroraPageEs,
});

function AuroraPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Experiencia · Compartible</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Flujo de Nombre Aurora</h1>
        <p className="mt-3 text-muted-foreground">
          Escribí un nombre o frase corta. Las partículas y cintas de luz <strong className="font-semibold text-foreground">forman las letras en una aurora fluida</strong>. El mouse o toque agita el flujo, dobla las cintas y crea rastros de luz temporales.
          Ajustá densidad, velocidad de flujo y ánimos de aurora — luego compartí el enlace o descargá un PNG.
        </p>
      </header>
      <AuroraNameFlow locale="es" />
      <section className="mt-10">
        <h2 className="text-lg font-bold">Seguí explorando</h2>
        <Link to="/es/experiences" className="mt-3 inline-block text-sm font-bold text-cyan-700 hover:underline">
          Hub de Experiencias →
        </Link>
      </section>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
