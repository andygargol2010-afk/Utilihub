import { createFileRoute } from "@tanstack/react-router";
import { GravityParticlesPlayground } from "@/components/playgrounds/GravityParticlesPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Playground de partículas de gravedad | UtiliHub";
const description = cleanDescription(
  "Hacé clic para colocar atrayentes y mirá cómo las partículas orbitan en tiempo real. Ajustá la fuerza de gravedad y la cantidad. Compartible, amigable en móvil.",
);

export const Route = createFileRoute("/es/playgrounds/particulas-gravedad")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/particulas-gravedad") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/particulas-gravedad") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/particulas-gravedad") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/gravity-particles") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/gravity-particles") },
    ],
  }),
  component: ParticulasGravedadPageEs,
});

function ParticulasGravedadPageEs() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Partículas de gravedad</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Hacé clic o tocá para colocar atrayentes. Las partículas orbitan y responden al instante. Ajustá gravedad y cantidad — todo en vivo y compartible.
        </p>
      </header>
      <GravityParticlesPlayground locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
