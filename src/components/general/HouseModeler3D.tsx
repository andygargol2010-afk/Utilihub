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

function railin