/** Tab / Shift+Tab selection cycling: returns the next selectable part id (null when none). */
export function nextSelectableId<T extends { id: string; layerId?: string }>(
  parts: T[],
  layers: { id: string; visible: boolean }[],
  currentId: string | null,
  dir: 1 | -1,
): string | null {
  const ok = parts.filter((p) => layers.find((l) => l.id === p.layerId)?.visible !== false);
  if (!ok.length) return null;
  const i = ok.findIndex((p) => p.id === currentId);
  const n = i < 0 ? (dir > 0 ? 0 : ok.length - 1) : (i + dir + ok.length) % ok.length;
  return ok[n].id;
}
