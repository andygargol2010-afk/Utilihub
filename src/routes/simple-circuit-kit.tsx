import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const SimpleCircuitKit = lazy(() =>
  import("@/components/kits/SimpleCircuitKit").then((m) => ({ default: m.SimpleCircuitKit })),
);

const title = "Simple Circuit Kit | UtiliHub";
const description = cleanDescription(
  "Interactive simple circuit kit. Place battery, switch, resistor and LED, connect with wires, and see the LED light when the circuit is closed.",
);

export const Route = createFileRoute("/simple-circuit-kit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/simple-circuit-kit") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/simple-circuit-kit") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/simple-circuit-kit") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kit-circuito-simple") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/kit-circuito-simples") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/simple-circuit-kit") },
    ],
  }),
  component: SimpleCircuitPage,
});

function SimpleCircuitPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Electronics</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Simple Circuit Kit</h1>
        <p className="mt-3 text-muted-foreground">
          Place basic components, connect them with wires, and test if your series circuit lights the LED.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <SimpleCircuitKit locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
