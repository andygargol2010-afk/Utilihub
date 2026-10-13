import * as THREE from "three";
import { type PartKind, type Materials, staggerUvs } from "./house-modeler-materials";

function box(w: number, h: number, d: number, mat: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  staggerUvs(mesh);
  return mesh;
}

/** Build a simple part group. Full detail meshes can replace these one-by-one without touching the 200KB UI shell. */
export function createPartMesh(kind: PartKind, mats: Materials): THREE.Group {
  const g = new THREE.Group();
  g.name = kind;
  const m = mats;

  if (kind === "wall") {
    const mesh = box(2, 2.4, 0.2, m.wall);
    mesh.position.y = 1.2;
    g.add(mesh);
  } else if (kind === "floor") {
    g.add(box(2, 0.12, 2, m.floor));
  } else if (kind === "roof") {
    const mesh = box(2.4, 0.15, 2.4, m.roof);
    mesh.position.y = 2.5;
    mesh.rotation.z = 0.08;
    g.add(mesh);
  } else if (kind === "column") {
    const mesh = box(0.35, 2.4, 0.35, m.wall);
    mesh.position.y = 1.2;
    g.add(mesh);
  } else if (kind === "door") {
    const mesh = box(1, 2.1, 0.08, m.doorLeaf);
    mesh.position.y = 1.05;
    g.add(mesh);
  } else if (kind === "window") {
    const frame = box(1.2, 1, 0.08, m.joinery);
    frame.position.y = 1.4;
    g.add(frame);
  } else if (kind === "stairs") {
    for (let i = 0; i < 4; i++) {
      const step = box(1.2, 0.15, 0.35, m.floor);
      step.position.set(0, 0.15 * i + 0.075, i * 0.3);
      g.add(step);
    }
  } else if (kind === "railing") {
    const rail = box(2, 0.08, 0.08, m.metal);
    rail.position.y = 1;
    g.add(rail);
  } else if (kind === "chimney") {
    const mesh = box(0.6, 1.5, 0.6, m.brick);
    mesh.position.y = 3.2;
    g.add(mesh);
  } else if (kind === "beam") {
    const mesh = box(2.5, 0.2, 0.2, m.floor);
    mesh.position.y = 2.3;
    g.add(mesh);
  } else if (kind === "foundation") {
    g.add(box(2.2, 0.4, 2.2, m.concrete));
  } else if (kind === "pergola") {
    for (const x of [-0.9, 0.9]) {
      const post = box(0.12, 2.2, 0.12, m.floor);
      post.position.set(x, 1.1, -0.9);
      g.add(post);
    }
  } else if (kind === "fence") {
    const mesh = box(2, 1.2, 0.08, m.floor);
    mesh.position.y = 0.6;
    g.add(mesh);
  } else if (kind === "path") {
    g.add(box(1.5, 0.05, 3, m.gravel));
  } else if (kind === "planter") {
    const mesh = box(0.8, 0.5, 0.8, m.roof);
    mesh.position.y = 0.25;
    g.add(mesh);
  } else if (kind === "bench") {
    const seat = box(1.4, 0.1, 0.45, m.floor);
    seat.position.y = 0.45;
    g.add(seat);
  } else {
    // lamp
    const post = box(0.1, 2, 0.1, m.floor);
    post.position.y = 1;
    g.add(post);
  }

  return g;
}

export function StructureGlyph({ kind }: { kind: PartKind }) {
  const common = "h-8 w-10";
  if (kind === "wall") {
    return (
      <svg viewBox="0 0 40 32" className={common} aria-hidden>
        <rect x="3" y="7" width="34" height="20" rx="1" fill="#d8d0c4" stroke="#8a7d6c" />
      </svg>
    );
  }
  if (kind === "roof") {
    return (
      <svg viewBox="0 0 40 32" className={common} aria-hidden>
        <path d="M4 22 L20 8 L36 22 Z" fill="#6b3a2a" stroke="#3d2218" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 32" className={common} aria-hidden>
      <rect x="8" y="8" width="24" height="16" rx="2" fill="#8b7355" stroke="#5c4634" />
    </svg>
  );
}
