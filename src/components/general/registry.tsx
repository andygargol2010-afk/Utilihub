import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

/** Full general tool UI registry — deploy force 2026-10-12 (anti-wipe full registry). Percentage change wired. */

const GeneralToolUi = lazy(() => import("./GeneralTool").then((m) => ({ default: m.GeneralTool })));
const ConfiguredTool = lazy(() => import("./ConfiguredTool").then((m) => ({ default: m.ConfiguredTool })));
const AdvancedCalculatorTool = lazy(() =>
  import("./AdvancedCalculatorTool").then((m) => ({ default: m.AdvancedCalculatorTool })),
);
const AdvancedDateTool = lazy(() => import("./AdvancedDateTool").then((m) => ({ default: m.AdvancedDateTool })));
const MathTool = lazy(() => import("./MathTool").then((m) => ({ default: m.MathTool })));
const DesignTool = lazy(() => import("./DesignTool").then((m) => ({ default: m.DesignTool })));
const SecurityTool = lazy(() => import("./SecurityTool").then((m) => ({ default: m.SecurityTool })));
const TimeTool = lazy(() => import("./TimeTool").then((m) => ({ default: m.TimeTool })));
const ConverterTool = lazy(() => import("./ConverterTool").then((m) => ({ default: m.ConverterTool })));
const ScienceTool = lazy(() => import("./ScienceTool").then((m) => ({ default: m.ScienceTool })));
const FormulaTool = lazy(() => import("./FormulaTool").then((m) => ({ default: m.FormulaTool })));
const FinanceTool = lazy(() => import("./FinanceTool").then((m) => ({ default: m.FinanceTool })));
const EducationTool = lazy(() => import("./EducationTool").then((m) => ({ default: m.EducationTool })));
const GeneratorTool = lazy(() => import("./GeneratorTool").then((m) => ({ default: m.GeneratorTool })));
const TextTool = lazy(() => import("./TextTool").then((m) => ({ default: m.TextTool })));
const UtilityTool = lazy(() => import("./UtilityTool").then((m) => ({ default: m.UtilityTool })));
const HealthTool = lazy(() => import("./HealthTool").then((m) => ({ default: m.HealthTool })));
const TravelTool = lazy(() => import("./TravelTool").then((m) => ({ default: m.TravelTool })));
const HomeTool = lazy(() => import("./HomeTool").then((m) => ({ default: m.HomeTool })));
const ConstructionTool = lazy(() => import("./ConstructionTool").then((m) => ({ default: m.ConstructionTool })));
const CookingTool = lazy(() => import("./CookingTool").then((m) => ({ default: m.CookingTool })));
const ProductivityTool = lazy(() => import("./ProductivityTool").then((m) => ({ default: m.ProductivityTool })));
const PercentageChangeTool = lazy(() =>
  import("./PercentageChangeTool").then((m) => ({ default: m.PercentageChangeTool })),
);
const HouseModeler3D = lazy(() => import("./HouseModeler3D").then((m) => ({ default: m.HouseModeler3D })));
const Model3DStudio = lazy(() => import("./Model3DStudio").then((m) => ({ default: m.Model3DStudio })));
const ImageResizerTool = lazy(() => import("./ImageResizerTool").then((m) => ({ default: m.ImageResizerTool })));
const ImageCompressorTool = lazy(() =>
  import("./ImageCompressorTool").then((m) => ({ default: m.ImageCompressorTool })),
);
const ImageCropTool = lazy(() => import("./ImageCropTool").then((m) => ({ default: m.ImageCropTool })));
const ColorPickerTool = lazy(() => import("./ColorPickerTool").then((m) => ({ default: m.ColorPickerTool })));
const PasswordStrengthTool = lazy(() =>
  import("./PasswordStrengthTool").then((m) => ({ default: m.PasswordStrengthTool })),
);
const UnitPriceTool = lazy(() => import("./UnitPriceTool").then((m) => ({ default: m.UnitPriceTool })));
const TipCalculatorTool = lazy(() => import("./TipCalculatorTool").then((m) => ({ default: m.TipCalculatorTool })));
const SalesTaxTool = lazy(() => import("./SalesTaxTool").then((m) => ({ default: m.SalesTaxTool })));
const DiscountCalculatorTool = lazy(() =>
  import("./DiscountCalculatorTool").then((m) => ({ default: m.DiscountCalculatorTool })),
);
const BreakEvenTool = lazy(() => import("./BreakEvenTool").then((m) => ({ default: m.BreakEvenTool })));
const MarginMarkupTool = lazy(() => import("./MarginMarkupTool").then((m) => ({ default: m.MarginMarkupTool })));
const HourlyRateTool = lazy(() => import("./HourlyRateTool").then((m) => ({ default: m.HourlyRateTool })));
const SalaryHourlyTool = lazy(() => import("./SalaryHourlyTool").then((m) => ({ default: m.SalaryHourlyTool })));
const FuelCostTool = lazy(() => import("./FuelCostTool").then((m) => ({ default: m.FuelCostTool })));
const FuelConsumptionTool = lazy(() =>
  import("./FuelConsumptionTool").then((m) => ({ default: m.FuelConsumptionTool })),
);
const CostPerKmTool = lazy(() => import("./CostPerKmTool").then((m) => ({ default: m.CostPerKmTool })));
const TravelDistanceTool = lazy(() =>
  import("./TravelDistanceTool").then((m) => ({ default: m.TravelDistanceTool })),
);
const DateDurationTool = lazy(() => import("./DateDurationTool").then((m) => ({ default: m.DateDurationTool })));
const AgeCalculatorTool = lazy(() => import("./AgeCalculatorTool").then((m) => ({ default: m.AgeCalculatorTool })));
const CountdownTool = lazy(() => import("./CountdownTool").then((m) => ({ default: m.CountdownTool })));
const WorldClockTool = lazy(() => import("./WorldClockTool").then((m) => ({ default: m.WorldClockTool })));
const TimezoneConverterTool = lazy(() =>
  import("./TimezoneConverterTool").then((m) => ({ default: m.TimezoneConverterTool })),
);
const StopwatchTool = lazy(() => import("./StopwatchTool").then((m) => ({ default: m.StopwatchTool })));
const PomodoroTool = lazy(() => import("./PomodoroTool").then((m) => ({ default: m.PomodoroTool })));
const TextCounterTool = lazy(() => import("./TextCounterTool").then((m) => ({ default: m.TextCounterTool })));
const CaseConverterTool = lazy(() => import("./CaseConverterTool").then((m) => ({ default: m.CaseConverterTool })));
const LoremIpsumTool = lazy(() => import("./LoremIpsumTool").then((m) => ({ default: m.LoremIpsumTool })));
const DummyTextTool = lazy(() => import("./DummyTextTool").then((m) => ({ default: m.DummyTextTool })));
const HashGeneratorTool = lazy(() => import("./HashGeneratorTool").then((m) => ({ default: m.HashGeneratorTool })));
const UuidGeneratorTool = lazy(() => import("./UuidGeneratorTool").then((m) => ({ default: m.UuidGeneratorTool })));
const PasswordGeneratorTool = lazy(() =>
  import("./PasswordGeneratorTool").then((m) => ({ default: m.PasswordGeneratorTool })),
);
const QrCodeTool = lazy(() => import("./QrCodeTool").then((m) => ({ default: m.QrCodeTool })));
const Base64Tool = lazy(() => import("./Base64Tool").then((m) => ({ default: m.Base64Tool })));
const JsonFormatterTool = lazy(() => import("./JsonFormatterTool").then((m) => ({ default: m.JsonFormatterTool })));
const YamlJsonTool = lazy(() => import("./YamlJsonTool").then((m) => ({ default: m.YamlJsonTool })));
const UrlEncoderTool = lazy(() => import("./UrlEncoderTool").then((m) => ({ default: m.UrlEncoderTool })));
const HtmlEncoderTool = lazy(() => import("./HtmlEncoderTool").then((m) => ({ default: m.HtmlEncoderTool })));
const RegexTesterTool = lazy(() => import("./RegexTesterTool").then((m) => ({ default: m.RegexTesterTool })));
const DiffTool = lazy(() => import("./DiffTool").then((m) => ({ default: m.DiffTool })));
const MarkdownPreviewTool = lazy(() =>
  import("./MarkdownPreviewTool").then((m) => ({ default: m.MarkdownPreviewTool })),
);
const BmiTool = lazy(() => import("./BmiTool").then((m) => ({ default: m.BmiTool })));
const CalorieTool = lazy(() => import("./CalorieTool").then((m) => ({ default: m.CalorieTool })));
const WaterIntakeTool = lazy(() => import("./WaterIntakeTool").then((m) => ({ default: m.WaterIntakeTool })));
const SleepCycleTool = lazy(() => import("./SleepCycleTool").then((m) => ({ default: m.SleepCycleTool })));
const BodyFatTool = lazy(() => import("./BodyFatTool").then((m) => ({ default: m.BodyFatTool })));
const PaceCalculatorTool = lazy(() => import("./PaceCalculatorTool").then((m) => ({ default: m.PaceCalculatorTool })));
const LoanPaymentTool = lazy(() => import("./LoanPaymentTool").then((m) => ({ default: m.LoanPaymentTool })));
const CompoundInterestTool = lazy(() =>
  import("./CompoundInterestTool").then((m) => ({ default: m.CompoundInterestTool })),
);
const SavingsGoalTool = lazy(() => import("./SavingsGoalTool").then((m) => ({ default: m.SavingsGoalTool })));
const InflationTool = lazy(() => import("./InflationTool").then((m) => ({ default: m.InflationTool })));
const MacroCalculatorTool = lazy(() => import("./MacroCalculatorTool").then((m) => ({ default: m.MacroCalculatorTool })));
const IdealWeightCalculatorTool = lazy(() => import("./IdealWeightCalculatorTool").then((m) => ({ default: m.IdealWeightCalculatorTool })));
const CompanyNameGeneratorTool = lazy(() => import("./CompanyNameGeneratorTool").then((m) => ({ default: m.CompanyNameGeneratorTool })));

type ToolComp = ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>;

function pickComponent(tool: GeneralTool): ToolComp {
  if (tool.slug === "house-modeler-3d" || tool.slug === "modelador-casas-3d") return HouseModeler3D as ToolComp;
  if (tool.slug === "3d-modeler" || tool.slug === "modelador-3d") return Model3DStudio as ToolComp;
  if (tool.slug === "percentage-change" || tool.slug === "cambio-porcentual") return PercentageChangeTool as ToolComp;
  if (tool.slug === "calculadora-ritmo-carrera") return PaceCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-macros") return MacroCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-peso-ideal") return IdealWeightCalculatorTool as ToolComp;
  if (tool.slug === "generador-nombres-empresa") return CompanyNameGeneratorTool as ToolComp;
  if (tool.category === "math") return MathTool as ToolComp;
  if (tool.category === "design") return DesignTool as ToolComp;
  if (tool.category === "security") return SecurityTool as ToolComp;
  if (tool.category === "time") return TimeTool as ToolComp;
  if (tool.category === "converter") return ConverterTool as ToolComp;
  if (tool.category === "science") return ScienceTool as ToolComp;
  if (tool.category === "formula") return FormulaTool as ToolComp;
  if (tool.category === "finance") return FinanceTool as ToolComp;
  if (tool.category === "education") return EducationTool as ToolComp;
  if (tool.category === "generator") return GeneratorTool as ToolComp;
  if (tool.category === "text") return TextTool as ToolComp;
  if (tool.category === "utility") return UtilityTool as ToolComp;
  if (tool.category === "health") return HealthTool as ToolComp;
  if (tool.category === "travel") return TravelTool as ToolComp;
  if (tool.category === "home") return HomeTool as ToolComp;
  if (tool.category === "construction") return ConstructionTool as ToolComp;
  if (tool.category === "cooking") return CookingTool as ToolComp;
  if (tool.category === "productivity") return ProductivityTool as ToolComp;
  return GeneralToolUi as ToolComp;
}

const STUDIO_3D_SLUGS = new Set(["house-modeler-3d", "modelador-casas-3d", "3d-modeler", "modelador-3d"]);

/** O(1) tool lookup — avoid scanning GENERAL_TOOLS on every registry access. */
const TOOL_BY_SLUG = new Map(
  GENERAL_TOOLS.filter((tool) => !STUDIO_3D_SLUGS.has(tool.slug)).map((tool) => [tool.slug, tool]),
);

/**
 * Lazy per-slug render factory. Components load only when a tool page is
 * actually opened (instead of allocating one closure per catalog entry × locale).
 */
function buildLazyRegistry(locale: "en" | "es"): Record<string, () => ReactNode> {
  const cache = new Map<string, () => ReactNode>();

  return new Proxy({} as Record<string, () => ReactNode>, {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
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
