import { useEffect, useRef, useState } from "react";

type Planet = {
  name: string;
  nameEs: string;
  radiusKm: number;
  distanceAu: number;
  color: string;
  moons?: { name: string; radiusKm: number; distanceKm: number; color: string }[];
};

const PLANETS: Planet[] = [
  { name: "Mercury", nameEs: "Mercurio", radiusKm: 2439.7, distanceAu: 0.39, color: "#8c7a6b" },
  { name: "Venus", nameEs: "Venus", radiusKm: 6051.8, distanceAu: 0.72, color: "#e6c07b" },
  { name: "Earth", nameEs: "Tierra", radiusKm: 6371, distanceAu: 1, color: "#4a90d9", moons: [{ name: "Moon", radiusKm: 1737.4, distanceKm: 384400, color: "#ccc" }] },
  { name: "Mars", nameEs: "Marte", radiusKm: 3389.5, distanceAu: 1.52, color: "#c1440e" },
  { name: "Jupiter", nameEs: "Júpiter", radiusKm: 69911, distanceAu: 5.2, color: "#d4a574" },
  { name: "Saturn", nameEs: "Saturno", radiusKm: 58232, distanceAu: 9.58, color: "#e8d5a3" },
  { name: "Uranus", nameEs: "Urano", radiusKm: 25362, distanceAu: 19.22, color: "#7ec8e3" },
  { name: "Neptune", nameEs: "Neptuno", radiusKm: 24622, distanceAu: 30.05, color: "#4169e1" },
];

type ScaleMode = "size" | "distance" | "both";

type Props = { locale?: "en" | "es" };

export function SolarSystemScaleExplorer({ locale = "en" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<ScaleMode>("both");
  const [showLabels, setShowLabels] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<number | null>(null);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const es = locale === "es";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = Math.min(rect.width * 0.6, 500);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(centerX + pan.x, centerY + pan.y);
      ctx.scale(zoom, zoom);

      // Sun
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#f9d71c";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();

      PLANETS.forEach((p, i) => {
        let r = 8;
        let dist = 40 + i * 30;
        if (mode === "size" || mode === "both") {
          r = Math.max(4, Math.log10(p.radiusKm) * 3);
        }
        if (mode === "distance" || mode === "both") {
          dist = 30 + p.distanceAu * 12;
        }
        const pos = positions[i] || { x: dist, y: 0 };
        const x = pos.x;
        const y = pos.y;

        // Trail
        ctx.beginPath();
        ctx.arc(0, 0, Math.hypot(x, y), 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Planet
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        if (showLabels) {
          ctx.fillStyle = "#fff";
          ctx.font = "12px sans-serif";
          ctx.fillText(es ? p.nameEs : p.name, x + r + 4, y);
        }
      });

      ctx.restore();
    };

    let anim = requestAnimationFrame(function loop() {
      draw();
      anim = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener("resize", resize);
    };
  }, [mode, showLabels, zoom, pan, positions, es]);

  const onPointerDown = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left - rect.width / 2 - pan.x;
    const my = e.clientY - rect.top - rect.height / 2 - pan.y;
    // simple hit
    for (let i = PLANETS.length - 1; i >= 0; i--) {
      const p = positions[i] || { x: 40 + i * 30, y: 0 };
      const dist = Math.hypot(mx - p.x * zoom, my - p.y * zoom);
      if (dist < 20) {
        setDragging(i);
        return;
      }
    }
    setDragging(null);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging === null) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = (e.clientX - rect.left - rect.width / 2 - pan.x) / zoom;
    const my = (e.clientY - rect.top - rect.height / 2 - pan.y) / zoom;
    setPositions((prev) => {
      const next = [...prev];
      next[dragging] = { x: mx, y: my };
      return next;
    });
  };

  const onPointerUp = () => setDragging(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-sm">
        <button onClick={() => setMode("size")} className={`px-3 py-1 rounded ${mode === "size" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{es ? "Solo tamaño" : "Size only"}</button>
        <button onClick={() => setMode("distance")} className={`px-3 py-1 rounded ${mode === "distance" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{es ? "Solo distancia" : "Distance only"}</button>
        <button onClick={() => setMode("both")} className={`px-3 py-1 rounded ${mode === "both" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{es ? "Ambos" : "Both"}</button>
        <button onClick={() => setShowLabels(!showLabels)} className="px-3 py-1 rounded bg-muted">{showLabels ? (es ? "Ocultar etiquetas" : "Hide labels") : (es ? "Mostrar etiquetas" : "Show labels")}</button>
        <button onClick={() => setZoom((z) => Math.min(3, z + 0.2))} className="px-3 py-1 rounded bg-muted">+</button>
        <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.2))} className="px-3 py-1 rounded bg-muted">−</button>
      </div>
      <div className="relative w-full rounded-xl border bg-slate-950 overflow-hidden" style={{ aspectRatio: "16/9", maxHeight: "500px" }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {es
          ? "Arrastrá planetas para reposicionarlos. El Sol está en el centro. Las escalas son aproximadas para visualizar diferencias reales (Júpiter es ~11× la Tierra; Neptuno está a ~30 UA)."
          : "Drag planets to reposition them. The Sun is at the center. Scales are approximate to visualize real differences (Jupiter is ~11× Earth; Neptune is ~30 AU away)."}
      </p>
    </div>
  );
}
