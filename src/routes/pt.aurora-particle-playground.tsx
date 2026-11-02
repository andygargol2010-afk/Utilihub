import { createFileRoute } from "@tanstack/react-router";
import { AuroraParticlePlayground } from "@/components/playgrounds/AuroraParticlePlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Playground de Partículas Aurora | UtiliHub";
const description = cleanDescription(
  "Playground de canvas aberto: coloque e arraste atratores magnéticos. As partículas formam fitas de aurora brilhantes e fluidas com rastros persistentes. Controles de densidade, velocidade, tom e turbulência. Link compartilhável e PNG.",
);

export const Route = createFileRoute("/pt/aurora-particle-playground")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/aurora-particle-playground") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/aurora-particle-playground") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/aurora-particle-playground") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/aurora-particle-playground") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/aurora-particle-playground") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/aurora-particle-playground") },
    ],
  }),
  component: AuroraParticlePagePt,
});

function AuroraParticlePagePt() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/pt/aurora-particle-playground");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Playground · Compartilhável</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Playground de Partículas Aurora</h1>
          </div>
          <ExperienceShareButton
            title="Playground de Partículas Aurora"
            url={shareUrl}
            locale="pt"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Coloque e arraste atratores magnéticos no canvas aberto. As partículas formam <strong className="font-semibold text-foreground">fitas de aurora brilhantes e fluidas</strong> com rastros persistentes que respondem em tempo real.
          Ajuste densidade, velocidade de fluxo, deslocamento de tom e turbulência — depois compartilhe o link ou baixe um PNG.
        </p>
      </header>
      <AuroraParticlePlayground locale="pt" />

      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
