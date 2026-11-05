import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const PaperAirplaneKit = lazy(() =>
  import("@/components/kits/PaperAirplaneKit").then((m) => ({ default: m.PaperAirplaneKit })),
);

const title = "Kit de Avião de Papel | UtiliHub";
const description = cleanDescription(
  "Kit interativo de avião de papel. Escolha o design, siga as dobras passo a passo e veja o preview ao vivo do avião.",
);

export const Route = createFileRoute("/pt/kit-aviao-papel")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/kit-aviao-papel") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/kit-aviao-papel") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/kit-aviao-papel") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/paper-airplane-kit") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/kit-avion-papel") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/paper-airplane-kit") },
    ],
  }),
  component: KitAviaoPagePt,
});

function KitAviaoPagePt() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">Kit · Papel</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Kit de Avião de Papel</h1>
        <p className="mt-3 text-muted-foreground">
          Escolha um design, siga as instruções de dobra e veja o preview ao vivo do seu avião de papel.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <PaperAirplaneKit locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
