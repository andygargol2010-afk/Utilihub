import { clampPos, snapVal } from "./modeler3d-helpers";

export function makeAlignApi(deps: {
  threeRef: any;
  selectedIdsRef: any;
  selectedIdRef: any;
  groupsRef: any;
  pushHistory: () => void;
  readTransform: (id: string | null) => void;
}) {
  const { threeRef, selectedIdsRef, selectedIdRef, groupsRef, pushHistory, readTransform } = deps;

  const getObjectBox = (id: string) => {
    const t = threeRef.current;
    if (!t) return null;
    const g = groupsRef.current.get(id);
    const obj = g?.groupObj || t.meshes.get(id);
    if (!obj) return null;
    obj.updateMatrixWorld(true);
    const box = new t.THREE.Box3().setFromObject(obj);
    if (box.isEmpty()) return null;
    return box;
  };

  const dropToFloor = () => {
    const t = threeRef.current;
    if (!t) return;
    const ids = selectedIdsRef.current.filter((id: string) => t.meshes.has(id));
    if (!ids.length) return;
    pushHistory();
    for (const id of ids) {
      const box = getObjectBox(id);
      const g = groupsRef.current.get(id);
      const obj = g?.groupObj || t.meshes.get(id);
      if (!box || !obj) continue;
      obj.position.y = clampPos(obj.position.y - box.min.y);
    }
    const primary = selectedIdRef.current;
    if (primary) readTransform(primary);
  };

  const alignSelection = (axis: "x" | "y" | "z", mode: "min" | "center" | "max") => {
    const t = threeRef.current;
    if (!t) return;
    const ids = selectedIdsRef.current.filter((id: string) => t.meshes.has(id));
    if (ids.length < 2) return;
    const boxes = ids.map((id: string) => ({ id, box: getObjectBox(id) })).filter((x: any) => x.box);
    if (boxes.length < 2) return;
    pushHistory();
    let refMin = Infinity, refMax = -Infinity;
    for (const { box } of boxes) {
      const mn = axis === "x" ? box.min.x : axis === "y" ? box.min.y : box.min.z;
      const mx = axis === "x" ? box.max.x : axis === "y" ? box.max.y : box.max.z;
      if (mn < refMin) refMin = mn;
      if (mx > refMax) refMax = mx;
    }
    const refCenter = (refMin + refMax) / 2;
    const target = mode === "min" ? refMin : mode === "max" ? refMax : refCenter;
    for (const { id, box } of boxes) {
      const g = groupsRef.current.get(id);
      const obj = g?.groupObj || t.meshes.get(id);
      if (!obj) continue;
      const mn = axis === "x" ? box.min.x : axis === "y" ? box.min.y : box.min.z;
      const mx = axis === "x" ? box.max.x : axis === "y" ? box.max.y : box.max.z;
      const ctr = (mn + mx) / 2;
      const current = mode === "min" ? mn : mode === "max" ? mx : ctr;
      const delta = target - current;
      if (axis === "x") obj.position.x = clampPos(obj.position.x + delta);
      else if (axis === "y") obj.position.y = clampPos(obj.position.y + delta);
      else obj.position.z = clampPos(obj.position.z + delta);
    }
    const primary = selectedIdRef.current;
    if (primary) readTransform(primary);
  };

  const snapTranslateLive = (primaryId: string) => {
    const t = threeRef.current;
    if (!t) return;
    const step = (t as any).snapStep as number;
    if (!step || step <= 0) return;
    const threshold = Math.max(step * 0.55, 0.12);
    const primary = t.meshes.get(primaryId);
    if (!primary || groupsRef.current.has(primaryId)) return;
    const candidatesX: number[] = [];
    const candidatesY: number[] = [];
    const candidatesZ: number[] = [];
    for (const [oid, mesh] of t.meshes) {
      if (oid === primaryId || selectedIdsRef.current.includes(oid)) continue;
      if (!mesh) continue;
      mesh.updateMatrixWorld?.(true);
      const box = new t.THREE.Box3().setFromObject(mesh);
      if (box.isEmpty()) continue;
      candidatesX.push(box.min.x, box.max.x, (box.min.x + box.max.x) / 2);
      candidatesY.push(box.min.y, box.max.y, (box.min.y + box.max.y) / 2);
      candidatesZ.push(box.min.z, box.max.z, (box.min.z + box.max.z) / 2);
    }
    primary.position.x = snapVal(primary.position.x, step);
    primary.position.y = snapVal(primary.position.y, step);
    primary.position.z = snapVal(primary.position.z, step);
    primary.updateMatrixWorld(true);
    const pb = new t.THREE.Box3().setFromObject(primary);
    if (pb.isEmpty()) return;
    const edgeSnap = (axis: "x" | "y" | "z", candidates: number[]) => {
      const mn = axis === "x" ? pb.min.x : axis === "y" ? pb.min.y : pb.min.z;
      const mx = axis === "x" ? pb.max.x : axis === "y" ? pb.max.y : pb.max.z;
      const ct = (mn + mx) / 2;
      const opts = [mn, mx, ct];
      let bestDelta = 0, bestD = threshold + 1;
      for (const o of opts) {
        for (const c of candidates) {
          const d = Math.abs(c - o);
          if (d < bestD && d <= threshold) { bestD = d; bestDelta = c - o; }
        }
      }
      if (axis === "y") {
        const dBase = Math.abs(mn - 0);
        if (dBase < bestD && dBase <= threshold) { bestD = dBase; bestDelta = 0 - mn; }
      }
      if (bestD <= threshold) {
        if (axis === "x") primary.position.x = clampPos(primary.position.x + bestDelta);
        else if (axis === "y") primary.position.y = clampPos(primary.position.y + bestDelta);
        else primary.position.z = clampPos(primary.position.z + bestDelta);
        primary.updateMatrixWorld(true);
        const nb = new t.THREE.Box3().setFromObject(primary);
        if (!nb.isEmpty()) {
          if (axis === "x") { pb.min.x = nb.min.x; pb.max.x = nb.max.x; }
          else if (axis === "y") { pb.min.y = nb.min.y; pb.max.y = nb.max.y; }
          else { pb.min.z = nb.min.z; pb.max.z = nb.max.z; }
        }
      }
    };
    edgeSnap("x", candidatesX);
    edgeSnap("y", candidatesY);
    edgeSnap("z", candidatesZ);
  };

  return { dropToFloor, alignSelection, snapTranslateLive };
}
