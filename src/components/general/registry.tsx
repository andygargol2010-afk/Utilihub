import type { ReactNode } from "react";
import { RandomColorTool } from "./RandomColorTool";
import { RandomUsernameTool } from "./RandomUsernameTool";

/** Minimal registry. Most tools use the ConfiguredTool fallback in DeferredToolUi.
 * Custom component tools can be added here as lazy entries.
 */
export const GENERAL_TOOL_UI: Record<string, () => ReactNode> = {
  "generador-color-aleatorio": () => <RandomColorTool locale="en" />,
  "generador-nombre-usuario": () => <RandomUsernameTool locale="en" />,
};

export const GENERAL_TOOL_UI_ES: Record<string, () => ReactNode> = {
  "generador-color-aleatorio": () => <RandomColorTool locale="es" />,
  "generador-nombre-usuario": () => <RandomUsernameTool locale="es" />,
};
