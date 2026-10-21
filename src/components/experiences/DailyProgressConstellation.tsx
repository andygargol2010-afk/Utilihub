"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PLAYGROUNDS, playgroundPath, playgroundName, type PlaygroundLocale } from "@/lib/playgrounds/next-step";

const STORAGE_KEY = "utilihub-daily-constellation-v1";

type Star = { x: number; y: number; lit: boolean; id: number };
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
  const es = locale === "es";

  useEffect(() => {
    const now = Date.now();
    let prev = loadData();
    if (prev.lastVisit === 0 || !isSameDay(prev.lastVisit, now)) {
      const newStar: Star = {
        x: 0.15 + Math.random() * 0.7,
        y: 0.15 + Math.random() * 0.7,
        lit: true,
        id: prev.stars.length,
      };
      prev = {
        stars: [...prev.stars, newStar].slice(-40),
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
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
      draw();
    };
    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0a0e1a";
      ctx.fillRect(0, 0, w, h);
      // lines
      ctx.strokeStyle = "rgba(34, 211, 238, 0.4)";
      ctx.lineWidth = 1;
      for (let i = 1; i < data.stars.length; i++) {
        const a = data.stars[i - 1];
        const b = data.stars[i];
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.stroke();
      }
      // stars
      data.stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.lit ? 4 : 2, 0, Math.PI * 2);
        ctx.fillStyle = s.lit ? "#22d3ee" : "#64748b";
        ctx.fill();
        if (s.lit) {
          ctx.shadowColor = "#22d3ee";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [data]);

  async function share() {
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
    setTimeout(() => setShareMsg(""), 2000);
  }

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
        <button
          type="button"
          onClick={share}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-400"
        >
          {es ? "Compartir constelación" : "Share constellation"}
          {shareMsg && <span className="ml-1 text-[10px]">{shareMsg}</span>}
        </button>
      </div>
      <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 bg-black">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      <p className="text-xs text-muted-foreground">
        {es
          ? "Las estrellas se guardan localmente. Volvé mañana para encender otra."
          : "Stars are stored locally. Return tomorrow to light another."}
      </p>
    </div>
  );
}
