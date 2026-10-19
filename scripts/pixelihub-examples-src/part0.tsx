import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type ToolId = "pencil" | "eraser" | "eyedropper" | "fill" | "line" | "rect" | "circle";
type Symmetry = "none" | "x" | "y" | "xy";

const SIZES = [8, 16, 32, 64, 128, 256] as const;
const MAX_LAYERS = 4;
const STORAGE_KEY = "utilihub-pixelihub-v1";
/* onboarding-v1 */
const ONBOARD_KEY = "utilihub-pixelihub-onboard-v1";
/* palettes-v1 */
const PALETTE_PRESETS: { id: string; labelEn: string; labelEs: string; colors: string[] }[] = [
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

function emptyLayer(n: number) { return Array(n * n).fill("") as string[]; }
function cloneLayers(layers: string[][]) { return layers.map((l) => l.slice()); }

/* examples-v1 */
function exampleLayers(id: string, size: number): string[][] {
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
function toBase64Url(str: string) {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
