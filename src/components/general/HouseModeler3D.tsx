import { useEffect, useRef, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import * as THREE from "three";
import { Sky } from "three/addons/objects/Sky.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

type PartKind = "wall" | "floor" | "roof" | "column" | "door" | "beam";

type Labels = { es: string; en: string };

const PARTS: { kind: PartKind; label: Labels; shortcut: string }[] = [
  { kind: "wall", label: { es: "Muro", en: "Wall" }, shortcut: "1" },
  { kind: "floor", label: { es: "Suelo", en: "Floor" }, shortcut: "2" },
  { kind: "roof", label: { es: "Tejado", en: "Roof" }, shortcut: "3" },
  { kind: "column", label: { es: "Columna", en: "Column" }, shortcut: "4" },
  { kind: "door", label: { es: "Puerta", en: "Door" }, shortcut: "5" },
  { kind: "beam", label: { es: "Viga", en: "Beam" }, shortcut: "6" },
];

/** Shared catalog maps — never disposed on part delete. */
const catalogMaps = new Map<string, THREE.CanvasTexture>();

function canvasTex(key: string, size: number, paint: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const hit = catalogMaps.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  paint(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  catalogMaps.set(key, tex);
  return tex;
}

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Default beam timber: warm oak grain, color variation, knot, edge wear.
 * Color map stays sRGB; roughness is linear data.
 */
function beamOakMaps() {
  const color = canvasTex("beam-oak-color-v1", 512, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, 0);
    g.addColorStop(0, "#6b4a2e");
    g.addColorStop(0.45, "#8a6240");
    g.addColorStop(1, "#5c3e28");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 1) {
      const band = 0.55 + hash(y * 3.1) * 0.45;
      ctx.fillStyle = `rgba(62, 36, 18, ${0.04 + (y % 7 === 0 ? 0.12 : 0.03) * band})`;
      ctx.fillRect(0, y, s, 1);
      if (y % 11 === 0) {
        ctx.fillStyle = `rgba(214, 176, 122, ${0.05 + hash(y) * 0.08})`;
        ctx.fillRect(0, y, s, 1);
      }
    }
    const kx = 150 + hash(4) * 180;
    const ky = 200 + hash(9) * 120;
    const knot = ctx.createRadialGradient(kx, ky, 4, kx, ky, 46);
    knot.addColorStop(0, "rgba(48, 28, 16, 0.72)");
    knot.addColorStop(0.45, "rgba(92, 58, 32, 0.35)");
    knot.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = knot;
    ctx.beginPath();
    ctx.ellipse(kx, ky, 34, 22, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(40, 22, 12, 0.28)";
    ctx.fillRect(0, 0, 18, s);
    ctx.fillRect(s - 16, 0, 16, s);
  });
  const rough = canvasTex("beam-oak-rough-v1", 256, (ctx, s) => {
    ctx.fillStyle = "#b8b8b8";
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y++) {
      const v = 150 + Math.floor(hash(y * 1.7) * 70);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(0, y, s, 1);
    }
    ctx.fillStyle = "#6a6a6a";
    ctx.fillRect(0, 0, 10, s);
    ctx.fillRect(s - 10, 0, 10, s);
  });
  rough.colorSpace = THREE.NoColorSpace;
  return { color, rough };
}

function solidMat(color: string, roughness: number, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function materials() {
  const oak = beamOakMaps();
  return {
    wall: solidMat("#d7cbb8", 0.86),
    floor: solidMat("#c4b49a", 0.8),
    roof: solidMat("#8d4b34", 0.78),
    column: solidMat("#cfc3ae", 0.84),
    door: solidMat("#6e4630", 0.62),
    beam: new THREE.MeshStandardMaterial({
      map: oak.color,
      roughnessMap: oak.rough,
      color: "#e7d3bc",
      roughness: 0.78,
      metalness: 0.02,
    }),
  };
}

function createPartMesh(kind: PartKind, mats: ReturnType<typeof materials>) {
  const group = new THREE.Group();
  group.userData.kind = kind;
  const add = (mesh: THREE.Mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };
  if (kind === "wall") {
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.2), mats.wall);
    m.position.y = 1.2;
    add(m);
  } else if (kind === "floor") {
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 2.4), mats.floor);
    m.position.y = 0.04;
    add(m);
  } else if (kind === "roof") {
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 2.6), mats.roof);
    m.position.y = 2.5;
    add(m);
  } else if (kind === "column") {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.4, 0.28), mats.column);
    m.position.y = 1.2;
    add(m);
  } else if (kind === "door") {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.05, 0.08), mats.door);
    m.position.y = 1.02;
    add(m);
  } else {
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 0.16), mats.beam);
    m.position.y = 2.35;
    add(m);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.02, 0.18), mats.beam);
    cap.position.y = 2.45;
    add(cap);
  }
  return group;
}

export function HouseModeler3D(props: { tool: GeneralTool; locale?: "en" | "es" }) {
  const locale = props.locale === "en" ? "en" : "es";
  const host = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<PartKind>("beam");
  const kindRef = useRef(kind);
  kindRef.current = kind;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#c9d7e4", 18, 48);
    const camera = new THREE.PerspectiveCamera(48, el.clientWidth / Math.max(el.clientHeight, 1), 0.1, 80);
    camera.position.set(6, 4.5, 8);

    const sky = new Sky();
    sky.scale.setScalar(450);
    const uniforms = sky.material.uniforms;
    uniforms.turbidity.value = 4;
    uniforms.rayleigh.value = 1.4;
    uniforms.mieCoefficient.value = 0.004;
    uniforms.mieDirectionalG.value = 0.7;
    uniforms.sunPosition.value.set(8, 12, 4);
    scene.add(sky);

    scene.add(new THREE.HemisphereLight("#f3efe4", "#8a7a68", 0.45));
    const sun = new THREE.DirectionalLight("#fff4e4", 1.35);
    sun.position.set(8, 14, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 32;
    sun.shadow.radius = 2;
    scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(16, 48),
      new THREE.MeshStandardMaterial({ color: "#b7a88f", roughness: 0.95 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const mats = materials();
    const parts = new THREE.Group();
    scene.add(parts);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1.1, 0);

    const ray = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onClick = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObject(ground, false)[0];
      if (!hit) return;
      const piece = createPartMesh(kindRef.current, mats);
      piece.position.set(Math.round(hit.point.x * 2) / 2, 0, Math.round(hit.point.z * 2) / 2);
      parts.add(piece);
    };
    renderer.domElement.addEventListener("pointerdown", onClick);

    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / Math.max(el.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onClick);
      controls.dispose();
      parts.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      for (const mat of Object.values(mats)) mat.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  const t = (label: Labels) => label[locale];

  return (
    <div className="flex h-[70vh] min-h-[420px] gap-3">
      <div ref={host} className="relative min-w-0 flex-1 overflow-hidden rounded-xl border border-stone-300 bg-stone-200" />
      <aside className="flex w-40 shrink-0 flex-col gap-2">
        <p className="text-xs font-medium text-stone-600">
          {locale === "es" ? "Piezas" : "Parts"}
        </p>
        {PARTS.map((part) => (
          <button
            key={part.kind}
            type="button"
            onClick={() => setKind(part.kind)}
            className={`rounded-lg border px-2 py-2 text-left text-sm ${kind === part.kind ? "border-amber-700 bg-amber-50" : "border-stone-300 bg-white"}`}
          >
            <span className="font-medium">{t(part.label)}</span>
            <span className="ml-1 text-xs text-stone-500">{part.shortcut}</span>
          </button>
        ))}
        <p className="mt-2 text-xs leading-snug text-stone-500">
          {locale === "es"
            ? "Viga: roble por defecto con veta, nudo y canto oscuro."
            : "Beam: default oak with grain, knot and darkened edge."}
        </p>
      </aside>
    </div>
  );
}
