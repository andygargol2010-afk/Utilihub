// Lazy tool UIs part 09 — new part to keep files small.
import { lazy } from "react";

export const EstimatedArrivalTimeCalculatorToolUi = lazy(() => import("../EstimatedArrivalTimeCalculatorTool").then((m) => ({ default: m.EstimatedArrivalTimeCalculatorTool })));
