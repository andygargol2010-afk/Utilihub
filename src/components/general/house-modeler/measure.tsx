import * as THREE from "three";

export interface Measure {
  active: boolean;
  setActive: (on: boolean) => void;
  /** Re-pin the distance label; call once per frame. */
  update: (camera: THREE.Camera) => void;
  dispose: () => void;
}

const M_TO_FT = 3.28084;
const LINE_Y = 0.06;

/** Two-click ruler on the ground. Taps (not drags) add points, so orbiting still works while measuring. */
export function createMeasure(
  host: HTMLElement,
  scene: THREE.Scene,
  camera: THREE.Camera,
  ground: THREE.Object3D,
  canvas: HTMLCanvasElement,
  snap: (v: number) => number,
): Measure {
  const group = new THREE.Group();
  group.visible = false;
  scene.add(group);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, depthTest: false, transparent: true });
  const dotMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, depthTest: false, transparent: true });
  const dotGeo = new THREE.SphereGeometry(0.12, 12, 8);
  const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const line = new THREE.Line(lineGeo, lineMat);
  line.renderOrder = 999;
  line.visible = false;
  const dots: THREE.Mesh[] = [new THREE.Mesh(dotGeo, dotMat), new THREE.Mesh(dotGeo, dotMat)];
  dots.forEach((d) => {
    d.renderOrder = 999;
    d.visible = false;
  });
  group.add(line, ...dots);

  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.setAttribute("data-testid", "measure-label");
  el.style.cssText =
    "position:absolute;left:0;top:0;display:none;pointer-events:none;z-index:5;padding:2px 6px;border-radius:6px;" +
    "font:600 12px ui-monospace,monospace;color:#052e36;background:rgba(103,232,249,.95);white-space:nowrap;" +
    "box-shadow:0 1px 4px rgba(0,0,0,.35)";
  host.appendChild(el);

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pts: THREE.Vector3[] = [];
  const mid = new THREE.Vector3();
  let down: { x: number; y: number; t: number } | null = null;

  const render = () => {
    dots.forEach((dot, i) => {
      const p = pts[i];
      dot.visible = !!p;
      if (p) dot.position.copy(p);
    });
    const [a, b] = pts;
    if (a && b) {
      lineGeo.setFromPoints([a, b]);
      line.visible = true;
      const d = a.distanceTo(b);
      el.textContent = `${d.toFixed(2)} m · ${(d * M_TO_FT).toFixed(1)} ft`;
    } else {
      line.visible = false;
      el.style.display = "none";
    }
  };

  const onDown = (e: PointerEvent) => {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onUp = (e: PointerEvent) => {
    const d0 = down;
    down = null;
    if (!api.active || !d0 || (e.pointerType === "mouse" && e.button !== 0)) return;
    if (Math.hypot(e.clientX - d0.x, e.clientY - d0.y) > 6 || performance.now() - d0.t > 600) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObject(ground)[0];
    if (!hit) return;
    const p = new THREE.Vector3(snap(hit.point.x), LINE_Y, snap(hit.point.z));
    if (pts.length >= 2) pts.length = 0;
    pts.push(p);
    render();
  };
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);

  const api: Measure = {
    active: false,
    setActive(on) {
      api.active = on;
      group.visible = on;
      canvas.style.cursor = on ? "crosshair" : "";
      if (!on) {
        pts.length = 0;
        render();
      }
    },
    update(cam) {
      const [a, b] = pts;
      if (!api.active || !a || !b) return;
      mid.copy(a).add(b).multiplyScalar(0.5).project(cam);
      if (mid.z > 1) {
        el.style.display = "none";
        return;
      }
      const x = Math.min(host.clientWidth - 8, Math.max(8, ((mid.x + 1) / 2) * host.clientWidth));
      const y = Math.min(host.clientHeight - 4, Math.max(24, ((1 - mid.y) / 2) * host.clientHeight));
      el.style.transform = `translate(-50%,-130%) translate(${x}px,${y}px)`;
      el.style.display = "block";
    },
    dispose() {
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      canvas.style.cursor = "";
      scene.remove(group);
      lineGeo.dispose();
      lineMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      el.remove();
    },
  };
  return api;
}

export function MeasureButton({ es, active, onToggle }: { es: boolean; active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      data-testid="measure-tool"
      aria-pressed={active}
      onClick={onToggle}
      aria-label={es ? "Medir distancia entre dos puntos del suelo" : "Measure the distance between two ground points"}
      title={es ? "Toca dos puntos del suelo para medir" : "Click two ground points to measure"}
      className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent ${active ? "border-cyan-500 bg-cyan-100 text-cyan-900 dark:bg-cyan-900/40 dark:text-cyan-100" : "border-border bg-card"}`}
    >
      {es ? "Medir 📏" : "Measure 📏"}
    </button>
  );
}
