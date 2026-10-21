import { lazy, type ComponentType } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";
import { REGISTRY_ENTRIES } from "./registry-entries";
import { GeneralToolUi } from "./registry-generics";

/**
 * Thin registry — agents should almost never edit this file.
 * To add a tool: append ONE entry to registry-entries-a.ts or registry-entries-b.ts only.
 * This file is intentionally small and stable (anti-wipe).
 *
 * Size target: keep under ~3 KB so agent tool responses never truncate it.
 */

const TOOL_BY_SLUG = new Map(GENERAL_TOOLS.map((t) => [t.slug, t]));

// Build lazy map once from pure data entries
const SPECIAL_LAZY: Record<string, ComponentType<any>> = {};
for (const e of REGISTRY_ENTRIES) {
  const { slug, path, export: exportName } = e;
  SPECIAL_LAZY[slug] = lazy(() =>
    import(/* @vite-ignore */ path).then((m) => ({
      default: (m as any)[exportName],
    })),
  );
}

function buildLazyRegistry(locale: "en" | "es") {
  const cache = new Map<
    string,
    ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>
  >();

  return new Proxy(
    {} as Record<string, ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>>,
    {
      get(_target, prop) {
        if (typeof prop !== "string") return undefined;
        if (cache.has(prop)) return cache.get(prop);

        const tool = TOOL_BY_SLUG.get(prop);
        if (!tool) return undefined;

        const Comp = SPECIAL_LAZY[prop] ?? GeneralToolUi;

        const render = (props: { tool: GeneralTool; locale?: "en" | "es" }) => (
          <Comp {...props} locale={locale} />
        );
        cache.set(prop, render);
        return render;
      },
      has(_target, prop) {
        return typeof prop === "string" && TOOL_BY_SLUG.has(prop);
      },
    },
  );
}

export const GENERAL_TOOL_UI = buildLazyRegistry("en");
export const GENERAL_TOOL_UI_ES = buildLazyRegistry("es");
