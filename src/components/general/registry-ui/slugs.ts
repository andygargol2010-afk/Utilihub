// Dedicated UI lookup by slug. Add new slugs in the smallest slugs-NN.ts (not here).
import type { ToolComp } from "./types";
import { SLUG_UI_01 } from "./slugs-01";
import { SLUG_UI_02 } from "./slugs-02";
import { SLUG_UI_03 } from "./slugs-03";

const SLUG_UI_PARTS: Record<string, ToolComp>[] = [SLUG_UI_01, SLUG_UI_02, SLUG_UI_03];

export function dedicatedUiForSlug(slug: string): ToolComp | undefined {
  for (const part of SLUG_UI_PARTS) {
    if (Object.prototype.hasOwnProperty.call(part, slug)) return part[slug];
  }
  return undefined;
}
