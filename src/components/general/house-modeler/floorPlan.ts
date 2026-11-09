import type * as THREE from "three";
import { localSize } from "./areaStats";

interface PlanPart {
  kind: string;
  obj: THREE.Object3D | null;
}

const FILL: Record<string, string> = {
  floor: "#e9e2d3", path: "#d6d0c4", foundation: "#cfcac0", wall: "#2f3438", door: "#b9772e", window: "#6aaee0",
  column: "#4a4f55", stairs: "#a89880", railing: "#6b7075", chimney: "#8a4b38", beam: "#7a5a3a", pergola: "#9a7a52",
  fence: "#8a8f94", planter: "#6e9a5a", bench: "#8a6a44", lamp: "#e0b94a",
};
const ORDER = ["foundation", "path", "floor", "stairs", "planter", "wall", "railing", "fence", "column", "beam", "pergola", "chimney", "bench", "lamp", "window", "door", "roof"];

/** Draw a top-down floor plan of the design on a 2D canvas (walls dark, roofs dashed) with overall size labels and a scale bar. */
export function drawFloorPlan(parts: PlanPart[], es: boolean): HTMLCanvasElement | null {
  const items = parts
    .filter((p) => p.obj)
    .map((p) => {
      const o = p.obj as THREE.Object3D;
      const s = localSize(o);
      return { kind: p.kind, x: o.position.x, z: o.position.z, w: Math.max(s.x, 0.15), d: Math.max(s.z, 0.15), r: o.rotation.y };
    });
  if (!items.length) return null;
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const i of items) {
    const e = (Math.abs(Math.cos(i.r)) * i.w + Math.abs(Math.sin(i.r)) * i.d) / 2;
    const f = (Math.abs(Math.sin(i.r)) * i.w + Math.abs(Math.cos(i.r)) * i.d) / 2;
    x0 = Math.min(x0, i.x - e); x1 = Math.max(x1, i.x + e); z0 = Math.min(z0, i.z - f); z1 = Math.max(z1, i.z + f);
  }
  const W = x1 - x0, D = z1 - z0, pad = 90;
  const k = Math.min(1100 / Math.max(W, 1), 800 / Math.max(D, 1));
  const c = document.createElement("canvas");
  c.width = Math.round(W * k + pad * 2);
  c.height = Math.round(D * k + pad * 2 + 40);
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, c.width, c.height);
  const px = (x: number) => pad + (x - x0) * k;
  const pz = (z: number) => pad + (z - z0) * k;
  for (const kind of ORDER) {
    for (const i of items) {
      if (i.kind !== kind) continue;
      g.save();
      g.translate(px(i.x), pz(i.z));
      g.rotate(i.r);
      if (kind === "roof") {
        g.setLineDash([8, 6]); g.strokeStyle = "#a0462f"; g.lineWidth = 2;
        g.strokeRect(-i.w * k / 2, -i.d * k / 2, i.w * k, i.d * k);
      } else {
        g.fillStyle = FILL[kind] ?? "#888";
        g.fillRect(-i.w * k / 2, -i.d * k / 2, i.w * k, i.d * k);
        g.strokeStyle = "#00000040"; g.lineWidth = 1;
        g.strokeRect(-i.w * k / 2, -i.d * k / 2, i.w * k, i.d * k);
      }
      g.restore();
    }
  }
  g.fillStyle = "#111"; g.font = "bold 20px sans-serif"; g.textAlign = "center";
  g.fillText(`${W.toFixed(1)} m (${(W * 3.2808).toFixed(1)} ft)`, c.width / 2, pad - 40);
  g.save(); g.translate(pad - 40, c.height / 2 - 20); g.rotate(-Math.PI / 2);
  g.fillText(`${D.toFixed(1)} m (${(D * 3.2808).toFixed(1)} ft)`, 0, 0); g.restore();
  const bar = 1 * k >= 40 ? 1 : 5; // 1 m or 5 m scale bar
  g.fillRect(pad, c.height - 52, bar * k, 6);
  g.font = "16px sans-serif"; g.textAlign = "left";
  g.fillText(`${bar} m`, pad + bar * k + 10, c.height - 45);
  g.textAlign = "right"; g.fillStyle = "#666";
  g.fillText(es ? "Planta — UtiliHub Modelador de casas 3D" : "Floor plan — UtiliHub 3D House Modeler", c.width - pad, c.height - 45);
  return c;
}

/** Download the floor plan as PNG. Returns false when there is nothing to draw or the browser blocked it. */
export function exportFloorPlanPng(parts: PlanPart[], es: boolean): boolean {
  try {
    const c = drawFloorPlan(parts, es);
    if (!c) return false;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = `floor-plan-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  } catch {
    return false;
  }
}
