import { lazy, Suspense, useMemo, type ReactNode } from "react";
import { ToolUiFallback } from "@/components/ToolUiFallback";

type Locale = "en" | "es";

async function loadRenderer(slug: string, locale: Locale): Promise<() => ReactNode> {
  const [{ TOOL_UI, TOOL_UI_ES }, { GENERAL_TOOL_UI, GENERAL_TOOL_UI_ES }] = await Promise.all([
    import("@/components/tools/registry"),
    import("@/components/general/registry"),
  ]);
  const core = locale === "es" ? TOOL_UI_ES : TOOL_UI;
  const general = locale === "es" ? GENERAL_TOOL_UI_ES : GENERAL_TOOL_UI;
  const render = core[slug] ?? general[slug];
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
 * Keep the tool-route shell free of the catalog registries.
 * Vite splits both registries (and HouseModeler3D's lazy entry) out of the
 * route chunk so H1 / breadcrumbs can paint before that module graph parses.
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
