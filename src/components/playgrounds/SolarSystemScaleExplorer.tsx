import { useCallback, useEffect, useRef, useState } from "react";

type Moon = { name: string; nameEs: string; radiusKm: number; distanceKm: number; color: string };
type Planet = {
  name: string;
  nameEs: string;
  radiusKm: number;
  distanceAu: number;
  color: string;
  diameterEarth: number;
  massEarth: number;
  periodYears: number;
  factEn: string;
  factEs: string;
  moons?: Moon[];
  dwarf?: boolean;
};

const PLANETS: Planet[] = [
  { name: "Mercury", nameEs: "Mercurio", radiusKm: 2439.7, distanceAu: 0.387, color: "#9a8b7a", diameterEarth: 0.38, massEarth: 0.055, periodYears: 0.24, factEn: "Closest planet to the Sun; extreme temperature swings.", factEs: "Planeta más cercano al Sol; cambios extremos de temperatura." },
  { name: "Venus", nameEs: "Venus", radiusKm: 6051.8, distanceAu: 0.723, color: "#e8c07a", diameterEarth: 0.95, massEarth: 0.815, periodYears: 0.62, factEn: "Hottest planet due to thick CO₂ atmosphere.", factEs: "Planeta más caliente por su densa atmósfera de CO₂." },
  {
    name: "Earth",
    nameEs: "Tierra",
    radiusKm: 6371,
    distanceAu: 1,
    color: "#4a9be0",
    diameterEarth: 1,
    massEarth: 1,
    periodYears: 1,
    factEn: "Only known planet with liquid water and life.",
    factEs: "Único planeta conocido con agua líquida y vida.",
    moons: [{ name: "Moon", nameEs: "Luna", radiusKm: 1737.4, distanceKm: 384400, color: "#c8c8c8" }],
  },
  { name: "Mars", nameEs: "Marte", radiusKm: 3389.5, distanceAu: 1.524, color: "#c1440e", diameterEarth: 0.53, massEarth: 0.107, periodYears: 1.88, factEn: "Red planet with the tallest volcano in the solar system.", factEs: "Planeta rojo con el volcán más alto del sistema solar." },
  {
    name: "Jupiter",
    nameEs: "Júpiter",
    radiusKm: 69911,
    distanceAu: 5.203,
    color: "#d4a574",
    diameterEarth: 11.2,
    massEarth: 317.8,
    periodYears: 11.86,
    factEn: "Largest planet; Great Red Spot is a centuries-old storm.",
    factEs: "Planeta más grande; la Gran Mancha Roja es una tormenta de siglos.",
    moons: [
      { name: "Io", nameEs: "Ío", radiusKm: 1821.6, distanceKm: 421700, color: "#f4d03f" },
      { name: "Europa", nameEs: "Europa", radiusKm: 1560.8, distanceKm: 671100, color: "#aed6f1" },
      { name: "Ganymede", nameEs: "Ganimedes", radiusKm: 2634.1, distanceKm: 1070400, color: "#b0bec5" },
      { name: "Callisto", nameEs: "Calisto", radiusKm: 2410.3, distanceKm: 1882700, color: "#7f8c8d" },
    ],
  },
  {
    name: "Saturn",
    nameEs: "Saturno",
    radiusKm: 58232,
    distanceAu: 9.537,
    color: "#e8d5a3",
    diameterEarth: 9.4,
    massEarth: 95.2,
    periodYears: 29.46,
    factEn: "Famous for its spectacular ring system.",
    factEs: "Famoso por su espectacular sistema de anillos.",
    moons: [
      { name: "Titan", nameEs: "Titán", radiusKm: 2574.7, distanceKm: 1221870, color: "#d4a017" },
      { name: "Rhea", nameEs: "Rea", radiusKm: 763.8, distanceKm: 527040, color: "#d5d8dc" },
    ],
  },
  { name: "Uranus", nameEs: "Urano", radiusKm: 25362, distanceAu: 19.191, color: "#7ec8e3", diameterEarth: 4.0, massEarth: 14.5, periodYears: 84.01, factEn: "Rotates on its side with a 98° axial tilt.", factEs: "Rota de lado con una inclinación axial de 98°." },
  { name: "Neptune", nameEs: "Neptuno", radiusKm: 24622, distanceAu: 30.069, color: "#4169e1", diameterEarth: 3.9, massEarth: 17.1, periodYears: 164.8, factEn: "Farthest planet; winds reach over 2,000 km/h.", factEs: "Planeta más lejano; vientos de más de 2.000 km/h." },
  {
    name: "Pluto",
    nameEs: "Plutón",
    radiusKm: 1188.3,
    distanceAu: 39.482,
    color: "#c8b8a0",
    diameterEarth: 0.19,
    massEarth: 0.0022,
    periodYears: 248,
    factEn: "Dwarf planet; highly eccentric orbit crosses Neptune's path.",
    factEs: "Planeta enano; órbita muy excéntrica que cruza la de Neptuno.",
    dwarf: true,
  },
];

type ScaleMode = "size" | "distance" | "both";

type Props = { locale?: "en" | "es" };

function planetRadius(p: Planet, mode: ScaleMode): number {
  if (mode === "distance") return 6;
  return Math.max(3.5, Math.log10(p.radiusKm) * 2.8);
}

function orbitRadius(p: Planet, mode: ScaleMode, i: number): number {
  if (mode === "size") return 36 + i * 28;
  return 28 + p.distanceAu * 11;
}

const STARS = Array.from({ length: 100 }, () => ({
  x: Math.random() * 1000 - 500,
  y: Math.random() * 600 - 300,
  r: Math.random() * 1.2 + 0.3,
  a: Math.random() * 0.5 + 0.3,
}));

export function SolarSystemScaleExplorer({ locale = "en" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ScaleMode>("both");
  const [showLabels, setShowLabels] = useState(true);
  const [showDwarfs, setShowDwarfs] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [trailFade, setTrailFade] = useState(0.92);
  const [dragging, setDragging] = useState<number | null>(null);
  const [panning, setPanning] = useState(false);
  const lastPtr = useRef({ x: 0, y: 0 });
  const anglesRef = useRef<number[]>(PLANETS.map((_, i) => (i / PLANETS.length) * Math.PI * 2));
  const overridesRef = useRef<(null | { x: number; y: number })[]>(PLANETS.map(() => null));
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const es = locale === "es";

  const resetOrbits = useCallback(() => {
    overridesRef.current = PLANETS.map(() => null);
    anglesRef.current = PLANETS.map((_, i) => (i / PLANETS.length) * Math.PI * 2);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setFocusIdx(null);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let trail = trailCanvasRef.current;
    if (!trail) {
      trail = document.createElement("canvas");
      trailCanvasRef.current = trail;
    }
    const tctx = trail.getContext("2d");
    if (!tctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.min(Math.floor(rect.width * 0.58), 520);
      canvas.width = w;
      canvas.height = h;
      trail!.width = w;
      trail!.height = h;
      tctx.clearRect(0, 0, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let raf = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2 + pan.x;
      const cy = h / 2 + pan.y;

      tctx.fillStyle = `rgba(2,6,23,${1 - trailFade})`;
      tctx.fillRect(0, 0, w, h);

      PLANETS.forEach((p, i) => {
        if (p.dwarf && !showDwarfs) return;
        if (overridesRef.current[i]) return;
        const period = Math.pow(p.distanceAu, 1.5);
        anglesRef.current[i] += (dt * animSpeed * 0.35) / Math.max(0.2, period);
      });

      if (focusIdx !== null && !dragging && !panning && (!PLANETS[focusIdx].dwarf || showDwarfs)) {
        const p = PLANETS[focusIdx];
        const r = orbitRadius(p, mode, focusIdx);
        const a = anglesRef.current[focusIdx];
        const ov = overridesRef.current[focusIdx];
        const px = ov ? ov.x : Math.cos(a) * r;
        const py = ov ? ov.y : Math.sin(a) * r;
        const targetX = -px * zoom;
        const targetY = -py * zoom;
        setPan((prev) => ({
          x: prev.x + (targetX - prev.x) * 0.06,
          y: prev.y + (targetY - prev.y) * 0.06,
        }));
      }

      PLANETS.forEach((p, i) => {
        if (p.dwarf && !showDwarfs) return;
        const r = orbitRadius(p, mode, i);
        const a = anglesRef.current[i];
        const ov = overridesRef.current[i];
        const x = cx + (ov ? ov.x : Math.cos(a) * r) * zoom;
        const y = cy + (ov ? ov.y : Math.sin(a) * r) * zoom;
        tctx.beginPath();
        tctx.arc(x, y, 1.2, 0, Math.PI * 2);
        tctx.fillStyle = p.color + "aa";
        tctx.fill();
      });

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(trail, 0, 0);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);
      STARS.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a * 0.6})`;
        ctx.fill();
      });

      PLANETS.forEach((p, i) => {
        if (p.dwarf && !showDwarfs) return;
        const r = orbitRadius(p, mode, i);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1 / zoom;
        ctx.stroke();
      });

      if (mode !== "size") {
        const beltR = 28 + 2.8 * 11;
        for (let k = 0; k < 48; k++) {
          const ang = (k / 48) * Math.PI * 2 + 0.3;
          const rr = beltR + (Math.sin(k * 1.7) * 6);
          const bx = Math.cos(ang) * rr;
          const by = Math.sin(ang) * rr;
          ctx.beginPath();
          ctx.arc(bx, by, 1.1 / zoom, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(180,160,120,0.55)";
          ctx.fill();
        }
      }

      const sunR = mode === "distance" ? 10 : 14;
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, sunR * 2.5);
      grd.addColorStop(0, "#fff8c0");
      grd.addColorStop(0.4, "#f9d71c");
      grd.addColorStop(1, "rgba(249,215,28,0)");
      ctx.beginPath();
      ctx.arc(0, 0, sunR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, sunR, 0, Math.PI * 2);
      ctx.fillStyle = "#f9d71c";
      ctx.fill();

      PLANETS.forEach((p, i) => {
        if (p.dwarf && !showDwarfs) return;
        const rOrb = orbitRadius(p, mode, i);
        const a = anglesRef.current[i];
        const ov = overridesRef.current[i];
        const x = ov ? ov.x : Math.cos(a) * rOrb;
        const y = ov ? ov.y : Math.sin(a) * rOrb;
        const pr = planetRadius(p, mode);

        const pg = ctx.createRadialGradient(x, y, 0, x, y, pr * 2);
        pg.addColorStop(0, p.color);
        pg.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, y, pr * 2, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, pr, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 1 / zoom;
        ctx.stroke();

        if (p.name === "Saturn") {
          ctx.beginPath();
          ctx.ellipse(x, y, pr * 1.9, pr * 0.55, -0.3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(232,213,163,0.7)";
          ctx.lineWidth = 1.5 / zoom;
          ctx.stroke();
        }

        if (p.moons && (mode === "size" || mode === "both")) {
          p.moons.forEach((m, mi) => {
            const mr = Math.max(1.2, Math.log10(m.radiusKm) * 1.4);
            const md = pr + 6 + mi * 5.5;
            const ma = a * (6 + mi * 1.2) + mi * 0.8;
            const mx = x + Math.cos(ma) * md;
            const my = y + Math.sin(ma) * md;
            ctx.beginPath();
            ctx.arc(mx, my, mr, 0, Math.PI * 2);
            ctx.fillStyle = m.color;
            ctx.fill();
          });
        }

        if (showLabels) {
          ctx.fillStyle = focusIdx === i ? "#fff" : "rgba(255,255,255,0.85)";
          ctx.font = `${Math.max(10, 11 / zoom)}px system-ui,sans-serif`;
          ctx.fillText(es ? p.nameEs : p.name, x + pr + 4, y + 3);
        }
      });

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [mode, showLabels, showDwarfs, zoom, pan, animSpeed, trailFade, focusIdx, dragging, panning, es]);

  const hitTest = (clientX: number, clientY: number): number | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = (clientX - rect.left - canvas.width / 2 - pan.x) / zoom;
    const my = (clientY - rect.top - canvas.height / 2 - pan.y) / zoom;
    for (let i = PLANETS.length - 1; i >= 0; i--) {
      const p = PLANETS[i];
      if (p.dwarf && !showDwarfs) continue;
      const rOrb = orbitRadius(p, mode, i);
      const a = anglesRef.current[i];
      const ov = overridesRef.current[i];
      const x = ov ? ov.x : Math.cos(a) * rOrb;
      const y = ov ? ov.y : Math.sin(a) * rOrb;
      const pr = planetRadius(p, mode);
      if (Math.hypot(mx - x, my - y) < Math.max(pr + 8, 14)) return i;
    }
    return null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    lastPtr.current = { x: e.clientX, y: e.clientY };
    const hit = hitTest(e.clientX, e.clientY);
    if (hit !== null) {
      setDragging(hit);
      setFocusIdx(hit);
    } else {
      setPanning(true);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging !== null) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left - canvas.width / 2 - pan.x) / zoom;
      const my = (e.clientY - rect.top - canvas.height / 2 - pan.y) / zoom;
      overridesRef.current[dragging] = { x: mx, y: my };
      return;
    }
    if (panning) {
      const dx = e.clientX - lastPtr.current.x;
      const dy = e.clientY - lastPtr.current.y;
      lastPtr.current = { x: e.clientX, y: e.clientY };
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    }
  };

  const onPointerUp = () => {
    setDragging(null);
    setPanning(false);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(4, Math.max(0.25, z * (e.deltaY > 0 ? 0.92 : 1.08))));
  };

  const shareUrl = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({ title: es ? "Escala del Sistema Solar" : "Solar System Scale", url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "solar-system-scale.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const btn = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition ${active ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`;

  const focused = focusIdx !== null && (!PLANETS[focusIdx].dwarf || showDwarfs) ? PLANETS[focusIdx] : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setMode("size")} className={btn(mode === "size")}>
          {es ? "Solo tamaño" : "Size only"}
        </button>
        <button type="button" onClick={() => setMode("distance")} className={btn(mode === "distance")}>
          {es ? "Solo distancia" : "Distance only"}
        </button>
        <button type="button" onClick={() => setMode("both")} className={btn(mode === "both")}>
          {es ? "Ambos" : "Both"}
        </button>
        <button type="button" onClick={() => setShowLabels((v) => !v)} className={btn(false)}>
          {showLabels ? (es ? "Ocultar etiquetas" : "Hide labels") : es ? "Mostrar etiquetas" : "Show labels"}
        </button>
        <button type="button" onClick={() => setShowDwarfs((v) => !v)} className={btn(showDwarfs)}>
          {es ? "Plutón" : "Pluto"}
        </button>
        <button type="button" onClick={() => setZoom((z) => Math.min(4, z + 0.25))} className={btn(false)}>
          +
        </button>
        <button type="button" onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))} className={btn(false)}>
          −
        </button>
        <button type="button" onClick={resetOrbits} className={btn(false)}>
          {es ? "Reiniciar" : "Reset"}
        </button>
        <button type="button" onClick={shareUrl} className={btn(false)}>
          {es ? "Compartir" : "Share"}
        </button>
        <button type="button" onClick={downloadPng} className={btn(false)}>
          PNG
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">{es ? "Velocidad" : "Speed"}</span>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={animSpeed}
            onChange={(e) => setAnimSpeed(Number(e.target.value))}
            className="w-24"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">{es ? "Estela" : "Trail"}</span>
          <input
            type="range"
            min={0.7}
            max={0.98}
            step={0.01}
            value={trailFade}
            onChange={(e) => setTrailFade(Number(e.target.value))}
            className="w-24"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">{es ? "Foco" : "Focus"}</span>
          <select
            className="rounded-md border bg-background px-2 py-1"
            value={focusIdx === null ? "" : String(focusIdx)}
            onChange={(e) => setFocusIdx(e.target.value === "" ? null : Number(e.target.value))}
          >
            <option value="">{es ? "Ninguno" : "None"}</option>
            {PLANETS.filter((p) => !p.dwarf || showDwarfs).map((p) => (
              <option key={p.name} value={PLANETS.indexOf(p)}>
                {es ? p.nameEs : p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border/40 bg-muted/20 p-3">
        <span className="text-xs font-medium text-muted-foreground self-center mr-2">
          {es ? "Comparación de tamaños (vs Tierra)" : "Size comparison (vs Earth)"}
        </span>
        {PLANETS.filter((p) => !p.dwarf || showDwarfs).map((p) => {
          const size = Math.max(6, Math.min(36, 8 + p.diameterEarth * 2.2));
          return (
            <div key={p.name} className="flex flex-col items-center gap-1" title={`${es ? p.nameEs : p.name}: ${p.diameterEarth.toFixed(2)}×`}>
              <div
                className="rounded-full"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 6px ${p.color}88`,
                }}
              />
              <span className="text-[10px] text-muted-foreground">{es ? p.nameEs.slice(0, 3) : p.name.slice(0, 3)}</span>
            </div>
          );
        })}
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl border border-border/60 bg-slate-950"
        style={{ aspectRatio: "16 / 9", maxHeight: 520 }}
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onWheel={onWheel}
        />
      </div>

      {focused && (
        <div className="rounded-xl border border-primary/30 bg-accent/20 p-4 text-sm">
          <h3 className="font-semibold text-primary">{es ? focused.nameEs : focused.name}</h3>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>
              {es ? "Diámetro vs Tierra" : "Diameter vs Earth"}: {focused.diameterEarth.toFixed(2)}×
              <div className="mt-1 h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/80"
                  style={{ width: `${Math.min(100, focused.diameterEarth * 8)}%` }}
                />
              </div>
            </li>
            <li>{es ? "Masa vs Tierra" : "Mass vs Earth"}: {focused.massEarth.toFixed(focused.massEarth < 1 ? 3 : 0)}×</li>
            <li>{es ? "Distancia" : "Distance"}: {focused.distanceAu.toFixed(2)} AU</li>
            <li>{es ? "Período orbital" : "Orbital period"}: {focused.periodYears.toFixed(1)} {es ? "años" : "years"}</li>
            {focused.dwarf && <li className="text-amber-600">{es ? "Planeta enano" : "Dwarf planet"}</li>}
            <li className="pt-1 italic">{es ? focused.factEs : focused.factEn}</li>
          </ul>
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        {es
          ? "Arrastrá planetas para reposicionarlos; arrastrá el fondo para hacer pan; rueda para zoom. El Sol está en el centro. Escalas aproximadas: Júpiter ~11× el diámetro de la Tierra; Neptuno ~30 UA. Lunas aparecen en modos de tamaño. Cinturón de asteroides entre Marte y Júpiter. Activá Plutón para ver el planeta enano."
          : "Drag planets to reposition; drag the background to pan; scroll to zoom. The Sun is at the center. Approximate scales: Jupiter ~11× Earth diameter; Neptune ~30 AU. Moons appear in size modes. Asteroid belt between Mars and Jupiter. Toggle Pluto to see the dwarf planet."}
      </p>
    </div>
  );
}
