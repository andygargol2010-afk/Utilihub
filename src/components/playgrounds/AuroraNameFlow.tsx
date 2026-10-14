"use client";
// Aurora Name Flow — particles + light ribbons form typed letters in flowing aurora, mouse/touch stirs flow + light trails (2026-10-14)

import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";
type MoodId = "arctic" | "tropical" | "cosmic" | "dawn-glow";

interface Mood {
  id: MoodId;
  label: { en: string; es: string };
  bg: string;
  particle: string;
  ribbon: string;
  glow: string;
}

const MOODS: Mood[] = [
  { id: "arctic", label: { en: "Arctic", es: "Ártico" }, bg: "#041018", particle: "#7ef9ff", ribbon: "rgba(80,220,255,0.55)", glow: "rgba(100,230,255,0.8)" },
  { id: "tropical", label: { en: "Tropical", es: "Tropical" }, bg: "#0a1814", particle: "#ff6ad5", ribbon: "rgba(255,100,180,0.5)", glow: "rgba(255,120,200,0.75)" },
  { id: "cosmic", label: { en: "Cosmic", es: "Cósmico" }, bg: "#08060e", particle: "#c084fc", ribbon: "rgba(160,100,255,0.5)", glow: "rgba(140,80,255,0.8)" },
  { id: "dawn-glow", label: { en: "Dawn Glow", es: "Resplandor de amanecer" }, bg: "#1a0e0a", particle: "#ffb347", ribbon: "rgba(255,160,80,0.55)", glow: "rgba(255,140,60,0.75)" },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  size: number;
  trail: { x: number; y: number }[];
  hueShift: number;
}

const labels = {
  en: {
    message: "Your name or phrase",
    placeholder: "Aurora, UtiliHub…",
    density: "Particle density",
    speed: "Flow speed",
    mood: "Aurora mood",
    shareX: "Share on X",
    shareWA: "WhatsApp",
    shareNative: "Share",
    copy: "Copy link",
    download: "Download PNG",
    copied: "Copied!",
    shared: "Shared!",
    help: "Type a short name. Particles and light ribbons form the letters in a flowing aurora. Move mouse or touch to stir the flow, bend ribbons and create temporary light trails. Tune density and speed, pick a mood, share or download.",
  },
  es: {
    message: "Tu nombre o frase",
    placeholder: "Aurora, UtiliHub…",
    density: "Densidad de partículas",
    speed: "Velocidad de flujo",
    mood: "Ánimo de aurora",
    shareX: "Compartir en X",
    shareWA: "WhatsApp",
    shareNative: "Compartir",
    copy: "Copiar enlace",
    download: "Descargar PNG",
    copied: "¡Copiado!",
    shared: "¡Compartido!",
    help: "Escribí un nombre corto. Las partículas y cintas de luz forman las letras en una aurora fluida. Mové el mouse o tocá para agitar el flujo, doblar las cintas y crear rastros de luz temporales. Ajustá densidad y velocidad, elegí ánimo, compartí o descargá.",
  },
};

function sampleTextTargets(text: string, w: number, h: number): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  off.width = Math.floor(w);
  off.height = Math.floor(h);
  const ctx = off.getContext("2d");
  if (!ctx || !text.trim()) return [];
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${Math.min(h * 0.38, 90)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.trim().slice(0, 18), w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data;
  const targets: { x: number; y: number }[] = [];
  const step = 5;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (data[i] > 120) targets.push({ x, y });
    }
  }
  return targets;
}

export function AuroraNameFlow({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);
  const pointerRef = useRef({ x: -999, y: -999, active: false });
  const paramsRef = useRef({ density: 140, speed: 0.6, text: "", mood: MOODS[0] });
  const [text, setText] = useState("UtiliHub");
  const [density, setDensity] = useState(140);
  const [speed, setSpeed] = useState(0.6);
  const [moodId, setMoodId] = useState<MoodId>("arctic");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const mood = MOODS.find((m) => m.id === moodId) || MOODS[0];

  useEffect(() => {
    paramsRef.current = { density, speed, text, mood };
  }, [density, speed, text, mood]);

  const regenerate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 600;
    const h = rect.height || 380;
    const targets = sampleTextTargets(text, w, h);
    targetsRef.current = targets;
    const n = Math.min(density, Math.max(50, targets.length || 70));
    const particles: Particle[] = [];
    for (let i = 0; i < n; i++) {
      const tgt = targets[i % Math.max(1, targets.length)] || { x: w / 2, y: h / 2 };
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        tx: tgt.x,
        ty: tgt.y,
        size: 1.4 + Math.random() * 1.6,
        trail: [],
        hueShift: Math.random() * 40 - 20,
      });
    }
    particlesRef.current = particles;
  }, [text, density, mood]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg") || "";
    const d = parseInt(params.get("d") || "140", 10);
    const s = parseFloat(params.get("s") || "0.6");
    const m = params.get("mood") as MoodId | null;
    if (msg) setText(msg);
    if (!isNaN(d) && d >= 50 && d <= 250) setDensity(d);
    if (!isNaN(s) && s >= 0.2 && s <= 1.5) setSpeed(s);
    if (m && MOODS.some((x) => x.id === m)) setMoodId(m);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(regenerate, 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, density, moodId, regenerate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    setTimeout(regenerate, 60);

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerup", onLeave);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { speed: spd, mood: md } = paramsRef.current;
      const particles = particlesRef.current;
      const ptr = pointerRef.current;

      ctx.fillStyle = md.bg;
      ctx.fillRect(0, 0, w, h);

      // subtle aurora wash
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "rgba(255,255,255,0.03)");
      g.addColorStop(0.5, "rgba(255,255,255,0.015)");
      g.addColorStop(1, "rgba(255,255,255,0.04)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const form = (0.09 * spd) / (dist * 0.035 + 1);
        p.vx += (dx / dist) * form;
        p.vy += (dy / dist) * form;

        // flow oscillation
        p.vx += Math.sin(p.y * 0.02 + Date.now() * 0.001) * 0.04 * spd;
        p.vy += Math.cos(p.x * 0.015 + Date.now() * 0.0008) * 0.03 * spd;

        if (ptr.active) {
          const pdx = ptr.x - p.x;
          const pdy = ptr.y - p.y;
          const pdist = Math.hypot(pdx, pdy) || 1;
          if (pdist < 180) {
            const force = (0.7 * spd) / (pdist * 0.04 + 1);
            // stir: tangential + radial
            p.vx += (pdx / pdist) * force * 0.6;
            p.vy += (pdy / pdist) * force * 0.6;
            p.vx += (-pdy / pdist) * force * 0.4;
            p.vy += (pdx / pdist) * force * 0.4;
          }
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -0.6;
        if (p.y < 0 || p.y > h) p.vy *= -0.6;

        // trail for ribbons
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();

        // draw ribbon trail
        if (p.trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.strokeStyle = md.ribbon;
          ctx.lineWidth = 1.4;
          ctx.globalAlpha = 0.45;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // particle glow
        ctx.shadowColor = md.glow;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = md.particle;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // temporary light trails from pointer
      if (ptr.active) {
        ctx.strokeStyle = md.glow;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        for (const p of particles) {
          const d = Math.hypot(ptr.x - p.x, ptr.y - p.y);
          if (d < 120) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(ptr.x, ptr.y);
          }
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerup", onLeave);
    };
  }, [regenerate]);

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (text.trim()) params.set("msg", text.trim());
    params.set("d", String(density));
    params.set("s", speed.toFixed(2));
    params.set("mood", moodId);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const getShareText = () => {
    const base = locale === "es"
      ? `Mirá mi flujo de aurora 🌌 ${text.trim() || "UtiliHub"}`
      : `Check my aurora name flow 🌌 ${text.trim() || "UtiliHub"}`;
    return `${base} #UtiliHub #Aurora`;
  };

  const copyLink = async () => {
    const url = buildUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      prompt(locale === "es" ? "Copiá:" : "Copy:", url);
    }
  };

  const shareX = () => {
    const url = buildUrl();
    const txt = getShareText();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}`, "_blank", "noopener");
  };

  const shareWA = () => {
    const url = buildUrl();
    const txt = locale === "es"
      ? `Mirá mi flujo de aurora en UtiliHub: ${url}`
      : `Check my aurora name flow on UtiliHub: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
  };

  const shareNative = async () => {
    const url = buildUrl();
    const txt = getShareText();
    try {
      if (navigator.share) {
        await navigator.share({
          title: locale === "es" ? "Flujo de Nombre Aurora" : "Aurora Name Flow",
          text: txt,
          url,
        });
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      } else {
        copyLink();
      }
    } catch {
      // cancelled
    }
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = mood.bg;
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(canvas, 0, 0);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.font = `${12 * dpr}px system-ui`;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.textAlign = "right";
    ctx.fillText("UtiliHub · Aurora", off.width - 16, off.height - 16);
    const a = document.createElement("a");
    a.download = `aurora-${(text || "flow").slice(0, 16).replace(/\s+/g, "-")}.png`;
    a.href = off.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-50/70 via-white to-teal-50/40 p-4 dark:from-cyan-950/30 dark:via-background dark:to-teal-950/20">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">{t.message}</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.placeholder}
            className="rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none ring-primary/30 focus:ring-2"
            maxLength={18}
            autoComplete="off"
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">{t.help}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.density}
          <input type="range" min={60} max={240} value={density} onChange={(e) => setDensity(+e.target.value)} className="accent-cyan-500" />
          <span className="text-muted-foreground">{density}</span>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.speed}
          <input type="range" min={0.25} max={1.4} step={0.05} value={speed} onChange={(e) => setSpeed(+e.target.value)} className="accent-cyan-500" />
          <span className="text-muted-foreground">{speed.toFixed(2)}</span>
        </label>
        <div className="flex flex-col gap-1 text-xs font-medium">
          {t.mood}
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMoodId(m.id)}
                className={`h-7 w-7 rounded-full border-2 transition ${moodId === m.id ? "border-foreground scale-110" : "border-transparent"}`}
                style={{ background: m.bg, boxShadow: `0 0 0 2px ${m.glow}` }}
                title={m.label[locale]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#041018] shadow-inner">
        <canvas ref={canvasRef} className="h-[min(54vh,440px)] w-full touch-none" style={{ touchAction: "none" }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {canNativeShare && (
          <button type="button" onClick={shareNative} className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">
            {shared ? t.shared : t.shareNative}
          </button>
        )}
        <button type="button" onClick={shareX} className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
          {t.shareX}
        </button>
        <button type="button" onClick={shareWA} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          {t.shareWA}
        </button>
        <button type="button" onClick={copyLink} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
          {copied ? t.copied : t.copy}
        </button>
        <button type="button" onClick={downloadPng} className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">
          {t.download}
        </button>
      </div>
    </div>
  );
}
