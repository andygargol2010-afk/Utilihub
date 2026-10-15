"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";

const labels = {
  en: {
    message: "Your neon text",
    placeholder: "Neon Sign",
    hue: "Neon color (hue)",
    intensity: "Glow intensity",
    flicker: "Flicker amount",
    help: "Type text. It becomes a glowing neon tube sign. Color from hash or slider. Flicker animation. Download PNG or share URL.",
    download: "Download PNG",
    share: "Share",
    copy: "Copy link",
    copied: "Copied!",
  },
  es: {
    message: "Tu texto neón",
    placeholder: "Cartel Neón",
    hue: "Color neón (matiz)",
    intensity: "Intensidad del brillo",
    flicker: "Cantidad de parpadeo",
    help: "Escribí texto. Se convierte en un cartel de neón con tubo brillante. Color por hash o deslizador. Animación de parpadeo. Descargá PNG o compartí URL.",
    download: "Descargar PNG",
    share: "Compartir",
    copy: "Copiar enlace",
    copied: "¡Copiado!",
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

export function NeonSignature({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("Neon Sign");
  const [hue, setHue] = useState(180);
  const [intensity, setIntensity] = useState(60);
  const [flicker, setFlicker] = useState(30);
  const [copied, setCopied] = useState(false);
  const paramsRef = useRef({ text, hue, intensity, flicker });
  const timeRef = useRef(0);
  const hydrated = useRef(false);
  const urlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flickerSeed = useRef(Math.random());

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const sp = new URLSearchParams(window.location.search);
    const tParam = sp.get("t");
    const hParam = sp.get("h");
    const iParam = sp.get("i");
    const fParam = sp.get("f");
    if (tParam) setText(tParam.slice(0, 20));
    if (hParam) {
      const n = parseInt(hParam, 10);
      if (!Number.isNaN(n) && n >= 0 && n <= 360) setHue(n);
    }
    if (iParam) {
      const n = parseInt(iParam, 10);
      if (!Number.isNaN(n) && n >= 20 && n <= 100) setIntensity(n);
    }
    if (fParam) {
      const n = parseInt(fParam, 10);
      if (!Number.isNaN(n) && n >= 0 && n <= 80) setFlicker(n);
    }
  }, []);

  useEffect(() => {
    paramsRef.current = { text, hue, intensity, flicker };
  }, [text, hue, intensity, flicker]);

  useEffect(() => {
    if (!hydrated.current) return;
    if (urlTimerRef.current) clearTimeout(urlTimerRef.current);
    urlTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (text.trim()) params.set("t", text.trim().slice(0, 20));
      params.set("h", String(hue));
      params.set("i", String(intensity));
      params.set("f", String(flicker));
      const qs = params.toString();
      const next = `${window.location.pathname}?${qs}`;
      if (window.location.search !== `?${qs}`) {
        window.history.replaceState(null, "", next);
      }
    }, 280);
    return () => {
      if (urlTimerRef.current) clearTimeout(urlTimerRef.current);
    };
  }, [text, hue, intensity, flicker]);

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

    const draw = () => {
      const { text: txt, hue: h, intensity: intens, flicker: flick } = paramsRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const hgt = canvas.height / dpr;
      timeRef.current += 0.016;
      const tme = timeRef.current;

      // Dark night base
      ctx.fillStyle = "#07090f";
      ctx.fillRect(0, 0, w, hgt);

      const display = (txt || "Neon").slice(0, 20).toUpperCase();
      const baseHue = h;
      const hsh = hashString(txt || "Neon");
      const effectiveHue = (baseHue + (hsh % 40) - 20 + 360) % 360;

      // Flicker multiplier
      let glowMul = 1;
      if (flick > 0) {
        const noise = Math.sin(tme * 12 + flickerSeed.current * 10) * 0.5 + Math.sin(tme * 7.3) * 0.3;
        const flickerChance = flick / 100;
        if (Math.random() < flickerChance * 0.15) {
          glowMul = 0.35 + Math.random() * 0.4;
        } else {
          glowMul = 0.85 + noise * (flick / 200);
        }
      }

      const fontSize = Math.min(72, Math.max(28, w / (display.length * 0.72)));
      ctx.font = `900 ${fontSize}px system-ui, "Arial Black", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      const cx = w / 2;
      const cy = hgt / 2;

      // Ambient wall wash — radial color bloom behind the sign
      const washR = Math.max(w, hgt) * 0.55;
      const wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, washR);
      const washA = 0.22 * (intens / 60) * glowMul;
      wash.addColorStop(0, `hsla(${effectiveHue}, 90%, 45%, ${washA})`);
      wash.addColorStop(0.45, `hsla(${effectiveHue}, 70%, 30%, ${washA * 0.35})`);
      wash.addColorStop(1, "hsla(0, 0%, 0%, 0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, hgt);

      // Wide multi-layer tube glow (outer → inner)
      const glowLayers = [
        { blur: 48, alpha: 0.18, line: 10 },
        { blur: 28, alpha: 0.28, line: 7 },
        { blur: 14, alpha: 0.4, line: 5 },
        { blur: 6, alpha: 0.55, line: 3.5 },
        { blur: 2, alpha: 0.75, line: 2 },
      ];
      for (const layer of glowLayers) {
        const blur = layer.blur * (intens / 60) * glowMul;
        const alpha = layer.alpha * glowMul;
        ctx.shadowColor = `hsla(${effectiveHue}, 100%, 58%, ${alpha})`;
        ctx.shadowBlur = blur;
        ctx.strokeStyle = `hsla(${effectiveHue}, 100%, 68%, ${Math.min(1, alpha + 0.25)})`;
        ctx.lineWidth = layer.line;
        ctx.strokeText(display, cx, cy);
      }

      // Hot white core + colored rim (tube look)
      ctx.shadowBlur = 0;
      ctx.fillStyle = `hsl(${effectiveHue}, 100%, 96%)`;
      ctx.fillText(display, cx, cy);
      ctx.strokeStyle = `hsl(${effectiveHue}, 100%, 78%)`;
      ctx.lineWidth = 1.8;
      ctx.strokeText(display, cx, cy);

      // Soft floor reflection
      ctx.globalAlpha = 0.18 * glowMul;
      ctx.fillStyle = `hsl(${effectiveHue}, 85%, 52%)`;
      ctx.fillText(display, cx, cy + fontSize * 0.58);
      ctx.globalAlpha = 1;

      // Soft vignette for depth
      const vig = ctx.createRadialGradient(cx, cy, Math.min(w, hgt) * 0.25, cx, cy, Math.max(w, hgt) * 0.72);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, hgt);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.drawImage(canvas, 0, 0);
    octx.font = "12px system-ui";
    octx.fillStyle = "rgba(255,255,255,0.35)";
    octx.textAlign = "right";
    octx.fillText("UtiliHub · Neon Sign", off.width - 14, off.height - 14);
    const a = document.createElement("a");
    a.download = `neon-${(text || "sign").slice(0, 10).replace(/\s+/g, "-")}.png`;
    a.href = off.toDataURL("image/png");
    a.click();
  };

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (text.trim()) params.set("t", text.trim().slice(0, 20));
    params.set("h", String(hue));
    params.set("i", String(intensity));
    params.set("f", String(flicker));
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [text, hue, intensity, flicker]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      prompt(locale === "es" ? "Copiá:" : "Copy:", buildUrl());
    }
  };

  const nativeShare = async () => {
    const url = buildUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: locale === "es" ? "Estudio de Firma Neón" : "Neon Signature Studio",
          text: text,
          url,
        });
      } catch {
        // cancelled
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-50/70 via-white to-pink-50/40 p-4 dark:from-fuchsia-950/30 dark:via-background dark:to-pink-950/20">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">{t.message}</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 20))}
            placeholder={t.placeholder}
            className="rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none ring-primary/30 focus:ring-2"
            maxLength={20}
            autoComplete="off"
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">{t.help}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.hue}
          <input type="range" min={0} max={360} value={hue} onChange={(e) => setHue(+e.target.value)} className="accent-fuchsia-500" />
          <span className="text-muted-foreground">{hue}°</span>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.intensity}
          <input type="range" min={20} max={100} value={intensity} onChange={(e) => setIntensity(+e.target.value)} className="accent-fuchsia-500" />
          <span className="text-muted-foreground">{intensity}</span>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.flicker}
          <input type="range" min={0} max={80} value={flicker} onChange={(e) => setFlicker(+e.target.value)} className="accent-fuchsia-500" />
          <span className="text-muted-foreground">{flicker}</span>
        </label>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#07090f] shadow-inner">
        <canvas ref={canvasRef} className="h-[min(52vh,420px)] w-full touch-none" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copyLink} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
          {copied ? t.copied : t.copy}
        </button>
        <button type="button" onClick={nativeShare} className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-50 px-4 py-2.5 text-sm font-semibold text-fuchsia-800 hover:bg-fuchsia-100 dark:bg-fuchsia-950/40 dark:text-fuchsia-100 dark:hover:bg-fuchsia-900/50">
          {t.share}
        </button>
        <button type="button" onClick={downloadPng} className="rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-700">
          {t.download}
        </button>
      </div>
    </div>
  );
}
