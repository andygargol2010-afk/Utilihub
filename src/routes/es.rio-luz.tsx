import { createFileRoute } from "@tanstack/react-router";
import { RiverOfLightJourney } from "@/components/playgrounds/RiverOfLightJourney";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Río de Luz · Viaje | UtiliHub";
const description = cleanDescription(
  "Colocá puntos de paso en un campo oscuro. Un río continuo de partículas brillantes fluye entre ellos con resplandores persistentes y floraciones suaves. Controlá velocidad, colores, densidad y bucle. URL y PNG compartibles.",
);

export const Route = createFileRoute("/es/rio-luz")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/rio-luz") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/rio-luz") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/rio-luz") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/river-light") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/river-light") },
    ],
  }),
  component: RiverLightPageEs,
});

function RiverLightPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Viaje · Compartible</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Río de Luz · Viaje</h1>
        <p className="mt-3 text-muted-foreground">
          Hacé clic para colocar puntos de paso. Un <strong className="font-semibold text-foreground">río continuo de partículas brillantes</strong> fluye entre ellos, dejando resplandores persistentes y floraciones suaves. Ajustá la velocidad del flujo, colores núcleo/resplandor, densidad y modo bucle. Impacto visual inmediato. Compartí la URL o una captura PNG.
        </p>
      </header>
      <RiverOfLightJourney locale="es" />

      <PlaygroundNextStep currentId="river-light" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
