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
      d[i] = Math.min(255, Math.max(0, base[0] + n));
      d[i + 1] = Math.min(255, Math.max(0, base[1] + n * 0.92));
      d[i + 2] = Math.min(255, Math.max(0, base[2] + n * 0.8));
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function solid(ctx: CanvasRenderingContext2D, size: number, rgb: string) {
  ctx.fillStyle = rgb;
  ctx.fillRect(0, 0, size, size);
}

export function paintPlaster(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [214, 204, 188], 16); }
export function paintPlasterBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#8e8e8e"); }
export function paintPlinth(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [158, 146, 130], 14); }
export function paintTimber(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [140, 100, 60], 18); }
export function paintTimberBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#b0b0b0"); }
export function paintClayTiles(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [140, 60, 40], 20); }
export function paintTileBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#6e6e6e"); }
export function paintPlate(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [132, 86, 48], 18); }
export function paintPlateBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#a4a4a4"); }
export function paintNosing(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [96, 62, 36], 16); }
export function paintNosingBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#999"); }
export function paintFascia(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [108, 78, 52], 14); }
export function paintFasciaBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#888"); }
export function paintDoorLeaf(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [118, 74, 42], 12); }
export function paintDoorLeafBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#9a9a9a"); }
export function paintJoinery(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [100, 70, 45], 12); }
export function paintJoineryBump(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#aaa"); }
export function paintGlazing(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#9bb7c9"); }
export function paintGlazingRough(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#cccccc"); }
export function paintContactAO(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#333333"); }
export function paintGrass(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [80, 120, 50], 20); }
export function paintGrassRelief(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#777"); }
export function paintGravel(ctx: CanvasRenderingContext2D, size: number) { noiseFill(ctx, size, [140, 130, 110], 25); }
export function paintCirrus(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#e8eef5"); }
export function paintHorizonHaze(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#c5d4a8"); }
export function paintNormalFromHeight(ctx: CanvasRenderingContext2D, size: number) { solid(ctx, size, "#8080ff"); }
