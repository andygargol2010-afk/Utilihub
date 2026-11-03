import { allToolBySlug, type CatalogTool, toolHref } from "./all-tools";
import type { DocumentHubStep } from "./document-hub";

export function documentHubTools(steps: DocumentHubStep[]): Array<DocumentHubStep & { tool: CatalogTool; href: string }> {
  return steps.flatMap((step) => {
    const tool = allToolBySlug(step.slug);
    return tool ? [{ ...step, tool, href: toolHref(tool) }] : [];
  });
}
