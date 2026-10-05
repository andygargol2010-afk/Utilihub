import type { GeneralTool } from "@/lib/general/types";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

type PartKind = "wall" | "floor" | "roof" | "column" | "door" | "window" | "stairs" | "railing" | "chimney";
type Locale = "en" | "es";

type ScenePart = {
  id: string;
  kind: PartKind;
  position: [number, number, number];
  rotationY: number;
  mesh: THREE.Mesh;
};

const GRID = 0.5;

function snap(v: number) {
  return Math.round(v / GRID) * GRID;
}

/** Dispose unique geometries. Materials only when they are not the shared catalog set (ghost clones). */
function disposeObjectResources(obj: THREE.Object3D, disposeMaterials: boolean) {
  obj.traverse((c) => {
    if (c instanceof THREE.Mesh || c instanceof THREE.Line) {
      c.geometry?.dispose();
      if (disposeMaterials) {
        const mat = c.material;
        const list = Array.isArray(mat) ? mat : [mat];
        for (const m of list) m?.dispose();
      }
    }
  });
}

function uid() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function hash2(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Procedural albedo/roughness ≤256px. Shared across parts; do not dispose on ghost clones. */
function makeCanvasTexture(
  size: number,
  paint: (ctx: CanvasRenderingContext2D, size: number) => void,
  srgb: boolean,
) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  paint(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function noiseFill(
  ctx: CanvasRenderingContext2D,
  size: number,
  base: [number, number, number],
  amp: number,
) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = (hash2(x * 0.73, y * 0.73) - 0.5) * amp;
      const coarse = (hash2(Math.floor(x / 8), Math.floor(y / 8)) - 0.5) * amp * 0.55;
      const i = (y * size + x) * 4;
      d[i] = Math.min(255, Math.max(0, base[0] + n + coarse));
      d[i + 1] = Math.min(255, Math.max(0, base[1] + n * 0.92 + coarse));
      d[i + 2] = Math.min(255, Math.max(0, base[2] + n * 0.8 + coarse));
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintPlaster(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [214, 204, 188], 16);
  // Lime-wash patches: walls read as troweled plaster, not uniform noise.
  for (let i = 0; i < 14; i++) {
    const x = hash2(i, 2.1) * size;
    const y = hash2(i, 5.4) * size;
    const rx = 18 + hash2(i, 8) * 40;
    const ry = 12 + hash2(i, 3) * 26;
    const lift = hash2(i, 1.2) > 0.5 ? 16 : -14;
    ctx.fillStyle = `rgba(${198 + lift}, ${188 + Math.floor(lift * 0.75)}, ${170 + Math.floor(lift * 0.4)}, 0.24)`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, hash2(i, 9) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(148,136,120,0.22)";
  ctx.lineWidth = 1;
  for (let s = 0; s < 10; s++) {
    const y = hash2(s, 4.2) * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 10) {
      ctx.lineTo(x, y + Math.sin(x * 0.05 + s) * 2.2);
    }
    ctx.stroke();
  }
}

/** Grayscale trowel relief used as a wall bump map (not sRGB). */
function paintPlasterBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#8e8e8e";
  ctx.fillRect(0, 0, size, size);
  for (let s = 0; s < 14; s++) {
    const y = (s / 14) * size + (hash2(s, 2) - 0.5) * 5;
    ctx.strokeStyle = hash2(s, 7) > 0.45 ? "rgba(255,255,255,0.38)" : "rgba(30,30,30,0.28)";
    ctx.lineWidth = 1 + hash2(s, 3) * 1.4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 8) {
      ctx.lineTo(x, y + Math.sin(x * 0.07 + s * 1.3) * 2.8);
    }
    ctx.stroke();
  }
}

function paintPlinth(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [158, 146, 130], 14);
  const cols = 6;
  const rows = 3;
  const mortar = 3;
  for (let r = 0; r < rows; r++) {
    const y0 = (r / rows) * size;
    const rh = size / rows;
    const shift = r % 2 === 0 ? 0 : size / cols / 2;
    for (let c = -1; c < cols + 1; c++) {
      const vary = hash2(c + 2, r + 5);
      const tone = 150 + Math.floor(vary * 36);
      ctx.fillStyle = `rgb(${tone + 8}, ${tone - 2}, ${tone - 16})`;
      const x = c * (size / cols) + shift + mortar;
      const w = size / cols - mortar * 1.4;
      ctx.fillRect(x, y0 + mortar, w, rh - mortar * 1.6);
      // Chipped top edge so the course is not a perfect grid.
      ctx.fillStyle = `rgba(${tone - 28}, ${tone - 34}, ${tone - 40}, 0.45)`;
      ctx.fillRect(x + vary * 6, y0 + mortar, 4 + vary * 8, 2);
    }
  }
  ctx.strokeStyle = "rgba(72,60,48,0.55)";
  ctx.lineWidth = 1;
  for (let r = 0; r <= rows; r++) {
    const y = (r / rows) * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
}

function paintTimber(ctx: CanvasRenderingContext2D, size: number) {
  const planks = 6;
  for (let i = 0; i < planks; i++) {
    const y0 = Math.floor((i / planks) * size);
    const y1 = Math.floor(((i + 1) / planks) * size);
    const tone = 110 + Math.floor(hash2(i, 4) * 36);
    ctx.fillStyle = `rgb(${tone + 34}, ${tone - 2}, ${tone - 36})`;
    ctx.fillRect(0, y0, size, y1 - y0);
    // Staggered end joint so boards do not run as one endless plank.
    const joint = (0.18 + hash2(i, 11) * 0.58) * size;
    ctx.fillStyle = "rgba(46,28,14,0.7)";
    ctx.fillRect(joint, y0 + 1, 2, Math.max(2, y1 - y0 - 2));
    ctx.strokeStyle = "rgba(58,36,18,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y1 - 1);
    ctx.lineTo(size, y1 - 1);
    ctx.stroke();
    ctx.strokeStyle = "rgba(96,62,34,0.34)";
    ctx.lineWidth = 1;
    for (let g = 0; g < 4; g++) {
      const gy = y0 + 4 + g * ((y1 - y0) / 5);
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= size; x += 8) {
        ctx.lineTo(x, gy + Math.sin(x * 0.09 + i * 1.7) * 1.5);
      }
      ctx.stroke();
    }
    const kx = hash2(i, 6.2) * size;
    const ky = y0 + (y1 - y0) * 0.48;
    const kr = 3 + hash2(i, 8) * 4.2;
    const kg = ctx.createRadialGradient(kx, ky, 0.4, kx, ky, kr);
    kg.addColorStop(0, "rgba(64,36,18,0.9)");
    kg.addColorStop(0.65, "rgba(118,72,38,0.4)");
    kg.addColorStop(1, "rgba(118,72,38,0)");
    ctx.fillStyle = kg;
    ctx.beginPath();
    ctx.ellipse(kx, ky, kr, kr * 0.7, 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Groove map: dark joints, lighter board faces. */
function paintTimberBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#b0b0b0";
  ctx.fillRect(0, 0, size, size);
  const planks = 6;
  ctx.fillStyle = "#3a3a3a";
  for (let i = 1; i < planks; i++) {
    const y = Math.floor((i / planks) * size);
    ctx.fillRect(0, y - 1, size, 3);
  }
  for (let i = 0; i < planks; i++) {
    const y0 = Math.floor((i / planks) * size);
    const y1 = Math.floor(((i + 1) / planks) * size);
    const joint = (0.18 + hash2(i, 11) * 0.58) * size;
    ctx.fillRect(joint, y0, 3, y1 - y0);
  }
}

function paintClayTiles(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#5c3224";
  ctx.fillRect(0, 0, size, size);
  const rows = 8;
  const cols = 6;
  const rh = size / rows;
  const cw = size / cols;
  for (let r = 0; r < rows; r++) {
    const shift = r % 2 === 0 ? 0 : cw * 0.5;
    for (let c = -1; c < cols + 1; c++) {
      const vary = hash2(c + 3, r + 11);
      const rr = 104 + Math.floor(vary * 34);
      const gg = 48 + Math.floor(vary * 20);
      const bb = 34 + Math.floor(vary * 12);
      const x = c * cw + shift;
      const y = r * rh;
      ctx.fillStyle = `rgb(${rr}, ${gg}, ${bb})`;
      ctx.beginPath();
      ctx.moveTo(x + 2, y + rh * 0.35);
      ctx.quadraticCurveTo(x + cw * 0.5, y - rh * 0.15, x + cw - 2, y + rh * 0.35);
      ctx.lineTo(x + cw - 2, y + rh - 1);
      ctx.quadraticCurveTo(x + cw * 0.5, y + rh * 0.55, x + 2, y + rh - 1);
      ctx.closePath();
      ctx.fill();
      // Underlap shadow and crown highlight so courses overlap instead of flat stamps.
      ctx.fillStyle = "rgba(36,16,10,0.38)";
      ctx.fillRect(x + 3, y + rh * 0.78, cw - 6, rh * 0.18);
      ctx.strokeStyle = "rgba(186,120,86,0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x + 6, y + rh * 0.32);
      ctx.quadraticCurveTo(x + cw * 0.5, y + rh * 0.02, x + cw - 6, y + rh * 0.32);
      ctx.stroke();
      ctx.strokeStyle = "rgba(48,22,16,0.5)";
      ctx.stroke();
    }
  }
}

function paintTileBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#6e6e6e";
  ctx.fillRect(0, 0, size, size);
  const rows = 8;
  const cols = 6;
  const rh = size / rows;
  const cw = size / cols;
  for (let r = 0; r < rows; r++) {
    const shift = r % 2 === 0 ? 0 : cw * 0.5;
    for (let c = -1; c < cols + 1; c++) {
      const x = c * cw + shift;
      const y = r * rh;
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + rh * 0.38);
      ctx.quadraticCurveTo(x + cw * 0.5, y + rh * 0.05, x + cw - 4, y + rh * 0.38);
      ctx.stroke();
      ctx.strokeStyle = "rgba(20,20,20,0.65)";
      ctx.beginPath();
      ctx.moveTo(x + 3, y + rh * 0.86);
      ctx.lineTo(x + cw - 3, y + rh * 0.86);
      ctx.stroke();
    }
  }
}

function paintPlate(ctx: CanvasRenderingContext2D, size: number) {
  // Wall head plate: sawn oak with checks, not a second plaster map.
  noiseFill(ctx, size, [132, 86, 48], 18);
  const beams = 2;
  for (let i = 0; i < beams; i++) {
    const y0 = Math.floor((i / beams) * size);
    const y1 = Math.floor(((i + 1) / beams) * size);
    const tone = 118 + Math.floor(hash2(i, 3.3) * 28);
    ctx.fillStyle = `rgb(${tone + 40}, ${tone - 6}, ${tone - 42})`;
    ctx.fillRect(0, y0, size, y1 - y0);
    ctx.strokeStyle = "rgba(62,34,16,0.55)";
    ctx.lineWidth = 1;
    for (let g = 0; g < 5; g++) {
      const gy = y0 + 6 + g * ((y1 - y0) / 6);
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= size; x += 6) {
        ctx.lineTo(x, gy + Math.sin(x * 0.04 + i) * 1.1);
      }
      ctx.stroke();
    }
    const split = (0.3 + hash2(i, 9) * 0.4) * size;
    ctx.fillStyle = "rgba(40,22,10,0.75)";
    ctx.fillRect(split, y0 + 2, 2, y1 - y0 - 4);
  }
  ctx.fillStyle = "rgba(36,20,10,0.8)";
  ctx.fillRect(0, size / 2 - 2, size, 4);
}

function paintPlateBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#a4a4a4";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#3c3c3c";
  ctx.fillRect(0, size / 2 - 2, size, 5);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1;
  for (let g = 0; g < 8; g++) {
    const y = (g / 8) * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + 1);
    ctx.stroke();
  }
}

function paintNosing(ctx: CanvasRenderingContext2D, size: number) {
  // Board edge / end grain so the slab reads as timber, not a flat tile.
  noiseFill(ctx, size, [96, 62, 36], 16);
  const boards = 5;
  for (let i = 0; i < boards; i++) {
    const x0 = Math.floor((i / boards) * size);
    const x1 = Math.floor(((i + 1) / boards) * size);
    const tone = 92 + Math.floor(hash2(i, 6.1) * 30);
    ctx.fillStyle = `rgb(${tone + 28}, ${tone - 4}, ${tone - 28})`;
    ctx.fillRect(x0, 0, x1 - x0, size);
    const cx = (x0 + x1) / 2;
    const cy = size * (0.35 + hash2(i, 2) * 0.3);
    for (let ring = 3; ring >= 1; ring--) {
      ctx.strokeStyle = `rgba(54,30,14,${0.18 + ring * 0.12})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, (x1 - x0) * 0.28 * ring / 3, size * 0.18 * ring / 3, 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(42,24,12,0.8)";
    ctx.fillRect(x1 - 2, 0, 2, size);
  }
}

function paintFascia(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [108, 78, 52], 14);
  ctx.fillStyle = "#6d4a30";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 7; i++) {
    const y0 = Math.floor((i / 7) * size);
    const h = Math.floor(size / 7) - 2;
    const tone = 102 + Math.floor(hash2(i, 4.4) * 32);
    ctx.fillStyle = `rgb(${tone + 22}, ${tone - 8}, ${tone - 30})`;
    ctx.fillRect(1, y0 + 1, size - 2, h);
    ctx.strokeStyle = "rgba(70,42,22,0.4)";
    ctx.lineWidth = 1;
    const gy = y0 + h * 0.45;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    for (let x = 0; x <= size; x += 8) ctx.lineTo(x, gy + Math.sin(x * 0.08 + i) * 1.2);
    ctx.stroke();
  }
  // Weathered drip line along the lower edge.
  ctx.fillStyle = "rgba(42,26,16,0.55)";
  ctx.fillRect(0, size - 6, size, 6);
}

function paintDoorLeaf(ctx: CanvasRenderingContext2D, size: number) {
  // Stained raised-panel leaf: stiles and rails lighter, recessed fields darker.
  noiseFill(ctx, size, [118, 74, 42], 12);
  ctx.fillStyle = "#7a4e30";
  ctx.fillRect(0, 0, size, size);
  const stile = Math.floor(size * 0.12);
  const rail = Math.floor(size * 0.1);
  ctx.fillStyle = "#8d5c38";
  ctx.fillRect(0, 0, stile, size);
  ctx.fillRect(size - stile, 0, stile, size);
  ctx.fillRect(0, 0, size, rail);
  ctx.fillRect(0, size - rail, size, rail);
  const mid = Math.floor(size * 0.46);
  ctx.fillRect(0, mid - rail / 2, size, rail);
  const fields: Array<[number, number, number, number]> = [
    [stile, rail, size - stile * 2, mid - rail - rail / 2],
    [stile, mid + rail / 2, size - stile * 2, size - rail - (mid + rail / 2)],
  ];
  for (let f = 0; f < fields.length; f++) {
    const [x, y, w, h] = fields[f];
    const tone = 92 + Math.floor(hash2(f, 4.4) * 18);
    ctx.fillStyle = `rgb(${tone + 18}, ${tone - 8}, ${tone - 28})`;
    ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
    ctx.strokeStyle = "rgba(48,26,14,0.55)";
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 6, y + 6, w - 12, h - 12);
    ctx.strokeStyle = "rgba(176,124,78,0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);
    for (let g = 0; g < 4; g++) {
      const gy = y + 14 + g * (h / 5);
      ctx.strokeStyle = "rgba(70,40,22,0.28)";
      ctx.beginPath();
      ctx.moveTo(x + 12, gy);
      for (let px = x + 12; px < x + w - 12; px += 8) {
        ctx.lineTo(px, gy + Math.sin(px * 0.06 + f) * 1.1);
      }
      ctx.stroke();
    }
  }
}

function paintDoorLeafBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#9a9a9a";
  ctx.fillRect(0, 0, size, size);
  const stile = Math.floor(size * 0.12);
  const rail = Math.floor(size * 0.1);
  ctx.fillStyle = "#d2d2d2";
  ctx.fillRect(0, 0, stile, size);
  ctx.fillRect(size - stile, 0, stile, size);
  ctx.fillRect(0, 0, size, rail);
  ctx.fillRect(0, size - rail, size, rail);
  const mid = Math.floor(size * 0.46);
  ctx.fillRect(0, mid - rail / 2, size, rail);
  ctx.fillStyle = "#4a4a4a";
  ctx.fillRect(stile + 8, rail + 8, size - stile * 2 - 16, mid - rail - rail / 2 - 12);
  ctx.fillRect(stile + 8, mid + rail / 2 + 8, size - stile * 2 - 16, size - rail - (mid + rail / 2) - 16);
}


function paintJoinery(ctx: CanvasRenderingContext2D, size: number) {
  // Painted sash: cream enamel over timber, brush drag, not the oak plate map.
  noiseFill(ctx, size, [214, 206, 190], 10);
  ctx.fillStyle = "#d9d0c0";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 9; i++) {
    const y0 = Math.floor((i / 9) * size);
    const h = Math.floor(size / 9);
    const tone = 206 + Math.floor(hash2(i, 2.8) * 22);
    ctx.fillStyle = `rgb(${tone}, ${tone - 6}, ${tone - 18})`;
    ctx.fillRect(0, y0, size, h - 1);
    ctx.strokeStyle = "rgba(120,104,82,0.22)";
    ctx.lineWidth = 1;
    const gy = y0 + h * 0.45;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    for (let x = 0; x <= size; x += 7) ctx.lineTo(x, gy + Math.sin(x * 0.05 + i) * 0.9);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(92,78,62,0.35)";
  ctx.fillRect(0, size - 4, size, 4);
  ctx.fillRect(0, 0, size, 3);
}

function paintJoineryBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#b8b8b8";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    const y = Math.floor((i / 9) * size) + 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 8) ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 0.8);
    ctx.stroke();
  }
  ctx.fillStyle = "#4a4a4a";
  ctx.fillRect(0, size - 4, size, 4);
}

function paintGlazing(ctx: CanvasRenderingContext2D, size: number) {
  // Sky-tinted pane with faint reflection streaks and edge dirt. Mostly light so the tint still shows.
  ctx.fillStyle = "#e7eef2";
  ctx.fillRect(0, 0, size, size);
  const sky = ctx.createLinearGradient(0, 0, size, size);
  sky.addColorStop(0, "rgba(210,226,234,0.55)");
  sky.addColorStop(0.45, "rgba(176,198,210,0.2)");
  sky.addColorStop(1, "rgba(148,168,176,0.35)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 5; i++) {
    const y = (0.12 + hash2(i, 3.1) * 0.7) * size;
    ctx.strokeStyle = `rgba(255,255,255,${0.18 + hash2(i, 6) * 0.22})`;
    ctx.lineWidth = 2 + hash2(i, 1.4) * 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 10) ctx.lineTo(x, y + Math.sin(x * 0.03 + i) * 4);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(72,64,54,0.28)";
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, size - 8, size - 8);
  for (let i = 0; i < 18; i++) {
    const x = hash2(i, 8.2) * size;
    const y = hash2(i, 1.9) * size;
    if (x > 18 && x < size - 18 && y > 18 && y < size - 18 && hash2(i, 4) > 0.35) continue;
    ctx.fillStyle = `rgba(90,82,70,${0.12 + hash2(i, 5) * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 1.2 + hash2(i, 7) * 2.4, 0.8, hash2(i, 2) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintGlazingRough(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(0, 0, size, size);
  const g = ctx.createRadialGradient(size * 0.42, size * 0.38, size * 0.05, size / 2, size / 2, size * 0.72);
  g.addColorStop(0, "#1c1c1c");
  g.addColorStop(0.65, "#3a3a3a");
  g.addColorStop(1, "#9a9a9a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#c8c8c8";
  ctx.lineWidth = 10;
  ctx.strokeRect(2, 2, size - 4, size - 4);
  for (let i = 0; i < 5; i++) {
    const y = (0.12 + hash2(i, 3.1) * 0.7) * size;
    ctx.strokeStyle = "rgba(90,90,90,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 10) ctx.lineTo(x, y + Math.sin(x * 0.03 + i) * 4);
    ctx.stroke();
  }
}

function paintNosingBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#a8a8a8";
  ctx.fillRect(0, 0, size, size);
  const boards = 5;
  for (let i = 0; i < boards; i++) {
    const x0 = Math.floor((i / boards) * size);
    const x1 = Math.floor(((i + 1) / boards) * size);
    const cx = (x0 + x1) / 2;
    const cy = size * (0.35 + hash2(i, 2) * 0.3);
    for (let ring = 3; ring >= 1; ring--) {
      ctx.strokeStyle = ring % 2 === 0 ? "rgba(255,255,255,0.45)" : "rgba(20,20,20,0.4)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, ((x1 - x0) * 0.28 * ring) / 3, (size * 0.18 * ring) / 3, 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#303030";
    ctx.fillRect(x1 - 2, 0, 3, size);
  }
}

function paintFasciaBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#b4b4b4";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#3a3a3a";
  for (let i = 1; i < 7; i++) {
    const y = Math.floor((i / 7) * size);
    ctx.fillRect(0, y - 1, size, 3);
  }
  ctx.fillRect(0, size - 6, size, 6);
}

function paintGravel(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [158, 148, 132], 28);
  for (let i = 0; i < 90; i++) {
    const x = hash2(i, 1.7) * size;
    const y = hash2(i, 4.1) * size;
    const r = 1.2 + hash2(i, 9) * 3.4;
    const tone = 120 + Math.floor(hash2(i, 2.4) * 70);
    ctx.fillStyle = `rgba(${tone}, ${tone - 8}, ${tone - 18}, 0.55)`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.7 + hash2(i, 6) * 0.4), hash2(i, 3) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  // Compacted center so the build pad reads slightly darker than the rim.
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size * 0.52);
  g.addColorStop(0, "rgba(70,60,48,0.22)");
  g.addColorStop(0.7, "rgba(70,60,48,0.06)");
  g.addColorStop(1, "rgba(70,60,48,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

function paintGrass(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [86, 112, 58], 26);
  for (let i = 0; i < 48; i++) {
    const x = hash2(i, 2.2) * size;
    const y = hash2(i, 8.4) * size;
    const rx = 5 + hash2(i, 5) * 16;
    const ry = rx * (0.45 + hash2(i, 6) * 0.4);
    const g = 88 + Math.floor(hash2(i, 3) * 55);
    const r = 62 + Math.floor(hash2(i, 1) * 30);
    ctx.fillStyle = `rgba(${r}, ${g}, ${40 + Math.floor(hash2(i, 7) * 18)}, 0.38)`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, hash2(i, 4) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(50,70,32,0.18)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 30; i++) {
    const x = hash2(i, 12) * size;
    const y = hash2(i, 19) * size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (hash2(i, 2) - 0.5) * 6, y - 4 - hash2(i, 8) * 6);
    ctx.stroke();
  }
}

/** Blade clumps as height so the field catches the key light instead of reading as a flat disc. */
function paintGrassRelief(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#7a7a7a";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 70; i++) {
    const x = hash2(i, 2.2) * size;
    const y = hash2(i, 8.4) * size;
    const rx = 4 + hash2(i, 5) * 14;
    const ry = rx * (0.4 + hash2(i, 6) * 0.35);
    const lift = hash2(i, 3) > 0.45 ? 210 : 92;
    ctx.fillStyle = `rgba(${lift}, ${lift}, ${lift}, 0.42)`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, hash2(i, 4) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.lineWidth = 1;
  for (let i = 0; i < 46; i++) {
    const x = hash2(i, 12) * size;
    const y = hash2(i, 19) * size;
    ctx.strokeStyle = hash2(i, 1.4) > 0.5 ? "rgba(255,255,255,0.45)" : "rgba(20,20,20,0.35)";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (hash2(i, 2) - 0.5) * 7, y - 5 - hash2(i, 8) * 7);
    ctx.stroke();
  }
}

/** Packed earth for the access path and apron: worn center, pebble rim. */
function paintWornEarth(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [138, 118, 92], 22);
  for (let i = 0; i < 64; i++) {
    const x = hash2(i, 3.1) * size;
    const y = hash2(i, 6.6) * size;
    const r = 1 + hash2(i, 8) * 2.8;
    const tone = 108 + Math.floor(hash2(i, 2.2) * 62);
    ctx.fillStyle = `rgba(${tone + 8}, ${tone - 4}, ${tone - 18}, 0.5)`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.72, hash2(i, 4) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.48);
  g.addColorStop(0, "rgba(62,48,34,0.28)");
  g.addColorStop(0.55, "rgba(92,74,52,0.08)");
  g.addColorStop(1, "rgba(92,74,52,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

function paintContactAO(ctx: CanvasRenderingContext2D, size: number) {
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, size * 0.08, c, c, size * 0.5);
  g.addColorStop(0, "rgba(28,24,16,0.55)");
  g.addColorStop(0.45, "rgba(28,24,16,0.22)");
  g.addColorStop(1, "rgba(28,24,16,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

/** Soft horizon band so the grass disc dissolves into the sky instead of a hard edge. */
function paintHorizonHaze(ctx: CanvasRenderingContext2D, size: number) {
  const g = ctx.createLinearGradient(0, 0, 0, size);
  g.addColorStop(0, "rgba(198,193,176,0)");
  g.addColorStop(0.42, "rgba(198,190,168,0.26)");
  g.addColorStop(1, "rgba(188,178,152,0.7)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

/** Additive sun disc so the key-light direction reads in the sky shell. */
function paintSunDisc(ctx: CanvasRenderingContext2D, size: number) {
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, size * 0.04, c, c, size * 0.5);
  g.addColorStop(0, "rgba(255,248,230,0.95)");
  g.addColorStop(0.16, "rgba(255,214,150,0.62)");
  g.addColorStop(0.42, "rgba(255,176,96,0.14)");
  g.addColorStop(1, "rgba(255,176,96,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

/** Tangent-space normal from the height already painted into the canvas (not sRGB). */
function paintNormalFromHeight(ctx: CanvasRenderingContext2D, size: number, strength: number) {
  const img = ctx.getImageData(0, 0, size, size);
  const src = new Uint8ClampedArray(img.data);
  const d = img.data;
  const h = (x: number, y: number) => {
    const x2 = (x + size) % size;
    const y2 = (y + size) % size;
    return src[(y2 * size + x2) * 4] / 255;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (h(x + 1, y) - h(x - 1, y)) * strength;
      const dy = (h(x, y + 1) - h(x, y - 1)) * strength;
      const nx = -dx;
      const ny = -dy;
      const nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      const i = (y * size + x) * 4;
      d[i] = (nx / len) * 127.5 + 127.5;
      d[i + 1] = (ny / len) * 127.5 + 127.5;
      d[i + 2] = (nz / len) * 127.5 + 127.5;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintRoughness(ctx: CanvasRenderingContext2D, size: number, base: number, amp: number) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = base + (hash2(x, y) - 0.5) * amp;
      const v = Math.min(255, Math.max(0, n));
      const i = (y * size + x) * 4;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** Turn the painted albedo into a roughness map so joints and crowns are not independent noise. */
function paintRoughFromAlbedo(
  ctx: CanvasRenderingContext2D,
  size: number,
  base: number,
  amp: number,
  invert: boolean,
) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const luma = d[i] * 0.3 + d[i + 1] * 0.52 + d[i + 2] * 0.18;
      const centered = luma / 255 - 0.5;
      const grain = (hash2(x * 0.61, y * 0.61) - 0.5) * 10;
      const signed = (invert ? -centered : centered) * amp + grain;
      const v = Math.min(255, Math.max(0, base + signed));
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** Architectural materials — warm plaster / timber / clay (not toy-studio neon). */
function makeMaterials() {
  const TEX = 256;
  const wallMap = makeCanvasTexture(TEX, paintPlaster, true);
  const wallRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintPlaster(ctx, s);
    paintRoughFromAlbedo(ctx, s, 196, 70, true);
  }, false);
  const wallBump = makeCanvasTexture(TEX, paintPlasterBump, false);
  const wallNormal = makeCanvasTexture(TEX, (ctx, s) => {
    paintPlasterBump(ctx, s);
    paintNormalFromHeight(ctx, s, 2.4);
  }, false);
  const edgeMap = makeCanvasTexture(TEX, paintPlinth, true);
  const edgeRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintPlinth(ctx, s);
    paintRoughFromAlbedo(ctx, s, 168, 80, true);
  }, false);
  const edgeBump = makeCanvasTexture(TEX, (ctx, s) => {
    paintPlinth(ctx, s);
    // Mortar joints darker in the color map become the relief source.
  }, false);
  const edgeNormal = makeCanvasTexture(TEX, (ctx, s) => {
    paintPlinth(ctx, s);
    paintNormalFromHeight(ctx, s, 3.1);
  }, false);
  const floorMap = makeCanvasTexture(TEX, paintTimber, true);
  const floorRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintTimber(ctx, s);
    paintRoughFromAlbedo(ctx, s, 150, 64, true);
  }, false);
  const floorBump = makeCanvasTexture(TEX, paintTimberBump, false);
  const floorNormal = makeCanvasTexture(TEX, (ctx, s) => {
    paintTimberBump(ctx, s);
    paintNormalFromHeight(ctx, s, 3.6);
  }, false);
  const roofMap = makeCanvasTexture(TEX, paintClayTiles, true);
  const roofRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintClayTiles(ctx, s);
    paintRoughFromAlbedo(ctx, s, 160, 72, true);
  }, false);
  const roofBump = makeCanvasTexture(TEX, paintTileBump, false);
  const roofNormal = makeCanvasTexture(TEX, (ctx, s) => {
    paintTileBump(ctx, s);
    paintNormalFromHeight(ctx, s, 4.2);
  }, false);
  const groundMap = makeCanvasTexture(TEX, paintGrass, true);
  const groundRough = makeCanvasTexture(TEX, (ctx, s) => paintRoughness(ctx, s, 210, 28), false);
  const groundBump = makeCanvasTexture(TEX, paintGrassRelief, false);
  const groundNormal = makeCanvasTexture(TEX, (ctx, s) => {
    paintGrassRelief(ctx, s);
    paintNormalFromHeight(ctx, s, 2.2);
  }, false);
  const gravelMap = makeCanvasTexture(TEX, paintGravel, true);
  const gravelRough = makeCanvasTexture(TEX, (ctx, s) => paintRoughness(ctx, s, 200, 36), false);
  const plateMap = makeCanvasTexture(TEX, paintPlate, true);
  const plateRough = makeCanvasTexture(TEX, (ctx, s) => paintRoughness(ctx, s, 150, 30), false);
  const plateBump = makeCanvasTexture(TEX, paintPlateBump, false);
  const plateNormal = makeCanvasTexture(TEX, (ctx, s) => {
    paintPlateBump(ctx, s);
    paintNormalFromHeight(ctx, s, 2.8);
  }, false);
  const nosingMap = makeCanvasTexture(TEX, paintNosing, true);
  const nosingRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintNosing(ctx, s);
    paintRoughFromAlbedo(ctx, s, 146, 58, true);
  }, false);
  const nosingBump = makeCanvasTexture(TEX, paintNosingBump, false);
  const fasciaMap = makeCanvasTexture(TEX, paintFascia, true);
  const fasciaRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintFascia(ctx, s);
    paintRoughFromAlbedo(ctx, s, 158, 54, true);
  }, false);
  const fasciaBump = makeCanvasTexture(TEX, paintFasciaBump, false);
  const doorMap = makeCanvasTexture(TEX, paintDoorLeaf, true);
  const doorRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintDoorLeaf(ctx, s);
    paintRoughFromAlbedo(ctx, s, 132, 70, true);
  }, false);
  const doorBump = makeCanvasTexture(TEX, paintDoorLeafBump, false);
  const joineryMap = makeCanvasTexture(TEX, paintJoinery, true);
  const joineryRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintJoinery(ctx, s);
    paintRoughFromAlbedo(ctx, s, 168, 48, true);
  }, false);
  const joineryBump = makeCanvasTexture(TEX, paintJoineryBump, false);
  const glazingMap = makeCanvasTexture(TEX, paintGlazing, true);
  const glazingRough = makeCanvasTexture(TEX, paintGlazingRough, false);

  const applyRepeat = (tex: THREE.CanvasTexture | null, x: number, y: number) => {
    if (!tex) return;
    tex.repeat.set(x, y);
  };
  applyRepeat(wallMap, 2, 2);
  applyRepeat(wallRough, 2, 2);
  applyRepeat(wallBump, 2, 2);
  applyRepeat(wallNormal, 2, 2);
  applyRepeat(edgeMap, 2, 1);
  applyRepeat(edgeRough, 2, 1);
  applyRepeat(edgeBump, 2, 1);
  applyRepeat(edgeNormal, 2, 1);
  applyRepeat(floorMap, 2, 2);
  applyRepeat(floorRough, 2, 2);
  applyRepeat(floorBump, 2, 2);
  applyRepeat(floorNormal, 2, 2);
  applyRepeat(roofMap, 3, 2);
  applyRepeat(roofRough, 3, 2);
  applyRepeat(roofBump, 3, 2);
  applyRepeat(roofNormal, 3, 2);
  applyRepeat(groundMap, 10, 10);
  applyRepeat(groundRough, 10, 10);
  applyRepeat(groundBump, 10, 10);
  applyRepeat(groundNormal, 10, 10);
  applyRepeat(gravelMap, 5, 5);
  applyRepeat(gravelRough, 5, 5);
  applyRepeat(plateMap, 3, 1);
  applyRepeat(plateRough, 3, 1);
  applyRepeat(plateBump, 3, 1);
  applyRepeat(plateNormal, 3, 1);
  applyRepeat(nosingMap, 4, 1);
  applyRepeat(nosingRough, 4, 1);
  applyRepeat(nosingBump, 4, 1);
  applyRepeat(fasciaMap, 3, 1);
  applyRepeat(fasciaRough, 3, 1);
  applyRepeat(fasciaBump, 3, 1);
  applyRepeat(doorMap, 1, 1);
  applyRepeat(doorRough, 1, 1);
  applyRepeat(doorBump, 1, 1);

  const wall = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: wallMap ?? undefined,
    roughnessMap: wallRough ?? undefined,
    bumpMap: wallBump ?? wallRough ?? undefined,
    bumpScale: 0.035,
    normalMap: wallNormal ?? undefined,
    normalScale: new THREE.Vector2(0.42, 0.42),
    roughness: 0.86,
    metalness: 0.02,
  });
  const wallEdge = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: edgeMap ?? undefined,
    roughnessMap: edgeRough ?? undefined,
    bumpMap: edgeBump ?? undefined,
    bumpScale: 0.04,
    normalMap: edgeNormal ?? undefined,
    normalScale: new THREE.Vector2(0.55, 0.55),
    roughness: 0.8,
    metalness: 0.02,
  });
  const floor = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: floorMap ?? undefined,
    roughnessMap: floorRough ?? undefined,
    bumpMap: floorBump ?? floorRough ?? undefined,
    bumpScale: 0.045,
    normalMap: floorNormal ?? undefined,
    normalScale: new THREE.Vector2(0.62, 0.62),
    roughness: 0.74,
    metalness: 0.04,
  });
  const roof = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: roofMap ?? undefined,
    roughnessMap: roofRough ?? undefined,
    bumpMap: roofBump ?? roofRough ?? undefined,
    bumpScale: 0.04,
    normalMap: roofNormal ?? undefined,
    normalScale: new THREE.Vector2(0.78, 0.78),
    roughness: 0.8,
    metalness: 0.05,
  });
  const ground = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: groundMap ?? undefined,
    roughnessMap: groundRough ?? undefined,
    bumpMap: groundBump ?? undefined,
    bumpScale: 0.028,
    normalMap: groundNormal ?? undefined,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.96,
    metalness: 0,
  });
  const gravel = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: gravelMap ?? undefined,
    roughnessMap: gravelRough ?? undefined,
    bumpMap: gravelRough ?? undefined,
    bumpScale: 0.04,
    roughness: 0.92,
    metalness: 0.01,
  });
  const plate = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: plateMap ?? undefined,
    roughnessMap: plateRough ?? undefined,
    bumpMap: plateBump ?? plateRough ?? undefined,
    bumpScale: 0.035,
    normalMap: plateNormal ?? undefined,
    normalScale: new THREE.Vector2(0.4, 0.4),
    roughness: 0.72,
    metalness: 0.03,
  });
  const nosing = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: nosingMap ?? undefined,
    roughnessMap: nosingRough ?? undefined,
    bumpMap: nosingBump ?? undefined,
    bumpScale: 0.03,
    roughness: 0.7,
    metalness: 0.03,
  });
  const fascia = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: fasciaMap ?? undefined,
    roughnessMap: fasciaRough ?? undefined,
    bumpMap: fasciaBump ?? undefined,
    bumpScale: 0.028,
    roughness: 0.76,
    metalness: 0.03,
  });
  const doorLeaf = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: doorMap ?? undefined,
    roughnessMap: doorRough ?? undefined,
    bumpMap: doorBump ?? undefined,
    bumpScale: 0.04,
    roughness: 0.62,
    metalness: 0.03,
  });
  const joinery = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: joineryMap ?? undefined,
    roughnessMap: joineryRough ?? undefined,
    bumpMap: joineryBump ?? undefined,
    bumpScale: 0.02,
    roughness: 0.58,
    metalness: 0.02,
  });
  const doorGlass = new THREE.MeshStandardMaterial({
    color: 0x9bb7c9,
    map: glazingMap ?? undefined,
    roughnessMap: glazingRough ?? undefined,
    roughness: 0.12,
    metalness: 0.06,
    transparent: true,
    opacity: 0.58,
  });
  return { wall, wallEdge, floor, roof, ground, gravel, plate, nosing, fascia, doorLeaf, joinery, doorGlass };
}

function disposeCatalogMaterials(mats: ReturnType<typeof makeMaterials>) {
  const seen = new Set<THREE.Texture>();
  for (const m of Object.values(mats)) {
    for (const tex of [m.map, m.roughnessMap, m.bumpMap, m.normalMap]) {
      if (tex && !seen.has(tex)) {
        seen.add(tex);
        tex.dispose();
      }
    }
    m.dispose();
  }
}

/** Shift UVs so shared repeat maps do not stamp identical plaster/boards/tiles on every piece. */
function staggerUvs(mesh: THREE.Mesh) {
  const attr = mesh.geometry.getAttribute("uv");
  if (!attr) return;
  const u = Math.random() * 0.85;
  const v = Math.random() * 0.85;
  for (let i = 0; i < attr.count; i++) {
    attr.setXY(i, attr.getX(i) + u, attr.getY(i) + v);
  }
  attr.needsUpdate = true;
}

function createWallMesh(mats: ReturnType<typeof makeMaterials>) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(3, 2.6, 0.2), mats.wall);
  body.position.y = 1.3;
  body.castShadow = true;
  body.receiveShadow = true;
  staggerUvs(body);
  group.add(body);
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.12, 0.24), mats.wallEdge);
  base.position.y = 0.06;
  base.castShadow = true;
  group.add(base);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(3.02, 0.1, 0.22), mats.plate);
  plate.position.y = 2.55;
  plate.castShadow = true;
  plate.receiveShadow = true;
  group.add(plate);
  return group;
}

function createFloorMesh(mats: ReturnType<typeof makeMaterials>) {
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 0.08, 3), mats.floor);
  mesh.position.y = 0.04;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  staggerUvs(mesh);
  group.add(mesh);
  const edges: Array<[number, number, number]> = [
    [3.06, 0.09, 0.07],
    [0.07, 0.09, 3.06],
  ];
  const placements: Array<[number, number, number, number]> = [
    [0, 0.045, 1.515, 0],
    [0, 0.045, -1.515, 0],
    [1.515, 0.045, 0, 1],
    [-1.515, 0.045, 0, 1],
  ];
  for (const [x, y, z, which] of placements) {
    const [w, h, d] = edges[which];
    const nosing = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats.nosing);
    nosing.position.set(x, y, z);
    nosing.castShadow = true;
    nosing.receiveShadow = true;
    group.add(nosing);
  }
  return group;
}

function createRoofMesh(mats: ReturnType<typeof makeMaterials>) {
  const group = new THREE.Group();
  const left = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.8), mats.roof);
  left.position.set(0, 2.85, -0.55);
  left.rotation.x = 0.45;
  left.castShadow = true;
  staggerUvs(left);
  const right = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.8), mats.roof);
  right.position.set(0, 2.85, 0.55);
  right.rotation.x = -0.45;
  right.castShadow = true;
  staggerUvs(right);
  group.add(left, right);
  const addVerge = (src: THREE.Mesh, localZ: number) => {
    const verge = new THREE.Mesh(new THREE.BoxGeometry(3.24, 0.07, 0.09), mats.fascia);
    verge.position.copy(src.position);
    verge.rotation.copy(src.rotation);
    verge.translateY(0.07);
    verge.translateZ(localZ);
    verge.castShadow = true;
    verge.receiveShadow = true;
    group.add(verge);
  };
  addVerge(left, -0.84);
  addVerge(right, 0.84);
  return group;
}


function createColumnMesh(mats: ReturnType<typeof makeMaterials>) {
  // Square pier: stone plinth, plastered shaft, timber capital. Height matches walls (2.6 m).
  const group = new THREE.Group();
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.5), mats.wallEdge);
  plinth.position.y = 0.07;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.32, 0.34), mats.wall);
  shaft.position.y = 1.3;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  staggerUvs(shaft);
  group.add(shaft);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.38), mats.wallEdge);
  neck.position.y = 2.49;
  neck.castShadow = true;
  group.add(neck);
  const capital = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.1, 0.48), mats.plate);
  capital.position.y = 2.57;
  capital.castShadow = true;
  capital.receiveShadow = true;
  group.add(capital);
  return group;
}

function createDoorMesh(mats: ReturnType<typeof makeMaterials>) {
  // Single leaf: timber jambs, raised panels, glazed top light. 0.96 × 2.1 m so it sits in a wall bay.
  const group = new THREE.Group();
  const threshold = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.05, 0.16), mats.wallEdge);
  threshold.position.y = 0.025;
  threshold.castShadow = true;
  threshold.receiveShadow = true;
  group.add(threshold);
  const jambL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.12), mats.plate);
  jambL.position.set(-0.48, 1.05, 0);
  jambL.castShadow = true;
  jambL.receiveShadow = true;
  const jambR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.12), mats.plate);
  jambR.position.set(0.48, 1.05, 0);
  jambR.castShadow = true;
  jambR.receiveShadow = true;
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.08, 0.12), mats.plate);
  head.position.set(0, 2.06, 0);
  head.castShadow = true;
  head.receiveShadow = true;
  group.add(jambL, jambR, head);
  const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.48, 0.04), mats.doorLeaf);
  leaf.position.set(0, 0.82, 0.01);
  leaf.castShadow = true;
  leaf.receiveShadow = true;
  staggerUvs(leaf);
  group.add(leaf);
  const rail = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.06, 0.05), mats.fascia);
  rail.position.set(0, 1.58, 0.012);
  rail.castShadow = true;
  group.add(rail);
  const lite = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.38, 0.02), mats.doorGlass);
  lite.position.set(0, 1.82, 0.012);
  lite.castShadow = false;
  lite.receiveShadow = true;
  group.add(lite);
  const muntinV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 0.03), mats.fascia);
  muntinV.position.set(0, 1.82, 0.02);
  const muntinH = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.03, 0.03), mats.fascia);
  muntinH.position.set(0, 1.82, 0.02);
  group.add(muntinV, muntinH);
  return group;
}

function createWindowMesh(mats: ReturnType<typeof makeMaterials>) {
  // Casement bay: timber sill and frame, glazed lights. Sill at 0.9 m so it sits in a 2.6 m wall.
  const group = new THREE.Group();
  const sill = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.06, 0.2), mats.wallEdge);
  sill.position.set(0, 0.9, 0.02);
  sill.castShadow = true;
  sill.receiveShadow = true;
  group.add(sill);
  const apron = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.08, 0.08), mats.fascia);
  apron.position.set(0, 0.82, 0);
  apron.castShadow = true;
  group.add(apron);
  const jambL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.12, 0.1), mats.joinery);
  jambL.position.set(-0.56, 1.49, 0);
  jambL.castShadow = true;
  jambL.receiveShadow = true;
  const jambR = jambL.clone();
  jambR.position.x = 0.56;
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.19, 0.07, 0.1), mats.joinery);
  head.position.set(0, 2.02, 0);
  head.castShadow = true;
  head.receiveShadow = true;
  group.add(jambL, jambR, head);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.0, 0.02), mats.doorGlass);
  glass.position.set(0, 1.48, 0.01);
  glass.castShadow = false;
  glass.receiveShadow = true;
  group.add(glass);
  const muntinV = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.0, 0.035), mats.joinery);
  muntinV.position.set(0, 1.48, 0.022);
  const muntinH = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.035, 0.035), mats.joinery);
  muntinH.position.set(0, 1.48, 0.022);
  group.add(muntinV, muntinH);
  return group;
}


function createStairsMesh(mats: ReturnType<typeof makeMaterials>) {
  // Straight timber flight: 6 treads, 1.0 m wide, 0.17 m rise (1.02 m total). Runs toward -Z.
  const group = new THREE.Group();
  const treads = 6;
  const rise = 0.17;
  const run = 0.28;
  const width = 1.0;
  const depth = 0.3;
  for (let i = 0; i < treads; i++) {
    const tread = new THREE.Mesh(new THREE.BoxGeometry(width, 0.045, depth), mats.nosing);
    tread.position.set(0, rise * (i + 1) - 0.022, -run * i);
    tread.castShadow = true;
    tread.receiveShadow = true;
    staggerUvs(tread);
    group.add(tread);
    const riser = new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, rise - 0.02, 0.028), mats.fascia);
    riser.position.set(0, rise * i + rise * 0.48, -run * i + depth * 0.42);
    riser.castShadow = true;
    group.add(riser);
  }
  const totalRise = rise * treads;
  const totalRun = run * (treads - 1);
  const stringerLen = Math.hypot(totalRun, totalRise) + 0.16;
  const angle = Math.atan2(totalRise, totalRun);
  for (const side of [-1, 1]) {
    const stringer = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, stringerLen), mats.plate);
    stringer.position.set(side * (width / 2 + 0.01), totalRise * 0.46, -totalRun / 2);
    stringer.rotation.x = angle;
    stringer.castShadow = true;
    stringer.receiveShadow = true;
    group.add(stringer);
  }
  const newel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.92, 0.08), mats.plate);
  newel.position.set(width / 2 + 0.01, 0.46, 0.08);
  newel.castShadow = true;
  group.add(newel);
  const newelTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.08), mats.plate);
  newelTop.position.set(width / 2 + 0.01, totalRise + 0.16, -totalRun);
  newelTop.castShadow = true;
  group.add(newelTop);
  return group;
}

function createRailingMesh(mats: ReturnType<typeof makeMaterials>) {
  // Straight timber balcony rail: 1.8 m run, 0.95 m handrail. Runs along X.
  const group = new THREE.Group();
  const length = 1.8;
  const height = 0.95;
  const postW = 0.08;
  for (const x of [-length / 2, 0, length / 2]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(postW, height, postW), mats.plate);
    post.position.set(x, height / 2, 0);
    post.castShadow = true;
    post.receiveShadow = true;
    group.add(post);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(postW + 0.02, 0.03, postW + 0.02), mats.nosing);
    cap.position.set(x, height + 0.012, 0);
    cap.castShadow = true;
    group.add(cap);
  }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.05, 0.07), mats.nosing);
  rail.position.set(0, height - 0.03, 0);
  rail.castShadow = true;
  rail.receiveShadow = true;
  staggerUvs(rail);
  group.add(rail);
  const kick = new THREE.Mesh(new THREE.BoxGeometry(length - postW, 0.04, 0.04), mats.fascia);
  kick.position.set(0, 0.12, 0);
  kick.castShadow = true;
  kick.receiveShadow = true;
  group.add(kick);
  const span = length - postW * 2;
  const count = 9;
  for (let i = 0; i < count; i++) {
    const x = -span / 2 + (span / (count + 1)) * (i + 1);
    const baluster = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.7, 0.028), mats.plate);
    baluster.position.set(x, 0.16 + 0.35, 0);
    baluster.castShadow = true;
    group.add(baluster);
  }
  return group;
}


function createChimneyMesh(mats: ReturnType<typeof makeMaterials>) {
  // Masonry stack: brick shaft, clay crown, twin flue pots. Sits on the ground beside a wall.
  const group = new THREE.Group();
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.16, 0.78), mats.wallEdge);
  plinth.position.y = 0.08;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  staggerUvs(plinth);
  group.add(plinth);
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.62, 2.55, 0.62), mats.wallEdge);
  shaft.position.y = 0.16 + 1.275;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  staggerUvs(shaft);
  group.add(shaft);
  const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.1, 0.74), mats.wallEdge);
  shoulder.position.y = 2.76;
  shoulder.castShadow = true;
  staggerUvs(shoulder);
  group.add(shoulder);
  const crown = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.08, 0.84), mats.roof);
  crown.position.y = 2.85;
  crown.castShadow = true;
  crown.receiveShadow = true;
  staggerUvs(crown);
  group.add(crown);
  for (const x of [-0.16, 0.16]) {
    const pot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.32, 0.2), mats.fascia);
    pot.position.set(x, 3.06, 0);
    pot.castShadow = true;
    pot.receiveShadow = true;
    group.add(pot);
    const lip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.24), mats.roof);
    lip.position.set(x, 3.24, 0);
    lip.castShadow = true;
    group.add(lip);
  }
  return group;
}

function createPartMesh(kind: PartKind, mats: ReturnType<typeof makeMaterials>) {
  if (kind === "wall") return createWallMesh(mats);
  if (kind === "floor") return createFloorMesh(mats);
  if (kind === "roof") return createRoofMesh(mats);
  if (kind === "column") return createColumnMesh(mats);
  if (kind === "door") return createDoorMesh(mats);
  if (kind === "window") return createWindowMesh(mats);
  if (kind === "stairs") return createStairsMesh(mats);
  if (kind === "railing") return createRailingMesh(mats);
  return createChimneyMesh(mats);
}

function StructureGlyph({ kind }: { kind: PartKind }) {
  if (kind === "wall") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="3" y="7" width="34" height="20" rx="1" fill="#d8d0c4" stroke="#8a7d6c" />
        <rect x="3" y="24" width="34" height="3.5" fill="#b7ab9a" />
        <rect x="14" y="12" width="6" height="9" fill="#6d8eaa" opacity="0.85" />
      </svg>
    );
  }
  if (kind === "floor") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <path d="M6 10 L34 6 L34 24 L6 28 Z" fill="#8b7355" stroke="#5c4634" />
        <path d="M6 18 L34 14" stroke="#c4a882" strokeWidth="1" />
        <path d="M16 9 L16 26" stroke="#c4a882" strokeWidth="1" />
      </svg>
    );
  }
  if (kind === "roof") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <path d="M4 22 L20 8 L36 22 L32 22 L20 12 L8 22 Z" fill="#6b3a2a" stroke="#3d2218" />
        <path d="M8 22 L32 22 L32 26 L8 26 Z" fill="#8a4e3a" />
      </svg>
    );
  }
  if (kind === "column") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="12" y="26" width="16" height="3" fill="#b7ab9a" stroke="#8a7d6c" />
        <rect x="15" y="6" width="10" height="20" fill="#d8d0c4" stroke="#8a7d6c" />
        <rect x="11" y="4" width="18" height="3" fill="#8b5a32" />
      </svg>
    );
  }
  if (kind === "door") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="10" y="6" width="20" height="22" fill="#8b5a32" stroke="#5c3a22" />
        <rect x="13" y="16" width="14" height="10" fill="#c4a882" />
        <rect x="14" y="8" width="12" height="6" fill="#9bb7c9" opacity="0.9" />
        <circle cx="24" cy="21" r="1.1" fill="#d8d0c4" />
      </svg>
    );
  }
  if (kind === "window") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="6" y="8" width="28" height="16" fill="#9bb7c9" stroke="#6d4a30" />
        <rect x="6" y="22" width="28" height="3" fill="#b7ab9a" />
        <path d="M20 8 V24 M6 16 H34" stroke="#6d4a30" strokeWidth="1.2" />
      </svg>
    );
  }
  if (kind === "stairs") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <path d="M6 26 H14 V20 H22 V14 H30 V8 H36" fill="none" stroke="#8b5a32" strokeWidth="3" />
        <path d="M6 26 H14 V20 H22 V14 H30 V8" fill="none" stroke="#c4a882" strokeWidth="1.4" />
        <path d="M32 8 V26" stroke="#6d4a30" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "railing") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <path d="M4 26 V8 M20 26 V8 M36 26 V8" stroke="#6d4a30" strokeWidth="2.2" />
        <path d="M4 9 H36" stroke="#8b5a32" strokeWidth="2.4" />
        <path d="M6 24 H18 M22 24 H34" stroke="#c4a882" strokeWidth="1.4" />
        <path d="M8 22 V12 M12 22 V12 M16 22 V12 M24 22 V12 M28 22 V12 M32 22 V12" stroke="#a67c52" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
      <rect x="12" y="10" width="16" height="16" fill="#b7ab9a" stroke="#8a7d6c" />
      <rect x="9" y="8" width="22" height="3" fill="#6b3a2a" />
      <rect x="14" y="3" width="5" height="6" fill="#6d4a30" />
      <rect x="21" y="3" width="5" height="6" fill="#6d4a30" />
      <rect x="15" y="2" width="3" height="2" fill="#5c3224" />
      <rect x="22" y="2" width="3" height="2" fill="#5c3224" />
    </svg>
  );
}

export function HouseModeler3D({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const mountRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
    ground: THREE.Mesh;
    partsRoot: THREE.Group;
    mats: ReturnType<typeof makeMaterials>;
    ghost: THREE.Object3D | null;
    selectionHelper: THREE.BoxHelper;
    anim: number;
  } | null>(null);
  const partsRef = useRef<ScenePart[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tool, setTool] = useState<PartKind>("wall");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [placingFromPalette, setPlacingFromPalette] = useState(false);
  const [dragCursor, setDragCursor] = useState<{ x: number; y: number; over: boolean } | null>(null);
  const [selectedRot, setSelectedRot] = useState(0);
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  // Narrow viewports: icon-only palette so the canvas keeps the layout (canvas + right rail).
  const [paletteCompact, setPaletteCompact] = useState(false);
  const toolRef = useRef(tool);
  const selectedRef = useRef(selectedId);
  const draggingRef = useRef<{ id: string; offset: THREE.Vector3 } | null>(null);
  // Click-select must not snap the part. Drag arms only after the pointer moves past this.
  const dragArmRef = useRef<{ id: string; offset: THREE.Vector3; x: number; y: number } | null>(null);
  const DRAG_ARM_PX = 6;
  const paletteDragRef = useRef<PartKind | null>(null);
  // Owning pointer for place/drag. A second finger's pointerup must not commit or unlock orbit.
  const gesturePointerRef = useRef<number | null>(null);
  const palettePointerRef = useRef<number | null>(null);
  // Listeners attached in pointerdown. A useEffect after setState misses a fast tap's pointerup
  // and leaves OrbitControls disabled with a stuck drag chip.
  const paletteDragCleanupRef = useRef<(() => void) | null>(null);
  const pendingPlaceRef = useRef(false);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setPaletteCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const worldPointFromEvent = useCallback((clientX: number, clientY: number) => {
    const t = threeRef.current;
    if (!t || !mountRef.current) return null;
    const rect = mountRef.current.getBoundingClientRect();
    t.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    t.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    t.raycaster.setFromCamera(t.pointer, t.camera);
    const hits = t.raycaster.intersectObject(t.ground);
    if (!hits.length) return null;
    return hits[0].point;
  }, []);

  const clearGhost = useCallback(() => {
    const t = threeRef.current;
    if (!t?.ghost) return;
    t.partsRoot.remove(t.ghost);
    // Ghost materials are clones; geometries are unique per preview.
    disposeObjectResources(t.ghost, true);
    t.ghost = null;
  }, []);

  const makeGhost = useCallback(
    (kind: PartKind) => {
      const t = threeRef.current;
      if (!t) return;
      clearGhost();
      let obj: THREE.Object3D;
      obj = createPartMesh(kind, t.mats);
      obj.traverse((c) => {
        if (c instanceof THREE.Mesh && c.material) {
          const m = (c.material as THREE.MeshStandardMaterial).clone();
          m.transparent = true;
          m.opacity = 0.45;
          m.depthWrite = false;
          c.material = m;
        }
      });
      t.ghost = obj;
      t.partsRoot.add(obj);
    },
    [clearGhost],
  );

  useEffect(() => {
    if (!ready) return;
    makeGhost(tool);
  }, [tool, ready, makeGhost]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let disposed = false;
    try {
      const scene = new THREE.Scene();
      // Warm horizon haze so the grass disc fades into the late-day sky, not a cool cut.
      scene.fog = new THREE.FogExp2(0xc6c1b0, 0.0064);
      scene.background = new THREE.Color(0xc6c1b0);

      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
      camera.position.set(12, 9, 14);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      renderer.domElement.style.touchAction = "none";
      renderer.domElement.style.display = "block";

      const sky = new Sky();
      sky.scale.setScalar(450);
      scene.add(sky);
      const skyUniforms = sky.material.uniforms;
      // Slightly hazier low sun: warmer horizon, less washed zenith.
      skyUniforms["turbidity"].value = 6.6;
      skyUniforms["rayleigh"].value = 0.98;
      skyUniforms["mieCoefficient"].value = 0.0048;
      skyUniforms["mieDirectionalG"].value = 0.82;
      const sun = new THREE.Vector3();
      // Lower sun (closer to horizon) so walls cast longer, readable shadows on the pad.
      const phi = THREE.MathUtils.degToRad(80);
      const theta = THREE.MathUtils.degToRad(132);
      sun.setFromSphericalCoords(1, phi, theta);
      skyUniforms["sunPosition"].value.copy(sun);
      // Sky is a huge shell; fog would flatten it to the clear color.
      sky.material.fog = false;
      sky.material.depthWrite = false;

      const hemi = new THREE.HemisphereLight(0xd6e4f2, 0x5c6840, 0.46);
      scene.add(hemi);
      const dir = new THREE.DirectionalLight(0xffe6c2, 1.36);
      dir.position.copy(sun).multiplyScalar(48);
      dir.castShadow = true;
      dir.shadow.mapSize.set(2048, 2048);
      dir.shadow.camera.near = 6;
      dir.shadow.camera.far = 72;
      // Tighter frustum on the pad: same 2048 map, crisper contact on walls.
      dir.shadow.camera.left = -13;
      dir.shadow.camera.right = 13;
      dir.shadow.camera.top = 13;
      dir.shadow.camera.bottom = -13;
      dir.shadow.bias = -0.00025;
      dir.shadow.normalBias = 0.02;
      dir.shadow.radius = 1.4;
      scene.add(dir);
      scene.add(dir.target);
      const sunDiscMap = makeCanvasTexture(128, paintSunDisc, true);
      const sunDiscMat = new THREE.SpriteMaterial({
        map: sunDiscMap ?? undefined,
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        blending: THREE.AdditiveBlending,
      });
      const sunDisc = new THREE.Sprite(sunDiscMat);
      sunDisc.position.copy(sun).multiplyScalar(220);
      sunDisc.scale.set(34, 34, 1);
      scene.add(sunDisc);
      const fill = new THREE.DirectionalLight(0x9eb6d4, 0.28);
      fill.position.set(-sun.x * 26, 9, -sun.z * 26);
      scene.add(fill);
      // Warm bounce off the gravel pad, no shadow (keeps mid-range fill cheap).
      const bounce = new THREE.DirectionalLight(0xe7d2b4, 0.18);
      bounce.position.set(6, 1.2, 8);
      scene.add(bounce);
      scene.add(new THREE.AmbientLight(0xfff6ea, 0.1));

      const mats = makeMaterials();

      const groundGeo = new THREE.CircleGeometry(120, 64);
      const ground = new THREE.Mesh(groundGeo, mats.ground);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Compacted gravel pad so parts sit on a site, not raw grass. Raycasts stay on ground.
      const padGeo = new THREE.CircleGeometry(11, 56);
      const pad = new THREE.Mesh(padGeo, mats.gravel);
      pad.rotation.x = -Math.PI / 2;
      pad.position.y = 0.015;
      pad.receiveShadow = true;
      scene.add(pad);
      const rimGeo = new THREE.RingGeometry(10.55, 11.35, 56);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0x6d624f,
        roughness: 0.95,
        metalness: 0,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = -Math.PI / 2;
      rim.position.y = 0.012;
      rim.receiveShadow = true;
      scene.add(rim);
      // Worn earth apron and access path share one packed-earth map (not a flat tint).
      const earthMap = makeCanvasTexture(256, paintWornEarth, true);
      const earthRough = makeCanvasTexture(256, (ctx, s) => {
        paintWornEarth(ctx, s);
        paintRoughFromAlbedo(ctx, s, 188, 48, true);
      }, false);
      if (earthMap) earthMap.repeat.set(3, 3);
      if (earthRough) earthRough.repeat.set(3, 3);
      const apronGeo = new THREE.RingGeometry(11.15, 16.8, 64);
      const apronMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: earthMap ?? undefined,
        roughnessMap: earthRough ?? undefined,
        bumpMap: earthRough ?? undefined,
        bumpScale: 0.03,
        roughness: 0.97,
        metalness: 0,
      });
      const apron = new THREE.Mesh(apronGeo, apronMat);
      apron.rotation.x = -Math.PI / 2;
      apron.position.y = 0.006;
      apron.receiveShadow = true;
      scene.add(apron);

      // Compacted access path so the pad reads as a site, not a floating disc.
      const pathGeo = new THREE.PlaneGeometry(1.7, 9.2);
      const pathMat = new THREE.MeshStandardMaterial({
        color: 0xd8cbb6,
        map: earthMap ?? undefined,
        roughnessMap: earthRough ?? undefined,
        bumpMap: earthRough ?? undefined,
        bumpScale: 0.035,
        roughness: 0.96,
        metalness: 0,
      });
      const path = new THREE.Mesh(pathGeo, pathMat);
      path.rotation.x = -Math.PI / 2;
      path.position.set(0.35, 0.017, 11.4);
      path.receiveShadow = true;
      scene.add(path);

      // Cheap grass clumps on the apron. One instanced mesh, no shadow maps.
      const tuftGeo = new THREE.ConeGeometry(0.14, 0.38, 4);
      tuftGeo.translate(0, 0.19, 0);
      const tuftMat = new THREE.MeshStandardMaterial({
        color: 0x5c7840,
        roughness: 0.94,
        metalness: 0,
      });
      const TUFTS = 40;
      const tufts = new THREE.InstancedMesh(tuftGeo, tuftMat, TUFTS);
      tufts.castShadow = false;
      tufts.receiveShadow = false;
      const tuftDummy = new THREE.Object3D();
      for (let i = 0; i < TUFTS; i++) {
        const a = hash2(i, 1.3) * Math.PI * 2;
        const rad = 12.2 + hash2(i, 4.7) * 7.2;
        tuftDummy.position.set(Math.cos(a) * rad, 0, Math.sin(a) * rad);
        const s = 0.65 + hash2(i, 2.2) * 1.35;
        tuftDummy.scale.set(s, 0.5 + hash2(i, 8.1) * 1.15, s * 0.85);
        tuftDummy.rotation.y = hash2(i, 9.4) * Math.PI;
        tuftDummy.updateMatrix();
        tufts.setMatrixAt(i, tuftDummy.matrix);
      }
      tufts.instanceMatrix.needsUpdate = true;
      scene.add(tufts);

      const ringMat = new THREE.LineBasicMaterial({ color: 0x2f452c, transparent: true, opacity: 0.22 });
      const ringGeos: THREE.BufferGeometry[] = [];
      for (let r = 5; r <= 40; r += 5) {
        const pts = [];
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * r, 0.03, Math.sin(a) * r));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        ringGeos.push(geo);
        scene.add(new THREE.Line(geo, ringMat));
      }
      const aoMap = makeCanvasTexture(128, paintContactAO, false);
      const aoMat = new THREE.MeshBasicMaterial({
        map: aoMap ?? undefined,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      });
      const aoGeo = new THREE.CircleGeometry(8.2, 48);
      const contactAo = new THREE.Mesh(aoGeo, aoMat);
      contactAo.rotation.x = -Math.PI / 2;
      contactAo.position.y = 0.02;
      scene.add(contactAo);

      const hazeMap = makeCanvasTexture(64, paintHorizonHaze, true);
      if (hazeMap) hazeMap.repeat.set(1, 1);
      const hazeMat = new THREE.MeshBasicMaterial({
        map: hazeMap ?? undefined,
        color: 0xc6c1b0,
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        side: THREE.DoubleSide,
      });
      const hazeGeo = new THREE.CylinderGeometry(118, 118, 7, 48, 1, true);
      const horizonHaze = new THREE.Mesh(hazeGeo, hazeMat);
      horizonHaze.position.y = 2.4;
      scene.add(horizonHaze);

      const partsRoot = new THREE.Group();
      scene.add(partsRoot);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.maxPolarAngle = Math.PI * 0.49;
      controls.minDistance = 2;
      controls.maxDistance = 80;
      controls.target.set(0, 1, 0);
      // Left button is place/drag only. Orbit on left was stealing the gesture
      // whenever the ray missed the pad (OrbitControls default is LEFT=ROTATE).
      controls.mouseButtons.LEFT = -1 as unknown as typeof controls.mouseButtons.LEFT;
      controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
      controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
      controls.touches.ONE = -1 as unknown as typeof controls.touches.ONE;
      controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const selectionHelper = new THREE.BoxHelper(new THREE.Object3D(), 0xc4843a);
      selectionHelper.visible = false;
      scene.add(selectionHelper);

      const onResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);
      const resizeObserver = new ResizeObserver(() => onResize());
      resizeObserver.observe(el);
      onResize();

      threeRef.current = {
        renderer,
        scene,
        camera,
        controls,
        raycaster,
        pointer,
        ground,
        partsRoot,
        mats,
        ghost: null,
        selectionHelper,
        anim: 0,
      };

      const tick = () => {
        if (disposed) return;
        const selId = selectedRef.current;
        if (selId) {
          let target: THREE.Object3D | null = null;
          partsRoot.children.forEach((c) => {
            if (c.userData.partId === selId) target = c;
          });
          if (target) {
            selectionHelper.setFromObject(target);
            selectionHelper.visible = true;
          } else {
            selectionHelper.visible = false;
          }
        } else {
          selectionHelper.visible = false;
        }
        controls.update();
        // Keep the shadow frustum on the work point so orbit-pan does not clip shadows.
        const focusX = controls.target.x;
        const focusZ = controls.target.z;
        dir.position.set(sun.x * 48 + focusX, Math.max(14, sun.y * 48), sun.z * 48 + focusZ);
        dir.target.position.set(focusX, 0.5, focusZ);
        dir.target.updateMatrixWorld();
        // Cool fill stays opposite the key so wall backs do not go flat black.
        fill.position.set(-sun.x * 26 + focusX, 9, -sun.z * 26 + focusZ);
        renderer.render(scene, camera);
        threeRef.current!.anim = requestAnimationFrame(tick);
      };
      tick();
      setReady(true);
      setError(null);

      return () => {
        disposed = true;
        window.removeEventListener("resize", onResize);
        resizeObserver.disconnect();
        cancelAnimationFrame(threeRef.current?.anim ?? 0);
        const ghost = threeRef.current?.ghost;
        if (ghost) {
          partsRoot.remove(ghost);
          disposeObjectResources(ghost, true);
        }
        for (const child of [...partsRoot.children]) {
          partsRoot.remove(child);
          disposeObjectResources(child, false);
        }
        disposeObjectResources(ground, false);
        pad.geometry.dispose();
        rim.geometry.dispose();
        rimMat.dispose();
        apron.geometry.dispose();
        apronMat.dispose();
        path.geometry.dispose();
        pathMat.dispose();
        earthMap?.dispose();
        earthRough?.dispose();
        tufts.geometry.dispose();
        tuftMat.dispose();
        tufts.dispose();
        sunDiscMat.dispose();
        sunDiscMap?.dispose();
        ringMat.dispose();
        for (const geo of ringGeos) geo.dispose();
        contactAo.geometry.dispose();
        aoMat.dispose();
        aoMap?.dispose();
        horizonHaze.geometry.dispose();
        hazeMat.dispose();
        hazeMap?.dispose();
        disposeCatalogMaterials(mats);
        sky.geometry.dispose();
        sky.material.dispose();
        controls.dispose();
        selectionHelper.dispose();
        renderer.dispose();
        if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
        threeRef.current = null;
        partsRef.current = [];
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : "WebGL error");
      return;
    }
  }, []);

  // Keep renderer size in sync when entering/leaving fullscreen.
  // The first measurement can run before layout; a second frame catches the real size.
  useEffect(() => {
    const t = threeRef.current;
    if (!t || !mountRef.current) return;
    let raf = 0;
    const apply = () => {
      if (!mountRef.current || !threeRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      threeRef.current.camera.aspect = w / Math.max(h, 1);
      threeRef.current.camera.updateProjectionMatrix();
      threeRef.current.renderer.setSize(w, h);
    };
    apply();
    raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, [isFullscreen, ready]);

  const placeAt = useCallback((point: THREE.Vector3, kind: PartKind) => {
    const t = threeRef.current;
    if (!t) return;
    const x = snap(point.x);
    const z = snap(point.z);
    let obj: THREE.Object3D;
    obj = createPartMesh(kind, t.mats);
    obj.position.set(x, 0, z);
    t.partsRoot.add(obj);
    let primary: THREE.Mesh | null = null;
    obj.traverse((c) => {
      if (!primary && c instanceof THREE.Mesh) primary = c;
    });
    if (!primary) {
      t.partsRoot.remove(obj);
      disposeObjectResources(obj, false);
      return;
    }
    const id = uid();
    obj.userData.partId = id;
    obj.traverse((c) => {
      if (c instanceof THREE.Mesh) c.userData.partId = id;
    });
    partsRef.current.push({
      id,
      kind,
      position: [x, 0, z],
      rotationY: 0,
      mesh: primary as THREE.Mesh,
    });
    setCount(partsRef.current.length);
    // selectedRef is read by Delete/R before the state effect flushes.
    selectedRef.current = id;
    setSelectedId(id);
    setSelectedRot(0);
    setSelectedPos([x, z]);
  }, []);

  const findPartObject = useCallback((id: string) => {
    const t = threeRef.current;
    if (!t) return null;
    let found: THREE.Object3D | null = null;
    t.partsRoot.traverse((c) => {
      if (c.userData.partId === id && c.parent === t.partsRoot) found = c;
    });
    return found;
  }, []);

  const deleteSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    const obj = findPartObject(id);
    const t = threeRef.current;
    if (obj && t) {
      t.partsRoot.remove(obj);
      disposeObjectResources(obj, false);
    }
    partsRef.current = partsRef.current.filter((p) => p.id !== id);
    selectedRef.current = null;
    setSelectedId(null);
    setSelectedRot(0);
    setSelectedPos(null);
    setCount(partsRef.current.length);
    if (t) t.selectionHelper.visible = false;
    // Deleting the part under the pointer must not keep a stale drag or a locked orbit.
    if (draggingRef.current?.id === id || dragArmRef.current?.id === id) {
      draggingRef.current = null;
      dragArmRef.current = null;
      gesturePointerRef.current = null;
      pendingPlaceRef.current = false;
      if (t && !paletteDragRef.current) t.controls.enabled = true;
    }
  }, [findPartObject]);

  const setSelectedYaw = useCallback((step: number) => {
    const id = selectedRef.current;
    if (!id) return;
    const obj = findPartObject(id);
    if (!obj) return;
    const norm = ((step % 4) + 4) % 4;
    obj.rotation.y = norm * (Math.PI / 2);
    const part = partsRef.current.find((p) => p.id === id);
    if (part) part.rotationY = obj.rotation.y;
    setSelectedRot(norm);
  }, [findPartObject]);

  const rotateSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    const obj = findPartObject(id);
    if (!obj) return;
    const next = ((Math.round(obj.rotation.y / (Math.PI / 2)) % 4) + 4) % 4 + 1;
    const norm = next % 4;
    obj.rotation.y = norm * (Math.PI / 2);
    const part = partsRef.current.find((p) => p.id === id);
    if (part) part.rotationY = obj.rotation.y;
    setSelectedRot(norm);
  }, [findPartObject]);

  // Snap-step the selected part. Touch drags fight OrbitControls; a pad is more reliable on phones.
  const nudgeSelected = useCallback((dx: number, dz: number) => {
    if (paletteDragRef.current || draggingRef.current) return;
    const id = selectedRef.current;
    if (!id) return;
    const obj = findPartObject(id);
    if (!obj) return;
    const x = snap(obj.position.x + dx);
    const z = snap(obj.position.z + dz);
    obj.position.x = x;
    obj.position.z = z;
    const part = partsRef.current.find((p) => p.id === id);
    if (part) part.position = [x, obj.position.y, z];
    setSelectedPos([x, z]);
  }, [findPartObject]);

  const duplicateSelected = useCallback(() => {
    if (paletteDragRef.current || draggingRef.current) return;
    const id = selectedRef.current;
    if (!id) return;
    const part = partsRef.current.find((p) => p.id === id);
    const obj = findPartObject(id);
    const t = threeRef.current;
    if (!part || !obj || !t) return;
    const x = snap(obj.position.x + GRID);
    const z = snap(obj.position.z);
    const clone = createPartMesh(part.kind, t.mats);
    clone.position.set(x, 0, z);
    clone.rotation.y = obj.rotation.y;
    t.partsRoot.add(clone);
    let primary: THREE.Mesh | null = null;
    clone.traverse((c) => {
      if (!primary && c instanceof THREE.Mesh) primary = c;
    });
    if (!primary) {
      t.partsRoot.remove(clone);
      disposeObjectResources(clone, false);
      return;
    }
    const nid = uid();
    clone.userData.partId = nid;
    clone.traverse((c) => {
      if (c instanceof THREE.Mesh) c.userData.partId = nid;
    });
    partsRef.current.push({
      id: nid,
      kind: part.kind,
      position: [x, 0, z],
      rotationY: obj.rotation.y,
      mesh: primary as THREE.Mesh,
    });
    setCount(partsRef.current.length);
    selectedRef.current = nid;
    setSelectedId(nid);
    setSelectedRot(((Math.round(obj.rotation.y / (Math.PI / 2)) % 4) + 4) % 4);
    setSelectedPos([x, z]);
  }, [findPartObject]);

  const frameSelected = useCallback(() => {
    const id = selectedRef.current;
    const t = threeRef.current;
    if (!id || !t) return;
    const obj = findPartObject(id);
    if (!obj) return;
    const focus = obj.position.clone();
    focus.y = 1.3;
    const offset = new THREE.Vector3(6.2, 4.4, 6.2);
    t.controls.target.copy(focus);
    t.camera.position.copy(focus).add(offset);
    t.camera.lookAt(focus);
    t.controls.update();
  }, [findPartObject]);

  const clearAll = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    for (const p of [...partsRef.current]) {
      const obj = findPartObject(p.id);
      if (obj) {
        t.partsRoot.remove(obj);
        disposeObjectResources(obj, false);
      }
    }
    partsRef.current = [];
    selectedRef.current = null;
    setSelectedId(null);
    setSelectedRot(0);
    setSelectedPos(null);
    setCount(0);
    t.selectionHelper.visible = false;
  }, [findPartObject]);

  const toggleFullscreen = useCallback(async () => {
    const shell = shellRef.current;
    if (!shell) return;
    try {
      if (!document.fullscreenElement) {
        await shell.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen may be blocked by browser policy
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Left-click places or drags a part. Capture phase runs before OrbitControls
  // (which listens on the canvas) so a place/drag cannot also yaw the camera.

  // Canvas pointer interactions
  useEffect(() => {
    const el = mountRef.current;
    if (!el || !ready) return;
    const t = threeRef.current;
    if (!t) return;
    const canvas = t.renderer.domElement;

    const endGesture = (place: boolean, ev?: PointerEvent) => {
      if (draggingRef.current) {
        const id = draggingRef.current.id;
        const obj = findPartObject(id);
        const part = partsRef.current.find((p) => p.id === id);
        if (obj && part) {
          part.position = [obj.position.x, 0, obj.position.z];
          if (selectedRef.current === id) setSelectedPos([obj.position.x, obj.position.z]);
        }
      }
      draggingRef.current = null;
      dragArmRef.current = null;
      const shouldPlace = place && pendingPlaceRef.current && !paletteDragRef.current;
      pendingPlaceRef.current = false;
      if (shouldPlace && ev) {
        const point = worldPointFromEvent(ev.clientX, ev.clientY);
        const rect = el.getBoundingClientRect();
        const inside =
          ev.clientX >= rect.left &&
          ev.clientX <= rect.right &&
          ev.clientY >= rect.top &&
          ev.clientY <= rect.bottom;
        if (point && inside) placeAt(point, toolRef.current);
      }
      if (!paletteDragRef.current) t.controls.enabled = true;
      if (t.ghost) t.ghost.visible = !paletteDragRef.current;
    };

    const onMove = (ev: PointerEvent) => {
      if (gesturePointerRef.current != null && ev.pointerId !== gesturePointerRef.current) return;
      const point = worldPointFromEvent(ev.clientX, ev.clientY);
      const rect = el.getBoundingClientRect();
      const inside =
        ev.clientX >= rect.left &&
        ev.clientX <= rect.right &&
        ev.clientY >= rect.top &&
        ev.clientY <= rect.bottom;
      if (!point) {
        // Ray missed the pad: hide the preview so it does not sit as a ghost leak.
        if (t.ghost && !draggingRef.current) t.ghost.visible = false;
        return;
      }
      if (t.ghost) {
        if (draggingRef.current || dragArmRef.current || !inside || paletteDragRef.current) {
          t.ghost.visible = false;
        } else {
          t.ghost.visible = true;
          t.ghost.position.set(snap(point.x), 0, snap(point.z));
        }
      }
      const arm = dragArmRef.current;
      if (arm && !draggingRef.current) {
        const dx = ev.clientX - arm.x;
        const dy = ev.clientY - arm.y;
        if (dx * dx + dy * dy >= DRAG_ARM_PX * DRAG_ARM_PX) {
          draggingRef.current = { id: arm.id, offset: arm.offset };
          dragArmRef.current = null;
        }
      }
      if (draggingRef.current) {
        const obj = findPartObject(draggingRef.current.id);
        if (obj) {
          obj.position.x = snap(point.x - draggingRef.current.offset.x);
          obj.position.z = snap(point.z - draggingRef.current.offset.z);
          const part = partsRef.current.find((p) => p.id === draggingRef.current!.id);
          if (part) part.position = [obj.position.x, 0, obj.position.z];
        }
      }
    };

    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      const point = worldPointFromEvent(ev.clientX, ev.clientY);
      if (!point) return;

      // Palette placement happens only on its own pointerup (avoids double-place).
      if (paletteDragRef.current) {
        t.controls.enabled = false;
        ev.stopImmediatePropagation();
        ev.preventDefault();
        return;
      }

      const rect = el.getBoundingClientRect();
      t.pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      t.pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      t.raycaster.setFromCamera(t.pointer, t.camera);
      const meshes: THREE.Object3D[] = [];
      t.partsRoot.traverse((c) => {
        if (c instanceof THREE.Mesh && c.userData.partId && c.visible) meshes.push(c);
      });
      const hits = t.raycaster.intersectObjects(meshes, false);
      if (hits.length) {
        const id = hits[0].object.userData.partId as string;
        setSelectedId(id);
        selectedRef.current = id;
        const picked = partsRef.current.find((p) => p.id === id);
        setSelectedRot(picked ? ((Math.round(picked.rotationY / (Math.PI / 2)) % 4) + 4) % 4 : 0);
        if (picked) setSelectedPos([picked.position[0], picked.position[2]]);
        const obj = findPartObject(id);
        if (obj) {
          // Arm only: a click selects. Snap-drag starts after the pointer leaves the slop.
          dragArmRef.current = {
            id,
            offset: new THREE.Vector3(point.x - obj.position.x, 0, point.z - obj.position.z),
            x: ev.clientX,
            y: ev.clientY,
          };
          draggingRef.current = null;
          gesturePointerRef.current = ev.pointerId;
          t.controls.enabled = false;
          pendingPlaceRef.current = false;
          ev.stopImmediatePropagation();
          ev.preventDefault();
        }
        return;
      }

      // Arm a ground place; commit on pointerup so a cancelled gesture does not spawn a part.
      pendingPlaceRef.current = true;
      gesturePointerRef.current = ev.pointerId;
      t.controls.enabled = false;
      ev.stopImmediatePropagation();
      ev.preventDefault();
    };

    const ownsGesture = (ev: PointerEvent) =>
      gesturePointerRef.current == null || ev.pointerId === gesturePointerRef.current;

    const onUp = (ev: PointerEvent) => {
      // Touch pointerup often reports button -1; only a secondary mouse button should be ignored.
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      if (!ownsGesture(ev)) return;
      gesturePointerRef.current = null;
      endGesture(true, ev);
    };

    const onCancel = (ev: PointerEvent) => {
      if (!ownsGesture(ev)) return;
      gesturePointerRef.current = null;
      endGesture(false);
    };

    const onBlur = () => {
      // Tab switch / lost capture: do not leave controls disabled or a half-drag.
      gesturePointerRef.current = null;
      endGesture(false);
    };

    const onContextMenu = (ev: Event) => {
      // Right-drag is orbit. The browser menu was cancelling that gesture.
      ev.preventDefault();
    };

    canvas.addEventListener("pointerdown", onDown, true);
    canvas.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("blur", onBlur);
    return () => {
      canvas.removeEventListener("pointerdown", onDown, true);
      canvas.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("blur", onBlur);
      draggingRef.current = null;
      dragArmRef.current = null;
      pendingPlaceRef.current = false;
      gesturePointerRef.current = null;
      if (threeRef.current) threeRef.current.controls.enabled = true;
    };
  }, [ready, worldPointFromEvent, placeAt, findPartObject]);

  // Unmount mid-drag: drop window listeners and unlock orbit. Place itself is wired in pointerdown.
  useEffect(() => {
    return () => {
      paletteDragCleanupRef.current?.();
      paletteDragCleanupRef.current = null;
      paletteDragRef.current = null;
      palettePointerRef.current = null;
      if (threeRef.current) threeRef.current.controls.enabled = true;
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      }
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        rotateSelected();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        nudgeSelected(-GRID, 0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nudgeSelected(GRID, 0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        nudgeSelected(0, -GRID);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        nudgeSelected(0, GRID);
      }
      if (e.key === "1") setTool("wall");
      if (e.key === "2") setTool("floor");
      if (e.key === "3") setTool("roof");
      if (e.key === "4") setTool("column");
      if (e.key === "5") setTool("door");
      if (e.key === "6") setTool("window");
      if (e.key === "7") setTool("stairs");
      if (e.key === "8") setTool("railing");
      if (e.key === "9") setTool("chimney");
      if (e.key.toLowerCase() === "d" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        duplicateSelected();
      }
      if (e.key.toLowerCase() === "g" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        frameSelected();
      }
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        void toggleFullscreen();
      }
      if (e.key === "Escape") {
        if (paletteDragRef.current || pendingPlaceRef.current || draggingRef.current) {
          paletteDragCleanupRef.current?.();
          paletteDragCleanupRef.current = null;
          paletteDragRef.current = null;
          palettePointerRef.current = null;
          gesturePointerRef.current = null;
          pendingPlaceRef.current = false;
          setPlacingFromPalette(false);
          setDragCursor(null);
          draggingRef.current = null;
          dragArmRef.current = null;
          if (threeRef.current) {
            threeRef.current.controls.enabled = true;
            if (threeRef.current.ghost) threeRef.current.ghost.visible = true;
          }
          e.preventDefault();
          return;
        }
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        } else {
          selectedRef.current = null;
          setSelectedId(null);
          setSelectedRot(0);
          setSelectedPos(null);
          if (threeRef.current) threeRef.current.selectionHelper.visible = false;
        }
      }
      if (e.key.toLowerCase() === "c" && (e.ctrlKey || e.metaKey)) {
        // allow browser copy; ignore
      } else if (e.key.toLowerCase() === "c" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        clearAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, rotateSelected, nudgeSelected, duplicateSelected, frameSelected, toggleFullscreen, clearAll]);

  const startPaletteDrag = (kind: PartKind) => (ev: React.PointerEvent) => {
    if (ev.button !== 0) return;
    ev.preventDefault();
    paletteDragCleanupRef.current?.();
    paletteDragCleanupRef.current = null;
    setTool(kind);
    paletteDragRef.current = kind;
    palettePointerRef.current = ev.pointerId;
    setPlacingFromPalette(true);
    setDragCursor({ x: ev.clientX, y: ev.clientY, over: false });
    if (threeRef.current) threeRef.current.controls.enabled = false;
    makeGhost(kind);
    try {
      ev.currentTarget.setPointerCapture(ev.pointerId);
    } catch {
      // Capture can fail if the button unmounts mid-gesture; window listeners still own the drag.
    }

    const pointerId = ev.pointerId;
    const overCanvas = (e: PointerEvent) => {
      const mount = mountRef.current;
      if (!mount) return false;
      const rect = mount.getBoundingClientRect();
      return e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    };
    const detach = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      if (paletteDragCleanupRef.current === detach) paletteDragCleanupRef.current = null;
    };
    const finish = (e: PointerEvent, commit: boolean) => {
      if (e.pointerId !== pointerId) return;
      detach();
      const dragKind = paletteDragRef.current;
      paletteDragRef.current = null;
      palettePointerRef.current = null;
      setPlacingFromPalette(false);
      setDragCursor(null);
      const t = threeRef.current;
      if (t) {
        t.controls.enabled = true;
        // Canvas move hides the preview while a palette drag is active; show it again after drop.
        if (t.ghost) t.ghost.visible = true;
      }
      if (!commit || !dragKind) return;
      const point = worldPointFromEvent(e.clientX, e.clientY);
      if (!point || !overCanvas(e)) return;
      placeAt(point, dragKind);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId || !paletteDragRef.current) return;
      const over = overCanvas(e);
      setDragCursor({ x: e.clientX, y: e.clientY, over });
      const point = worldPointFromEvent(e.clientX, e.clientY);
      const t = threeRef.current;
      if (point && t?.ghost) {
        t.ghost.position.set(snap(point.x), 0, snap(point.z));
        t.ghost.visible = over;
      } else if (t?.ghost) {
        t.ghost.visible = false;
      }
    };
    const onUp = (e: PointerEvent) => finish(e, true);
    const onCancel = (e: PointerEvent) => finish(e, false);
    paletteDragCleanupRef.current = detach;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
  };

  const labels = es
    ? {
        title: "Modelador de casas 3D",
        wall: "Pared",
        floor: "Piso",
        roof: "Techo",
        column: "Pilar",
        door: "Puerta",
        window: "Ventana",
        stairs: "Escalera",
        railing: "Baranda",
        chimney: "Chimenea",
        place: "Arrastrá desde la barra derecha al terreno · o hacé clic en el suelo",
        cam: "Cámara libre: botón derecho / medio · rueda zoom",
        rot: "Rotar 90°",
        del: "Eliminar",
        dup: "Duplicar",
        frame: "Encuadrar",
        coords: "Posición",
        emptyHint: "Todavía no hay piezas. Arrastrá una estructura desde la barra derecha, o elegí una y hacé clic en el terreno.",
        clear: "Limpiar",
        parts: "elementos",
        fullscreen: "Pantalla completa",
        exitFs: "Salir",
        tip: "Atajos: 1 pared · 2 piso · 3 techo · 4 pilar · 5 puerta · 6 ventana · 7 escalera · 8 baranda · 9 chimenea · R rotar · D duplicar · G encuadrar · flechas mueven 0,5 m · Supr borrar · C limpiar · F pantalla completa · Esc cancelar",
        palette: "Estructuras",
        dragHint: "Arrastrá al terreno",
        none: "Nada seleccionado",
        selected: "Seleccionado",
        drop: "Soltá sobre el terreno para colocar",
        dropOver: "Sobre el terreno",
        dropOut: "Fuera del terreno — no se coloca",
        needSel: "Seleccioná una pieza primero",
        rotDeg: "giro",
        sizeWall: "3.0 × 2.6 m",
        sizeFloor: "3.0 × 3.0 m",
        sizeRoof: "3.2 m de ancho",
        sizeColumn: "0.4 × 2.6 m",
        sizeDoor: "0.96 × 2.1 m",
        sizeWindow: "1.2 × 1.15 m",
        sizeStairs: "1.0 m · subida 1.02 m",
        sizeRailing: "1.8 × 0.95 m",
        sizeChimney: "0.8 × 3.2 m",
        help: "Ayuda",
        hideHelp: "Ocultar",
        active: "Activa",
        inspector: "Pieza seleccionada",
        deselect: "Deseleccionar",
        snap: "Grilla 0,5 m",
        tapRotate: "Giro en el sitio",
        compact: "Iconos",
        expandPalette: "Lista",
        selHint: "R gira · Supr borra",
        orient: "Orientación",
        yawHint: "Toque para fijar el giro",
        nudge: "Mover 0,5 m",
        nudgeXP: "Mover +X",
        nudgeXN: "Mover −X",
        nudgeZP: "Mover +Z",
        nudgeZN: "Mover −Z",
      }
    : {
        title: "3D house modeler",
        wall: "Wall",
        floor: "Floor",
        roof: "Roof",
        column: "Column",
        door: "Door",
        window: "Window",
        stairs: "Stairs",
        railing: "Railing",
        chimney: "Chimney",
        place: "Drag from the right toolbar onto the ground · or click the ground",
        cam: "Free camera: right/middle drag · scroll zoom",
        rot: "Rotate 90°",
        del: "Delete",
        dup: "Duplicate",
        frame: "Frame",
        coords: "Position",
        emptyHint: "No pieces yet. Drag a structure from the right bar, or pick one and click the ground.",
        clear: "Clear",
        parts: "parts",
        fullscreen: "Fullscreen",
        exitFs: "Exit",
        tip: "Shortcuts: 1 wall · 2 floor · 3 roof · 4 column · 5 door · 6 window · 7 stairs · 8 railing · 9 chimney · R rotate · D duplicate · G frame · arrows nudge 0.5 m · Del delete · C clear · F fullscreen · Esc cancel",
        palette: "Structures",
        dragHint: "Drag to ground",
        none: "Nothing selected",
        selected: "Selected",
        drop: "Release over the ground to place",
        dropOver: "Over the ground",
        dropOut: "Outside the ground — won't place",
        needSel: "Select a part first",
        rotDeg: "yaw",
        sizeWall: "3.0 × 2.6 m",
        sizeFloor: "3.0 × 3.0 m",
        sizeRoof: "3.2 m wide",
        sizeColumn: "0.4 × 2.6 m",
        sizeDoor: "0.96 × 2.1 m",
        sizeWindow: "1.2 × 1.15 m",
        sizeStairs: "1.0 m wide · 1.02 m rise",
        sizeRailing: "1.8 × 0.95 m",
        sizeChimney: "0.8 × 3.2 m",
        help: "Help",
        hideHelp: "Hide",
        active: "Active",
        inspector: "Selected part",
        deselect: "Deselect",
        snap: "0.5 m snap",
        tapRotate: "Yaw in place",
        compact: "Icons",
        expandPalette: "List",
        selHint: "R rotate · Del delete",
        orient: "Orientation",
        yawHint: "Tap to set the yaw",
        nudge: "Nudge 0.5 m",
        nudgeXP: "Move +X",
        nudgeXN: "Move −X",
        nudgeZP: "Move +Z",
        nudgeZN: "Move −Z",
      };

  const selectedKind = partsRef.current.find((p) => p.id === selectedId)?.kind;
  const selectedKindLabel =
    selectedKind === "wall" ? labels.wall : selectedKind === "floor" ? labels.floor : selectedKind === "roof" ? labels.roof : selectedKind === "column" ? labels.column : selectedKind === "door" ? labels.door : selectedKind === "window" ? labels.window : selectedKind === "stairs" ? labels.stairs : selectedKind === "railing" ? labels.railing : selectedKind === "chimney" ? labels.chimney : "";
  const selectedSize =
    selectedKind === "wall" ? labels.sizeWall : selectedKind === "floor" ? labels.sizeFloor : selectedKind === "roof" ? labels.sizeRoof : selectedKind === "column" ? labels.sizeColumn : selectedKind === "door" ? labels.sizeDoor : selectedKind === "window" ? labels.sizeWindow : selectedKind === "stairs" ? labels.sizeStairs : selectedKind === "railing" ? labels.sizeRailing : selectedKind === "chimney" ? labels.sizeChimney : "";

  const clearSelection = () => {
    selectedRef.current = null;
    setSelectedId(null);
    setSelectedRot(0);
    setSelectedPos(null);
    if (threeRef.current) threeRef.current.selectionHelper.visible = false;
  };

  const paletteItems: { kind: PartKind; label: string; swatch: string; key: string; size: string }[] = [
    { kind: "wall", label: labels.wall, swatch: "#d8d0c4", key: "1", size: labels.sizeWall },
    { kind: "floor", label: labels.floor, swatch: "#8b7355", key: "2", size: labels.sizeFloor },
    { kind: "roof", label: labels.roof, swatch: "#6b3a2a", key: "3", size: labels.sizeRoof },
    { kind: "column", label: labels.column, swatch: "#c8bfb0", key: "4", size: labels.sizeColumn },
    { kind: "door", label: labels.door, swatch: "#8b5a32", key: "5", size: labels.sizeDoor },
    { kind: "window", label: labels.window, swatch: "#9bb7c9", key: "6", size: labels.sizeWindow },
    { kind: "stairs", label: labels.stairs, swatch: "#8b5a32", key: "7", size: labels.sizeStairs },
    { kind: "railing", label: labels.railing, swatch: "#6d4a30", key: "8", size: labels.sizeRailing },
    { kind: "chimney", label: labels.chimney, swatch: "#b7ab9a", key: "9", size: labels.sizeChimney },
  ];
  const activeLabel =
    tool === "wall" ? labels.wall : tool === "floor" ? labels.floor : tool === "roof" ? labels.roof : tool === "column" ? labels.column : tool === "door" ? labels.door : tool === "window" ? labels.window : tool === "stairs" ? labels.stairs : tool === "railing" ? labels.railing : labels.chimney;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-foreground">{labels.title}</p>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {count} {labels.parts}
        </span>
        <span className="rounded-full border border-amber-700/40 bg-amber-900/15 px-2 py-0.5 text-[11px] font-semibold text-foreground">
          {labels.active}: {activeLabel}
        </span>
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          aria-expanded={showHelp}
          className="ml-auto rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold hover:bg-accent"
        >
          {showHelp ? labels.hideHelp : labels.help}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={duplicateSelected}
          disabled={!selectedId}
          aria-label={labels.dup}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          title={selectedId ? "D" : labels.needSel}
        >
          {labels.dup}
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">D</kbd>
        </button>
        <button
          type="button"
          onClick={frameSelected}
          disabled={!selectedId}
          aria-label={labels.frame}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          title={selectedId ? "G" : labels.needSel}
        >
          {labels.frame}
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">G</kbd>
        </button>
        <button
          type="button"
          onClick={rotateSelected}
          disabled={!selectedId}
          aria-label={labels.rot}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          title={selectedId ? "R" : labels.needSel}
        >
          {labels.rot}
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">R</kbd>
        </button>
        <button
          type="button"
          onClick={deleteSelected}
          disabled={!selectedId}
          aria-label={labels.del}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          title={selectedId ? "Del" : labels.needSel}
        >
          {labels.del}
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">Del</kbd>
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={count === 0}
          aria-label={labels.clear}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          title="C"
        >
          {labels.clear}
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">C</kbd>
        </button>
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          aria-pressed={isFullscreen}
          aria-label={isFullscreen ? labels.exitFs : labels.fullscreen}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
          title="F"
        >
          {isFullscreen ? labels.exitFs : labels.fullscreen}
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">F</kbd>
        </button>
      </div>

      {showHelp && (
        <div className="rounded-lg border border-border/70 bg-card/80 px-3 py-2 text-xs text-muted-foreground">
          <p>{labels.place}</p>
          <p className="mt-1">{labels.cam}</p>
          <p className="mt-1">{labels.tip}</p>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div
        ref={shellRef}
        className={`relative flex overflow-hidden rounded-xl border border-border shadow-inner ${
          isFullscreen ? "h-screen w-screen rounded-none border-0" : "h-[min(72vh,680px)] w-full"
        }`}
        style={{
          background: isFullscreen
            ? "#0a1210"
            : "linear-gradient(180deg, #87a8c8 0%, #c5d4a8 55%, #5a7a48 100%)",
        }}
      >
        {/* 3D canvas */}
        <div className="relative min-h-0 min-w-0 flex-1">
          <div
            ref={mountRef}
            className="h-full w-full"
            style={{ touchAction: "none" }}
          />
          {count === 0 && !placingFromPalette && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center p-4 pb-16 sm:items-center sm:pb-4">
              <p className="max-w-sm rounded-xl bg-black/60 px-4 py-3 text-center text-sm font-medium leading-snug text-amber-50 shadow-lg ring-1 ring-amber-100/25">
                {labels.emptyHint}
              </p>
            </div>
          )}
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[80%] flex-col gap-1">
            <span className="rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-amber-50 shadow">
              {labels.active}: {activeLabel}
            </span>
            {placingFromPalette && (
              <span className="rounded-md bg-amber-800/90 px-2 py-1 text-[11px] font-semibold text-amber-50 shadow">
                {labels.drop}
              </span>
            )}
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex max-w-[75%] flex-col gap-1">
            <span
              role="status"
              aria-live="polite"
              className={`rounded-md px-2 py-1 text-[11px] font-medium shadow ${
                selectedKindLabel ? "bg-amber-900/85 text-amber-50 ring-1 ring-amber-200/50" : "bg-black/55 text-amber-50"
              }`}
            >
              {selectedKindLabel
                ? `${labels.selected}: ${selectedKindLabel} · ${selectedSize} · ${labels.rotDeg} ${selectedRot * 90}°${
                    selectedPos ? ` · X ${selectedPos[0].toFixed(1)} Z ${selectedPos[1].toFixed(1)}` : ""
                  }`
                : labels.none}
            </span>
            <span className="w-fit rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-medium text-amber-100/90">
              {labels.snap}
            </span>
          </div>
        </div>

          {selectedKindLabel && (
            <div
              role="group"
              aria-label={labels.nudge}
              className="absolute bottom-3 right-3 z-10 grid grid-cols-3 gap-1 rounded-xl bg-black/50 p-1 shadow ring-1 ring-amber-100/20"
            >
              <span className="col-span-3 px-1 text-center text-[9px] font-semibold uppercase tracking-wide text-amber-100/90">
                {labels.nudge}
              </span>
              <span />
              <button
                type="button"
                onClick={() => nudgeSelected(0, -GRID)}
                aria-label={labels.nudgeZN}
                title={labels.nudgeZN}
                className="min-h-11 min-w-11 rounded-lg border border-amber-100/20 bg-amber-950/80 text-sm font-semibold text-amber-50 hover:bg-amber-800"
              >
                −Z
              </button>
              <span />
              <button
                type="button"
                onClick={() => nudgeSelected(-GRID, 0)}
                aria-label={labels.nudgeXN}
                title={labels.nudgeXN}
                className="min-h-11 min-w-11 rounded-lg border border-amber-100/20 bg-amber-950/80 text-sm font-semibold text-amber-50 hover:bg-amber-800"
              >
                −X
              </button>
              <span className="flex min-h-11 items-center justify-center text-[10px] font-semibold text-amber-100/80">
                {selectedRot * 90}°
              </span>
              <button
                type="button"
                onClick={() => nudgeSelected(GRID, 0)}
                aria-label={labels.nudgeXP}
                title={labels.nudgeXP}
                className="min-h-11 min-w-11 rounded-lg border border-amber-100/20 bg-amber-950/80 text-sm font-semibold text-amber-50 hover:bg-amber-800"
              >
                +X
              </button>
              <span />
              <button
                type="button"
                onClick={() => nudgeSelected(0, GRID)}
                aria-label={labels.nudgeZP}
                title={labels.nudgeZP}
                className="min-h-11 min-w-11 rounded-lg border border-amber-100/20 bg-amber-950/80 text-sm font-semibold text-amber-50 hover:bg-amber-800"
              >
                +Z
              </button>
              <span />
            </div>
          )}

        {/* Right structure palette — drag to place */}
        <aside
          role="toolbar"
          aria-label={labels.palette}
          aria-orientation="vertical"
          className={`flex shrink-0 flex-col gap-2 overflow-y-auto border-l border-border/60 bg-card/95 p-2 backdrop-blur-sm ${
            paletteCompact ? "w-[4.25rem]" : isFullscreen ? "w-44" : "w-36 sm:w-44"
          }`}
        >
          <div className="flex items-center justify-between gap-1 px-0.5">
            {!paletteCompact && (
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {labels.palette}
              </p>
            )}
            <button
              type="button"
              onClick={() => setPaletteCompact((v) => !v)}
              aria-pressed={paletteCompact}
              title={paletteCompact ? labels.expandPalette : labels.compact}
              className="ml-auto min-h-9 min-w-9 rounded-lg border border-border bg-background px-1.5 text-[10px] font-semibold hover:bg-accent"
            >
              {paletteCompact ? labels.expandPalette : labels.compact}
            </button>
          </div>
          {!paletteCompact && (
            <p className="px-1 text-[10px] leading-snug text-muted-foreground">{labels.dragHint}</p>
          )}
          {selectedKindLabel && !paletteCompact ? (
            <div className="rounded-xl border border-amber-700/50 bg-amber-900/15 p-2 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                {labels.inspector}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">{selectedKindLabel}</p>
              <p className="text-[10px] text-muted-foreground">{selectedSize}</p>
              {selectedPos && (
                <p className="mt-1 font-mono text-[10px] text-foreground" aria-label={labels.coords}>
                  {labels.coords} X {selectedPos[0].toFixed(1)} · Z {selectedPos[1].toFixed(1)}
                </p>
              )}
              <div className="mt-1.5" role="group" aria-label={labels.orient}>
                <p className="mb-1 text-[10px] font-semibold text-muted-foreground">{labels.orient}</p>
                <div className="grid grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map((step) => {
                    const active = step === ((selectedRot % 4) + 4) % 4;
                    const deg = step * 90;
                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setSelectedYaw(step)}
                        aria-pressed={active}
                        title={`${labels.orient} ${deg}°`}
                        className={`min-h-11 rounded-md border text-[10px] font-semibold ${
                          active
                            ? "border-amber-700 bg-amber-800 text-amber-50"
                            : "border-border bg-background text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {deg}°
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="mt-1 text-[10px] leading-snug text-muted-foreground">
                {labels.rotDeg} {selectedRot * 90}° · {labels.yawHint}
              </p>
              <div className="mt-1.5 grid grid-cols-4 gap-1" role="group" aria-label={labels.nudge}>
                <button type="button" onClick={() => nudgeSelected(-GRID, 0)} aria-label={labels.nudgeXN} className="min-h-11 rounded-md border border-border bg-background text-[10px] font-semibold hover:bg-accent">−X</button>
                <button type="button" onClick={() => nudgeSelected(GRID, 0)} aria-label={labels.nudgeXP} className="min-h-11 rounded-md border border-border bg-background text-[10px] font-semibold hover:bg-accent">+X</button>
                <button type="button" onClick={() => nudgeSelected(0, -GRID)} aria-label={labels.nudgeZN} className="min-h-11 rounded-md border border-border bg-background text-[10px] font-semibold hover:bg-accent">−Z</button>
                <button type="button" onClick={() => nudgeSelected(0, GRID)} aria-label={labels.nudgeZP} className="min-h-11 rounded-md border border-border bg-background text-[10px] font-semibold hover:bg-accent">+Z</button>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={rotateSelected}
                  title="R"
                  aria-label={labels.rot}
                  className="min-h-11 rounded-lg border border-border bg-background px-2 text-xs font-semibold hover:bg-accent"
                >
                  {labels.rot}
                </button>
                <button
                  type="button"
                  onClick={deleteSelected}
                  title="Del"
                  aria-label={labels.del}
                  className="min-h-11 rounded-lg border border-destructive/40 bg-background px-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
                >
                  {labels.del}
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="min-h-11 rounded-lg border border-border bg-background px-2 text-xs font-semibold hover:bg-accent"
                >
                  {labels.deselect}
                </button>
              </div>
            </div>
          ) : paletteCompact && selectedKindLabel ? (
            <div className="flex flex-col gap-1">
              <span className="text-center text-[9px] font-semibold text-amber-800 dark:text-amber-200">
                {selectedRot * 90}°
              </span>
              <button
                type="button"
                onClick={rotateSelected}
                title="R"
                aria-label={labels.rot}
                className="min-h-11 rounded-lg border border-border bg-background px-1 text-[10px] font-semibold hover:bg-accent"
              >
                R
              </button>
              <button
                type="button"
                onClick={deleteSelected}
                title="Del"
                aria-label={labels.del}
                className="min-h-11 rounded-lg border border-destructive/40 bg-background px-1 text-[10px] font-semibold text-destructive hover:bg-destructive/10"
              >
                Del
              </button>
            </div>
          ) : !paletteCompact ? (
            <p className="rounded-lg border border-dashed border-border px-2 py-2 text-[10px] leading-snug text-muted-foreground">
              {labels.none}
            </p>
          ) : null}
          {paletteItems.map((item) => (
            <button
              key={item.kind}
              type="button"
              onPointerDown={startPaletteDrag(item.kind)}
              onClick={() => setTool(item.kind)}
              aria-pressed={tool === item.kind}
              aria-label={`${item.label} (${item.key})`}
              title={`${item.label} · ${item.size} · ${labels.dragHint} (${item.key})`}
            className={`group flex min-h-11 cursor-grab touch-manipulation flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center transition active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ${
                tool === item.kind
                  ? "border-amber-700/70 bg-amber-900/20 shadow-sm ring-1 ring-amber-700/40"
                  : "border-border bg-background/80 hover:bg-accent"
              } ${placingFromPalette && tool === item.kind ? "scale-[0.98] ring-2 ring-amber-600" : ""}`}
            >
              <StructureGlyph kind={item.kind} />
              {!paletteCompact && (
                <>
                  <span className="text-xs font-semibold text-foreground">{item.label}</span>
                  <span className="text-[10px] leading-none text-muted-foreground">{item.size}</span>
                </>
              )}
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {item.key}
                {!paletteCompact && tool === item.kind ? ` · ${labels.active}` : ""}
              </span>
            </button>
          ))}

          {isFullscreen && (
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="mt-auto min-h-11 rounded-lg border border-border bg-background px-2 py-2 text-xs font-semibold hover:bg-accent"
            >
              {labels.exitFs} (F)
            </button>
          )}
        </aside>
      </div>
      {dragCursor && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed z-50 flex max-w-[16rem] -translate-x-1/2 -translate-y-[120%] items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-semibold shadow-lg ring-1 ring-amber-100/30"
          style={{
            left: Math.min(window.innerWidth - 88, Math.max(88, dragCursor.x)),
            top: Math.min(window.innerHeight - 28, Math.max(56, dragCursor.y)),
            background: dragCursor.over ? "rgba(120, 53, 15, 0.94)" : "rgba(69, 26, 26, 0.94)",
            color: "#fff7ed",
          }}
        >
          <span className="rounded bg-amber-50/95 px-0.5">
            <StructureGlyph kind={tool} />
          </span>
          <span>
            {activeLabel} · {dragCursor.over ? labels.dropOver : labels.dropOut}
          </span>
        </div>
      )}
    </div>
  );
}
