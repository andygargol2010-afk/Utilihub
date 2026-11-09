/**
 * Registry entries — re-exports both parts.
 * Agents: prefer editing registry-entries-a.ts or registry-entries-b.ts
 * (append one object). Never write PLACEHOLDER.
 */
import { REGISTRY_ENTRIES_A } from "./registry-entries-a";
import { REGISTRY_ENTRIES_B } from "./registry-entries-b";

export type RegistryEntry = {
  slug: string;
  name: string;
  path: string;
  export: string;
};

export const REGISTRY_ENTRIES: readonly RegistryEntry[] = [
  ...REGISTRY_ENTRIES_A,
  ...REGISTRY_ENTRIES_B,
];
