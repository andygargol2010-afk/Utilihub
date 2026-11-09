// Lazy tool UIs part 02 — split out of ../registry.tsx on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import { lazy } from "react";

export const DailyWaterIntakeCalculatorToolUi = lazy(() =>
  import("../DailyWaterIntakeCalculatorTool").then((m) => ({ default: m.DailyWaterIntakeCalculatorTool })),
);

export const WaterConsumptionCalculatorToolUi = lazy(() =>
  import("../WaterConsumptionCalculatorTool").then((m) => ({ default: m.WaterConsumptionCalculatorTool })),
);

export const SphereSurfaceAreaCalculatorToolUi = lazy(() =>
  import("../SphereSurfaceAreaCalculatorTool").then((m) => ({ default: m.SphereSurfaceAreaCalculatorTool })),
);

export const SquarePerimeterCalculatorToolUi = lazy(() =>
  import("../SquarePerimeterCalculatorTool").then((m) => ({ default: m.SquarePerimeterCalculatorTool })),
);

export const AgeCalculatorToolUi = lazy(() =>
  import("../AgeCalculatorTool").then((m) => ({ default: m.AgeCalculatorTool })),
);

export const TipCalculatorToolUi = lazy(() =>
  import("../TipCalculatorTool").then((m) => ({ default: m.TipCalculatorTool })),
);

export const GpaCalculatorToolUi = lazy(() =>
  import("../GpaCalculatorTool").then((m) => ({ default: m.GpaCalculatorTool })),
);

export const RoomAreaCalculatorToolUi = lazy(() =>
  import("../RoomAreaCalculatorTool").then((m) => ({ default: m.RoomAreaCalculatorTool })),
);

export const PxToRemCalculatorToolUi = lazy(() =>
  import("../PxToRemCalculatorTool").then((m) => ({ default: m.PxToRemCalculatorTool })),
);

export const DailyTravelBudgetCalculatorToolUi = lazy(() =>
  import("../DailyTravelBudgetCalculatorTool").then((m) => ({ default: m.DailyTravelBudgetCalculatorTool })),
);

export const PercentageDifferenceCalculatorToolUi = lazy(() =>
  import("../PercentageDifferenceCalculatorTool").then((m) => ({ default: m.PercentageDifferenceCalculatorTool })),
);

export const SpeedDistanceTimeCalculatorToolUi = lazy(() =>
  import("../SpeedDistanceTimeCalculatorTool").then((m) => ({ default: m.SpeedDistanceTimeCalculatorTool })),
);

export const IvaCalculatorToolUi = lazy(() =>
  import("../IvaCalculatorTool").then((m) => ({ default: m.IvaCalculatorTool })),
);

export const KmhToMsConverterToolUi = lazy(() =>
  import("../KmhToMsConverterTool").then((m) => ({ default: m.KmhToMsConverterTool })),
);

export const RomanToolUi = lazy(() =>
  import("../RomanTool").then((m) => ({ default: m.RomanTool })),
);

export const SleepCycleToolUi = lazy(() =>
  import("../SleepCycleTool").then((m) => ({ default: m.SleepCycleTool })),
);

export const BoxShadowToolUi = lazy(() =>
  import("../BoxShadowTool").then((m) => ({ default: m.BoxShadowTool })),
);

export const AttendancePercentageCalculatorToolUi = lazy(() =>
  import("../AttendancePercentageCalculatorTool").then((m) => ({ default: m.AttendancePercentageCalculatorTool })),
);

export const CostPerKmCalculatorToolUi = lazy(() =>
  import("../CostPerKmCalculatorTool").then((m) => ({ default: m.CostPerKmCalculatorTool })),
);

export const DensityCalculatorToolUi = lazy(() =>
  import("../DensityCalculatorTool").then((m) => ({ default: m.DensityCalculatorTool })),
);

export const PercentageErrorCalculatorToolUi = lazy(() =>
  import("../PercentageErrorCalculatorTool").then((m) => ({ default: m.PercentageErrorCalculatorTool })),
);

export const TextCaseConverterToolUi = lazy(() =>
  import("../TextCaseConverterTool").then((m) => ({ default: m.TextCaseConverterTool })),
);

export const TargetHeartRateCalculatorToolUi = lazy(() =>
  import("../TargetHeartRateCalculatorTool").then((m) => ({ default: m.TargetHeartRateCalculatorTool })),
);

export const AspectRatioCalculatorToolUi = lazy(() =>
  import("../AspectRatioCalculatorTool").then((m) => ({ default: m.AspectRatioCalculatorTool })),
);

export const DaysBetweenDatesCalculatorToolUi = lazy(() =>
  import("../DaysBetweenDatesCalculatorTool").then((m) => ({ default: m.DaysBetweenDatesCalculatorTool })),
);

export const CubeRootCalculatorToolUi = lazy(() =>
  import("../CubeRootCalculatorTool").then((m) => ({ default: m.CubeRootCalculatorTool })),
);

export const HoursToDecimalCalculatorToolUi = lazy(() =>
  import("../HoursToDecimalCalculatorTool").then((m) => ({ default: m.HoursToDecimalCalculatorTool })),
);

export const HoursToDecimalConverterToolUi = lazy(() =>
  import("../HoursToDecimalConverterTool").then((m) => ({ default: m.HoursToDecimalConverterTool })),
);

// Dedicated UIs for tools re-wired after b300eb06 (mappings from the pre-2026-10-13 registry).
export const SeoGrowthToolUi = lazy(() =>
  import("../SeoGrowthTool").then((m) => ({ default: m.SeoGrowthTool })),
);

export const GpaCalculatorUi = lazy(() =>
  import("../GpaCalculator").then((m) => ({ default: m.GpaCalculator })),
);

export const PercentAdvancedToolUi = lazy(() =>
  import("../PercentAdvancedTool").then((m) => ({ default: m.PercentAdvancedTool })),
);

export const AlgebraAdvancedToolUi = lazy(() =>
  import("../AlgebraAdvancedTool").then((m) => ({ default: m.AlgebraAdvancedTool })),
);

export const GeometrySuiteToolUi = lazy(() =>
  import("../GeometrySuiteTool").then((m) => ({ default: m.GeometrySuiteTool })),
);

export const ArithmeticSuiteToolUi = lazy(() =>
  import("../ArithmeticSuiteTool").then((m) => ({ default: m.ArithmeticSuiteTool })),
);

export const SequenceSuiteToolUi = lazy(() =>
  import("../SequenceSuiteTool").then((m) => ({ default: m.SequenceSuiteTool })),
);

export const TrigSuiteToolUi = lazy(() =>
  import("../TrigSuiteTool").then((m) => ({ default: m.TrigSuiteTool })),
);

export const ExpLogSuiteToolUi = lazy(() =>
  import("../ExpLogSuiteTool").then((m) => ({ default: m.ExpLogSuiteTool })),
);

export const MatrixBinarySuiteToolUi = lazy(() =>
  import("../MatrixBinarySuiteTool").then((m) => ({ default: m.MatrixBinarySuiteTool })),
);

export const OvertimePayToolUi = lazy(() =>
  import("../OvertimePayTool").then((m) => ({ default: m.OvertimePayTool })),
);

export const UtmBuilderToolUi = lazy(() =>
  import("../UtmBuilderTool").then((m) => ({ default: m.UtmBuilderTool })),
);

export const VatExtractorToolUi = lazy(() =>
  import("../VatExtractorTool").then((m) => ({ default: m.VatExtractorTool })),
);

export const AcSizeToolUi = lazy(() =>
  import("../AcSizeTool").then((m) => ({ default: m.AcSizeTool })),
);

export const ConcreteCalculatorToolUi = lazy(() =>
  import("../ConcreteCalculatorTool").then((m) => ({ default: m.ConcreteCalculatorTool })),
);

export const WallpaperCalculatorToolUi = lazy(() =>
  import("../WallpaperCalculatorTool").then((m) => ({ default: m.WallpaperCalculatorTool })),
);

export const DrywallCalculatorToolUi = lazy(() =>
  import("../DrywallCalculatorTool").then((m) => ({ default: m.DrywallCalculatorTool })),
);

export const MeetingCostToolUi = lazy(() =>
  import("../MeetingCostTool").then((m) => ({ default: m.MeetingCostTool })),
);

export const FenceCalculatorToolUi = lazy(() =>
  import("../FenceCalculatorTool").then((m) => ({ default: m.FenceCalculatorTool })),
);

export const StairCalculatorToolUi = lazy(() =>
  import("../StairCalculatorTool").then((m) => ({ default: m.StairCalculatorTool })),
);

export const GravelCalculatorToolUi = lazy(() =>
  import("../GravelCalculatorTool").then((m) => ({ default: m.GravelCalculatorTool })),
);
