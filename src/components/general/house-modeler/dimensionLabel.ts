import * as THREE from "three";

export interface DimensionLabel {
  /** Show the W x H x D of a BoxHelper's geometry pinned above it, or hide when `helper` is null. */
  update: (helper: THREE.BoxHelper | null, camera: THREE.Camera) => void;
  dispose: () => void;
}

const size = new THREE.Vector3();
const anchor = new THREE.Vector3();

/** Floating "W × H × D m" readout over the selected part. DOM overlay, so no extra render cost. */
export function createDimensionLabel(host: HTMLElement): DimensionLabel {
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:absolute;left:0;top:0;display:none;pointer-events:none;z-index:5;padding:2px 6px;border-radius:6px;" +
    "font:600 11px ui-monospace,monospace;color:#fff7e6;background:rgba(120,70,20,.88);white-space:nowrap;" +
    "transform:translate(-50%,-100%);box-shadow:0 1px 4px rgba(0,0,0,.35)";
  host.appendChild(el);
  let last = "";
  return {
    update(helper, camera) {
      helper?.geometry.computeBoundingBox();
      const box = helper?.geometry.boundingBox;
      if (!box || box.isEmpty()) {
        el.style.display = "none";
        return;
      }
      box.getSize(size);
      anchor.set((box.min.x + box.max.x) / 2, box.max.y, (box.min.z + box.max.z) / 2).project(camera);
      if (anchor.z > 1) {
        el.style.display = "none";
        return;
      }
      const text = `${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)} m`;
      if (text !== last) {
        el.textContent = text;
        last = text;
      }
      const x = Math.min(host.clientWidth - 8, Math.max(8, ((anchor.x + 1) / 2) * host.clientWidth));
      const y = Math.min(host.clientHeight - 4, Math.max(24, ((1 - anchor.y) / 2) * host.clientHeight - 6));
      el.style.transform = `translate(-50%,-100%) translate(${x}px,${y}px)`;
      el.style.display = "block";
    },
    dispose() {
      el.remove();
    },
  };
}
