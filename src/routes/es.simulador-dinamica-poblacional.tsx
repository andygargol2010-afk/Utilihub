import { createFileRoute } from "@tanstack/react-router";
import { PopulationDynamicsSim } from "@/components/playgrounds/PopulationDynamicsSim";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Simulador de Dinámica Poblacional | UtiliHub";
const description = cleanDescription(
  "Simulador interactivo de dinámica poblacional: establece población inicial, tasa de natalidad, mortalidad y capacidad de carga. Observa generaciones discretas de crecimiento logístico en gráfico SVG en vivo. Compara dos escenarios, fase (crecimiento/declive/estable), pico y generaciones a capacidad. EN+ES. Mobile-first.",
);

export const Route = createFileRoute("/es/simulador-dinamica-poblacional")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/simulador-dinamica-poblacional") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/simulador-dinamica-poblacional") },
      ...hreflangLinks("/population-dynamics-simulator", "/es/simulador-dinamica-poblacional"),
    ],
  }),
  component: PopulationPageEs,
});

function PopulationPageEs() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/es/simulador-dinamica-poblacional");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Simulador · Interactivo</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Simulador de Dinámica Poblacional</h1>
          </div>
          <ExperienceShareButton
            title="Simulador de Dinámica Poblacional"
            url={shareUrl}
            locale="es"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Establece población inicial, tasa de natalidad, mortalidad y capacidad de carga. Ejecuta generaciones discretas para ver el crecimiento logístico en vivo en un gráfico SVG. Compara dos escenarios. Indicadores de fase, población máxima y generaciones hasta la capacidad. Comparte PNG o URL de enlace profundo.
        </p>
      </header>
      <PopulationDynamicsSim locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
