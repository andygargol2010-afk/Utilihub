import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const SimpleCircuitKit = lazy(() =>
  import("@/components/kits/SimpleCircuitKit").then((m) => ({ default: m.SimpleCircuitKit })),
);

const title = "Kit de Circuito Simple | UtiliHub";
const description = cleanDescription(
  "Kit interactivo de circuito simple. Coloca batería, interruptor, resistencia y LED, conéctalos con cables y ve si el LED se enciende.",
);

export const Route = createFileRoute("/es/kit-circuito-simple")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/kit-circuito-simple") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/kit-circuito-simple") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kit-circuito-simple") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/simple-circuit-kit") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/simple-circuit-kit") },
    ],
  }),
  component: KitCircuitoPage,
});

function KitCircuitoPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Electrónica</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Kit de Circuito Simple</h1>
        <p className="mt-3 text-muted-foreground">
          Coloca componentes básicos, conéctalos con cables y prueba si tu circuito en serie enciende el LED.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <SimpleCircuitKit locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
