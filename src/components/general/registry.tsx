import type { ReactNode } from "react";
import { RandomColorTool } from "./RandomColorTool";

/** Minimal registry. Most tools use the ConfiguredTool fallback in DeferredToolUi.
 * Custom component tools can be added here as lazy entries.
 */
export const GENERAL_TOOL_UI: Record<string, () => ReactNode> = {
  "generador-color-aleatorio": () => <RandomColorTool locale="en" />,
};

export const GENERAL_TOOL_UI_ES: Record<string, () => ReactNode> = {
  "generador-color-aleatorio": () => <RandomColorTool locale="es" />,
};
