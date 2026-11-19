import { createFileRoute } from "@tanstack/react-router";
import { FluidInkFlowPlayground } from "@/components/playgrounds/FluidInkFlowPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, interactiveAppJsonLd, ogImage, SITE_NAME } from "@/lib/seo";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Playground de Fluxo de Tinta Fluida | UtiliHub";
const description = cleanDescription(
  "Desenhe traços à mão livre que se transformam em tinta viscosa multicolorida que flui. Ajuste viscosidade, densidade, gravidade e tensão superficial. Mistura ao vivo, pausa, aleatório, PNG com marca. PT.",
);

export const Route = createFileRoute("/pt/fluid-ink-flow-playground")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/fluid-ink-flow-playground") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/fluid-ink-flow-playground") },
    ],
    scripts: [
      interactiveAppJsonLd({
        kind: "app",
        name: title.replace(" | UtiliHub", ""),
        description,
        path: "/pt/fluid-ink-flow-playground",
        locale: "pt",
        breadcrumbs: [{ name: "Início", path: "/pt" }, { name: title.replace(" | UtiliHub", "") }],
      }),
    ],
  }),
  component: FluidInkFlowPagePt,
});

function FluidInkFlowPagePt() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/pt/fluid-ink-flow-playground");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Playground · Compartilhável</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Playground de Fluxo de Tinta Fluida</h1>
          </div>
          <ExperienceShareButton
            title="Playground de Fluxo de Tinta Fluida"
            url={shareUrl}
            locale="pt"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Desenhe traços à mão livre que se transformam em <strong className="font-semibold text-foreground">tinta viscosa multicolorida que flui</strong> com viscosidade ajustável, mistura de cores em sobreposições, densidade de partículas, gravidade e tensão superficial.
          Pause, aleatorize ou limpe — depois compartilhe um PNG com marca.
        </p>
      </header>
      <FluidInkFlowPlayground locale="pt" />

      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
