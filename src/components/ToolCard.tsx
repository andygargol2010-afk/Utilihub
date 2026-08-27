import { CompactToolRow } from "@/components/CompactToolRow";
import type { CatalogTool } from "@/lib/all-tools";

export const ToolCard = ({ tool, isFavorite, onToggleFavorite }: { tool: CatalogTool; isFavorite?: boolean; onToggleFavorite?: (slug: string) => void }) => (
  <CompactToolRow tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
);
