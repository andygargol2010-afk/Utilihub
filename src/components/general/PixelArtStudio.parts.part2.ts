// Part 2 of 3 — split from PixelArtStudio.parts.ts on 2026-11-04. Edit here; PixelArtStudio.parts.ts re-exports.
import { emptyLayer } from "./PixelArtStudio.parts.part1";

export function cloneLayers(layers: string[][]) { return layers.map((l) => l.slice()); }


/* examples-v1 */
export function exampleLayers(id: string, size: number): string[][] {
  const layer = emptyLayer(size);
  const set = (x: number, y: number, c: string) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    layer[y * size + x] = c;
  };
  const mid = Math.floor(size / 2);
  const s = size / 32;
  if (id === "heart") {
    const pts: [number, number][] = [
      [8, 6], [9, 5], [10, 5], [11, 6], [12, 7], [13, 8], [14, 9], [15, 10],
      [16, 10], [17, 9], [18, 8], [19, 7], [20, 6], [21, 5], [22, 5], [23, 6],
      [23, 7], [22, 8], [21, 10], [20, 12], [18, 15], [16, 18], [15, 20], [14, 18],
      [12, 15], [10, 12], [9, 10], [8, 8], [8, 7],
    ];
    for (const [x, y] of pts) set(Math.floor(x * s), Math.floor(y * s), "#e94560");
  } else if (id === "smiley") {
    const r = Math.floor(size * 0.35);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - mid, dy = y - mid;
        if (dx * dx + dy * dy <= r * r) set(x, y, "#feca57");
      }
    }
    const eye = Math.max(1, Math.floor(size / 16));
    for (let dy = -eye; dy <= eye; dy++) {
      for (let dx = -eye; dx <= eye; dx++) {
        set(mid - Math.floor(size / 6) + dx, mid - Math.floor(size / 8) + dy, "#1a1a2e");
        set(mid + Math.floor(size / 6) + dx, mid - Math.floor(size / 8) + dy, "#1a1a2e");
      }
    }
    for (let a = 0.25; a < Math.PI - 0.25; a += 0.08) {
      set(mid + Math.floor(Math.cos(a) * r * 0.55), mid + Math.floor(Math.sin(a) * r * 0.55), "#1a1a2e");
    }
  } else if (id === "sword") {
    for (let y = Math.floor(4 * s); y < Math.floor(22 * s); y++) set(mid, y, "#c8d6e5");
    for (let x = mid - Math.floor(3 * s); x <= mid + Math.floor(3 * s); x++) set(x, Math.floor(22 * s), "#ab5236");
    set(mid, Math.floor(3 * s), "#fff1e8");
    set(mid - 1, Math.floor(4 * s), "#c8d6e5");
    set(mid + 1, Math.floor(4 * s), "#c8d6e5");
  } else if (id === "tree") {
    for (let y = Math.floor(18 * s); y < Math.floor(28 * s); y++) {
      for (let x = mid - Math.floor(1 * s); x <= mid + Math.floor(1 * s); x++) set(x, y, "#6b4226");
    }
    for (let y = Math.floor(6 * s); y < Math.floor(18 * s); y++) {
      const w = Math.floor((18 * s - y) * 0.45) + Math.floor(2 * s);
      for (let x = mid - w; x <= mid + w; x++) set(x, y, "#10ac84");
    }
  } else if (id === "letter") {
    for (let y = Math.floor(6 * s); y < Math.floor(26 * s); y++) {
      set(Math.floor(10 * s), y, "#54a0ff");
      set(Math.floor(11 * s), y, "#54a0ff");
    }
    for (let x = Math.floor(10 * s); x < Math.floor(20 * s); x++) {
      set(x, Math.floor(6 * s), "#54a0ff");
      set(x, Math.floor(7 * s), "#54a0ff");
      set(x, Math.floor(14 * s), "#54a0ff");
      set(x, Math.floor(15 * s), "#54a0ff");
    }
    for (let y = Math.floor(6 * s); y <= Math.floor(15 * s); y++) {
      set(Math.floor(19 * s), y, "#54a0ff");
      set(Math.floor(20 * s), y, "#54a0ff");
    }
  } else {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if ((x + y) % 2 === 0) set(x, y, "#e94560");
      }
    }
  }
  return [layer, emptyLayer(size)];
}


/* share-v1 */
export function toBase64Url(str: string) {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
