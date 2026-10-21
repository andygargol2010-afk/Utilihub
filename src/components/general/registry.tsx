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
 * Routing priority:
 *   1. kind image/pdf/media → MediaTool
 *   2. kind document → DocumentTool (must beat config.operation)
 *   3. design/color (kind or slug) → DesignTool
 *   4. config.operation (numeric) → ConfiguredTool
 *   5. other kinds → category tools
 *   6. else → GeneralTool
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
const DocumentToolUi = lazy(() =>
  import("./DocumentTool").then((m) => ({ default: m.DocumentTool })),
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

const IMAGE_SLUG_HINTS = [
  "imagen",
  "image",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "favicon",
  "comprimir",
  "redimensionar",
  "recortar",
  "rotar-imagen",
  "escala-grises",
  "color-dominante",
];
const PDF_SLUG_HINTS = ["pdf", "unir-pdf", "dividir-pdf", "reordenar-pdf"];
const DESIGN_SLUG_HINTS = [
  "color",
  "contraste",
  "paleta",
  "gradiente",
  "sombra",
  "border-radius",
  "rgb",
  "hsl",
  "hex",
  "css-",
  "mezclador",
  "selector-color",
  "tipografica",
  "espaciado",
  "clamp",
  "filter",
  "grid-generator",
];

function pickComponent(tool: GeneralTool): ToolComp {
  const kind = (tool.kind || "").toLowerCase();
  const slug = (tool.slug || "").toLowerCase();

  // 1) File / media tools
  if (kind === "image" || kind === "pdf" || kind === "media") {
    return MediaToolUi;
  }
  if (IMAGE_SLUG_HINTS.some((h) => slug.includes(h)) || PDF_SLUG_HINTS.some((h) => slug.includes(h))) {
    return MediaToolUi;
  }

  // 2) Document tools (must run BEFORE config.operation — they also carry operation)
  if (kind === "document") {
    return DocumentToolUi;
  }

  // 3) Design / color tools
  if (kind === "design" || kind === "color") {
    return DesignToolUi;
  }
  if (DESIGN_SLUG_HINTS.some((h) => slug.includes(h))) {
    return DesignToolUi;
  }

  // 4) Config-driven numeric tools only (ConfiguredTool supports math ops, not document ops)
  if (tool.config && typeof tool.config === "object" && "operation" in tool.config) {
    const op = String((tool.config as { operation?: string }).operation || "");
    // Document-style operations that slipped through without kind=document
    if (
      op === "pdf-metadata" ||
      op === "text-diff" ||
      op === "csv-inspector" ||
      op === "markdown-html" ||
      op === "file-name-batch"
    ) {
      return DocumentToolUi;
    }
    return ConfiguredToolUi;
  }

  // 5) Kind-based category UIs
  if (kind === "converter" || kind === "conversion" || kind === "unit") return ConverterToolUi;
  if (kind === "text" || kind === "code" || kind === "encode") return TextToolUi;
  if (kind === "math" || kind === "stats" || kind === "calculator") return MathToolUi;
  if (kind === "finance" || kind === "money") return FinanceToolUi;
  if (kind === "science" || kind === "physics") return ScienceToolUi;
  if (kind === "time" || kind === "date" || kind === "timer") return TimeToolUi;
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
