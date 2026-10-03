import type { GeneralTool } from "@/lib/general/types";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

type PartKind = "wall" | "floor" | "roof";
type Locale = "en" | "es";

type ScenePart = {
  id: string;
  kind: PartKind;
  position: [number, number, number];
  rotationY: number;
  mesh: THREE.Mesh;
};

const GRID = 0.5;

function snap(v: number) {
  return Math.round(v / GRID) * GRID;
}

/** Dispose unique geometries. Materials only when they are not the shared catalog set (ghost clones). */
function disposeObjectResources(obj: THREE.Object3D, disposeMaterials: boolean) {
  obj.traverse((c) => {
    if (c instanceof THREE.Mesh || c instanceof THREE.Line) {
      c.geometry?.dispose();
      if (disposeMaterials) {
        const mat = c.material;
        const list = Array.isArray(mat) ? mat : [mat];
        for (const m of list) m?.dispose();
      }
    }
  });
}

function uid() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function hash2(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Procedural albedo/roughness ≤256px. Shared across parts; do not dispose on ghost clones. */
function makeCanvasTexture(
  size: number,
  paint: (ctx: CanvasRenderingContext2D, size: number) => void,
  srgb: boolean,
) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  paint(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function noiseFill(
  ctx: CanvasRenderingContext2D,
  size: number,
  base: [number, number, number],
  amp: number,
) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = (hash2(x * 0.73, y * 0.73) - 0.5) * amp;
      const coarse = (hash2(Math.floor(x / 8), Math.floor(y / 8)) - 0.5) * amp * 0.55;
      const i = (y * size + x) * 4;
      d[i] = Math.min(255, Math.max(0, base[0] + n + coarse));
      d[i + 1] = Math.min(255, Math.max(0, base[1] + n * 0.92 + coarse));
      d[i + 2] = Math.min(255, Math.max(0, base[2] + n * 0.8 + coarse));
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintPlaster(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [212, 203, 189], 22);
  ctx.strokeStyle = "rgba(160,148,132,0.18)";
  ctx.lineWidth = 1;
  for (let y = 6; y < size; y += 9) {
    ctx.beginPath();
    ctx.moveTo(0, y + (hash2(y, 3) - 0.5) * 2);
    ctx.lineTo(size, y + (hash2(y, 9) - 0.5) * 2);
    ctx.stroke();
  }
}

function paintPlinth(ctx: CanvasRenderingContext2D, size: number) {
  noiseFill(ctx, size, [168, 156, 140], 16);
  ctx.strokeStyle = "rgba(90,78,66,0.45)";
  ctx.lineWidth = 2;
  const cols = 6;
  const rows = 3;
  for (let r = 0; r < rows; r++) {
    const y = (r / rows) * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
    const shift = r % 2 === 0 ? 0 : size / cols / 2;
    for (let c = 0; c <= cols; c++) {
      const x = (c / cols) * size + shift;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + size / rows);
      ctx.stroke();
    }
  }
}

function paintTimber(ctx: CanvasRenderingContext2D, size: number) {
  const planks = 7;
  for (let i = 0; i < planks; i++) {
    const y0 = Math.floor((i / planks) * size);
    const y1 = Math.floor(((i + 1) / planks) * size);
    const tone = 118 + Math.floor(hash2(i, 4) * 28);
    ctx.fillStyle = `rgb(${tone + 28}, ${tone - 6}, ${tone - 38})`;
    ctx.fillRect(0, y0, size, y1 - y0);
    ctx.strokeStyle = "rgba(62,40,22,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y1 - 1);
    ctx.lineTo(size, y1 - 1);
    ctx.stroke();
    ctx.strokeStyle = "rgba(90,58,32,0.28)";
    ctx.lineWidth = 1;
    for (let g = 0; g < 5; g++) {
      const gy = y0 + 3 + g * ((y1 - y0) / 6);
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= size; x += 12) {
        ctx.lineTo(x, gy + Math.sin(x * 0.08 + i) * 1.2);
      }
      ctx.stroke();
    }
  }
}

function paintClayTiles(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#6b3a2a";
  ctx.fillRect(0, 0, size, size);
  const rows = 8;
  const cols = 6;
  const rh = size / rows;
  const cw = size / cols;
  for (let r = 0; r < rows; r++) {
    const shift = r % 2 === 0 ? 0 : cw * 0.5;
    for (let c = -1; c < cols + 1; c++) {
      const vary = hash2(c + 3, r + 11);
      const rr = 108 + Math.floor(vary * 28);
      const gg = 52 + Math.floor(vary * 18);
      const bb = 38 + Math.floor(vary * 10);
      ctx.fillStyle = `rgb(${rr}, ${gg}, ${bb})`;
      const x = c * cw + shift;
      const y = r * rh;
      ctx.beginPath();
      ctx.moveTo(x + 2, y + rh * 0.35);
      ctx.quadraticCurveTo(x + cw * 0.5, y - rh * 0.15, x + cw - 2, y + rh * 0.35);
      ctx.lineTo(x + cw - 2, y + rh - 1);
      ctx.quadraticCurveTo(x + cw * 0.5, y + rh * 0.55, x + 2, y + rh - 1);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(48,22,16,0.45)";
      ctx.stroke();
    }
  }
}

function paintRoughness(ctx: CanvasRenderingContext2D, size: number, base: number, amp: number) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = base + (hash2(x, y) - 0.5) * amp;
      const v = Math.min(255, Math.max(0, n));
      const i = (y * size + x) * 4;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** Architectural materials — warm plaster / timber / clay (not toy-studio neon). */
function makeMaterials() {
  const TEX = 256;
  const wallMap = makeCanvasTexture(TEX, paintPlaster, true);
  const wallRough = makeCanvasTexture(TEX, (ctx, s) => paintRoughness(ctx, s, 190, 40), false);
  const edgeMap = makeCanvasTexture(TEX, paintPlinth, true);
  const floorMap = makeCanvasTexture(TEX, paintTimber, true);
  const floorRough = makeCanvasTexture(TEX, (ctx, s) => paintRoughness(ctx, s, 150, 50), false);
  const roofMap = makeCanvasTexture(TEX, paintClayTiles, true);
  const roofRough = makeCanvasTexture(TEX, (ctx, s) => paintRoughness(ctx, s, 175, 35), false);

  const applyRepeat = (tex: THREE.CanvasTexture | null, x: number, y: number) => {
    if (!tex) return;
    tex.repeat.set(x, y);
  };
  applyRepeat(wallMap, 2, 2);
  applyRepeat(wallRough, 2, 2);
  applyRepeat(edgeMap, 2, 1);
  applyRepeat(floorMap, 2, 2);
  applyRepeat(floorRough, 2, 2);
  applyRepeat(roofMap, 3, 2);
  applyRepeat(roofRough, 3, 2);

  const wall = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: wallMap ?? undefined,
    roughnessMap: wallRough ?? undefined,
    bumpMap: wallRough ?? undefined,
    bumpScale: 0.035,
    roughness: 0.86,
    metalness: 0.02,
  });
  const wallEdge = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: edgeMap ?? undefined,
    roughness: 0.8,
    metalness: 0.02,
  });
  const floor = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: floorMap ?? undefined,
    roughnessMap: floorRough ?? undefined,
    bumpMap: floorRough ?? undefined,
    bumpScale: 0.06,
    roughness: 0.74,
    metalness: 0.04,
  });
  const roof = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: roofMap ?? undefined,
    roughnessMap: roofRough ?? undefined,
    bumpMap: roofRough ?? undefined,
    bumpScale: 0.05,
    roughness: 0.8,
    metalness: 0.05,
  });
  const ground = new THREE.MeshStandardMaterial({
    color: 0x4a6741,
    roughness: 0.95,
    metalness: 0,
  });
  return { wall, wallEdge, floor, roof, ground };
}

function disposeCatalogMaterials(mats: ReturnType<typeof makeMaterials>) {
  const seen = new Set<THREE.Texture>();
  for (const m of Object.values(mats)) {
    for (const tex of [m.map, m.roughnessMap, m.bumpMap]) {
      if (tex && !seen.has(tex)) {
        seen.add(tex);
        tex.dispose();
      }
    }
    m.dispose();
  }
}

function createWallMesh(mats: ReturnType<typeof makeMaterials>) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(3, 2.6, 0.2), mats.wall);
  body.position.y = 1.3;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.12, 0.24), mats.wallEdge);
  base.position.y = 0.06;
  base.castShadow = true;
  group.add(base);
  return group;
}

function createFloorMesh(mats: ReturnType<typeof makeMaterials>) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 0.08, 3), mats.floor);
  mesh.position.y = 0.04;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}

function createRoofMesh(mats: ReturnType<typeof makeMaterials>) {
  const group = new THREE.Group();
  const left = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.8), mats.roof);
  left.position.set(0, 2.85, -0.55);
  left.rotation.x = 0.45;
  left.castShadow = true;
  const right = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.8), mats.roof);
  right.position.set(0, 2.85, 0.55);
  right.rotation.x = -0.45;
  right.castShadow = true;
  group.add(left, right);
  return group;
}

export function HouseModeler3D({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const mountRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
    ground: THREE.Mesh;
    partsRoot: THREE.Group;
    mats: ReturnType<typeof makeMaterials>;
    ghost: THREE.Object3D | null;
    selectionHelper: THREE.BoxHelper;
    anim: number;
  } | null>(null);
  const partsRef = useRef<ScenePart[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tool, setTool] = useState<PartKind>("wall");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [placingFromPalette, setPlacingFromPalette] = useState(false);
  const toolRef = useRef(tool);
  const selectedRef = useRef(selectedId);
  const draggingRef = useRef<{ id: string; offset: THREE.Vector3 } | null>(null);
  const paletteDragRef = useRef<PartKind | null>(null);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  const worldPointFromEvent = useCallback((clientX: number, clientY: number) => {
    const t = threeRef.current;
    if (!t || !mountRef.current) return null;
    const rect = mountRef.current.getBoundingClientRect();
    t.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    t.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    t.raycaster.setFromCamera(t.pointer, t.camera);
    const hits = t.raycaster.intersectObject(t.ground);
    if (!hits.length) return null;
    return hits[0].point;
  }, []);

  const clearGhost = useCallback(() => {
    const t = threeRef.current;
    if (!t?.ghost) return;
    t.partsRoot.remove(t.ghost);
    // Ghost materials are clones; geometries are unique per preview.
    disposeObjectResources(t.ghost, true);
    t.ghost = null;
  }, []);

  const makeGhost = useCallback(
    (kind: PartKind) => {
      const t = threeRef.current;
      if (!t) return;
      clearGhost();
      let obj: THREE.Object3D;
      if (kind === "wall") obj = createWallMesh(t.mats);
      else if (kind === "floor") obj = createFloorMesh(t.mats);
      else obj = createRoofMesh(t.mats);
      obj.traverse((c) => {
        if (c instanceof THREE.Mesh && c.material) {
          const m = (c.material as THREE.MeshStandardMaterial).clone();
          m.transparent = true;
          m.opacity = 0.45;
          m.depthWrite = false;
          c.material = m;
        }
      });
      t.ghost = obj;
      t.partsRoot.add(obj);
    },
    [clearGhost],
  );

  useEffect(() => {
    if (!ready) return;
    makeGhost(tool);
  }, [tool, ready, makeGhost]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let disposed = false;
    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0xb8c4d4, 0.012);

      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
      camera.position.set(12, 9, 14);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      const sky = new Sky();
      sky.scale.setScalar(450);
      scene.add(sky);
      const skyUniforms = sky.material.uniforms;
      skyUniforms["turbidity"].value = 4.2;
      skyUniforms["rayleigh"].value = 2.1;
      skyUniforms["mieCoefficient"].value = 0.004;
      skyUniforms["mieDirectionalG"].value = 0.8;
      const sun = new THREE.Vector3();
      const phi = THREE.MathUtils.degToRad(88.5);
      const theta = THREE.MathUtils.degToRad(165);
      sun.setFromSphericalCoords(1, phi, theta);
      skyUniforms["sunPosition"].value.copy(sun);

      const hemi = new THREE.HemisphereLight(0xc8d8f0, 0x6b5a45, 0.55);
      scene.add(hemi);
      const dir = new THREE.DirectionalLight(0xfff2dd, 1.35);
      dir.position.copy(sun).multiplyScalar(40);
      dir.castShadow = true;
      dir.shadow.mapSize.set(2048, 2048);
      dir.shadow.camera.near = 1;
      dir.shadow.camera.far = 80;
      dir.shadow.camera.left = -30;
      dir.shadow.camera.right = 30;
      dir.shadow.camera.top = 30;
      dir.shadow.camera.bottom = -30;
      dir.shadow.bias = -0.0002;
      scene.add(dir);
      scene.add(new THREE.AmbientLight(0xffffff, 0.18));

      const mats = makeMaterials();

      const groundGeo = new THREE.CircleGeometry(120, 64);
      const ground = new THREE.Mesh(groundGeo, mats.ground);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const ringMat = new THREE.LineBasicMaterial({ color: 0x3d5238, transparent: true, opacity: 0.25 });
      for (let r = 5; r <= 40; r += 5) {
        const pts = [];
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * r, 0.02, Math.sin(a) * r));
        }
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
      }

      const partsRoot = new THREE.Group();
      scene.add(partsRoot);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.maxPolarAngle = Math.PI * 0.49;
      controls.minDistance = 2;
      controls.maxDistance = 80;
      controls.target.set(0, 1, 0);

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const selectionHelper = new THREE.BoxHelper(new THREE.Object3D(), 0xc4843a);
      selectionHelper.visible = false;
      scene.add(selectionHelper);

      const onResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);
      const resizeObserver = new ResizeObserver(() => onResize());
      resizeObserver.observe(el);
      onResize();

      threeRef.current = {
        renderer,
        scene,
        camera,
        controls,
        raycaster,
        pointer,
        ground,
        partsRoot,
        mats,
        ghost: null,
        selectionHelper,
        anim: 0,
      };

      const tick = () => {
        if (disposed) return;
        const selId = selectedRef.current;
        if (selId) {
          let target: THREE.Object3D | null = null;
          partsRoot.children.forEach((c) => {
            if (c.userData.partId === selId) target = c;
          });
          if (target) {
            selectionHelper.setFromObject(target);
            selectionHelper.visible = true;
          } else {
            selectionHelper.visible = false;
          }
        } else {
          selectionHelper.visible = false;
        }
        controls.update();
        renderer.render(scene, camera);
        threeRef.current!.anim = requestAnimationFrame(tick);
      };
      tick();
      setReady(true);
      setError(null);

      return () => {
        disposed = true;
        window.removeEventListener("resize", onResize);
        resizeObserver.disconnect();
        cancelAnimationFrame(threeRef.current?.anim ?? 0);
        const ghost = threeRef.current?.ghost;
        if (ghost) {
          partsRoot.remove(ghost);
          disposeObjectResources(ghost, true);
        }
        for (const child of [...partsRoot.children]) {
          partsRoot.remove(child);
          disposeObjectResources(child, false);
        }
        disposeObjectResources(ground, false);
        ringMat.dispose();
        disposeCatalogMaterials(mats);
        sky.geometry.dispose();
        sky.material.dispose();
        controls.dispose();
        selectionHelper.dispose();
        renderer.dispose();
        if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
        threeRef.current = null;
        partsRef.current = [];
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : "WebGL error");
      return;
    }
  }, []);

  // Keep renderer size in sync when entering/leaving fullscreen
  useEffect(() => {
    const t = threeRef.current;
    if (!t || !mountRef.current) return;
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;
    t.camera.aspect = w / Math.max(h, 1);
    t.camera.updateProjectionMatrix();
    t.renderer.setSize(w, h);
  }, [isFullscreen, ready]);

  const placeAt = useCallback((point: THREE.Vector3, kind: PartKind) => {
    const t = threeRef.current;
    if (!t) return;
    const x = snap(point.x);
    const z = snap(point.z);
    let obj: THREE.Object3D;
    if (kind === "wall") obj = createWallMesh(t.mats);
    else if (kind === "floor") obj = createFloorMesh(t.mats);
    else obj = createRoofMesh(t.mats);
    obj.position.set(x, 0, z);
    t.partsRoot.add(obj);
    let primary: THREE.Mesh | null = null;
    obj.traverse((c) => {
      if (!primary && c instanceof THREE.Mesh) primary = c;
    });
    if (!primary) {
      t.partsRoot.remove(obj);
      disposeObjectResources(obj, false);
      return;
    }
    const id = uid();
    obj.userData.partId = id;
    obj.traverse((c) => {
      if (c instanceof THREE.Mesh) c.userData.partId = id;
    });
    partsRef.current.push({
      id,
      kind,
      position: [x, 0, z],
      rotationY: 0,
      mesh: primary as THREE.Mesh,
    });
    setCount(partsRef.current.length);
    setSelectedId(id);
  }, []);

  const findPartObject = useCallback((id: string) => {
    const t = threeRef.current;
    if (!t) return null;
    let found: THREE.Object3D | null = null;
    t.partsRoot.traverse((c) => {
      if (c.userData.partId === id && c.parent === t.partsRoot) found = c;
    });
    return found;
  }, []);

  const deleteSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    const obj = findPartObject(id);
    const t = threeRef.current;
    if (obj && t) {
      t.partsRoot.remove(obj);
      disposeObjectResources(obj, false);
    }
    partsRef.current = partsRef.current.filter((p) => p.id !== id);
    selectedRef.current = null;
    setSelectedId(null);
    setCount(partsRef.current.length);
    if (t) t.selectionHelper.visible = false;
  }, [findPartObject]);

  const rotateSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    const obj = findPartObject(id);
    if (!obj) return;
    obj.rotation.y += Math.PI / 2;
    const part = partsRef.current.find((p) => p.id === id);
    if (part) part.rotationY = obj.rotation.y;
  }, [findPartObject]);

  const clearAll = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    for (const p of [...partsRef.current]) {
      const obj = findPartObject(p.id);
      if (obj) {
        t.partsRoot.remove(obj);
        disposeObjectResources(obj, false);
      }
    }
    partsRef.current = [];
    selectedRef.current = null;
    setSelectedId(null);
    setCount(0);
    t.selectionHelper.visible = false;
  }, [findPartObject]);

  const toggleFullscreen = useCallback(async () => {
    const shell = shellRef.current;
    if (!shell) return;
    try {
      if (!document.fullscreenElement) {
        await shell.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen may be blocked by browser policy
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Canvas pointer interactions
  useEffect(() => {
    const el = mountRef.current;
    if (!el || !ready) return;
    const t = threeRef.current;
    if (!t) return;

    const onMove = (ev: PointerEvent) => {
      const point = worldPointFromEvent(ev.clientX, ev.clientY);
      if (!point) return;
      if (t.ghost) {
        if (draggingRef.current) {
          t.ghost.visible = false;
        } else {
          t.ghost.visible = true;
          t.ghost.position.set(snap(point.x), 0, snap(point.z));
        }
      }
      if (draggingRef.current) {
        const obj = findPartObject(draggingRef.current.id);
        if (obj) {
          obj.position.x = snap(point.x - draggingRef.current.offset.x);
          obj.position.z = snap(point.z - draggingRef.current.offset.z);
        }
      }
    };

    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      const point = worldPointFromEvent(ev.clientX, ev.clientY);
      if (!point) return;

      // Palette placement happens only on pointerup (avoids double-place with the window listener).
      if (paletteDragRef.current) {
        t.controls.enabled = false;
        return;
      }

      const rect = el.getBoundingClientRect();
      t.pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      t.pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      t.raycaster.setFromCamera(t.pointer, t.camera);
      const meshes: THREE.Object3D[] = [];
      t.partsRoot.traverse((c) => {
        if (c instanceof THREE.Mesh && c.userData.partId) meshes.push(c);
      });
      const hits = t.raycaster.intersectObjects(meshes, false);
      if (hits.length) {
        const id = hits[0].object.userData.partId as string;
        setSelectedId(id);
        const obj = findPartObject(id);
        if (obj) {
          draggingRef.current = {
            id,
            offset: new THREE.Vector3(point.x - obj.position.x, 0, point.z - obj.position.z),
          };
          t.controls.enabled = false;
        }
        return;
      }

      // Click ground with active tool → place
      placeAt(point, toolRef.current);
      t.controls.enabled = false;
    };

    const onUp = () => {
      if (draggingRef.current) {
        const id = draggingRef.current.id;
        const obj = findPartObject(id);
        const part = partsRef.current.find((p) => p.id === id);
        if (obj && part) {
          part.position = [obj.position.x, 0, obj.position.z];
        }
      }
      draggingRef.current = null;
      t.controls.enabled = true;
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      draggingRef.current = null;
      if (threeRef.current) threeRef.current.controls.enabled = true;
    };
  }, [ready, worldPointFromEvent, placeAt, findPartObject]);

  // Global pointer move while dragging from palette (ghost follows even outside canvas)
  useEffect(() => {
    if (!placingFromPalette) return;
    const onMove = (ev: PointerEvent) => {
      const point = worldPointFromEvent(ev.clientX, ev.clientY);
      const t = threeRef.current;
      if (point && t?.ghost) {
        t.ghost.position.set(snap(point.x), 0, snap(point.z));
      }
    };
    const onUp = (ev: PointerEvent) => {
      const kind = paletteDragRef.current;
      paletteDragRef.current = null;
      setPlacingFromPalette(false);
      if (threeRef.current) threeRef.current.controls.enabled = true;
      if (!kind) return;
      const point = worldPointFromEvent(ev.clientX, ev.clientY);
      const mount = mountRef.current;
      if (!point || !mount) return;
      const rect = mount.getBoundingClientRect();
      const inside =
        ev.clientX >= rect.left &&
        ev.clientX <= rect.right &&
        ev.clientY >= rect.top &&
        ev.clientY <= rect.bottom;
      if (inside) placeAt(point, kind);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [placingFromPalette, worldPointFromEvent, placeAt]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      }
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        rotateSelected();
      }
      if (e.key === "1") setTool("wall");
      if (e.key === "2") setTool("floor");
      if (e.key === "3") setTool("roof");
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        void toggleFullscreen();
      }
      if (e.key === "Escape") {
        if (paletteDragRef.current) {
          paletteDragRef.current = null;
          setPlacingFromPalette(false);
          draggingRef.current = null;
          if (threeRef.current) {
            threeRef.current.controls.enabled = true;
            if (threeRef.current.ghost) threeRef.current.ghost.visible = true;
          }
          e.preventDefault();
          return;
        }
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        } else {
          selectedRef.current = null;
          setSelectedId(null);
          if (threeRef.current) threeRef.current.selectionHelper.visible = false;
        }
      }
      if (e.key.toLowerCase() === "c" && (e.ctrlKey || e.metaKey)) {
        // allow browser copy; ignore
      } else if (e.key.toLowerCase() === "c" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        clearAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, rotateSelected, toggleFullscreen, clearAll]);

  const startPaletteDrag = (kind: PartKind) => (ev: React.PointerEvent) => {
    ev.preventDefault();
    setTool(kind);
    paletteDragRef.current = kind;
    setPlacingFromPalette(true);
    if (threeRef.current) threeRef.current.controls.enabled = false;
    makeGhost(kind);
  };

  const labels = es
    ? {
        title: "Modelador de casas 3D",
        wall: "Pared",
        floor: "Piso",
        roof: "Techo",
        place: "Arrastrá desde la barra derecha al terreno · o hacé clic en el suelo",
        cam: "Cámara libre: botón derecho / medio · rueda zoom",
        rot: "Rotar 90°",
        del: "Eliminar",
        clear: "Limpiar",
        parts: "elementos",
        fullscreen: "Pantalla completa",
        exitFs: "Salir",
        tip: "Atajos: 1 pared · 2 piso · 3 techo · R rotar · Supr borrar · C limpiar · F pantalla completa · Esc cancelar",
        palette: "Estructuras",
        dragHint: "Arrastrá al terreno",
        none: "Nada seleccionado",
        selected: "Seleccionado",
        drop: "Soltá sobre el terreno para colocar",
        needSel: "Seleccioná una pieza primero",
      }
    : {
        title: "3D house modeler",
        wall: "Wall",
        floor: "Floor",
        roof: "Roof",
        place: "Drag from the right toolbar onto the ground · or click the ground",
        cam: "Free camera: right/middle drag · scroll zoom",
        rot: "Rotate 90°",
        del: "Delete",
        clear: "Clear",
        parts: "parts",
        fullscreen: "Fullscreen",
        exitFs: "Exit",
        tip: "Shortcuts: 1 wall · 2 floor · 3 roof · R rotate · Del delete · C clear · F fullscreen · Esc cancel",
        palette: "Structures",
        dragHint: "Drag to ground",
        none: "Nothing selected",
        selected: "Selected",
        drop: "Release over the ground to place",
        needSel: "Select a part first",
      };

  const selectedKind = partsRef.current.find((p) => p.id === selectedId)?.kind;
  const selectedKindLabel =
    selectedKind === "wall" ? labels.wall : selectedKind === "floor" ? labels.floor : selectedKind === "roof" ? labels.roof : "";

  const paletteItems: { kind: PartKind; label: string; swatch: string; key: string }[] = [
    { kind: "wall", label: labels.wall, swatch: "#d8d0c4", key: "1" },
    { kind: "floor", label: labels.floor, swatch: "#8b7355", key: "2" },
    { kind: "roof", label: labels.roof, swatch: "#6b3a2a", key: "3" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-foreground">{labels.title}</p>
        <span className="text-xs text-muted-foreground">
          {count} {labels.parts}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={rotateSelected}
          disabled={!selectedId}
          aria-label={labels.rot}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          title={selectedId ? "R" : labels.needSel}
        >
          {labels.rot}
        </button>
        <button
          type="button"
          onClick={deleteSelected}
          disabled={!selectedId}
          aria-label={labels.del}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          title={selectedId ? "Del" : labels.needSel}
        >
          {labels.del}
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={count === 0}
          aria-label={labels.clear}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          title="C"
        >
          {labels.clear}
        </button>
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          aria-pressed={isFullscreen}
          aria-label={isFullscreen ? labels.exitFs : labels.fullscreen}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
          title="F"
        >
          {isFullscreen ? labels.exitFs : labels.fullscreen}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">{labels.place}</p>
      <p className="text-xs text-muted-foreground">{labels.cam}</p>
      <p className="text-xs text-muted-foreground">{labels.tip}</p>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div
        ref={shellRef}
        className={`relative flex overflow-hidden rounded-xl border border-border shadow-inner ${
          isFullscreen ? "h-screen w-screen rounded-none border-0" : "h-[min(70vh,640px)] w-full"
        }`}
        style={{
          background: isFullscreen
            ? "#0a1210"
            : "linear-gradient(180deg, #87a8c8 0%, #c5d4a8 55%, #5a7a48 100%)",
        }}
      >
        {/* 3D canvas */}
        <div className="relative min-h-0 min-w-0 flex-1">
          <div
            ref={mountRef}
            className="h-full w-full"
            style={{ touchAction: "none" }}
          />
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex max-w-[75%] flex-col gap-1">
            <span className="rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-amber-50 shadow">
              {selectedKindLabel ? `${labels.selected}: ${selectedKindLabel}` : labels.none}
            </span>
            {placingFromPalette && (
              <span className="rounded-md bg-amber-800/90 px-2 py-1 text-[11px] font-semibold text-amber-50 shadow">
                {labels.drop}
              </span>
            )}
          </div>
        </div>

        {/* Right structure palette — drag to place */}
        <aside
          className={`flex shrink-0 flex-col gap-2 border-l border-border/60 bg-card/95 p-2 backdrop-blur-sm ${
            isFullscreen ? "w-36" : "w-32 sm:w-36"
          }`}
        >
          <p className="px-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            {labels.palette}
          </p>
          <p className="px-1 text-[10px] text-muted-foreground">{labels.dragHint}</p>
          {paletteItems.map((item) => (
            <button
              key={item.kind}
              type="button"
              onPointerDown={startPaletteDrag(item.kind)}
              onClick={() => setTool(item.kind)}
              aria-pressed={tool === item.kind}
              aria-label={`${item.label} (${item.key})`}
              title={`${item.label} · ${item.key}`}
              className={`group flex min-h-16 cursor-grab flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ${
                tool === item.kind
                  ? "border-amber-700/70 bg-amber-900/20 shadow-sm ring-1 ring-amber-700/40"
                  : "border-border bg-background/80 hover:bg-accent"
              } ${placingFromPalette && tool === item.kind ? "ring-2 ring-amber-600" : ""}`}
            >
              <span
                className="block h-8 w-10 rounded-md border border-black/10 shadow-inner"
                style={{ background: item.swatch }}
                aria-hidden
              />
              <span className="text-xs font-semibold text-foreground">{item.label}</span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {item.key}
              </span>
            </button>
          ))}

          {isFullscreen && (
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="mt-auto rounded-lg border border-border bg-background px-2 py-2 text-xs font-semibold hover:bg-accent"
            >
              {labels.exitFs} (F)
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
