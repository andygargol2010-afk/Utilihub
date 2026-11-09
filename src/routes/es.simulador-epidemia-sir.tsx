import { createFileRoute } from "@tanstack/react-router";
import { SirEpidemicSim } from "@/components/simulators/SirEpidemicSim";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Simulador Epidemia SIR | UtiliHub";
const description = cleanDescription(
  "Modelo SIR interactivo. Ajustá transmisión (β) y recuperación (γ), activá cuarentena o campaña de vacunación, mirá las curvas S/I/R en vivo. Compartí escenarios por URL.",
);

export const Route = createFileRoute("/es/simulador-epidemia-sir")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/simulador-epidemia-sir") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/simulador-epidemia-sir") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/sir-epidemic-simulator") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/simulador-epidemia-sir") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/sir-epidemic-simulator") },
    ],
  }),
  component: SirEpidemicPageEs,
});

function SirEpidemicPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600">Simulador · Compartible</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Simulador de Epidemia SIR</h1>
        <p className="mt-3 text-sm text-white/70 sm:text-base">
          Ajustá la tasa de transmisión <strong>β</strong> y la de recuperación <strong>γ</strong>. Activá <strong>cuarentena</strong> (baja β) o <strong>campaña de vacunación</strong> (pasa susceptibles a recuperados). Mirá cómo responden las curvas S/I/R en vivo. Compartí cualquier escenario con la URL.
        </p>
      </header>
      <SirEpidemicSim locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
