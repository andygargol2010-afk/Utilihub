// Lazy tool UIs part 09 — new part to keep files small.
import { lazy } from "react";

export const EstimatedArrivalTimeCalculatorToolUi = lazy(() => import("../EstimatedArrivalTimeCalculatorTool").then((m) => ({ default: m.EstimatedArrivalTimeCalculatorTool })));
export const DegreesToRadiansConverterToolUi = lazy(() => import("../DegreesToRadiansConverterTool").then((m) => ({ default: m.DegreesToRadiansConverterTool })));
export const UncookedToCookedRiceCalculatorToolUi = lazy(() => import("../UncookedToCookedRiceCalculatorTool").then((m) => ({ default: m.UncookedToCookedRiceCalculatorTool })));
export const BodyAdiposityIndexCalculatorToolUi = lazy(() => import("../BodyAdiposityIndexCalculatorTool").then((m) => ({ default: m.BodyAdiposityIndexCalculatorTool })));
export const RuleOf72CalculatorToolUi = lazy(() => import("../RuleOf72CalculatorTool").then((m) => ({ default: m.RuleOf72CalculatorTool })));
export const OriginalPriceFromDiscountCalculatorToolUi = lazy(() => import("../OriginalPriceFromDiscountCalculatorTool").then((m) => ({ default: m.OriginalPriceFromDiscountCalculatorTool })));
export const CentripetalForceCalculatorToolUi = lazy(() => import("../CentripetalForceCalculatorTool").then((m) => ({ default: m.CentripetalForceCalculatorTool })));
