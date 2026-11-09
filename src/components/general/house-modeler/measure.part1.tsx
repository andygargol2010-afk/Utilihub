// Part 1 of 3 — split from measure.tsx on 2026-11-04. Edit here; measure.tsx re-exports.
import * as THREE from "three";

export interface Measure {
  active: boolean;
  setActive: (on: boolean) => void;
  /** Re-pin the distance label; call once per frame. */
  update: (camera: THREE.Camera) => void;
  dispose: () => void;
}

export const M_TO_FT = 3.28084;
export const LINE_Y = 0.06;
