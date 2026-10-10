import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

// ... existing lazy imports ...
const BmiCalculatorTool = lazy(() => import("./BmiCalculatorTool").then((m) => ({ default: m.BmiCalculatorTool })));
const CaseConverterTool = lazy(() => import("./CaseConverterTool").then((m) => ({ default: m.CaseConverterTool })));

// ... rest of file with the if added ...
  if (tool.slug === "calculadora-imc") return BmiCalculatorTool as ToolComp;
  if (tool.slug === "convertidor-casos-texto") return CaseConverterTool as ToolComp;
  // ... continue
