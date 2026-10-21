import { lazy } from "react";

/** Shared / category-level tool components. Stable — rarely edited by agents. */
export const GeneralToolUi = lazy(() => import("./GeneralTool").then((m) => ({ default: m.GeneralTool })));
export const ConfiguredTool = lazy(() => import("./ConfiguredTool").then((m) => ({ default: m.ConfiguredTool })));
export const AdvancedCalculatorTool = lazy(() =>
  import("./AdvancedCalculatorTool").then((m) => ({ default: m.AdvancedCalculatorTool })),
);
export const AdvancedDateTool = lazy(() => import("./AdvancedDateTool").then((m) => ({ default: m.AdvancedDateTool })));
export const MathTool = lazy(() => import("./MathTool").then((m) => ({ default: m.MathTool })));
export const DesignTool = lazy(() => import("./DesignTool").then((m) => ({ default: m.DesignTool })));
export const SecurityTool = lazy(() => import("./SecurityTool").then((m) => ({ default: m.SecurityTool })));
export const TimeTool = lazy(() => import("./TimeTool").then((m) => ({ default: m.TimeTool })));
export const ConverterTool = lazy(() => import("./ConverterTool").then((m) => ({ default: m.ConverterTool })));
export const ScienceTool = lazy(() => import("./ScienceTool").then((m) => ({ default: m.ScienceTool })));
export const FinanceTool = lazy(() => import("./FinanceTool").then((m) => ({ default: m.FinanceTool })));
export const TextTool = lazy(() => import("./TextTool").then((m) => ({ default: m.TextTool })));
export const DeveloperTool = lazy(() => import("./DevTool").then((m) => ({ default: m.DevTool })));
export const EducationTool = lazy(() => import("./EducationTool").then((m) => ({ default: m.EducationTool })));
