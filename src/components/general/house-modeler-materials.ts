import * as THREE from "three";

/** Split from HouseModeler3D monolith so automations never rewrite a 330KB file in one shot. */
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
export type FoundationFinish = "concrete" | "masonry";
export type PergolaFinish = "timber" | "metal";

export type ScenePart = {
  id: string;
  kind: PartKind;
  x: number;
  y: number;
  z: number;
  yaw: number;
  layerId?: string;
  locked?: boolean;
  doorFinish?: DoorFinish;
  roofFinish?: RoofFinish;
  wallFinish?: WallFinish;
  columnFinish?: ColumnFinish;
  stairsFinish?: StairsFinish;
  railingFinish?: RailingFinish;
  windowFinish?: WindowFinish;
  floorFinish?: FloorFinish;
  fenceFinish?: FenceFinish;
  pathFinish?: PathFinish;
  planterFinish?: PlanterFinish;
  benchFinish?: BenchFinish;
  chimneyFinish?: ChimneyFinish;
  lampFinish?: LampFinish;
  beamFinish?: BeamFinish;
  foundationFinish?: FoundationFinish;
  pergolaFinish?: PergolaFinish;
};

export type SceneLayer = { id: string; name: string; visible: boolean };

export const BASE_LAYER_ID = "layer-base";
export const GRID = 0.5;
export const SITE_RADIUS = 118;

export function snap(v: number) {
  return Math.round(v / GRID) * GRID;
}

export function clampToSite(x: number, z: number): [number, number] {
  const r = Math.hypot(x, z);
  if (r <= SITE_RADIUS) return [x, z];
  const s = SITE_RADIUS / (r || 1);
  return [x * s, z * s];
}

export function uid() {
  return `p-${Math.random().toString(36).slice(2, 10)}`;
}

export function partFrozen(part: ScenePart, layers: SceneLayer[]) {
  if (part.locked) return true;
  const layer = layers.find((l) => l.id === (part.layerId || BASE_LAYER_ID));
  return layer ? !layer.visible : false;
}

/** STUB: full texture/materials body (~95KB) lives in next push — types+helpers first so imports resolve. */
export type Materials = Record<string, THREE.MeshStandardMaterial>;

export function makeMaterials(): Materials {
  const mat = (color: string) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05 });
  return {
    wall: mat("#d8d0c4"),
    wallMasonry: mat("#9a9186"),
    floor: mat("#8b7355"),
    roof: mat("#6b3a2a"),
    roofMetal: mat("#6a7a88"),
    doorLeaf: mat("#8b5a32"),
    doorMetal: mat("#5a6570"),
    joinery: mat("#c4b8a8"),
    glazing: new THREE.MeshStandardMaterial({ color: "#6d8eaa", transparent: true, opacity: 0.45, roughness: 0.2 }),
    grass: mat("#4a7c3f"),
    gravel: mat("#a8a49c"),
    concrete: mat("#9a9a96"),
    brick: mat("#8a4e3a"),
    metal: mat("#5c6570"),
  };
}

export function disposeCatalogMaterials(mats: Materials) {
  for (const m of Object.values(mats)) {
    m.map?.dispose();
    m.normalMap?.dispose();
    m.roughnessMap?.dispose();
    m.dispose();
  }
}

export function staggerUvs(mesh: THREE.Mesh) {
  const g = mesh.geometry;
  if (!g.attributes.uv) return;
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, uv.getX(i) + 0.02 * (i % 3), uv.getY(i) + 0.01 * (i % 5));
  }
  uv.needsUpdate = true;
}

export function applyWallFinish(obj: THREE.Object3D, mats: Materials, finish: WallFinish) {
  obj.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = finish === "masonry" ? mats.wallMasonry : finish === "timber" ? mats.floor : mats.wall;
  });
}
export function applyColumnFinish(obj: THREE.Object3D, mats: Materials, finish: ColumnFinish) {
  applyWallFinish(obj, mats, finish === "timber" ? "timber" : finish === "masonry" ? "masonry" : "plaster");
}
export function applyStairsFinish(obj: THREE.Object3D, mats: Materials, _finish: StairsFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = mats.floor; });
}
export function applyDoorFinish(obj: THREE.Object3D, mats: Materials, finish: DoorFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = finish === "metal" ? mats.doorMetal : mats.doorLeaf; });
}
export function applyRoofFinish(obj: THREE.Object3D, mats: Materials, finish: RoofFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = finish === "metal" ? mats.roofMetal : mats.roof; });
}
export function applyWindowFinish(obj: THREE.Object3D, mats: Materials, _finish: WindowFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh && c.name !== "glass") (c as THREE.Mesh).material = mats.joinery; });
}
export function applyFloorFinish(obj: THREE.Object3D, mats: Materials, finish: FloorFinish) {
  const m = finish === "clay" ? mats.roof : finish === "masonry" ? mats.wallMasonry : mats.floor;
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = m; });
}
export function applyPathFinish(obj: THREE.Object3D, mats: Materials, finish: PathFinish) {
  const m = finish === "clay" ? mats.roof : finish === "masonry" ? mats.wallMasonry : mats.gravel;
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = m; });
}
export function applyPlanterFinish(obj: THREE.Object3D, mats: Materials, finish: PlanterFinish) {
  const m = finish === "timber" ? mats.floor : finish === "masonry" ? mats.wallMasonry : mats.roof;
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = m; });
}
export function applyChimneyFinish(obj: THREE.Object3D, mats: Materials, finish: ChimneyFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = finish === "masonry" ? mats.wallMasonry : mats.brick; });
}
export function applyLampFinish(obj: THREE.Object3D, mats: Materials, finish: LampFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = finish === "metal" ? mats.metal : mats.floor; });
}
export function applyBenchFinish(obj: THREE.Object3D, mats: Materials, finish: BenchFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = finish === "masonry" ? mats.wallMasonry : mats.floor; });
}
export function applyFenceFinish(obj: THREE.Object3D, mats: Materials, finish: FenceFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = finish === "metal" ? mats.metal : mats.floor; });
}
export function applyBeamFinish(obj: THREE.Object3D, mats: Materials, finish: BeamFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = finish === "metal" ? mats.metal : mats.floor; });
}
export function applyPergolaFinish(obj: THREE.Object3D, mats: Materials, finish: PergolaFinish) {
  applyBeamFinish(obj, mats, finish);
}
export function applyFoundationFinish(obj: THREE.Object3D, mats: Materials, finish: FoundationFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = finish === "masonry" ? mats.wallMasonry : mats.concrete; });
}
export function applyRailingFinish(obj: THREE.Object3D, mats: Materials, finish: RailingFinish) {
  obj.traverse((c) => { if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = finish === "metal" ? mats.metal : mats.floor; });
}

export function doorFinishOf(part: { doorFinish?: DoorFinish } | undefined, fallback: DoorFinish = "timber") { return part?.doorFinish ?? fallback; }
export function roofFinishOf(part: { roofFinish?: RoofFinish } | undefined, fallback: RoofFinish = "clay") { return part?.roofFinish ?? fallback; }
export function wallFinishOf(part: { wallFinish?: WallFinish } | undefined, fallback: WallFinish = "plaster") { return part?.wallFinish ?? fallback; }
export function columnFinishOf(part: { columnFinish?: ColumnFinish } | undefined, fallback: ColumnFinish = "plaster") { return part?.columnFinish ?? fallback; }
export function stairsFinishOf(part: { stairsFinish?: StairsFinish } | undefined, fallback: StairsFinish = "timber") { return part?.stairsFinish ?? fallback; }
export function railingFinishOf(part: { railingFinish?: RailingFinish } | undefined, fallback: RailingFinish = "timber") { return part?.railingFinish ?? fallback; }
export function windowFinishOf(part: { windowFinish?: WindowFinish } | undefined, fallback: WindowFinish = "timber") { return part?.windowFinish ?? fallback; }
export function floorFinishOf(part: { floorFinish?: FloorFinish } | undefined, fallback: FloorFinish = "timber") { return part?.floorFinish ?? fallback; }
export function fenceFinishOf(part: { fenceFinish?: FenceFinish } | undefined, fallback: FenceFinish = "timber") { return part?.fenceFinish ?? fallback; }
export function pathFinishOf(part: { pathFinish?: PathFinish } | undefined, fallback: PathFinish = "gravel") { return part?.pathFinish ?? fallback; }
export function planterFinishOf(part: { planterFinish?: PlanterFinish } | undefined, fallback: PlanterFinish = "clay") { return part?.planterFinish ?? fallback; }
export function benchFinishOf(part: { benchFinish?: BenchFinish } | undefined, fallback: BenchFinish = "timber") { return part?.benchFinish ?? fallback; }
export function chimneyFinishOf(part: { chimneyFinish?: ChimneyFinish } | undefined, fallback: ChimneyFinish = "brick") { return part?.chimneyFinish ?? fallback; }
export function lampFinishOf(part: { lampFinish?: LampFinish } | undefined, fallback: LampFinish = "timber") { return part?.lampFinish ?? fallback; }
export function beamFinishOf(part: { beamFinish?: BeamFinish } | undefined, fallback: BeamFinish = "timber") { return part?.beamFinish ?? fallback; }
export function foundationFinishOf(part: { foundationFinish?: FoundationFinish } | undefined, fallback: FoundationFinish = "concrete") { return part?.foundationFinish ?? fallback; }
export function pergolaFinishOf(part: { pergolaFinish?: PergolaFinish } | undefined, fallback: PergolaFinish = "timber") { return part?.pergolaFinish ?? fallback; }

export function syncLockBadge(_obj: THREE.Object3D, _on: boolean) {}
export function boxWithoutBadge(obj: THREE.Object3D, target: THREE.Box3) {
  target.setFromObject(obj);
  return target;
}
export function pointOnSitePlane(raycaster: THREE.Raycaster): THREE.Vector3 | null {
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  return raycaster.ray.intersectPlane(plane, hit) ? hit : null;
}
export function disposeObjectResources(obj: THREE.Object3D, disposeMaterials: boolean) {
  obj.traverse((c) => {
    const m = c as THREE.Mesh;
    if (m.isMesh) {
      m.geometry?.dispose();
      if (disposeMaterials) {
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      }
    }
  });
}
export function disposeLockBadge(_obj: THREE.Object3D) {}
