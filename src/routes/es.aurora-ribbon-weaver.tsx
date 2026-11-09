import { createFileRoute } from "@tanstack/react-router";
import { AuroraRibbonWeaver } from "@/components/playgrounds/AuroraRibbonWeaver";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Tejedor de Cintas Aurora | UtiliHub";
const description = cleanDescription(
  "Dibujá caminos a mano alzada o por waypoints que se convierten en flujos multi-cinta aurora. Ajustá ancho, velocidad, bloom, densidad y gravedad. Vista previa en vivo, PNG con marca, EN+ES.",
);

export const Route = createFileRoute("/es/aurora-ribbon-weaver")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/aurora-ribbon-weaver") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/aurora-ribbon-weaver") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/aurora-ribbon-weaver") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/aurora-ribbon-weaver") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/aurora-ribbon-weaver") },
    ],
  }),
  component: AuroraRibbonPageEs,
});

function AuroraRibbonPageEs() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/es/aurora-ribbon-weaver");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Playground · Compartible</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Tejedor de Cintas Aurora</h1>
          </div>
          <ExperienceShareButton
            title="Tejedor de Cintas Aurora"
            url={shareUrl}
            locale="es"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Dibujá caminos a mano alzada que se convierten en <strong className="font-semibold text-foreground">flujos multi-cinta aurora fluidos</strong> con ancho, velocidad, bloom y densidad de partículas ajustables. Composición de tejido de cintas + estética de bloom aurora distintiva.
        </p>
      </header>
      <AuroraRibbonWeaver locale="es" />

      <PlaygroundNextStep currentId="aurora-ribbon-weaver" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
