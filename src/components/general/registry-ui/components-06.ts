// Lazy tool UIs part 06 — further split 2026-10-28 to keep files under ~3.5 KB.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import { lazy } from "react";

export const SentencesPerParagraphCalculatorToolUi = lazy(() =>
  import("../SentencesPerParagraphCalculatorTool").then((m) => ({ default: m.SentencesPerParagraphCalculatorTool })),
);

export const HypotenuseCalculatorToolUi = lazy(() =>
  import("../HypotenuseCalculatorTool").then((m) => ({ default: m.HypotenuseCalculatorTool })),
);

export const SimpleAverageCalculatorToolUi = lazy(() =>
  import("../SimpleAverageCalculatorTool").then((m) => ({ default: m.SimpleAverageCalculatorTool })),
);

export const PercentageChangeCalculatorToolUi = lazy(() =>
  import("../PercentageChangeCalculatorTool").then((m) => ({ default: m.PercentageChangeCalculatorTool })),
);

export const SavingsRateCalculatorToolUi = lazy(() =>
  import("../SavingsRateCalculatorTool").then((m) => ({ default: m.SavingsRateCalculatorTool })),
);

export const CupsMlConverterToolUi = lazy(() =>
  import("../CupsMlConverterTool").then((m) => ({ default: m.CupsMlConverterTool })),
);

export const LoanMonthlyPaymentCalculatorToolUi = lazy(() =>
  import("../LoanMonthlyPaymentCalculatorTool").then((m) => ({ default: m.LoanMonthlyPaymentCalculatorTool })),
);

export const RectanglePerimeterCalculatorToolUi = lazy(() =>
  import("../RectanglePerimeterCalculatorTool").then((m) => ({ default: m.RectanglePerimeterCalculatorTool })),
);
