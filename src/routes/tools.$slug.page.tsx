import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { DeferredToolUi } from "@/components/DeferredToolUi";
import { DeferredRelatedTools } from "@/components/DeferredRelatedTools";
import { DeferredFavoriteButton } from "@/components/DeferredFavoriteButton";
import { DeferredShareAndExport } from "@/components/DeferredShareAndExport";
import { DeferredKitReturnRibbon } from "@/components/kits/DeferredKitReturnRibbon";
import type { CatalogTool } from "@/lib/all-tools";
import { DeferredAdsterraBanner } from "@/components/DeferredAdsterraBanner";
import { DeferredShowcaseHero } from "@/components/DeferredShowcaseHero";
import { Route } from "./tools.$slug";

export function ToolPage() {
  const { tool, category, categoryPublicSlug, showcase } = Route.useLoaderData() as {
    tool: CatalogTool;
    category: { slug: string; name: string } | null;
    categoryPublicSlug: string | null;
    showcase: boolean;
  };

  useEffect(() => {
    void import("@/lib/analytics").then((mod) => {
      mod.trackEvent("tool_open", { slug: tool.slug, locale: "en" });
    });
    void import("@/hooks/use-recent-tools").then((mod) => {
      mod.recordRecentTool(tool.slug);
    });
  }, [tool.slug]);

  if (!category || !categoryPublicSlug) return <p className="container-page py-10">Tool not available.</p>;

  const about = Array.isArray(tool.about) ? tool.about.filter(Boolean) : [];
  const steps = Array.isArray(tool.steps) ? tool.steps.filter(Boolean) : [];
  const faq = Array.isArray(tool.faq) ? tool.faq : [];

  return (
    <div className="container-page py-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="flex min-h-9 flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/tools" className="hover:text-foreground">
          Tools
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/category/$slug" params={{ slug: categoryPublicSlug }} className="hover:text-foreground">
          {category.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <DeferredKitReturnRibbon toolSlug={tool.slug} locale="en" />

      {showcase ? <DeferredShowcaseHero name={tool.name} slug={tool.slug} locale="en" /> : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{tool.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{tool.summary}</p>
        </div>
        <DeferredFavoriteButton slug={tool.slug} name={tool.name} />
      </div>

      <section
        data-tool-surface
        aria-label={`Tool: ${tool.name}`}
        className={`surface-card mt-4 p-4 sm:p-6 ${
          showcase ? "border-0 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] ring-1 ring-black/5" : ""
        }`}
      >
        <DeferredToolUi slug={tool.slug} locale="en" />
        <div className="mt-4">
          <DeferredShareAndExport title={tool.name} />
        </div>
      </section>

      <DeferredAdsterraBanner />
      <DeferredRelatedTools tool={tool} locale="en" />

      {(about.length > 0 || steps.length > 0 || faq.length > 0) && (
        <section className="mt-10 space-y-8" aria-labelledby="tool-guide-title">
          <h2 id="tool-guide-title" className="text-2xl font-black">
            {tool.name}: how it works
          </h2>
          {about.length > 0 && (
            <div>
              <h3 className="text-base font-bold">About {tool.name}</h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                {about.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}
          {steps.length > 0 && (
            <div>
              <h3 className="text-base font-bold">How to use it</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          )}
          {faq.length > 0 && (
            <div>
              <h3 className="text-base font-bold">Frequently asked questions</h3>
              <dl className="mt-2 space-y-3 text-sm">
                {faq.map((item, i) => (
                  <div key={i}>
                    <dt className="font-semibold">{item.q}</dt>
                    <dd className="mt-1 text-muted-foreground">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
