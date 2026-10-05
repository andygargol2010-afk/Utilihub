import * as THREE from "three";
import {
  type PartKind,
  makeCanvasTexture,
  paintPlaster,
  paintPlasterBump,
  paintTimber,
  paintTimberBump,
  paintClayTiles,
  paintDoorLeaf,
  paintGlazing,
  paintJoinery,
  paintGrass,
  paintGravel,
} from "./house-modeler-textures";

export type { PartKind, Locale, ScenePart } from "./house-modeler-textures";
export { LAYER_COUNT, GRID, snap, disposeObjectResources, uid } from "./house-modeler-textures";

export function makeMaterials() {
  const TEX = 128;
  const wallMap = makeCanvasTexture(TEX, paintPlaster, true);
  const timberMap = makeCanvasTexture(TEX, paintTimber, true);
  const tileMap = makeCanvasTexture(TEX, paintClayTiles, true);
  const doorMap = makeCanvasTexture(TEX, paintDoorLeaf, true);
  const glassMap = makeCanvasTexture(TEX, paintGlazing, true);
  const joinMap = makeCanvasTexture(TEX, paintJoinery, true);
  const grassMap = makeCanvasTexture(TEX, paintGrass, true);
  const gravelMap = makeCanvasTexture(TEX, paintGravel, true);

  const mat = (map: THREE.Texture | null, color: number, rough = 0.85) => {
    const m = new THREE.MeshStandardMaterial({
      color,
      map: map ?? undefined,
      roughness: rough,
      metalness: 0.02,
    });
    if (map) m.map!.colorSpace = THREE.SRGBColorSpace;
    return m;
  };

  return {
    wall: mat(wallMap, 0xd6ccbc, 0.9),
    timber: mat(timberMap, 0x8b5a32, 0.75),
    roof: mat(tileMap, 0x6b3a2a, 0.88),
    door: mat(doorMap, 0x7a4e30, 0.7),
    glass: new THREE.MeshStandardMaterial({
      color: 0x9bb7c9,
      map: glassMap ?? undefined,
      transparent: true,
      opacity: 0.45,
      roughness: 0.15,
      metalness: 0.1,
    }),
    joinery: mat(joinMap, 0x6d4a30, 0.7),
    grass: mat(grassMap, 0x5a7a40, 0.95),
    gravel: mat(gravelMap, 0x8a8070, 0.92),
  };
}

export type HouseMats = ReturnType<typeof makeMaterials>;

export function disposeCatalogMaterials(mats: HouseMats) {
  for (const v of Object.values(mats)) {
    if (v instanceof THREE.Material) {
      const tex = (v as THREE.MeshStandardMaterial).map;
      tex?.dispose();
      v.dispose();
    }
  }
}

function box(w: number, h: number, d: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function createPartMesh(kind: PartKind, mats: HouseMats): THREE.Object3D {
  const root = new THREE.Group();
  if (kind === "wall") {
    const m = box(3, 2.6, 0.2, mats.wall);
    m.position.y = 1.3;
    root.add(m);
    const plate = box(3.05, 0.12, 0.28, mats.timber);
    plate.position.y = 2.65;
    root.add(plate);
  } else if (kind === "floor") {
    const m = box(3, 0.12, 3, mats.timber);
    m.position.y = 0.06;
    root.add(m);
  } else if (kind === "roof") {
    const m = box(3.4, 0.15, 3.2, mats.roof);
    m.position.y = 2.85;
    m.rotation.x = -0.15;
    root.add(m);
  } else if (kind === "column") {
    const m = box(0.4, 2.6, 0.4, mats.wall);
    m.position.y = 1.3;
    root.add(m);
  } else if (kind === "door") {
    const frame = box(1.1, 2.2, 0.12, mats.joinery);
    frame.position.y = 1.1;
    root.add(frame);
    const leaf = box(0.96, 2.05, 0.06, mats.door);
    leaf.position.set(0, 1.05, 0.04);
    root.add(leaf);
  } else if (kind === "window") {
    const frame = box(1.3, 1.25, 0.12, mats.joinery);
    frame.position.y = 1.5;
    root.add(frame);
    const glass = box(1.1, 1.05, 0.04, mats.glass);
    glass.position.y = 1.5;
    root.add(glass);
  } else if (kind === "stairs") {
    for (let i = 0; i < 6; i++) {
      const step = box(1.0, 0.14, 0.28, mats.timber);
      step.position.set(0, 0.07 + i * 0.17, i * 0.28);
      root.add(step);
    }
  } else if (kind === "railing") {
    const rail = box(1.8, 0.08, 0.08, mats.timber);
    rail.position.y = 0.95;
    root.add(rail);
    for (let i = 0; i < 5; i++) {
      const post = box(0.06, 0.95, 0.06, mats.timber);
      post.position.set(-0.8 + i * 0.4, 0.475, 0);
      root.add(post);
    }
  } else if (kind === "chimney") {
    const m = box(0.7, 3.0, 0.7, mats.wall);
    m.position.y = 1.5;
    root.add(m);
  } else if (kind === "beam") {
    const m = box(2.5, 0.25, 0.25, mats.timber);
    m.position.y = 2.5;
    root.add(m);
  } else {
    const m = box(1, 1, 1, mats.wall);
    m.position.y = 0.5;
    root.add(m);
  }
  return root;
}
