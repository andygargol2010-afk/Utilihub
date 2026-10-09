import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, ogImage } from "@/lib/seo";

const loadSpanishToolSearch = () => import("@/components/SpanishToolSearch");
const SpanishToolSearch = lazy(() =>
  loadSpanishToolSearch().then((m) => ({ default: m.SpanishToolSearch })),
);

export const Route = createFileRoute("/es/herramientas/")({
  head: () => ({
    meta: [
      { title: "Todas las herramientas online | UtiliHub" },
      {
        name: "description",
        content:
          "Explora todas las herramientas gratuitas de UtiliHub: matemáticas, finanzas, conversores, texto, fechas, desarrollo, ciencia y más.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Todas las herramientas online | UtiliHub" },
      { property: "og:description", content: "Calculadoras, conversores y utilidades gratuitas en español." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/herramientas") },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/herramientas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/herramientas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/tools") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/tools") },
    ],
  }),
  component: SpanishToolsIndex,
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

function SpanishToolsIndex() {
  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle(() => void loadSpanishToolSearch(), { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => void loadSpanishToolSearch(), 200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Herramientas" }]} />
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Todas las herramientas</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        <CatalogCount /> herramientas gratuitas que funcionan directamente en el navegador, sin registro ni instalación.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={<div className="min-h-72 rounded-2xl border border-border/40 bg-card/20" aria-busy="true" />}
        >
          <SpanishToolSearch />
        </Suspense>
      </div>
    </div>
  );
}
