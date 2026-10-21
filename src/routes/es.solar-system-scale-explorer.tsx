import { createFileRoute } from "@tanstack/react-router";
import { SolarSystemScaleExplorer } from "@/components/playgrounds/SolarSystemScaleExplorer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Explorador de Escala del Sistema Solar | UtiliHub";
const description = cleanDescription(
  "Canvas interactivo para explorar los tamaños y distancias relativos reales del sistema solar. Alterná entre solo tamaño, solo distancia o ambos. Arrastrá planetas, hacé zoom y pan. Sentí qué tan lejos está Neptuno y qué tan pequeña es la Tierra junto a Júpiter.",
);

export const Route = createFileRoute("/es/solar-system-scale-explorer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/solar-system-scale-explorer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/solar-system-scale-explorer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/solar-system-scale-explorer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/solar-system-scale-explorer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/solar-system-scale-explorer") },
    ],
  }),
  component: SolarSystemPageEs,
});

function SolarSystemPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Explorador · Educativo</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Explorador de Escala del Sistema Solar</h1>
        <p className="mt-3 text-muted-foreground">
          Experiencia de Canvas abierto para sentir los <strong className="font-semibold text-foreground">tamaños y distancias relativos reales</strong> del sistema solar. Alterná entre solo tamaño, solo distancia o ambos. Arrastrá planetas, hacé zoom y pan. Las etiquetas y estelas orbitales ayudan a comparar la Tierra con Júpiter (~11× de diámetro) y a apreciar que Neptuno está a ~30 UA.
        </p>
      </header>
      <SolarSystemScaleExplorer locale="es" />

      <section className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-bold text-foreground">Por qué es difícil entender la escala del sistema solar</h2>
        <p className="mt-2">
          La mayoría de los diagramas reducen las distancias enormes para que los planetas quepan en una página. En realidad, si la Tierra es una canica, el Sol es una pelota de playa grande a unos 15 metros y Neptuno está aproximadamente a un kilómetro más allá. Este explorador mantiene proporciones más cercanas a la realidad para que puedas hacer zoom en las diferencias de tamaño o alejarte y ver el vacío del espacio.
        </p>
        <p className="mt-2">
          Intenciones de búsqueda que responde esta página: “escala del sistema solar”, “comparación de tamaño de planetas”, “qué tan lejos está Neptuno”, “Tierra vs Júpiter tamaño”.
        </p>
      </section>

      <PlaygroundNextStep currentId="solar-system-scale-explorer" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
