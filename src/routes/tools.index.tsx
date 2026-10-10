import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DeferredBreadcrumbs } from "@/components/DeferredBreadcrumbs";
import { absoluteUrl, hreflangLinks, ogImage } from "@/lib/seo";

const loadToolSearch = () => import("@/components/ToolSearch");
const ToolSearch = lazy(() => loadToolSearch().then((m) => ({ default: m.ToolSearch })));

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "All free online tools | UtiliHub" },
      {
        name: "description",
        content:
          "Browse all free UtiliHub tools: math, finance, converters, text, dates, development, science, education, and more.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "All free online tools | UtiliHub" },
      {
        property: "og:description",
        content: "Browse free calculators, converters, and utilities that run directly in the browser.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/tools") },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/tools") }, ...hreflangLinks("/tools", "/es/herramientas")],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "All free online tools",
          url: absoluteUrl("/tools"),
          isPartOf: { "@type": "WebSite", name: "UtiliHub", url: absoluteUrl("/") },
        }),
      },
    ],
  }),
  component: ToolsIndex,
});

function CatalogCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let cancel = false;
    const run = () => {
      void import("@/lib/all-tools").then((mod) => {
        if (!cancel) setCount(mod.ALL_TOOLS.length);
      });
    };
    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle(run, { timeout: 1500 });
      return () => {
        cancel = true;
        window.cancelIdleCallback(id);
      };
    }
    const id = window.setTimeout(run, 200);
    return () => {
      cancel = true;
      window.clearTimeout(id);
    };
  }, []);
  return <span className="inline-block min-w-[2.5ch] tabular-nums">{count ?? "…"}</span>;
}

function ListingSlot() {
  return (
    <div className="space-y-5" aria-busy="true">
      <div className="rounded-xl border border-border/70 bg-background/95 p-2.5 sm:p-3">
        <div className="h-12 rounded-lg bg-card" />
        <div className="mt-2 h-11 rounded-full bg-muted/60" />
      </div>
      <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="flex min-h-14 items-center gap-3 px-1 py-2 sm:min-h-16" aria-hidden>
            <div className="size-9 shrink-0 rounded-lg bg-accent" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-4 w-2/5 max-w-xs rounded bg-muted" />
              <div className="h-3 w-3/5 max-w-md rounded bg-muted/70" />
            </div>
            <div className="size-11 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsIndex() {
  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle(() => void loadToolSearch(), { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => void loadToolSearch(), 200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="container-page py-10">
      <DeferredBreadcrumbs items={[{ label: "Home", to: "/" }, { label: "Tools" }]} />
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">All free online tools</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        <CatalogCount /> free utilities that run in the browser, with no signup or install.
      </p>
      <div className="mt-8">
        <Suspense fallback={<ListingSlot />}>
          <ToolSearch />
        </Suspense>
      </div>
    </div>
  );
}
