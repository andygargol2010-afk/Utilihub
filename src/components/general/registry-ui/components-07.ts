// Lazy tool UIs part 07 — empty append target (2026-10-28).
// Keep under ~3.5 KB. Add new entries here while this is the smallest file.
import { lazy } from "react";

export const RuleOfThreeCalculatorToolUi = lazy(() => import("../RuleOfThreeCalculatorTool").then((m) => ({ default: m.RuleOfThreeCalculatorTool })));
export const SimpleInterestCalculatorToolUi = lazy(() => import("../SimpleInterestCalculatorTool").then((m) => ({ default: m.SimpleInterestCalculatorTool })));
export const ScaleFactorCalculatorToolUi = lazy(() => import("../ScaleFactorCalculatorTool").then((m) => ({ default: m.ScaleFactorCalculatorTool })));
export const SuccessiveDiscountCalculatorToolUi = lazy(() => import("../SuccessiveDiscountCalculatorTool").then((m) => ({ default: m.SuccessiveDiscountCalculatorTool })));
