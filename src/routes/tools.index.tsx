import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Tools" }]} />
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">All free online tools</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        <CatalogCount /> free utilities that run in the browser, with no signup or install.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={<div className="min-h-72 rounded-2xl border border-border/40 bg-card/20" aria-busy="true" />}
        >
          <ToolSearch />
        </Suspense>
      </div>
    </div>
  );
}
