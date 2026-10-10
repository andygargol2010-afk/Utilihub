import type { ReactNode } from "react";

/** Minimal registry. Most tools use the ConfiguredTool fallback in DeferredToolUi.
 * Custom component tools can be added here as lazy entries.
 */
export const GENERAL_TOOL_UI: Record<string, () => ReactNode> = {};

export const GENERAL_TOOL_UI_ES: Record<string, () => ReactNode> = {};
