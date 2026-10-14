"use client";
// Viral Particle Postcard — particles swarm to form typed text (cleaner/faster 2026-10-14)

import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";
type MoodId = "aurora" | "neon" | "sunset" | "ocean" | "ember";

interface Mood {
  id: MoodId;
  label: { en: string; es: string };
  hue: number;
  glow: string;
  bg: string;
  trail: string;
}

const MOODS: Mood[] = [
  { id: "aurora", label: { en: "Aurora", es: "Aurora" }, hue: 160, glow: "rgba(100,255,200,0.8)", bg: "#041216", trail: "rgba(4,18,22,0.22)" },
  { id: "neon", label: { en: "Neon", es: "Neón" }, hue: 300, glow: "rgba(255,80,220,0.8)", bg: "#0c0418", trail: "rgba(12,4,24,0.22)" },
  { id: "sunset", label: { en: "Sunset", es: "Atardecer" }, hue: 20, glow: "rgba(255,140,80,0.8)", bg: "#16080a", trail: "rgba(22,8,10,0.22)" },
  { id: "ocean", label: { en: "Ocean", es: "Océano" }, hue: 205, glow: "rgba(80,160,255,0.8)", bg: "#040c1c", trail: "rgba(4,12,28,0.22)" },
  { id: "ember", label: { en: "Ember", es: "Brasa" }, hue: 8, glow: "rgba(255,90,40,0.8)", bg: "#140604", trail: "rgba(20,6,4,0.22)" },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  size: number;
  hue: number;
  settled: boolean;
}

const MAX_CHARS = 10;

const labels = {
  en: {
    message: "Your message or name",
    placeholder: "Hello…",
    density: "Particle density",
    gravity: "Swarm strength",
    mood: "Mood color",
    shareX: "Share on X",
    shareWA: "WhatsApp",
    shareNative: "Share",
    copy: "Copy link",
    download: "Download PNG",
    copied: "Copied!",
    shared: "Shared!",
    help: "Type up to 10 characters — particles swarm to form the text. Adjust density & strength, pick a mood, then share or download.",
  },
  es: {
    message: "Tu mensaje o nombre",
    placeholder: "Hola…",
    density: "Densidad de partículas",
    gravity: "Fuerza del enjambre",
    mood: "Color de ánimo",
    shareX: "Compartir en X",
    shareWA: "WhatsApp",
    shareNative: "Compartir",
    copy: "Copiar enlace",
    download: "Descargar PNG",
    copied: "¡Copiado!",
    shared: "¡Compartido!",
    help: "Hasta 10 caracteres — las partículas forman el texto. Ajustá densidad y fuerza, elegí ánimo, compartí o descargá.",
  },
};

function sampleTextTargets(
  text: string,
  w: number,
  h: number,
  density: number,
): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  const W = Math.max(1, Math.floor(w));
  const H = Math.max(1, Math.floor(h));
  off.width = W;
  off.height = H;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx || !text.trim()) return [];
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  const label = text.trim().slice(0, MAX_CHARS);
  const len = Math.max(1, label.length);
  const fontSize = Math.min(H * 0.48, Math.max(36, (W * 0.9) / (len * 0.58)));
  ctx.font = `900 ${fontSize}px system-ui, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cx = W / 2;
  const cy = H / 2;
  ctx.fillText(label, cx, cy);
  ctx.fillText(label, cx + 0.7, cy);
  ctx.fillText(label, cx, cy + 0.7);
  const data = ctx.getImageData(0, 0, W, H).data;
  const t = Math.max(0, Math.min(1, (density - 60) / 260));
  const step = Math.max(2, Math.round(4 - t * 2));
  const raw: { x: number; y: number }[] = [];
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const i = (y * W + x) * 4;
      if (data[i] > 40) raw.push({ x, y });
    }
  }
  if (raw.length === 0) return raw;
  const maxPts = Math.min(480, Math.max(100, Math.floor(density * 1.8)));
  if (raw.length <= maxPts) return raw;
  const out: { x: number; y: number }[] = [];
  const stride = raw.length / maxPts;
  for (let i = 0; i < maxPts; i++) {
    out.push(raw[Math.min(raw.length - 1, Math.floor(i * stride))]);
  }
  return out;
}

export function ParticlePostcard({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);
  const paramsRef = useRef({ density: 180, strength: 1.2, text: "", mood: MOODS[0] });
  const [text, setText] = useState("UtiliHub".slice(0, MAX_CHARS));
  const [density, setDensity] = useState(180);
  const [strength, setStrength] = useState(1.2);
  const [moodId, setMoodId] = useState<MoodId>("aurora");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const mood = MOODS.find((m) => m.id === moodId) || MOODS[0];

  useEffect(() => {
    paramsRef.current = { density, strength, text, mood };
  }, [density, strength, text, mood]);

  const regenerate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 600;
    const h = rect.height || 360;
    const targets = sampleTextTargets(text, w, h, density);
    targetsRef.current = targets;
    const n = targets.length > 0 ? targets.length : Math.min(density, 100);
    const ps: Particle[] = [];
    const baseHue = mood.hue;
    for (let i = 0; i < n; i++) {
      const tgt =
        targets.length > 0
          ? targets[i]
          : { x: w / 2 + (Math.random() - 0.5) * 40, y: h / 2 };
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        tx: tgt.x,
        ty: tgt.y,
        size: 1.5 + Math.random() * 1.6,
        hue: (baseHue + (Math.random() - 0.5) * 36 + 360) % 360,
        settled: false,
      });
    }
    particlesRef.current = ps;
  }, [text, density, mood]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = (params.get("msg") || "").slice(0, MAX_CHARS);
    const d = parseInt(params.get("d") || "180", 10);
    const s = parseFloat(params.get("s") || "1.2");
    const m = params.get("mood") as MoodId | null;
    if (msg) setText(msg);
    if (!isNaN(d) && d >= 40 && d <= 400) setDensity(d);
    if (!isNaN(s) && s >= 0.3 && s <= 2.5) setStrength(s);
    if (m && MOODS.some((x) => x.id === m)) setMoodId(m);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(regenerate, 180);
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
    const boot = window.setTimeout(regenerate, 50);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { strength: str, mood: md } = paramsRef.current;
      const ps = particlesRef.current;

      ctx.fillStyle = md.trail;
      ctx.fillRect(0, 0, w, h);

      for (const p of ps) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (p.settled || dist < 3.5) {
          // Snap + soft lock for clean letter edges
          p.x = p.tx + dx * 0.15;
          p.y = p.ty + dy * 0.15;
          p.vx *= 0.55;
          p.vy *= 0.55;
          p.settled = dist < 2.2;
        } else {
          // Stronger seek than before so letters form quickly
          const seek = Math.min(0.85, (0.22 + dist * 0.003) * str);
          p.vx += (dx / dist) * seek;
          p.vy += (dy / dist) * seek;
          p.vx *= 0.86;
          p.vy *= 0.86;
          const spd = Math.hypot(p.vx, p.vy);
          const cap = 9 + str * 2;
          if (spd > cap) {
            p.vx = (p.vx / spd) * cap;
            p.vy = (p.vy / spd) * cap;
          }
          p.x += p.vx;
          p.y += p.vy;
        }

        const speed = Math.hypot(p.vx, p.vy);
        const hue = (p.hue + speed * 2) % 360;
        ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
        ctx.shadowBlur = p.settled ? 8 : 5 + speed * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.settled ? 1.12 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 78%, 62%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(boot);
      window.removeEventListener("resize", resize);
    };
  }, [regenerate]);

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (text.trim()) params.set("msg", text.trim().slice(0, MAX_CHARS));
    params.set("d", String(density));
    params.set("s", strength.toFixed(2));
    params.set("mood", moodId);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const getShareText = () => {
    const base =
      locale === "es"
        ? `Mirá mi postal de partículas ✨ ${text.trim() || "UtiliHub"}`
        : `Check my particle postcard ✨ ${text.trim() || "UtiliHub"}`;
    return `${base} #UtiliHub #ParticlePostcard`;
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
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener",
    );
  };

  const shareWA = () => {
    const url = buildUrl();
    const txt =
      locale === "es"
        ? `Mirá mi postal de partículas en UtiliHub: ${url}`
        : `Check my particle postcard on UtiliHub: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
  };

  const shareNative = async () => {
    const url = buildUrl();
    const txt = getShareText();
    try {
      if (navigator.share) {
        await navigator.share({
          title: locale === "es" ? "Postal de partículas" : "Particle Postcard",
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    off.width = canvas.width;
    off.height = canvas.height;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = mood.bg;
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(canvas, 0, 0);
    ctx.font = `${12 * dpr}px system-ui`;
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textAlign = "right";
    ctx.fillText("UtiliHub · Postcard", off.width - 16, off.height - 16);
    const a = document.createElement("a");
    a.download = `postcard-${(text || "msg").slice(0, 10).replace(/\s+/g, "-")}.png`;
    a.href = off.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-50/70 via-white to-sky-50/40 p-4 dark:from-violet-950/30 dark:via-background dark:to-sky-950/20">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">{t.message}</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder={t.placeholder}
            className="rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none ring-primary/30 focus:ring-2"
            maxLength={MAX_CHARS}
            autoComplete="off"
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">{t.help}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.density}
          <input type="range" min={60} max={320} value={density} onChange={(e) => setDensity(+e.target.value)} className="accent-violet-500" />
          <span className="text-muted-foreground">{density}</span>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.gravity}
          <input type="range" min={0.4} max={2.2} step={0.1} value={strength} onChange={(e) => setStrength(+e.target.value)} className="accent-violet-500" />
          <span className="text-muted-foreground">{strength.toFixed(1)}</span>
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
                style={{ background: m.glow }}
                title={m.label[locale]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#080c1c] shadow-inner">
        <canvas ref={canvasRef} className="h-[min(52vh,420px)] w-full touch-none" />
      </div>

      <div className="flex flex-wrap gap-2">
        {canNativeShare && (
          <button type="button" onClick={shareNative} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">
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
        <button type="button" onClick={downloadPng} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
          {t.download}
        </button>
      </div>
    </div>
  );
}
