// Lazy tool UIs part 06 — unique entries only (dups removed 2026-11-01 to fix barrel conflicts).
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import { lazy } from "react";

export const SentencesPerParagraphCalculatorToolUi = lazy(() =>
  import("../SentencesPerParagraphCalculatorTool").then((m) => ({ default: m.SentencesPerParagraphCalculatorTool })),
);

export const HypotenuseCalculatorToolUi = lazy(() =>
  import("../HypotenuseCalculatorTool").then((m) => ({ default: m.HypotenuseCalculatorTool })),
);

export const PercentageChangeCalculatorToolUi = lazy(() =>
  import("../PercentageChangeCalculatorTool").then((m) => ({ default: m.PercentageChangeCalculatorTool })),
);

export const SavingsRateCalculatorToolUi = lazy(() =>
  import("../SavingsRateCalculatorTool").then((m) => ({ default: m.SavingsRateCalculatorTool })),
);

export const LoanMonthlyPaymentCalculatorToolUi = lazy(() =>
  import("../LoanMonthlyPaymentCalculatorTool").then((m) => ({ default: m.LoanMonthlyPaymentCalculatorTool })),
);

export const QuadraticMeanCalculatorToolUi = lazy(() =>
  import("../QuadraticMeanCalculatorTool").then((m) => ({ default: m.QuadraticMeanCalculatorTool })),
);

export const MeanAbsoluteDeviationCalculatorToolUi = lazy(() =>
  import("../MeanAbsoluteDeviationCalculatorTool").then((m) => ({ default: m.MeanAbsoluteDeviationCalculatorTool })),
);

export const GeometricMeanCalculatorToolUi = lazy(() =>
  import("../GeometricMeanCalculatorTool").then((m) => ({ default: m.GeometricMeanCalculatorTool })),
);

export const StatisticalRangeCalculatorToolUi = lazy(() =>
  import("../StatisticalRangeCalculatorTool").then((m) => ({ default: m.StatisticalRangeCalculatorTool })),
);

export const SalesCommissionCalculatorToolUi = lazy(() =>
  import("../SalesCommissionCalculatorTool").then((m) => ({ default: m.SalesCommissionCalculatorTool })),
);

export const TripFuelConsumptionCalculatorToolUi = lazy(() =>
  import("../TripFuelConsumptionCalculatorTool").then((m) => ({ default: m.TripFuelConsumptionCalculatorTool })),
);

export const CupsMlConverterToolUi = lazy(() =>
  import("../CupsMlConverterTool").then((m) => ({ default: m.CupsMlConverterTool })),
);
