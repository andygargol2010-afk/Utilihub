"use client";

import { useEffect, useRef, useState } from "react";
import { type PlaygroundLocale } from "@/lib/playgrounds/next-step";

const STORAGE_KEY = "utilihub-streak-constellation-v1";

type Star = { x: number; y: number; size: number; born: number; hue?: number };
type Data = { stars: Star[]; streak: number; lastCheckIn: number; name?: string };

function load(): Data {
  if (typeof window === "undefined") return { stars: [], streak: 0, lastCheckIn: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { stars: [], streak: 0, lastCheckIn: 0 };
  } catch {
    return { stars: [], streak: 0, lastCheckIn: 0 };
  }
}

function save(d: Data) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
}

function sameDay(a: number, b: number) {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

function parseQuery(): Partial<Data> | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const s = p.get("stars");
  const st = p.get("streak");
  if (!s && !st) return null;
  const stars: Star[] = [];
  if (s) {
    s.split(";").forEach((pair) => {
      const [x, y] = pair.split(",").map(Number);
      if (!isNaN(x) && !isNaN(y)) stars.push({ x, y, size: 3 + Math.random() * 2, born: Date.now() });
    });
  }
  return { stars, streak: st ? Number(st) || 0 : stars.length };
}

function toQuery(d: Data): string {
  const stars = d.stars.map((s) => `${s.x.toFixed(3)},${s.y.toFixed(3)}`).join(";");
  return `?stars=${encodeURIComponent(stars)}&streak=${d.streak}`;
}

function milestoneColor(streak: number, i: number): string {
  if (streak >= 30) return `hsl(${(i * 37) % 360}, 85%, 62%)`;
  if (streak >= 14) return "#c084fc"; // purple
  if (streak >= 7) return "#fbbf24"; // gold
  return "#38bdf8"; // cyan
}

export function StreakConstellation({ locale = "en" }: { locale?: PlaygroundLocale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<Data>({ stars: [], streak: 0, lastCheckIn: 0 });
  const [msg, setMsg] = useState("");
  const [placing, setPlacing] = useState(false);
  const anim = useRef(0);
  const es = locale === "es";

  useEffect(() => {
    let d = load();
    const q = parseQuery();
    if (q && q.stars && q.stars.length > d.stars.length) {
      d = { ...d, ...q, lastCheckIn: Date.now() };
      save(d);
    }
    const now = Date.now();
    if (!sameDay(d.lastCheckIn, now) && d.lastCheckIn !== 0) {
      // new day available
    } else if (d.lastCheckIn === 0) {
      d.streak = Math.max(d.streak, 1);
    }
    setData(d);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number, forExport = false) => {
      const w = c.clientWidth, h = c.clientHeight;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#020617");
      g.addColorStop(1, "#0f172a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // bg stars
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc((i * 97 % 100) / 100 * w, (i * 53 % 100) / 100 * h, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // lines
      const lineAlpha = data.streak >= 7 ? 0.6 : 0.4;
      ctx.strokeStyle = `rgba(56,189,248,${lineAlpha})`;
      ctx.lineWidth = data.streak >= 14 ? 1.6 : 1.2;
      for (let i = 1; i < data.stars.length; i++) {
        const a = data.stars[i - 1], b = data.stars[i];
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.stroke();
      }

      const phase = t * 0.003;
      data.stars.forEach((s, i) => {
        const age = Math.min(1, (t - s.born) / 800);
        const grow = 0.4 + 0.6 * Math.sin(age * Math.PI / 2);
        const tw = 0.8 + 0.2 * Math.sin(phase + i);
        const r = s.size * grow * tw;
        const sx = s.x * w, sy = s.y * h;
        const color = milestoneColor(data.streak, i);
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowColor = color;
        ctx.shadowBlur = (data.streak >= 7 ? 18 : 14) * tw;
        ctx.fill();
        ctx.shadowBlur = 0;
        // cross
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx - r * 2, sy); ctx.lineTo(sx + r * 2, sy);
        ctx.moveTo(sx, sy - r * 2); ctx.lineTo(sx, sy + r * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // branding
      ctx.font = "bold 13px system-ui";
      ctx.fillStyle = "rgba(56,189,248,0.9)";
      ctx.textAlign = "center";
      ctx.fillText(es ? "Constelaci\u00f3n de racha UtiliHub" : "UtiliHub Streak Constellation", w / 2, h - 10);

      if (forExport && data.streak > 0) {
        ctx.font = "bold 28px system-ui";
        ctx.fillStyle = "#fff";
        ctx.fillText(`${data.streak} ${es ? "d\u00edas" : "days"}`, w / 2, 36);
      }
    };

    const loop = (t: number) => { draw(t); anim.current = requestAnimationFrame(loop); };
    resize();
    anim.current = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(anim.current); window.removeEventListener("resize", resize); };
  }, [data, es]);

  function checkIn() {
    const now = Date.now();
    if (sameDay(data.lastCheckIn, now) && data.lastCheckIn !== 0) {
      setMsg(es ? "Ya hiciste check-in hoy" : "Already checked in today");
      setTimeout(() => setMsg(""), 2000);
      return;
    }
    const nextStreak = sameDay(data.lastCheckIn, now - 86400000) || data.lastCheckIn === 0 ? data.streak + 1 : 1;
    const next = { ...data, streak: nextStreak, lastCheckIn: now };
    save(next);
    setData(next);
    setPlacing(true);
    setMsg(es ? `Racha: ${nextStreak} \u00b7 toc\u00e1 el canvas para colocar estrella` : `Streak: ${nextStreak} \u00b7 tap canvas to place star`);
  }

  function placeStar(e: React.MouseEvent | React.TouchEvent) {
    if (!placing) return;
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - r.left) / r.width;
    const y = (clientY - r.top) / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    const star: Star = { x, y, size: 3.2 + Math.random() * 1.8, born: performance.now() };
    const next = { ...data, stars: [...data.stars, star].slice(-36) };
    save(next);
    setData(next);
    setPlacing(false);
    const url = window.location.pathname + toQuery(next);
    window.history.replaceState(null, "", url);
    setMsg(es ? "Estrella colocada \u00b7 progreso en URL" : "Star placed \u00b7 progress in URL");
    setTimeout(() => setMsg(""), 2200);
  }

  function exportPng() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    // redraw with overlay
    const t = performance.now();
    // temporary draw call via re-trigger not easy; draw overlay then blob then clear overlay by next frame
    const w = c.clientWidth, h = c.clientHeight;
    ctx.save();
    ctx.font = "bold 28px system-ui";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(`${data.streak} ${es ? "d\u00edas" : "days"}`, w / 2, 36);
    ctx.restore();
    c.toBlob((b) => {
      if (!b) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = `streak-constellation-${data.streak}.png`;
      a.click();
      setMsg(es ? "PNG descargado" : "PNG downloaded");
      setTimeout(() => setMsg(""), 1800);
      // force redraw clean
      const dummy = document.createEvent("Event");
      window.dispatchEvent(new Event("resize"));
    });
  }

  function copyShare() {
    const url = window.location.origin + window.location.pathname + toQuery(data);
    navigator.clipboard.writeText(url).then(() => {
      setMsg(es ? "Enlace copiado" : "Link copied");
      setTimeout(() => setMsg(""), 1800);
    }).catch(() => {
      setMsg(es ? "No se pudo copiar" : "Copy failed");
      setTimeout(() => setMsg(""), 1800);
    });
  }

  function reset() {
    if (!confirm(es ? "\u00bfReiniciar constelaci\u00f3n y racha?" : "Reset constellation and streak?")) return;
    const empty = { stars: [], streak: 0, lastCheckIn: 0 };
    save(empty);
    setData(empty);
    window.history.replaceState(null, "", window.location.pathname);
    setMsg(es ? "Reiniciado" : "Reset");
    setTimeout(() => setMsg(""), 1800);
  }

  const milestoneLabel = data.streak >= 30 ? (es ? "\u00b7 Arco\u00edris" : "\u00b7 Rainbow") : data.streak >= 14 ? (es ? "\u00b7 P\u00farpura" : "\u00b7 Purple") : data.streak >= 7 ? (es ? "\u00b7 Oro" : "\u00b7 Gold") : "";

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border/60 bg-surface/40 p-4 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">
          {es ? "Constelaci\u00f3n de racha" : "Streak constellation"}
        </p>
        <h2 className="mt-1 text-2xl font-black">{data.streak} {es ? "d\u00edas de racha" : "day streak"}{milestoneLabel}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {es
            ? "Hac\u00e9 check-in diario y coloc\u00e1 estrellas en el mapa. Colores especiales a los 7, 14 y 30 d\u00edas. Compart\u00ed el enlace para restaurar el progreso."
            : "Check in daily and place stars on the map. Special colors at 7, 14 and 30 days. Share the link to restore progress."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={checkIn} className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-400">
            {es ? "Check-in de hoy" : "Today's check-in"}
          </button>
          <button type="button" onClick={copyShare} className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-400">
            {es ? "Copiar enlace" : "Copy share link"}
          </button>
          <button type="button" onClick={exportPng} className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-400">
            {es ? "PNG con marca" : "Branded PNG"}
          </button>
          <button type="button" onClick={reset} className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400">
            {es ? "Reiniciar" : "Reset"}
          </button>
          {msg && <span className="self-center text-[11px] text-cyan-500">{msg}</span>}
        </div>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 bg-black">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-manipulation cursor-crosshair"
          onClick={placeStar}
          onTouchStart={placeStar}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {es
          ? "Progreso en localStorage + URL. Toc\u00e1 el canvas despu\u00e9s del check-in para colocar la estrella del d\u00eda. M\u00f3vil optimizado."
          : "Progress in localStorage + URL. Tap the canvas after check-in to place today's star. Mobile optimized."}
      </p>
    </div>
  );
}
