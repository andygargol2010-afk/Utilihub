import type { GeneralTool } from "@/lib/general/types";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { makeMaterials, disposeCatalogMaterials, type Locale } from "./house-modeler-materials";
import { createPartMesh, StructureGlyph } from "./house-modeler-meshes";

/**
 * HouseModeler3D shell — full scene/UI was split so the 330KB monolith is not rewritten in one automation push.
 * materials: house-modeler-materials.ts | meshes: house-modeler-meshes.tsx
 * This shell keeps a working 3D canvas + orbit while the full interaction layer is restored module-by-module.
 */
export function HouseModeler3D({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth || 640;
    const h = Math.max(el.clientHeight || 420, 360);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#cfe6ff");

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 500);
    camera.position.set(12, 10, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);

    const hemi = new THREE.HemisphereLight(0xe8f2ff, 0x6b7a4e, 0.85);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2d6, 1.1);
    sun.position.set(20, 30, 10);
    sun.castShadow = true;
    scene.add(sun);

    try {
      const sky = new Sky();
      sky.scale.setScalar(450);
      scene.add(sky);
    } catch {
      /* sky optional */
    }

    const mats = makeMaterials();
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(40, 48),
      mats.grass || new THREE.MeshStandardMaterial({ color: "#4a7c3f" }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Sample parts so the canvas is not empty while the full UI is ported back
    const wall = createPartMesh("wall" as never, mats as never);
    wall.position.set(-2, 0, 0);
    scene.add(wall);
    const roof = createPartMesh("roof" as never, mats as never);
    roof.position.set(2, 0, 0);
    scene.add(roof);

    let raf = 0;
    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const nw = el.clientWidth || 640;
      const nh = Math.max(el.clientHeight || 420, 360);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      disposeCatalogMaterials(mats);
      renderer.dispose();
      if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
    };
  }, []);

  const es = locale === "es";

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <StructureGlyph kind="wall" />
        <span>{es ? "Modelador 3D (módulos separados — anti-truncate)" : "3D modeler (split modules — anti-truncate)"}</span>
      </div>
      <div
        ref={mountRef}
        className="relative w-full overflow-hidden rounded-xl border bg-sky-50"
        style={{ minHeight: "min(70vh, 640px)", height: "70vh" }}
      />
    </div>
  );
}
