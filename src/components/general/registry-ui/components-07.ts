// Lazy tool UIs part 07 — empty append target (2026-10-28).
// Keep under ~3.5 KB. Add new entries here while this is the smallest file.
import { lazy } from "react";

export const RuleOfThreeCalculatorToolUi = lazy(() => import("../RuleOfThreeCalculatorTool").then((m) => ({ default: m.RuleOfThreeCalculatorTool })));
export const SimpleInterestCalculatorToolUi = lazy(() => import("../SimpleInterestCalculatorTool").then((m) => ({ default: m.SimpleInterestCalculatorTool })));
