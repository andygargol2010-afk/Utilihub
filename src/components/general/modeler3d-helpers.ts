import { type MatPreset, type ShapeKind } from "./modeler3d-helpers.part1";
export { UNIT_CM, STORAGE_KEY, SCENES_KEY, MAX_NAMED_SCENES, scenePresets } from "./modeler3d-helpers.part1";
export type { ShapeKind, MatPreset, SceneObj, HistoryEntry, ClipItem, NamedScene } from "./modeler3d-helpers.part1";
export { encodeSceneShare, decodeSceneShare, NAME_PAIR, BASE_SIZE, COLORS, HISTORY_MAX, OBJECT_MAX, clampSize, clampPos, radToDeg, degToRad, normDeg, snapVal, makeGeometry } from "./modeler3d-helpers.part2";

export function makeMaterial(THREE: any, color: string, preset: MatPreset = "default") {
  if (preset === "matte") {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0,
      roughness: 0.92,
      flatShading: false,
    });
  }
  if (preset === "metal") {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 1,
      roughness: 0.18,
      clearcoat: 0.35,
      clearcoatRoughness: 0.12,
      reflectivity: 1,
      envMapIntensity: 1.2,
      flatShading: false,
    });
  }
  if (preset === "glass") {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: 0.05,
      transmission: 0.92,
      transparent: true,
      opacity: 0.45,
      thickness: 0.6,
      ior: 1.45,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1,
      flatShading: false,
    });
  }
  if (preset === "plastic") {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.05,
      roughness: 0.35,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
      reflectivity: 0.45,
      sheen: 0.08,
      sheenRoughness: 0.35,
      sheenColor: 0xffffff,
      envMapIntensity: 0.75,
      flatShading: false,
    });
  }
  if (preset === "rubber") {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0,
      roughness: 0.98,
      flatShading: false,
    });
  }
  if (preset === "wood") {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0.02,
      roughness: 0.68,
      flatShading: false,
    });
  }
  if (preset === "concrete") {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0,
      roughness: 0.88,
      flatShading: false,
    });
  }
  if (preset === "ceramic") {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: 0.14,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      reflectivity: 0.6,
      envMapIntensity: 0.9,
      flatShading: false,
    });
  }
  if (preset === "brushed") {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0.85,
      roughness: 0.42,
      envMapIntensity: 1,
      flatShading: false,
    });
  }
  if (preset === "velvet") {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: 0.95,
      sheen: 1,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.45),
      envMapIntensity: 0.5,
      flatShading: false,
    });
  }
  if (preset === "glow") {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.65,
      metalness: 0,
      roughness: 0.4,
      flatShading: false,
    });
  }
  // default — same look as before (color bug fix path)
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.12,
    roughness: 0.28,
    clearcoat: 0.55,
    clearcoatRoughness: 0.18,
    reflectivity: 0.55,
    sheen: 0.15,
    sheenRoughness: 0.4,
    sheenColor: 0xffffff,
    envMapIntensity: 0.85,
    flatShading: false,
  });
}

export function matPresetList(es: boolean): { id: MatPreset; label: string }[] {
  return [
    { id: "default", label: es ? "Estándar" : "Default" },
    { id: "matte", label: es ? "Mate" : "Matte" },
    { id: "metal", label: es ? "Metal" : "Metal" },
    { id: "glass", label: es ? "Vidrio" : "Glass" },
    { id: "plastic", label: es ? "Plástico" : "Plastic" },
    { id: "rubber", label: es ? "Goma" : "Rubber" },
    { id: "wood", label: es ? "Madera" : "Wood" },
    { id: "concrete", label: es ? "Hormigón" : "Concrete" },
    { id: "ceramic", label: es ? "Cerámica" : "Ceramic" },
    { id: "brushed", label: es ? "Metal cepillado" : "Brushed metal" },
    { id: "velvet", label: es ? "Terciopelo" : "Velvet" },
    { id: "glow", label: es ? "Brillo" : "Glow" },
  ];
}

export function shapeList(es: boolean): { kind: ShapeKind; label: string; icon: string }[] {
  return [
    { kind: "box", label: es ? "Cubo" : "Cube", icon: "■" },
    { kind: "sphere", label: es ? "Esfera" : "Sphere", icon: "●" },
    { kind: "cylinder", label: es ? "Cilindro" : "Cylinder", icon: "▮" },
    { kind: "cone", label: es ? "Cono" : "Cone", icon: "▲" },
    { kind: "plane", label: es ? "Plano" : "Plane", icon: "▬" },
    { kind: "torus", label: es ? "Toro" : "Torus", icon: "◎" },
    { kind: "prism", label: es ? "Prisma" : "Prism", icon: "△" },
    { kind: "tube", label: es ? "Tubo" : "Tube", icon: "◯" },
    { kind: "pyramid", label: es ? "Pirámide" : "Pyramid", icon: "◭" },
    { kind: "hemisphere", label: es ? "Hemisferio" : "Hemisphere", icon: "◗" },
    { kind: "capsule", label: es ? "Cápsula" : "Capsule", icon: "⬭" },
  ];
}
