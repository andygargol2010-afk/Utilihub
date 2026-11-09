import { CATEGORIES, type CategorySlug } from "./tools.part1";
import { TOOLS } from "./tools.part2";
export { CATEGORIES } from "./tools.part1";
export type { CategorySlug, Category, FaqItem, Tool } from "./tools.part1";
export { TOOLS } from "./tools.part2";

export const toolBySlug = (slug: string) => TOOLS.find(t => t.slug === slug);
export const categoryBySlug = (slug: string) => CATEGORIES.find(c => c.slug === slug);
export const toolsByCategory = (slug: CategorySlug) => TOOLS.filter(t => t.category === slug);
