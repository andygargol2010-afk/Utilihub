import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const LogicCircuitKit = lazy(() =>
  import("@/components/kits/LogicCircuitKit").then((m) => ({ default: m.LogicCircuitKit })),
);

const title = "Kit de Circuitos Lógicos | UtiliHub";
const description = cleanDescription(
  "Kit interactivo de circuitos lógicos. Coloca compuertas (AND, OR, NOT, XOR, NAND, NOR), conecta cables, alterna entradas y ve salidas en vivo y tabla de verdad.",
);

export const Route = createFileRoute("/es/kits/logic-circuit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/kits/logic-circuit") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/kits/logic-circuit") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/logic-circuit") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/logic-circuit") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/logic-circuit") },
    ],
  }),
  component: LogicPageEs,
});

function LogicPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Lógica</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Kit de Circuitos Lógicos</h1>
        <p className="mt-3 text-muted-foreground">
          Coloca compuertas lógicas en la cuadrícula, conéctalas con cables, alterna interruptores de entrada y observa las salidas actualizarse en vivo. Prueba desafíos guiados como un semi-sumador.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <LogicCircuitKit locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
