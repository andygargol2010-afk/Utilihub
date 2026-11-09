/** Dynamic-import / chunk fetch failures across Chromium, Firefox, Safari and webpack-style loaders. */
const CHUNK_ERROR_RE =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Failed to load module script|Unable to preload CSS|ChunkLoadError|Loading (CSS )?chunk [\w-]+ failed/i;

export function isChunkLoadError(error: unknown) {
  const e = error as { name?: string; message?: string } | null;
  return CHUNK_ERROR_RE.test(`${e?.name ?? ""} ${e?.message ?? ""}`);
}
