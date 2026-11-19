import { createFileRoute } from "@tanstack/react-router";
import { ReturnStreakBoard } from "@/components/experiences/ReturnStreakBoard";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Quadro de Racha de Retorno | UtiliHub";
const description = cleanDescription(
  "Quadro visual leve que rastreia suas sequências de visitas e experiências jogadas recentemente via localStorage. Nós animados e anéis de pulso destacam o que está pendente de retorno. Sem contas.",
);

export const Route = createFileRoute("/pt/return-streak-board")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/return-streak-board") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/return-streak-board") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/return-streak-board") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/return-streak-board") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/return-streak-board") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/return-streak-board") },
    ],
  }),
  component: ReturnStreakBoardPagePt,
});

function ReturnStreakBoardPagePt() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Retenção · Quadro visual</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Quadro de Racha de Retorno</h1>
        <p className="mt-3 text-muted-foreground">
          Um quadro visual leve que rastreia sequências de visitas e playgrounds jogados recentemente apenas via localStorage. Nós animados e anéis de pulso mostram o que está pendente de retorno.
        </p>
      </header>
      <ReturnStreakBoard locale="pt" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
