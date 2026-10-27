import * as THREE from "three";

export interface AreaStats {
  floor: number;
  walls: number;
  roof: number;
}

interface Measurable {
  kind: string;
  obj: THREE.Object3D | null;
}

const box = new THREE.Box3();
const size = new THREE.Vector3();

/** Unrotated bounding size, so a yawed part is not inflated by its world AABB. */
function localSize(obj: THREE.Object3D): THREE.Vector3 {
  const yaw = obj.rotation.y;
  obj.rotation.y = 0;
  obj.updateMatrixWorld(true);
  box.setFromObject(obj).getSize(size);
  obj.rotation.y = yaw;
  obj.updateMatrixWorld(true);
  return size;
}

/** Gross floor, wall (long side x height, openings not subtracted) and roof (footprint) areas in m2. */
export function computeAreaStats(parts: Measurable[]): AreaStats {
  const out: AreaStats = { floor: 0, walls: 0, roof: 0 };
  for (const p of parts) {
    if (!p.obj || (p.kind !== "floor" && p.kind !== "wall" && p.kind !== "roof")) continue;
    const s = localSize(p.obj);
    if (p.kind === "wall") out.walls += Math.max(s.x, s.z) * s.y;
    else out[p.kind] += s.x * s.z;
  }
  return out;
}

export function formatAreaStats(a: AreaStats, es: boolean): string {
  const bits: string[] = [];
  if (a.floor > 0) bits.push(`${es ? "Suelo" : "Floor"} ${a.floor.toFixed(1)} m²`);
  if (a.walls > 0) bits.push(`${es ? "Muros" : "Walls"} ${a.walls.toFixed(1)} m²`);
  if (a.roof > 0) bits.push(`${es ? "Techo" : "Roof"} ${a.roof.toFixed(1)} m²`);
  return bits.join(" · ");
}
