import { CompactToolRow } from "@/components/CompactToolRow";
import type { CatalogTool } from "@/lib/all-tools";

export const ToolCard = ({ tool, isFavorite, onToggleFavorite, locale = "en" }: { tool: CatalogTool; isFavorite?: boolean; onToggleFavorite?: (slug: string) => void; locale?: "en" | "es" }) => (
  <CompactToolRow tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} locale={locale} />
);
