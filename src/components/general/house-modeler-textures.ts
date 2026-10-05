import * as THREE from "three";

export type PartKind = "wall" | "floor" | "roof" | "column" | "door" | "window" | "stairs" | "railing" | "chimney" | "beam";

export type Locale = "en" | "es";

export type ScenePart = {
  id: string;
  kind: PartKind;
  position: [number, number, number];
  rotationY: number;
  mesh: THREE.Mesh;
  locked: boolean;
  layer: number;
};

export const LAYER_COUNT = 8;
export const GRID = 0.5;

export function snap(v: number) {
  return Math.round(v / GRID) * GRID;
}

export function disposeObjectResources(obj: THREE.Object3D, disposeMaterials: boolean) {
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

export function uid() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function hash2(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function byte(n: number) {
  return n < 0 ? 0 : n > 255 ? 255 : n | 0;
}

export function makeCanvasTexture(
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

export function noiseFill(ctx: CanvasRenderingContext2D, size: number, base: [number, number, number], amp: number) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = (hash2(x * 0.73, y * 0.73) - 0.5) * amp;
      const i = (y * size + x) * 4;
      d[i] = byte(base[0] + n);
      d[i + 1] = byte(base[1] + n * 0.92);
      d[i + 2] = byte(base[2] + n * 0.8);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function solid(ctx: CanvasRenderingContext2D, size: number, rgb: string) {
  ctx.fillStyle = rgb;
  ctx.fillRect(0, 0, size, size);
}

function putPixels(
  ctx: CanvasRenderingContext2D,
  size: number,
  sample: (x: number, y: number) => [number, number, number],
) {
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b] = sample(x, y);
      const i = (y * size + x) * 4;
      d[i] = byte(r);
      d[i + 1] = byte(g);
      d[i + 2] = byte(b);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** Warm stucco: fine grit, broad mottling, faint horizontal trowel streaks. */
export function paintPlaster(ctx: CanvasRenderingContext2D, size: number) {
  putPixels(ctx, size, (x, y) => {
    const grit = (hash2(x * 0.9, y * 0.9) - 0.5) * 16;
    const mott = (hash2(x * 0.11, y * 0.09) - 0.5) * 14;
    const streak = Math.sin(y * 0.42 + hash2(Math.floor(x / 18), 2.4) * 8) * 5;
    return [214 + grit + mott + streak, 202 + grit * 0.9 + mott * 0.85, 184 + grit * 0.7 + mott * 0.55];
  });
}
export function paintPlasterBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#8e8e8e"); }
export function paintPlinth(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [158, 146, 130], 14); }

/** Longitudinal timber grain with occasional darker knots. */
export function paintTimber(ctx: CanvasRenderingContext2D, size: number) {
  putPixels(ctx, size, (x, y) => {
    const ring = Math.sin(y * 0.62 + hash2(0, Math.floor(x / 32)) * 3) * 9 + Math.sin(y * 0.15) * 5;
    const grain = (hash2(x * 0.35, y * 2.1) - 0.5) * 12;
    const knot = hash2(Math.floor(x / 36), Math.floor(y / 22));
    const dark = knot > 0.93 ? -32 : 0;
    return [150 + ring + grain + dark, 102 + ring * 0.65 + grain * 0.75 + dark, 56 + ring * 0.35 + grain * 0.45 + dark * 0.55];
  });
}
export function paintTimberBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#b0b0b0"); }

/** Staggered clay courses with mortar joints. */
export function paintClayTiles(ctx: CanvasRenderingContext2D, size: number) {
  const tileH = 16;
  const tileW = 28;
  putPixels(ctx, size, (x, y) => {
    const row = Math.floor(y / tileH);
    const inRow = y % tileH;
    const offset = (row % 2) * (tileW / 2);
    const xx = (x + offset) % tileW;
    const mortar = inRow < 2 || xx < 2;
    const n = (hash2(x * 0.8, y * 0.8) - 0.5) * 10;
    if (mortar) return [96 + n * 0.3, 78 + n * 0.25, 68 + n * 0.2];
    const shade = (hash2(row * 1.7, Math.floor((x + offset) / tileW) * 2.3) - 0.5) * 24;
    const belly = Math.sin((xx / tileW) * Math.PI) * 8;
    return [168 + shade + n + belly, 74 + shade * 0.4 + n * 0.45, 46 + shade * 0.2 + n * 0.25];
  });
}
export function paintTileBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#6e6e6e"); }
export function paintPlate(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [132, 86, 48], 18); }
export function paintPlateBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#a4a4a4"); }
export function paintNosing(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [96, 62, 36], 16); }
export function paintNosingBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#999"); }
export function paintFascia(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [108, 78, 52], 14); }
export function paintFasciaBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#888"); }

/** Door leaf: vertical stile/rail suggestion plus two recessed panels. */
export function paintDoorLeaf(ctx: CanvasRenderingContext2D, size: number) {
  putPixels(ctx, size, (x, y) => {
    const grain = (hash2(x * 0.4, y * 1.8) - 0.5) * 10;
    const stile = x < size * 0.1 || x > size * 0.9 || y < size * 0.08 || y > size * 0.92;
    const rail = Math.abs(y - size * 0.5) < size * 0.04;
    const panel = !stile && !rail;
    const base = stile || rail ? 108 : 128;
    const recess = panel ? -10 : 0;
    return [base + grain + recess, 70 + grain * 0.7 + recess * 0.6, 40 + grain * 0.4];
  });
}
export function paintDoorLeafBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#9a9a9a"); }
export function paintJoinery(ctx: CanvasRenderingContext2D, size: number) {
  putPixels(ctx, size, (x, y) => {
    const grain = (hash2(x * 0.5, y * 1.4) - 0.5) * 10;
    const ring = Math.sin(y * 0.4) * 4;
    return [112 + grain + ring, 76 + grain * 0.7, 46 + grain * 0.4];
  });
}
export function paintJoineryBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#aaa"); }
export function paintGlazing(ctx: CanvasRenderingContext2D, size: number) {
  putPixels(ctx, size, (x, y) => {
    const sheen = Math.sin((x + y) * 0.08) * 8;
    const n = (hash2(x * 0.2, y * 0.2) - 0.5) * 6;
    return [150 + sheen + n, 184 + sheen * 0.6, 204 + n];
  });
}
export function paintGlazingRough(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#cccccc"); }
export function paintContactAO(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#333333"); }
export function paintGrass(ctx: CanvasRenderingContext2D, size: number) {
  putPixels(ctx, size, (x, y) => {
    const tuft = (hash2(x * 0.45, y * 0.7) - 0.5) * 22;
    const patch = (hash2(x * 0.08, y * 0.08) - 0.5) * 16;
    return [78 + tuft * 0.4 + patch * 0.3, 122 + tuft + patch, 52 + tuft * 0.35];
  });
}
export function paintGrassRelief(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#777"); }
export function paintGravel(ctx: CanvasRenderingContext2D, size: number) {
  putPixels(ctx, size, (x, y) => {
    const cell = hash2(Math.floor(x / 5), Math.floor(y / 5));
    const pebble = (cell - 0.5) * 40;
    const grit = (hash2(x * 1.3, y * 1.3) - 0.5) * 12;
    return [148 + pebble + grit, 136 + pebble * 0.85 + grit, 116 + pebble * 0.7 + grit];
  });
}
export function paintCirrus(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#e8eef5"); }
export function paintHorizonHaze(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#c5d4a8"); }
export function paintNormalFromHeight(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#8080ff"); }
