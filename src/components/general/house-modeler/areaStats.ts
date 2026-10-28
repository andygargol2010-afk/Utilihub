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

/** Typical opening sizes (m2) taken out of the wall area: 1.0 x 2.0 door, 1.2 x 1.1 window. */
const OPENING: Record<string, number> = { door: 2.0, window: 1.3 };

/** Floor, net wall (long side x height minus door/window openings) and roof (footprint) areas in m2. */
export function computeAreaStats(parts: Measurable[]): AreaStats {
  const out: AreaStats = { floor: 0, walls: 0, roof: 0 };
  for (const p of parts) {
    if (OPENING[p.kind]) out.walls -= OPENING[p.kind];
    if (!p.obj || (p.kind !== "floor" && p.kind !== "wall" && p.kind !== "roof")) continue;
    const s = localSize(p.obj);
    if (p.kind === "wall") out.walls += Math.max(s.x, s.z) * s.y;
    else out[p.kind] += s.x * s.z;
  }
  out.walls = Math.max(0, out.walls);
  return out;
}

export function formatAreaStats(a: AreaStats, es: boolean): string {
  const bits: string[] = [];
  if (a.floor > 0) bits.push(`${es ? "Suelo" : "Floor"} ${a.floor.toFixed(1)} m²`);
  if (a.walls > 0) bits.push(`${es ? "Muros netos" : "Net walls"} ${a.walls.toFixed(1)} m²`);
  if (a.roof > 0) bits.push(`${es ? "Techo" : "Roof"} ${a.roof.toFixed(1)} m²`);
  return bits.join(" · ");
}
