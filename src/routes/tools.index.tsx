import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolSearch } from "@/components/ToolSearch";
import { ALL_TOOLS } from "@/lib/all-tools";
import { absoluteUrl, ogImage } from "@/lib/seo";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "All free online tools | UtiliHub" },
      { name: "description", content: "Browse all free UtiliHub tools: math, finance, converters, text, dates, development, science, education, and more." },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "All free online tools | UtiliHub" },
      { property: "og:description", content: "Browse free calculators, converters, and utilities that run directly in the browser." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/tools") },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/tools") }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "All free online tools", url: absoluteUrl("/tools"), numberOfItems: ALL_TOOLS.length, isPartOf: { "@type": "WebSite", name: "UtiliHub", url: absoluteUrl("/") } }) }],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  const count = ALL_TOOLS.length;
  return <div className="container-page py-10"><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Tools" }]} /><h1 className="mt-4 text-3xl font-bold sm:text-4xl">All tools</h1><p className="mt-3 max-w-2xl text-muted-foreground">{count} free utilities that run in the browser, with no signup or install.</p><div className="mt-8"><ToolSearch /></div></div>;
}
