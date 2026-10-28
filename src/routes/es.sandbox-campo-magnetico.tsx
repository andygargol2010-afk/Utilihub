import { createFileRoute } from "@tanstack/react-router";
import { MagneticFieldSandbox } from "@/components/playgrounds/MagneticFieldSandbox";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Sandbox Campo Magnético | UtiliHub";
const description = cleanDescription(
  "Colocá y arrastrá polos norte y sur. Las líneas de campo animadas se actualizan en tiempo real. Compartí configuraciones por URL o PNG con marca. Visualizador educativo de campos magnéticos.",
);

export const Route = createFileRoute("/es/sandbox-campo-magnetico")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/sandbox-campo-magnetico") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/sandbox-campo-magnetico") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/magnetic-field-sandbox") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/sandbox-campo-magnetico") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/magnetic-field-sandbox") },
    ],
  }),
  component: MagneticFieldPageEs,
});

function MagneticFieldPageEs() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/es/sandbox-campo-magnetico");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Playground · Compartible</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Sandbox Campo Magnético</h1>
          </div>
          <ExperienceShareButton
            title="Sandbox Campo Magnético"
            url={shareUrl}
            locale="es"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Colocá <strong className="font-semibold text-foreground">polos norte y sur</strong> y mirá cómo las líneas de campo se curvan entre ellos en vivo. Arrastrá para reordenar, ajustá la fuerza y la densidad de líneas, luego exportá un PNG con marca o compartí la configuración por URL.
        </p>
      </header>
      <MagneticFieldSandbox locale="es" />

      <PlaygroundNextStep currentId="magnetic-field-sandbox" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
