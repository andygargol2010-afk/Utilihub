import { createFileRoute } from "@tanstack/react-router";
import { AuraCardComposer } from "@/components/playgrounds/AuraCardComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Compositor de Tarjeta de Aura | UtiliHub";
const description = cleanDescription(
  "Diseñá una tarjeta de aura personal con esquemas de color, densidad de partículas, bloom y degradados de fondo. Cita o nombre personalizado horneado en un PNG de alta calidad. Deleite visual compartible.",
);

export const Route = createFileRoute("/es/aura-card")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/aura-card") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/aura-card") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/aura-card") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/aura-card") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/aura-card") },
    ],
  }),
  component: AuraCardPageEs,
});

function AuraCardPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Compartible · Aura</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Compositor de Tarjeta de Aura</h1>
        <p className="mt-3 text-muted-foreground">
          Diseñá tu <strong className="font-semibold text-foreground">tarjeta de aura</strong> personal con esquemas de color seleccionables, densidad de partículas, bloom y degradados de fondo. Agregá una cita o nombre personalizado — luego descargá un PNG de alta calidad con el título horneado.
        </p>
      </header>
      <AuraCardComposer locale="es" />

      <PlaygroundNextStep currentId="aura-card-share" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
