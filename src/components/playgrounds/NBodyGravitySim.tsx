"use client";

import { useEffect, useRef, useState } from "react";
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
const TRAIL_LEN = 48;
const G = 0.15;

const labels = {
  en: {
    help: "Tap + drag to place body + velocity arrow. Uncheck Add for pan. Pinch or wheel to zoom. Right-click or long-press (hold ~0.6s) remove. Cap 20 CWV.",
    add: "Add body mode",
    mass: "Mass",
    speed: "Initial speed",
    color: "Color",
    time: "Time scale",
    trails: "Trails",
    pause: "Pause",
    resume: "Resume",
    resetCam: "Reset camera",
    clear: "Clear all",
    share: "Copy share link",
    copied: "Copied!",
    png: "Download PNG",
    shareNative: "Share",
    zoomIn: "Zoom +",
    zoomOut: "Zoom \u2212",
    presets: "Presets",
    binary: "Binary stars",
    solar: "Mini solar",
    chaotic: "Chaotic cluster",
    figure8: "Figure-8",
    bodies: "Bodies",
  },
  es: {
    help: "Toque + arrastr\u00e1 para colocar cuerpo + flecha velocidad. Desmarc\u00e1 Agregar para pan. Pellizco o rueda para zoom. Clic derecho o presi\u00f3n larga (~0.6s) elimina. L\u00edmite 20 CWV.",
    add: "Modo agregar",
    mass: "Masa",
    speed: "Velocidad inicial",
    color: "Color",
    time: "Escala de tiempo",
    trails: "Estelas",
    pause: "Pausar",
    resume: "Reanudar",
    resetCam: "Reset c\u00e1mara",
    clear: "Limpiar todo",
    share: "Copiar enlace",
    copied: "\u00a1Copiado!",
    png: "Descargar PNG",
    shareNative: "Compartir",
    zoomIn: "Zoom +",
    zoomOut: "Zoom \u2212",
    presets: "Preajustes",
    binary: "Estrellas binarias",
    solar: "Mini solar",
    chaotic: "C\u00famulo ca\u00f3tico",
    figure8: "Figura-8",
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
  const dragRef = useRef<{
    startX: number;
    startY: number;
    mode: "add" | "pan";
    previewVx?: number;
    previewVy?: number;
  } | null>(null);
  const addModeRef = useRef(true);
  const massRef = useRef(8);
  const speedRef = useRef(1.2);
  const colorRef = useRef("#60a5fa");
  const longPressTimer = useRef<number | null>(null);
  const longPressStart = useRef<{x: number; y: number; worldX: number; worldY: number} | null>(null);

  const [paused, setPaused] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [trails, setTrails] = useState(true);
  const [mass, setMass] = useState(8);
  const [speed, setSpeed] = useState(1.2);
  const [bodyColor, setBodyColor] = useState("#60a5fa");
  const [addMode, setAddMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bodyCount, setBodyCount] = useState(0);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    timeScaleRef.current = timeScale;
  }, [timeScale]);
  useEffect(() => {
    trailsOnRef.current = trails;
  }, [trails]);
  useEffect(() => {
    addModeRef.current = addMode;
  }, [addMode]);
  useEffect(() => {
    massRef.current = mass;
  }, [mass]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    colorRef.current = bodyColor;
  }, [bodyColor]);

  const updateCount = () => setBodyCount(bodiesRef.current.length);

  const addBody = (x: number, y: number, vx = 0, vy = 0, m = massRef.current, color?: string) => {
    if (bodiesRef.current.length >= MAX_BODIES) return;
    const b: Body = {
      id: nextId.current++,
      x,
      y,
      vx,
      vy,
      mass: m,
      radius: Math.sqrt(m) * 1.8 + 2,
      color: color || colorRef.current || PRESET_COLORS[bodiesRef.current.length % PRESET_COLORS.length],
      trail: [],
    };
    bodiesRef.current.push(b);
    updateCount();
  };

  const loadPreset = (name: string) => {
    bodiesRef.current = [];
    nextId.current = 1;
    cameraRef.current = { x: 0, y: 0, scale: 1 };
    const cx = 0;
    const cy = 0;
    if (name === "binary") {
      addBody(cx - 70, cy, 0, 1.05, 22, "#60a5fa");
      addBody(cx + 70, cy, 0, -1.05, 18, "#f472b6");
    } else if (name === "solar") {
      addBody(cx, cy, 0, 0, 48, "#fbbf24");
      addBody(cx + 90, cy, 0, 1.85, 3, "#a3a3a3");
      addBody(cx + 140, cy, 0, 1.45, 7, "#60a5fa");
      addBody(cx - 110, cy, 0, -1.55, 5, "#34d399");
      addBody(cx, cy + 190, -1.15, 0, 4, "#a78bfa");
      addBody(cx + 210, cy + 30, 0, 1.05, 9, "#f97316");
    } else if (name === "chaotic") {
      addBody(cx, cy, 0, 0, 28, "#fbbf24");
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 2 + Math.random() * 0.3;
        const r = 70 + Math.random() * 90;
        addBody(
          cx + Math.cos(ang) * r,
          cy + Math.sin(ang) * r,
          (Math.random() - 0.5) * 2.4,
          (Math.random() - 0.5) * 2.4,
          3 + Math.random() * 9,
        );
      }
    } else if (name === "figure8") {
      // Approximate figure-8 choreography seeds (scaled)
      addBody(cx, cy, 0.347, 0.532, 12, "#60a5fa");
      addBody(cx + 80, cy, -0.174, -0.266, 12, "#f472b6");
      addBody(cx - 80, cy, -0.174, -0.266, 12, "#34d399");
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
        const x = parseFloat(xs);
        const y = parseFloat(ys);
        const vx = parseFloat(vxs);
        const vy = parseFloat(vys);
        const m = parseFloat(ms);
        if (!isNaN(x) && !isNaN(y)) {
          addBody(x, y, vx || 0, vy || 0, m || 8, col ? `#${col}` : undefined);
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

    const clearLongPress = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      longPressStart.current = null;
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      const { x, y } = getPos(e);
      const world = screenToWorld(x, y);
      clearLongPress();
      if (e.button === 2) {
        // right-click remove nearest
        let best = -1;
        let bestD = 40 / cameraRef.current.scale;
        bodiesRef.current.forEach((b, i) => {
          const d = Math.hypot(b.x - world.x, b.y - world.y);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        if (best >= 0) {
          bodiesRef.current.splice(best, 1);
          updateCount();
        }
        return;
      }
      if (addModeRef.current && bodiesRef.current.length < MAX_BODIES) {
        dragRef.current = { startX: world.x, startY: world.y, mode: "add", previewVx: 0, previewVy: 0 };
      } else {
        dragRef.current = { startX: x, startY: y, mode: "pan" };
      }
      // long-press remove (mobile)
      if (e.button === 0) {
        longPressStart.current = { x, y, worldX: world.x, worldY: world.y };
        longPressTimer.current = window.setTimeout(() => {
          const lp = longPressStart.current;
          if (!lp) return;
          let best = -1;
          let bestD = 48 / cameraRef.current.scale;
          bodiesRef.current.forEach((b, i) => {
            const d = Math.hypot(b.x - lp.worldX, b.y - lp.worldY);
            if (d < bestD) {
              bestD = d;
              best = i;
            }
          });
          if (best >= 0) {
            bodiesRef.current.splice(best, 1);
            updateCount();
            dragRef.current = null; // cancel pending add/pan
          }
          clearLongPress();
        }, 620);
      }
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (longPressStart.current) {
        const { x, y } = getPos(e);
        const lp = longPressStart.current;
        if (Math.hypot(x - lp.x, y - lp.y) > 12) clearLongPress();
      }
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
      } else if (d.mode === "add") {
        const world = screenToWorld(x, y);
        const dx = world.x - d.startX;
        const dy = world.y - d.startY;
        const dist = Math.hypot(dx, dy);
        if (dist > 6) {
          const s = speedRef.current * (dist / 40);
          d.previewVx = (dx / dist) * s;
          d.previewVy = (dy / dist) * s;
        } else {
          d.previewVx = 0;
          d.previewVy = 0;
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      clearLongPress();
      if (!dragRef.current) return;
      const d = dragRef.current;
      if (d.mode === "add") {
        addBody(d.startX, d.startY, d.previewVx || 0, d.previewVy || 0, massRef.current);
      }
      dragRef.current = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    };

    const onContextMenu = (e: Event) => e.preventDefault();

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("contextmenu", onContextMenu);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      cameraRef.current.scale = Math.max(0.25, Math.min(5, cameraRef.current.scale * factor));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    // Pinch-to-zoom for mobile
    let pinchDist = 0;
    let pinchScale = 1;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0], t2 = e.touches[1];
        pinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        pinchScale = cameraRef.current.scale;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchDist > 0) {
        e.preventDefault();
        const t1 = e.touches[0], t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = dist / pinchDist;
        cameraRef.current.scale = Math.max(0.25, Math.min(5, pinchScale * factor));
      }
    };
    const onTouchEnd = () => { pinchDist = 0; };
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

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
          const dist2 = dx * dx + dy * dy + 25;
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

        for (let j = i + 1; j < n; j++) {
          const o = bs[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const d = Math.hypot(dx, dy) || 1;
          const minD = b.radius + o.radius;
          if (d < minD) {
            const overlap = minD - d;
            const nx = dx / d;
            const ny = dy / d;
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
      for (let i = 0; i < 50; i++) {
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
          for (let k = 1; k < b.trail.length; k++) {
            const alpha = Math.floor((k / b.trail.length) * 180 + 40).toString(16).padStart(2, "0");
            ctx.beginPath();
            ctx.moveTo(b.trail[k - 1].x, b.trail[k - 1].y);
            ctx.lineTo(b.trail[k].x, b.trail[k].y);
            ctx.strokeStyle = b.color + alpha;
            ctx.lineWidth = (1.2 + (k / b.trail.length) * 1.2) / cam.scale;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }
        // soft glow
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius * 2.4);
        grad.addColorStop(0, b.color);
        grad.addColorStop(0.4, b.color + "cc");
        grad.addColorStop(1, b.color + "00");
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        // specular highlight
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff55";
        ctx.fill();
        ctx.strokeStyle = "#ffffff66";
        ctx.lineWidth = 1.2 / cam.scale;
        ctx.stroke();
      }

      // velocity preview while dragging to add
      const d = dragRef.current;
      if (d && d.mode === "add") {
        ctx.beginPath();
        ctx.arc(d.startX, d.startY, Math.sqrt(massRef.current) * 1.8 + 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff33";
        ctx.fill();
        ctx.strokeStyle = "#ffffff88";
        ctx.lineWidth = 1.5 / cam.scale;
        ctx.stroke();
        if (d.previewVx || d.previewVy) {
          const ex = d.startX + (d.previewVx || 0) * 28;
          const ey = d.startY + (d.previewVy || 0) * 28;
          ctx.beginPath();
          ctx.moveTo(d.startX, d.startY);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 2 / cam.scale;
          ctx.stroke();
          // arrow head
          const ang = Math.atan2(ey - d.startY, ex - d.startX);
          const ah = 8 / cam.scale;
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - ah * Math.cos(ang - 0.4), ey - ah * Math.sin(ang - 0.4));
          ctx.lineTo(ex - ah * Math.cos(ang + 0.4), ey - ah * Math.sin(ang + 0.4));
          ctx.closePath();
          ctx.fillStyle = "#22d3ee";
          ctx.fill();
        }
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
      canvas.removeEventListener("contextmenu", onContextMenu);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const zoomBy = (f: number) => {
    cameraRef.current.scale = Math.max(0.25, Math.min(5, cameraRef.current.scale * f));
  };

  const shareUrl = async () => {
    const parts = bodiesRef.current.map(
      (b) => `${b.x.toFixed(1)},${b.y.toFixed(1)},${b.vx.toFixed(2)},${b.vy.toFixed(2)},${b.mass},${b.color.replace("#", "")}`,
    );
    const url = new URL(window.location.href);
    url.searchParams.set("b", parts.join("|"));
    url.searchParams.set("ts", String(timeScale));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "n-body-gravity.png";
    a.click();
  };

  const shareNative = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "n-body-gravity.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "N-Body Gravity", text: "Simulaci\u00f3n N-Body" });
        } catch {}
      } else {
        downloadPng();
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-[#050814]">
        <canvas ref={canvasRef} className="h-full w-full touch-none" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={addMode} onChange={(e) => setAddMode(e.target.checked)} />
          {t.add}
        </label>
        <label className="flex flex-col text-xs">
          {t.mass}
          <input type="range" min={2} max={40} value={mass} onChange={(e) => setMass(Number(e.target.value))} />
        </label>
        <label className="flex flex-col text-xs">
          {t.speed}
          <input type="range" min={0.2} max={4} step={0.1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </label>
        <label className="flex flex-col text-xs">
          {t.color}
          <input type="color" value={bodyColor} onChange={(e) => setBodyColor(e.target.value)} className="h-8 w-full" />
        </label>
        <label className="flex flex-col text-xs">
          {t.time}
          <input type="range" min={0.25} max={3} step={0.25} value={timeScale} onChange={(e) => setTimeScale(Number(e.target.value))} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={trails} onChange={(e) => setTrails(e.target.checked)} />
          {t.trails}
        </label>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
        >
          {paused ? t.resume : t.pause}
        </button>
        <button
          type="button"
          onClick={() => {
            cameraRef.current = { x: 0, y: 0, scale: 1 };
          }}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
        >
          {t.resetCam}
        </button>
        <button
          type="button"
          onClick={() => {
            bodiesRef.current = [];
            updateCount();
          }}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
        >
          {t.clear}
        </button>
        <div className="flex items-center text-xs text-muted-foreground">
          {t.bodies}: {bodyCount}/{MAX_BODIES}
        </div>
        <div className="col-span-full flex flex-wrap gap-2">
          <span className="text-xs font-semibold">{t.presets}</span>
          <button
            type="button"
            onClick={() => loadPreset("binary")}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.binary}
          </button>
          <button
            type="button"
            onClick={() => loadPreset("solar")}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.solar}
          </button>
          <button
            type="button"
            onClick={() => loadPreset("chaotic")}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.chaotic}
          </button>
          <button
            type="button"
            onClick={() => loadPreset("figure8")}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.figure8}
          </button>
          <button
            type="button"
            onClick={shareUrl}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            {copied ? t.copied : t.share}
          </button>
          <button
            type="button"
            onClick={downloadPng}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            {t.png}
          </button>
          <button
            type="button"
            onClick={shareNative}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            {t.shareNative}
          </button>
          <button
            type="button"
            onClick={() => zoomBy(1.15)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.zoomIn}
          </button>
          <button
            type="button"
            onClick={() => zoomBy(0.87)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.zoomOut}
          </button>
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-4">{t.help}</p>
      </div>
    </div>
  );
}
