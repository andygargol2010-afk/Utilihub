import { FINANCE_SEO_BLOCK4 } from "./finance-seo-block4";
import { type FinanceSeoBlock } from "./finance-seo-content.part1";
import { FINANCE_SEO } from "./finance-seo-content.part2";
export type { FinanceSeoBlock } from "./finance-seo-content.part1";
export { FINANCE_SEO } from "./finance-seo-content.part2";

export function financeSeo(slug: string): FinanceSeoBlock | undefined {
  return (
    FINANCE_SEO[slug] ??
    (FINANCE_SEO_BLOCK4[slug] as FinanceSeoBlock | undefined)
  );
}
