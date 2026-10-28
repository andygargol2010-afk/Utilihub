// Lazy tool UIs part 05 — split out of ../registry.tsx on 2026-10-28.
// Newest tools moved to components-06 (2026-10-28) to keep this file under ~3.5–4 KB.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import { lazy } from "react";

export const BillSplitToolUi = lazy(() =>
  import("../BillSplitTool").then((m) => ({ default: m.BillSplitTool })),
);

export const CurrencyConverterToolUi = lazy(() =>
  import("../CurrencyConverterTool").then((m) => ({ default: m.CurrencyConverterTool })),
);

export const RecipeCostCalculatorToolUi = lazy(() =>
  import("../RecipeCostCalculatorTool").then((m) => ({ default: m.RecipeCostCalculatorTool })),
);

export const ElectricityCostToolUi = lazy(() =>
  import("../ElectricityCostTool").then((m) => ({ default: m.ElectricityCostTool })),
);

export const WordCounterToolUi = lazy(() =>
  import("../WordCounterTool").then((m) => ({ default: m.WordCounterTool })),
);

export const LoanPaymentToolUi = lazy(() =>
  import("../LoanPaymentTool").then((m) => ({ default: m.LoanPaymentTool })),
);

export const AverageSpeedToolUi = lazy(() =>
  import("../AverageSpeedTool").then((m) => ({ default: m.AverageSpeedTool })),
);

export const AccelerationToolUi = lazy(() =>
  import("../AccelerationTool").then((m) => ({ default: m.AccelerationTool })),
);

export const FuelEfficiencyToolUi = lazy(() =>
  import("../FuelEfficiencyTool").then((m) => ({ default: m.FuelEfficiencyTool })),
);

export const HeartRateZoneToolUi = lazy(() =>
  import("../HeartRateZoneTool").then((m) => ({ default: m.HeartRateZoneTool })),
);

export const HourlyRateToolUi = lazy(() =>
  import("../HourlyRateTool").then((m) => ({ default: m.HourlyRateTool })),
);

export const LineSorterToolUi = lazy(() =>
  import("../LineSorterTool").then((m) => ({ default: m.LineSorterTool })),
);

export const BusinessDaysToolUi = lazy(() =>
  import("../BusinessDaysTool").then((m) => ({ default: m.BusinessDaysTool })),
);

export const TextNormalizerToolUi = lazy(() =>
  import("../TextNormalizerTool").then((m) => ({ default: m.TextNormalizerTool })),
);

export const Budget503020ToolUi = lazy(() =>
  import("../Budget503020Tool").then((m) => ({ default: m.Budget503020Tool })),
);

export const UuidGeneratorToolUi = lazy(() =>
  import("../UuidGeneratorTool").then((m) => ({ default: m.UuidGeneratorTool })),
);

export const DateDifferenceToolUi = lazy(() =>
  import("../DateDifferenceTool").then((m) => ({ default: m.DateDifferenceTool })),
);

export const RecipeScalerToolUi = lazy(() =>
  import("../RecipeScalerTool").then((m) => ({ default: m.RecipeScalerTool })),
);

export const FinalGradeToolUi = lazy(() =>
  import("../FinalGradeTool").then((m) => ({ default: m.FinalGradeTool })),
);

export const TemperatureConverterToolUi = lazy(() =>
  import("../TemperatureConverterTool").then((m) => ({ default: m.TemperatureConverterTool })),
);

export const ProportionCalculatorToolUi = lazy(() =>
  import("../ProportionCalculatorTool").then((m) => ({ default: m.ProportionCalculatorTool })),
);

export const CssGradientGeneratorToolUi = lazy(() =>
  import("../CssGradientGeneratorTool").then((m) => ({ default: m.CssGradientGeneratorTool })),
);

export const CharacterCounterToolUi = lazy(() =>
  import("../CharacterCounterTool").then((m) => ({ default: m.CharacterCounterTool })),
);

export const CalorieDeficitToolUi = lazy(() =>
  import("../CalorieDeficitTool").then((m) => ({ default: m.CalorieDeficitTool })),
);

export const TripTimeToolUi = lazy(() =>
  import("../TripTimeTool").then((m) => ({ default: m.TripTimeTool })),
);

export const ForceCalculatorToolUi = lazy(() =>
  import("../ForceCalculatorTool").then((m) => ({ default: m.ForceCalculatorTool })),
);

export const BacCalculatorToolUi = lazy(() =>
  import("../BacCalculatorTool").then((m) => ({ default: m.BacCalculatorTool })),
);

export const TipTaxCalculatorToolUi = lazy(() =>
  import("../TipTaxCalculatorTool").then((m) => ({ default: m.TipTaxCalculatorTool })),
);

export const SphereVolumeCalculatorToolUi = lazy(() =>
  import("../SphereVolumeCalculatorTool").then((m) => ({ default: m.SphereVolumeCalculatorTool })),
);

export const SentenceCounterToolUi = lazy(() =>
  import("../SentenceCounterTool").then((m) => ({ default: m.SentenceCounterTool })),
);

export const CylinderVolumeCalculatorToolUi = lazy(() =>
  import("../CylinderVolumeCalculatorTool").then((m) => ({ default: m.CylinderVolumeCalculatorTool })),
);

export const ParagraphCounterToolUi = lazy(() =>
  import("../ParagraphCounterTool").then((m) => ({ default: m.ParagraphCounterTool })),
);

export const WordFrequencyCounterToolUi = lazy(() =>
  import("../WordFrequencyCounterTool").then((m) => ({ default: m.WordFrequencyCounterTool })),
);

export const VowelCounterToolUi = lazy(() =>
  import("../VowelCounterTool").then((m) => ({ default: m.VowelCounterTool })),
);

export const RectangleAreaCalculatorToolUi = lazy(() =>
  import("../RectangleAreaCalculatorTool").then((m) => ({ default: m.RectangleAreaCalculatorTool })),
);

export const ConsonantCounterToolUi = lazy(() =>
  import("../ConsonantCounterTool").then((m) => ({ default: m.ConsonantCounterTool })),
);

export const WeightedAverageCalculatorToolUi = lazy(() =>
  import("../WeightedAverageCalculatorTool").then((m) => ({ default: m.WeightedAverageCalculatorTool })),
);

export const CircleCircumferenceCalculatorToolUi = lazy(() =>
  import("../CircleCircumferenceCalculatorTool").then((m) => ({ default: m.CircleCircumferenceCalculatorTool })),
);

export const RectanglePerimeterCalculatorToolUi = lazy(() =>
  import("../RectanglePerimeterCalculatorTool").then((m) => ({ default: m.RectanglePerimeterCalculatorTool })),
);

export const PressureConverterToolUi = lazy(() =>
  import("../PressureConverterTool").then((m) => ({ default: m.PressureConverterTool })),
);

export const CaloriesBurnedCalculatorToolUi = lazy(() =>
  import("../CaloriesBurnedCalculatorTool").then((m) => ({ default: m.CaloriesBurnedCalculatorTool })),
);

export const PyramidVolumeCalculatorToolUi = lazy(() =>
  import("../PyramidVolumeCalculatorTool").then((m) => ({ default: m.PyramidVolumeCalculatorTool })),
);

export const TrapezoidAreaCalculatorToolUi = lazy(() =>
  import("../TrapezoidAreaCalculatorTool").then((m) => ({ default: m.TrapezoidAreaCalculatorTool })),
);

export const ParallelogramAreaCalculatorToolUi = lazy(() =>
  import("../ParallelogramAreaCalculatorTool").then((m) => ({ default: m.ParallelogramAreaCalculatorTool })),
);

export const RectangularPrismVolumeCalculatorToolUi = lazy(() =>
  import("../RectangularPrismVolumeCalculatorTool").then((m) => ({ default: m.RectangularPrismVolumeCalculatorTool })),
);
