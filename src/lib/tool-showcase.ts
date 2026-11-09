import { type ToolShowcase } from "./tool-showcase.part1";
import { TOOL_SHOWCASE } from "./tool-showcase.part2";
export type { ToolShowcase } from "./tool-showcase.part1";
export { TOOL_SHOWCASE } from "./tool-showcase.part2";

export function getToolShowcase(slug: string): ToolShowcase | undefined {
  return TOOL_SHOWCASE[slug];
}

export function isShowcaseTool(slug: string): boolean {
  return slug in TOOL_SHOWCASE;
}
