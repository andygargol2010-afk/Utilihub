// Lazy tool UIs part 07 — unique entries only (dups removed 2026-11-01 to fix barrel conflicts).
// Keep under ~3.5 KB. Add new entries here while this is the smallest file.
import { lazy } from "react";

export const SimpleInterestCalculatorToolUi = lazy(() => import("../SimpleInterestCalculatorTool").then((m) => ({ default: m.SimpleInterestCalculatorTool })));
export const ScaleFactorCalculatorToolUi = lazy(() => import("../ScaleFactorCalculatorTool").then((m) => ({ default: m.ScaleFactorCalculatorTool })));
export const SuccessiveDiscountCalculatorToolUi = lazy(() => import("../SuccessiveDiscountCalculatorTool").then((m) => ({ default: m.SuccessiveDiscountCalculatorTool })));
export const PercentageOfNumberCalculatorToolUi = lazy(() => import("../PercentageOfNumberCalculatorTool").then((m) => ({ default: m.PercentageOfNumberCalculatorTool })));
export const MarkupCalculatorToolUi = lazy(() => import("../MarkupCalculatorTool").then((m) => ({ default: m.MarkupCalculatorTool })));
export const UnitPriceCalculatorToolUi = lazy(() => import("../UnitPriceCalculatorTool").then((m) => ({ default: m.UnitPriceCalculatorTool })));
export const ReadingTimeCalculatorToolUi = lazy(() => import("../ReadingTimeCalculatorTool").then((m) => ({ default: m.ReadingTimeCalculatorTool })));
export const TablespoonMlConverterToolUi = lazy(() => import("../TablespoonMlConverterTool").then((m) => ({ default: m.TablespoonMlConverterTool })));
export const FluidOuncesMlConverterToolUi = lazy(() => import("../FluidOuncesMlConverterTool").then((m) => ({ default: m.FluidOuncesMlConverterTool })));
export const CelsiusKelvinConverterToolUi = lazy(() => import("../CelsiusKelvinConverterTool").then((m) => ({ default: m.CelsiusKelvinConverterTool })));
export const GramsToPoundsConverterToolUi = lazy(() => import("../GramsToPoundsConverterTool").then((m) => ({ default: m.GramsToPoundsConverterTool })));
export const FlowRateCalculatorToolUi = lazy(() => import("../FlowRateCalculatorTool").then((m) => ({ default: m.FlowRateCalculatorTool })));
export const ModeCalculatorToolUi = lazy(() => import("../ModeCalculatorTool").then((m) => ({ default: m.ModeCalculatorTool })));
export const SleepCycleCalculatorToolUi = lazy(() => import("../SleepCycleCalculatorTool").then((m) => ({ default: m.SleepCycleCalculatorTool })));
export const AcresHectaresConverterToolUi = lazy(() => import("../AcresHectaresConverterTool").then((m) => ({ default: m.AcresHectaresConverterTool })));
export const WaistToHeightRatioCalculatorToolUi = lazy(() => import("../WaistToHeightRatioCalculatorTool").then((m) => ({ default: m.WaistToHeightRatioCalculatorTool })));
export const SavingsGoalCalculatorToolUi = lazy(() => import("../SavingsGoalCalculatorTool").then((m) => ({ default: m.SavingsGoalCalculatorTool })));
export const MpgL100kmConverterToolUi = lazy(() => import("../MpgL100kmConverterTool").then((m) => ({ default: m.MpgL100kmConverterTool })));
export const TimezoneConverterToolUi = lazy(() => import("../TimezoneConverterTool").then((m) => ({ default: m.TimezoneConverterTool })));
export const VarianceCalculatorToolUi = lazy(() => import("../VarianceCalculatorTool").then((m) => ({ default: m.VarianceCalculatorTool })));
export const PointsToPxConverterToolUi = lazy(() => import("../PointsToPxConverterTool").then((m) => ({ default: m.PointsToPxConverterTool })));
export const BodySurfaceAreaCalculatorToolUi = lazy(() => import("../BodySurfaceAreaCalculatorTool").then((m) => ({ default: m.BodySurfaceAreaCalculatorTool })));
export const TripTotalBudgetCalculatorToolUi = lazy(() => import("../TripTotalBudgetCalculatorTool").then((m) => ({ default: m.TripTotalBudgetCalculatorTool })));
