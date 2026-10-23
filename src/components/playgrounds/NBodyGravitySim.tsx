"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

type Locale = "en" | "es";

interface Body {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: { x: number; y: number }[];
}

const MAX_BODIES = 20;
const TRAIL_LEN = 40;
const G = 0.15; // gravitational constant scaled for canvas

const labels = {
  en: {
    help: "Click/tap canvas to add a body (mass, velocity from controls). Drag to set initial velocity. Soft collisions, trails, zoom/pan. Cap 20 bodies for performance.",
    add: "Add body mode",
    mass: "Mass",
    speed: "Initial speed",
    time: "Time scale",
    trails: "Trails",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    clear: "Clear all",
    share: "Copy share link",
    copied: "Copied!",
    png: "Download PNG",
    presets: "Presets",
    binary: "Binary stars",
    solar: "Mini solar",
    chaotic: "Chaotic cluster",
    bodies: "Bodies",
  },
  es: {
    help: "Clic/toque en el canvas para agregar un cuerpo (masa, velocidad desde controles). Arrastr\u00e1 para velocidad inicial. Colisiones suaves, estelas, zoom/pan. L\u00edmite 20 cuerpos para rendimiento.",
    add: "Modo agregar",
    mass: "Masa",
    speed: "Velocidad inicial",
    time: "Escala de tiempo",
    trails: "Estelas",
    pause: "Pausar",
    resume: "Reanudar",
    reset: "Reiniciar",
    clear: "Limpiar todo",
    share: "Copiar enlace",
    copied: "\u00a1Copiado!",
    png: "Descargar PNG",
    presets: "Preajustes",
    binary: "Estrellas binarias",
    solar: "Mini solar",
    chaotic: "C\u00famulo ca\u00f3tico",
    bodies: "Cuerpos",
  },
};

const PRESET_COLORS = ["#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa", "#fb7185", "#22d3ee", "#f97316"];

export function NBodyGravitySim({ locale }: { locale: Locale }) {
  const t = labels[locale];
  useEffect(() => {
    trackEvent("simulator_open", { id: "n-body-gravity-sim", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bodiesRef = useRef<Body[]>([]);
  const nextId = useRef(1);
  const pausedRef = useRef(false);
  const timeScaleRef = useRef(1);
  const trailsOnRef = useRef(true);
  const cameraRef = useRef({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef<{ startX: number; startY: number; body?: Body; mode: "add" | "pan" | "vel" } | null>(null);
  const mouseDownPos = useRef({ x: 0, y: 0 });

  const [paused, setPaused] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [trails, setTrails] = useState(true);
  const [mass, setMass] = useState(8);
  const [speed, setSpeed] = useState(1.2);
  const [addMode, setAddMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bodyCount, setBodyCount] = useState(0);

  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { timeScaleRef.current = timeScale; }, [timeScale]);
  useEffect(() => { trailsOnRef.current = trails; }, [trails]);

  const updateCount = () => setBodyCount(bodiesRef.current.length);

  const addBody = (x: number, y: number, vx = 0, vy = 0, m = mass, color?: string) => {
    if (bodiesRef.current.length >= MAX_BODIES) return;
    const b: Body = {
      id: nextId.current++,
      x, y, vx, vy,
      mass: m,
      radius: Math.sqrt(m) * 1.8 + 2,
      color: color || PRESET_COLORS[bodiesRef.current.length % PRESET_COLORS.length],
      trail: [],
    };
    bodiesRef.current.push(b);
    updateCount();
  };

  const loadPreset = (name: string) => {
    bodiesRef.current = [];
    nextId.current = 1;
    const cx = 300, cy = 220;
    if (name === "binary") {
      addBody(cx - 60, cy, 0, 1.1, 20, "#60a5fa");
      addBody(cx + 60, cy, 0, -1.1, 20, "#f472b6");
    } else if (name === "solar") {
      addBody(cx, cy, 0, 0, 40, "#fbbf24");
      addBody(cx + 120, cy, 0, 1.6, 6, "#60a5fa");
      addBody(cx - 90, cy, 0, -1.3, 4, "#34d399");
      addBody(cx, cy + 160, -1.0, 0, 3, "#a78bfa");
    } else if (name === "chaotic") {
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const r = 80 + Math.random() * 60;
        addBody(
          cx + Math.cos(ang) * r,
          cy + Math.sin(ang) * r,
          (Math.random() - 0.5) * 2.2,
          (Math.random() - 0.5) * 2.2,
          4 + Math.random() * 10,
        );
      }
    }
    updateCount();
  };

  // URL load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bStr = params.get("b");
    if (bStr) {
      const parts = bStr.split("|").filter(Boolean);
      bodiesRef.current = [];
      nextId.current = 1;
      parts.slice(0, MAX_BODIES).forEach((p) => {
        const [xs, ys, vxs, vys, ms, col] = p.split(",");
        const x = parseFloat(xs), y = parseFloat(ys), vx = parseFloat(vxs), vy = parseFloat(vys), m = parseFloat(ms);
        if (!isNaN(x) && !isNaN(y)) {
          addBody(x, y, vx || 0, vy || 0, m || 8, col || undefined);
        }
      });
    }
    const ts = parseFloat(params.get("ts") || "1");
    if (!isNaN(ts) && ts > 0 && ts <= 4) setTimeScale(ts);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const screenToWorld = (sx: number, sy: number) => {
      const cam = cameraRef.current;
      const dpr = window.devicePixelRatio || 1;
      return {
        x: (sx - canvas.width / (2 * dpr)) / cam.scale + cam.x,
        y: (sy - canvas.height / (2 * dpr)) / cam.scale + cam.y,
      };
    };

    const getPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      const { x, y } = getPos(e);
      mouseDownPos.current = { x, y };
      const world = screenToWorld(x, y);
      if (addMode && bodiesRef.current.length < MAX_BODIES) {
        dragRef.current = { startX: world.x, startY: world.y, mode: "add" };
      } else {
        dragRef.current = { startX: x, startY: y, mode: "pan" };
      }
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const { x, y } = getPos(e);
      const d = dragRef.current;
      if (d.mode === "pan") {
        const dx = (x - d.startX) / cameraRef.current.scale;
        const dy = (y - d.startY) / cameraRef.current.scale;
        cameraRef.current.x -= dx;
        cameraRef.current.y -= dy;
        d.startX = x;
        d.startY = y;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const { x, y } = getPos(e);
      const d = dragRef.current;
      if (d.mode === "add") {
        const world = screenToWorld(x, y);
        const dx = world.x - d.startX;
        const dy = world.y - d.startY;
        const dist = Math.hypot(dx, dy);
        let vx = 0, vy = 0;
        if (dist > 8) {
          vx = (dx / dist) * speed * (dist / 40);
          vy = (dy / dist) * speed * (dist / 40);
        }
        addBody(d.startX, d.startY, vx, vy, mass);
      }
      dragRef.current = null;
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      cameraRef.current.scale = Math.max(0.3, Math.min(4, cameraRef.current.scale * factor));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const step = () => {
      if (pausedRef.current) return;
      const dt = 0.016 * timeScaleRef.current;
      const bs = bodiesRef.current;
      const n = bs.length;
      const ax = new Array(n).fill(0);
      const ay = new Array(n).fill(0);

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = bs[j].x - bs[i].x;
          const dy = bs[j].y - bs[i].y;
          const dist2 = dx * dx + dy * dy + 25; // softening
          const dist = Math.sqrt(dist2);
          const force = (G * bs[i].mass * bs[j].mass) / dist2;
          const fx = (force * dx) / dist;
          const fy = (force * dy) / dist;
          ax[i] += fx / bs[i].mass;
          ay[i] += fy / bs[i].mass;
          ax[j] -= fx / bs[j].mass;
          ay[j] -= fy / bs[j].mass;
        }
      }

      for (let i = 0; i < n; i++) {
        const b = bs[i];
        b.vx += ax[i] * dt;
        b.vy += ay[i] * dt;
        b.x += b.vx * dt * 60;
        b.y += b.vy * dt * 60;

        // soft collision
        for (let j = i + 1; j < n; j++) {
          const o = bs[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const d = Math.hypot(dx, dy) || 1;
          const minD = b.radius + o.radius;
          if (d < minD) {
            const overlap = minD - d;
            const nx = dx / d, ny = dy / d;
            const totalM = b.mass + o.mass;
            b.x -= nx * overlap * (o.mass / totalM);
            b.y -= ny * overlap * (o.mass / totalM);
            o.x += nx * overlap * (b.mass / totalM);
            o.y += ny * overlap * (b.mass / totalM);
            const relV = (b.vx - o.vx) * nx + (b.vy - o.vy) * ny;
            if (relV > 0) continue;
            const impulse = (2 * relV) / totalM;
            b.vx -= impulse * o.mass * nx;
            b.vy -= impulse * o.mass * ny;
            o.vx += impulse * b.mass * nx;
            o.vy += impulse * b.mass * ny;
          }
        }

        if (trailsOnRef.current) {
          b.trail.push({ x: b.x, y: b.y });
          if (b.trail.length > TRAIL_LEN) b.trail.shift();
        } else {
          b.trail.length = 0;
        }
      }
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.fillStyle = "#050814";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#1e293b";
      for (let i = 0; i < 40; i++) {
        ctx.fillRect((i * 47) % w, (i * 73) % h, 1, 1);
      }

      ctx.save();
      const cam = cameraRef.current;
      ctx.translate(w / 2, h / 2);
      ctx.scale(cam.scale, cam.scale);
      ctx.translate(-cam.x, -cam.y);

      const bs = bodiesRef.current;
      for (const b of bs) {
        if (trailsOnRef.current && b.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(b.trail[0].x, b.trail[0].y);
          for (let k = 1; k < b.trail.length; k++) {
            ctx.lineTo(b.trail[k].x, b.trail[k].y);
          }
          ctx.strokeStyle = b.color + "88";
          ctx.lineWidth = 1.5 / cam.scale;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = "#ffffff44";
        ctx.lineWidth = 1 / cam.scale;
        ctx.stroke();
      }

      ctx.restore();
    };

    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [addMode, mass, speed]);

  const shareUrl = async () => {
    trackEvent("share_click", { id: "n-body-gravity-sim", locale });
    const parts = bodiesRef.current.map((b) =>
      `${Math.round(b.x)},${Math.round(b.y)},${b.vx.toFixed(2)},${b.vy.toFixed(2)},${b.mass.toFixed(1)},${b.color.replace("#", "")}`
    );
    const params = new URLSearchParams();
    if (parts.length) params.set("b", parts.join("|"));
    params.set("ts", timeScale.toFixed(2));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt(locale === "es" ? "Copi\u00e1 este enlace:" : "Copy this link:", url);
    }
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    trackEvent("png_download", { id: "n-body-gravity-sim", locale });
    const link = document.createElement("a");
    link.download = "n-body-gravity.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const clearAll = () => {
    bodiesRef.current = [];
    updateCount();
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#050814] shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[420px] w-full touch-none sm:h-[520px]"
          style={{ display: "block" }}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/50 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
          {t.bodies}: {bodyCount}/{MAX_BODIES}
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={addMode} onChange={(e) => setAddMode(e.target.checked)} className="accent-primary" />
          {t.add}
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>{t.mass} ({mass})</span>
          <input type="range" min={1} max={40} step={1} value={mass} onChange={(e) => setMass(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>{t.speed} ({speed.toFixed(1)})</span>
          <input type="range" min={0} max={4} step={0.1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>{t.time} ({timeScale.toFixed(1)}x)</span>
          <input type="range" min={0.2} max={3} step={0.1} value={timeScale} onChange={(e) => setTimeScale(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={trails} onChange={(e) => setTrails(e.target.checked)} className="accent-primary" />
          {t.trails}
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
          <button type="button" onClick={() => setPaused((p) => !p)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">
            {paused ? t.resume : t.pause}
          </button>
          <button type="button" onClick={clearAll} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">
            {t.clear}
          </button>
          <button type="button" onClick={() => loadPreset("binary")} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">
            {t.binary}
          </button>
          <button type="button" onClick={() => loadPreset("solar")} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">
            {t.solar}
          </button>
          <button type="button" onClick={() => loadPreset("chaotic")} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">
            {t.chaotic}
          </button>
          <button type="button" onClick={shareUrl} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            {copied ? t.copied : t.share}
          </button>
          <button type="button" onClick={downloadPng} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            {t.png}
          </button>
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-4">{t.help}</p>
      </div>
    </div>
  );
}
