import type { ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";
import type { ToolComp } from "./registry-ui/types";
import { dedicatedUiForSlug } from "./registry-ui/slugs";
import {
  GeneralToolUi,
  ConfiguredToolUi,
  MediaToolUi,
  DesignToolUi,
  DocumentToolUi,
  ConverterToolUi,
  TextToolUi,
  MathToolUi,
  FinanceToolUi,
  ScienceToolUi,
  TimeToolUi,
  EducationToolUi,
  SecurityToolUi,
  FormulaToolUi,
  GeneratorToolUi,
  DevToolUi,
  SeoGrowthToolUi,
  PercentAdvancedToolUi,
  AlgebraAdvancedToolUi,
  GeometrySuiteToolUi,
  ArithmeticSuiteToolUi,
  SequenceSuiteToolUi,
  TrigSuiteToolUi,
  ExpLogSuiteToolUi,
  MatrixBinarySuiteToolUi,
} from "./registry-ui/components";

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
 *
 * Split 2026-10-28: lazy UIs live in ./registry-ui/components-NN.ts and the
 * slug → UI map in ./registry-ui/slugs-NN.ts. Add new entries in the smallest
 * file of ./registry-ui/; never rewrite files wholesale.
 */

const TOOL_BY_SLUG = new Map(GENERAL_TOOLS.map((t) => [t.slug, t]));

function pickComponent(tool: GeneralTool): ToolComp {
  const kind = (tool.kind || "").toLowerCase();
  const slug = (tool.slug || "").toLowerCase();
  const category = (tool.category || "").toLowerCase();
  const mode = String((tool.config as { mode?: unknown } | undefined)?.mode ?? "").toLowerCase();

  // Dedicated calculator / text / re-wired tools: slug map in ./registry-ui/slugs-NN.ts
  const bySlug = dedicatedUiForSlug(slug);
  if (bySlug) return bySlug;
  if (mode === "finance") return FinanceToolUi;
  if (mode === "seo-growth") return SeoGrowthToolUi;
  if (mode === "percent-advanced") return PercentAdvancedToolUi;
  if (mode === "algebra-advanced") return AlgebraAdvancedToolUi;
  if (mode === "geometry-suite") return GeometrySuiteToolUi;
  if (mode === "arithmetic-suite") return ArithmeticSuiteToolUi;
  if (mode === "sequence-suite") return SequenceSuiteToolUi;
  if (mode === "trig-suite") return TrigSuiteToolUi;
  if (mode === "explog-suite") return ExpLogSuiteToolUi;
  if (mode === "matrix-binary-suite") return MatrixBinarySuiteToolUi;

  // 1) Media
  if (kind === "image" || kind === "pdf" || kind === "media") return MediaToolUi;

  // 2) Document beats config.operation
  if (kind === "document") return DocumentToolUi;

  // 3) Design / color
  if (
    kind === "design" ||
    kind === "color" ||
    category === "diseno" ||
    category === "design" ||
    slug.startsWith("css-")
  ) {
    return DesignToolUi;
  }

  // 4) Config-driven numeric vs document operations
  if (tool.config && typeof tool.config === "object" && "operation" in tool.config) {
    const op = String((tool.config as { operation?: string }).operation || "");
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

  // 5) Kind routes
  if (kind === "converter" || kind === "conversion" || kind === "unit") return ConverterToolUi;
  if (kind === "text" || kind === "code" || kind === "encode") return TextToolUi;
  if (kind === "math" || kind === "stats" || kind === "calculator") return MathToolUi;
  if (kind === "finance" || kind === "money") return FinanceToolUi;
  if (kind === "science" || kind === "physics") return ScienceToolUi;
  if (kind === "time" || kind === "date" || kind === "timer") return TimeToolUi;
  if (kind === "education" || kind === "school") return EducationToolUi;
  if (kind === "security" || kind === "password") return SecurityToolUi;
  if (kind === "generator") return GeneratorToolUi;
  if (kind === "dev" || kind === "developer") return DevToolUi;

  // 6) Category routes
  if (category === "math" || category === "matematicas") return MathToolUi;
  if (category === "science" || category === "ciencia") return ScienceToolUi;
  if (category === "formula") return FormulaToolUi;
  if (category === "finance" || category === "finanzas") return FinanceToolUi;
  if (category === "education" || category === "educacion") return EducationToolUi;
  if (category === "generator" || category === "generadores") return GeneratorToolUi;
  if (category === "text" || category === "texto") return TextToolUi;
  if (category === "dev" || category === "desarrollo") return DevToolUi;
  if (category === "media") return MediaToolUi;
  if (category === "design" || category === "diseno") return DesignToolUi;
  if (category === "security" || category === "seguridad") return SecurityToolUi;
  if (category === "time" || category === "fechas") return TimeToolUi;
  if (category === "converter" || category === "conversiones") return ConverterToolUi;

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
