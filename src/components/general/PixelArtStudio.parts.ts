// PixelArtStudio helpers — split from PixelArtStudio.tsx on 2026-11-03 (part 2 of 2).
export type Locale = "en" | "es";
export type ToolId = "pencil" | "eraser" | "eyedropper" | "fill" | "line" | "rect" | "circle";
export type Symmetry = "none" | "x" | "y" | "xy";

export const SIZES = [8, 16, 32, 64, 128, 256] as const;
export const MAX_LAYERS = 4;
export const STORAGE_KEY = "utilihub-pixelihub-v1";
/* onboarding-v1 */
export const ONBOARD_KEY = "utilihub-pixelihub-onboard-v1";
/* palettes-v1 */
export const PALETTE_PRESETS: { id: string; labelEn: string; labelEs: string; colors: string[] }[] = [
  {
    id: "default",
    labelEn: "Default",
    labelEs: "Default",
    colors: [
      "#000000", "#1a1a2e", "#16213e", "#0f3460", "#e94560", "#ff6b6b", "#feca57", "#ff9ff3",
      "#54a0ff", "#5f27cd", "#01a3a4", "#10ac84", "#ffffff", "#c8d6e5", "#8395a7", "#576574",
      "#222f3e", "#ee5a24", "#f79f1f", "#a3cb38", "#1289a7", "#d980fa", "#bdc3c7", "#6c5ce7",
    ],
  },
  {
    id: "pico",
    labelEn: "Retro 16",
    labelEs: "Retro 16",
    colors: [
      "#000000", "#1d2b53", "#7e2553", "#008751", "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8",
      "#ff004d", "#ffa300", "#ffec27", "#00e436", "#29adff", "#83769c", "#ff77a8", "#ffccaa",
    ],
  },
  {
    id: "earth",
    labelEn: "Earth",
    labelEs: "Tierra",
    colors: [
      "#1a120b", "#3d2914", "#6b4226", "#a67c52", "#d4a574", "#f5e6d3", "#2d4a22", "#4a7c3f",
      "#8fbc8f", "#c4e0c4", "#4a3728", "#8b6914", "#c9a227", "#5c4033", "#ffffff", "#000000",
    ],
  },
  {
    id: "pastel",
    labelEn: "Pastel",
    labelEs: "Pastel",
    colors: [
      "#f8f1f1", "#ffe5ec", "#ffc2d1", "#ffb3c6", "#ff8fab", "#fb6f92", "#e0aaff", "#c77dff",
      "#9b5de5", "#a0c4ff", "#bdb2ff", "#caffbf", "#fdffb6", "#ffd6a5", "#ffadad", "#2b2d42",
    ],
  },
  {
    id: "mono",
    labelEn: "Mono",
    labelEs: "Mono",
    colors: [
      "#000000", "#111111", "#222222", "#333333", "#555555", "#777777", "#999999", "#bbbbbb",
      "#dddddd", "#ffffff", "#1a1a1a", "#2e2e2e", "#424242", "#616161", "#9e9e9e", "#e0e0e0",
    ],
  },
  {
    id: "neon",
    labelEn: "Neon",
    labelEs: "Neón",
    colors: [
      "#0d0d0d", "#1a0033", "#ff00ff", "#00ffff", "#39ff14", "#ff073a", "#fff01f", "#ff6ec7",
      "#7df9ff", "#b6ff00", "#fe019a", "#0ff0fc", "#ccff00", "#ff3131", "#ffffff", "#222222",
    ],
  },
];

export function emptyLayer(n: number) { return Array(n * n).fill("") as string[]; }
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
