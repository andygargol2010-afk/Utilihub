import { useCallback, useEffect, useRef, useState } from "react";

type Planet = {
  name: string;
  nameEs: string;
  radiusKm: number;
  distanceAu: number;
  color: string;
};

const PLANETS: Planet[] = [
  { name: "Mercury", nameEs: "Mercurio", radiusKm: 2439.7, distanceAu: 0.387, color: "#9a8b7a" },
  { name: "Venus", nameEs: "Venus", radiusKm: 6051.8, distanceAu: 0.723, color: "#e8c07a" },
  { name: "Earth", nameEs: "Tierra", radiusKm: 6371, distanceAu: 1, color: "#4a9be0" },
  { name: "Mars", nameEs: "Marte", radiusKm: 3389.5, distanceAu: 1.524, color: "#c1440e" },
  { name: "Jupiter", nameEs: "Júpiter", radiusKm: 69911, distanceAu: 5.203, color: "#d4a574" },
  { name: "Saturn", nameEs: "Saturno", radiusKm: 58232, distanceAu: 9.537, color: "#e8d5a3" },
  { name: "Uranus", nameEs: "Urano", radiusKm: 25362, distanceAu: 19.191, color: "#7ec8e3" },
  { name: "Neptune", nameEs: "Neptuno", radiusKm: 24622, distanceAu: 30.069, color: "#4169e1" },
  { name: "Pluto", nameEs: "Plutón", radiusKm: 1188.3, distanceAu: 39.482, color: "#c8b8a0" },
];

export function SolarSystemScaleExplorer({ locale = "en" }: { locale?: "en" | "es" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scaleMode, setScaleMode] = useState<"size" | "distance" | "both">("both");
  const [selected, setSelected] = useState<string | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, w, h);

    const maxAu = 40;
    const maxR = Math.max(...PLANETS.map((p) => p.radiusKm));
    PLANETS.forEach((p, i) => {
      const x = 40 + (p.distanceAu / maxAu) * (w - 80);
      const r = scaleMode === "distance" ? 6 : Math.max(4, (p.radiusKm / maxR) * 40);
      ctx.beginPath();
      ctx.arc(x, h / 2, r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      if (selected === p.name) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = "#fff";
      ctx.font = "11px sans-serif";
      ctx.fillText(locale === "es" ? p.nameEs : p.name, x - 20, h / 2 - r - 8);
    });
  }, [scaleMode, selected, locale]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="w-full">
      <div className="mb-3 flex gap-2">
        {(["size", "distance", "both"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setScaleMode(m)}
            className={`rounded px-3 py-1 text-xs font-medium ${scaleMode === m ? "bg-cyan-600 text-white" : "bg-muted"}`}
          >
            {m === "size" ? (locale === "es" ? "Tamaño" : "Size") : m === "distance" ? (locale === "es" ? "Distancia" : "Distance") : (locale === "es" ? "Ambos" : "Both")}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={280}
        className="w-full rounded-lg border border-border bg-black"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 800;
          const maxAu = 40;
          const hit = PLANETS.find((p) => Math.abs(40 + (p.distanceAu / maxAu) * (800 - 80) - x) < 30);
          setSelected(hit ? hit.name : null);
        }}
      />
      {selected && (
        <p className="mt-2 text-sm text-muted-foreground">
          {locale === "es" ? "Seleccionado" : "Selected"}: {selected}
        </p>
      )}
    </div>
  );
}
