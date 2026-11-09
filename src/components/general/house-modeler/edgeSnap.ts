import * as THREE from "three";

/** How close (m) an edge must be to a neighbour's edge before it is pulled flush. */
const REACH = 0.3;

type Rect = { x0: number; x1: number; z0: number; z1: number };

function rectOf(o: THREE.Object3D): Rect {
  o.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(o);
  return { x0: b.min.x, x1: b.max.x, z0: b.min.z, z1: b.max.z };
}

/** Best shift along one axis that makes an edge of `a` line up with an edge of a neighbour range (or 0). */
function pull(a0: number, a1: number, ranges: [number, number][]): number {
  let best = 0;
  let bestAbs = REACH;
  for (const [b0, b1] of ranges) {
    for (const d of [b1 - a0, b0 - a1, b0 - a0, b1 - a1]) {
      if (Math.abs(d) < bestAbs) (best = d), (bestAbs = Math.abs(d));
    }
  }
  return best;
}

/**
 * Pulls a part (or ghost) placed at grid position x,z flush against nearby parts so walls meet end to end.
 * Roofs are skipped on both sides. Returns the adjusted position (unchanged when nothing is near).
 */
export function flushToNeighbors(
  root: THREE.Object3D,
  obj: THREE.Object3D,
  x: number,
  z: number,
  skip: (partId: string) => boolean,
): [number, number] {
  const own = rectOf(obj);
  const dx = x - obj.position.x;
  const dz = z - obj.position.z;
  const a = { x0: own.x0 + dx, x1: own.x1 + dx, z0: own.z0 + dz, z1: own.z1 + dz };
  const nearX: [number, number][] = [];
  const nearZ: [number, number][] = [];
  for (const c of root.children) {
    const id = c.userData.partId as string | undefined;
    if (c === obj || !c.visible || !id || skip(id)) continue;
    const r = rectOf(c);
    // A neighbour only counts on one axis when the parts overlap (or nearly touch) on the other axis.
    if (r.z1 >= a.z0 - REACH && r.z0 <= a.z1 + REACH) nearX.push([r.x0, r.x1]);
    if (r.x1 >= a.x0 - REACH && r.x0 <= a.x1 + REACH) nearZ.push([r.z0, r.z1]);
  }
  return [x + pull(a.x0, a.x1, nearX), z + pull(a.z0, a.z1, nearZ)];
}
