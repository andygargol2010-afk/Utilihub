import { allToolBySlug, type CatalogTool } from "./all-tools";
import type { WorkKit } from "./work-kits";

export function kitTools(kit: WorkKit): CatalogTool[] {
  return kit.toolSlugs.map(allToolBySlug).filter((tool): tool is CatalogTool => Boolean(tool));
}
