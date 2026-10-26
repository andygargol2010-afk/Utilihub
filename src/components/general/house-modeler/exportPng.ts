import type * as THREE from "three";

/** Render one frame and download the canvas as PNG. Returns false if the browser blocked the capture. */
export function exportScenePng(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): boolean {
  try {
    // The context has no preserveDrawingBuffer: read the pixels in the same task as the render.
    renderer.render(scene, camera);
    const url = renderer.domElement.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `house-model-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  } catch {
    return false;
  }
}
