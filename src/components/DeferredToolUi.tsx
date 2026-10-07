import { lazy, Suspense, useMemo, type ReactNode } from "react";
import { ToolUiFallback } from "@/components/ToolUiFallback";

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

  if (CORE_SLUGS.has(slug)) {
    const { TOOL_UI, TOOL_UI_ES } = await import("@/components/tools/registry");
    const core = locale === "es" ? TOOL_UI_ES : TOOL_UI;
    const render = core[slug];
    if (render) return render;
  }

  const { GENERAL_TOOL_UI, GENERAL_TOOL_UI_ES } = await import("@/components/general/registry");
  const general = locale === "es" ? GENERAL_TOOL_UI_ES : GENERAL_TOOL_UI;
  const render = general[slug];
  if (!render) {
    const missing = locale === "es" ? "Herramienta no disponible." : "Tool not available.";
    return () => (
      <p role="alert" className="text-muted-foreground">
        {missing}
      </p>
    );
  }
  return render;
}

/**
 * Keep the tool-route shell free of catalog registries.
 * Core tools never fetch general/registry. 3D studios fetch registry-3d only,
 * so listings and the other tool pages do not pull the three.js entry module.
 */
export function DeferredToolUi({ slug, locale }: { slug: string; locale: Locale }) {
  const Ui = useMemo(
    () =>
      lazy(async () => {
        const render = await loadRenderer(slug, locale);
        return {
          default: function LoadedToolUi() {
            return <>{render()}</>;
          },
        };
      }),
    [slug, locale],
  );

  return (
    <Suspense fallback={<ToolUiFallback locale={locale} />}>
      <Ui />
    </Suspense>
  );
}
