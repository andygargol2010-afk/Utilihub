import {
  SCENES_KEY, MAX_NAMED_SCENES, encodeSceneShare, decodeSceneShare, scenePresets,
  type NamedScene,
} from "./modeler3d-helpers";

export type SceneData = NamedScene["data"];

export function readNamedScenes(): NamedScene[] {
  try {
    const raw = localStorage.getItem(SCENES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as NamedScene[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function writeNamedScenes(scenes: NamedScene[]) {
  try {
    localStorage.setItem(SCENES_KEY, JSON.stringify(scenes.slice(0, MAX_NAMED_SCENES)));
  } catch { /* */ }
}

export function saveNamedSceneEntry(name: string, data: SceneData): NamedScene {
  const entry: NamedScene = {
    id: `sc${Date.now().toString(36)}`,
    name: (name || "Scene").slice(0, 48),
    savedAt: Date.now(),
    data,
  };
  writeNamedScenes([entry, ...readNamedScenes()]);
  return entry;
}

export function removeNamedScene(id: string) {
  writeNamedScenes(readNamedScenes().filter((s) => s.id !== id));
}

export function tryDecodeShareFromHash(hash: string): SceneData | null {
  const m = hash.match(/[#&?]s=([A-Za-z0-9_-]+)/);
  if (!m?.[1]) return null;
  const decoded = decodeSceneShare(m[1]) as SceneData | null;
  if (!decoded?.meshes) return null;
  return decoded;
}

export function buildShareUrl(origin: string, path: string, search: string, data: unknown): string {
  const token = encodeSceneShare(data);
  return `${origin}${path}${search}#s=${token}`;
}

export { scenePresets, encodeSceneShare, decodeSceneShare };
