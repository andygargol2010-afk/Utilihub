import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";
import { REGISTRY_ENTRIES } from "./registry-entries";
import { GeneralToolUi } from "./registry-generics";

/**
 * Thin registry — agents should almost never edit this file.
 * To add a tool: append ONE entry to registry-entries-a.ts or registry-entries-b.ts only.
 *
 * Contract with DeferredToolUi:
 *   GENERAL_TOOL_UI[slug] must be a zero-arg function () => ReactNode
 *   that already closes over the tool + locale.
 */

const TOOL_BY_SLUG = new Map(GENERAL_TOOLS.map((t) => [t.slug, t]));

type ToolComp = ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>;

// Pre-build lazy components; missing modules fall back to GeneralToolUi at render time.
const SPECIAL_LAZY: Record<string, ToolComp> = {};
for (const e of REGISTRY_ENTRIES) {
  const { slug, path, export: exportName } = e;
  SPECIAL_LAZY[slug] = lazy(() =>
    import(/* @vite-ignore */ path)
      .then((m) => {
        const Comp = (m as any)[exportName] as ToolComp | undefined;
        if (!Comp) {
          return { default: GeneralToolUi as ToolComp };
        }
        return { default: Comp };
      })
      .catch(() => ({ default: GeneralToolUi as ToolComp })),
  );
}

function buildLazyRegistry(locale: "en" | "es") {
  const cache = new Map<string, () => ReactNode>();

  return new Proxy({} as Record<string, () => ReactNode>, {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      if (cache.has(prop)) return cache.get(prop);

      const tool = TOOL_BY_SLUG.get(prop);
      if (!tool) return undefined;

      const Comp = SPECIAL_LAZY[prop] ?? GeneralToolUi;

      // Zero-arg renderer — DeferredToolUi calls render() with no props.
      const render = () => <Comp tool={tool} locale={locale} />;
      cache.set(prop, render);
      return render;
    },
    has(_target, prop) {
      return typeof prop === "string" && TOOL_BY_SLUG.has(prop);
    },
  });
}

export const GENERAL_TOOL_UI = buildLazyRegistry("en");
export const GENERAL_TOOL_UI_ES = buildLazyRegistry("es");
