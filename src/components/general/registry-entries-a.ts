/**
 * Registry entries (A) — agents may append one object per new tool.
 * Keep this file small (< 10 KB). Do NOT write PLACEHOLDER.
 */
export type RegistryEntry = {
  slug: string;
  name: string;
  path: string;
  export: string;
};

export const REGISTRY_ENTRIES_A: readonly RegistryEntry[] = [] as const;
