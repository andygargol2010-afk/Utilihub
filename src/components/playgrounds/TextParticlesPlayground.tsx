"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";
import { type Locale } from "./TextParticlesPlayground.part1";
import { labels, type Particle, MOODS, MAX_CHARS, type MoodId, sampleTextTargets } from "./TextParticlesPlayground.part2";

export function TextParticlesPlayground({
  locale = "en",
  entryMode = false,
}: {
  locale?: Locale;
  entryMode?: boolean;
}) {
  const t = labels[locale];
  useEffect(() => {
    trackEvent("playground_open", { id: "text-particles-playground", locale, entryMode });
  }, [locale, entryMode]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);
  const paramsRef = useRef({ density: 220, strength: 1.4, text: "", mood: MOODS[0] });
  const [text, setText] = useState("UtiliHub".slice(0, MAX_CHARS));
  const [density, setDensity] = useState(220);
  const [strength, setStrength] = useState(1.4);
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
    const n = targets.length > 0 ? targets.length : Math.min(density, 120);
    const len = Math.max(1, text.trim().length);
    const sizeBase = len >= 7 ? 0.9 : 1.1;
    const sizeSpread = len >= 7 ? 0.65 : 0.85;
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
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        tx: tgt.x,
        ty: tgt.y,
        size: sizeBase + Math.random() * sizeSpread,
        hue: (baseHue + (Math.random() - 0.5) * 28 + 360) % 360,
        settled: false,
      });
    }
    particlesRef.current = ps;
  }, [text, density, mood]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = (params.get("msg") || "").slice(0, MAX_CHARS);
    const d = parseInt(params.get("d") || "220", 10);
    const s = parseFloat(params.get("s") || "1.4");
    const m = params.get("mood") as MoodId | null;
    if (msg) setText(msg);
    if (!isNaN(d) && d >= 40 && d <= 400) setDensity(d);
    if (!isNaN(s) && s >= 0.3 && s <= 2.5) setStrength(s);
    if (m && MOODS.some((x) => x.id === m)) setMoodId(m);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(regenerate, 160);
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

        if (p.settled || dist < 2.5) {
          p.x = p.tx;
          p.y = p.ty;
          p.vx = 0;
          p.vy = 0;
          p.settled = true;
        } else {
          const seek = Math.min(0.95, (0.28 + dist * 0.0035) * str);
          p.vx += (dx / dist) * seek;
          p.vy += (dy / dist) * seek;
          p.vx *= 0.84;
          p.vy *= 0.84;
          const spd = Math.hypot(p.vx, p.vy);
          const cap = 10 + str * 2.2;
          if (spd > cap) {
            p.vx = (p.vx / spd) * cap;
            p.vy = (p.vy / spd) * cap;
          }
          p.x += p.vx;
          p.y += p.vy;
        }

        const speed = Math.hypot(p.vx, p.vy);
        const hue = (p.hue + speed * 1.5) % 360;
        if (p.settled) {
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.95, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${hue}, 82%, 64%)`;
          ctx.fill();
        } else {
          ctx.shadowColor = `hsl(${hue}, 80%, 55%)`;
          ctx.shadowBlur = 4 + speed * 0.35;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${hue}, 78%, 62%)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
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
        ? `Mirá mi firma visual ✨ ${text.trim() || "UtiliHub"}`
        : `Check my visual signature ✨ ${text.trim() || "UtiliHub"}`;
    return `${base} #UtiliHub #FirmaVisual`;
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
        ? `Mirá mi firma visual en UtiliHub: ${url}`
        : `Check my visual signature on UtiliHub: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
  };

  const shareNative = async () => {
    const url = buildUrl();
    const txt = getShareText();
    try {
      if (navigator.share) {
        await navigator.share({
          title: locale === "es" ? "Firma Visual" : "Visual Signature",
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
    ctx.fillText("UtiliHub · Firma Visual", off.width - 16, off.height - 16);
    const a = document.createElement("a");
    a.download = `firma-${(text || "msg").slice(0, 10).replace(/\s+/g, "-")}.png`;
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
          <input type="range" min={80} max={360} value={density} onChange={(e) => setDensity(+e.target.value)} className="accent-violet-500" />
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
