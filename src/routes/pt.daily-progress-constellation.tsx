import { createFileRoute } from "@tanstack/react-router";
import { DailyProgressConstellation } from "@/components/experiences/DailyProgressConstellation";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Constelação de Progresso Diário | UtiliHub";
const description = cleanDescription(
  "Canvas interativo de visitas diárias. Cada visita acende uma nova estrela e constrói sua constelação de progresso pessoal. Instantâneos compartilháveis. Sem contas.",
);

export const Route = createFileRoute("/pt/daily-progress-constellation")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/daily-progress-constellation") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/daily-progress-constellation") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/daily-progress-constellation") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/daily-progress-constellation") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/daily-progress-constellation") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/daily-progress-constellation") },
    ],
  }),
  component: DailyProgressPagePt,
});

function DailyProgressPagePt() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Retenção · Progresso visual</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Constelação de Progresso Diário</h1>
        <p className="mt-3 text-muted-foreground">
          Canvas de visitas diárias onde cada visita acende uma nova <strong className="font-semibold text-foreground">estrela</strong>. Construa sua constelação pessoal ao longo do tempo e compartilhe o instantâneo.
        </p>
      </header>
      <DailyProgressConstellation locale="pt" />

      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
