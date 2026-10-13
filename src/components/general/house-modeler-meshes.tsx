import * as THREE from "three";
import {
  type PartKind,
  type DoorFinish,
  type RoofFinish,
  type WallFinish,
  type ColumnFinish,
  type StairsFinish,
  type RailingFinish,
  type WindowFinish,
  type FloorFinish,
  type FenceFinish,
  type PathFinish,
  type PlanterFinish,
  type BenchFinish,
  type ChimneyFinish,
  type LampFinish,
  type BeamFinish,
  type FoundationFinish,
  type PergolaFinish,
  type Materials,
  staggerUvs,
} from "./house-modeler-materials";

// PLACEHOLDER_MESHES - will be filled in next commit if this succeeds as path create
export function createPartMesh() {
  return new THREE.Group();
}
export function StructureGlyph({ kind }: { kind: PartKind }) {
  return null;
}
