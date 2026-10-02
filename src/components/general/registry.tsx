import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

const GeneralToolUi = lazy(() => import("./GeneralTool").then((m) => ({ default: m.GeneralTool })));
const ConfiguredTool = lazy(() => import("./ConfiguredTool").then((m) => ({ default: m.ConfiguredTool })));
const AdvancedCalculatorTool = lazy(() =>
  import("./AdvancedCalculatorTool").then((m) => ({ default: m.AdvancedCalculatorTool })),
);
const AdvancedDateTool = lazy(() => import("./AdvancedDateTool").then((m) => ({ default: m.AdvancedDateTool })));
const MathTool = lazy(() => import("./MathTool").then((m) => ({ default: m.MathTool })));
const DesignTool = lazy(() => import("./DesignTool").then((m) => ({ default: m.DesignTool })));
const Modeler3D = lazy(() => import("./Modeler3D").then((m) => ({ default: m.Modeler3D })));
const SecurityTool = lazy(() => import("./SecurityTool").then((m) => ({ default: m.SecurityTool })));
const TimeTool = lazy(() => import("./TimeTool").then((m) => ({ default: m.TimeTool })));
const ConverterTool = lazy(() => import("./ConverterTool").then((m) => ({ default: m.ConverterTool })));
const ScienceTool = lazy(() => import("./ScienceTool").then((m) => ({ default: m.ScienceTool })));
const FormulaTool = lazy(() => import("./FormulaTool").then((m) => ({ default: m.FormulaTool })));
const FinanceTool = lazy(() => import("./FinanceTool").then((m) => ({ default: m.FinanceTool })));
const EducationTool = lazy(() => import("./EducationTool").then((m) => ({ default: m.EducationTool })));
const GeneratorTool = lazy(() => import("./GeneratorTool").then((m) => ({ default: m.GeneratorTool })));
const TextTool = lazy(() => import("./TextTool").then((m) => ({ default: m.TextTool })));
const DevTool = lazy(() => import("./DevTool").then((m) => ({ default: m.DevTool })));
const MediaTool = lazy(() => import("./MediaTool").then((m) => ({ default: m.MediaTool })));
const SequenceTool = lazy(() => import("./SequenceTool").then((m) => ({ default: m.SequenceTool })));
const PowerRootTool = lazy(() => import("./PowerRootTool").then((m) => ({ default: m.PowerRootTool })));
const NormalDistributionTool = lazy(() =>
  import("./NormalDistributionTool").then((m) => ({ default: m.NormalDistributionTool })),
);
const PoissonTool = lazy(() => import("./PoissonTool").then((m) => ({ default: m.PoissonTool })));
const DocumentTool = lazy(() => import("./DocumentTool").then((m) => ({ default: m.DocumentTool })));
const UtilityAdvancedTool = lazy(() =>
  import("./UtilityAdvancedTool").then((m) => ({ default: m.UtilityAdvancedTool })),
);
const SeoGrowthTool = lazy(() => import("./SeoGrowthTool").then((m) => ({ default: m.SeoGrowthTool })));
const PercentAdvancedTool = lazy(() =>
  import("./PercentAdvancedTool").then((m) => ({ default: m.PercentAdvancedTool })),
);
const AlgebraAdvancedTool = lazy(() =>
  import("./AlgebraAdvancedTool").then((m) => ({ default: m.AlgebraAdvancedTool })),
);
const GeometrySuiteTool = lazy(() =>
  import("./GeometrySuiteTool").then((m) => ({ default: m.GeometrySuiteTool })),
);
const ArithmeticSuiteTool = lazy(() =>
  import("./ArithmeticSuiteTool").then((m) => ({ default: m.ArithmeticSuiteTool })),
);
const SequenceSuiteTool = lazy(() =>
  import("./SequenceSuiteTool").then((m) => ({ default: m.SequenceSuiteTool })),
);
const TrigSuiteTool = lazy(() =>
  import("./TrigSuiteTool").then((m) => ({ default: m.TrigSuiteTool })),
);
const ExpLogSuiteTool = lazy(() =>
  import("./ExpLogSuiteTool").then((m) => ({ default: m.ExpLogSuiteTool })),
);
const MatrixBinarySuiteTool = lazy(() =>
  import("./MatrixBinarySuiteTool").then((m) => ({ default: m.MatrixBinarySuiteTool })),
);
const GpaCalculator = lazy(() => import("./GpaCalculator").then((m) => ({ default: m.GpaCalculator })));
const OvertimePayTool = lazy(() => import("./OvertimePayTool").then((m) => ({ default: m.OvertimePayTool })));
const UtmBuilderTool = lazy(() => import("./UtmBuilderTool").then((m) => ({ default: m.UtmBuilderTool })));
const TileCalculatorTool = lazy(() => import("./TileCalculatorTool").then((m) => ({ default: m.TileCalculatorTool })));
const VatExtractorTool = lazy(() => import("./VatExtractorTool").then((m) => ({ default: m.VatExtractorTool })));
const AcSizeTool = lazy(() => import("./AcSizeTool").then((m) => ({ default: m.AcSizeTool })));
const ConcreteCalculatorTool = lazy(() => import("./ConcreteCalculatorTool").then((m) => ({ default: m.ConcreteCalculatorTool })));
const WallpaperCalculatorTool = lazy(() => import("./WallpaperCalculatorTool").then((m) => ({ default: m.WallpaperCalculatorTool })));
const DrywallCalculatorTool = lazy(() => import("./DrywallCalculatorTool").then((m) => ({ default: m.DrywallCalculatorTool })));

type ToolComp = ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>;

function pickComponent(tool: GeneralTool): ToolComp {
  if (tool.slug === "gpa") return GpaCalculator as ToolComp;
  if (tool.slug === "calculadora-horas-extra") return OvertimePayTool as ToolComp;
  if (tool.slug === "generador-utm") return UtmBuilderTool as ToolComp;
  if (tool.slug === "calculadora-baldosas") return TileCalculatorTool as ToolComp;
  if (tool.slug === "quitar-iva") return VatExtractorTool as ToolComp;
  if (tool.slug === "calculadora-btu") return AcSizeTool as ToolComp;
  if (tool.slug === "calculadora-hormigon") return ConcreteCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-papel-pintado") return WallpaperCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-pladur") return DrywallCalculatorTool as ToolComp;
  if (tool.slug === "modelador-3d") return Modeler3D as ToolComp;
  if (tool.config?.mode === "seo-growth") return SeoGrowthTool as ToolComp;
  if (tool.config?.mode === "percent-advanced") return PercentAdvancedTool as ToolComp;
  if (tool.config?.mode === "algebra-advanced") return AlgebraAdvancedTool as ToolComp;
  if (tool.config?.mode === "geometry-suite") return GeometrySuiteTool as ToolComp;
  if (tool.config?.mode === "arithmetic-suite") return ArithmeticSuiteTool as ToolComp;
  if (tool.config?.mode === "sequence-suite") return SequenceSuiteTool as ToolComp;
  if (tool.config?.mode === "trig-suite") return TrigSuiteTool as ToolComp;
  if (tool.config?.mode === "explog-suite") return ExpLogSuiteTool as ToolComp;
  if (tool.config?.mode === "matrix-binary-suite") return MatrixBinarySuiteTool as ToolComp;
  if (tool.slug === "secuencias") return SequenceTool as ToolComp;
  if (tool.slug === "potencias-y-raices") return PowerRootTool as ToolComp;
  if (tool.slug === "distribucion-normal") return NormalDistributionTool as ToolComp;
  if (tool.slug === "distribucion-poisson") return PoissonTool as ToolComp;
  if (tool.config?.mode === "document") return DocumentTool as ToolComp;
  if (tool.category === "utilidades" && tool.kind === "formula") return UtilityAdvancedTool as ToolComp;
  if (tool.config?.mode === "finance") return FinanceTool as ToolComp;
  if (tool.config?.mode === "date") return AdvancedDateTool as ToolComp;
  if (tool.config?.mode === "advanced" && tool.config?.operation) return AdvancedCalculatorTool as ToolComp;
  if (tool.config?.operation) return ConfiguredTool as ToolComp;
  if (tool.category === "desarrollo") return DevTool as ToolComp;
  if (tool.kind === "image" || tool.kind === "pdf") return MediaTool as ToolComp;
  if (tool.kind === "generator") return GeneratorTool as ToolComp;
  if (tool.kind === "text") return TextTool as ToolComp;
  if (tool.kind === "time") return TimeTool as ToolComp;
  if (tool.kind === "education-test" || tool.category === "educacion") return EducationTool as ToolComp;
  if (tool.category === "diseno") return DesignTool as ToolComp;
  if (tool.category === "seguridad") return SecurityTool as ToolComp;
  if (tool.category === "ciencia") return ScienceTool as ToolComp;
  if (tool.category === "conversiones") return ConverterTool as ToolComp;
  if (tool.kind === "stats") return MathTool as ToolComp;
  if (tool.kind === "number") return FormulaTool as ToolComp;
  if (tool.category === "fechas") return TimeTool as ToolComp;
  return GeneralToolUi as ToolComp;
}

/** O(1) tool lookup — avoid scanning GENERAL_TOOLS on every registry access. */
const TOOL_BY_SLUG = new Map(GENERAL_TOOLS.map((tool) => [tool.slug, tool]));

/**
 * Build a registry that only materializes render closures for tools that are
 * actually opened (instead of allocating one closure per catalog entry × locale).
 */
function buildLazyRegistry(locale: "en" | "es"): Record<string, () => ReactNode> {
  const cache = new Map<string, () => ReactNode>();

  return new Proxy({} as Record<string, () => ReactNode>, {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      // Avoid Promise-like traps when something does `await registry`
      if (prop === "then") return undefined;

      const hit = cache.get(prop);
      if (hit) return hit;

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
