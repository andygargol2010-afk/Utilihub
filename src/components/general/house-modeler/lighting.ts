import * as THREE from "three";

export type TimeOfDay = "morning" | "noon" | "sunset" | "dusk";

/** Scene objects a time-of-day preset retunes. Built once in the monolith's scene setup. */
export type LightRig = {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  skyUniforms: Record<string, { value: unknown }>;
  sun: THREE.Vector3;
  hemi: THREE.HemisphereLight;
  dir: THREE.DirectionalLight;
  fill: THREE.DirectionalLight;
  rim: THREE.DirectionalLight;
  sunDisc: THREE.Object3D;
};

type Preset = {
  id: TimeOfDay; en: string; es: string;
  elev: number; az: number; // sun elevation above horizon / azimuth, degrees
  turbidity: number; rayleigh: number; exposure: number;
  fog: number; haze: number; // fog colour + density
  sunCol: number; sunI: number; hemiSky: number; hemiGround: number; hemiI: number; fillI: number; rimI: number;
};

export const TIME_PRESETS: Preset[] = [
  { id: "sunset", en: "Sunset (default)", es: "Atardecer (por defecto)", elev: 10, az: 132, turbidity: 7.1, rayleigh: 1.04, exposure: 1.12, fog: 0xc6c1b0, haze: 0.0078, sunCol: 0xffe6c2, sunI: 1.36, hemiSky: 0xf3d7b4, hemiGround: 0x5e6844, hemiI: 0.4, fillI: 0.28, rimI: 0.38 },
  { id: "morning", en: "Morning", es: "Mañana", elev: 24, az: 70, turbidity: 4.5, rayleigh: 1.5, exposure: 1.0, fog: 0xcfd8dc, haze: 0.009, sunCol: 0xfff0d6, sunI: 1.25, hemiSky: 0xd6e4f2, hemiGround: 0x66714f, hemiI: 0.5, fillI: 0.3, rimI: 0.2 },
  { id: "noon", en: "Noon", es: "Mediodía", elev: 68, az: 150, turbidity: 3, rayleigh: 1.2, exposure: 0.95, fog: 0xd2dbe0, haze: 0.0055, sunCol: 0xfffaf0, sunI: 1.6, hemiSky: 0xdfeaf5, hemiGround: 0x6b7650, hemiI: 0.55, fillI: 0.25, rimI: 0.05 },
  { id: "dusk", en: "Dusk", es: "Anochecer", elev: 2, az: 128, turbidity: 9, rayleigh: 0.7, exposure: 0.8, fog: 0x4a4a62, haze: 0.011, sunCol: 0xff9a5a, sunI: 0.55, hemiSky: 0x6a6f9a, hemiGround: 0x2e3326, hemiI: 0.35, fillI: 0.2, rimI: 0.5 },
];

/** Moves the sun and retunes sky, fog, exposure and lights for the chosen time of day. */
export function applyTimeOfDay(rig: LightRig, id: TimeOfDay) {
  const p = TIME_PRESETS.find((x) => x.id === id);
  if (!p) return;
  rig.sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - p.elev), THREE.MathUtils.degToRad(p.az));
  const u = rig.skyUniforms;
  const set = (k: string, v: number) => { const e = u[k]; if (e) e.value = v; };
  (u["sunPosition"]?.value as THREE.Vector3 | undefined)?.copy(rig.sun);
  set("turbidity", p.turbidity);
  set("rayleigh", p.rayleigh);
  rig.renderer.toneMappingExposure = p.exposure;
  rig.scene.fog = new THREE.FogExp2(p.fog, p.haze);
  rig.scene.background = new THREE.Color(p.fog);
  rig.dir.color.setHex(p.sunCol);
  rig.dir.intensity = p.sunI;
  rig.dir.position.copy(rig.sun).multiplyScalar(48);
  rig.hemi.color.setHex(p.hemiSky);
  rig.hemi.groundColor.setHex(p.hemiGround);
  rig.hemi.intensity = p.hemiI;
  rig.fill.intensity = p.fillI;
  rig.fill.position.set(-rig.sun.x * 26, 9, -rig.sun.z * 26);
  rig.rim.intensity = p.rimI;
  rig.rim.position.set(rig.sun.x * 18, 2.6, rig.sun.z * 18);
  rig.sunDisc.position.copy(rig.sun).multiplyScalar(220);
}

const TOD_KEY = "utilihub.houseModeler.timeOfDay.v1";

/** Last chosen time of day (falls back to sunset when storage is empty or blocked). */
export function loadTimeOfDay(): TimeOfDay {
  try {
    const v = window.localStorage.getItem(TOD_KEY);
    return TIME_PRESETS.some((x) => x.id === v) ? (v as TimeOfDay) : "sunset";
  } catch {
    return "sunset";
  }
}

export function saveTimeOfDay(id: TimeOfDay) {
  try {
    window.localStorage.setItem(TOD_KEY, id);
  } catch {
    /* storage blocked: choice lasts this session only */
  }
}
