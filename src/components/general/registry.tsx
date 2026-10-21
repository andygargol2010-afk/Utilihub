import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

/**
 * Thin registry — agents should almost never edit this file.
 *
 * Contract with DeferredToolUi:
 *   GENERAL_TOOL_UI[slug] must be a zero-arg function () => ReactNode
 *   that already closes over the tool + locale.
 *
 * Routing:
 *   - kind image/pdf → MediaTool (file upload, canvas, PDF)
 *   - kind design/color → DesignTool
 *   - tool.config.operation → ConfiguredTool
 *   - else → category tool or GeneralTool
 */

const TOOL_BY_SLUG = new Map(GENERAL_TOOLS.map((t) => [t.slug, t]));

type ToolComp = ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>;

const GeneralToolUi = lazy(() =>
  import("./GeneralTool").then((m) => ({ default: m.GeneralTool })),
);
const ConfiguredToolUi = lazy(() =>
  import("./ConfiguredTool").then((m) => ({ default: m.ConfiguredTool })),
);
const MediaToolUi = lazy(() =>
  import("./MediaTool").then((m) => ({ default: m.MediaTool })),
);
const DesignToolUi = lazy(() =>
  import("./DesignTool").then((m) => ({ default: m.DesignTool })),
);
const ConverterToolUi = lazy(() =>
  import("./ConverterTool").then((m) => ({ default: m.ConverterTool })),
);
const TextToolUi = lazy(() =>
  import("./TextTool").then((m) => ({ default: m.TextTool })),
);
const MathToolUi = lazy(() =>
  import("./MathTool").then((m) => ({ default: m.MathTool })),
);
const FinanceToolUi = lazy(() =>
  import("./FinanceTool").then((m) => ({ default: m.FinanceTool })),
);
const ScienceToolUi = lazy(() =>
  import("./ScienceTool").then((m) => ({ default: m.ScienceTool })),
);
const TimeToolUi = lazy(() =>
  import("./TimeTool").then((m) => ({ default: m.TimeTool })),
);
const EducationToolUi = lazy(() =>
  import("./EducationTool").then((m) => ({ default: m.EducationTool })),
);
const SecurityToolUi = lazy(() =>
  import("./SecurityTool").then((m) => ({ default: m.SecurityTool })),
);

function pickComponent(tool: GeneralTool): ToolComp {
  const kind = (tool.kind || "").toLowerCase();
  const slug = tool.slug || "";

  // File / media tools (PNG→JPG, compress, PDF, etc.)
  if (kind === "image" || kind === "pdf" || kind === "media") {
    return MediaToolUi;
  }

  // Design / color tools
  if (
    kind === "design" ||
    kind === "color" ||
    slug.includes("color") ||
    slug.includes("contraste") ||
    slug.includes("paleta") ||
    slug.includes("gradiente") ||
    slug.includes("sombra") ||
    slug.includes("border-radius") ||
    slug.startsWith("css-")
  ) {
    return DesignToolUi;
  }

  // Config-driven numeric tools
  if (tool.config && typeof tool.config === "object" && "operation" in tool.config) {
    return ConfiguredToolUi;
  }

  // Kind-based category UIs (only components that exist in repo)
  if (kind === "converter" || kind === "conversion" || kind === "unit") return ConverterToolUi;
  if (kind === "text" || kind === "code" || kind === "encode") return TextToolUi;
  if (kind === "math" || kind === "stats" || kind === "calculator") return MathToolUi;
  if (kind === "finance" || kind === "money") return FinanceToolUi;
  if (kind === "science" || kind === "physics") return ScienceToolUi;
  if (kind === "time" || kind === "date") return TimeToolUi;
  if (kind === "education" || kind === "school") return EducationToolUi;
  if (kind === "security" || kind === "password") return SecurityToolUi;

  return GeneralToolUi;
}

function buildLazyRegistry(locale: "en" | "es") {
  const cache = new Map<string, () => ReactNode>();

  return new Proxy({} as Record<string, () => ReactNode>, {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      if (cache.has(prop)) return cache.get(prop);

      const tool = TOOL_BY_SLUG.get(prop);
      if (!tool) return undefined;

      const Comp = pickComponent(tool);

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
