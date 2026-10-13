import * as THREE from "three";

export type PartKind = "wall" | "floor" | "roof" | "column" | "door" | "window" | "stairs" | "railing" | "chimney" | "beam" | "foundation" | "pergola" | "fence" | "path" | "planter" | "bench" | "lamp";
export type Locale = "en" | "es";
export type DoorFinish = "timber" | "metal";
export type RoofFinish = "clay" | "metal";
export type WallFinish = "plaster" | "masonry" | "timber";
export type ColumnFinish = "plaster" | "masonry" | "timber";
export type StairsFinish = "timber" | "masonry" | "metal";
export type RailingFinish = "timber" | "metal";
export type WindowFinish = "timber" | "metal";
export type FloorFinish = "timber" | "clay" | "masonry";
export type FenceFinish = "timber" | "metal";
export type PathFinish = "gravel" | "clay" | "masonry";
export type PlanterFinish = "clay" | "timber" | "masonry";
export type BenchFinish = "timber" | "masonry";
export type ChimneyFinish = "brick" | "masonry";
export type LampFinish = "timber" | "metal";
export type BeamFinish = "timber" | "metal";
export type FoundationFinish = "concrete" | "stone";
export type PergolaFinish = "timber" | "metal";

export type SceneLayer = {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
};

export type ScenePart = {
  id: string;
  kind: PartKind;
  position: [number, number, number];
  rotationY: number;
  mesh: THREE.Mesh;
  locked: boolean;
  layerId: string;
  finish: DoorFinish;
  roofFinish: RoofFinish;
  wallFinish: WallFinish;
  columnFinish: ColumnFinish;
  stairsFinish: StairsFinish;
  railingFinish: RailingFinish;
  windowFinish: WindowFinish;
  floorFinish: FloorFinish;
  fenceFinish: FenceFinish;
  pathFinish: PathFinish;
  planterFinish: PlanterFinish;
  benchFinish: BenchFinish;
  chimneyFinish: ChimneyFinish;
  lampFinish: LampFinish;
  beamFinish: BeamFinish;
  foundationFinish: FoundationFinish;
  pergolaFinish: PergolaFinish;
};

export const BASE_LAYER_ID = "base";
export const GRID = 0.5;
export const SITE_RADIUS = 40;

export function snap(n: number) {
  return Math.round(n / GRID) * GRID;
}

export function clampToSite(x: number, z: number): [number, number] {
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

export function uid() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function partFrozen(part: ScenePart, layers: SceneLayer[]) {
  if (part.locked) return true;
  const layer = layers.find((l) => l.id === part.layerId);
  return !!layer?.locked;
}

export function doorFinishOf(part: { kind: PartKind; finish?: DoorFinish } | undefined, fallback: DoorFinish = "timber"): DoorFinish {
  if (part?.kind === "door" && part.finish === "metal") return "metal";
  if (part?.kind === "door") return part.finish === "timber" ? "timber" : fallback;
  return "timber";
}
export function roofFinishOf(part: { kind: PartKind; roofFinish?: RoofFinish } | undefined, fallback: RoofFinish = "clay"): RoofFinish {
  if (part?.kind === "roof" && part.roofFinish === "metal") return "metal";
  if (part?.kind === "roof") return part.roofFinish === "clay" ? "clay" : fallback;
  return "clay";
}
export function wallFinishOf(part: { kind: PartKind; wallFinish?: WallFinish } | undefined, fallback: WallFinish = "plaster"): WallFinish {
  if (part?.kind === "wall" && part.wallFinish === "masonry") return "masonry";
  if (part?.kind === "wall" && part.wallFinish === "timber") return "timber";
  if (part?.kind === "wall") return part.wallFinish === "plaster" ? "plaster" : fallback;
  return "plaster";
}
export function columnFinishOf(part: { kind: PartKind; columnFinish?: ColumnFinish } | undefined, fallback: ColumnFinish = "plaster"): ColumnFinish {
  if (part?.kind === "column" && part.columnFinish === "masonry") return "masonry";
  if (part?.kind === "column" && part.columnFinish === "timber") return "timber";
  if (part?.kind === "column") return part.columnFinish === "plaster" ? "plaster" : fallback;
  return "plaster";
}
export function stairsFinishOf(part: { kind: PartKind; stairsFinish?: StairsFinish } | undefined, fallback: StairsFinish = "timber"): StairsFinish {
  if (part?.kind === "stairs" && part.stairsFinish === "masonry") return "masonry";
  if (part?.kind === "stairs" && part.stairsFinish === "metal") return "metal";
  if (part?.kind === "stairs") return part.stairsFinish === "timber" ? "timber" : fallback;
  return "timber";
}
export function railingFinishOf(part: { kind: PartKind; railingFinish?: RailingFinish } | undefined, fallback: RailingFinish = "timber"): RailingFinish {
  if (part?.kind === "railing" && part.railingFinish === "metal") return "metal";
  if (part?.kind === "railing") return part.railingFinish === "timber" ? "timber" : fallback;
  return "timber";
}
export function windowFinishOf(part: { kind: PartKind; windowFinish?: WindowFinish } | undefined, fallback: WindowFinish = "timber"): WindowFinish {
  if (part?.kind === "window" && part.windowFinish === "metal") return "metal";
  if (part?.kind === "window") return part.windowFinish === "timber" ? "timber" : fallback;
  return "timber";
}
export function floorFinishOf(part: { kind: PartKind; floorFinish?: FloorFinish } | undefined, fallback: FloorFinish = "timber"): FloorFinish {
  if (part?.kind === "floor" && part.floorFinish === "clay") return "clay";
  if (part?.kind === "floor" && part.floorFinish === "masonry") return "masonry";
  if (part?.kind === "floor") return part.floorFinish === "timber" ? "timber" : fallback;
  return "timber";
}
export function fenceFinishOf(part: { kind: PartKind; fenceFinish?: FenceFinish } | undefined, fallback: FenceFinish = "timber"): FenceFinish {
  if (part?.kind === "fence" && part.fenceFinish === "metal") return "metal";
  if (part?.kind === "fence") return part.fenceFinish === "timber" ? "timber" : fallback;
  return "timber";
}
export function pathFinishOf(part: { kind: PartKind; pathFinish?: PathFinish } | undefined, fallback: PathFinish = "gravel"): PathFinish {
  if (part?.kind === "path" && part.pathFinish === "clay") return "clay";
  if (part?.kind === "path" && part.pathFinish === "masonry") return "masonry";
  if (part?.kind === "path") return part.pathFinish === "gravel" ? "gravel" : fallback;
  return "gravel";
}
export function planterFinishOf(part: { kind: PartKind; planterFinish?: PlanterFinish } | undefined, fallback: PlanterFinish = "clay"): PlanterFinish {
  if (part?.kind === "planter" && part.planterFinish === "timber") return "timber";
  if (part?.kind === "planter" && part.planterFinish === "masonry") return "masonry";
  if (part?.kind === "planter") return part.planterFinish === "clay" ? "clay" : fallback;
  return "clay";
}
export function benchFinishOf(part: { kind: PartKind; benchFinish?: BenchFinish } | undefined, fallback: BenchFinish = "timber"): BenchFinish {
  if (part?.kind === "bench" && part.benchFinish === "masonry") return "masonry";
  if (part?.kind === "bench") return part.benchFinish === "timber" ? "timber" : fallback;
  return "timber";
}
export function chimneyFinishOf(part: { kind: PartKind; chimneyFinish?: ChimneyFinish } | undefined, fallback: ChimneyFinish = "brick"): ChimneyFinish {
  if (part?.kind === "chimney" && part.chimneyFinish === "masonry") return "masonry";
  if (part?.kind === "chimney") return part.chimneyFinish === "brick" ? "brick" : fallback;
  return "brick";
}
export function lampFinishOf(part: { kind: PartKind; lampFinish?: LampFinish } | undefined, fallback: LampFinish = "timber"): LampFinish {
  if (part?.kind === "lamp" && part.lampFinish === "metal") return "metal";
  if (part?.kind === "lamp") return part.lampFinish === "timber" ? "timber" : fallback;
  return "timber";
}
export function beamFinishOf(part: { kind: PartKind; beamFinish?: BeamFinish } | undefined, fallback: BeamFinish = "timber"): BeamFinish {
  if (part?.kind === "beam" && part.beamFinish === "metal") return "metal";
  if (part?.kind === "beam") return part.beamFinish === "timber" ? "timber" : fallback;
  return "timber";
}
export function foundationFinishOf(part: { kind: PartKind; foundationFinish?: FoundationFinish } | undefined, fallback: FoundationFinish = "concrete"): FoundationFinish {
  if (part?.kind === "foundation" && part.foundationFinish === "stone") return "stone";
  if (part?.kind === "foundation") return part.foundationFinish === "concrete" ? "concrete" : fallback;
  return "concrete";
}
export function pergolaFinishOf(part: { kind: PartKind; pergolaFinish?: PergolaFinish } | undefined, fallback: PergolaFinish = "timber"): PergolaFinish {
  if (part?.kind === "pergola" && part.pergolaFinish === "metal") return "metal";
  if (part?.kind === "pergola") return part.pergolaFinish === "timber" ? "timber" : fallback;
  return "timber";
}

export function boxWithoutBadge(obj: THREE.Object3D, target: THREE.Box3) {
  const badge = obj.getObjectByName("lockBadge");
  const was = badge?.visible ?? false;
  if (badge) badge.visible = false;
  target.setFromObject(obj);
  if (badge) badge.visible = was;
  return target;
}

const sitePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const siteHit = new THREE.Vector3();

export function pointOnSitePlane(raycaster: THREE.Raycaster): THREE.Vector3 | null {
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

export function disposeObjectResources(obj: THREE.Object3D, disposeMaterials: boolean) {
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

export function disposeLockBadge(obj: THREE.Object3D) {
  const badge = obj.getObjectByName("lockBadge");
  if (!badge) return;
  obj.remove(badge);
  disposeObjectResources(badge, true);
}

export function syncLockBadge(mesh: THREE.Object3D, locked: boolean) {
  let badge = mesh.getObjectByName("lockBadge");
  if (!locked) {
    if (badge) {
      mesh.remove(badge);
      disposeObjectResources(badge, true);
    }
    return;
  }
  if (!badge) {
    const geo = new THREE.SphereGeometry(0.12, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xe11d48 });
    badge = new THREE.Mesh(geo, mat);
    badge.name = "lockBadge";
    badge.position.set(0, 2.2, 0);
    mesh.add(badge);
  }
  badge.visible = true;
}
