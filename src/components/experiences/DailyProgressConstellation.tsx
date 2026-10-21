"use client";

import { useEffect, useRef, useState } from "react";
import { type PlaygroundLocale } from "@/lib/playgrounds/next-step";

const STORAGE_KEY = "utilihub-daily-constellation-v1";

type Star = { x: number; y: number; lit: boolean; id: number; size?: number; litAt?: number };
type ConstellationData = {
  stars: Star[];
  lastVisit: number;
  totalDays: number;
  name?: string;
};

function loadData(): ConstellationData {
  if (typeof window === "undefined") return { stars: [], lastVisit: 0, totalDays: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { stars: [], lastVisit: 0, totalDays: 0 };
    return JSON.parse(raw);
  } catch {
    return { stars: [], lastVisit: 0, totalDays: 0 };
  }
}

function saveData(data: ConstellationData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function isSameDay(a: number, b: number) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

function suggestName(days: number, es: boolean): string {
  if (days >= 21) return es ? "Constelación del Habitante" : "Habitant's Constellation";
  if (days >= 14) return es ? "Constelación del Viajero" : "Traveler's Constellation";
  if (days >= 7) return es ? "Constelación de la Semana" : "Week's Constellation";
  if (days >= 3) return es ? "Constelación Naciente" : "Rising Constellation";
  return es ? "Mi Constelación" : "My Constellation";
}

function isMilestone(days: number): boolean {
  return [3, 7, 14, 21, 30].includes(days);
}

export function DailyProgressConstellation({ locale = "en" }: { locale?: PlaygroundLocale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<ConstellationData>({ stars: [], lastVisit: 0, totalDays: 0 });
  const [shareMsg, setShareMsg] = useState("");
  const [hover, setHover] = useState<{ star: Star; x: number; y: number } | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [milestoneMsg, setMilestoneMsg] = useState("");
  const animRef = useRef<number>(0);
  const es = locale === "es";

  useEffect(() => {
    const now = Date.now();
    let prev = loadData();
    let newStarAdded = false;
    if (prev.lastVisit === 0 || !isSameDay(prev.lastVisit, now)) {
      const newStar: Star = {
        x: 0.12 + Math.random() * 0.76,
        y: 0.12 + Math.random() * 0.76,
        lit: true,
        id: prev.stars.length,
        size: 2.5 + Math.random() * 2.5,
        litAt: now,
      };
      prev = {
        ...prev,
        stars: [...prev.stars, newStar].slice(-48),
        lastVisit: now,
        totalDays: prev.totalDays + 1,
      };
      newStarAdded = true;
      saveData(prev);
    }
    if (!prev.name) {
      prev = { ...prev, name: suggestName(prev.totalDays, es) };
      saveData(prev);
    }
    setData(prev);
    setNameInput(prev.name || "");
    if (newStarAdded && isMilestone(prev.totalDays)) {
      const msg = es
        ? `\u00a1Hito! ${prev.totalDays} d\u00edas \u00b7 ${suggestName(prev.totalDays, true)}`
        : `Milestone! ${prev.totalDays} days \u00b7 ${suggestName(prev.totalDays, false)}`;
      setMilestoneMsg(msg);
      setTimeout(() => setMilestoneMsg(""), 4200);
    }
  }, [es]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#050814");
      g.addColorStop(1, "#0c1224");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      for (let i = 0; i < 48; i++) {
        const px = ((i * 97) % 100) / 100 * w;
        const py = ((i * 53) % 100) / 100 * h;
        ctx.beginPath();
        ctx.arc(px, py, 0.6 + (i % 3) * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
      ctx.lineWidth = 1.2;
      for (let i = 1; i < data.stars.length; i++) {
        const a = data.stars[i - 1];
        const b = data.stars[i];
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.stroke();
      }

      const phase = time * 0.002;
      const newestId = data.stars.length ? data.stars[data.stars.length - 1].id : -1;
      data.stars.forEach((s, idx) => {
        const sx = s.x * w;
        const sy = s.y * h;
        const base = s.size ?? 3;
        const isNewest = s.id === newestId;
        const twinkle = s.lit ? 0.75 + 0.25 * Math.sin(phase + idx * 0.7) : 0.4;
        const pulse = isNewest ? 1 + 0.35 * Math.sin(phase * 1.6) : 1;
        const r = base * twinkle * pulse;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = s.lit ? "#67e8f9" : "#94a3b8";
        ctx.fill();
        if (s.lit) {
          ctx.shadowColor = "#22d3ee";
          ctx.shadowBlur = (isNewest ? 18 : 12) * twinkle;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(103,232,249,${(isNewest ? 0.7 : 0.4) * twinkle})`;
          ctx.lineWidth = isNewest ? 1.5 : 1;
          ctx.beginPath();
          ctx.moveTo(sx - r * 2.4, sy);
          ctx.lineTo(sx + r * 2.4, sy);
          ctx.moveTo(sx, sy - r * 2.4);
          ctx.lineTo(sx, sy + r * 2.4);
          ctx.stroke();
        }
      });

      // Bake name into canvas for PNG shares
      const name = data.name || suggestName(data.totalDays, es);
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillStyle = "rgba(103, 232, 249, 0.85)";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(name, w / 2, h - 12);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText(`${data.totalDays} ${es ? "estrellas" : "stars"}`, w / 2, h - 28);
    };

    const loop = (time: number) => {
      draw(time);
      animRef.current = requestAnimationFrame(loop);
    };

    const hitTest = (mx: number, my: number): Star | null => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      for (let i = data.stars.length - 1; i >= 0; i--) {
        const s = data.stars[i];
        const sx = s.x * w;
        const sy = s.y * h;
        const dist = Math.hypot(mx - sx, my - sy);
        if (dist < (s.size ?? 3) * 5 + 10) {
          return s;
        }
      }
      return null;
    };

    const onPointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const found = hitTest(mx, my);
      setHover(found ? { star: found, x: mx, y: my } : null);
    };

    const onMouseMove = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const onMouseLeave = () => setHover(null);
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length) onPointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => setTimeout(() => setHover(null), 1800);

    resize();
    animRef.current = requestAnimationFrame(loop);
    const onResize = () => {
      resize();
      draw(performance.now());
    };
    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [data, es]);

  function updateName(newName: string) {
    const trimmed = newName.trim().slice(0, 40) || suggestName(data.totalDays, es);
    const next = { ...data, name: trimmed };
    saveData(next);
    setData(next);
    setNameInput(trimmed);
    setEditingName(false);
  }

  function resetConstellation() {
    if (!confirm(es ? "\u00bfBorrar toda la constelaci\u00f3n? No se puede deshacer." : "Clear the entire constellation? This cannot be undone.")) return;
    const empty: ConstellationData = { stars: [], lastVisit: 0, totalDays: 0 };
    saveData(empty);
    setData(empty);
    setNameInput("");
    setShareMsg(es ? "Constelaci\u00f3n reiniciada" : "Constellation reset");
    setTimeout(() => setShareMsg(""), 2200);
  }

  async function shareText() {
    const name = data.name || suggestName(data.totalDays, es);
    const text = es
      ? `${name}: ${data.totalDays} estrellas en mi constelaci\u00f3n de progreso UtiliHub \u2728`
      : `${name}: ${data.totalDays} stars in my UtiliHub progress constellation \u2728`;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text, url });
        setShareMsg(es ? "\u00a1Compartido!" : "Shared!");
      } catch {
        setShareMsg(es ? "Cancelado" : "Cancelled");
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShareMsg(es ? "Copiado" : "Copied");
    }
    setTimeout(() => setShareMsg(""), 2200);
  }

  function sharePng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `constellation-${(data.name || "progress").replace(/\\s+/g, "-").toLowerCase()}-${data.totalDays}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setShareMsg(es ? "PNG descargado (con nombre)" : "PNG downloaded (with name)");
      setTimeout(() => setShareMsg(""), 2200);
    }, "image/png");
  }

  const lastStr = data.lastVisit
    ? new Date(data.lastVisit).toLocaleDateString(es ? "es" : "en", { month: "short", day: "numeric" })
    : "\u2014";

  const hoverDate = hover?.star.litAt
    ? new Date(hover.star.litAt).toLocaleDateString(es ? "es" : "en", { year: "numeric", month: "short", day: "numeric" })
    : es ? "fecha no guardada" : "date not stored";

  const displayName = data.name || suggestName(data.totalDays, es);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-surface/40 p-4 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">
          {es ? "Constelaci\u00f3n de progreso" : "Progress constellation"}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {editingName ? (
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={() => updateName(nameInput)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateName(nameInput);
                if (e.key === "Escape") setEditingName(false);
              }}
              className="rounded border border-cyan-500/40 bg-background px-2 py-0.5 text-2xl font-black outline-none focus:ring-1 focus:ring-cyan-500"
              maxLength={40}
            />
          ) : (
            <h2 className="text-2xl font-black">{displayName}</h2>
          )}
          <button
            type="button"
            onClick={() => {
              setNameInput(displayName);
              setEditingName(true);
            }}
            className="text-xs text-cyan-500 hover:underline"
          >
            {es ? "editar" : "edit"}
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.totalDays} {es ? "estrellas" : "stars"} \u00b7 {es ? "Cada visita diaria enciende una nueva." : "Each daily visit lights a new one."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {es ? "\u00daltima visita:" : "Last visit:"} {lastStr}
        </p>
        {milestoneMsg && (
          <p className="mt-2 text-sm font-semibold text-cyan-400">{milestoneMsg}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={shareText}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-400"
          >
            {es ? "Compartir texto" : "Share text"}
          </button>
          <button
            type="button"
            onClick={sharePng}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-400"
          >
            {es ? "Descargar PNG" : "Download PNG"}
          </button>
          <button
            type="button"
            onClick={resetConstellation}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
          >
            {es ? "Reiniciar" : "Reset"}
          </button>
          {shareMsg && <span className="self-center text-[11px] text-cyan-500">{shareMsg}</span>}
        </div>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 bg-black">
        <canvas ref={canvasRef} className="h-full w-full touch-manipulation" />
        {hover && (
          <div
            className="pointer-events-none absolute z-10 rounded-md border border-cyan-500/40 bg-black/80 px-2 py-1 text-[11px] font-medium text-cyan-100 shadow-lg"
            style={{
              left: Math.min(hover.x + 10, (canvasRef.current?.clientWidth ?? 200) - 140),
              top: Math.max(hover.y - 28, 4),
            }}
          >
            {es ? "Encendida" : "Lit"}: {hoverDate}
            <span className="ml-1 opacity-70">#{hover.star.id + 1}</span>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {es
          ? "Las estrellas se guardan localmente. Toc\u00e1 o pas\u00e1 el mouse sobre una estrella para ver su fecha. El nombre se graba en el PNG. Volv\u00e9 ma\u00f1ana para encender otra."
          : "Stars are stored locally. Tap or hover a star to see its date. The name is baked into the PNG. Return tomorrow to light another."}
      </p>
    </div>
  );
}
