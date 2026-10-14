"use client";
// Constellation Name Map — stars form typed letters as living constellation, mouse/touch gravity wells warp paths + temporary lines (2026-10-14)

import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";
type MoodId = "midnight" | "nebula" | "dawn" | "deep-space";

interface Mood {
  id: MoodId;
  label: { en: string; es: string };
  bg: string;
  star: string;
  line: string;
  glow: string;
}

const MOODS: Mood[] = [
  { id: "midnight", label: { en: "Midnight", es: "Medianoche" }, bg: "#05060f", star: "#e8f0ff", line: "rgba(180,200,255,0.55)", glow: "rgba(120,160,255,0.7)" },
  { id: "nebula", label: { en: "Nebula", es: "Nebulosa" }, bg: "#120818", star: "#f0e6ff", line: "rgba(220,160,255,0.5)", glow: "rgba(180,80,255,0.75)" },
  { id: "dawn", label: { en: "Dawn", es: "Amanecer" }, bg: "#1a1220", star: "#ffe8d0", line: "rgba(255,200,140,0.5)", glow: "rgba(255,160,80,0.7)" },
  { id: "deep-space", label: { en: "Deep Space", es: "Espacio profundo" }, bg: "#02040a", star: "#ffffff", line: "rgba(200,220,255,0.4)", glow: "rgba(100,140,255,0.6)" },
];

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  size: number;
  twinkle: number;
}

const labels = {
  en: {
    message: "Your name or phrase",
    placeholder: "Constellation, UtiliHub…",
    density: "Star density",
    gravity: "Gravity strength",
    mood: "Sky mood",
    shareX: "Share on X",
    shareWA: "WhatsApp",
    shareNative: "Share",
    copy: "Copy link",
    download: "Download PNG",
    copied: "Copied!",
    shared: "Shared!",
    help: "Type a short name. Stars form the letters as a living constellation. Move mouse or touch to create gravity wells that warp star paths and draw temporary constellation lines. Tune density and gravity, pick a sky mood, share or download.",
  },
  es: {
    message: "Tu nombre o frase",
    placeholder: "Constelación, UtiliHub…",
    density: "Densidad de estrellas",
    gravity: "Fuerza de gravedad",
    mood: "Ánimo del cielo",
    shareX: "Compartir en X",
    shareWA: "WhatsApp",
    shareNative: "Compartir",
    copy: "Copiar enlace",
    download: "Descargar PNG",
    copied: "¡Copiado!",
    shared: "¡Compartido!",
    help: "Escribí un nombre corto. Las estrellas forman las letras como una constelación viva. Mové el mouse o tocá para crear pozos de gravedad que deforman las trayectorias y dibujan líneas temporales. Ajustá densidad y gravedad, elegí ánimo, compartí o descargá.",
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

export function ConstellationNameMap({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);
  const pointerRef = useRef({ x: -999, y: -999, active: false });
  const paramsRef = useRef({ density: 160, gravity: 0.45, text: "", mood: MOODS[0] });
  const [text, setText] = useState("UtiliHub");
  const [density, setDensity] = useState(160);
  const [gravity, setGravity] = useState(0.45);
  const [moodId, setMoodId] = useState<MoodId>("midnight");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const mood = MOODS.find((m) => m.id === moodId) || MOODS[0];

  useEffect(() => {
    paramsRef.current = { density, gravity, text, mood };
  }, [density, gravity, text, mood]);

  const regenerate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 600;
    const h = rect.height || 380;
    const targets = sampleTextTargets(text, w, h);
    targetsRef.current = targets;
    const n = Math.min(density, Math.max(60, targets.length || 80));
    const stars: Star[] = [];
    for (let i = 0; i < n; i++) {
      const tgt = targets[i % Math.max(1, targets.length)] || { x: w / 2, y: h / 2 };
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        tx: tgt.x,
        ty: tgt.y,
        size: 1.2 + Math.random() * 1.8,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, [text, density, mood]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg") || "";
    const d = parseInt(params.get("d") || "160", 10);
    const g = parseFloat(params.get("g") || "0.45");
    const m = params.get("mood") as MoodId | null;
    if (msg) setText(msg);
    if (!isNaN(d) && d >= 60 && d <= 280) setDensity(d);
    if (!isNaN(g) && g >= 0.1 && g <= 1.2) setGravity(g);
    if (m && MOODS.some((x) => x.id === m)) setMoodId(m);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(regenerate, 300);
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
    setTimeout(regenerate, 80);

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
      const { gravity: grav, mood: md } = paramsRef.current;
      const stars = starsRef.current;
      const ptr = pointerRef.current;

      ctx.fillStyle = md.bg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      for (let i = 0; i < 40; i++) {
        const sx = (i * 47) % w;
        const sy = (i * 73) % h;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (ptr.active) {
        ctx.strokeStyle = md.line;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (const s of stars) {
          const dx = ptr.x - s.x;
          const dy = ptr.y - s.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(ptr.x, ptr.y);
          }
        }
        ctx.stroke();
      }

      ctx.strokeStyle = md.line;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < Math.min(stars.length, i + 6); j++) {
          const a = stars[i];
          const b = stars[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 48) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.stroke();

      for (const s of stars) {
        const dx = s.tx - s.x;
        const dy = s.ty - s.y;
        const dist = Math.hypot(dx, dy) || 1;
        const form = 0.12 / (dist * 0.04 + 1);
        s.vx += (dx / dist) * form;
        s.vy += (dy / dist) * form;

        if (ptr.active) {
          const pdx = ptr.x - s.x;
          const pdy = ptr.y - s.y;
          const pdist = Math.hypot(pdx, pdy) || 1;
          if (pdist < 200) {
            const force = grav * 0.9 / (pdist * 0.05 + 1);
            s.vx += (pdx / pdist) * force;
            s.vy += (pdy / pdist) * force;
          }
        }

        s.vx *= 0.94;
        s.vy *= 0.94;
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0 || s.x > w) s.vx *= -0.5;
        if (s.y < 0 || s.y > h) s.vy *= -0.5;

        s.twinkle += 0.08;
        const alpha = 0.55 + Math.sin(s.twinkle) * 0.35;
        const r = s.size * (0.85 + Math.sin(s.twinkle) * 0.15);

        ctx.shadowColor = md.glow;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = md.star;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
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
    params.set("g", gravity.toFixed(2));
    params.set("mood", moodId);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const getShareText = () => {
    const base = locale === "es"
      ? `Mirá mi mapa de constelación ✨ ${text.trim() || "UtiliHub"}`
      : `Check my constellation name map ✨ ${text.trim() || "UtiliHub"}`;
    return `${base} #UtiliHub #Constellation`;
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
      ? `Mirá mi mapa de constelación en UtiliHub: ${url}`
      : `Check my constellation name map on UtiliHub: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
  };

  const shareNative = async () => {
    const url = buildUrl();
    const txt = getShareText();
    try {
      if (navigator.share) {
        await navigator.share({
          title: locale === "es" ? "Mapa de Constelación" : "Constellation Name Map",
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
    ctx.fillText("UtiliHub · Constellation", off.width - 16, off.height - 16);
    const a = document.createElement("a");
    a.download = `constellation-${(text || "map").slice(0, 16).replace(/\s+/g, "-")}.png`;
    a.href = off.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/40 p-4 dark:from-indigo-950/30 dark:via-background dark:to-violet-950/20">
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
          <input type="range" min={80} max={260} value={density} onChange={(e) => setDensity(+e.target.value)} className="accent-indigo-500" />
          <span className="text-muted-foreground">{density}</span>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.gravity}
          <input type="range" min={0.15} max={1.0} step={0.05} value={gravity} onChange={(e) => setGravity(+e.target.value)} className="accent-indigo-500" />
          <span className="text-muted-foreground">{gravity.toFixed(2)}</span>
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

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#05060f] shadow-inner">
        <canvas ref={canvasRef} className="h-[min(54vh,440px)] w-full touch-none" style={{ touchAction: "none" }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {canNativeShare && (
          <button type="button" onClick={shareNative} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
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
        <button type="button" onClick={downloadPng} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
          {t.download}
        </button>
      </div>
    </div>
  );
}
