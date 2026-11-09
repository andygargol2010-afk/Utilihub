import { createFileRoute } from "@tanstack/react-router";
import { PopulationDynamicsSim } from "@/components/playgrounds/PopulationDynamicsSim";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Simulador de Dinâmica Populacional | UtiliHub";
const description = cleanDescription(
  "Simulador interativo de dinâmica populacional: defina população inicial, taxa de natalidade, mortalidade e capacidade de carga. Observe gerações discretas de crescimento logístico em gráfico SVG ao vivo. Compare dois cenários, fase (crescimento/declínio/estável), pico e gerações até a capacidade. PT-BR. Mobile-first.",
);

export const Route = createFileRoute("/pt/simulador-dinamica-populacional")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/simulador-dinamica-populacional") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/simulador-dinamica-populacional") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/simulador-dinamica-populacional") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/population-dynamics-simulator") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/simulador-dinamica-poblacional") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/population-dynamics-simulator") },
    ],
  }),
  component: PopulationPagePt,
});

function PopulationPagePt() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/pt/simulador-dinamica-populacional");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Simulador · Interativo</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Simulador de Dinâmica Populacional</h1>
          </div>
          <ExperienceShareButton
            title="Simulador de Dinâmica Populacional"
            url={shareUrl}
            locale="pt"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Defina população inicial, taxa de natalidade, mortalidade e capacidade de carga. Execute gerações discretas para ver o crescimento logístico ao vivo em um gráfico SVG. Compare dois cenários. Indicadores de fase, população máxima e gerações até a capacidade. Compartilhe PNG ou URL de link profundo.
        </p>
      </header>
      <PopulationDynamicsSim locale="pt" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
