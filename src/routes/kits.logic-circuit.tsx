import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const LogicCircuitKit = lazy(() =>
  import("@/components/kits/LogicCircuitKit").then((m) => ({ default: m.LogicCircuitKit })),
);

const title = "Logic Circuit Kit | UtiliHub";
const description = cleanDescription(
  "Interactive logic circuit kit. Place gates (AND, OR, NOT, XOR, NAND, NOR), connect wires, toggle inputs, and see live outputs and truth table.",
);

export const Route = createFileRoute("/kits/logic-circuit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/kits/logic-circuit") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/kits/logic-circuit") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/logic-circuit") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/logic-circuit") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/logic-circuit") },
    ],
  }),
  component: LogicPage,
});

function LogicPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Logic</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Logic Circuit Kit</h1>
        <p className="mt-3 text-muted-foreground">
          Place logic gates on the grid, connect them with wires, toggle input switches, and watch live outputs update. Try guided challenges like a half-adder.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <LogicCircuitKit locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
