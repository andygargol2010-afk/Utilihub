import { emptyLayer } from "./PixelArtStudio.parts.part1";
import { toBase64Url } from "./PixelArtStudio.parts.part2";
export { SIZES, MAX_LAYERS, STORAGE_KEY, ONBOARD_KEY, PALETTE_PRESETS, emptyLayer } from "./PixelArtStudio.parts.part1";
export type { Locale, ToolId, Symmetry } from "./PixelArtStudio.parts.part1";
export { cloneLayers, exampleLayers, toBase64Url } from "./PixelArtStudio.parts.part2";

export function fromBase64Url(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return decodeURIComponent(escape(atob(b64)));
}
export function encodeSharePayload(size: number, layers: string[][]) {
  const L = layers.map((layer) => {
    const sparse: string[] = [];
    for (let i = 0; i < layer.length; i++) {
      const c = layer[i];
      if (c && c.startsWith("#") && c.length === 7) sparse.push(`${i}:${c.slice(1)}`);
    }
    return sparse;
  });
  return toBase64Url(JSON.stringify({ v: 1, s: size, L }));
}
export function decodeSharePayload(encoded: string): { size: number; layers: string[][] } | null {
  try {
    const data = JSON.parse(fromBase64Url(encoded)) as { v?: number; s?: number; L?: string[][] };
    if (!data || data.v !== 1 || !data.s || !Array.isArray(data.L)) return null;
    const size = data.s;
    if (![8, 16, 32, 64, 128, 256].includes(size)) return null;
    const layers = data.L.slice(0, 4).map((sparse) => {
      const layer = emptyLayer(size);
      if (!Array.isArray(sparse)) return layer;
      for (const entry of sparse) {
        const [idxStr, hex] = entry.split(":");
        const idx = Number(idxStr);
        if (!Number.isFinite(idx) || idx < 0 || idx >= size * size) continue;
        if (!hex || !/^[0-9a-fA-F]{6}$/.test(hex)) continue;
        layer[idx] = `#${hex.toLowerCase()}`;
      }
      return layer;
    });
    if (!layers.length) layers.push(emptyLayer(size));
    return { size, layers };
  } catch {
    return null;
  }
}

export function floodFill(data: string[], size: number, x: number, y: number, target: string, repl: string) {
  if (target === repl) return;
  const stack: [number, number][] = [[x, y]];
  const seen = new Uint8Array(size * size);
  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    if (cx < 0 || cy < 0 || cx >= size || cy >= size) continue;
    const i = cy * size + cx;
    if (seen[i] || data[i] !== target) continue;
    seen[i] = 1; data[i] = repl;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
}

export function plotLine(x0: number, y0: number, x1: number, y1: number, plot: (x: number, y: number) => void) {
  let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    plot(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

export function plotRect(x0: number, y0: number, x1: number, y1: number, plot: (x: number, y: number) => void) {
  const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
  for (let x = minX; x <= maxX; x++) { plot(x, minY); plot(x, maxY); }
  for (let y = minY; y <= maxY; y++) { plot(minX, y); plot(maxX, y); }
}

export function plotCircle(cx: number, cy: number, x1: number, y1: number, plot: (x: number, y: number) => void) {
  const r = Math.max(Math.abs(x1 - cx), Math.abs(y1 - cy));
  let x = r, y = 0, err = 1 - r;
  while (x >= y) {
    plot(cx + x, cy + y); plot(cx + y, cy + x); plot(cx - y, cy + x); plot(cx - x, cy + y);
    plot(cx - x, cy - y); plot(cx - y, cy - x); plot(cx + y, cy - x); plot(cx + x, cy - y);
    y++;
    if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; }
  }
}
