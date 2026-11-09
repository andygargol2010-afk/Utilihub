import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const SimpleCircuitKit = lazy(() =>
  import("@/components/kits/SimpleCircuitKit").then((m) => ({ default: m.SimpleCircuitKit })),
);

const title = "Kit de Circuito Simples | UtiliHub";
const description = cleanDescription(
  "Kit interativo de circuito simples. Coloque bateria, interruptor, resistor e LED, conecte com fios e veja o LED acender quando o circuito está fechado.",
);

export const Route = createFileRoute("/pt/kit-circuito-simples")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/kit-circuito-simples") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/kit-circuito-simples") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/kit-circuito-simples") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/simple-circuit-kit") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kit-circuito-simple") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/simple-circuit-kit") },
    ],
  }),
  component: KitCircuitoPagePt,
});

function KitCircuitoPagePt() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Eletrônica</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Kit de Circuito Simples</h1>
        <p className="mt-3 text-muted-foreground">
          Coloque componentes básicos, conecte-os com fios e teste se seu circuito em série acende o LED.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <SimpleCircuitKit locale="pt" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
