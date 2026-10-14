import { createFileRoute, Link } from "@tanstack/react-router";
import { ConstellationNameMap } from "@/components/playgrounds/ConstellationNameMap";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Mapa de Nombre en Constelación | UtiliHub";
const description = cleanDescription(
  "Escribí un nombre o frase corta. Las estrellas forman las letras como una constelación viva. El mouse o toque crea pozos de gravedad que deforman las trayectorias y dibujan líneas temporales. Ajustá densidad, gravedad y ánimos del cielo. Enlace compartible, botones sociales y descarga PNG.",
);

export const Route = createFileRoute("/es/constellation")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/constellation") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/constellation") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/constellation") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/constellation") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/constellation") },
    ],
  }),
  component: ConstellationPageEs,
});

function ConstellationPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Experiencia · Compartible</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Mapa de Nombre en Constelación</h1>
        <p className="mt-3 text-muted-foreground">
          Escribí un nombre o frase corta. Las estrellas <strong className="font-semibold text-foreground">forman las letras como una constelación viva</strong>. El mouse o toque crea pozos de gravedad que deforman las trayectorias y dibujan líneas temporales.
          Ajustá la densidad de estrellas, fuerza de gravedad y ánimos del cielo — luego compartí el enlace o descargá un PNG.
        </p>
      </header>
      <ConstellationNameMap locale="es" />
      <section className="mt-10">
        <h2 className="text-lg font-bold">Seguí explorando</h2>
        <Link to="/es/experiences" className="mt-3 inline-block text-sm font-bold text-indigo-700 hover:underline">
          Hub de Experiencias →
        </Link>
      </section>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
