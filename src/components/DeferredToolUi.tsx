import { lazy, Suspense, useMemo, useState, type ReactNode } from "react";
import { ToolUiFallback } from "@/components/ToolUiFallback";
import { LazyBoundary } from "@/components/LazyBoundary";

type Locale = "en" | "es";

/** Slugs owned by the small tools registry — keep in sync with tools/registry.tsx. */
const CORE_SLUGS = new Set([
  "calculadora",
  "calculadora-de-porcentajes",
  "regla-de-tres",
  "calculadora-de-fechas",
  "contador-de-palabras",
  "generador-de-contrasenas",
  "conversor-de-temperatura",
  "conversor-de-longitud",
  "conversor-de-peso",
  "conversor-de-unidades",
]);

const STUDIO_3D_SLUGS = new Set(["modelador-3d", "modelador-casas-3d"]);

async function loadRenderer(slug: string, locale: Locale): Promise<() => ReactNode> {
  if (STUDIO_3D_SLUGS.has(slug)) {
    const { Studio3d } = await import("@/components/general/registry-3d");
    return () => <Studio3d slug={slug} locale={locale} />;
  }

  if (slug === "pixelihub") {
    const { GENERAL_TOOLS } = await import("@/lib/general");
    const tool = GENERAL_TOOLS.find((item) => item.slug === "pixelihub");
    const { PixelArtStudio } = await import("@/components/general/PixelArtStudio");
    if (!tool) {
      const missing = locale === "es" ? "Herramienta no disponible." : "Tool not available.";
      return () => (
        <p role="alert" className="text-muted-foreground">
          {missing}
        </p>
      );
    }
    return () => <PixelArtStudio tool={tool} locale={locale} />;
  }

  if (CORE_SLUGS.has(slug)) {
    const { TOOL_UI, TOOL_UI_ES } = await import("@/components/tools/registry");
    const core = locale === "es" ? TOOL_UI_ES : TOOL_UI;
    const render = core[slug];
    if (render) return render;
  }

  const { GENERAL_TOOL_UI, GENERAL_TOOL_UI_ES } = await import("@/components/general/registry");
  const general = locale === "es" ? GENERAL_TOOL_UI_ES : GENERAL_TOOL_UI;
  const render = general[slug];
  if (render) {
    // general/registry must return () => ReactNode; tolerate legacy element shape
    if (typeof render === "function") return render as () => ReactNode;
    return () => render as ReactNode;
  }

  try {
    const { allToolBySlug } = await import("@/lib/all-tools");
    const tool = allToolBySlug(slug);
    if (tool && tool.config && typeof tool.config === "object" && "operation" in tool.config) {
      const { ConfiguredTool } = await import("@/components/general/ConfiguredTool");
      return () => <ConfiguredTool tool={tool} locale={locale} />;
    }
  } catch {}

  const missing = locale === "es" ? "Herramienta no disponible." : "Tool not available.";
  return () => (
    <p role="alert" className="text-muted-foreground">
      {missing}
    </p>
  );
}

/**
 * Keep the tool-route shell free of catalog registries.
 * Core tools never fetch general/registry. 3D studios fetch registry-3d only.
 * PixeliHub loads PixelArtStudio on demand only.
 */
export function DeferredToolUi({ slug, locale }: { slug: string; locale: Locale }) {
  // Bumped by the boundary's Retry: a fresh lazy() re-fetches a chunk that failed.
  const [attempt, setAttempt] = useState(0);
  const Ui = useMemo(
    () =>
      lazy(async () => {
        const render = await loadRenderer(slug, locale);
        return {
          default: function LoadedToolUi() {
            const node = typeof render === "function" ? render() : render;
            return <>{node}</>;
          },
        };
      }),
    [slug, locale, attempt],
  );

  return (
    <LazyBoundary locale={locale} onRetry={() => setAttempt((n) => n + 1)}>
      <Suspense fallback={<ToolUiFallback locale={locale} />}>
        <Ui />
      </Suspense>
    </LazyBoundary>
  );
}
