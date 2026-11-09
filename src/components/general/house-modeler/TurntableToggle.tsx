import { useEffect, useState } from "react";

type AutoControls = {
  autoRotate: boolean;
  autoRotateSpeed: number;
};

/** Toolbar toggle that slowly orbits the camera around the design (presentation mode); any manual orbit/drag stops it. */
export function TurntableToggle({ es, threeRef }: { es: boolean; threeRef: { current: { controls: AutoControls } | null } }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const c = threeRef.current?.controls;
    if (!on || !c) return;
    c.autoRotateSpeed = 2;
    c.autoRotate = true;
    const stop = (e: PointerEvent) => {
      if ((e.target as HTMLElement | null)?.tagName === "CANVAS") setOn(false);
    };
    document.addEventListener("pointerdown", stop, true);
    return () => {
      c.autoRotate = false;
      document.removeEventListener("pointerdown", stop, true);
    };
  }, [on, threeRef]);
  return (
    <button
      type="button"
      data-testid="turntable-toggle"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      title={es ? "Gira la cámara alrededor de la casa; tocar la escena lo detiene" : "Slowly orbit the camera around the house; touching the scene stops it"}
      className="inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
    >
      {on ? (es ? "Detener giro" : "Stop spin") : es ? "Girar vista" : "Spin view"}
    </button>
  );
}
