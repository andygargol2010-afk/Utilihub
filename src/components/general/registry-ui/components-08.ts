// Lazy tool UIs part 08 \u2014 created to keep parts under ~3.5 KB.
// Add new entries here while this is the smallest file.
import { lazy } from "react";

export const CoffeeDoseCalculatorToolUi = lazy(() => import("../CoffeeDoseCalculatorTool").then((m) => ({ default: m.CoffeeDoseCalculatorTool })));
export const WaistToHipRatioCalculatorToolUi = lazy(() => import("../WaistToHipRatioCalculatorTool").then((m) => ({ default: m.WaistToHipRatioCalculatorTool })));
export const StraightLineDepreciationCalculatorToolUi = lazy(() => import("../StraightLineDepreciationCalculatorTool").then((m) => ({ default: m.StraightLineDepreciationCalculatorTool })));
export const CylinderSurfaceAreaCalculatorToolUi = lazy(() => import("../CylinderSurfaceAreaCalculatorTool").then((m) => ({ default: m.CylinderSurfaceAreaCalculatorTool })));
export const TimeOfDayDifferenceCalculatorToolUi = lazy(() => import("../TimeOfDayDifferenceCalculatorTool").then((m) => ({ default: m.TimeOfDayDifferenceCalculatorTool })));
