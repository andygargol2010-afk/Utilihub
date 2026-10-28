import type { ComponentType } from "react";
import type { GeneralTool } from "@/lib/general/types";

export type ToolComp = ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>;
