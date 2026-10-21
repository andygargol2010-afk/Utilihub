import { lazy } from "react";

/** Shared / category-level tool components. Stable — rarely edited by agents. */
export const GeneralToolUi = lazy(() => import("./GeneralTool").then((m) => ({ default: m.GeneralTool })));
export const ConfiguredTool = lazy(() => import("./ConfiguredTool").then((m) => ({ default: m.ConfiguredTool })));
export const AdvancedCalculatorTool = lazy(() =>
  import("./AdvancedCalculatorTool").then((m) => ({ default: m.AdvancedCalculatorTool })),
);
export const AdvancedDateTool = lazy(() => import("./AdvancedDateTool").then((m) => ({ default: m.AdvancedDateTool })));
export const MathTool = lazy(() => import("./MathTool").then((m) => ({ default: m.MathTool })));
export const DesignTool = lazy(() => import("./DesignTool").then((m) => ({ default: m.DesignTool })));
export const SecurityTool = lazy(() => import("./SecurityTool").then((m) => ({ default: m.SecurityTool })));
export const TimeTool = lazy(() => import("./TimeTool").then((m) => ({ default: m.TimeTool })));
export const ConverterTool = lazy(() => import("./ConverterTool").then((m) => ({ default: m.ConverterTool })));
export const ScienceTool = lazy(() => import("./ScienceTool").then((m) => ({ default: m.ScienceTool })));
export const FinanceTool = lazy(() => import("./FinanceTool").then((m) => ({ default: m.FinanceTool })));
export const TextTool = lazy(() => import("./TextTool").then((m) => ({ default: m.TextTool })));
export const DeveloperTool = lazy(() => import("./DeveloperTool").then((m) => ({ default: m.DeveloperTool })));
export const HealthTool = lazy(() => import("./HealthTool").then((m) => ({ default: m.HealthTool })));
export const CookingTool = lazy(() => import("./CookingTool").then((m) => ({ default: m.CookingTool })));
export const EducationTool = lazy(() => import("./EducationTool").then((m) => ({ default: m.EducationTool })));
export const GeometryTool = lazy(() => import("./GeometryTool").then((m) => ({ default: m.GeometryTool })));
export const StatisticsTool = lazy(() => import("./StatisticsTool").then((m) => ({ default: m.StatisticsTool })));
export const UnitsTool = lazy(() => import("./UnitsTool").then((m) => ({ default: m.UnitsTool })));
export const ColorTool = lazy(() => import("./ColorTool").then((m) => ({ default: m.ColorTool })));
export const DateMathTool = lazy(() => import("./DateMathTool").then((m) => ({ default: m.DateMathTool })));
export const PercentageTool = lazy(() => import("./PercentageTool").then((m) => ({ default: m.PercentageTool })));
export const RandomGeneratorsTool = lazy(() => import("./RandomGeneratorsTool").then((m) => ({ default: m.RandomGeneratorsTool })));
export const EncodeDecodeTool = lazy(() => import("./EncodeDecodeTool").then((m) => ({ default: m.EncodeDecodeTool })));
export const CountAnalyzeTool = lazy(() => import("./CountAnalyzeTool").then((m) => ({ default: m.CountAnalyzeTool })));
export const PhysicsTool = lazy(() => import("./PhysicsTool").then((m) => ({ default: m.PhysicsTool })));
export const RetirementTool = lazy(() => import("./RetirementTool").then((m) => ({ default: m.RetirementTool })));
export const InvestingTool = lazy(() => import("./InvestingTool").then((m) => ({ default: m.InvestingTool })));
export const SavingsTool = lazy(() => import("./SavingsTool").then((m) => ({ default: m.SavingsTool })));
export const LoansTool = lazy(() => import("./LoansTool").then((m) => ({ default: m.LoansTool })));
export const TravelTool = lazy(() => import("./TravelTool").then((m) => ({ default: m.TravelTool })));
export const CompareTool = lazy(() => import("./CompareTool").then((m) => ({ default: m.CompareTool })));
export const TimersTool = lazy(() => import("./TimersTool").then((m) => ({ default: m.TimersTool })));
