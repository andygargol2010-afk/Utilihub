import type { GeneralTool } from "@/lib/general/types";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

type PartKind = "wall" | "floor" | "roof" | "column" | "door" | "window" | "stairs" | "railing" | "chimney" | "beam" | "foundation" | "pergola" | "fence" | "path" | "planter" | "bench" | "lamp";
type Locale = "en" | "es";
/** Door leaf finish. Timber stays the default; sheet metal is the selectable alternate. */
type DoorFinish = "timber" | "metal";
/** Roof covering. Clay tile stays the default; standing-seam metal is the selectable alternate. */
type RoofFinish = "clay" | "metal";
/** Wall face. Lime plaster stays the default; ashlar masonry is the selectable alternate. */
type WallFinish = "plaster" | "masonry" | "timber";
/** Column shaft. Lime plaster stays the default; ashlar masonry or timber cladding is the selectable alternate (timber ported from walls). */
type ColumnFinish = "plaster" | "masonry" | "timber";
/** Stair flight. Timber treads stay the default; ashlar masonry is the selectable alternate (ported from walls). */
type StairsFinish = "timber" | "masonry" | "metal";
/** Balcony rail. Timber stays the default; wrought iron is the selectable alternate (ported from door sheet metal). */
type RailingFinish = "timber" | "metal";
/** Window sash. Painted timber stays the default; iron frame is the selectable alternate (ported from railing bar stock). */
type WindowFinish = "timber" | "metal";
/** Floor deck. Timber boards stay the default; clay tile is the selectable alternate (ported from roof tiles). */
type FloorFinish = "timber" | "clay";
/** Garden fence. Timber pickets stay the default; iron bar stock is the selectable alternate (ported from railing). */
type FenceFinish = "timber" | "metal";
/** Garden path. Gravel stays the default; clay tile is the selectable alternate (ported from the floor deck). */
type PathFinish = "gravel" | "clay";
/** Garden trough. Terracotta clay stays the default; timber boards are the selectable alternate (ported from the fence plate). */
type PlanterFinish = "clay" | "timber";
/** Garden bench. Timber slats stay the default; ashlar masonry is the selectable alternate (ported from walls). */
type BenchFinish = "timber" | "masonry";
/** Chimney stack. Running-bond brick stays the default; ashlar masonry is the selectable alternate (ported from walls). */
type ChimneyFinish = "brick" | "masonry";
/** Garden lamp. Timber post stays the default; iron bar stock is the selectable alternate (ported from railing). */
type LampFinish = "timber" | "metal";

/** Open timber bay. Timber stays the default; iron bar stock is the selectable alternate (ported from railing). */
type BeamFinish = "timber" | "metal";

/** Strip footing. Board-formed concrete stays the default; ashlar stone is the selectable alternate (ported from walls). */
type FoundationFinish = "concrete" | "stone";

/** Shade bay. Timber stays the default; iron bar stock is the selectable alternate (ported from beam/railing). */
type PergolaFinish = "timber" | "metal";

type ScenePart = {
  id: string;
  kind: PartKind;
  position: [number, number, number];
  rotationY: number;
  mesh: THREE.Mesh;
  /** Part-level lock: cannot move, rotate, or delete. */
  locked: boolean;
  layerId: string;
  /** Kept on the part so rotate/clone do not drop the chosen door finish. */
  finish: DoorFinish;
  /** Kept on the part so rotate/clone do not drop the chosen roof covering. */
  roofFinish: RoofFinish;
  /** Kept on the part so rotate/clone do not drop the chosen wall face. */
  wallFinish: WallFinish;
  /** Kept on the part so rotate/clone do not drop the chosen column shaft. */
  columnFinish: ColumnFinish;
  /** Kept on the part so rotate/clone do not drop the chosen stair flight. */
  stairsFinish: StairsFinish;
  /** Kept on the part so rotate/clone do not drop the chosen railing. */
  railingFinish: RailingFinish;
  /** Kept on the part so rotate/clone do not drop the chosen window sash. */
  windowFinish: WindowFinish;
  /** Kept on the part so rotate/clone do not drop the chosen floor deck. */
  floorFinish: FloorFinish;
  /** Kept on the part so rotate/clone do not drop the chosen fence bay. */
  fenceFinish: FenceFinish;
  /** Kept on the part so rotate/clone do not drop the chosen path surface. */
  pathFinish: PathFinish;
  /** Kept on the part so rotate/clone do not drop the chosen planter body. */
  planterFinish: PlanterFinish;
  /** Kept on the part so rotate/clone do not drop the chosen bench seat. */
  benchFinish: BenchFinish;
  /** Kept on the part so rotate/clone do not drop the chosen chimney stack. */
  chimneyFinish: ChimneyFinish;
  /** Kept on the part so rotate/clone do not drop the chosen lamp post. */
  lampFinish: LampFinish;
  /** Kept on the part so rotate/clone do not drop the chosen beam bay. */
  beamFinish: BeamFinish;
  /** Kept on the part so rotate/clone do not drop the chosen foundation strip. */
  foundationFinish: FoundationFinish;
  /** Kept on the part so rotate/clone do not drop the chosen pergola bay. */
  pergolaFinish: PergolaFinish;
};

function doorFinishOf(part: { kind: PartKind; finish?: DoorFinish } | undefined, fallback: DoorFinish = "timber"): DoorFinish {
  if (part?.kind === "door" && part.finish === "metal") return "metal";
  if (part?.kind === "door") return part.finish === "timber" ? "timber" : fallback;
  return "timber";
}

function roofFinishOf(part: { kind: PartKind; roofFinish?: RoofFinish } | undefined, fallback: RoofFinish = "clay"): RoofFinish {
  if (part?.kind === "roof" && part.roofFinish === "metal") return "metal";
  if (part?.kind === "roof") return part.roofFinish === "clay" ? "clay" : fallback;
  return "clay";
}

function wallFinishOf(part: { kind: PartKind; wallFinish?: WallFinish } | undefined, fallback: WallFinish = "plaster"): WallFinish {
  if (part?.kind === "wall" && part.wallFinish === "masonry") return "masonry";
  if (part?.kind === "wall" && part.wallFinish === "timber") return "timber";
  if (part?.kind === "wall") return part.wallFinish === "plaster" ? "plaster" : fallback;
  return "plaster";
}

function columnFinishOf(part: { kind: PartKind; columnFinish?: ColumnFinish } | undefined, fallback: ColumnFinish = "plaster"): ColumnFinish {
  if (part?.kind === "column" && part.columnFinish === "masonry") return "masonry";
  if (part?.kind === "column" && part.columnFinish === "timber") return "timber";
  if (part?.kind === "column") return part.columnFinish === "plaster" ? "plaster" : fallback;
  return "plaster";
}

function stairsFinishOf(part: { kind: PartKind; stairsFinish?: StairsFinish } | undefined, fallback: StairsFinish = "timber"): StairsFinish {
  if (part?.kind === "stairs" && part.stairsFinish === "masonry") return "masonry";
  if (part?.kind === "stairs" && part.stairsFinish === "metal") return "metal";
  if (part?.kind === "stairs") return part.stairsFinish === "timber" ? "timber" : fallback;
  return "timber";
}

function railingFinishOf(part: { kind: PartKind; railingFinish?: RailingFinish } | undefined, fallback: RailingFinish = "timber"): RailingFinish {
  if (part?.kind === "railing" && part.railingFinish === "metal") return "metal";
  if (part?.kind === "railing") return part.railingFinish === "timber" ? "timber" : fallback;
  return "timber";
}

function windowFinishOf(part: { kind: PartKind; windowFinish?: WindowFinish } | undefined, fallback: WindowFinish = "timber"): WindowFinish {
  if (part?.kind === "window" && part.windowFinish === "metal") return "metal";
  if (part?.kind === "window") return part.windowFinish === "timber" ? "timber" : fallback;
  return "timber";
}

function floorFinishOf(part: { kind: PartKind; floorFinish?: FloorFinish } | undefined, fallback: FloorFinish = "timber"): FloorFinish {
  if (part?.kind === "floor" && part.floorFinish === "clay") return "clay";
  if (part?.kind === "floor") return part.floorFinish === "timber" ? "timber" : fallback;
  return "timber";
}

function fenceFinishOf(part: { kind: PartKind; fenceFinish?: FenceFinish } | undefined, fallback: FenceFinish = "timber"): FenceFinish {
  if (part?.kind === "fence" && part.fenceFinish === "metal") return "metal";
  if (part?.kind === "fence") return part.fenceFinish === "timber" ? "timber" : fallback;
  return "timber";
}

function pathFinishOf(part: { kind: PartKind; pathFinish?: PathFinish } | undefined, fallback: PathFinish = "gravel"): PathFinish {
  if (part?.kind === "path" && part.pathFinish === "clay") return "clay";
  if (part?.kind === "path") return part.pathFinish === "gravel" ? "gravel" : fallback;
  return "gravel";
}

function planterFinishOf(part: { kind: PartKind; planterFinish?: PlanterFinish } | undefined, fallback: PlanterFinish = "clay"): PlanterFinish {
  if (part?.kind === "planter" && part.planterFinish === "timber") return "timber";
  if (part?.kind === "planter") return part.planterFinish === "clay" ? "clay" : fallback;
  return "clay";
}

function benchFinishOf(part: { kind: PartKind; benchFinish?: BenchFinish } | undefined, fallback: BenchFinish = "timber"): BenchFinish {
  if (part?.kind === "bench" && part.benchFinish === "masonry") return "masonry";
  if (part?.kind === "bench") return part.benchFinish === "timber" ? "timber" : fallback;
  return "timber";
}

function chimneyFinishOf(part: { kind: PartKind; chimneyFinish?: ChimneyFinish } | undefined, fallback: ChimneyFinish = "brick"): ChimneyFinish {
  if (part?.kind === "chimney" && part.chimneyFinish === "masonry") return "masonry";
  if (part?.kind === "chimney") return part.chimneyFinish === "brick" ? "brick" : fallback;
  return "brick";
}

function lampFinishOf(part: { kind: PartKind; lampFinish?: LampFinish } | undefined, fallback: LampFinish = "timber"): LampFinish {
  if (part?.kind === "lamp" && part.lampFinish === "metal") return "metal";
  if (part?.kind === "lamp") return part.lampFinish === "timber" ? "timber" : fallback;
  return "timber";
}

function beamFinishOf(part: { kind: PartKind; beamFinish?: BeamFinish } | undefined, fallback: BeamFinish = "timber"): BeamFinish {
  if (part?.kind === "beam" && part.beamFinish === "metal") return "metal";
  if (part?.kind === "beam") return part.beamFinish === "timber" ? "timber" : fallback;
  return "timber";
}
function foundationFinishOf(part: { kind: PartKind; foundationFinish?: FoundationFinish } | undefined, fallback: FoundationFinish = "concrete"): FoundationFinish {
  if (part?.kind === "foundation" && part.foundationFinish === "stone") return "stone";
  if (part?.kind === "foundation") return part.foundationFinish === "concrete" ? "concrete" : fallback;
  return "concrete";
}

function pergolaFinishOf(part: { kind: PartKind; pergolaFinish?: PergolaFinish } | undefined, fallback: PergolaFinish = "timber"): PergolaFinish {
  if (part?.kind === "pergola" && part.pergolaFinish === "metal") return "metal";
  if (part?.kind === "pergola") return part.pergolaFinish === "timber" ? "timber" : fallback;
  return "timber";
}


type SceneLayer = {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
};

const BASE_LAYER_ID = "layer-base";

function partFrozen(part: ScenePart, layers: SceneLayer[]) {
  const layer = layers.find((l) => l.id === part.layerId);
  return part.locked || !!layer?.locked;
}

/** Small padlock so locked parts read at a glance. Unique geometry per badge (safe to dispose). */
function syncLockBadge(obj: THREE.Object3D, on: boolean) {
  let badge = obj.getObjectByName("lockBadge");
  if (!badge) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf2c14e,
      metalness: 0.5,
      roughness: 0.38,
      emissive: 0x8a5a10,
      emissiveIntensity: 0.5,
    });
    const group = new THREE.Group();
    group.name = "lockBadge";
    const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.016, 6, 10, Math.PI), mat);
    shackle.position.y = 0.06;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.03), mat);
    group.add(shackle, body);
    const box = new THREE.Box3().setFromObject(obj);
    const top = Number.isFinite(box.max.y) ? box.max.y - obj.position.y : 2.4;
    group.position.set(0, top + 0.16, 0);
    group.visible = false;
    obj.add(group);
    badge = group;
  }
  // Badge sits above the mesh. Without partId a click passes through and places a new piece.
  const partId = obj.userData.partId;
  if (partId) {
    badge.userData.partId = partId;
    badge.traverse((c) => {
      if (c instanceof THREE.Mesh) c.userData.partId = partId;
    });
  }
  badge.visible = on;
}

const GRID = 0.5;

function snap(v: number) {
  return Math.round(v / GRID) * GRID;
}

/** Site disc is radius 120. Keep dragged parts inside it when the ray misses the mesh. */
const SITE_RADIUS = 118;

/** Snap can step past the rim. Pull the origin back so nudge/duplicate cannot leave the pad. */
function clampToSite(x: number, z: number): [number, number] {
  const len = Math.hypot(x, z);
  if (!Number.isFinite(len) || len <= SITE_RADIUS) return [x, z];
  const scale = SITE_RADIUS / len;
  let cx = snap(x * scale);
  let cz = snap(z * scale);
  const clamped = Math.hypot(cx, cz);
  if (clamped > SITE_RADIUS && clamped > 0) {
    const again = SITE_RADIUS / clamped;
    cx = snap(cx * again);
    cz = snap(cz * again);
  }
  return [cx, cz];
}

/** Lock badge sits above the mesh. Including it inflates the selection box and the foot shadow. */
function boxWithoutBadge(obj: THREE.Object3D, target: THREE.Box3) {
  const badge = obj.getObjectByName("lockBadge");
  const was = badge?.visible ?? false;
  if (badge) badge.visible = false;
  target.setFromObject(obj);
  if (badge) badge.visible = was;
  return target;
}
const sitePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const siteHit = new THREE.Vector3();

function pointOnSitePlane(raycaster: THREE.Raycaster): THREE.Vector3 | null {
  const hit = raycaster.ray.intersectPlane(sitePlane, siteHit);
  if (!hit) return null;
  const len = Math.hypot(hit.x, hit.z);
  if (len > SITE_RADIUS) {
    const scale = SITE_RADIUS / len;
    hit.x *= scale;
    hit.z *= scale;
  }
  return hit;
}

/** Dispose unique geometries. Materials only when they are not the shared catalog set (ghost clones). */
function disposeObjectResources(obj: THREE.Object3D, disposeMaterials: boolean) {
  const seen = new Set<THREE.Material>();
  obj.traverse((c) => {
    if (c instanceof THREE.Mesh || c instanceof THREE.Line) {
      c.geometry?.dispose();
      if (disposeMaterials) {
        const mat = c.material;
        const list = Array.isArray(mat) ? mat : [mat];
        for (const m of list) {
          if (!m || seen.has(m)) continue;
          seen.add(m);
          m.dispose();
        }
      }
    }
  });
}

/** Lock badges own a material outside the shared catalog. Dispose it without touching catalog mats. */
function disposeLockBadge(obj: THREE.Object3D) {
  const badge = obj.getObjectByName("lockBadge");
  if (!badge) return;
  obj.remove(badge);
  disposeObjectResources(badge, true);
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
  // Small flecks and edge wear so the plaster reads as hand-troweled, not a flat wash.
  for (let f = 0; f < 22; f++) {
    const x = hash2(f, 11.3) * size;
    const y = hash2(f, 6.7) * size;
    const r = 1.2 + hash2(f, 4.1) * 3.4;
    const dark = hash2(f, 2.8) > 0.55;
    ctx.fillStyle = dark
      ? `rgba(132,122,108,${0.18 + hash2(f, 9) * 0.22})`
      : `rgba(228,218,202,${0.14 + hash2(f, 8) * 0.16})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
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

/** Board-formed warm concrete for strip footings. Shared catalog map; do not dispose per part. */
function paintBoardFormed(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [168, 158, 144], 14);
  const boards = 4;
  for (let i = 0; i < boards; i++) {
    const y0 = Math.floor((i / boards) * size);
    const y1 = Math.floor(((i + 1) / boards) * size);
    const tone = 154 + Math.floor(hash2(i, 2.4) * 24);
    ctx.fillStyle = `rgba(${tone + 8}, ${tone - 2}, ${tone - 12}, 0.62)`;
    ctx.fillRect(0, y0, size, y1 - y0);
    ctx.fillStyle = "rgba(62,54,44,0.62)";
    ctx.fillRect(0, y1 - 3, size, 3);
    ctx.strokeStyle = "rgba(92,82,70,0.35)";
    ctx.lineWidth = 1;
    for (let g = 0; g < 3; g++) {
      const gy = y0 + 6 + g * ((y1 - y0) / 4);
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= size; x += 10) ctx.lineTo(x, gy + Math.sin(x * 0.05 + i) * 1.1);
      ctx.stroke();
    }
    for (let h = 0; h < 3; h++) {
      const x = (0.16 + hash2(i, h + 3.2) * 0.68) * size;
      ctx.fillStyle = "rgba(48,42,34,0.75)";
      ctx.beginPath();
      ctx.arc(x, (y0 + y1) / 2, 3.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Vertical pour joint so the strip is not one continuous board.
  ctx.fillStyle = "rgba(72,64,54,0.48)";
  ctx.fillRect(Math.floor(size * 0.5) - 1, 0, 2, size);
}

/** Height for board joints and form-tie cones. Shared; do not dispose per part. */
function paintBoardFormedBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#9a9a9a";
  ctx.fillRect(0, 0, size, size);
  const boards = 4;
  for (let i = 0; i < boards; i++) {
    const y0 = Math.floor((i / boards) * size);
    const y1 = Math.floor(((i + 1) / boards) * size);
    ctx.fillStyle = hash2(i, 1.1) > 0.5 ? "rgba(228,228,228,0.32)" : "rgba(48,48,48,0.2)";
    ctx.fillRect(0, y0 + 2, size, Math.max(1, y1 - y0 - 4));
    ctx.fillStyle = "rgba(18,18,18,0.88)";
    ctx.fillRect(0, y1 - 4, size, 4);
    for (let h = 0; h < 3; h++) {
      const x = (0.16 + hash2(i, h + 3.2) * 0.68) * size;
      const y = (y0 + y1) / 2;
      ctx.fillStyle = "rgba(16,16,16,0.92)";
      ctx.beginPath();
      ctx.arc(x, y, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(214,214,214,0.55)";
      ctx.beginPath();
      ctx.arc(x - 0.7, y - 0.7, 1.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = "rgba(12,12,12,0.72)";
  ctx.fillRect(Math.floor(size * 0.5) - 2, 0, 3, size);
}

/** Running-bond ashlar for wall faces. Port of the plinth course, scaled for a 2.6 m bay. */
function paintWallMasonry(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [176, 164, 146], 12);
  const cols = 4;
  const rows = 7;
  const mortar = 4;
  for (let r = 0; r < rows; r++) {
    const y0 = (r / rows) * size;
    const rh = size / rows;
    const shift = r % 2 === 0 ? 0 : size / cols / 2;
    for (let c = -1; c < cols + 1; c++) {
      const vary = hash2(c + 4.2, r + 1.7);
      const tone = 158 + Math.floor(vary * 42);
      ctx.fillStyle = `rgb(${tone + 14}, ${tone}, ${tone - 18})`;
      const x = c * (size / cols) + shift + mortar;
      const w = size / cols - mortar * 1.6;
      ctx.fillRect(x, y0 + mortar, w, rh - mortar * 1.7);
      ctx.fillStyle = `rgba(${tone + 28}, ${tone + 16}, ${tone - 4}, 0.28)`;
      ctx.fillRect(x + 3, y0 + mortar + 2, w * 0.55, 2);
      if (vary > 0.62) {
        ctx.fillStyle = `rgba(${tone - 36}, ${tone - 42}, ${tone - 48}, 0.4)`;
        ctx.fillRect(x + vary * 8, y0 + rh * 0.45, 6 + vary * 10, 2);
      }
    }
  }
  ctx.strokeStyle = "rgba(78,66,52,0.62)";
  ctx.lineWidth = 2;
  for (let r = 0; r <= rows; r++) {
    const y = (r / rows) * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
}

function paintWallMasonryBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#c2c2c2";
  ctx.fillRect(0, 0, size, size);
  const cols = 4;
  const rows = 7;
  ctx.fillStyle = "#3a3a3a";
  for (let r = 0; r <= rows; r++) {
    const y = Math.floor((r / rows) * size);
    ctx.fillRect(0, y - 1, size, 3);
  }
  for (let r = 0; r < rows; r++) {
    const y0 = Math.floor((r / rows) * size);
    const rh = size / rows;
    const shift = r % 2 === 0 ? 0 : size / cols / 2;
    for (let c = 0; c <= cols; c++) {
      const x = Math.floor(c * (size / cols) + shift);
      ctx.fillRect(x - 1, y0, 3, rh);
    }
  }
}

/** Running-bond brick for the chimney stack. Smaller courses than wall ashlar, soot under the crown. */
function paintChimneyBrick(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [132, 78, 62], 14);
  const cols = 6;
  const rows = 12;
  const mortar = 3;
  for (let r = 0; r < rows; r++) {
    const y0 = (r / rows) * size;
    const rh = size / rows;
    const shift = r % 2 === 0 ? 0 : size / cols / 2;
    for (let c = -1; c < cols + 1; c++) {
      const vary = hash2(c + 1.4, r + 8.2);
      const tone = 118 + Math.floor(vary * 48);
      const warm = vary > 0.72 ? 16 : 0;
      ctx.fillStyle = `rgb(${tone + 28 + warm}, ${tone - 6}, ${tone - 28})`;
      const x = c * (size / cols) + shift + mortar;
      const w = size / cols - mortar * 1.5;
      ctx.fillRect(x, y0 + mortar, w, rh - mortar * 1.6);
      ctx.fillStyle = `rgba(${tone + 46}, ${tone + 8}, ${tone - 10}, 0.22)`;
      ctx.fillRect(x + 2, y0 + mortar + 1, w * 0.4, 1.5);
      if (vary > 0.8) {
        ctx.fillStyle = `rgba(${tone - 20}, ${tone - 30}, ${tone - 34}, 0.35)`;
        ctx.fillRect(x + 4, y0 + rh * 0.4, w * 0.35, 2);
      }
    }
  }
  ctx.strokeStyle = "rgba(186, 170, 154, 0.55)";
  ctx.lineWidth = 2;
  for (let r = 0; r <= rows; r++) {
    const y = (r / rows) * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  const soot = ctx.createLinearGradient(0, 0, 0, size * 0.28);
  soot.addColorStop(0, "rgba(42, 36, 32, 0.42)");
  soot.addColorStop(1, "rgba(42, 36, 32, 0)");
  ctx.fillStyle = soot;
  ctx.fillRect(0, 0, size, size * 0.28);
  ctx.fillStyle = "rgba(48, 32, 24, 0.18)";
  ctx.fillRect(0, 0, 6, size);
  ctx.fillRect(size - 6, 0, 6, size);
}

function paintChimneyBrickBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#b4b4b4";
  ctx.fillRect(0, 0, size, size);
  const cols = 6;
  const rows = 12;
  ctx.fillStyle = "#2e2e2e";
  for (let r = 0; r <= rows; r++) {
    const y = Math.floor((r / rows) * size);
    ctx.fillRect(0, y - 1, size, 3);
  }
  for (let r = 0; r < rows; r++) {
    const y0 = Math.floor((r / rows) * size);
    const rh = size / rows;
    const shift = r % 2 === 0 ? 0 : size / cols / 2;
    for (let c = 0; c <= cols; c++) {
      const x = Math.floor(c * (size / cols) + shift);
      ctx.fillRect(x - 1, y0, 2, rh);
    }
  }
}

/** Crown and flue pots: weathered clay cap, not a second roof-tile map. */
function paintChimneyCrown(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [148, 78, 52], 16);
  const courses = 4;
  for (let r = 0; r < courses; r++) {
    const y0 = Math.floor((r / courses) * size);
    const y1 = Math.floor(((r + 1) / courses) * size);
    const tone = 128 + Math.floor(hash2(r, 4.4) * 36);
    ctx.fillStyle = `rgb(${tone + 22}, ${tone - 18}, ${tone - 42})`;
    ctx.fillRect(0, y0, size, y1 - y0);
    ctx.fillStyle = "rgba(214, 186, 160, 0.55)";
    ctx.fillRect(0, y1 - 3, size, 3);
  }
  // Soot ring under the flue opening, lighter lime bloom on the drip edge.
  const soot = ctx.createRadialGradient(size * 0.5, size * 0.42, size * 0.06, size * 0.5, size * 0.42, size * 0.46);
  soot.addColorStop(0, "rgba(36, 30, 26, 0.55)");
  soot.addColorStop(0.45, "rgba(48, 36, 30, 0.22)");
  soot.addColorStop(1, "rgba(48, 36, 30, 0)");
  ctx.fillStyle = soot;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "rgba(186, 168, 142, 0.28)";
  ctx.fillRect(0, size - 8, size, 8);
  ctx.fillStyle = "rgba(62, 34, 22, 0.35)";
  ctx.fillRect(0, 0, 4, size);
  ctx.fillRect(size - 4, 0, 4, size);
}

function paintChimneyCrownBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#a8a8a8";
  ctx.fillRect(0, 0, size, size);
  const courses = 4;
  ctx.fillStyle = "#ececec";
  for (let r = 1; r <= courses; r++) {
    const y = Math.floor((r / courses) * size);
    ctx.fillRect(0, y - 2, size, 3);
  }
  ctx.fillStyle = "#3a3a3a";
  ctx.beginPath();
  ctx.arc(size * 0.5, size * 0.42, size * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d8d8d8";
  ctx.fillRect(0, size - 7, size, 4);
}

function paintTimber(ctx: CanvasRenderingContext2D, size: number) {
  const planks = 6;
  for (let i = 0; i < planks; i++) {
    const y0 = Math.floor((i / planks) * size);
    const y1 = Math.floor(((i + 1) / planks) * size);
    const tone = 108 + Math.floor(hash2(i, 4) * 40);
    ctx.fillStyle = `rgb(${tone + 36}, ${tone - 4}, ${tone - 38})`;
    ctx.fillRect(0, y0, size, y1 - y0);
    // Soft edge darkening for sawn face and roughness.
    const edge = ctx.createLinearGradient(0, y0, 0, y1);
    edge.addColorStop(0, "rgba(42,26,14,0.18)");
    edge.addColorStop(0.12, "rgba(42,26,14,0)");
    edge.addColorStop(0.88, "rgba(42,26,14,0)");
    edge.addColorStop(1, "rgba(42,26,14,0.22)");
    ctx.fillStyle = edge;
    ctx.fillRect(0, y0, size, y1 - y0);
    // Staggered end joint so boards do not run as one endless plank.
    const joint = (0.18 + hash2(i, 11) * 0.58) * size;
    ctx.fillStyle = "rgba(46,28,14,0.75)";
    ctx.fillRect(joint, y0 + 1, 2, Math.max(2, y1 - y0 - 2));
    ctx.strokeStyle = "rgba(58,36,18,0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y1 - 1);
    ctx.lineTo(size, y1 - 1);
    ctx.stroke();
    // Finer grain lines with slight color variation.
    for (let g = 0; g < 7; g++) {
      const gy = y0 + 3 + g * ((y1 - y0) / 8);
      const grainTone = 70 + Math.floor(hash2(i, g) * 30);
      ctx.strokeStyle = `rgba(${grainTone + 20}, ${grainTone}, ${grainTone - 20}, 0.28)`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= size; x += 6) {
        ctx.lineTo(x, gy + Math.sin(x * 0.11 + i * 1.4 + g) * 1.2);
      }
      ctx.stroke();
    }
    // Occasional darker fiber streaks.
    if (hash2(i, 19) > 0.55) {
      const sx = hash2(i, 21) * size * 0.4;
      ctx.strokeStyle = "rgba(48,30,16,0.45)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(sx, y0 + 2);
      ctx.lineTo(sx + size * 0.35, y1 - 3);
      ctx.stroke();
    }
    const kx = hash2(i, 6.2) * size;
    const ky = y0 + (y1 - y0) * 0.48;
    const kr = 3 + hash2(i, 8) * 4.2;
    const kg = ctx.createRadialGradient(kx, ky, 0.4, kx, ky, kr);
    kg.addColorStop(0, "rgba(64,36,18,0.92)");
    kg.addColorStop(0.55, "rgba(118,72,38,0.45)");
    kg.addColorStop(1, "rgba(118,72,38,0)");
    ctx.fillStyle = kg;
    ctx.beginPath();
    ctx.ellipse(kx, ky, kr, kr * 0.7, 0.35, 0, Math.PI * 2);
    ctx.fill();
    // Small secondary knot on some boards.
    if (hash2(i, 27) > 0.7) {
      const kx2 = hash2(i, 29) * size;
      const ky2 = y0 + (y1 - y0) * 0.7;
      const kr2 = 2 + hash2(i, 31) * 2;
      const kg2 = ctx.createRadialGradient(kx2, ky2, 0.2, kx2, ky2, kr2);
      kg2.addColorStop(0, "rgba(50,28,14,0.8)");
      kg2.addColorStop(1, "rgba(90,55,30,0)");
      ctx.fillStyle = kg2;
      ctx.beginPath();
      ctx.ellipse(kx2, ky2, kr2, kr2 * 0.6, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }
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
      // Subtle weathering: a few chips and dust flecks so the tile course reads as aged clay rather than a uniform stamp.
      if (hash2(c + 7, r + 19) > 0.72) {
        const chip = hash2(c + 13, r + 5);
        ctx.fillStyle = `rgba(${60 + Math.floor(chip * 40)},${28 + Math.floor(chip * 18)},${18 + Math.floor(chip * 10)},0.55)`;
        const cx = x + cw * (0.25 + chip * 0.5);
        const cy = y + rh * (0.4 + chip * 0.35);
        ctx.beginPath();
        ctx.ellipse(cx, cy, cw * 0.08, rh * 0.06, chip * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      if (hash2(c + 2, r + 31) > 0.85) {
        ctx.fillStyle = "rgba(180,140,110,0.35)";
        ctx.fillRect(x + cw * 0.15, y + rh * 0.2, 2, 2);
      }
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

/** Standing-seam galvanized leaf. Ports the board-formed joint idea onto a door skin. */
function paintDoorMetal(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [176, 184, 188], 12);
  const seams = 5;
  for (let i = 0; i < seams; i++) {
    const x0 = Math.floor((i / seams) * size);
    const x1 = Math.floor(((i + 1) / seams) * size);
    const tone = 168 + Math.floor(hash2(i, 6.2) * 22);
    ctx.fillStyle = `rgb(${tone}, ${tone + 4}, ${tone + 8})`;
    ctx.fillRect(x0, 0, x1 - x0, size);
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillRect(x0 + 2, 0, 3, size);
    ctx.fillStyle = "rgba(48,56,62,0.72)";
    ctx.fillRect(x1 - 4, 0, 4, size);
    for (let r = 0; r < 6; r++) {
      const y = (0.1 + r * 0.14) * size;
      ctx.fillStyle = "rgba(42,48,54,0.8)";
      ctx.beginPath();
      ctx.arc(x0 + (x1 - x0) * 0.35, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(230,234,236,0.55)";
      ctx.beginPath();
      ctx.arc(x0 + (x1 - x0) * 0.35 - 0.6, y - 0.6, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = "rgba(92,100,106,0.35)";
  ctx.fillRect(0, Math.floor(size * 0.62), size, 3);
}

function paintDoorMetalBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#8e8e8e";
  ctx.fillRect(0, 0, size, size);
  const seams = 5;
  ctx.fillStyle = "#d8d8d8";
  for (let i = 1; i < seams; i++) {
    const x = Math.floor((i / seams) * size);
    ctx.fillRect(x - 2, 0, 4, size);
  }
  ctx.fillStyle = "#3a3a3a";
  ctx.fillRect(0, Math.floor(size * 0.62), size, 4);
}

/** Standing-seam zinc roof. Ports the door sheet-metal ribs onto a covering, without rivet rows. */
function paintRoofMetal(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [158, 166, 170], 10);
  const seams = 7;
  for (let i = 0; i < seams; i++) {
    const x0 = Math.floor((i / seams) * size);
    const x1 = Math.floor(((i + 1) / seams) * size);
    const tone = 150 + Math.floor(hash2(i, 8.4) * 20);
    ctx.fillStyle = `rgb(${tone - 4}, ${tone + 2}, ${tone + 6})`;
    ctx.fillRect(x0, 0, x1 - x0, size);
    ctx.fillStyle = "rgba(236,240,242,0.34)";
    ctx.fillRect(x0 + 3, 0, 2, size);
    ctx.fillStyle = "rgba(36,42,46,0.78)";
    ctx.fillRect(x1 - 5, 0, 5, size);
    ctx.fillStyle = "rgba(214,220,224,0.22)";
    ctx.fillRect(x1 - 7, 0, 2, size);
    const streak = 0.12 + hash2(i, 2.7) * 0.7;
    ctx.fillStyle = "rgba(92,86,74,0.16)";
    ctx.fillRect(x0 + 8, Math.floor(streak * size), Math.max(4, (x1 - x0) * 0.28), size);
  }
}

function paintRoofMetalBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#8a8a8a";
  ctx.fillRect(0, 0, size, size);
  const seams = 7;
  for (let i = 1; i < seams; i++) {
    const x = Math.floor((i / seams) * size);
    ctx.fillStyle = "#ececec";
    ctx.fillRect(x - 3, 0, 3, size);
    ctx.fillStyle = "#2e2e2e";
    ctx.fillRect(x, 0, 3, size);
  }
}

/** Painted bar stock. Ports door-sheet ribs onto a rail: vertical flutes, oxide, no rivet rows. */
function paintRailingMetal(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [78, 82, 86], 11);
  const flutes = 10;
  for (let i = 0; i < flutes; i++) {
    const x0 = Math.floor((i / flutes) * size);
    const x1 = Math.floor(((i + 1) / flutes) * size);
    const tone = 70 + Math.floor(hash2(i, 4.8) * 18);
    ctx.fillStyle = `rgb(${tone}, ${tone + 2}, ${tone + 4})`;
    ctx.fillRect(x0, 0, x1 - x0, size);
    ctx.fillStyle = "rgba(196,202,206,0.28)";
    ctx.fillRect(x0 + 1, 0, 2, size);
    ctx.fillStyle = "rgba(28,30,32,0.7)";
    ctx.fillRect(x1 - 3, 0, 3, size);
    const streak = 0.08 + hash2(i, 9.1) * 0.75;
    ctx.fillStyle = "rgba(122,78,48,0.18)";
    ctx.fillRect(x0 + 3, Math.floor(streak * size), Math.max(3, (x1 - x0) * 0.35), Math.floor(size * 0.22));
  }
}

function paintRailingMetalBump(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#8a8a8a";
  ctx.fillRect(0, 0, size, size);
  const flutes = 10;
  for (let i = 1; i < flutes; i++) {
    const x = Math.floor((i / flutes) * size);
    ctx.fillStyle = "#e2e2e2";
    ctx.fillRect(x - 2, 0, 2, size);
    ctx.fillStyle = "#2c2c2c";
    ctx.fillRect(x, 0, 2, size);
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

/** Sun-aligned contact under the gravel disc. Dark lobe is offset so it falls on grass. */
function paintPadCast(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  const c = size / 2;
  const g = ctx.createRadialGradient(c * 0.62, c, size * 0.05, c * 0.92, c, size * 0.46);
  g.addColorStop(0, "rgba(28,24,16,0.5)");
  g.addColorStop(0.38, "rgba(28,24,16,0.24)");
  g.addColorStop(0.72, "rgba(28,24,16,0.08)");
  g.addColorStop(1, "rgba(28,24,16,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(c * 0.9, c, size * 0.42, size * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** Per-part foot shadow. Shared 128px map; one instanced quad, no extra shadow map. */
function paintFootAO(ctx: CanvasRenderingContext2D, size: number) {
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, size * 0.06, c, c, size * 0.48);
  g.addColorStop(0, "rgba(36,30,22,0.62)");
  g.addColorStop(0.42, "rgba(36,30,22,0.28)");
  g.addColorStop(0.78, "rgba(36,30,22,0.08)");
  g.addColorStop(1, "rgba(36,30,22,0)");
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

/** Cool veil opposite the sun. Transparent rim so it reads as sky, not a card. */
function paintCoolHorizon(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  const g = ctx.createLinearGradient(0, size * 0.15, 0, size);
  g.addColorStop(0, "rgba(168,188,214,0)");
  g.addColorStop(0.42, "rgba(154,176,204,0.34)");
  g.addColorStop(0.78, "rgba(132,156,186,0.18)");
  g.addColorStop(1, "rgba(132,156,186,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

/** Warm bank on the sun azimuth. Additive, so the horizon ring is not a flat wash. */
function paintSunHorizon(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  const g = ctx.createRadialGradient(size * 0.5, size * 0.72, size * 0.04, size * 0.5, size * 0.72, size * 0.55);
  g.addColorStop(0, "rgba(255,196,120,0.55)");
  g.addColorStop(0.35, "rgba(255,168,90,0.22)");
  g.addColorStop(1, "rgba(255,168,90,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

/** Cloud shade on the far lawn. Soft ovals, clear rim, opposite the sun bank. */
function paintLawnDapple(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  for (let i = 0; i < 7; i++) {
    const x = size * (0.18 + hash2(i, 2.2) * 0.64);
    const y = size * (0.18 + hash2(i, 5.1) * 0.64);
    const rx = 18 + hash2(i, 1.4) * 28;
    const ry = 10 + hash2(i, 7.7) * 16;
    const g = ctx.createRadialGradient(x, y, 2, x, y, rx);
    g.addColorStop(0, "rgba(36,42,24,0.42)");
    g.addColorStop(0.55, "rgba(36,42,24,0.16)");
    g.addColorStop(1, "rgba(36,42,24,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, hash2(i, 3.6) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Distant olive hedgerow. Clear sky above, irregular crowns along the ground line. */
function paintHedgerow(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  const ground = ctx.createLinearGradient(0, size * 0.42, 0, size);
  ground.addColorStop(0, "rgba(42,52,28,0)");
  ground.addColorStop(0.55, "rgba(36,46,24,0.55)");
  ground.addColorStop(1, "rgba(28,36,18,0.82)");
  ctx.fillStyle = ground;
  ctx.fillRect(0, size * 0.55, size, size * 0.45);
  for (let i = 0; i < 14; i++) {
    const x = (i + 0.35 + hash2(i, 1.8) * 0.4) * (size / 14);
    const crown = size * (0.34 + hash2(i, 4.2) * 0.22);
    const rx = size * (0.045 + hash2(i, 2.6) * 0.04);
    const ry = size * (0.16 + hash2(i, 6.4) * 0.14);
    const g = ctx.createRadialGradient(x, crown + ry * 0.35, 2, x, crown + ry * 0.2, ry);
    g.addColorStop(0, "rgba(62,78,38,0.9)");
    g.addColorStop(0.55, "rgba(40,52,24,0.72)");
    g.addColorStop(1, "rgba(28,36,16,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, crown + ry * 0.25, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Late-day cirrus streaks. Transparent edges so banks sit in the sky shell, not as cards. */
function paintCirrus(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  for (let i = 0; i < 8; i++) {
    const y = size * (0.22 + hash2(i, 2.4) * 0.5);
    const x = size * (0.08 + hash2(i, 6.1) * 0.78);
    const rx = 46 + hash2(i, 1.7) * 78;
    const ry = 5 + hash2(i, 8.2) * 12;
    const warm = hash2(i, 4.4) > 0.45;
    const g = ctx.createRadialGradient(x, y, 2, x, y, rx);
    g.addColorStop(0, warm ? "rgba(255,236,206,0.62)" : "rgba(244,236,224,0.48)");
    g.addColorStop(0.4, "rgba(214,196,172,0.2)");
    g.addColorStop(1, "rgba(214,196,172,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, hash2(i, 3.3) * 0.7 - 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
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
/** Directional pad shade: light on the sun side, soft olive falloff opposite. Not sRGB-critical. */
function paintSiteShade(ctx: CanvasRenderingContext2D, size: number) {
  const g = ctx.createLinearGradient(0, size * 0.2, size, size * 0.8);
  g.addColorStop(0, "rgba(255,220,170,0.05)");
  g.addColorStop(0.38, "rgba(120,96,64,0.04)");
  g.addColorStop(0.72, "rgba(62,50,34,0.28)");
  g.addColorStop(1, "rgba(36,30,20,0.46)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const v = ctx.createRadialGradient(size / 2, size / 2, size * 0.18, size / 2, size / 2, size * 0.5);
  v.addColorStop(0, "rgba(255,255,255,0)");
  v.addColorStop(0.7, "rgba(255,255,255,0)");
  v.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = v;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

/** Annular seat where the gravel disc meets grass. Center stays clear so the pad is not double-darkened. */
function paintPadSeat(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, size * 0.34, c, c, size * 0.5);
  g.addColorStop(0, "rgba(28,24,16,0)");
  g.addColorStop(0.72, "rgba(28,24,16,0)");
  g.addColorStop(0.84, "rgba(28,24,16,0.42)");
  g.addColorStop(0.93, "rgba(28,24,16,0.16)");
  g.addColorStop(1, "rgba(28,24,16,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

/** Late-day wash on the meadow, not the pad. Warm lobe faces the sun; cool lobe sits opposite. */
function paintMeadowWash(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  const warm = ctx.createRadialGradient(size * 0.26, size * 0.5, size * 0.04, size * 0.5, size * 0.5, size * 0.48);
  warm.addColorStop(0, "rgba(255,214,150,0.5)");
  warm.addColorStop(0.34, "rgba(214,186,120,0.18)");
  warm.addColorStop(0.68, "rgba(120,132,72,0)");
  warm.addColorStop(1, "rgba(90,104,58,0)");
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, size, size);
  const cool = ctx.createRadialGradient(size * 0.82, size * 0.5, size * 0.02, size * 0.78, size * 0.5, size * 0.34);
  cool.addColorStop(0, "rgba(42,52,32,0.32)");
  cool.addColorStop(0.55, "rgba(48,58,36,0.12)");
  cool.addColorStop(1, "rgba(48,58,36,0)");
  ctx.fillStyle = cool;
  ctx.fillRect(0, 0, size, size);
}


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
  const wallMasonryMap = makeCanvasTexture(TEX, paintWallMasonry, true);
  const wallMasonryRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintWallMasonry(ctx, s);
    paintRoughFromAlbedo(ctx, s, 150, 46, true);
  }, false);
  const wallMasonryBump = makeCanvasTexture(TEX, paintWallMasonryBump, false);
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
  const roofMetalMap = makeCanvasTexture(TEX, paintRoofMetal, true);
  const roofMetalRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintRoofMetal(ctx, s);
    paintRoughFromAlbedo(ctx, s, 118, 46, true);
  }, false);
  const roofMetalBump = makeCanvasTexture(TEX, paintRoofMetalBump, false);
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
  const doorMetalMap = makeCanvasTexture(TEX, paintDoorMetal, true);
  const doorMetalRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintDoorMetal(ctx, s);
    paintRoughFromAlbedo(ctx, s, 118, 48, false);
  }, false);
  const doorMetalBump = makeCanvasTexture(TEX, paintDoorMetalBump, false);
  const railingMetalMap = makeCanvasTexture(TEX, paintRailingMetal, true);
  const railingMetalRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintRailingMetal(ctx, s);
    paintRoughFromAlbedo(ctx, s, 96, 42, false);
  }, false);
  const railingMetalBump = makeCanvasTexture(TEX, paintRailingMetalBump, false);
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
  applyRepeat(wallMasonryMap, 1.4, 1.6);
  applyRepeat(wallMasonryRough, 1.4, 1.6);
  applyRepeat(wallMasonryBump, 1.4, 1.6);
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
  applyRepeat(roofMetalMap, 2, 2);
  applyRepeat(roofMetalRough, 2, 2);
  applyRepeat(roofMetalBump, 2, 2);
  applyRepeat(railingMetalMap, 3, 2);
  applyRepeat(railingMetalRough, 3, 2);
  applyRepeat(railingMetalBump, 3, 2);
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
  applyRepeat(doorMetalMap, 1, 1);
  applyRepeat(doorMetalRough, 1, 1);
  applyRepeat(doorMetalBump, 1, 1);

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
  const wallMasonry = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: wallMasonryMap ?? undefined,
    roughnessMap: wallMasonryRough ?? undefined,
    bumpMap: wallMasonryBump ?? undefined,
    bumpScale: 0.05,
    roughness: 0.84,
    metalness: 0.03,
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
  const roofMetal = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: roofMetalMap ?? undefined,
    roughnessMap: roofMetalRough ?? undefined,
    bumpMap: roofMetalBump ?? undefined,
    bumpScale: 0.035,
    roughness: 0.4,
    metalness: 0.7,
  });
  // Interior quarry tile reuses the roof clay maps (shared; do not dispose separately).
  const floorClay = new THREE.MeshStandardMaterial({
    color: 0xfff4ea,
    map: roofMap ?? undefined,
    roughnessMap: roofRough ?? undefined,
    bumpMap: roofBump ?? roofRough ?? undefined,
    bumpScale: 0.042,
    normalMap: roofNormal ?? undefined,
    normalScale: new THREE.Vector2(0.62, 0.62),
    roughness: 0.74,
    metalness: 0.04,
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
  const footingMap = makeCanvasTexture(TEX, paintBoardFormed, true);
  const footingRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintBoardFormed(ctx, s);
    paintRoughFromAlbedo(ctx, s, 188, 42, true);
  }, false);
  const footingBump = makeCanvasTexture(TEX, paintBoardFormedBump, false);
  const footing = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: footingMap ?? undefined,
    roughnessMap: footingRough ?? undefined,
    bumpMap: footingBump ?? undefined,
    bumpScale: 0.034,
    roughness: 0.86,
    metalness: 0.02,
  });
  const chimneyMap = makeCanvasTexture(TEX, paintChimneyBrick, true);
  const chimneyRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintChimneyBrick(ctx, s);
    paintRoughFromAlbedo(ctx, s, 168, 58, true);
  }, false);
  const chimneyBump = makeCanvasTexture(TEX, paintChimneyBrickBump, false);
  applyRepeat(chimneyMap, 1.4, 2.6);
  applyRepeat(chimneyRough, 1.4, 2.6);
  applyRepeat(chimneyBump, 1.4, 2.6);
  const chimney = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: chimneyMap ?? undefined,
    roughnessMap: chimneyRough ?? undefined,
    bumpMap: chimneyBump ?? undefined,
    bumpScale: 0.046,
    roughness: 0.88,
    metalness: 0.02,
  });
  const chimneyCrownMap = makeCanvasTexture(TEX, paintChimneyCrown, true);
  const chimneyCrownRough = makeCanvasTexture(TEX, (ctx, s) => {
    paintChimneyCrown(ctx, s);
    paintRoughFromAlbedo(ctx, s, 154, 52, true);
  }, false);
  const chimneyCrownBump = makeCanvasTexture(TEX, paintChimneyCrownBump, false);
  applyRepeat(chimneyCrownMap, 1.2, 1.1);
  applyRepeat(chimneyCrownRough, 1.2, 1.1);
  applyRepeat(chimneyCrownBump, 1.2, 1.1);
  const chimneyCrown = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: chimneyCrownMap ?? undefined,
    roughnessMap: chimneyCrownRough ?? undefined,
    bumpMap: chimneyCrownBump ?? undefined,
    bumpScale: 0.032,
    roughness: 0.82,
    metalness: 0.02,
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
  const doorMetal = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: doorMetalMap ?? undefined,
    roughnessMap: doorMetalRough ?? undefined,
    bumpMap: doorMetalBump ?? undefined,
    bumpScale: 0.03,
    roughness: 0.38,
    metalness: 0.72,
  });
  const railingMetal = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: railingMetalMap ?? undefined,
    roughnessMap: railingMetalRough ?? undefined,
    bumpMap: railingMetalBump ?? undefined,
    bumpScale: 0.026,
    roughness: 0.46,
    metalness: 0.58,
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
  const planterLeaf = new THREE.MeshStandardMaterial({
    color: 0x3f6b3a,
    roughness: 0.82,
    metalness: 0.02,
  });
  return { wall, wallMasonry, wallEdge, floor, floorClay, roof, roofMetal, ground, gravel, plate, nosing, fascia, doorLeaf, doorMetal, railingMetal, joinery, doorGlass, footing, chimney, chimneyCrown, planterLeaf };
}

function applyWallFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: WallFinish) {
  const mat = finish === "masonry" ? mats.wallMasonry : finish === "timber" ? mats.floor : mats.wall;
  obj.traverse((c) => {
    if (c instanceof THREE.Mesh && c.name === "wallSkin") c.material = mat;
  });
}

function applyColumnFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: ColumnFinish) {
  const mat = finish === "masonry" ? mats.wallMasonry : finish === "timber" ? mats.floor : mats.wall;
  obj.traverse((c) => {
    if (c instanceof THREE.Mesh && c.name === "columnSkin") c.material = mat;
  });
}

/** Ashlar flight reuses the shared wall masonry map. Timber keeps nosing, fascia, and plate. */
function applyStairsFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: StairsFinish) {
  const tread = finish === "masonry" ? mats.wallMasonry : finish === "metal" ? mats.railingMetal : mats.nosing;
  const riser = finish === "masonry" ? mats.wallMasonry : finish === "metal" ? mats.railingMetal : mats.fascia;
  const cheek = finish === "masonry" ? mats.wallEdge : finish === "metal" ? mats.railingMetal : mats.plate;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (c.name === "stairTread") c.material = tread;
    else if (c.name === "stairRiser") c.material = riser;
    else if (c.name === "stairCheek") c.material = cheek;
  });
}

function applyDoorFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: DoorFinish) {
  const mat = finish === "metal" ? mats.doorMetal : mats.doorLeaf;
  obj.traverse((c) => {
    if (c instanceof THREE.Mesh && c.name === "doorSkin") c.material = mat;
  });
}

function applyRoofFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: RoofFinish) {
  const mat = finish === "metal" ? mats.roofMetal : mats.roof;
  obj.traverse((c) => {
    if (c instanceof THREE.Mesh && c.name === "roofSkin") c.material = mat;
  });
}

/** Iron rail reuses the shared bar-stock map. Timber keeps plate, nosing, and fascia. */
/** Iron sash reuses the shared railing bar-stock map. Timber keeps painted joinery. Stone sill stays. */
function applyWindowFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: WindowFinish) {
  const frame = finish === "metal" ? mats.railingMetal : mats.joinery;
  obj.traverse((c) => {
    if (c instanceof THREE.Mesh && c.name === "windowFrame") c.material = frame;
  });
}

function applyFloorFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: FloorFinish) {
  const skin = finish === "clay" ? mats.floorClay : mats.floor;
  const edge = finish === "clay" ? mats.floorClay : mats.nosing;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (c.name === "floorSkin") c.material = skin;
    else if (c.name === "floorNosing") c.material = edge;
  });
}

/** Iron bay reuses the shared railing bar-stock map. Timber keeps plate, nosing, and fascia. Pads stay gravel. */
/** Clay walk reuses the shared floor tile map. Gravel keeps the pad aggregate. Edges stay timber. */
function applyPathFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: PathFinish) {
  const skin = finish === "clay" ? mats.floorClay : mats.gravel;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (c.name === "pathSlab") c.material = skin;
    else if (c.name === "pathEdge") c.material = mats.nosing;
  });
}

/** Timber trough reuses the fence plate and nosing. Clay keeps the floor tile body and chimney crown lip. Soil and leaf stay shared. */
function applyPlanterFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: PlanterFinish) {
  const body = finish === "timber" ? mats.plate : mats.floorClay;
  const rim = finish === "timber" ? mats.nosing : mats.chimneyCrown;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (c.name === "planterBody") c.material = body;
    else if (c.name === "planterRim") c.material = rim;
    else if (c.name === "planterSoil") c.material = mats.gravel;
    else if (c.name === "planterLeaf") c.material = mats.planterLeaf;
  });
}

/** Ashlar stack reuses the shared wall masonry map. Brick keeps the running-bond shaft and clay crown. Flue pots stay clay. */
function applyChimneyFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: ChimneyFinish) {
  const stack = finish === "masonry" ? mats.wallMasonry : mats.chimney;
  const crown = finish === "masonry" ? mats.wallEdge : mats.chimneyCrown;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (c.name === "chimneyStack") c.material = stack;
    else if (c.name === "chimneyCrown") c.material = crown;
    else if (c.name === "chimneyPot") c.material = mats.chimneyCrown;
  });
}

/** Ashlar seat reuses the shared wall masonry map. Timber keeps plate legs and nosing slats. Pads stay footing. */
/** Iron post reuses the shared railing bar stock. Glass stays. Pad stays footing. */
function applyLampFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: LampFinish) {
  const post = finish === "metal" ? mats.railingMetal : mats.plate;
  const cap = finish === "metal" ? mats.railingMetal : mats.nosing;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (c.name === "lampPost" || c.name === "lampFinial") c.material = post;
    else if (c.name === "lampCap" || c.name === "lampHood") c.material = cap;
    else if (c.name === "lampGlass") c.material = mats.doorGlass;
    else if (c.name === "lampPad") c.material = mats.footing;
  });
}

function applyBenchFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: BenchFinish) {
  const seat = finish === "masonry" ? mats.wallMasonry : mats.nosing;
  const leg = finish === "masonry" ? mats.wallEdge : mats.plate;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (c.name === "benchSeat" || c.name === "benchBack") c.material = seat;
    else if (c.name === "benchLeg" || c.name === "benchPost") c.material = leg;
    else if (c.name === "benchPad") c.material = mats.footing;
  });
}

function applyFenceFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: FenceFinish) {
  const iron = mats.railingMetal;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (finish === "metal") {
      if (c.name.startsWith("fence") && c.name !== "fencePad") c.material = iron;
      return;
    }
    if (c.name === "fencePost") c.material = mats.plate;
    else if (c.name === "fenceCap" || c.name === "fenceRail") c.material = mats.nosing;
    else if (c.name === "fencePicket") c.material = mats.fascia;
  });
}

function applyBeamFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: BeamFinish) {
  const iron = mats.railingMetal;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (finish === "metal") {
      if (c.name.startsWith("beam") && c.name !== "beamFoot") c.material = iron;
      return;
    }
    if (c.name === "beamPost" || c.name === "beamSpan") c.material = mats.plate;
    else if (c.name === "beamCap" || c.name === "beamEnd") c.material = mats.nosing;
    else if (c.name === "beamBrace") c.material = mats.fascia;
    else if (c.name === "beamFoot") c.material = mats.wallEdge;
  });
}

function applyPergolaFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: PergolaFinish) {
  const iron = mats.railingMetal;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (finish === "metal") {
      if (c.name.startsWith("pergola") && c.name !== "pergolaPad") c.material = iron;
      return;
    }
    if (c.name === "pergolaPost") c.material = mats.plate;
    else if (c.name === "pergolaBeam") c.material = mats.nosing;
    else if (c.name === "pergolaRafter") c.material = mats.fascia;
    else if (c.name === "pergolaPad") c.material = mats.gravel;
  });
}

function applyFoundationFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: FoundationFinish) {
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (finish === "stone") {
      if (c.name === "foundationStrip") c.material = mats.wallMasonry;
      return;
    }
    if (c.name === "foundationStrip") c.material = mats.footing;
  });
}

function applyRailingFinish(obj: THREE.Object3D, mats: ReturnType<typeof makeMaterials>, finish: RailingFinish) {
  const iron = mats.railingMetal;
  obj.traverse((c) => {
    if (!(c instanceof THREE.Mesh)) return;
    if (finish === "metal") {
      if (c.name.startsWith("railing")) c.material = iron;
      return;
    }
    if (c.name === "railingPost" || c.name === "railingBaluster") c.material = mats.plate;
    else if (c.name === "railingCap" || c.name === "railingRail") c.material = mats.nosing;
    else if (c.name === "railingKick") c.material = mats.fascia;
  });
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

function createWallMesh(mats: ReturnType<typeof makeMaterials>, finish: WallFinish = "plaster") {
  const group = new THREE.Group();
  group.userData.wallFinish = finish;
  const body = new THREE.Mesh(new THREE.BoxGeometry(3, 2.6, 0.2), finish === "masonry" ? mats.wallMasonry : finish === "timber" ? mats.floor : mats.wall);
  body.name = "wallSkin";
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

function createFloorMesh(mats: ReturnType<typeof makeMaterials>, finish: FloorFinish = "timber") {
  const group = new THREE.Group();
  group.userData.floorFinish = finish;
  const skin = finish === "clay" ? mats.floorClay : mats.floor;
  const edgeMat = finish === "clay" ? mats.floorClay : mats.nosing;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 0.08, 3), skin);
  mesh.name = "floorSkin";
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
    const nosing = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), edgeMat);
    nosing.name = "floorNosing";
    nosing.position.set(x, y, z);
    nosing.castShadow = true;
    nosing.receiveShadow = true;
    group.add(nosing);
  }
  return group;
}

function createRoofMesh(mats: ReturnType<typeof makeMaterials>, finish: RoofFinish = "clay") {
  const group = new THREE.Group();
  group.userData.roofFinish = finish;
  const skin = finish === "metal" ? mats.roofMetal : mats.roof;
  const left = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.8), skin);
  left.name = "roofSkin";
  left.position.set(0, 2.85, -0.55);
  left.rotation.x = 0.45;
  left.castShadow = true;
  staggerUvs(left);
  const right = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.8), skin);
  right.name = "roofSkin";
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


function createColumnMesh(mats: ReturnType<typeof makeMaterials>, finish: ColumnFinish = "plaster") {
  // Square pier: stone plinth, plaster or ashlar shaft, timber capital. Height matches walls (2.6 m).
  const group = new THREE.Group();
  group.userData.columnFinish = finish;
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.5), mats.wallEdge);
  plinth.position.y = 0.07;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.32, 0.34), finish === "masonry" ? mats.wallMasonry : finish === "timber" ? mats.floor : mats.wall);
  shaft.name = "columnSkin";
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
  leaf.name = "doorSkin";
  leaf.position.set(0, 0.82, 0.01);
  leaf.castShadow = true;
  leaf.receiveShadow = true;
  staggerUvs(leaf);
  group.add(leaf);
  const rail = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.06, 0.05), mats.fascia);
  rail.name = "doorSkin";
  rail.position.set(0, 1.58, 0.012);
  rail.castShadow = true;
  group.add(rail);
  const lite = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.38, 0.02), mats.doorGlass);
  lite.position.set(0, 1.82, 0.012);
  lite.castShadow = false;
  lite.receiveShadow = true;
  group.add(lite);
  const muntinV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 0.03), mats.fascia);
  muntinV.name = "doorSkin";
  muntinV.position.set(0, 1.82, 0.02);
  const muntinH = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.03, 0.03), mats.fascia);
  muntinH.name = "doorSkin";
  muntinH.position.set(0, 1.82, 0.02);
  group.add(muntinV, muntinH);
  applyDoorFinish(group, mats, "timber");
  return group;
}

function createDoorMeshWithFinish(mats: ReturnType<typeof makeMaterials>, finish: DoorFinish) {
  const group = createDoorMesh(mats);
  applyDoorFinish(group, mats, finish);
  group.userData.finish = finish;
  return group;
}

function createWindowMesh(mats: ReturnType<typeof makeMaterials>, finish: WindowFinish = "timber") {
  // Casement bay: painted sash or iron frame, glazed lights. Sill at 0.9 m so it sits in a 2.6 m wall.
  // Timber is the default; iron reuses the railing bar-stock catalog map on jambs, head, and muntins.
  // Wall body is 0.2 m and centered on the part origin. A co-located window used to bury the jamb
  // in that solid (z-fight). Seat the bay on the +Z face so ghost and placed frames stay readable.
  const group = new THREE.Group();
  group.userData.windowFinish = finish;
  const frameMat = finish === "metal" ? mats.railingMetal : mats.joinery;
  const wallHalf = 0.1;
  const frameDepth = 0.1;
  const reveal = 0.016;
  const frameZ = wallHalf + frameDepth / 2 + reveal;
  const sill = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.06, 0.2), mats.wallEdge);
  sill.position.set(0, 0.9, frameZ - 0.02);
  sill.castShadow = true;
  sill.receiveShadow = true;
  group.add(sill);
  const apron = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.08, 0.08), mats.fascia);
  apron.position.set(0, 0.82, frameZ);
  apron.castShadow = true;
  group.add(apron);
  const jambL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.12, frameDepth), frameMat);
  jambL.name = "windowFrame";
  jambL.position.set(-0.56, 1.49, frameZ);
  jambL.castShadow = true;
  jambL.receiveShadow = true;
  jambL.renderOrder = 2;
  const jambR = jambL.clone();
  jambR.position.x = 0.56;
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.19, 0.07, frameDepth), frameMat);
  head.name = "windowFrame";
  head.position.set(0, 2.02, frameZ);
  head.castShadow = true;
  head.receiveShadow = true;
  head.renderOrder = 2;
  group.add(jambL, jambR, head);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.0, 0.02), mats.doorGlass);
  glass.position.set(0, 1.48, frameZ + 0.008);
  glass.castShadow = false;
  glass.receiveShadow = true;
  group.add(glass);
  const muntinV = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.0, 0.035), frameMat);
  muntinV.name = "windowFrame";
  muntinV.position.set(0, 1.48, frameZ + 0.02);
  muntinV.renderOrder = 2;
  const muntinH = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.035, 0.035), frameMat);
  muntinH.name = "windowFrame";
  muntinH.position.set(0, 1.48, frameZ + 0.02);
  muntinH.renderOrder = 2;
  group.add(muntinV, muntinH);
  return group;
}


function createStairsMesh(mats: ReturnType<typeof makeMaterials>, finish: StairsFinish = "timber") {
  // Straight flight: 6 treads, 1.0 m wide, 0.17 m rise (1.02 m total). Runs toward -Z.
  // Timber is the default; ashlar reuses the wall masonry catalog map; iron reuses the railing metal map on treads, risers and cheeks.
  const group = new THREE.Group();
  group.userData.stairsFinish = finish;
  const treads = 6;
  const rise = 0.17;
  const run = 0.28;
  const width = 1.0;
  const depth = 0.3;
  const treadMat = finish === "masonry" ? mats.wallMasonry : finish === "metal" ? mats.railingMetal : mats.nosing;
  const riserMat = finish === "masonry" ? mats.wallMasonry : finish === "metal" ? mats.railingMetal : mats.fascia;
  const cheekMat = finish === "masonry" ? mats.wallEdge : finish === "metal" ? mats.railingMetal : mats.plate;
  for (let i = 0; i < treads; i++) {
    const tread = new THREE.Mesh(new THREE.BoxGeometry(width, 0.045, depth), treadMat);
    tread.name = "stairTread";
    tread.position.set(0, rise * (i + 1) - 0.022, -run * i);
    tread.castShadow = true;
    tread.receiveShadow = true;
    staggerUvs(tread);
    group.add(tread);
    const riser = new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, rise - 0.02, 0.028), riserMat);
    riser.name = "stairRiser";
    riser.position.set(0, rise * i + rise * 0.48, -run * i + depth * 0.42);
    riser.castShadow = true;
    group.add(riser);
  }
  const totalRise = rise * treads;
  const totalRun = run * (treads - 1);
  const stringerLen = Math.hypot(totalRun, totalRise) + 0.16;
  const angle = Math.atan2(totalRise, totalRun);
  for (const side of [-1, 1]) {
    const stringer = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, stringerLen), cheekMat);
    stringer.name = "stairCheek";
    stringer.position.set(side * (width / 2 + 0.01), totalRise * 0.46, -totalRun / 2);
    stringer.rotation.x = angle;
    stringer.castShadow = true;
    stringer.receiveShadow = true;
    group.add(stringer);
  }
  const newel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.92, 0.08), cheekMat);
  newel.name = "stairCheek";
  newel.position.set(width / 2 + 0.01, 0.46, 0.08);
  newel.castShadow = true;
  group.add(newel);
  const newelTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.08), cheekMat);
  newelTop.name = "stairCheek";
  newelTop.position.set(width / 2 + 0.01, totalRise + 0.16, -totalRun);
  newelTop.castShadow = true;
  group.add(newelTop);
  return group;
}

function createRailingMesh(mats: ReturnType<typeof makeMaterials>, finish: RailingFinish = "timber") {
  // Straight balcony rail: 1.8 m run, 0.95 m handrail. Runs along X. Timber default; iron is selectable.
  const group = new THREE.Group();
  group.userData.railingFinish = finish;
  const iron = finish === "metal";
  const length = 1.8;
  const height = 0.95;
  const postW = 0.08;
  const postMat = iron ? mats.railingMetal : mats.plate;
  const railMat = iron ? mats.railingMetal : mats.nosing;
  const kickMat = iron ? mats.railingMetal : mats.fascia;
  for (const x of [-length / 2, 0, length / 2]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(postW, height, postW), postMat);
    post.name = "railingPost";
    post.position.set(x, height / 2, 0);
    post.castShadow = true;
    post.receiveShadow = true;
    group.add(post);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(postW + 0.02, 0.03, postW + 0.02), railMat);
    cap.name = "railingCap";
    cap.position.set(x, height + 0.012, 0);
    cap.castShadow = true;
    group.add(cap);
  }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.05, 0.07), railMat);
  rail.name = "railingRail";
  rail.position.set(0, height - 0.03, 0);
  rail.castShadow = true;
  rail.receiveShadow = true;
  staggerUvs(rail);
  group.add(rail);
  const kick = new THREE.Mesh(new THREE.BoxGeometry(length - postW, 0.04, 0.04), kickMat);
  kick.name = "railingKick";
  kick.position.set(0, 0.12, 0);
  kick.castShadow = true;
  kick.receiveShadow = true;
  group.add(kick);
  const span = length - postW * 2;
  const count = 9;
  for (let i = 0; i < count; i++) {
    const x = -span / 2 + (span / (count + 1)) * (i + 1);
    const baluster = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.7, 0.028), postMat);
    baluster.name = "railingBaluster";
    baluster.position.set(x, 0.16 + 0.35, 0);
    baluster.castShadow = true;
    group.add(baluster);
  }
  return group;
}


function createChimneyMesh(mats: ReturnType<typeof makeMaterials>, finish: ChimneyFinish = "brick") {
  // Brick stack: dedicated running-bond shaft, clay crown, twin flue pots. Sits on the ground beside a wall.
  const group = new THREE.Group();
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.16, 0.78), mats.chimney);
  plinth.name = "chimneyStack";
  plinth.position.y = 0.08;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  staggerUvs(plinth);
  group.add(plinth);
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.62, 2.55, 0.62), mats.chimney);
  shaft.name = "chimneyStack";
  shaft.position.y = 0.16 + 1.275;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  staggerUvs(shaft);
  group.add(shaft);
  const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.1, 0.74), mats.chimney);
  shoulder.name = "chimneyStack";
  shoulder.position.y = 2.76;
  shoulder.castShadow = true;
  staggerUvs(shoulder);
  group.add(shoulder);
  const crown = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.08, 0.84), mats.chimneyCrown);
  crown.name = "chimneyCrown";
  crown.position.y = 2.85;
  crown.castShadow = true;
  crown.receiveShadow = true;
  staggerUvs(crown);
  group.add(crown);
  for (const x of [-0.16, 0.16]) {
    const pot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.32, 0.2), mats.chimneyCrown);
    pot.name = "chimneyPot";
    pot.position.set(x, 3.06, 0);
    pot.castShadow = true;
    pot.receiveShadow = true;
    group.add(pot);
    const lip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.24), mats.chimneyCrown);
    lip.name = "chimneyPot";
    lip.position.set(x, 3.24, 0);
    lip.castShadow = true;
    group.add(lip);
  }
  applyChimneyFinish(group, mats, finish);
  group.userData.chimneyFinish = finish;
  return group;
}

function createBeamMesh(mats: ReturnType<typeof makeMaterials>, finish: BeamFinish = "timber") {
  // Open timber bay: two posts and a plate-height beam so it sits on the ground, not in mid-air.
  // Iron reuses the railing bar-stock map. Feet stay stone.
  const group = new THREE.Group();
  const span = 2.2;
  for (const x of [-span / 2, span / 2]) {
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.08, 0.26), mats.wallEdge);
    foot.name = "beamFoot";
    foot.position.set(x, 0.04, 0);
    foot.castShadow = true;
    foot.receiveShadow = true;
    group.add(foot);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.38, 0.14), mats.plate);
    post.name = "beamPost";
    post.position.set(x, 1.27, 0);
    post.castShadow = true;
    post.receiveShadow = true;
    staggerUvs(post);
    group.add(post);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.2), mats.nosing);
    cap.name = "beamCap";
    cap.position.set(x, 2.49, 0);
    cap.castShadow = true;
    group.add(cap);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(span + 0.28, 0.2, 0.16), mats.plate);
  beam.name = "beamSpan";
  beam.position.y = 2.58;
  beam.castShadow = true;
  beam.receiveShadow = true;
  staggerUvs(beam);
  group.add(beam);
  const endL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.16), mats.nosing);
  endL.name = "beamEnd";
  endL.position.set(-(span + 0.28) / 2, 2.58, 0);
  endL.castShadow = true;
  const endR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.16), mats.nosing);
  endR.name = "beamEnd";
  endR.position.set((span + 0.28) / 2, 2.58, 0);
  endR.castShadow = true;
  group.add(endL, endR);
  for (const x of [-span / 2 + 0.22, span / 2 - 0.22]) {
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.08), mats.fascia);
    brace.name = "beamBrace";
    brace.position.set(x, 2.4, 0);
    brace.rotation.z = x < 0 ? 0.55 : -0.55;
    brace.castShadow = true;
    group.add(brace);
  }
  applyBeamFinish(group, mats, finish);
  group.userData.beamFinish = finish;
  return group;
}

function createFoundationMesh(mats: ReturnType<typeof makeMaterials>, finish: FoundationFinish = "concrete") {
  // Strip footing: gravel bed, board-formed concrete, stone drip course. Sits on the ground under a wall.
  const group = new THREE.Group();
  const bed = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.06, 0.92), mats.gravel);
  bed.name = "foundationBed";
  bed.position.y = 0.03;
  bed.receiveShadow = true;
  staggerUvs(bed);
  group.add(bed);
  const strip = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.28, 0.55), mats.footing);
  strip.name = "foundationStrip";
  strip.position.y = 0.2;
  strip.castShadow = true;
  strip.receiveShadow = true;
  staggerUvs(strip);
  group.add(strip);
  const drip = new THREE.Mesh(new THREE.BoxGeometry(3.08, 0.07, 0.64), mats.wallEdge);
  drip.name = "foundationDrip";
  drip.position.y = 0.375;
  drip.castShadow = true;
  drip.receiveShadow = true;
  staggerUvs(drip);
  group.add(drip);
  const joint = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.22, 0.56), mats.wallEdge);
  joint.name = "foundationJoint";
  joint.position.set(0, 0.2, 0);
  joint.castShadow = true;
  group.add(joint);
  applyFoundationFinish(group, mats, finish);
  group.userData.foundationFinish = finish;
  return group;
}


function createPergolaMesh(mats: ReturnType<typeof makeMaterials>, finish: PergolaFinish = "timber") {
  // Shade bay: four timber posts, paired beams, and open rafters. Sits on the pad, not a wall.
  // Iron reuses the railing/beam bar-stock map. Pads stay gravel.
  const group = new THREE.Group();
  const spanX = 2.4;
  const spanZ = 2.2;
  const postH = 2.28;
  const xs = [-spanX / 2, spanX / 2];
  const zs = [-spanZ / 2, spanZ / 2];
  for (const x of xs) {
    for (const z of zs) {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.34), mats.gravel);
      pad.name = "pergolaPad";
      pad.position.set(x, 0.02, z);
      pad.receiveShadow = true;
      staggerUvs(pad);
      group.add(pad);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, postH, 0.12), mats.plate);
      post.name = "pergolaPost";
      post.position.set(x, 0.04 + postH / 2, z);
      post.castShadow = true;
      post.receiveShadow = true;
      staggerUvs(post);
      group.add(post);
    }
  }
  for (const z of zs) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(spanX + 0.28, 0.14, 0.16), mats.nosing);
    beam.name = "pergolaBeam";
    beam.position.set(0, 2.36, z);
    beam.castShadow = true;
    beam.receiveShadow = true;
    staggerUvs(beam);
    group.add(beam);
  }
  const rafterCount = 6;
  for (let i = 0; i < rafterCount; i++) {
    const x = -spanX / 2 + 0.18 + i * ((spanX - 0.36) / (rafterCount - 1));
    const rafter = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, spanZ + 0.36), mats.fascia);
    rafter.name = "pergolaRafter";
    rafter.position.set(x, 2.46, 0);
    rafter.castShadow = true;
    staggerUvs(rafter);
    group.add(rafter);
  }
  applyPergolaFinish(group, mats, finish);
  group.userData.pergolaFinish = finish;
  return group;
}


function createFenceMesh(mats: ReturnType<typeof makeMaterials>, finish: FenceFinish = "timber") {
  // Garden bay: two posts, twin rails, open pickets. Iron reuses the railing bar-stock map.
  const group = new THREE.Group();
  const span = 2.4;
  const postH = 1.22;
  for (const x of [-span / 2, span / 2]) {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.28), mats.gravel);
    pad.name = "fencePad";
    pad.position.set(x, 0.02, 0);
    pad.receiveShadow = true;
    staggerUvs(pad);
    group.add(pad);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, postH, 0.1), mats.plate);
    post.name = "fencePost";
    post.position.set(x, 0.04 + postH / 2, 0);
    post.castShadow = true;
    post.receiveShadow = true;
    staggerUvs(post);
    group.add(post);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.04, 0.13), mats.nosing);
    cap.name = "fenceCap";
    cap.position.set(x, 0.04 + postH + 0.02, 0);
    cap.castShadow = true;
    group.add(cap);
  }
  for (const y of [0.42, 1.02]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(span - 0.08, 0.06, 0.05), mats.nosing);
    rail.name = "fenceRail";
    rail.position.set(0, y, 0);
    rail.castShadow = true;
    rail.receiveShadow = true;
    staggerUvs(rail);
    group.add(rail);
  }
  const pickets = 9;
  for (let i = 0; i < pickets; i++) {
    const x = -span / 2 + 0.22 + i * ((span - 0.44) / (pickets - 1));
    const picket = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.92, 0.03), mats.fascia);
    picket.name = "fencePicket";
    picket.position.set(x, 0.58, 0.02);
    picket.castShadow = true;
    staggerUvs(picket);
    group.add(picket);
  }
  applyFenceFinish(group, mats, finish);
  group.userData.fenceFinish = finish;
  return group;
}

function createPathMesh(mats: ReturnType<typeof makeMaterials>, finish: PathFinish = "gravel") {
  // Garden walk: compacted bed, three surface bays, timber edging. Sits on the lawn, not a floor plate.
  const group = new THREE.Group();
  const bed = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.04, 1.16), mats.gravel);
  bed.name = "pathSlab";
  bed.position.y = 0.02;
  bed.receiveShadow = true;
  staggerUvs(bed);
  group.add(bed);
  const skin = finish === "clay" ? mats.floorClay : mats.gravel;
  for (let i = 0; i < 3; i++) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.045, 0.96), skin);
    slab.name = "pathSlab";
    slab.position.set(-1.16 + i * 1.16, 0.05, 0);
    slab.castShadow = true;
    slab.receiveShadow = true;
    staggerUvs(slab);
    group.add(slab);
  }
  for (const z of [-0.54, 0.54]) {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.07, 0.06), mats.nosing);
    edge.name = "pathEdge";
    edge.position.set(0, 0.06, z);
    edge.castShadow = true;
    edge.receiveShadow = true;
    staggerUvs(edge);
    group.add(edge);
  }
  applyPathFinish(group, mats, finish);
  group.userData.pathFinish = finish;
  return group;
}

function createPlanterMesh(mats: ReturnType<typeof makeMaterials>, finish: PlanterFinish = "clay") {
  // Garden trough on the lawn: clay body, lip, soil, three clipped boxwood masses.
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.42, 0.52), mats.floorClay);
  body.name = "planterBody";
  body.position.y = 0.22;
  body.castShadow = true;
  body.receiveShadow = true;
  staggerUvs(body);
  group.add(body);
  const rim = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.06, 0.58), mats.chimneyCrown);
  rim.name = "planterRim";
  rim.position.y = 0.44;
  rim.castShadow = true;
  staggerUvs(rim);
  group.add(rim);
  const soil = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.04, 0.4), mats.gravel);
  soil.name = "planterSoil";
  soil.position.y = 0.4;
  soil.receiveShadow = true;
  staggerUvs(soil);
  group.add(soil);
  const clumps = [
    [-0.38, 0.62, 0, 0.28],
    [0.05, 0.7, 0.02, 0.34],
    [0.42, 0.58, -0.02, 0.24],
  ] as const;
  for (const [x, y, z, s] of clumps) {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(s, s * 0.85, s * 0.7), mats.planterLeaf);
    leaf.name = "planterLeaf";
    leaf.position.set(x, y, z);
    leaf.castShadow = true;
    group.add(leaf);
  }
  applyPlanterFinish(group, mats, finish);
  group.userData.planterFinish = finish;
  return group;
}

function createBenchMesh(mats: ReturnType<typeof makeMaterials>, finish: BenchFinish = "timber") {
  // Garden seat on the lawn: pads, legs, slatted seat, and a low back. Not a railing bay.
  const group = new THREE.Group();
  const span = 1.55;
  for (const x of [-span / 2 + 0.08, span / 2 - 0.08]) {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.36), mats.footing);
    pad.name = "benchPad";
    pad.position.set(x, 0.02, 0.02);
    pad.receiveShadow = true;
    staggerUvs(pad);
    group.add(pad);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.28), mats.plate);
    leg.name = "benchLeg";
    leg.position.set(x, 0.24, 0.02);
    leg.castShadow = true;
    leg.receiveShadow = true;
    staggerUvs(leg);
    group.add(leg);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.06), mats.plate);
    post.name = "benchPost";
    post.position.set(x, 0.62, -0.16);
    post.castShadow = true;
    staggerUvs(post);
    group.add(post);
  }
  for (let i = 0; i < 4; i++) {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(span, 0.035, 0.09), mats.nosing);
    seat.name = "benchSeat";
    seat.position.set(0, 0.46, -0.12 + i * 0.1);
    seat.castShadow = true;
    seat.receiveShadow = true;
    staggerUvs(seat);
    group.add(seat);
  }
  for (const y of [0.58, 0.7, 0.82]) {
    const back = new THREE.Mesh(new THREE.BoxGeometry(span - 0.06, 0.04, 0.035), mats.nosing);
    back.name = "benchBack";
    back.position.set(0, y, -0.16);
    back.castShadow = true;
    staggerUvs(back);
    group.add(back);
  }
  applyBenchFinish(group, mats, finish);
  group.userData.benchFinish = finish;
  return group;
}

function createLampMesh(mats: ReturnType<typeof makeMaterials>, finish: LampFinish = "timber") {
  // Garden lamp on the lawn: footing, post, glazed lantern, hood. Not a column.
  const group = new THREE.Group();
  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.36), mats.footing);
  pad.name = "lampPad";
  pad.position.set(0, 0.025, 0);
  pad.receiveShadow = true;
  staggerUvs(pad);
  group.add(pad);
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.28, 0.09), mats.plate);
  post.name = "lampPost";
  post.position.set(0, 0.69, 0);
  post.castShadow = true;
  post.receiveShadow = true;
  staggerUvs(post);
  group.add(post);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.2), mats.doorGlass);
  glass.name = "lampGlass";
  glass.position.set(0, 1.46, 0);
  glass.castShadow = true;
  staggerUvs(glass);
  group.add(glass);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.28), mats.nosing);
  hood.name = "lampHood";
  hood.position.set(0, 1.62, 0);
  hood.castShadow = true;
  staggerUvs(hood);
  group.add(hood);
  const finial = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.05), mats.plate);
  finial.name = "lampFinial";
  finial.position.set(0, 1.7, 0);
  finial.castShadow = true;
  staggerUvs(finial);
  group.add(finial);
  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.16), mats.nosing);
  cap.name = "lampCap";
  cap.position.set(0, 1.3, 0);
  cap.castShadow = true;
  staggerUvs(cap);
  group.add(cap);
  applyLampFinish(group, mats, finish);
  group.userData.lampFinish = finish;
  return group;
}

function createPartMesh(kind: PartKind, mats: ReturnType<typeof makeMaterials>, finish: DoorFinish = "timber", roofFinish: RoofFinish = "clay", wallFinish: WallFinish = "plaster", columnFinish: ColumnFinish = "plaster", stairsFinish: StairsFinish = "timber", railingFinish: RailingFinish = "timber", windowFinish: WindowFinish = "timber", floorFinish: FloorFinish = "timber", fenceFinish: FenceFinish = "timber", pathFinish: PathFinish = "gravel", planterFinish: PlanterFinish = "clay", benchFinish: BenchFinish = "timber", chimneyFinish: ChimneyFinish = "brick", lampFinish: LampFinish = "timber", beamFinish: BeamFinish = "timber", foundationFinish: FoundationFinish = "concrete", pergolaFinish: PergolaFinish = "timber") {
  if (kind === "wall") return createWallMesh(mats, wallFinish);
  if (kind === "floor") return createFloorMesh(mats, floorFinish);
  if (kind === "roof") return createRoofMesh(mats, roofFinish);
  if (kind === "column") return createColumnMesh(mats, columnFinish);
  if (kind === "door") return createDoorMeshWithFinish(mats, finish);
  if (kind === "window") return createWindowMesh(mats, windowFinish);
  if (kind === "stairs") return createStairsMesh(mats, stairsFinish);
  if (kind === "railing") return createRailingMesh(mats, railingFinish);
  if (kind === "chimney") return createChimneyMesh(mats, chimneyFinish);
  if (kind === "beam") return createBeamMesh(mats, beamFinish);
  if (kind === "foundation") return createFoundationMesh(mats, foundationFinish);
  if (kind === "pergola") return createPergolaMesh(mats, pergolaFinish);
  if (kind === "fence") return createFenceMesh(mats, fenceFinish);
  if (kind === "path") return createPathMesh(mats, pathFinish);
  if (kind === "planter") return createPlanterMesh(mats, planterFinish);
  if (kind === "bench") return createBenchMesh(mats, benchFinish);
  return createLampMesh(mats, lampFinish);
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
  if (kind === "beam") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="6" y="24" width="6" height="3" fill="#b7ab9a" />
        <rect x="28" y="24" width="6" height="3" fill="#b7ab9a" />
        <rect x="7.5" y="8" width="3" height="16" fill="#8b5a32" />
        <rect x="29.5" y="8" width="3" height="16" fill="#8b5a32" />
        <rect x="4" y="6" width="32" height="4" fill="#6d4a30" />
        <path d="M11 10 L16 7 M29 10 L24 7" stroke="#c4a882" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "pergola") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="6" y="24" width="4" height="4" fill="#9a907e" />
        <rect x="30" y="24" width="4" height="4" fill="#9a907e" />
        <rect x="7" y="10" width="2.4" height="14" fill="#8b5a32" />
        <rect x="30.6" y="10" width="2.4" height="14" fill="#8b5a32" />
        <rect x="4" y="8" width="32" height="2.4" fill="#6d4a30" />
        <path d="M7 8 V5 M13 8 V5 M19 8 V5 M25 8 V5 M31 8 V5" stroke="#c4a882" strokeWidth="1.3" />
      </svg>
    );
  }
  if (kind === "foundation") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="3" y="22" width="34" height="6" fill="#9a907e" />
        <rect x="5" y="16" width="30" height="7" fill="#c4b8a4" stroke="#8a7d6c" />
        <rect x="4" y="14" width="32" height="3" fill="#b7ab9a" />
        <path d="M8 18.5 H32 M8 20.5 H32" stroke="#8a7d6c" strokeWidth="0.6" opacity="0.7" />
      </svg>
    );
  }
  if (kind === "fence") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="4" y="24" width="4" height="4" fill="#9a907e" />
        <rect x="32" y="24" width="4" height="4" fill="#9a907e" />
        <rect x="5" y="10" width="2.2" height="15" fill="#6d4a30" />
        <rect x="32.8" y="10" width="2.2" height="15" fill="#6d4a30" />
        <rect x="6" y="12" width="28" height="1.6" fill="#8b5a32" />
        <rect x="6" y="20" width="28" height="1.6" fill="#8b5a32" />
        <path d="M9 11 V23 M14 11 V23 M19 11 V23 M24 11 V23 M29 11 V23" stroke="#c4a882" strokeWidth="1.2" />
      </svg>
    );
  }
  if (kind === "path") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="3" y="10" width="34" height="12" fill="#9a907e" stroke="#6d6456" />
        <rect x="5" y="12" width="9" height="8" fill="#b7ab9a" />
        <rect x="15.5" y="12" width="9" height="8" fill="#c4b8a4" />
        <rect x="26" y="12" width="9" height="8" fill="#b7ab9a" />
        <rect x="3" y="9" width="34" height="1.4" fill="#8b5a32" />
        <rect x="3" y="21.6" width="34" height="1.4" fill="#8b5a32" />
      </svg>
    );
  }
  if (kind === "planter") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="6" y="16" width="28" height="10" fill="#8a4e3a" stroke="#5c3226" />
        <rect x="5" y="15" width="30" height="2.2" fill="#6b3a2a" />
        <rect x="9" y="17.5" width="22" height="2" fill="#9a907e" />
        <rect x="11" y="8" width="6" height="8" fill="#3f6b3a" />
        <rect x="17" y="6" width="7" height="10" fill="#4d7c45" />
        <rect x="24" y="9" width="5" height="7" fill="#3f6b3a" />
      </svg>
    );
  }
  if (kind === "bench") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="6" y="24" width="4" height="4" fill="#9a907e" />
        <rect x="30" y="24" width="4" height="4" fill="#9a907e" />
        <rect x="7" y="16" width="2.4" height="8" fill="#8b5a32" />
        <rect x="30.6" y="16" width="2.4" height="8" fill="#8b5a32" />
        <rect x="5" y="14" width="30" height="2.4" fill="#c4a882" />
        <rect x="6" y="11.2" width="28" height="1.6" fill="#a67c52" />
        <path d="M7 14 V7 M33 14 V7" stroke="#6d4a30" strokeWidth="1.6" />
        <path d="M7 8 H33 M7 10.4 H33" stroke="#c4a882" strokeWidth="1.2" />
      </svg>
    );
  }
  if (kind === "lamp") {
    return (
      <svg viewBox="0 0 40 32" className="h-8 w-10" aria-hidden>
        <rect x="16" y="26" width="8" height="3" fill="#9a907e" />
        <rect x="18.6" y="10" width="2.8" height="16" fill="#6d4a30" />
        <rect x="14" y="8" width="12" height="7" fill="#9bb7c9" stroke="#5c6670" />
        <path d="M13 8 H27 L20 4 Z" fill="#8b5a32" />
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
  const [doorFinish, setDoorFinish] = useState<DoorFinish>("timber");
  const [roofFinish, setRoofFinish] = useState<RoofFinish>("clay");
  const [wallFinish, setWallFinish] = useState<WallFinish>("plaster");
  const [columnFinish, setColumnFinish] = useState<ColumnFinish>("plaster");
  const [stairsFinish, setStairsFinish] = useState<StairsFinish>("timber");
  const [railingFinish, setRailingFinish] = useState<RailingFinish>("timber");
  const [windowFinish, setWindowFinish] = useState<WindowFinish>("timber");
  const [floorFinish, setFloorFinish] = useState<FloorFinish>("timber");
  const [fenceFinish, setFenceFinish] = useState<FenceFinish>("timber");
  const [pathFinish, setPathFinish] = useState<PathFinish>("gravel");
  const [planterFinish, setPlanterFinish] = useState<PlanterFinish>("clay");
  const [benchFinish, setBenchFinish] = useState<BenchFinish>("timber");
  const [chimneyFinish, setChimneyFinish] = useState<ChimneyFinish>("brick");
  const [lampFinish, setLampFinish] = useState<LampFinish>("timber");
  const [beamFinish, setBeamFinish] = useState<BeamFinish>("timber");
  const [foundationFinish, setFoundationFinish] = useState<FoundationFinish>("concrete");
  const [pergolaFinish, setPergolaFinish] = useState<PergolaFinish>("timber");
  const [finishRev, setFinishRev] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [placingFromPalette, setPlacingFromPalette] = useState(false);
  const [dragCursor, setDragCursor] = useState<{ x: number; y: number; over: boolean } | null>(null);
  const [selectedRot, setSelectedRot] = useState(0);
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [actionHint, setActionHint] = useState<string | null>(null);
  const actionHintTimer = useRef<number | null>(null);
  // Narrow viewports: icon-only palette so the canvas keeps the layout (canvas + right rail).
  const [paletteCompact, setPaletteCompact] = useState(false);
  const [layers, setLayers] = useState<SceneLayer[]>([
    { id: BASE_LAYER_ID, name: "Base", visible: true, locked: false },
  ]);
  const [activeLayerId, setActiveLayerId] = useState(BASE_LAYER_ID);
  const [lockRev, setLockRev] = useState(0);
  const layersRef = useRef(layers);
  const activeLayerRef = useRef(activeLayerId);
  const toolRef = useRef(tool);
  const doorFinishRef = useRef(doorFinish);
  const roofFinishRef = useRef(roofFinish);
  const wallFinishRef = useRef(wallFinish);
  const columnFinishRef = useRef(columnFinish);
  const stairsFinishRef = useRef(stairsFinish);
  const railingFinishRef = useRef(railingFinish);
  const windowFinishRef = useRef(windowFinish);
  const floorFinishRef = useRef(floorFinish);
  const fenceFinishRef = useRef(fenceFinish);
  const pathFinishRef = useRef(pathFinish);
  const planterFinishRef = useRef(planterFinish);
  const benchFinishRef = useRef(benchFinish);
  const chimneyFinishRef = useRef(chimneyFinish);
  const lampFinishRef = useRef(lampFinish);
  const beamFinishRef = useRef(beamFinish);
  const foundationFinishRef = useRef(foundationFinish);
  const pergolaFinishRef = useRef(pergolaFinish);
  const selectedRef = useRef(selectedId);
  const draggingRef = useRef<{ id: string; offset: THREE.Vector3 } | null>(null);
  // Live move chip is DOM-updated so a drag does not re-render the monolith each pointermove.
  const [moveChip, setMoveChip] = useState<{ x: number; y: number; text: string } | null>(null);
  const moveChipPosRef = useRef({ x: 0, y: 0, text: "" });
  const [lockHint, setLockHint] = useState<{ x: number; y: number } | null>(null);
  const lockHintTimer = useRef<number | null>(null);
  const moveLabelRef = useRef<{ moving: string; kinds: Partial<Record<PartKind, string>> }>({ moving: "Moving", kinds: {} });
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
    return () => {
      if (lockHintTimer.current != null) window.clearTimeout(lockHintTimer.current);
    };
  }, []);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  useEffect(() => {
    doorFinishRef.current = doorFinish;
  }, [doorFinish]);
  useEffect(() => {
    roofFinishRef.current = roofFinish;
  }, [roofFinish]);
  useEffect(() => {
    wallFinishRef.current = wallFinish;
  }, [wallFinish]);
  useEffect(() => {
    columnFinishRef.current = columnFinish;
  }, [columnFinish]);
  useEffect(() => {
    stairsFinishRef.current = stairsFinish;
  }, [stairsFinish]);
  useEffect(() => {
    railingFinishRef.current = railingFinish;
  }, [railingFinish]);
  useEffect(() => {
    windowFinishRef.current = windowFinish;
  }, [windowFinish]);
  useEffect(() => {
    floorFinishRef.current = floorFinish;
    fenceFinishRef.current = fenceFinish;
    pathFinishRef.current = pathFinish;
    planterFinishRef.current = planterFinish;
    benchFinishRef.current = benchFinish;
    chimneyFinishRef.current = chimneyFinish;
    lampFinishRef.current = lampFinish;
    beamFinishRef.current = beamFinish;
    foundationFinishRef.current = foundationFinish;
    pergolaFinishRef.current = pergolaFinish;
  }, [floorFinish, fenceFinish, pathFinish, planterFinish, benchFinish, chimneyFinish, lampFinish, beamFinish, foundationFinish, pergolaFinish]);
  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);

  useEffect(() => {
    activeLayerRef.current = activeLayerId;
  }, [activeLayerId]);

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
    (kind: PartKind, finish: DoorFinish = "timber", roofCover: RoofFinish = "clay", wallCover: WallFinish = "plaster", columnCover: ColumnFinish = "plaster", stairsCover: StairsFinish = "timber", railingCover: RailingFinish = "timber", windowCover: WindowFinish = "timber", floorCover: FloorFinish = "timber", fenceCover: FenceFinish = "timber", pathCover: PathFinish = "gravel", planterCover: PlanterFinish = "clay", benchCover: BenchFinish = "timber", chimneyCover: ChimneyFinish = "brick", lampCover: LampFinish = "timber", beamCover: BeamFinish = "timber", foundationCover: FoundationFinish = "concrete", pergolaCover: PergolaFinish = "timber") => {
      const t = threeRef.current;
      if (!t) return;
      clearGhost();
      let obj: THREE.Object3D;
      obj = createPartMesh(kind, t.mats, kind === "door" ? finish : "timber", kind === "roof" ? roofCover : "clay", kind === "wall" ? wallCover : "plaster", kind === "column" ? columnCover : "plaster", kind === "stairs" ? stairsCover : "timber", kind === "railing" ? railingCover : "timber", kind === "window" ? windowCover : "timber", kind === "floor" ? floorCover : "timber", kind === "fence" ? fenceCover : "timber", kind === "path" ? pathCover : "gravel", kind === "planter" ? planterCover : "clay", kind === "bench" ? benchCover : "timber", kind === "chimney" ? chimneyCover : "brick", kind === "lamp" ? lampCover : "timber", kind === "beam" ? beamCover : "timber", kind === "foundation" ? foundationCover : "concrete", kind === "pergola" ? pergolaCover : "timber");
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
    makeGhost(tool, doorFinish, roofFinish, wallFinish, columnFinish, stairsFinish, railingFinish, windowFinish, floorFinish, fenceFinish, pathFinish, planterFinish, benchFinish, chimneyFinish, lampFinish, beamFinish, foundationFinish, pergolaFinish);
  }, [tool, doorFinish, roofFinish, wallFinish, columnFinish, stairsFinish, railingFinish, windowFinish, floorFinish, fenceFinish, pathFinish, planterFinish, benchFinish, chimneyFinish, lampFinish, beamFinish, foundationFinish, pergolaFinish, ready, makeGhost]);

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
      // A touch more Mie so cirrus banks read against the shell, not a flat wash.
      skyUniforms["turbidity"].value = 7.1;
      skyUniforms["rayleigh"].value = 1.04;
      skyUniforms["mieCoefficient"].value = 0.0054;
      skyUniforms["mieDirectionalG"].value = 0.8;
      const sun = new THREE.Vector3();
      // Lower sun (closer to horizon) so walls cast longer, readable shadows on the pad.
      const phi = THREE.MathUtils.degToRad(80);
      const theta = THREE.MathUtils.degToRad(132);
      sun.setFromSphericalCoords(1, phi, theta);
      skyUniforms["sunPosition"].value.copy(sun);
      // Sky is a huge shell; fog would flatten it to the clear color.
      sky.material.fog = false;
      sky.material.depthWrite = false;

      // Sky bounce matches the late-day shell (warm zenith, olive ground) so shaded faces are not cool blue.
      const hemi = new THREE.HemisphereLight(0xf3d7b4, 0x5e6844, 0.4);
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
      dir.shadow.bias = -0.00028;
      dir.shadow.normalBias = 0.028;
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
      // Four shared cirrus cards on the sky shell. Fog off so they do not flatten to the clear color.
      const cirrusMap = makeCanvasTexture(256, paintCirrus, true);
      const cirrusMat = new THREE.MeshBasicMaterial({
        map: cirrusMap ?? undefined,
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        side: THREE.DoubleSide,
        opacity: 0.7,
      });
      const cirrusGeo = new THREE.PlaneGeometry(168, 34);
      const cirrusBanks: THREE.Mesh[] = [];
      for (let i = 0; i < 4; i++) {
        const bank = new THREE.Mesh(cirrusGeo, cirrusMat);
        const ang = theta + (i - 1.5) * 0.62;
        bank.position.set(Math.sin(ang) * 200, 42 + i * 7, Math.cos(ang) * 200);
        bank.lookAt(0, 16, 0);
        cirrusBanks.push(bank);
        scene.add(bank);
      }
      const fill = new THREE.DirectionalLight(0x9eb6d4, 0.28);
      fill.position.set(-sun.x * 26, 9, -sun.z * 26);
      scene.add(fill);
      // Warm bounce off the gravel pad, no shadow (keeps mid-range fill cheap).
      const bounce = new THREE.DirectionalLight(0xe7d2b4, 0.18);
      bounce.position.set(6, 1.2, 8);
      scene.add(bounce);
      scene.add(new THREE.AmbientLight(0xfff6ea, 0.08));
      // Low golden rim along the sun azimuth. No shadow map — eaves and columns pick up an edge.
      const rim = new THREE.DirectionalLight(0xffb56a, 0.38);
      rim.position.set(sun.x * 18, 2.6, sun.z * 18);
      scene.add(rim);
      scene.add(rim.target);

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
      const padRim = new THREE.Mesh(rimGeo, rimMat);
      padRim.rotation.x = -Math.PI / 2;
      padRim.position.y = 0.012;
      padRim.receiveShadow = true;
      scene.add(padRim);
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
      const tuftColor = new THREE.Color();
      for (let i = 0; i < TUFTS; i++) {
        const tint = hash2(i, 5.5);
        tuftColor.setHex(tint > 0.66 ? 0x8a9a4e : tint > 0.33 ? 0x4e6a34 : 0x6d8444);
        tufts.setColorAt(i, tuftColor);
      }
      if (tufts.instanceColor) tufts.instanceColor.needsUpdate = true;
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

      // Disc contact stretched away from the sun. One quad, no extra shadow map.
      const padCastMap = makeCanvasTexture(128, paintPadCast, true);
      const padCastMat = new THREE.MeshBasicMaterial({
        map: padCastMap ?? undefined,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        opacity: 0.5,
      });
      padCastMat.polygonOffset = true;
      padCastMat.polygonOffsetFactor = -1;
      padCastMat.polygonOffsetUnits = -1;
      const padCastGeo = new THREE.PlaneGeometry(16.5, 22);
      const padCast = new THREE.Mesh(padCastGeo, padCastMat);
      padCast.rotation.order = "YXZ";
      padCast.rotation.y = Math.atan2(sun.x, sun.z);
      padCast.rotation.x = -Math.PI / 2;
      padCast.position.set(-sun.x * 3.6, 0.008, -sun.z * 3.6);
      padCast.renderOrder = 1;
      padCast.castShadow = false;
      padCast.receiveShadow = false;
      scene.add(padCast);

      // Soft seat under the gravel lip so the disc reads as set into the lawn. One 128px ring, no shadow map.
      const padSeatMap = makeCanvasTexture(128, paintPadSeat, true);
      const padSeatMat = new THREE.MeshBasicMaterial({
        map: padSeatMap ?? undefined,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        opacity: 0.62,
      });
      padSeatMat.polygonOffset = true;
      padSeatMat.polygonOffsetFactor = -1;
      padSeatMat.polygonOffsetUnits = -1;
      const padSeat = new THREE.Mesh(new THREE.CircleGeometry(13.2, 56), padSeatMat);
      padSeat.rotation.x = -Math.PI / 2;
      padSeat.position.y = 0.009;
      padSeat.renderOrder = 1;
      padSeat.castShadow = false;
      padSeat.receiveShadow = false;
      scene.add(padSeat);

      // Sun-side light, opposite olive shade on the pad. Sits above gravel, fades at the rim.
      const shadeMap = makeCanvasTexture(256, paintSiteShade, true);
      const shadeMat = new THREE.MeshBasicMaterial({
        map: shadeMap ?? undefined,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        opacity: 0.62,
      });
      const shadeGeo = new THREE.CircleGeometry(11.05, 48);
      const siteShade = new THREE.Mesh(shadeGeo, shadeMat);
      siteShade.rotation.order = "YXZ";
      siteShade.rotation.y = Math.atan2(-sun.x, -sun.z);
      siteShade.rotation.x = -Math.PI / 2;
      siteShade.position.y = 0.026;
      scene.add(siteShade);

      // Meadow key outside the pad. One 256px card, no shadow map.
      const meadowMap = makeCanvasTexture(256, paintMeadowWash, true);
      const meadowMat = new THREE.MeshBasicMaterial({
        map: meadowMap ?? undefined,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        opacity: 0.5,
      });
      meadowMat.polygonOffset = true;
      meadowMat.polygonOffsetFactor = -1;
      meadowMat.polygonOffsetUnits = -1;
      const meadowGeo = new THREE.CircleGeometry(46, 48);
      const meadowWash = new THREE.Mesh(meadowGeo, meadowMat);
      meadowWash.rotation.order = "YXZ";
      meadowWash.rotation.y = Math.atan2(sun.x, sun.z);
      meadowWash.rotation.x = -Math.PI / 2;
      meadowWash.position.set(sun.x * 6, 0.021, sun.z * 6);
      meadowWash.renderOrder = 1;
      meadowWash.castShadow = false;
      meadowWash.receiveShadow = false;
      scene.add(meadowWash);

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
      // Low sun bank on the same azimuth as the key light. Additive, fog off, no shadow map.
      const sunHorizonMap = makeCanvasTexture(128, paintSunHorizon, true);
      const sunHorizonMat = new THREE.MeshBasicMaterial({
        map: sunHorizonMap ?? undefined,
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        opacity: 0.62,
      });
      const sunHorizon = new THREE.Mesh(new THREE.PlaneGeometry(86, 18), sunHorizonMat);
      sunHorizon.position.set(sun.x * 108, 5.2, sun.z * 108);
      sunHorizon.lookAt(0, 4.2, 0);
      sunHorizon.castShadow = false;
      sunHorizon.receiveShadow = false;
      scene.add(sunHorizon);
      // Cool sky fill opposite the key. Fog off so it does not flatten into the haze color. No shadow map.
      const coolHorizonMap = makeCanvasTexture(128, paintCoolHorizon, true);
      const coolHorizonMat = new THREE.MeshBasicMaterial({
        map: coolHorizonMap ?? undefined,
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        side: THREE.DoubleSide,
        opacity: 0.42,
      });
      const coolHorizon = new THREE.Mesh(new THREE.PlaneGeometry(78, 16), coolHorizonMat);
      coolHorizon.position.set(-sun.x * 108, 6.4, -sun.z * 108);
      coolHorizon.lookAt(0, 5.2, 0);
      coolHorizon.castShadow = false;
      coolHorizon.receiveShadow = false;
      scene.add(coolHorizon);
      // Cloud shade on the far lawn. Opposite the sun bank, no extra shadow map.
      const lawnDappleMap = makeCanvasTexture(128, paintLawnDapple, true);
      const lawnDappleMat = new THREE.MeshBasicMaterial({
        map: lawnDappleMap ?? undefined,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        opacity: 0.55,
      });
      lawnDappleMat.polygonOffset = true;
      lawnDappleMat.polygonOffsetFactor = -1;
      lawnDappleMat.polygonOffsetUnits = -1;
      const lawnDapple = new THREE.Mesh(new THREE.CircleGeometry(22, 40), lawnDappleMat);
      lawnDapple.rotation.x = -Math.PI / 2;
      lawnDapple.position.set(-sun.x * 18, 0.022, -sun.z * 18);
      lawnDapple.castShadow = false;
      lawnDapple.receiveShadow = false;
      lawnDapple.renderOrder = 1;
      scene.add(lawnDapple);

      // Distant hedgerow so the lawn ends in trees, not an empty haze. One shared 256px card, no shadow map.
      const hedgerowMap = makeCanvasTexture(256, paintHedgerow, true);
      const hedgerowMat = new THREE.MeshBasicMaterial({
        map: hedgerowMap ?? undefined,
        transparent: true,
        depthWrite: false,
        fog: true,
        toneMapped: true,
        side: THREE.DoubleSide,
        opacity: 0.78,
      });
      const hedgerowGeo = new THREE.PlaneGeometry(62, 12);
      const hedgerows: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i++) {
        const hedge = new THREE.Mesh(hedgerowGeo, hedgerowMat);
        const ang = theta + Math.PI * 0.55 + i * 0.85;
        hedge.position.set(Math.sin(ang) * 92, 3.6, Math.cos(ang) * 92);
        hedge.lookAt(0, 3.1, 0);
        hedge.castShadow = false;
        hedge.receiveShadow = false;
        hedgerows.push(hedge);
        scene.add(hedge);
      }

      const partsRoot = new THREE.Group();
      scene.add(partsRoot);

      // Soft contact under each placed part. One instanced quad, shared map, no shadow pass.
      const FOOT_AO_MAX = 48;
      const footAoMap = makeCanvasTexture(128, paintFootAO, true);
      const footAoMat = new THREE.MeshBasicMaterial({
        map: footAoMap ?? undefined,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        opacity: 0.72,
      });
      footAoMat.polygonOffset = true;
      footAoMat.polygonOffsetFactor = -2;
      footAoMat.polygonOffsetUnits = -2;
      const footAoGeo = new THREE.PlaneGeometry(1, 1);
      const footAo = new THREE.InstancedMesh(footAoGeo, footAoMat, FOOT_AO_MAX);
      footAo.count = 0;
      footAo.frustumCulled = false;
      footAo.renderOrder = 2;
      footAo.castShadow = false;
      footAo.receiveShadow = false;
      scene.add(footAo);
      const footDummy = new THREE.Object3D();
      const footBox = new THREE.Box3();

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
          if (target && target.visible) {
            const part = partsRef.current.find((p) => p.id === selId);
            const frozen = part ? partFrozen(part, layersRef.current) : false;
            const mat = selectionHelper.material as THREE.LineBasicMaterial;
            mat.color.set(frozen ? 0xf0c14e : 0xc4843a);
            const badge = target.getObjectByName("lockBadge");
            const badgeWas = badge?.visible ?? false;
            if (badge) badge.visible = false;
            selectionHelper.setFromObject(target);
            if (badge) badge.visible = badgeWas;
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
        // Same 2048 map: tighten when close for contact, widen when pulled back so a house is not clipped.
        const orbitDist = Math.hypot(camera.position.x - focusX, camera.position.z - focusZ);
        const half = THREE.MathUtils.clamp(8 + orbitDist * 0.38, 9, 22);
        const shadowCam = dir.shadow.camera;
        if (Math.abs(shadowCam.right - half) > 0.4) {
          shadowCam.left = -half;
          shadowCam.right = half;
          shadowCam.top = half;
          shadowCam.bottom = -half;
          shadowCam.updateProjectionMatrix();
          dir.shadow.radius = half > 16 ? 2 : 1.4;
        }
        // Foot contact follows the mesh, so drag/rotate keep the shadow without a second shadow map.
        let footN = 0;
        for (const child of partsRoot.children) {
          if (footN >= FOOT_AO_MAX) break;
          if (!child.userData.partId || !child.visible) continue;
          boxWithoutBadge(child, footBox);
          if (!Number.isFinite(footBox.min.x) || footBox.isEmpty()) continue;
          const sx = THREE.MathUtils.clamp((footBox.max.x - footBox.min.x) * 0.72, 0.42, 8);
          const sz = THREE.MathUtils.clamp((footBox.max.z - footBox.min.z) * 0.72, 0.42, 8);
          const height = Math.max(0, footBox.max.y - footBox.min.y);
          const cast = THREE.MathUtils.clamp(height * 0.14, 0.06, 1.15);
          footDummy.position.set(
            (footBox.min.x + footBox.max.x) * 0.5 - sun.x * cast,
            0.034,
            (footBox.min.z + footBox.max.z) * 0.5 - sun.z * cast,
          );
          footDummy.rotation.order = "YXZ";
          footDummy.rotation.set(-Math.PI / 2, Math.atan2(sun.x, sun.z), 0);
          footDummy.scale.set(Math.min(sx, sz) * 0.92, Math.max(sx, sz) * 0.86 + cast * 0.55, 1);
          footDummy.updateMatrix();
          footAo.setMatrixAt(footN, footDummy.matrix);
          footN++;
        }
        if (footAo.count !== footN) footAo.count = footN;
        footAo.instanceMatrix.needsUpdate = true;
        footAo.visible = footN > 0;
        // Cool fill stays opposite the key so wall backs do not go flat black.
        fill.position.set(-sun.x * 26 + focusX, 9, -sun.z * 26 + focusZ);
        // Warm pad bounce follows the work point; still no shadow map.
        bounce.position.set(focusX + 5, 1.4, focusZ + 6);
        rim.position.set(sun.x * 18 + focusX, 2.6, sun.z * 18 + focusZ);
        rim.target.position.set(focusX, 1.5, focusZ);
        rim.target.updateMatrixWorld();
        renderer.render(scene, camera);
        threeRef.current!.anim = requestAnimationFrame(tick);
      };
      tick();
      setReady(true);
      setError(null);

      return () => {
        // Mark disposed and cancel RAF before teardown so a route change
        // cannot render into a context that is already going away.
        disposed = true;
        cancelAnimationFrame(threeRef.current?.anim ?? 0);
        try {
          window.removeEventListener("resize", onResize);
          resizeObserver.disconnect();
          const ghost = threeRef.current?.ghost;
          if (ghost) {
            partsRoot.remove(ghost);
            disposeObjectResources(ghost, true);
          }
          for (const child of [...partsRoot.children]) {
            disposeLockBadge(child);
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
          cirrusGeo.dispose();
          cirrusMat.dispose();
          cirrusMap?.dispose();
          ringMat.dispose();
          for (const geo of ringGeos) geo.dispose();
          contactAo.geometry.dispose();
          aoMat.dispose();
          aoMap?.dispose();
          padCast.geometry.dispose();
          padCastMat.dispose();
          padCastMap?.dispose();
          padSeat.geometry.dispose();
          padSeatMat.dispose();
          padSeatMap?.dispose();
          siteShade.geometry.dispose();
          shadeMat.dispose();
          shadeMap?.dispose();
          meadowWash.geometry.dispose();
          meadowMat.dispose();
          meadowMap?.dispose();
          horizonHaze.geometry.dispose();
          hazeMat.dispose();
          hazeMap?.dispose();
          sunHorizon.geometry.dispose();
          sunHorizonMat.dispose();
          sunHorizonMap?.dispose();
          coolHorizon.geometry.dispose();
          coolHorizonMat.dispose();
          coolHorizonMap?.dispose();
          lawnDapple.geometry.dispose();
          lawnDappleMat.dispose();
          lawnDappleMap?.dispose();
          hedgerowGeo.dispose();
          hedgerowMat.dispose();
          hedgerowMap?.dispose();
          footAo.geometry.dispose();
          footAoMat.dispose();
          footAoMap?.dispose();
          footAo.dispose();
          disposeCatalogMaterials(mats);
          sky.geometry.dispose();
          sky.material.dispose();
          controls.dispose();
          selectionHelper.dispose();
          renderer.dispose();
          if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
        } catch {
          // WebGL dispose can throw if the context was already lost on navigation.
        }
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
    const finish: DoorFinish = kind === "door" ? doorFinishRef.current : "timber";
    const roofCover: RoofFinish = kind === "roof" ? roofFinishRef.current : "clay";
    const wallCover: WallFinish = kind === "wall" ? wallFinishRef.current : "plaster";
    const columnCover: ColumnFinish = kind === "column" ? columnFinishRef.current : "plaster";
    const stairsCover: StairsFinish = kind === "stairs" ? stairsFinishRef.current : "timber";
    const railingCover: RailingFinish = kind === "railing" ? railingFinishRef.current : "timber";
    const windowCover: WindowFinish = kind === "window" ? windowFinishRef.current : "timber";
    const floorCover: FloorFinish = kind === "floor" ? floorFinishRef.current : "timber";
    const fenceCover: FenceFinish = kind === "fence" ? fenceFinishRef.current : "timber";
    const pathCover: PathFinish = kind === "path" ? pathFinishRef.current : "gravel";
    const planterCover: PlanterFinish = kind === "planter" ? planterFinishRef.current : "clay";
    const benchCover: BenchFinish = kind === "bench" ? benchFinishRef.current : "timber";
    const chimneyCover: ChimneyFinish = kind === "chimney" ? chimneyFinishRef.current : "brick";
    const lampCover: LampFinish = kind === "lamp" ? lampFinishRef.current : "timber";
    const beamCover: BeamFinish = kind === "beam" ? beamFinishRef.current : "timber";
    const foundationCover: FoundationFinish = kind === "foundation" ? foundationFinishRef.current : "concrete";
    const pergolaCover: PergolaFinish = kind === "pergola" ? pergolaFinishRef.current : "timber";
    obj = createPartMesh(kind, t.mats, finish, roofCover, wallCover, columnCover, stairsCover, railingCover, windowCover, floorCover, fenceCover, pathCover, planterCover, benchCover, chimneyCover, lampCover, beamCover, foundationCover, pergolaCover);
    obj.position.set(x, 0, z);
    obj.userData.finish = finish;
    obj.userData.roofFinish = roofCover;
    obj.userData.wallFinish = wallCover;
    obj.userData.columnFinish = columnCover;
    obj.userData.stairsFinish = stairsCover;
    obj.userData.railingFinish = railingCover;
    obj.userData.windowFinish = windowCover;
    obj.userData.floorFinish = floorCover;
    obj.userData.fenceFinish = fenceCover;
    obj.userData.pathFinish = pathCover;
    obj.userData.planterFinish = planterCover;
    obj.userData.benchFinish = benchCover;
    obj.userData.chimneyFinish = chimneyCover;
    obj.userData.lampFinish = lampCover;
    obj.userData.beamFinish = beamCover;
    obj.userData.foundationFinish = foundationCover;
    obj.userData.pergolaFinish = pergolaCover;
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
    const layerId = activeLayerRef.current || BASE_LAYER_ID;
    const layer = layersRef.current.find((l) => l.id === layerId);
    if (layer && !layer.visible) {
      layersRef.current = layersRef.current.map((l) => (l.id === layerId ? { ...l, visible: true } : l));
      setLayers(layersRef.current);
    }
    obj.userData.layerId = layerId;
    partsRef.current.push({
      id,
      kind,
      position: [x, 0, z],
      rotationY: 0,
      mesh: primary as THREE.Mesh,
      locked: false,
      layerId,
      finish,
      roofFinish: roofCover,
      wallFinish: wallCover,
      columnFinish: columnCover,
      stairsFinish: stairsCover,
      railingFinish: railingCover,
      windowFinish: windowCover,
      floorFinish: floorCover,
      fenceFinish: fenceCover,
      pathFinish: pathCover,
      planterFinish: planterCover,
      benchFinish: benchCover,
      chimneyFinish: chimneyCover,
      lampFinish: lampCover,
      beamFinish: beamCover,
      foundationFinish: foundationCover,
      pergolaFinish: pergolaCover,
    });
    syncLockBadge(obj, !!layersRef.current.find((l) => l.id === layerId)?.locked);
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

  const applyLayerVisibility = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    for (const part of partsRef.current) {
      const layer = layersRef.current.find((l) => l.id === part.layerId);
      const obj = findPartObject(part.id);
      if (!obj) continue;
      obj.visible = layer ? layer.visible : true;
      syncLockBadge(obj, partFrozen(part, layersRef.current));
    }
  }, [findPartObject]);

  const deleteSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    const part = partsRef.current.find((p) => p.id === id);
    if (part && partFrozen(part, layersRef.current)) return;
    const obj = findPartObject(id);
    const t = threeRef.current;
    if (obj && t) {
      disposeLockBadge(obj);
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
    // A pointer already owns this part. Yawing before the drag threshold makes the grab offset stale.
    if (paletteDragRef.current || draggingRef.current || dragArmRef.current) return;
    const id = selectedRef.current;
    if (!id) return;
    const part0 = partsRef.current.find((p) => p.id === id);
    if (part0 && partFrozen(part0, layersRef.current)) return;
    const obj = findPartObject(id);
    if (!obj) return;
    const norm = ((step % 4) + 4) % 4;
    obj.rotation.y = norm * (Math.PI / 2);
    const part = partsRef.current.find((p) => p.id === id);
    if (part) part.rotationY = obj.rotation.y;
    setSelectedRot(norm);
  }, [findPartObject]);

  const rotateSelected = useCallback(() => {
    if (paletteDragRef.current || draggingRef.current || dragArmRef.current) return;
    const id = selectedRef.current;
    if (!id) return;
    const part0 = partsRef.current.find((p) => p.id === id);
    if (part0 && partFrozen(part0, layersRef.current)) return;
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
    // Arm phase still holds the pointerdown offset. Nudging first jumps the part when the drag starts.
    if (paletteDragRef.current || draggingRef.current || dragArmRef.current) return;
    const id = selectedRef.current;
    if (!id) return;
    const part0 = partsRef.current.find((p) => p.id === id);
    if (part0 && partFrozen(part0, layersRef.current)) return;
    const obj = findPartObject(id);
    if (!obj) return;
    const [x, z] = clampToSite(snap(obj.position.x + dx), snap(obj.position.z + dz));
    obj.position.x = x;
    obj.position.z = z;
    const part = partsRef.current.find((p) => p.id === id);
    if (part) part.position = [x, obj.position.y, z];
    setSelectedPos([x, z]);
  }, [findPartObject]);

  const duplicateSelected = useCallback(() => {
    if (paletteDragRef.current || draggingRef.current || dragArmRef.current) return;
    const id = selectedRef.current;
    if (!id) return;
    const part = partsRef.current.find((p) => p.id === id);
    const obj = findPartObject(id);
    const t = threeRef.current;
    if (!part || !obj || !t) return;
    // A fixed +0.5 m world-X step leaves a 3 m wall inside its twin, so the clone cannot be picked.
    // Measure the unrotated span, step along the part yaw, then snap back onto the pad.
    const yaw = obj.rotation.y;
    obj.rotation.y = 0;
    obj.updateMatrixWorld(true);
    const spanBox = new THREE.Box3();
    boxWithoutBadge(obj, spanBox);
    obj.rotation.y = yaw;
    obj.updateMatrixWorld(true);
    const span = Math.max(GRID, snap(spanBox.max.x - spanBox.min.x));
    const originX = snap(obj.position.x);
    const originZ = snap(obj.position.z);
    // Rim clamp can pull a +span step back onto the source, stacking an unselectable twin.
    // Try the part heading, then the other three, and skip the clone if none clears the cell.
    let x = originX;
    let z = originZ;
    let cleared = false;
    for (let turn = 0; turn < 4 && !cleared; turn++) {
      const heading = yaw + turn * (Math.PI / 2);
      for (const dist of [span, span + GRID]) {
        const nx = snap(obj.position.x + Math.cos(heading) * dist);
        const nz = snap(obj.position.z - Math.sin(heading) * dist);
        const [cx, cz] = clampToSite(nx, nz);
        if (cx !== originX || cz !== originZ) {
          x = cx;
          z = cz;
          cleared = true;
          break;
        }
      }
    }
    if (!cleared) return;
    const finish = doorFinishOf(part);
    const roofCover = roofFinishOf(part);
    const wallCover = wallFinishOf(part);
    const columnCover = columnFinishOf(part);
    const stairsCover = stairsFinishOf(part);
    const railingCover = railingFinishOf(part);
    const windowCover = windowFinishOf(part);
    const floorCover = floorFinishOf(part);
    const fenceCover = fenceFinishOf(part);
    const pathCover = pathFinishOf(part);
    const planterCover = planterFinishOf(part);
    const benchCover = benchFinishOf(part);
    const chimneyCover = chimneyFinishOf(part);
    const lampCover = lampFinishOf(part);
    const beamCover = beamFinishOf(part);
    const foundationCover = foundationFinishOf(part);
    const pergolaCover = pergolaFinishOf(part);
    const clone = createPartMesh(part.kind, t.mats, finish, roofCover, wallCover, columnCover, stairsCover, railingCover, windowCover, floorCover, fenceCover, pathCover, planterCover, benchCover, chimneyCover, lampCover, beamCover, foundationCover, pergolaCover);
    clone.position.set(x, 0, z);
    clone.rotation.y = obj.rotation.y;
    clone.userData.finish = finish;
    clone.userData.roofFinish = roofCover;
    clone.userData.wallFinish = wallCover;
    clone.userData.columnFinish = columnCover;
    clone.userData.stairsFinish = stairsCover;
    clone.userData.railingFinish = railingCover;
    clone.userData.windowFinish = windowCover;
    clone.userData.floorFinish = floorCover;
    clone.userData.fenceFinish = fenceCover;
    clone.userData.pathFinish = pathCover;
    clone.userData.planterFinish = planterCover;
    clone.userData.benchFinish = benchCover;
    clone.userData.chimneyFinish = chimneyCover;
    clone.userData.lampFinish = lampCover;
    clone.userData.beamFinish = beamCover;
    clone.userData.foundationFinish = foundationCover;
    clone.userData.pergolaFinish = pergolaCover;
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
    clone.userData.layerId = part.layerId;
    const layer = layersRef.current.find((l) => l.id === part.layerId);
    // Hidden layers must not leak a visible twin. placeAt unhides; duplicate must not.
    clone.visible = layer ? layer.visible : obj.visible;
    partsRef.current.push({
      id: nid,
      kind: part.kind,
      position: [x, 0, z],
      rotationY: obj.rotation.y,
      mesh: primary as THREE.Mesh,
      locked: false,
      layerId: part.layerId,
      finish,
      roofFinish: roofCover,
      wallFinish: wallCover,
      columnFinish: columnCover,
      stairsFinish: stairsCover,
      railingFinish: railingCover,
      windowFinish: windowCover,
      floorFinish: floorCover,
      fenceFinish: fenceCover,
      pathFinish: pathCover,
      planterFinish: planterCover,
      benchFinish: benchCover,
      chimneyFinish: chimneyCover,
      lampFinish: lampCover,
      beamFinish: beamCover,
      foundationFinish: foundationCover,
      pergolaFinish: pergolaCover,
    });
    syncLockBadge(clone, !!layersRef.current.find((l) => l.id === part.layerId)?.locked);
    setCount(partsRef.current.length);
    selectedRef.current = nid;
    setSelectedId(nid);
    setSelectedRot(((Math.round(obj.rotation.y / (Math.PI / 2)) % 4) + 4) % 4);
    setSelectedPos([x, z]);
  }, [findPartObject]);

  const toggleLockSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    const part = partsRef.current.find((p) => p.id === id);
    if (!part) return;
    part.locked = !part.locked;
    const obj = findPartObject(id);
    if (obj) syncLockBadge(obj, partFrozen(part, layersRef.current));
    setLockRev((n) => n + 1);
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
    const prevId = selectedRef.current;
    const kept: ScenePart[] = [];
    for (const p of [...partsRef.current]) {
      if (partFrozen(p, layersRef.current)) {
        kept.push(p);
        continue;
      }
      const obj = findPartObject(p.id);
      if (obj) {
        disposeLockBadge(obj);
        t.partsRoot.remove(obj);
        disposeObjectResources(obj, false);
      }
    }
    partsRef.current = kept;
    // Locked parts survive Clear. Dropping their highlight looked like they vanished.
    const still = prevId && kept.some((p) => p.id === prevId) ? prevId : null;
    selectedRef.current = still;
    setSelectedId(still);
    if (still) {
      const part = kept.find((p) => p.id === still);
      setSelectedRot(part ? ((Math.round(part.rotationY / (Math.PI / 2)) % 4) + 4) % 4 : 0);
      setSelectedPos(part ? [part.position[0], part.position[2]] : null);
    } else {
      setSelectedRot(0);
      setSelectedPos(null);
      t.selectionHelper.visible = false;
    }
    setCount(partsRef.current.length);
    // A ground click arms a place and disables orbit before any part exists.
    // Clear must cancel that gesture, or pointerup spawns a piece and orbit stays locked.
    const dragId = draggingRef.current?.id ?? dragArmRef.current?.id;
    const dragKept = !!dragId && kept.some((p) => p.id === dragId);
    if (!dragKept) {
      draggingRef.current = null;
      dragArmRef.current = null;
      pendingPlaceRef.current = false;
      if (!paletteDragRef.current) {
        gesturePointerRef.current = null;
        t.controls.enabled = true;
        if (t.ghost) t.ghost.visible = true;
      }
    }
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
      moveChipPosRef.current = { x: 0, y: 0, text: "" };
      setMoveChip(null);
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
      let point = worldPointFromEvent(ev.clientX, ev.clientY);
      // Ground mesh miss (sky / past the disc) used to freeze an in-progress drag.
      if (!point && draggingRef.current) point = pointOnSitePlane(t.raycaster);
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
        const dragId = draggingRef.current.id;
        const part = partsRef.current.find((p) => p.id === dragId);
        if (part && partFrozen(part, layersRef.current)) {
          draggingRef.current = null;
          dragArmRef.current = null;
          moveChipPosRef.current = { x: 0, y: 0, text: "" };
          setMoveChip(null);
        } else {
          const obj = findPartObject(dragId);
          if (obj && part) {
            const [nx, nz] = clampToSite(
              snap(point.x - draggingRef.current.offset.x),
              snap(point.z - draggingRef.current.offset.z),
            );
            obj.position.x = nx;
            obj.position.z = nz;
            part.position = [nx, 0, obj.position.z];
            const names = moveLabelRef.current;
            const text = `${names.moving} · ${names.kinds[part.kind] ?? part.kind} · X ${nx.toFixed(1)} Z ${nz.toFixed(1)}`;
            const prev = moveChipPosRef.current;
            if (prev.text !== text || Math.abs(prev.x - ev.clientX) >= 10 || Math.abs(prev.y - ev.clientY) >= 10) {
              moveChipPosRef.current = { x: ev.clientX, y: ev.clientY, text };
              setMoveChip({ x: ev.clientX, y: ev.clientY, text });
            }
          }
        }
      }
    };

    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;

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
      // Ground hit is optional: a roof/chimney against the sky still has to select.
      const point = worldPointFromEvent(ev.clientX, ev.clientY) ?? pointOnSitePlane(t.raycaster);
      const meshes: THREE.Object3D[] = [];
      t.partsRoot.traverse((c) => {
        if (c instanceof THREE.Mesh && c.userData.partId && c.visible) {
          let shown = true;
          let node: THREE.Object3D | null = c;
          while (node) {
            if (!node.visible) { shown = false; break; }
            node = node.parent;
          }
          if (shown) meshes.push(c);
        }
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
        const frozen = picked ? partFrozen(picked, layersRef.current) : false;
        // A locked pick must not fall through to OrbitControls or a ground place.
        if (frozen) {
          dragArmRef.current = null;
          draggingRef.current = null;
          pendingPlaceRef.current = false;
          gesturePointerRef.current = ev.pointerId;
          if (lockHintTimer.current != null) window.clearTimeout(lockHintTimer.current);
          setLockHint({ x: ev.clientX, y: ev.clientY });
          lockHintTimer.current = window.setTimeout(() => {
            setLockHint(null);
            lockHintTimer.current = null;
          }, 1400);
          ev.stopImmediatePropagation();
          ev.preventDefault();
          return;
        }
        if (obj && !frozen) {
          // Arm only when we have a pad/site anchor. A pure sky click still selects
          // and must not yaw the camera, but it cannot snap-drag.
          if (point) {
            dragArmRef.current = {
              id,
              offset: new THREE.Vector3(point.x - obj.position.x, 0, point.z - obj.position.z),
              x: ev.clientX,
              y: ev.clientY,
            };
          } else {
            dragArmRef.current = null;
          }
          draggingRef.current = null;
          gesturePointerRef.current = ev.pointerId;
          t.controls.enabled = false;
          pendingPlaceRef.current = false;
          ev.stopImmediatePropagation();
          ev.preventDefault();
        }
        return;
      }

      // A sky miss must not place. Only a real pad hit arms a ground place.
      const padPoint = worldPointFromEvent(ev.clientX, ev.clientY);
      if (!padPoint) return;
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
      moveChipPosRef.current = { x: 0, y: 0, text: "" };
      setMoveChip(null);
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
      // Do not swallow browser chords (Ctrl/Cmd+R reload, Ctrl/Cmd+F find, Alt+arrows).
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const selId = selectedRef.current;
      const selPart = selId ? partsRef.current.find((part) => part.id === selId) : undefined;
      const canMutate = !!selPart && !partFrozen(selPart, layersRef.current);
      // Backspace/arrows must not be swallowed when nothing can move — that blocked history and page scroll.
      if (e.key === "Delete" || e.key === "Backspace") {
        if (!canMutate) return;
        e.preventDefault();
        deleteSelected();
      }
      if (e.key.toLowerCase() === "r") {
        if (!canMutate || paletteDragRef.current || draggingRef.current || dragArmRef.current) return;
        e.preventDefault();
        rotateSelected();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (!canMutate || paletteDragRef.current || draggingRef.current || dragArmRef.current) return;
        e.preventDefault();
        if (e.key === "ArrowLeft") nudgeSelected(-GRID, 0);
        else if (e.key === "ArrowRight") nudgeSelected(GRID, 0);
        else if (e.key === "ArrowUp") nudgeSelected(0, -GRID);
        else nudgeSelected(0, GRID);
      }
      // A palette/ground place commits on pointerup with toolRef. Switching tools mid-gesture
      // placed a different kind than the ghost the pointer was showing.
      const gestureLive = !!(
        paletteDragRef.current ||
        pendingPlaceRef.current ||
        draggingRef.current ||
        dragArmRef.current
      );
      if (!gestureLive) {
        if (e.key === "1") setTool("wall");
        if (e.key === "2") setTool("floor");
        if (e.key === "3") setTool("roof");
        if (e.key === "4") setTool("column");
        if (e.key === "5") setTool("door");
        if (e.key === "6") setTool("window");
        if (e.key === "7") setTool("stairs");
        if (e.key === "8") setTool("railing");
        if (e.key === "9") setTool("chimney");
        if (e.key === "0") setTool("beam");
        if (e.key.toLowerCase() === "q") setTool("foundation");
        if (e.key.toLowerCase() === "w") setTool("pergola");
        if (e.key.toLowerCase() === "e") setTool("fence");
        if (e.key.toLowerCase() === "t") setTool("path");
        if (e.key.toLowerCase() === "y") setTool("planter");
        if (e.key.toLowerCase() === "u") setTool("bench");
        if (e.key.toLowerCase() === "i") setTool("lamp");
      }
      if (e.key.toLowerCase() === "l" && !e.repeat) {
        if (!selId) return;
        e.preventDefault();
        toggleLockSelected();
      }
      if (e.key.toLowerCase() === "d" && !e.repeat) {
        // Duplicate mid-arm switched selection under the pointer and left the grab on the old id.
        if (!selPart || paletteDragRef.current || draggingRef.current || dragArmRef.current) return;
        e.preventDefault();
        duplicateSelected();
      }
      if (e.key.toLowerCase() === "g" && !e.repeat) {
        if (!selId) return;
        e.preventDefault();
        frameSelected();
      }
      if (e.key.toLowerCase() === "f" && !e.repeat) {
        e.preventDefault();
        void toggleFullscreen();
      }
      if (e.key === "Escape") {
        if (paletteDragRef.current || pendingPlaceRef.current || draggingRef.current || dragArmRef.current) {
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
          moveChipPosRef.current = { x: 0, y: 0, text: "" };
          setMoveChip(null);
          setLockHint(null);
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
      } else if (e.key.toLowerCase() === "c" && !e.repeat) {
        e.preventDefault();
        clearAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, rotateSelected, nudgeSelected, duplicateSelected, frameSelected, toggleFullscreen, clearAll, toggleLockSelected]);

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
    makeGhost(kind, doorFinishRef.current, roofFinishRef.current, wallFinishRef.current, columnFinishRef.current, stairsFinishRef.current, railingFinishRef.current, windowFinishRef.current, floorFinishRef.current, fenceFinishRef.current, pathFinishRef.current, planterFinishRef.current, benchFinishRef.current, chimneyFinishRef.current, lampFinishRef.current, beamFinishRef.current, foundationFinishRef.current, pergolaFinishRef.current);
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
        beam: "Viga",
        foundation: "Cimentación",
        pergola: "Pérgola",
        fence: "Valla",
        path: "Sendero",
        planter: "Jardinera",
        bench: "Banco",
        lamp: "Farol",
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
        tip: "Atajos: 1 pared · 2 piso · 3 techo · 4 pilar · 5 puerta · 6 ventana · 7 escalera · 8 baranda · 9 chimenea · 0 viga · Q cimentación · W pérgola · E valla · T sendero · Y jardinera · U banco · I farol · R rotar · L bloqueo · D duplicar · G encuadrar · flechas mueven 0,5 m · Supr borrar · C limpiar · F pantalla completa · Esc cancelar",
        palette: "Estructuras",
        dragHint: "Arrastrá al terreno",
        variants: "Acabado activo",
        none: "Nada seleccionado",
        armed: "Listo para colocar",
        selected: "Seleccionado",
        drop: "Soltá sobre el terreno para colocar",
        moving: "Moviendo",
        dropOver: "Sobre el terreno",
        dropOut: "Fuera del terreno — no se coloca",
        needSel: "Seleccioná una pieza primero",
        rotDeg: "giro",
        sizeWall: "3.0 × 2.6 m",
        sizeFloor: "3.0 × 3.0 m",
        sizeRoof: "3.2 m de ancho",
        sizeColumn: "0.4 × 2.6 m",
        sizeDoor: "0.96 × 2.1 m",
        doorFinish: "Acabado de puerta",
        doorTimber: "Madera",
        doorMetal: "Chapa",
        doorTimberShort: "Madera",
        doorMetalShort: "Chapa",
        roofFinish: "Cubierta",
        wallFinish: "Acabado de muro",
        wallPlaster: "Revoco",
        wallMasonry: "Mampostería",
        wallTimber: "Madera",
        wallPlasterShort: "Revoco",
        wallMasonryShort: "Sillar",
        wallTimberShort: "Madera",
        columnFinish: "Acabado de columna",
        columnPlaster: "Revoco",
        columnMasonry: "Mampostería",
        columnPlasterShort: "Revoco",
        columnMasonryShort: "Sillar",
        columnTimber: "Madera",
        columnTimberShort: "Madera",
        stairsFinish: "Acabado de escalera",
        stairsTimber: "Madera",
        stairsMasonry: "Sillar",
        stairsMetal: "Hierro",
        stairsTimberShort: "Madera",
        stairsMasonryShort: "Sillar",
        stairsMetalShort: "Hierro",
        railingFinish: "Acabado de baranda",
        railingTimber: "Madera",
        railingMetal: "Hierro forjado",
        railingTimberShort: "Madera",
        railingMetalShort: "Hierro",
        windowFinish: "Acabado de ventana",
        windowTimber: "Madera",
        windowMetal: "Marco de hierro",
        windowTimberShort: "Madera",
        windowMetalShort: "Hierro",
        floorFinish: "Acabado de piso",
        floorTimber: "Tablas",
        floorClay: "Baldosa de barro",
        floorTimberShort: "Tablas",
        floorClayShort: "Barro",
        fenceFinish: "Acabado de valla",
        fenceTimber: "Listones",
        fenceMetal: "Hierro",
        fenceTimberShort: "Listones",
        fenceMetalShort: "Hierro",
        pathFinish: "Acabado de sendero",
        pathGravel: "Grava",
        pathClay: "Baldosa",
        pathGravelShort: "Grava",
        pathClayShort: "Baldosa",
        planterFinish: "Cuerpo de jardinera",
        planterClay: "Terracota",
        planterTimber: "Madera",
        planterClayShort: "Barro",
        planterTimberShort: "Madera",
        benchFinish: "Asiento",
        lampFinish: "Poste del farol",
        lampTimber: "Madera",
        lampMetal: "Hierro",
        lampTimberShort: "Madera",
        lampMetalShort: "Hierro",
        beamFinish: "Acabado de viga",
        beamTimber: "Madera",
        beamMetal: "Hierro",
        beamTimberShort: "Madera",
        beamMetalShort: "Hierro",
        foundationFinish: "Acabado de cimentación",
        foundationConcrete: "Hormigón",
        foundationStone: "Piedra",
        foundationConcreteShort: "Hormigón",
        foundationStoneShort: "Piedra",
        benchTimber: "Madera",
        benchMasonry: "Sillería",
        benchTimberShort: "Madera",
        benchMasonryShort: "Piedra",
        chimneyFinish: "Fuste de chimenea",
        chimneyBrick: "Ladrillo",
        chimneyMasonry: "Sillería",
        chimneyBrickShort: "Ladrillo",
        chimneyMasonryShort: "Sillar",
        roofClay: "Teja",
        roofMetal: "Chapa de zinc",
        roofClayShort: "Teja",
        roofMetalShort: "Zinc",
        sizeWindow: "1.2 × 1.15 m",
        sizeStairs: "1.0 m · subida 1.02 m",
        sizeRailing: "1.8 × 0.95 m",
        sizeChimney: "0.8 × 3.2 m",
        sizeBeam: "2.5 × 2.7 m",
        sizeFoundation: "3.0 × 0.55 × 0.4 m",
        sizePergola: "2.4 × 2.2 × 2.4 m",
        sizeFence: "2.4 × 1.2 m",
        sizePath: "3.6 × 1.2 m",
        sizePlanter: "1.4 × 0.7 m",
        sizeBench: "1.6 × 0.55 m",
        sizeLamp: "0.4 × 1.8 m",
        help: "Ayuda",
        hideHelp: "Ocultar",
        active: "Activa",
        inspector: "Pieza seleccionada",
        deselect: "Deseleccionar",
        snap: "Grilla 0,5 m",
        touchPad: "Ajuste táctil",
        tapRotate: "Giro en el sitio",
        compact: "Iconos",
        expandPalette: "Lista",
        selHint: "R gira · L bloquea · Supr borra",
        selectedMark: "Pieza",
        lock: "Bloquear",
        unlock: "Desbloquear",
        locked: "Bloqueada",
        lockedDrag: "Bloqueada — L desbloquea",
        lockedAction: "Pieza bloqueada — L desbloquea",
        layers: "Capas",
        layer: "Capa",
        activeLayer: "Activa",
        showLayer: "Mostrar",
        hideLayer: "Ocultar",
        lockLayer: "Bloquear capa",
        unlockLayer: "Desbloquear capa",
        addLayer: "Nueva capa",
        renameLayer: "Nombre de capa",
        removeLayer: "Quitar capa",
        partLayer: "Capa de la pieza",
        layerHidden: "oculta",
        layerLocked: "bloqueada",
        orient: "Orientación",
        yawHint: "Toque para fijar el giro",
        nudge: "Mover 0,5 m",
        nudgeXP: "Mover +X",
        nudgeXN: "Mover −X",
        nudgeZP: "Mover +Z",
        nudgeZN: "Mover −Z",
        fsBar: "Acciones en pantalla completa",
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
        beam: "Beam",
        foundation: "Foundation",
        pergola: "Pergola",
        fence: "Fence",
        path: "Path",
        planter: "Planter",
        bench: "Bench",
        lamp: "Lamp",
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
        tip: "Shortcuts: 1 wall · 2 floor · 3 roof · 4 column · 5 door · 6 window · 7 stairs · 8 railing · 9 chimney · 0 beam · Q foundation · W pergola · E fence · T path · Y planter · U bench · I lamp · R rotate · L lock · D duplicate · G frame · arrows nudge 0.5 m · Del delete · C clear · F fullscreen · Esc cancel",
        palette: "Structures",
        dragHint: "Drag to ground",
        variants: "Active finish",
        none: "Nothing selected",
        armed: "Ready to place",
        selected: "Selected",
        drop: "Release over the ground to place",
        moving: "Moving",
        dropOver: "Over the ground",
        dropOut: "Outside the ground — won't place",
        needSel: "Select a part first",
        rotDeg: "yaw",
        sizeWall: "3.0 × 2.6 m",
        sizeFloor: "3.0 × 3.0 m",
        sizeRoof: "3.2 m wide",
        sizeColumn: "0.4 × 2.6 m",
        sizeDoor: "0.96 × 2.1 m",
        doorFinish: "Door finish",
        doorTimber: "Timber",
        doorMetal: "Sheet metal",
        doorTimberShort: "Timber",
        doorMetalShort: "Metal",
        roofFinish: "Roof covering",
        wallFinish: "Wall finish",
        wallPlaster: "Plaster",
        wallMasonry: "Masonry",
        wallTimber: "Timber",
        wallPlasterShort: "Plaster",
        wallMasonryShort: "Ashlar",
        wallTimberShort: "Timber",
        columnFinish: "Column finish",
        columnPlaster: "Plaster",
        columnMasonry: "Masonry",
        columnPlasterShort: "Plaster",
        columnMasonryShort: "Ashlar",
        columnTimber: "Timber",
        columnTimberShort: "Timber",
        stairsFinish: "Stair finish",
        stairsTimber: "Timber",
        stairsMasonry: "Ashlar",
        stairsMetal: "Iron",
        stairsTimberShort: "Timber",
        stairsMasonryShort: "Ashlar",
        stairsMetalShort: "Iron",
        railingFinish: "Railing finish",
        railingTimber: "Timber",
        railingMetal: "Wrought iron",
        railingTimberShort: "Timber",
        railingMetalShort: "Iron",
        windowFinish: "Window finish",
        windowTimber: "Timber",
        windowMetal: "Iron frame",
        windowTimberShort: "Timber",
        windowMetalShort: "Iron",
        floorFinish: "Floor finish",
        floorTimber: "Boards",
        floorClay: "Clay tile",
        floorTimberShort: "Boards",
        floorClayShort: "Clay",
        fenceFinish: "Fence finish",
        fenceTimber: "Pickets",
        fenceMetal: "Iron pickets",
        fenceTimberShort: "Pickets",
        fenceMetalShort: "Iron",
        pathFinish: "Path finish",
        pathGravel: "Gravel",
        pathClay: "Clay tile",
        pathGravelShort: "Gravel",
        pathClayShort: "Clay",
        planterFinish: "Planter body",
        planterClay: "Terracotta",
        planterTimber: "Timber",
        planterClayShort: "Clay",
        planterTimberShort: "Timber",
        benchFinish: "Seat",
        lampFinish: "Lamp post",
        lampTimber: "Timber",
        lampMetal: "Iron",
        lampTimberShort: "Timber",
        lampMetalShort: "Iron",
        beamFinish: "Beam finish",
        beamTimber: "Timber",
        beamMetal: "Iron",
        beamTimberShort: "Timber",
        beamMetalShort: "Iron",
        foundationFinish: "Foundation finish",
        foundationConcrete: "Concrete",
        foundationStone: "Stone",
        foundationConcreteShort: "Concrete",
        foundationStoneShort: "Stone",
        benchTimber: "Timber",
        benchMasonry: "Ashlar",
        benchTimberShort: "Timber",
        benchMasonryShort: "Stone",
        chimneyFinish: "Chimney shaft",
        chimneyBrick: "Brick",
        chimneyMasonry: "Ashlar",
        chimneyBrickShort: "Brick",
        chimneyMasonryShort: "Ashlar",
        roofClay: "Clay tile",
        roofMetal: "Standing seam",
        roofClayShort: "Clay",
        roofMetalShort: "Seam",
        sizeWindow: "1.2 × 1.15 m",
        sizeStairs: "1.0 m wide · 1.02 m rise",
        sizeRailing: "1.8 × 0.95 m",
        sizeChimney: "0.8 × 3.2 m",
        sizeBeam: "2.5 × 2.7 m",
        sizeFoundation: "3.0 × 0.55 × 0.4 m",
        sizePergola: "2.4 × 2.2 × 2.4 m",
        sizeFence: "2.4 × 1.2 m",
        sizePath: "3.6 × 1.2 m",
        sizePlanter: "1.4 × 0.7 m",
        sizeBench: "1.6 × 0.55 m",
        sizeLamp: "0.4 × 1.8 m",
        help: "Help",
        hideHelp: "Hide",
        active: "Active",
        inspector: "Selected part",
        deselect: "Deselect",
        snap: "0.5 m snap",
        touchPad: "Touch adjust",
        tapRotate: "Yaw in place",
        compact: "Icons",
        expandPalette: "List",
        selHint: "R rotate · L lock · Del delete",
        selectedMark: "Sel",
        lock: "Lock",
        unlock: "Unlock",
        locked: "Locked",
        lockedDrag: "Locked — L unlocks",
        lockedAction: "Locked piece — L unlocks",
        layers: "Layers",
        layer: "Layer",
        activeLayer: "Active",
        showLayer: "Show",
        hideLayer: "Hide",
        lockLayer: "Lock layer",
        unlockLayer: "Unlock layer",
        addLayer: "New layer",
        renameLayer: "Layer name",
        removeLayer: "Remove layer",
        partLayer: "Part layer",
        layerHidden: "hidden",
        layerLocked: "locked",
        orient: "Orientation",
        yawHint: "Tap to set the yaw",
        nudge: "Nudge 0.5 m",
        nudgeXP: "Move +X",
        nudgeXN: "Move −X",
        nudgeZP: "Move +Z",
        nudgeZN: "Move −Z",
        fsBar: "Fullscreen actions",
      };

  const selectedPart = partsRef.current.find((p) => p.id === selectedId);
  const selectedKind = selectedPart?.kind;
  const selectedDoorFinish = doorFinishOf(selectedPart, doorFinish);
  const selectedRoofFinish = roofFinishOf(selectedPart, roofFinish);
  const selectedWallFinish = wallFinishOf(selectedPart, wallFinish);
  const selectedColumnFinish = columnFinishOf(selectedPart, columnFinish);
  const selectedStairsFinish = stairsFinishOf(selectedPart, stairsFinish);
  const selectedRailingFinish = railingFinishOf(selectedPart, railingFinish);
  const selectedWindowFinish = windowFinishOf(selectedPart, windowFinish);
  const selectedFloorFinish = floorFinishOf(selectedPart, floorFinish);
  const selectedFenceFinish = fenceFinishOf(selectedPart, fenceFinish);
  const selectedPathFinish = pathFinishOf(selectedPart, pathFinish);
  const selectedPlanterFinish = planterFinishOf(selectedPart, planterFinish);
  const selectedBenchFinish = benchFinishOf(selectedPart, benchFinish);
  const selectedLampFinish = lampFinishOf(selectedPart, lampFinish);
  const selectedBeamFinish = beamFinishOf(selectedPart, beamFinish);
  const selectedFoundationFinish = foundationFinishOf(selectedPart, foundationFinish);
  const selectedPergolaFinish = pergolaFinishOf(selectedPart, pergolaFinish);
  const selectedChimneyFinish = chimneyFinishOf(selectedPart, chimneyFinish);
  void finishRev;
  const selectedLocked = selectedPart ? partFrozen(selectedPart, layers) : false;
  void lockRev;
  const selectedKindLabel =
    selectedKind === "wall" ? labels.wall : selectedKind === "floor" ? labels.floor : selectedKind === "roof" ? labels.roof : selectedKind === "column" ? labels.column : selectedKind === "door" ? labels.door : selectedKind === "window" ? labels.window : selectedKind === "stairs" ? labels.stairs : selectedKind === "railing" ? labels.railing : selectedKind === "chimney" ? labels.chimney : selectedKind === "beam" ? labels.beam : selectedKind === "foundation" ? labels.foundation : selectedKind === "pergola" ? labels.pergola : selectedKind === "fence" ? labels.fence : selectedKind === "path" ? labels.path : selectedKind === "planter" ? labels.planter : selectedKind === "bench" ? labels.bench : selectedKind === "lamp" ? labels.lamp : "";
  const selectedLayer = layers.find((l) => l.id === selectedPart?.layerId);
  const activeLayer = layers.find((l) => l.id === activeLayerId) ?? layers[0];
  const layerCaption = (layer: SceneLayer | undefined) => {
    if (!layer) return "";
    const flags = [!layer.visible ? labels.layerHidden : "", layer.locked ? labels.layerLocked : ""].filter(Boolean);
    return flags.length ? `${layer.name} (${flags.join(", ")})` : layer.name;
  };
  const placeLayerCaption = layerCaption(selectedKindLabel ? selectedLayer : activeLayer);
  const selectedSize =
    selectedKind === "wall" ? labels.sizeWall : selectedKind === "floor" ? labels.sizeFloor : selectedKind === "roof" ? labels.sizeRoof : selectedKind === "column" ? labels.sizeColumn : selectedKind === "door" ? labels.sizeDoor : selectedKind === "window" ? labels.sizeWindow : selectedKind === "stairs" ? labels.sizeStairs : selectedKind === "railing" ? labels.sizeRailing : selectedKind === "chimney" ? labels.sizeChimney : selectedKind === "beam" ? labels.sizeBeam : selectedKind === "foundation" ? labels.sizeFoundation : selectedKind === "pergola" ? labels.sizePergola : selectedKind === "fence" ? labels.sizeFence : selectedKind === "path" ? labels.sizePath : selectedKind === "planter" ? labels.sizePlanter : selectedKind === "bench" ? labels.sizeBench : selectedKind === "lamp" ? labels.sizeLamp : "";

  const clearSelection = () => {
    selectedRef.current = null;
    setSelectedId(null);
    setSelectedRot(0);
    setSelectedPos(null);
    if (threeRef.current) threeRef.current.selectionHelper.visible = false;
  };

  const chooseDoorFinish = (next: DoorFinish) => {
    doorFinishRef.current = next;
    setDoorFinish(next);
    const id = selectedRef.current;
    const part = partsRef.current.find((p) => p.id === id);
    const t = threeRef.current;
    if (part && part.kind === "door" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyDoorFinish(obj, t.mats, next);
        obj.userData.finish = next;
        part.finish = next;
        setFinishRev((n) => n + 1);
      }
    }
  };

  const chooseRoofFinish = (next: RoofFinish) => {
    roofFinishRef.current = next;
    setRoofFinish(next);
    const id = selectedRef.current;
    const part = partsRef.current.find((p) => p.id === id);
    const t = threeRef.current;
    if (part && part.kind === "roof" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyRoofFinish(obj, t.mats, next);
        obj.userData.roofFinish = next;
        part.roofFinish = next;
        setFinishRev((n) => n + 1);
      }
    }
  };


  const chooseWallFinish = (next: WallFinish) => {
    wallFinishRef.current = next;
    setWallFinish(next);
    const id = selectedRef.current;
    const part = partsRef.current.find((p) => p.id === id);
    const t = threeRef.current;
    if (part && part.kind === "wall" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyWallFinish(obj, t.mats, next);
        obj.userData.wallFinish = next;
        part.wallFinish = next;
        setFinishRev((n) => n + 1);
      }
    }
  };

  const chooseColumnFinish = (next: ColumnFinish) => {
    columnFinishRef.current = next;
    setColumnFinish(next);
    const id = selectedRef.current;
    const part = partsRef.current.find((p) => p.id === id);
    const t = threeRef.current;
    if (part && part.kind === "column" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyColumnFinish(obj, t.mats, next);
        obj.userData.columnFinish = next;
        part.columnFinish = next;
        setFinishRev((n) => n + 1);
      }
    }
  };

  const flashActionHint = (msg: string) => {
    setActionHint(msg);
    if (actionHintTimer.current) window.clearTimeout(actionHintTimer.current);
    actionHintTimer.current = window.setTimeout(() => setActionHint(null), 2400);
  };
  const refuseSelection = (needsUnlock = false) => {
    if (!selectedId) {
      flashActionHint(labels.needSel);
      return true;
    }
    if (needsUnlock && selectedLocked) {
      flashActionHint(labels.lockedAction);
      return true;
    }
    return false;
  };


  const chooseStairsFinish = (next: StairsFinish) => {
    stairsFinishRef.current = next;
    setStairsFinish(next);
    const id = selectedRef.current;
    const part = partsRef.current.find((p) => p.id === id);
    const t = threeRef.current;
    if (part && part.kind === "stairs" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyStairsFinish(obj, t.mats, next);
        obj.userData.stairsFinish = next;
        part.stairsFinish = next;
        setFinishRev((n) => n + 1);
      }
    }
  };

  const chooseRailingFinish = (next: RailingFinish) => {
    railingFinishRef.current = next;
    setRailingFinish(next);
    const id = selectedRef.current;
    const part = partsRef.current.find((p) => p.id === id);
    const t = threeRef.current;
    if (part && part.kind === "railing" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyRailingFinish(obj, t.mats, next);
        obj.userData.railingFinish = next;
        part.railingFinish = next;
        setFinishRev((n) => n + 1);
      }
    }
  };


  const chooseWindowFinish = (next: WindowFinish) => {
    windowFinishRef.current = next;
    setWindowFinish(next);
    const id = selectedRef.current;
    const part = partsRef.current.find((p) => p.id === id);
    const t = threeRef.current;
    if (part && part.kind === "window" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyWindowFinish(obj, t.mats, next);
        obj.userData.windowFinish = next;
        part.windowFinish = next;
        setFinishRev((n) => n + 1);
      }
    }
  };

  const chooseFloorFinish = (next: FloorFinish) => {
    floorFinishRef.current = next;
    setFloorFinish(next);
    const id = selectedRef.current;
    const part = partsRef.current.find((p) => p.id === id);
    const t = threeRef.current;
    if (part && part.kind === "floor" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyFloorFinish(obj, t.mats, next);
        obj.userData.floorFinish = next;
        part.floorFinish = next;
        setFinishRev((n) => n + 1);
      }
    }
  };

  const chooseFenceFinish = (next: FenceFinish) => {
    fenceFinishRef.current = next;
    setFenceFinish(next);
    const id = selectedRef.current;
    const part = partsRef.current.find((p) => p.id === id);
    const t = threeRef.current;
    if (part && part.kind === "fence" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyFenceFinish(obj, t.mats, next);
        obj.userData.fenceFinish = next;
        part.fenceFinish = next;
        setFinishRev((n) => n + 1);
      }
    }
  };

  const choosePlanterFinish = (next: PlanterFinish) => {
    planterFinishRef.current = next;
    setPlanterFinish(next);
    setFinishRev((n) => n + 1);
    const part = partsRef.current.find((p) => p.id === selectedRef.current);
    const t = threeRef.current;
    if (part && part.kind === "planter" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyPlanterFinish(obj, t.mats, next);
        obj.userData.planterFinish = next;
        part.planterFinish = next;
      }
    }
  };

  const chooseBenchFinish = (next: BenchFinish) => {
    benchFinishRef.current = next;
    setBenchFinish(next);
    setFinishRev((n) => n + 1);
    const part = partsRef.current.find((p) => p.id === selectedRef.current);
    const t = threeRef.current;
    if (part && part.kind === "bench" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyBenchFinish(obj, t.mats, next);
        obj.userData.benchFinish = next;
        part.benchFinish = next;
      }
    }
  };

  const chooseLampFinish = (next: LampFinish) => {
    lampFinishRef.current = next;
    setLampFinish(next);
    setFinishRev((n) => n + 1);
    const part = partsRef.current.find((p) => p.id === selectedRef.current);
    const t = threeRef.current;
    if (part && part.kind === "lamp" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyLampFinish(obj, t.mats, next);
        obj.userData.lampFinish = next;
        part.lampFinish = next;
      }
    }
  };

  const chooseBeamFinish = (next: BeamFinish) => {
    beamFinishRef.current = next;
    setBeamFinish(next);
    setFinishRev((n) => n + 1);
    const part = partsRef.current.find((p) => p.id === selectedRef.current);
    const t = threeRef.current;
    if (part && part.kind === "beam" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyBeamFinish(obj, t.mats, next);
        obj.userData.beamFinish = next;
        part.beamFinish = next;
      }
    }
  };

  const chooseFoundationFinish = (next: FoundationFinish) => {
    foundationFinishRef.current = next;
    setFoundationFinish(next);
    setFinishRev((n) => n + 1);
    const part = partsRef.current.find((p) => p.id === selectedRef.current);
    const t = threeRef.current;
    if (part && part.kind === "foundation" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyFoundationFinish(obj, t.mats, next);
        obj.userData.foundationFinish = next;
        part.foundationFinish = next;
      }
    }
  };

  const chooseChimneyFinish = (next: ChimneyFinish) => {
    chimneyFinishRef.current = next;
    setChimneyFinish(next);
    setFinishRev((n) => n + 1);
    const part = partsRef.current.find((p) => p.id === selectedRef.current);
    const t = threeRef.current;
    if (part && part.kind === "chimney" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyChimneyFinish(obj, t.mats, next);
        obj.userData.chimneyFinish = next;
        part.chimneyFinish = next;
      }
    }
  };

  const choosePathFinish = (next: PathFinish) => {
    pathFinishRef.current = next;
    setPathFinish(next);
    const id = selectedRef.current;
    const part = partsRef.current.find((p) => p.id === id);
    const t = threeRef.current;
    if (part && part.kind === "path" && t && !partFrozen(part, layersRef.current)) {
      const obj = findPartObject(part.id);
      if (obj) {
        applyPathFinish(obj, t.mats, next);
        obj.userData.pathFinish = next;
        part.pathFinish = next;
        setFinishRev((n) => n + 1);
      }
    }
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
    { kind: "chimney", label: labels.chimney, swatch: "#8f4a3c", key: "9", size: labels.sizeChimney },
    { kind: "beam", label: labels.beam, swatch: "#6d4a30", key: "0", size: labels.sizeBeam },
    { kind: "foundation", label: labels.foundation, swatch: "#c4b8a4", key: "Q", size: labels.sizeFoundation },
    { kind: "pergola", label: labels.pergola, swatch: "#6d4a30", key: "W", size: labels.sizePergola },
    { kind: "fence", label: labels.fence, swatch: "#8b5a32", key: "E", size: labels.sizeFence },
    { kind: "path", label: labels.path, swatch: "#b7ab9a", key: "T", size: labels.sizePath },
    { kind: "planter", label: labels.planter, swatch: "#8a4e3a", key: "Y", size: labels.sizePlanter },
    { kind: "bench", label: labels.bench, swatch: "#8b5a32", key: "U", size: labels.sizeBench },
    { kind: "lamp", label: labels.lamp, swatch: "#6d4a30", key: "I", size: labels.sizeLamp },
  ];
  const swatchFor = (kind: PartKind): string => {
    if (kind === "wall") {
      const id = selectedKind === "wall" ? selectedWallFinish : wallFinish;
      return id === "masonry" ? "#c4b49a" : "#d8d0c4";
    }
    if (kind === "door") {
      const id = selectedKind === "door" ? selectedDoorFinish : doorFinish;
      return id === "metal" ? "#b7c4cc" : "#8d5c38";
    }
    if (kind === "roof") {
      const id = selectedKind === "roof" ? selectedRoofFinish : roofFinish;
      return id === "metal" ? "#9aa7ae" : "#6b3a2a";
    }
    if (kind === "column") {
      const id = selectedKind === "column" ? selectedColumnFinish : columnFinish;
      return id === "masonry" ? "#c4b49a" : id === "timber" ? "#8b7355" : "#c8bfb0";
    }
    if (kind === "stairs") {
      const id = selectedKind === "stairs" ? selectedStairsFinish : stairsFinish;
      return id === "masonry" ? "#c4b49a" : id === "metal" ? "#8e99a1" : "#8b5a32";
    }
    if (kind === "railing") {
      const id = selectedKind === "railing" ? selectedRailingFinish : railingFinish;
      return id === "metal" ? "#6e767c" : "#6d4a30";
    }
    if (kind === "window") {
      const id = selectedKind === "window" ? selectedWindowFinish : windowFinish;
      return id === "metal" ? "#6e767c" : "#d9d0c0";
    }
    if (kind === "bench") {
      const id = selectedKind === "bench" ? selectedBenchFinish : benchFinish;
      return id === "masonry" ? "#c4b49a" : "#8b5a32";
    }
    if (kind === "lamp") {
      const id = selectedKind === "lamp" ? selectedLampFinish : lampFinish;
      return id === "metal" ? "#5c6670" : "#6d4a30";
    }
    if (kind === "chimney") {
      const id = selectedKind === "chimney" ? selectedChimneyFinish : chimneyFinish;
      return id === "masonry" ? "#c4b49a" : "#8f4a3c";
    }
    return paletteItems.find((item) => item.kind === kind)?.swatch ?? "#d8d0c4";
  };
  /** Both looks for kinds that have a selectable finish. Active chip is first flag. */
  const variantPair = (kind: PartKind): { color: string; on: boolean }[] | null => {
    if (kind === "wall") {
      const id = selectedKind === "wall" ? selectedWallFinish : wallFinish;
      return [{ color: "#d8d0c4", on: id !== "masonry" }, { color: "#c4b49a", on: id === "masonry" }];
    }
    if (kind === "door") {
      const id = selectedKind === "door" ? selectedDoorFinish : doorFinish;
      return [{ color: "#8d5c38", on: id !== "metal" }, { color: "#b7c4cc", on: id === "metal" }];
    }
    if (kind === "roof") {
      const id = selectedKind === "roof" ? selectedRoofFinish : roofFinish;
      return [{ color: "#6b3a2a", on: id !== "metal" }, { color: "#9aa7ae", on: id === "metal" }];
    }
    if (kind === "column") {
      const id = selectedKind === "column" ? selectedColumnFinish : columnFinish;
      return [{ color: "#c8bfb0", on: id === "plaster" }, { color: "#c4b49a", on: id === "masonry" }, { color: "#8b7355", on: id === "timber" }];
    }
    if (kind === "stairs") {
      const id = selectedKind === "stairs" ? selectedStairsFinish : stairsFinish;
      return [{ color: "#8b5a32", on: id === "timber" }, { color: "#c4b49a", on: id === "masonry" }, { color: "#8e99a1", on: id === "metal" }];
    }
    if (kind === "railing") {
      const id = selectedKind === "railing" ? selectedRailingFinish : railingFinish;
      return [{ color: "#6d4a30", on: id !== "metal" }, { color: "#8e99a1", on: id === "metal" }];
    }
    if (kind === "window") {
      const id = selectedKind === "window" ? selectedWindowFinish : windowFinish;
      return [{ color: "#9bb7c9", on: id !== "metal" }, { color: "#8e99a1", on: id === "metal" }];
    }
    if (kind === "floor") {
      const id = selectedKind === "floor" ? selectedFloorFinish : floorFinish;
      return [{ color: "#8b7355", on: id !== "clay" }, { color: "#a15a3a", on: id === "clay" }];
    }
    if (kind === "fence") {
      const id = selectedKind === "fence" ? selectedFenceFinish : fenceFinish;
      return [{ color: "#8b5a32", on: id !== "metal" }, { color: "#8e99a1", on: id === "metal" }];
    }
    if (kind === "path") {
      const id = selectedKind === "path" ? selectedPathFinish : pathFinish;
      return [{ color: "#b7ab9a", on: id !== "clay" }, { color: "#a15a3a", on: id === "clay" }];
    }
    if (kind === "planter") {
      const id = selectedKind === "planter" ? selectedPlanterFinish : planterFinish;
      return [{ color: "#8a4e3a", on: id !== "timber" }, { color: "#8b5a32", on: id === "timber" }];
    }
    if (kind === "bench") {
      const id = selectedKind === "bench" ? selectedBenchFinish : benchFinish;
      return [{ color: "#8b5a32", on: id !== "masonry" }, { color: "#c4b49a", on: id === "masonry" }];
    }
    if (kind === "lamp") {
      const id = selectedKind === "lamp" ? selectedLampFinish : lampFinish;
      return [{ color: "#6d4a30", on: id !== "metal" }, { color: "#5c6670", on: id === "metal" }];
    }
    if (kind === "chimney") {
      const id = selectedKind === "chimney" ? selectedChimneyFinish : chimneyFinish;
      return [{ color: "#8f4a3c", on: id !== "masonry" }, { color: "#c4b49a", on: id === "masonry" }];
    }
    return null;
  };
  const finishCaption = (kind: PartKind): string | null => {
    if (kind === "wall") {
      const id = selectedKind === "wall" ? selectedWallFinish : wallFinish;
      return id === "masonry" ? labels.wallMasonry : labels.wallPlaster;
    }
    if (kind === "door") {
      const id = selectedKind === "door" ? selectedDoorFinish : doorFinish;
      return id === "metal" ? labels.doorMetal : labels.doorTimber;
    }
    if (kind === "roof") {
      const id = selectedKind === "roof" ? selectedRoofFinish : roofFinish;
      return id === "metal" ? labels.roofMetal : labels.roofClay;
    }
    if (kind === "column") {
      const id = selectedKind === "column" ? selectedColumnFinish : columnFinish;
      return id === "masonry" ? labels.columnMasonry : id === "timber" ? labels.columnTimber : labels.columnPlaster;
    }
    if (kind === "stairs") {
      const id = selectedKind === "stairs" ? selectedStairsFinish : stairsFinish;
      return id === "masonry" ? labels.stairsMasonry : id === "metal" ? labels.stairsMetal : labels.stairsTimber;
    }
    if (kind === "railing") {
      const id = selectedKind === "railing" ? selectedRailingFinish : railingFinish;
      return id === "metal" ? labels.railingMetal : labels.railingTimber;
    }
    if (kind === "window") {
      const id = selectedKind === "window" ? selectedWindowFinish : windowFinish;
      return id === "metal" ? labels.windowMetal : labels.windowTimber;
    }
    if (kind === "floor") {
      const id = selectedKind === "floor" ? selectedFloorFinish : floorFinish;
      return id === "clay" ? labels.floorClay : labels.floorTimber;
    }
    if (kind === "fence") {
      const id = selectedKind === "fence" ? selectedFenceFinish : fenceFinish;
      return id === "metal" ? labels.fenceMetal : labels.fenceTimber;
    }
    if (kind === "path") {
      const id = selectedKind === "path" ? selectedPathFinish : pathFinish;
      return id === "clay" ? labels.pathClay : labels.pathGravel;
    }
    if (kind === "planter") {
      const id = selectedKind === "planter" ? selectedPlanterFinish : planterFinish;
      return id === "timber" ? labels.planterTimber : labels.planterClay;
    }
    if (kind === "bench") {
      const id = selectedKind === "bench" ? selectedBenchFinish : benchFinish;
      return id === "masonry" ? labels.benchMasonry : labels.benchTimber;
    }
    if (kind === "lamp") {
      const id = selectedKind === "lamp" ? selectedLampFinish : lampFinish;
      return id === "metal" ? labels.lampMetal : labels.lampTimber;
    }
    if (kind === "chimney") {
      const id = selectedKind === "chimney" ? selectedChimneyFinish : chimneyFinish;
      return id === "masonry" ? labels.chimneyMasonry : labels.chimneyBrick;
    }
    return null;
  };
  const finishShort = (kind: PartKind): string | null => {
    if (kind === "wall") {
      const id = selectedKind === "wall" ? selectedWallFinish : wallFinish;
      return id === "masonry" ? labels.wallMasonryShort : labels.wallPlasterShort;
    }
    if (kind === "door") {
      const id = selectedKind === "door" ? selectedDoorFinish : doorFinish;
      return id === "metal" ? labels.doorMetalShort : labels.doorTimberShort;
    }
    if (kind === "roof") {
      const id = selectedKind === "roof" ? selectedRoofFinish : roofFinish;
      return id === "metal" ? labels.roofMetalShort : labels.roofClayShort;
    }
    if (kind === "column") {
      const id = selectedKind === "column" ? selectedColumnFinish : columnFinish;
      return id === "masonry" ? labels.columnMasonryShort : id === "timber" ? labels.columnTimberShort : labels.columnPlasterShort;
    }
    if (kind === "stairs") {
      const id = selectedKind === "stairs" ? selectedStairsFinish : stairsFinish;
      return id === "masonry" ? labels.stairsMasonryShort : id === "metal" ? labels.stairsMetalShort : labels.stairsTimberShort;
    }
    if (kind === "railing") {
      const id = selectedKind === "railing" ? selectedRailingFinish : railingFinish;
      return id === "metal" ? labels.railingMetalShort : labels.railingTimberShort;
    }
    if (kind === "window") {
      const id = selectedKind === "window" ? selectedWindowFinish : windowFinish;
      return id === "metal" ? labels.windowMetalShort : labels.windowTimberShort;
    }
    if (kind === "floor") {
      const id = selectedKind === "floor" ? selectedFloorFinish : floorFinish;
      return id === "clay" ? labels.floorClayShort : labels.floorTimberShort;
    }
    if (kind === "fence") {
      const id = selectedKind === "fence" ? selectedFenceFinish : fenceFinish;
      return id === "metal" ? labels.fenceMetalShort : labels.fenceTimberShort;
    }
    if (kind === "path") {
      const id = selectedKind === "path" ? selectedPathFinish : pathFinish;
      return id === "clay" ? labels.pathClayShort : labels.pathGravelShort;
    }
    if (kind === "planter") {
      const id = selectedKind === "planter" ? selectedPlanterFinish : planterFinish;
      return id === "timber" ? labels.planterTimberShort : labels.planterClayShort;
    }
    if (kind === "bench") {
      const id = selectedKind === "bench" ? selectedBenchFinish : benchFinish;
      return id === "masonry" ? labels.benchMasonryShort : labels.benchTimberShort;
    }
    if (kind === "lamp") {
      const id = selectedKind === "lamp" ? selectedLampFinish : lampFinish;
      return id === "metal" ? labels.lampMetalShort : labels.lampTimberShort;
    }
    if (kind === "chimney") {
      const id = selectedKind === "chimney" ? selectedChimneyFinish : chimneyFinish;
      return id === "masonry" ? labels.chimneyMasonryShort : labels.chimneyBrickShort;
    }
    return null;
  };
  const activeLabel =
    tool === "wall" ? labels.wall : tool === "floor" ? labels.floor : tool === "roof" ? labels.roof : tool === "column" ? labels.column : tool === "door" ? labels.door : tool === "window" ? labels.window : tool === "stairs" ? labels.stairs : tool === "railing" ? labels.railing : tool === "chimney" ? labels.chimney : tool === "beam" ? labels.beam : tool === "foundation" ? labels.foundation : tool === "pergola" ? labels.pergola : tool === "fence" ? labels.fence : tool === "path" ? labels.path : tool === "planter" ? labels.planter : tool === "bench" ? labels.bench : labels.lamp;
  moveLabelRef.current = {
    moving: labels.moving,
    kinds: {
      wall: labels.wall,
      floor: labels.floor,
      roof: labels.roof,
      column: labels.column,
      door: labels.door,
      window: labels.window,
      stairs: labels.stairs,
      railing: labels.railing,
      chimney: labels.chimney,
      beam: labels.beam,
      foundation: labels.foundation,
      pergola: labels.pergola,
      fence: labels.fence,
      path: labels.path,
      planter: labels.planter,
      bench: labels.bench,
      lamp: labels.lamp,
    },
  };

  const assignSelectedLayer = (layerId: string) => {
    const id = selectedRef.current;
    if (!id) return;
    const part = partsRef.current.find((item) => item.id === id);
    const layer = layersRef.current.find((item) => item.id === layerId);
    if (!part || !layer || part.layerId === layer.id) return;
    part.layerId = layer.id;
    const obj = findPartObject(part.id);
    if (obj) obj.userData.layerId = layer.id;
    applyLayerVisibility();
    setLockRev((n) => n + 1);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-foreground">{labels.title}</p>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {count} {labels.parts}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/40 bg-amber-900/15 px-2 py-0.5 text-[11px] font-semibold text-foreground">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/20"
            style={{ background: swatchFor(tool) }}
            aria-hidden
          />
          {labels.active}: {activeLabel}{finishCaption(tool) ? ` · ${finishCaption(tool)}` : ""}
          <span className="font-medium text-muted-foreground">
            {paletteItems.find((item) => item.kind === tool)?.size}
          </span>
          <kbd className="rounded bg-amber-50/80 px-1 font-mono text-[10px] text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
            {paletteItems.find((item) => item.kind === tool)?.key}
          </kbd>
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

      <div
        role="toolbar"
        aria-label={labels.title}
        className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory [scrollbar-width:thin]"
      >
        <button
          type="button"
          onClick={() => { if (!refuseSelection()) duplicateSelected(); }}
          aria-disabled={!selectedId}
          aria-label={labels.dup}
          className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent ${!selectedId ? "cursor-not-allowed opacity-50" : ""}`}
          title={selectedId ? "D" : labels.needSel}
        >
          {labels.dup}
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">D</kbd>
        </button>
        <button
          type="button"
          onClick={() => { if (!refuseSelection()) frameSelected(); }}
          aria-disabled={!selectedId}
          aria-label={labels.frame}
          className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent ${!selectedId ? "cursor-not-allowed opacity-50" : ""}`}
          title={selectedId ? "G" : labels.needSel}
        >
          {labels.frame}
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">G</kbd>
        </button>
        <button
          type="button"
          onClick={() => { if (!refuseSelection(true)) rotateSelected(); }}
          aria-disabled={!selectedId || selectedLocked}
          aria-label={labels.rot}
          className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent ${!selectedId || selectedLocked ? "cursor-not-allowed opacity-40" : ""}`}
          title={selectedLocked ? labels.lockedAction : selectedId ? "R" : labels.needSel}
        >
          {labels.rot}
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">R</kbd>
        </button>
        <button
          type="button"
          onClick={() => { if (!refuseSelection()) toggleLockSelected(); }}
          aria-disabled={!selectedId}
          aria-pressed={selectedLocked}
          aria-label={selectedLocked ? labels.unlock : labels.lock}
          className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent ${!selectedId ? "cursor-not-allowed opacity-40" : ""} ${
            selectedLocked ? "border-amber-600 bg-amber-500/15" : "border-border bg-card"
          }`}
          title={selectedId ? "L" : labels.needSel}
        >
          {selectedLocked ? labels.unlock : labels.lock}
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">L</kbd>
        </button>
        <button
          type="button"
          onClick={() => { if (!refuseSelection(true)) deleteSelected(); }}
          aria-disabled={!selectedId || selectedLocked}
          aria-label={labels.del}
          className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent ${!selectedId || selectedLocked ? "cursor-not-allowed opacity-40" : ""}`}
          title={selectedLocked ? labels.lockedAction : selectedId ? "Del" : labels.needSel}
        >
          {labels.del}
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">Del</kbd>
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={count === 0}
          aria-label={labels.clear}
          className="inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
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
          className="inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
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
      {actionHint && !isFullscreen && (
        <p role="status" aria-live="polite" className="rounded-lg border border-amber-700/40 bg-amber-900/15 px-3 py-1.5 text-xs font-semibold text-foreground">
          {actionHint}
        </p>
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
          {isFullscreen && (
            <div
              role="toolbar"
              aria-label={labels.fsBar}
              className="absolute right-3 top-3 z-20 flex max-w-[62%] flex-wrap justify-end gap-1"
            >
              <button
                type="button"
                onClick={() => { if (!refuseSelection(true)) rotateSelected(); }}
                aria-disabled={!selectedId || selectedLocked}
                aria-label={labels.rot}
                title={selectedLocked ? labels.lockedAction : selectedId ? "R" : labels.needSel}
                className={`inline-flex min-h-11 items-center gap-1 rounded-lg border border-amber-100/25 bg-amber-950/85 px-2.5 text-[11px] font-semibold text-amber-50 hover:bg-amber-800 ${!selectedId || selectedLocked ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {labels.rot}
                <kbd className="rounded bg-amber-50/15 px-1 font-mono text-[10px] text-amber-100">R</kbd>
              </button>
              <button
                type="button"
                onClick={() => { if (!refuseSelection()) duplicateSelected(); }}
                aria-disabled={!selectedId}
                aria-label={labels.dup}
                title={selectedId ? "D" : labels.needSel}
                className={`inline-flex min-h-11 items-center gap-1 rounded-lg border border-amber-100/25 bg-amber-950/85 px-2.5 text-[11px] font-semibold text-amber-50 hover:bg-amber-800 ${!selectedId ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {labels.dup}
                <kbd className="rounded bg-amber-50/15 px-1 font-mono text-[10px] text-amber-100">D</kbd>
              </button>
              <button
                type="button"
                onClick={() => { if (!refuseSelection()) frameSelected(); }}
                aria-disabled={!selectedId}
                aria-label={labels.frame}
                title={selectedId ? "G" : labels.needSel}
                className={`inline-flex min-h-11 items-center gap-1 rounded-lg border border-amber-100/25 bg-amber-950/85 px-2.5 text-[11px] font-semibold text-amber-50 hover:bg-amber-800 ${!selectedId ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {labels.frame}
                <kbd className="rounded bg-amber-50/15 px-1 font-mono text-[10px] text-amber-100">G</kbd>
              </button>
              <button
                type="button"
                onClick={() => { if (!refuseSelection()) toggleLockSelected(); }}
                aria-disabled={!selectedId}
                aria-pressed={selectedLocked}
                aria-label={selectedLocked ? labels.unlock : labels.lock}
                title={selectedId ? "L" : labels.needSel}
                className={`inline-flex min-h-11 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-semibold text-amber-50 hover:bg-amber-800 ${!selectedId ? "cursor-not-allowed opacity-40" : ""} ${
                  selectedLocked ? "border-amber-200 bg-amber-700" : "border-amber-100/25 bg-amber-950/85"
                }`}
              >
                {selectedLocked ? labels.unlock : labels.lock}
                <kbd className="rounded bg-amber-50/15 px-1 font-mono text-[10px] text-amber-100">L</kbd>
              </button>
              <button
                type="button"
                onClick={() => { if (!refuseSelection(true)) deleteSelected(); }}
                aria-disabled={!selectedId || selectedLocked}
                aria-label={labels.del}
                title={selectedLocked ? labels.lockedAction : selectedId ? "Del" : labels.needSel}
                className={`inline-flex min-h-11 items-center gap-1 rounded-lg border border-amber-100/25 bg-amber-950/85 px-2.5 text-[11px] font-semibold text-amber-50 hover:bg-amber-800 ${!selectedId || selectedLocked ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {labels.del}
                <kbd className="rounded bg-amber-50/15 px-1 font-mono text-[10px] text-amber-100">Del</kbd>
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={count === 0}
                aria-label={labels.clear}
                title="C"
                className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-amber-100/25 bg-amber-950/85 px-2.5 text-[11px] font-semibold text-amber-50 hover:bg-amber-800 disabled:opacity-40"
              >
                {labels.clear}
                <kbd className="rounded bg-amber-50/15 px-1 font-mono text-[10px] text-amber-100">C</kbd>
              </button>
              <button
                type="button"
                onClick={() => void toggleFullscreen()}
                aria-label={labels.exitFs}
                title="F"
                className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-amber-100/25 bg-amber-950/85 px-2.5 text-[11px] font-semibold text-amber-50 hover:bg-amber-800"
              >
                {labels.exitFs}
                <kbd className="rounded bg-amber-50/15 px-1 font-mono text-[10px] text-amber-100">F</kbd>
              </button>
              <button
                type="button"
                onClick={() => setShowHelp((v) => !v)}
                aria-pressed={showHelp}
                aria-label={showHelp ? labels.hideHelp : labels.help}
                className="min-h-11 rounded-lg border border-amber-100/25 bg-amber-950/85 px-2.5 text-[11px] font-semibold text-amber-50 hover:bg-amber-800"
              >
                {showHelp ? labels.hideHelp : labels.help}
              </button>
            </div>
          )}
          {isFullscreen && showHelp && (
            <div className="pointer-events-none absolute left-3 top-16 z-20 max-w-md rounded-lg bg-black/70 px-3 py-2 text-[11px] leading-snug text-amber-50 shadow ring-1 ring-amber-100/20">
              <p>{labels.place}</p>
              <p className="mt-1">{labels.cam}</p>
              <p className="mt-1">{labels.tip}</p>
            </div>
          )}
          {actionHint && isFullscreen && (
            <div role="status" aria-live="polite" className="pointer-events-none absolute left-1/2 top-16 z-30 max-w-[min(20rem,80%)] -translate-x-1/2 rounded-lg bg-stone-900/95 px-3 py-1.5 text-center text-[11px] font-semibold text-amber-50 shadow-lg ring-1 ring-amber-200/50">
              {actionHint}
            </div>
          )}
          <div className={`pointer-events-none absolute left-3 z-10 flex max-w-[min(18rem,46%)] flex-col gap-1 ${isFullscreen ? "top-16" : "top-3"}`}>
            <span
              className={`rounded-md px-2 py-1 text-[11px] font-medium shadow ${
                selectedKindLabel && !placingFromPalette
                  ? "bg-amber-900/90 text-amber-50 ring-1 ring-amber-200/50"
                  : "bg-black/55 text-amber-50"
              }`}
            >
              {selectedKindLabel && !placingFromPalette
                ? `${labels.selected}: ${selectedKindLabel}${finishCaption(selectedKind!) ? ` · ${finishCaption(selectedKind!)}` : ""} · ${selectedSize} · ${labels.rotDeg} ${selectedRot * 90}°${selectedLocked ? ` · ${labels.locked}` : ""}${placeLayerCaption ? ` · ${placeLayerCaption}` : ""}`
                : `${labels.armed}: ${activeLabel}${finishCaption(tool) ? ` · ${finishCaption(tool)}` : ""} · ${paletteItems.find((item) => item.kind === tool)?.size ?? ""} · ${paletteItems.find((item) => item.kind === tool)?.key ?? ""}${placeLayerCaption ? ` · ${placeLayerCaption}` : ""}`}
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
                ? `${labels.selected}: ${selectedKindLabel}${finishCaption(selectedKind!) ? ` · ${finishCaption(selectedKind!)}` : ""} · ${selectedSize} · ${labels.rotDeg} ${selectedRot * 90}°${
                    selectedPos ? ` · X ${selectedPos[0].toFixed(1)} Z ${selectedPos[1].toFixed(1)}` : ""
                  }${selectedLocked ? ` · ${labels.locked}` : ""}${placeLayerCaption ? ` · ${placeLayerCaption}` : ""}`
                : `${labels.armed}: ${activeLabel}${finishCaption(tool) ? ` · ${finishCaption(tool)}` : ""} · ${
                    paletteItems.find((item) => item.kind === tool)?.size ?? ""
                  } · ${paletteItems.find((item) => item.kind === tool)?.key ?? ""}${placeLayerCaption ? ` · ${placeLayerCaption}` : ""}`}
            </span>
            <span className="w-fit rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-medium text-amber-100/90">
              {labels.snap}
            </span>
          </div>
          {selectedKindLabel && !placingFromPalette && (
            <div
              role="group"
              aria-label={labels.touchPad}
              className="absolute bottom-3 right-3 z-20 flex w-[9.6rem] flex-col gap-1 rounded-xl bg-black/55 p-1 shadow ring-1 ring-amber-100/25"
            >
              <span className="truncate px-1 text-center text-[9px] font-semibold uppercase tracking-wide text-amber-100/90">
                {labels.touchPad}{selectedLocked ? ` · ${labels.locked}` : ""}
              </span>
              <div className="grid grid-cols-4 gap-1" role="group" aria-label={labels.orient}>
                {[0, 1, 2, 3].map((step) => {
                  const active = step === ((selectedRot % 4) + 4) % 4;
                  return (
                    <button
                      key={step}
                      type="button"
                      disabled={selectedLocked}
                      aria-pressed={active}
                      aria-label={`${labels.orient} ${step * 90}°`}
                      title={`${labels.orient} ${step * 90}°`}
                      onClick={() => setSelectedYaw(step)}
                      className={`min-h-11 rounded-lg border px-0 text-[10px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 disabled:opacity-40 ${
                        active ? "border-amber-200 bg-amber-700 text-amber-50" : "border-amber-100/20 bg-amber-950/80 text-amber-50 hover:bg-amber-800"
                      }`}
                    >
                      {step * 90}°
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-3 gap-1" role="group" aria-label={labels.nudge}>
              <span />
              <button
                type="button"
                disabled={selectedLocked}
                onClick={() => nudgeSelected(0, -GRID)}
                aria-label={labels.nudgeZN}
                title={labels.nudgeZN}
                className="min-h-11 min-w-11 rounded-lg border border-amber-100/20 bg-amber-950/80 text-sm font-semibold text-amber-50 hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 disabled:opacity-40"
              >
                −Z
              </button>
              <span />
              <button
                type="button"
                disabled={selectedLocked}
                onClick={() => nudgeSelected(-GRID, 0)}
                aria-label={labels.nudgeXN}
                title={labels.nudgeXN}
                className="min-h-11 min-w-11 rounded-lg border border-amber-100/20 bg-amber-950/80 text-sm font-semibold text-amber-50 hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 disabled:opacity-40"
              >
                −X
              </button>
              <button
                type="button"
                disabled={selectedLocked}
                onClick={rotateSelected}
                aria-label={labels.rot}
                title="R"
                className="flex min-h-11 items-center justify-center rounded-lg border border-amber-100/20 bg-amber-950/80 text-[10px] font-semibold text-amber-100 hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 disabled:opacity-40"
              >
                {selectedRot * 90}°
              </button>
              <button
                type="button"
                disabled={selectedLocked}
                onClick={() => nudgeSelected(GRID, 0)}
                aria-label={labels.nudgeXP}
                title={labels.nudgeXP}
                className="min-h-11 min-w-11 rounded-lg border border-amber-100/20 bg-amber-950/80 text-sm font-semibold text-amber-50 hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 disabled:opacity-40"
              >
                +X
              </button>
              <span />
              <button
                type="button"
                disabled={selectedLocked}
                onClick={() => nudgeSelected(0, GRID)}
                aria-label={labels.nudgeZP}
                title={labels.nudgeZP}
                className="min-h-11 min-w-11 rounded-lg border border-amber-100/20 bg-amber-950/80 text-sm font-semibold text-amber-50 hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 disabled:opacity-40"
              >
                +Z
              </button>
              <span />
              </div>
            </div>
          )}


        </div>
        {/* Right structure palette — drag to place */}
        <aside
          role="toolbar"
          aria-label={labels.palette}
          aria-orientation="vertical"
          className={`flex shrink-0 flex-col gap-2 overflow-y-auto border-l border-border/60 bg-card/95 p-2 backdrop-blur-sm ${
            paletteCompact ? "w-[4.75rem]" : isFullscreen ? "w-44" : "w-36 sm:w-44"
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
          <div className="sticky top-0 z-10 bg-card/95 pb-1 backdrop-blur-sm">
            {!paletteCompact && (
              <p className="px-0.5 pb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{labels.variants}</p>
            )}
          {(tool === "door" || selectedKind === "door") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.doorFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.doorFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["timber", labels.doorTimber, "#8d5c38", labels.doorTimberShort],
                  ["metal", labels.doorMetal, "#b7c4cc", labels.doorMetalShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "door" ? selectedDoorFinish : doorFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseDoorFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {(tool === "wall" || selectedKind === "wall") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.wallFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.wallFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["plaster", labels.wallPlaster, "#d8d0c4", labels.wallPlasterShort],
                  ["masonry", labels.wallMasonry, "#c4b49a", labels.wallMasonryShort],
                  ["timber", labels.wallTimber, "#8b7355", labels.wallTimberShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "wall" ? selectedWallFinish : wallFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseWallFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {(tool === "floor" || selectedKind === "floor") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.floorFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.floorFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["timber", labels.floorTimber, "#8b7355", labels.floorTimberShort],
                  ["clay", labels.floorClay, "#8a4e3a", labels.floorClayShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "floor" ? selectedFloorFinish : floorFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseFloorFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {(tool === "fence" || selectedKind === "fence") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.fenceFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.fenceFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["timber", labels.fenceTimber, "#8b5a32", labels.fenceTimberShort],
                  ["metal", labels.fenceMetal, "#6e767c", labels.fenceMetalShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "fence" ? selectedFenceFinish : fenceFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseFenceFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
                    {(tool === "path" || selectedKind === "path") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.pathFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.pathFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["gravel", labels.pathGravel, "#b7ab9a", labels.pathGravelShort],
                  ["clay", labels.pathClay, "#8a4e3a", labels.pathClayShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "path" ? selectedPathFinish : pathFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => choosePathFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
                    {(tool === "planter" || selectedKind === "planter") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.planterFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.planterFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["clay", labels.planterClay, "#8a4e3a", labels.planterClayShort],
                  ["timber", labels.planterTimber, "#8b5a32", labels.planterTimberShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "planter" ? selectedPlanterFinish : planterFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => choosePlanterFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
                    {(tool === "chimney" || selectedKind === "chimney") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.chimneyFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.chimneyFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["brick", labels.chimneyBrick, "#8f4a3c", labels.chimneyBrickShort],
                  ["masonry", labels.chimneyMasonry, "#c4b49a", labels.chimneyMasonryShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "chimney" ? selectedChimneyFinish : chimneyFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseChimneyFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
{(tool === "lamp" || selectedKind === "lamp") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.lampFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.lampFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["timber", labels.lampTimber, "#6d4a30", labels.lampTimberShort],
                  ["metal", labels.lampMetal, "#5c6670", labels.lampMetalShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "lamp" ? selectedLampFinish : lampFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseLampFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
{(tool === "beam" || selectedKind === "beam") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.beamFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.beamFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["timber", labels.beamTimber, "#6d4a30", labels.beamTimberShort],
                  ["metal", labels.beamMetal, "#5c6670", labels.beamMetalShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "beam" ? selectedBeamFinish : beamFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseBeamFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
{(tool === "foundation" || selectedKind === "foundation") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.foundationFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.foundationFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["concrete", labels.foundationConcrete, "#c4b8a4", labels.foundationConcreteShort],
                  ["stone", labels.foundationStone, "#8a7e6e", labels.foundationStoneShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "foundation" ? selectedFoundationFinish : foundationFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseFoundationFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
{(tool === "pergola" || selectedKind === "pergola") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.pergolaFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.pergolaFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["timber", labels.pergolaTimber, "#6d4a30", labels.pergolaTimberShort],
                  ["metal", labels.pergolaMetal, "#8e99a1", labels.pergolaMetalShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "pergola" ? selectedPergolaFinish : pergolaFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => choosePergolaFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
{(tool === "bench" || selectedKind === "bench") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.benchFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.benchFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["timber", labels.benchTimber, "#8b5a32", labels.benchTimberShort],
                  ["masonry", labels.benchMasonry, "#c4b49a", labels.benchMasonryShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "bench" ? selectedBenchFinish : benchFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseBenchFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
{(tool === "window" || selectedKind === "window") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.windowFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.windowFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["timber", labels.windowTimber, "#d9d0c0", labels.windowTimberShort],
                  ["metal", labels.windowMetal, "#6e767c", labels.windowMetalShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "window" ? selectedWindowFinish : windowFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseWindowFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {(tool === "railing" || selectedKind === "railing") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.railingFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.railingFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["timber", labels.railingTimber, "#6d4a30", labels.railingTimberShort],
                  ["metal", labels.railingMetal, "#6e767c", labels.railingMetalShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "railing" ? selectedRailingFinish : railingFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseRailingFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {(tool === "stairs" || selectedKind === "stairs") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.stairsFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.stairsFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["timber", labels.stairsTimber, "#8b5a32", labels.stairsTimberShort],
                  ["masonry", labels.stairsMasonry, "#c4b49a", labels.stairsMasonryShort],
                  ["metal", labels.stairsMetal, "#8e99a1", labels.stairsMetalShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "stairs" ? selectedStairsFinish : stairsFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseStairsFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {(tool === "column" || selectedKind === "column") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.columnFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.columnFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["plaster", labels.columnPlaster, "#d8d0c4", labels.columnPlasterShort],
                  ["masonry", labels.columnMasonry, "#c4b49a", labels.columnMasonryShort],
                  ["timber", labels.columnTimber, "#8b7355", labels.columnTimberShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "column" ? selectedColumnFinish : columnFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseColumnFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {(tool === "roof" || selectedKind === "roof") && (
            <div className="rounded-xl border border-border bg-background/80 p-2" role="group" aria-label={labels.roofFinish}>
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ${paletteCompact ? "sr-only" : ""}`}>{labels.roofFinish}</p>
              <div className={`grid gap-1 ${paletteCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                {([
                  ["clay", labels.roofClay, "#6b3a2a", labels.roofClayShort],
                  ["metal", labels.roofMetal, "#9aa7ae", labels.roofMetalShort],
                ] as const).map(([id, label, swatch, shortLabel]) => {
                  const active = (selectedKind === "roof" ? selectedRoofFinish : roofFinish) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseRoofFinish(id)}
                      aria-pressed={active}
                      title={label}
                      className={`flex min-h-11 items-center gap-1 rounded-lg border px-1 text-[10px] font-semibold ${
                        paletteCompact ? "flex-col justify-center py-1" : "gap-1.5 px-1.5"
                      } ${
                        active ? "border-amber-700/70 bg-amber-900/15 ring-1 ring-amber-700/40" : "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20" style={{ background: swatch }} aria-hidden />
                      <span className={`truncate leading-tight ${paletteCompact ? "max-w-full text-[9px]" : ""}`}>{paletteCompact ? shortLabel : label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          </div>
          {paletteItems.map((item) => {
            const placed = partsRef.current.filter((part) => part.kind === item.kind).length;
            return (
            <button
              key={item.kind}
              type="button"
              onPointerDown={startPaletteDrag(item.kind)}
              onClick={() => setTool(item.kind)}
              aria-pressed={tool === item.kind}
              aria-label={`${item.label}${finishCaption(item.kind) ? ` · ${finishCaption(item.kind)}` : ""} (${item.key})${placed ? ` · ${placed} ${labels.parts}` : ""}`}
              title={`${item.label}${finishCaption(item.kind) ? ` · ${finishCaption(item.kind)}` : ""} · ${item.size} · ${labels.dragHint} (${item.key})${placed ? ` · ${placed} ${labels.parts}` : ""}`}
            className={`group relative flex min-h-11 cursor-grab touch-manipulation flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center transition active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ${
                tool === item.kind
                  ? "border-amber-700/70 bg-amber-900/20 shadow-sm ring-1 ring-amber-700/40"
                  : selectedKind === item.kind
                    ? "border-dashed border-amber-600 bg-amber-900/10 ring-1 ring-amber-600/50"
                    : "border-border bg-background/80 hover:bg-accent"
              } ${placingFromPalette && tool === item.kind ? "scale-[0.98] ring-2 ring-amber-600" : ""}`}
            >
              {placed > 0 && (
                <span
                  className="absolute right-1 top-1 min-w-[1.1rem] rounded-full bg-amber-800 px-1 text-center text-[9px] font-bold leading-4 text-amber-50 ring-1 ring-amber-100/40"
                  aria-hidden
                >
                  {placed}
                </span>
              )}
              <StructureGlyph kind={item.kind} />
              {variantPair(item.kind) ? (
                <span className="flex items-center gap-1" aria-hidden>
                  {variantPair(item.kind)!.map((chip) => (
                    <span
                      key={chip.color}
                      className={`h-2 rounded-sm ring-1 ring-black/25 ${chip.on ? "w-4 ring-2 ring-amber-700" : "w-2.5 opacity-55"}`}
                      style={{ background: chip.color }}
                    />
                  ))}
                </span>
              ) : (
                <span
                  className="h-1.5 w-10 rounded-full ring-1 ring-black/15"
                  style={{ background: swatchFor(item.kind) }}
                  aria-hidden
                />
              )}
              {paletteCompact && finishShort(item.kind) && (
                <span className="max-w-full truncate text-[9px] font-semibold leading-none text-amber-800 dark:text-amber-200">{finishShort(item.kind)}</span>
              )}
              {!paletteCompact && (
                <>
                  <span className="text-xs font-semibold text-foreground">{item.label}</span>
                  <span className="text-[10px] leading-none text-muted-foreground">{item.size}</span>
                  {finishCaption(item.kind) && (
                    <span className="text-[10px] font-semibold leading-none text-amber-800 dark:text-amber-200">{finishCaption(item.kind)}</span>
                  )}
                </>
              )}
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {item.key}
                {!paletteCompact && tool === item.kind ? ` · ${labels.active}` : ""}
                {selectedKind === item.kind ? ` · ${labels.selectedMark}` : ""}
              </span>
            </button>
            );
          })}

          <div className="rounded-xl border border-border bg-background/80 p-1.5">
            {!paletteCompact && (
              <p className="px-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{labels.layers}</p>
            )}
            <div className="mt-1 flex max-h-36 flex-col gap-1 overflow-y-auto">
              {layers.map((layer) => (
                <div key={layer.id} className={`rounded-lg border px-1 py-1 ${layer.id === activeLayerId ? "border-amber-700/60 bg-amber-900/10" : "border-border"}`}>
                  <button
                    type="button"
                    onClick={() => setActiveLayerId(layer.id)}
                    className="w-full truncate text-left text-[10px] font-semibold"
                    title={labels.activeLayer}
                  >
                    {layer.id === activeLayerId ? "● " : "○ "}
                    {paletteCompact ? layer.name.slice(0, 3) : layer.name}
                  </button>
                  {!paletteCompact && (
                    <input
                      aria-label={labels.renameLayer}
                      value={layer.name}
                      onChange={(e) => {
                        const name = e.target.value.slice(0, 24);
                        setLayers((prev) => prev.map((l) => (l.id === layer.id ? { ...l, name } : l)));
                      }}
                      className="mt-1 w-full rounded border border-border bg-card px-1 py-0.5 text-[10px]"
                    />
                  )}
                  <div className="mt-1 flex gap-1">
                    <button
                      type="button"
                      aria-pressed={layer.visible}
                      aria-label={layer.visible ? labels.hideLayer : labels.showLayer}
                      title={layer.visible ? labels.hideLayer : labels.showLayer}
                      onClick={() => {
                        setLayers((prev) => {
                          const next = prev.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l));
                          layersRef.current = next;
                          return next;
                        });
                        queueMicrotask(() => applyLayerVisibility());
                      }}
                      className={`rounded border border-border bg-card font-semibold hover:bg-accent ${paletteCompact ? "min-h-11 min-w-11 flex-1 text-sm" : "min-h-8 flex-1 text-[9px]"} ${!layer.visible ? "border-amber-700 bg-amber-500/20" : ""}`}
                    >
                      {paletteCompact ? (layer.visible ? "◉" : "○") : layer.visible ? labels.hideLayer : labels.showLayer}
                    </button>
                    <button
                      type="button"
                      aria-pressed={layer.locked}
                      aria-label={layer.locked ? labels.unlockLayer : labels.lockLayer}
                      title={layer.locked ? labels.unlockLayer : labels.lockLayer}
                      onClick={() => {
                        setLayers((prev) => {
                          const next = prev.map((l) => (l.id === layer.id ? { ...l, locked: !l.locked } : l));
                          layersRef.current = next;
                          return next;
                        });
                        queueMicrotask(() => applyLayerVisibility());
                      }}
                      className={`rounded border font-semibold hover:bg-accent ${paletteCompact ? "min-h-11 min-w-11 flex-1 text-sm" : "min-h-8 flex-1 text-[9px]"} ${layer.locked ? "border-amber-600 bg-amber-500/15" : "border-border bg-card"}`}
                    >
                      {paletteCompact ? (layer.locked ? "L" : "○") : layer.locked ? labels.unlock : labels.lock}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-1 flex gap-1">
              <button
                type="button"
                onClick={() => {
                  const id = `layer-${uid()}`;
                  const name = es ? `Capa ${layers.length + 1}` : `Layer ${layers.length + 1}`;
                  setLayers((prev) => [...prev, { id, name, visible: true, locked: false }]);
                  setActiveLayerId(id);
                }}
                className={`rounded border border-border bg-card font-semibold hover:bg-accent ${paletteCompact ? "min-h-11 flex-1 text-sm" : "min-h-8 flex-1 text-[9px]"}`}
                title={labels.addLayer}
              >
                {paletteCompact ? "+" : labels.addLayer}
              </button>
              {layers.length > 1 && (
                <button
                  type="button"
                  aria-label={labels.removeLayer}
                  title={labels.removeLayer}
                  onClick={() => {
                    const victim = layers.find((l) => l.id === activeLayerId);
                    if (!victim) return;
                    const fallback = layers.find((l) => l.id !== victim.id);
                    if (!fallback) return;
                    for (const part of partsRef.current) {
                      if (part.layerId !== victim.id) continue;
                      part.layerId = fallback.id;
                      const obj = findPartObject(part.id);
                      if (obj) obj.userData.layerId = fallback.id;
                    }
                    const next = layers.filter((l) => l.id !== victim.id);
                    layersRef.current = next;
                    setLayers(next);
                    setActiveLayerId(fallback.id);
                    queueMicrotask(() => applyLayerVisibility());
                  }}
                  className="min-h-8 rounded border border-border bg-card px-1.5 text-[9px] font-semibold hover:bg-accent"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {selectedKindLabel && !paletteCompact ? (
            <div className="rounded-xl border border-amber-700/50 bg-amber-900/15 p-2 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                {labels.inspector}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">
                {selectedKindLabel}
                {selectedKind && finishShort(selectedKind) ? ` · ${finishShort(selectedKind)}` : ""}
                {selectedLocked ? ` · ${labels.locked}` : ""}
              </p>
              <p className="text-[10px] text-muted-foreground">{selectedSize}</p>
              <label className="mt-1.5 block text-[10px] font-semibold text-muted-foreground">
                {labels.partLayer}
                <select
                  className="mt-1 w-full min-h-11 rounded-md border border-border bg-background px-1 text-[11px] font-semibold text-foreground"
                  value={selectedPart?.layerId ?? BASE_LAYER_ID}
                  aria-label={labels.partLayer}
                  title={selectedLayer?.name ?? labels.partLayer}
                  onChange={(e) => assignSelectedLayer(e.target.value)}
                >
                  {layers.map((layer) => (
                    <option key={layer.id} value={layer.id}>
                      {layer.name}
                      {!layer.visible ? ` · ${labels.hideLayer}` : ""}
                      {layer.locked ? ` · ${labels.locked}` : ""}
                    </option>
                  ))}
                </select>
              </label>
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
                  title={selectedLocked ? labels.locked : "Del"}
                  aria-label={labels.del}
                  disabled={selectedLocked}
                  className="min-h-11 rounded-lg border border-destructive/40 bg-background px-2 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-40"
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
            <div className="flex flex-col gap-1" role="group" aria-label={labels.nudge}>
              <span className="truncate text-center text-[9px] font-semibold text-amber-800 dark:text-amber-200" title={selectedKindLabel}>
                {selectedKindLabel}{selectedKind && finishShort(selectedKind) ? ` · ${finishShort(selectedKind)}` : ""}{selectedLocked ? ` · ${labels.locked}` : ""}
              </span>
              <span className="text-center text-[9px] font-semibold text-amber-800 dark:text-amber-200">
                {selectedRot * 90}°
              </span>
              <div className="grid grid-cols-2 gap-1">
                <button type="button" onClick={() => nudgeSelected(-GRID, 0)} disabled={selectedLocked} aria-label={labels.nudgeXN} title={selectedLocked ? labels.lockedAction : labels.nudgeXN} className="min-h-11 rounded-md border border-border bg-background text-[10px] font-semibold hover:bg-accent disabled:opacity-40">−X</button>
                <button type="button" onClick={() => nudgeSelected(GRID, 0)} disabled={selectedLocked} aria-label={labels.nudgeXP} title={selectedLocked ? labels.lockedAction : labels.nudgeXP} className="min-h-11 rounded-md border border-border bg-background text-[10px] font-semibold hover:bg-accent disabled:opacity-40">+X</button>
                <button type="button" onClick={() => nudgeSelected(0, -GRID)} disabled={selectedLocked} aria-label={labels.nudgeZN} title={selectedLocked ? labels.lockedAction : labels.nudgeZN} className="min-h-11 rounded-md border border-border bg-background text-[10px] font-semibold hover:bg-accent disabled:opacity-40">−Z</button>
                <button type="button" onClick={() => nudgeSelected(0, GRID)} disabled={selectedLocked} aria-label={labels.nudgeZP} title={selectedLocked ? labels.lockedAction : labels.nudgeZP} className="min-h-11 rounded-md border border-border bg-background text-[10px] font-semibold hover:bg-accent disabled:opacity-40">+Z</button>
              </div>
              <p className="text-center text-[8px] leading-tight text-muted-foreground">{labels.nudge}</p>
              <button
                type="button"
                onClick={rotateSelected}
                title={selectedLocked ? labels.lockedAction : "R"}
                aria-label={labels.rot}
                disabled={selectedLocked}
                className="min-h-11 rounded-lg border border-border bg-background px-1 text-[10px] font-semibold hover:bg-accent disabled:opacity-40"
              >
                R
              </button>
              <button
                type="button"
                onClick={deleteSelected}
                title={selectedLocked ? labels.locked : "Del"}
                aria-label={labels.del}
                disabled={selectedLocked}
                className="min-h-11 rounded-lg border border-destructive/40 bg-background px-1 text-[10px] font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-40"
              >
                Del
              </button>
            </div>
          ) : !paletteCompact ? (
            <p className="rounded-lg border border-dashed border-border px-2 py-2 text-[10px] leading-snug text-muted-foreground">
              {labels.none}
            </p>
          ) : null}
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
      {moveChip && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed z-50 rounded-lg bg-amber-950/95 px-2.5 py-1.5 text-[11px] font-semibold text-amber-50 shadow-lg ring-1 ring-amber-100/40"
          style={{
            left: Math.min(window.innerWidth - 16, Math.max(8, moveChip.x + 16)),
            top: Math.min(window.innerHeight - 40, Math.max(8, moveChip.y + 18)),
          }}
        >
          {moveChip.text}
        </div>
      )}
      {lockHint && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed z-50 rounded-lg bg-stone-900/95 px-2.5 py-1.5 text-[11px] font-semibold text-amber-50 shadow-lg ring-1 ring-amber-200/50"
          style={{
            left: Math.min(window.innerWidth - 16, Math.max(8, lockHint.x + 16)),
            top: Math.min(window.innerHeight - 40, Math.max(8, lockHint.y + 18)),
          }}
        >
          {labels.lockedDrag}
        </div>
      )}
      {dragCursor && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed z-50 flex max-w-[min(16rem,70vw)] -translate-x-1/2 -translate-y-[130%] items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-semibold shadow-lg ring-1 ring-amber-100/30"
          style={{
            left: Math.min(window.innerWidth - 96, Math.max(96, dragCursor.x)),
            top: Math.min(window.innerHeight - 36, Math.max(64, dragCursor.y)),
            background: dragCursor.over ? "rgba(120, 53, 15, 0.94)" : "rgba(69, 26, 26, 0.94)",
            color: "#fff7ed",
          }}
        >
          <span className="h-3.5 w-3.5 shrink-0 rounded-sm ring-1 ring-amber-50/70" style={{ background: swatchFor(tool) }} aria-hidden />
          <span className="rounded bg-amber-50/95 px-0.5">
            <StructureGlyph kind={tool} />
          </span>
          <span className="min-w-0">
            <span className="block truncate">{activeLabel}{finishCaption(tool) ? ` · ${finishCaption(tool)}` : ""}</span>
            <span className={`mt-0.5 block truncate text-[10px] font-medium ${dragCursor.over ? "text-amber-100" : "text-red-100"}`}>
              {dragCursor.over ? labels.dropOver : labels.dropOut}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}








