import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

const TOOL_BY_SLUG = new Map(GENERAL_TOOLS.map((t) => [t.slug, t]));

type ToolComp = ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>;

const GeneralToolUi = lazy(() => import("./GeneralTool").then((m) => ({ default: m.GeneralTool })));
const MathToolUi = lazy(() => import("./MathTool").then((m) => ({ default: m.MathTool })));
const ScienceToolUi = lazy(() => import("./ScienceTool").then((m) => ({ default: m.ScienceTool })));
const DensityCalculatorToolUi = lazy(() => import("./DensityCalculatorTool").then((m) => ({ default: m.DensityCalculatorTool })));
const PercentageErrorCalculatorToolUi = lazy(() => import("./PercentageErrorCalculatorTool").then((m) => ({ default: m.PercentageErrorCalculatorTool })));
const AttendancePercentageCalculatorToolUi = lazy(() => import("./AttendancePercentageCalculatorTool").then((m) => ({ default: m.AttendancePercentageCalculatorTool })));
const CostPerKmCalculatorToolUi = lazy(() => import("./CostPerKmCalculatorTool").then((m) => ({ default: m.CostPerKmCalculatorTool })));
const TextCaseConverterToolUi = lazy(() => import("./TextCaseConverterTool").then((m) => ({ default: m.TextCaseConverterTool })));
const TargetHeartRateCalculatorToolUi = lazy(() => import("./TargetHeartRateCalculatorTool").then((m) => ({ default: m.TargetHeartRateCalculatorTool })));

function pickComponent(tool: GeneralTool): ToolComp {
  const slug = (tool.slug || "").toLowerCase();
  if (slug === "calculadora-densidad") return DensityCalculatorToolUi;
  if (slug === "calculadora-error-porcentual") return PercentageErrorCalculatorToolUi;
  if (slug === "calculadora-porcentaje-asistencia") return AttendancePercentageCalculatorToolUi;
  if (slug === "calculadora-costo-por-km") return CostPerKmCalculatorToolUi;
  if (slug === "conversor-texto-caso") return TextCaseConverterToolUi;
  if (slug === "calculadora-frecuencia-cardiaca-objetivo") return TargetHeartRateCalculatorToolUi;
  if ((tool.category || "").toLowerCase() === "ciencia") return ScienceToolUi;
  if ((tool.category || "").toLowerCase() === "matematicas") return MathToolUi;
  return GeneralToolUi;
}

function buildLazyRegistry(locale: "en" | "es") {
  const cache = new Map<string, () => ReactNode>();
  return new Proxy({} as Record<string, () => ReactNode>, {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      if (cache.has(prop)) return cache.get(prop);
      const tool = TOOL_BY_SLUG.get(prop);
      if (!tool) return undefined;
      const Comp = pickComponent(tool);
      const render = () => <Comp tool={tool} locale={locale} />;
      cache.set(prop, render);
      return render;
    },
    has(_target, prop) {
      return typeof prop === "string" && TOOL_BY_SLUG.has(prop);
    },
  });
}

export const GENERAL_TOOL_UI = buildLazyRegistry("en");
export const GENERAL_TOOL_UI_ES = buildLazyRegistry("es");
