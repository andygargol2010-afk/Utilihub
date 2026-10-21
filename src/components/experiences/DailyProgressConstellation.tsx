"use client";

import { useEffect, useRef, useState } from "react";
import { PLAYGROUNDS, playgroundPath, playgroundName, type PlaygroundLocale } from "@/lib/playgrounds/next-step";

const STORAGE_KEY = "utilihub-daily-constellation-v1";

type Star = { x: number; y: number; lit: boolean; id: number; size?: number; litAt?: number };
type ConstellationData = {
  stars: Star[];
  lastVisit: number;
  totalDays: number;
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

export function DailyProgressConstellation({ locale = "en" }: { locale?: PlaygroundLocale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<ConstellationData>({ stars: [], lastVisit: 0, totalDays: 0 });
  const [shareMsg, setShareMsg] = useState("");
  const [hover, setHover] = useState<{ star: Star; x: number; y: number } | null>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const es = locale === "es";

  useEffect(() => {
    const now = Date.now();
    let prev = loadData();
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
        stars: [...prev.stars, newStar].slice(-48),
        lastVisit: now,
        totalDays: prev.totalDays + 1,
      };
      saveData(prev);
    }
    setData(prev);
  }, []);

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
      // deep sky
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#050814");
      g.addColorStop(1, "#0c1224");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // faint background stars
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      for (let i = 0; i < 40; i++) {
        const px = ((i * 97) % 100) / 100 * w;
        const py = ((i * 53) % 100) / 100 * h;
        ctx.beginPath();
        ctx.arc(px, py, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // connecting lines
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

      // stars with twinkle
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
          // cross flare
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
    };

    const loop = (time: number) => {
      draw(time);
      animRef.current = requestAnimationFrame(loop);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current = { x: mx, y: my };
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      let found: Star | null = null;
      for (let i = data.stars.length - 1; i >= 0; i--) {
        const s = data.stars[i];
        const sx = s.x * w;
        const sy = s.y * h;
        const dist = Math.hypot(mx - sx, my - sy);
        if (dist < (s.size ?? 3) * 4 + 8) {
          found = s;
          break;
        }
      }
      setHover(found ? { star: found, x: mx, y: my } : null);
    };

    const onMouseLeave = () => {
      mouseRef.current = null;
      setHover(null);
    };

    resize();
    animRef.current = requestAnimationFrame(loop);
    const onResize = () => {
      resize();
      draw(performance.now());
    };
    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [data]);

  async function shareText() {
    const text = es
      ? `Mi constelación de progreso diario en UtiliHub: ${data.totalDays} estrellas ✨`
      : `My daily progress constellation on UtiliHub: ${data.totalDays} stars ✨`;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: es ? "Mi constelación" : "My constellation", text, url });
        setShareMsg(es ? "¡Compartido!" : "Shared!");
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
      a.download = `constellation-${data.totalDays}-stars.png`;
      a.click();
      URL.revokeObjectURL(url);
      setShareMsg(es ? "PNG descargado" : "PNG downloaded");
      setTimeout(() => setShareMsg(""), 2200);
    }, "image/png");
  }

  const lastStr = data.lastVisit
    ? new Date(data.lastVisit).toLocaleDateString(es ? "es" : "en", { month: "short", day: "numeric" })
    : "—";

  const hoverDate = hover?.star.litAt
    ? new Date(hover.star.litAt).toLocaleDateString(es ? "es" : "en", { year: "numeric", month: "short", day: "numeric" })
    : es ? "fecha no guardada" : "date not stored";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-surface/40 p-4 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">
          {es ? "Constelación de progreso" : "Progress constellation"}
        </p>
        <h2 className="mt-1 text-2xl font-black">
          {data.totalDays} {es ? "estrellas" : "stars"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {es
            ? "Cada visita diaria enciende una nueva estrella. Conectá tu progreso personal."
            : "Each daily visit lights a new star. Build your personal progress constellation."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {es ? "Última visita:" : "Last visit:"} {lastStr}
        </p>
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
          {shareMsg && <span className="self-center text-[11px] text-cyan-500">{shareMsg}</span>}
        </div>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 bg-black">
        <canvas ref={canvasRef} className="h-full w-full" />
        {hover && (
          <div
            className="pointer-events-none absolute z-10 rounded-md border border-cyan-500/40 bg-black/80 px-2 py-1 text-[11px] font-medium text-cyan-100 shadow-lg"
            style={{
              left: Math.min(hover.x + 10, (canvasRef.current?.clientWidth ?? 200) - 120),
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
          ? "Las estrellas se guardan localmente. Pasá el mouse sobre una estrella para ver su fecha. Volvé mañana para encender otra."
          : "Stars are stored locally. Hover a star to see its date. Return tomorrow to light another."}
      </p>
    </div>
  );
}
