import { createFileRoute } from "@tanstack/react-router";
import { NBodyGravitySim } from "@/components/playgrounds/NBodyGravitySim";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, interactiveAppJsonLd, ogImage, SITE_NAME } from "@/lib/seo";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Simulador de Gravidade N-Corpos | UtiliHub";
const description = cleanDescription(
  "Simulador interativo de gravidade N-corpos: adicione corpos celestes com massa, velocidade, cor. Dinâmica gravitacional ao vivo, rastros, colisões suaves, zoom/pan, escala de tempo, predefinições. Compartilhar PNG + link profundo. PT.",
);

export const Route = createFileRoute("/pt/n-body-gravity")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/n-body-gravity") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/n-body-gravity") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/n-body-gravity") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/n-body-gravity") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/n-body-gravity") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/n-body-gravity") },
    ],
    scripts: [
      interactiveAppJsonLd({
        kind: "simulator",
        name: title.replace(" | UtiliHub", ""),
        description,
        path: "/pt/n-body-gravity",
        locale: "pt",
        breadcrumbs: [{ name: "Início", path: "/pt" }, { name: title.replace(" | UtiliHub", "") }],
      }),
    ],
  }),
  component: NBodyPagePt,
});

function NBodyPagePt() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/pt/n-body-gravity");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Simulador · Interativo</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Simulador de Gravidade N-Corpos</h1>
          </div>
          <ExperienceShareButton
            title="Simulador de Gravidade N-Corpos"
            url={shareUrl}
            locale="pt"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Adicione corpos celestes com massa, velocidade inicial, cor e tamanho ajustáveis. Observe a dinâmica gravitacional ao vivo com rastros de partículas, tratamento de colisões suaves, câmera zoom/pan, controles de escala de tempo, pausa/reinício e predefinições (estrelas binárias, mini sistema solar, aglomerado caótico). Compartilhar PNG + link profundo para condições iniciais.
        </p>
      </header>
      <NBodyGravitySim locale="pt" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
