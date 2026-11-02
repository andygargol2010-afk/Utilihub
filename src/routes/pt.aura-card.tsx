import { createFileRoute } from "@tanstack/react-router";
import { AuraCardComposer } from "@/components/playgrounds/AuraCardComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Compositor de Cartão de Aura | UtiliHub";
const description = cleanDescription(
  "Projete um cartão de aura pessoal com esquemas de cor, densidade de partículas, bloom e degradês de fundo. Citação ou nome personalizado incorporado em um PNG de alta qualidade. Deleite visual compartilhável.",
);

export const Route = createFileRoute("/pt/aura-card")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/aura-card") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/aura-card") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/aura-card") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/aura-card") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/aura-card") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/aura-card") },
    ],
  }),
  component: AuraCardPagePt,
});

function AuraCardPagePt() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/pt/aura-card");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Compartilhável · Aura</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Compositor de Cartão de Aura</h1>
          </div>
          <ExperienceShareButton
            title="Compositor de Cartão de Aura"
            url={shareUrl}
            locale="pt"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Projete seu <strong className="font-semibold text-foreground">cartão de aura</strong> pessoal com esquemas de cor selecionáveis, densidade de partículas, bloom e degradês de fundo. Adicione uma citação ou nome personalizado — depois baixe um PNG de alta qualidade com o título incorporado.
        </p>
      </header>
      <AuraCardComposer locale="pt" />

      <PlaygroundNextStep currentId="aura-card-share" locale="pt" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
