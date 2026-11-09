import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const PaperAirplaneKit = lazy(() =>
  import("@/components/kits/PaperAirplaneKit").then((m) => ({ default: m.PaperAirplaneKit })),
);

const title = "Paper Airplane Design Kit | UtiliHub";
const description = cleanDescription(
  "Interactive paper airplane design kit. Select a preset, follow fold steps with checkoffs, and see a live CSS preview of your plane.",
);

export const Route = createFileRoute("/kits/paper-airplane-kit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/kits/paper-airplane-kit") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/kits/paper-airplane-kit") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/paper-airplane-kit") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/avion-papel-kit") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/paper-airplane-kit") },
    ],
  }),
  component: PaperAirplanePage,
});

function PaperAirplanePage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Paper craft</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Paper Airplane Design Kit</h1>
        <p className="mt-3 text-muted-foreground">
          Choose a design, follow the fold steps, and watch the live preview update as you check them off.
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
