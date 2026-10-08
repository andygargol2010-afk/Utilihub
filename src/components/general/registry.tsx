import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

const GeneralToolUi = lazy(() => import("./GeneralTool").then((m) => ({ default: m.GeneralTool })));
const JwtTool = lazy(() => import("./JwtTool").then((m) => ({ default: m.JwtTool })));
const PasswordEntropyTool = lazy(() => import("./PasswordEntropyTool").then((m) => ({ default: m.PasswordEntropyTool })));

type ToolComp = ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>;

function pickComponent(tool: GeneralTool): ToolComp {
  if (tool.slug === "estimador-entropia-contrasena") return PasswordEntropyTool as ToolComp;
  if (tool.slug === "decodificador-jwt") return JwtTool as ToolComp;
  return GeneralToolUi as ToolComp;
}

export const GENERAL_TOOL_UI = {};
export const GENERAL_TOOL_UI_ES = {};
