import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ToolMatchmaker = lazy(() =>
  import("@/components/tool-matchmaker/ToolMatchmaker").then((m) => ({ default: m.ToolMatchmaker })),
);

const title = "Find Your Tool — 3 questions, your best UtiliHub match | UtiliHub";
const description = cleanDescription(
  "Answer three quick questions and get a ranked top 3 of the free games, simulators, kits and planners that fit what you want to do right now. No accounts, nothing leaves your device.",
);

export const Route = createFileRoute("/find-your-tool")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/find-your-tool") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/find-your-tool") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/find-your-tool") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/encuentra-tu-herramienta") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/find-your-tool") },
    ],
  }),
  component: FindYourToolPage,
});

function FindYourToolPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Guided picker · 3 questions</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Find your tool</h1>
        <p className="mt-3 text-muted-foreground">
          Not sure where to start? Tell us what you feel like doing and we will point you to the best-fit game, simulator, kit or planner.
        </p>
      </header>
      <div className="max-w-2xl">
        <Suspense fallback={<div className="min-h-[360px] rounded-2xl border border-border bg-card" aria-busy="true" />}>
          <ToolMatchmaker locale="en" />
        </Suspense>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
