import { createFileRoute } from "@tanstack/react-router";
import { ColorCascadeFusionGame } from "@/components/games/ColorCascadeFusionGame";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Fusão Cascata de Cor | UtiliHub";
const description = cleanDescription(
  "Arcade interativo: funda orbes coloridos que caem clicando em correspondências adjacentes. Construa cadeias, marque combos e compartilhe seu recorde. Sem contas.",
);

export const Route = createFileRoute("/pt/color-cascade-fusion")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/color-cascade-fusion") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/color-cascade-fusion") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/color-cascade-fusion") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/color-cascade-fusion") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/color-cascade-fusion") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/color-cascade-fusion") },
    ],
  }),
  component: ColorCascadePagePt,
});

function ColorCascadePagePt() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/pt/color-cascade-fusion");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Jogos · Fusão arcade</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Fusão Cascata de Cor</h1>
          </div>
          <ExperienceShareButton
            title="Fusão Cascata de Cor"
            url={shareUrl}
            locale="pt"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Orbes coloridos caem por gravidade. Clique em cores iguais adjacentes para fundi-los em orbes maiores, ativar reações em cadeia e subir a pontuação. Os níveis aumentam a velocidade. Compartilhe sua melhor marca.
        </p>
      </header>
      <ColorCascadeFusionGame locale="pt" />
      <PlaygroundNextStep currentId="color-cascade-fusion" locale="pt" as any />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
