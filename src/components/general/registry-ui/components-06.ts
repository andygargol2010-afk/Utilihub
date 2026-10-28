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
