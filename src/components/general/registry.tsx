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
const FormulaToolUi = lazy(() =>
  import("./FormulaTool").then((m) => ({ default: m.FormulaTool })),
);
const GeneratorToolUi = lazy(() =>
  import("./GeneratorTool").then((m) => ({ default: m.GeneratorTool })),
);
const DevToolUi = lazy(() =>
  import("./DevTool").then((m) => ({ default: m.DevTool })),
);

// Dedicated UIs for tools whose general category fallback does not implement the formula
const LetterFrequencyCalculatorToolUi = lazy(() =>
  import("./LetterFrequencyCalculatorTool").then((m) => ({ default: m.LetterFrequencyCalculatorTool })),
);
const WorkCalculatorToolUi = lazy(() =>
  import("./WorkCalculatorTool").then((m) => ({ default: m.WorkCalculatorTool })),
);
const RuleOfThreeCalculatorToolUi = lazy(() =>
  import("./RuleOfThreeCalculatorTool").then((m) => ({ default: m.RuleOfThreeCalculatorTool })),
);
const OvertimeCalculatorToolUi = lazy(() =>
  import("./OvertimeCalculatorTool").then((m) => ({ default: m.OvertimeCalculatorTool })),
);
const CubeVolumeCalculatorToolUi = lazy(() =>
  import("./CubeVolumeCalculatorTool").then((m) => ({ default: m.CubeVolumeCalculatorTool })),
);
const TriangleAreaCalculatorToolUi = lazy(() =>
  import("./TriangleAreaCalculatorTool").then((m) => ({ default: m.TriangleAreaCalculatorTool })),
);
const CircleAreaCalculatorToolUi = lazy(() =>
  import("./CircleAreaCalculatorTool").then((m) => ({ default: m.CircleAreaCalculatorTool })),
);
const OuncesToGramsConverterToolUi = lazy(() =>
  import("./OuncesToGramsConverterTool").then((m) => ({ default: m.OuncesToGramsConverterTool })),
);
const IdealWeightCalculatorToolUi = lazy(() =>
  import("./IdealWeightCalculatorTool").then((m) => ({ default: m.IdealWeightCalculatorTool })),
);
const ElectricalPowerCalculatorToolUi = lazy(() =>
  import("./ElectricalPowerCalculatorTool").then((m) => ({ default: m.ElectricalPowerCalculatorTool })),
);
const FlightTimeCalculatorToolUi = lazy(() =>
  import("./FlightTimeCalculatorTool").then((m) => ({ default: m.FlightTimeCalculatorTool })),
);
const SlopeCalculatorToolUi = lazy(() =>
  import("./SlopeCalculatorTool").then((m) => ({ default: m.SlopeCalculatorTool })),
);
const LineCounterToolUi = lazy(() =>
  import("./LineCounterTool").then((m) => ({ default: m.LineCounterTool })),
);

function pickComponent(tool: GeneralTool): ToolComp {
  const kind = (tool.kind || "").toLowerCase();
  const slug = (tool.slug || "").toLowerCase();
  const category = (tool.category || "").toLowerCase();

  // Dedicated calculator / text tools that must not fall into generic Math/Text/ScienceTool
  if (slug === "calculadora-frecuencia-letras") return LetterFrequencyCalculatorToolUi;
  if (slug === "calculadora-trabajo") return WorkCalculatorToolUi;
  if (slug === "calculadora-regla-de-tres") return RuleOfThreeCalculatorToolUi;
  if (slug === "calculadora-horas-extras") return OvertimeCalculatorToolUi;
  if (slug === "calculadora-volumen-cubo") return CubeVolumeCalculatorToolUi;
  if (slug === "calculadora-area-triangulo") return TriangleAreaCalculatorToolUi;
  if (slug === "calculadora-area-circulo") return CircleAreaCalculatorToolUi;
  if (slug === "conversor-onzas-gramos") return OuncesToGramsConverterToolUi;
  if (slug === "calculadora-peso-saludable") return IdealWeightCalculatorToolUi;
  if (slug === "calculadora-potencia-electrica") return ElectricalPowerCalculatorToolUi;
  if (slug === "calculadora-tiempo-vuelo") return FlightTimeCalculatorToolUi;
  if (slug === "calculadora-pendiente") return SlopeCalculatorToolUi;
  if (slug === "contador-lineas") return LineCounterToolUi;

  // 1) File / media tools
  if (kind === "image" || kind === "pdf" || kind === "media") return MediaToolUi;
  if (
    slug.includes("imagen") ||
    slug.includes("png") ||
    slug.includes("jpg") ||
    slug.includes("webp") ||
    slug.includes("favicon") ||
    slug.includes("comprimir") ||
    slug.includes("redimensionar") ||
    slug.includes("recortar") ||
    slug.includes("pdf")
  ) {
    return MediaToolUi;
  }

  // 2) Document tools (before config.operation)
  if (kind === "document") return DocumentToolUi;

  // 3) Design / color
  if (kind === "design" || kind === "color") return DesignToolUi;
  if (
    slug.includes("color") ||
    slug.includes("contraste") ||
    slug.includes("paleta") ||
    slug.includes("gradiente") ||
    slug.includes("rgb") ||
    slug.includes("hsl") ||
    slug.includes("hex") ||
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
