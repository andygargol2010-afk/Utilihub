import { createFileRoute } from "@tanstack/react-router";
import { ParticleMagnetLab } from "@/components/playgrounds/ParticleMagnetLab";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Laboratorio de Imanes de Partículas | UtiliHub";
const description = cleanDescription(
  "Colocá imanes que atraen o repelen en un canvas abierto. Las partículas fluyen y dejan estelas que visualizan el campo. Arrastrá, ajustá fuerza, modos de color, compartir PNG.",
);

export const Route = createFileRoute("/es/playgrounds/imanes-particulas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/imanes-particulas") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/imanes-particulas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/imanes-particulas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/particle-magnets") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/particle-magnets") },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Laboratorio de Imanes de Partículas</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Colocá imanes que atraen o repelen. Las partículas fluyen libremente y dejan estelas orgánicas que revelan el campo. Arrastrá, ajustá y compartí.
        </p>
      </header>
      <ParticleMagnetLab locale="es" />

      <PlaygroundNextStep currentId="particle-magnet-lab" locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
