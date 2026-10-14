"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";
type MoodId = "seed" | "aurora" | "neon" | "sunset" | "ocean" | "ember" | "mono";

interface Mood {
  id: MoodId;
  label: { en: string; es: string };
  hue: number;
  spread: number;
  trail: string;
  bg: string;
  swatch: string;
}

const MOODS: Mood[] = [
  {
    id: "seed",
    label: { en: "From text", es: "Del texto" },
    hue: 200,
    spread: 50,
    trail: "rgba(8, 12, 28, 0.22)",
    bg: "#080c1c",
    swatch: "linear-gradient(135deg,#a78bfa,#38bdf8,#f472b6)",
  },
  {
    id: "aurora",
    label: { en: "Aurora", es: "Aurora" },
    hue: 160,
    spread: 45,
    trail: "rgba(4, 18, 22, 0.24)",
    bg: "#041216",
    swatch: "linear-gradient(135deg,#34d399,#22d3ee,#a78bfa)",
  },
  {
    id: "neon",
    label: { en: "Neon", es: "Neón" },
    hue: 300,
    spread: 35,
    trail: "rgba(12, 4, 24, 0.24)",
    bg: "#0c0418",
    swatch: "linear-gradient(135deg,#f0abfc,#e879f9,#22d3ee)",
  },
  {
    id: "sunset",
    label: { en: "Sunset", es: "Atardecer" },
    hue: 22,
    spread: 40,
    trail: "rgba(22, 8, 10, 0.24)",
    bg: "#16080a",
    swatch: "linear-gradient(135deg,#fb923c,#f472b6,#fbbf24)",
  },
  {
    id: "ocean",
    label: { en: "Ocean", es: "Océano" },
    hue: 205,
    spread: 30,
    trail: "rgba(4, 12, 28, 0.24)",
    bg: "#040c1c",
    swatch: "linear-gradient(135deg,#38bdf8,#3b82f6,#6366f1)",
  },
  {
    id: "ember",
    label: { en: "Ember", es: "Brasa" },
    hue: 8,
    spread: 22,
    trail: "rgba(20, 6, 4, 0.24)",
    bg: "#140604",
    swatch: "linear-gradient(135deg,#ef4444,#f97316,#fbbf24)",
  },
  {
    id: "mono",
    label: { en: "Mono", es: "Mono" },
    hue: 0,
    spread: 0,
    trail: "rgba(10, 10, 14, 0.28)",
    bg: "#0a0a0e",
    swatch: "linear-gradient(135deg,#e5e7eb,#9ca3af,#6b7280)",
  },
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
}

const labels = {
  en: {
    text: "Your name or phrase",
    placeholder: "e.g. Alex, UtiliHub…",
    count: "Particles",
    scatter: "Scatter",
    mood: "Color mood",
    generate: "Reform",
    share: "Share signature",
    download: "Download PNG",
    downloading: "Saving…",
    copied: "Link copied!",
    shared: "Shared!",
    help: "Type text — particles fly in and form the letters. Change mood, share the link, or download a PNG.",
    emptyHint: "Type your name to form it with particles",
    tip: "Tip: short names look crisp. Spaces and accents work.",
  },
  es: {
    text: "Tu nombre o frase",
    placeholder: "ej. Sofía, UtiliHub…",
    count: "Partículas",
    scatter: "Dispersión",
    mood: "Estado de color",
    generate: "Reformar",
    share: "Compartir firma",
    download: "Descargar PNG",
    downloading: "Guardando…",
    copied: "¡Enlace copiado!",
    shared: "¡Compartido!",
    help: "Escribí texto — las partículas vuelan y forman las letras. Cambiá el color, compartí el enlace o descargá un PNG.",
    emptyHint: "Escribí tu nombre para formarlo con partículas",
    tip: "Tip: nombres cortos se ven nítidos. Espacios y acentos funcionan.",
  },
};

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function moodById(id: string | null): Mood {
  return MOODS.find((m) => m.id === id) || MOODS[0];
}

/** Sample letter pixels from text drawn on an offscreen canvas */
function sampleTextPoints(
  text: string,
  width: number,
  height: number,
  maxPoints: number,
): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  const scale = 2;
  off.width = Math.max(1, Math.floor(width * scale));
  off.height = Math.max(1, Math.floor(height * scale));
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  const display = (text.trim() || "·").slice(0, 28);
  ctx.clearRect(0, 0, off.width, off.height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Fit font to width
  let fontSize = Math.min(off.height * 0.42, off.width / Math.max(2, display.length * 0.55));
  fontSize = Math.max(28, Math.min(fontSize, 160));
  ctx.font = `800 ${fontSize}px system-ui, "Segoe UI", sans-serif`;

  // Shrink if too wide
  let metrics = ctx.measureText(display);
  while (metrics.width > off.width * 0.9 && fontSize > 20) {
    fontSize -= 2;
    ctx.font = `800 ${fontSize}px system-ui, "Segoe UI", sans-serif`;
    metrics = ctx.measureText(display);
  }

  ctx.fillText(display, off.width / 2, off.height / 2);

  const { data } = ctx.getImageData(0, 0, off.width, off.height);
  const candidates: { x: number; y: number }[] = [];
  const step = Math.max(2, Math.floor(Math.sqrt((off.width * off.height) / (maxPoints * 4))));

  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const a = data[(y * off.width + x) * 4 + 3];
      if (a > 128) {
        candidates.push({ x: x / scale, y: y / scale });
      }
    }
  }

  if (candidates.length === 0) return [];

  // Downsample evenly if too many
  if (candidates.length <= maxPoints) return candidates;
  const out: { x: number; y: number }[] = [];
  const stride = candidates.length / maxPoints;
  for (let i = 0; i < maxPoints; i++) {
    out.push(candidates[Math.floor(i * stride)]);
  }
  return out;
}

export function TextParticlesPlayground({
  locale,
  entryMode = false,
}: {
  locale: Locale;
  entryMode?: boolean;
}) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const moodRef = useRef<Mood>(MOODS[0]);
  const paramsRef = useRef({ count: 900, scatter: 0.35, text: "" });
  const [text, setText] = useState("");
  const [count, setCount] = useState(entryMode ? 1000 : 900);
  const [scatter, setScatter] = useState(0.35);
  const [moodId, setMoodId] = useState<MoodId>("seed");
  const [copied, setCopied] = useState(false);
  const [hasFormed, setHasFormed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    moodRef.current = moodById(moodId);
  }, [moodId]);

  useEffect(() => {
    paramsRef.current = { count, scatter, text };
  }, [count, scatter, text]);

  const baseHue = useCallback((str: string, mood: Mood) => {
    if (mood.id === "seed") return hashString(str || "utilihub") % 360;
    if (mood.id === "mono") return 0;
    return mood.hue;
  }, []);

  const formText = useCallback(
    (str: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 600;
      const h = rect.height || 400;
      const n = paramsRef.current.count;
      const mood = moodRef.current;
      const points = sampleTextPoints(str, w, h, n);
      const hue0 = baseHue(str, mood);
      const spread = mood.spread;

      // Reuse existing particles when possible
      const prev = particlesRef.current;
      const ps: Particle[] = [];
      for (let i = 0; i < n; i++) {
        const target = points.length
          ? points[i % points.length]
          : { x: w / 2 + (Math.random() - 0.5) * 40, y: h / 2 + (Math.random() - 0.5) * 40 };
        const old = prev[i];
        ps.push({
          x: old ? old.x : Math.random() * w,
          y: old ? old.y : Math.random() * h,
          vx: old ? old.vx * 0.3 : (Math.random() - 0.5) * 2,
          vy: old ? old.vy * 0.3 : (Math.random() - 0.5) * 2,
          tx: target.x,
          ty: target.y,
          size: 1.2 + Math.random() * 1.8,
          hue:
            mood.id === "mono"
              ? 0
              : (hue0 + (Math.random() - 0.5) * spread) % 360,
        });
      }
      particlesRef.current = ps;
      if (str.trim()) setHasFormed(true);
    },
    [baseHue],
  );

  const recolor = useCallback(
    (str: string, mood: Mood) => {
      const hue0 = baseHue(str, mood);
      const spread = mood.spread;
      for (const p of particlesRef.current) {
        p.hue =
          mood.id === "mono" ? 0 : (hue0 + (Math.random() - 0.5) * spread) % 360;
      }
    },
    [baseHue],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txt = params.get("sig") || "";
    const c = parseInt(params.get("count") || String(entryMode ? 1000 : 900), 10);
    const s = parseFloat(params.get("sc") || "0.35");
    const m = params.get("mood");
    if (m && MOODS.some((x) => x.id === m)) setMoodId(m as MoodId);
    if (!isNaN(c) && c >= 200 && c <= 2500) setCount(c);
    if (!isNaN(s) && s >= 0 && s <= 1.5) setScatter(s);
    if (txt) {
      setText(txt);
      setHasFormed(true);
      setTimeout(() => formText(txt), 80);
    } else if (entryMode) {
      const demo = locale === "es" ? "Firma" : "Hello";
      setText(demo);
      setTimeout(() => formText(demo), 80);
    }
    if (entryMode && !txt) setTimeout(() => inputRef.current?.focus(), 220);
  }, [entryMode, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const mood = moodById(moodId);
    moodRef.current = mood;
    if (particlesRef.current.length) recolor(paramsRef.current.text || text, mood);
  }, [moodId, recolor, text]);

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
      if (particlesRef.current.length === 0) {
        formText(paramsRef.current.text || (locale === "es" ? "Firma" : "Hello"));
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const mood = moodRef.current;
      const sc = paramsRef.current.scatter;
      const ps = particlesRef.current;

      ctx.fillStyle = mood.trail;
      ctx.fillRect(0, 0, w, h);

      // Spring toward letter targets + light noise
      const k = 0.08;
      const damp = 0.82;
      for (const p of ps) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * k;
        p.vy += dy * k;
        p.vx += (Math.random() - 0.5) * sc * 0.6;
        p.vy += (Math.random() - 0.5) * sc * 0.6;
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx;
        p.y += p.vy;

        if (mood.id === "mono") {
          const light = 62 + Math.min(20, Math.hypot(p.vx, p.vy) * 10);
          ctx.shadowColor = `hsl(0,0%,${light}%)`;
          ctx.shadowBlur = 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(0,0%,${light + 8}%)`;
          ctx.fill();
        } else {
          const speed = Math.hypot(p.vx, p.vy);
          const hue = (p.hue + speed * 8) % 360;
          ctx.shadowColor = `hsl(${hue}, 90%, 60%)`;
          ctx.shadowBlur = 4 + Math.min(6, speed);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${hue}, 85%, 65%)`;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [formText, locale]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      formText(text || (locale === "es" ? "Firma" : "Hello"));
    }, 320);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, count, formText, locale]);

  const buildShareUrl = () => {
    const params = new URLSearchParams();
    if (text.trim()) params.set("sig", text.trim());
    params.set("count", String(count));
    params.set("sc", scatter.toFixed(2));
    if (moodId !== "seed") params.set("mood", moodId);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const share = async () => {
    const url = buildShareUrl();
    const title =
      locale === "es"
        ? `Mi firma visual${text.trim() ? `: ${text.trim()}` : ""}`
        : `My visual signature${text.trim() ? `: ${text.trim()}` : ""}`;
    const shareData = {
      title,
      text:
        locale === "es"
          ? "Mirá mi nombre en partículas en UtiliHub"
          : "See my name in particles on UtiliHub",
      url,
    };
    try {
      if (typeof navigator.share === "function" && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      /* cancel */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt(locale === "es" ? "Copiá este enlace:" : "Copy this link:", url);
    }
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    try {
      const mood = moodRef.current;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const ctx = off.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = mood.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.scale(dpr, dpr);
      for (const p of particlesRef.current) {
        if (mood.id === "mono") {
          ctx.shadowColor = "#fff";
          ctx.shadowBlur = 5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "#e5e7eb";
          ctx.fill();
        } else {
          const hue = p.hue % 360;
          ctx.shadowColor = `hsl(${hue}, 90%, 60%)`;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${hue}, 85%, 65%)`;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.font = `${Math.max(11, Math.round(12 * dpr))}px system-ui, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.textAlign = "right";
      ctx.fillText("UtiliHub · Firma Visual", w - 12 * dpr, h - 12 * dpr);
      const slug = (text.trim() || "firma").slice(0, 24).replace(/\s+/g, "-").toLowerCase();
      const a = document.createElement("a");
      a.download = `firma-visual-${slug}-${moodId}.png`;
      a.href = off.toDataURL("image/png");
      a.click();
    } finally {
      setTimeout(() => setDownloading(false), 400);
    }
  };

  return (
    <div className="space-y-4">
      {entryMode && (
        <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/50 p-4 dark:from-violet-950/40 dark:via-background dark:to-fuchsia-950/20">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-foreground">{t.text}</span>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              className="rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none ring-primary/30 focus:ring-2"
              maxLength={28}
              autoComplete="off"
              enterKeyHint="done"
            />
          </label>
          <p className="mt-2 text-xs text-muted-foreground">{t.tip}</p>
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#080c1c] shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[min(52vh,420px)] w-full touch-none sm:h-[520px]"
          style={{ display: "block" }}
          aria-label={locale === "es" ? "Texto formado por partículas" : "Text formed by particles"}
        />
        {!hasFormed && !text.trim() && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <p className="max-w-xs text-center text-sm font-medium text-white/70">{t.emptyHint}</p>
          </div>
        )}
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/40 p-4">
        {!entryMode && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{t.text}</span>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              className="rounded-lg border border-border bg-background px-3 py-2"
              maxLength={28}
            />
          </label>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">{t.mood}</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const active = moodId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMoodId(m.id)}
                  title={m.label[locale]}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10 shadow-inner"
                    style={{ background: m.swatch }}
                    aria-hidden
                  />
                  {m.label[locale]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">
              {t.count} ({count})
            </span>
            <input
              type="range"
              min={300}
              max={2000}
              step={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="accent-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">
              {t.scatter} ({scatter.toFixed(2)})
            </span>
            <input
              type="range"
              min={0}
              max={1.2}
              step={0.05}
              value={scatter}
              onChange={(e) => setScatter(Number(e.target.value))}
              className="accent-primary"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => formText(text || (locale === "es" ? "Firma" : "Hello"))}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold"
          >
            {t.generate}
          </button>
          <button
            type="button"
            onClick={share}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
          >
            {copied ? t.shared : t.share}
          </button>
          <button
            type="button"
            onClick={downloadPng}
            disabled={downloading}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {downloading ? t.downloading : t.download}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{t.help}</p>
      </div>
    </div>
  );
}
