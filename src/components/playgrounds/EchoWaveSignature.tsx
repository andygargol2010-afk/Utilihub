"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";

interface Ripple {
  x: number;
  y: number;
  age: number;
  strength: number;
}

const labels = {
  en: {
    message: "Your name or phrase",
    placeholder: "Echo Wave",
    layers: "Wave layers",
    amplitude: "Amplitude",
    speed: "Animation speed",
    help: "Type text. Unique multi-layer sine waves from character frequencies and hash. Click or drag to pluck ripples that interfere.",
    download: "Download PNG",
    share: "Share",
    copy: "Copy link",
    copied: "Copied!",
  },
  es: {
    message: "Tu nombre o frase",
    placeholder: "Onda Eco",
    layers: "Capas de onda",
    amplitude: "Amplitud",
    speed: "Velocidad",
    help: "Escribí texto. Ondas sinusoidales multicapa únicas a partir de frecuencias de caracteres y hash. Clic o arrastrá para crear ondas que interfieren.",
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

function hslFromHash(h: number, offset: number = 0): string {
  const hue = (h + offset * 37) % 360;
  return `hsl(${hue}, 75%, 55%)`;
}

function buildFreqs(txt: string): number[] {
  const freqs: number[] = [];
  const len = Math.max(1, txt.length);
  for (let i = 0; i < len; i++) {
    freqs.push(0.5 + (txt.charCodeAt(i % txt.length) % 20) * 0.05);
  }
  return freqs;
}

export function EchoWaveSignature({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const [text, setText] = useState("Echo Wave");
  const [layers, setLayers] = useState(4);
  const [amplitude, setAmplitude] = useState(40);
  const [speed, setSpeed] = useState(1);
  const [copied, setCopied] = useState(false);
  const paramsRef = useRef({ text, layers, amplitude, speed });
  const freqsRef = useRef<number[]>(buildFreqs("Echo Wave"));
  const timeRef = useRef(0);
  const hydrated = useRef(false);
  const urlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from URL params once on mount
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const sp = new URLSearchParams(window.location.search);
    const tParam = sp.get("t");
    const lParam = sp.get("l");
    const aParam = sp.get("a");
    const sParam = sp.get("s");
    if (tParam) setText(tParam.slice(0, 24));
    if (lParam) {
      const n = parseInt(lParam, 10);
      if (!Number.isNaN(n) && n >= 2 && n <= 7) setLayers(n);
    }
    if (aParam) {
      const n = parseInt(aParam, 10);
      if (!Number.isNaN(n) && n >= 15 && n <= 80) setAmplitude(n);
    }
    if (sParam) {
      const n = parseFloat(sParam);
      if (!Number.isNaN(n) && n >= 0.4 && n <= 2.2) setSpeed(n);
    }
  }, []);

  useEffect(() => {
    paramsRef.current = { text, layers, amplitude, speed };
    freqsRef.current = buildFreqs(text || "Echo");
  }, [text, layers, amplitude, speed]);

  // Live-update address bar so the link is always shareable without an extra click
  useEffect(() => {
    if (!hydrated.current) return;
    if (urlTimerRef.current) clearTimeout(urlTimerRef.current);
    urlTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (text.trim()) params.set("t", text.trim().slice(0, 24));
      params.set("l", String(layers));
      params.set("a", String(amplitude));
      params.set("s", speed.toFixed(1));
      const qs = params.toString();
      const next = `${window.location.pathname}?${qs}`;
      if (window.location.search !== `?${qs}`) {
        window.history.replaceState(null, "", next);
      }
    }, 280);
    return () => {
      if (urlTimerRef.current) clearTimeout(urlTimerRef.current);
    };
  }, [text, layers, amplitude, speed]);

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

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripplesRef.current.push({ x, y, age: 0, strength: 1.2 });
      if (ripplesRef.current.length > 12) ripplesRef.current.shift();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.buttons > 0) onPointer(e);
    };

    const draw = () => {
      const { text: txt, layers: L, amplitude: amp, speed: spd } = paramsRef.current;
      const freqs = freqsRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      timeRef.current += 0.016 * spd;
      const tme = timeRef.current;

      // Dark background with subtle radial glow from hash
      const hsh = hashString(txt || "Echo");
      const bgHue = hsh % 360;
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      grad.addColorStop(0, `hsl(${bgHue}, 30%, 8%)`);
      grad.addColorStop(1, "#0a0c14");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ripplesRef.current = ripplesRef.current.filter((r) => r.age < 140);
      for (const r of ripplesRef.current) r.age += 1;

      // Draw expanding ripple rings first (behind waves)
      for (const r of ripplesRef.current) {
        const progress = r.age / 140;
        const radius = progress * 160;
        const alpha = (1 - progress) * 0.45 * r.strength;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${(hsh + r.age * 2) % 360}, 70%, 60%, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Waves with glow + soft fill under primary layer
      for (let layer = 0; layer < L; layer++) {
        const color = hslFromHash(hsh, layer);
        const points: { x: number; y: number }[] = [];

        for (let x = 0; x <= w; x += 2) {
          let y = h / 2;
          for (let f = 0; f < freqs.length; f++) {
            const freq = freqs[f] * (1 + layer * 0.15);
            y += Math.sin(x * freq * 0.02 + tme * (1.2 + layer * 0.3) + f * 0.8) * (amp * 0.6 / (layer + 1));
          }
          for (const r of ripplesRef.current) {
            const dx = x - r.x;
            const dist = Math.abs(dx);
            if (dist < 180) {
              const wave =
                Math.sin(dist * 0.08 - r.age * 0.15) *
                Math.exp(-dist * 0.015) *
                r.strength *
                (1 - r.age / 140);
              y += wave * (amp * 0.4);
            }
          }
          points.push({ x, y });
        }

        // Soft fill under the primary (layer 0) wave for visual depth
        if (layer === 0 && points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.lineTo(points[points.length - 1].x, h);
          ctx.lineTo(points[0].x, h);
          ctx.closePath();
          const fillGrad = ctx.createLinearGradient(0, h / 2 - amp, 0, h);
          fillGrad.addColorStop(0, `hsla(${hsh % 360}, 70%, 50%, 0.18)`);
          fillGrad.addColorStop(1, `hsla(${hsh % 360}, 40%, 20%, 0)`);
          ctx.fillStyle = fillGrad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6 + layer * 0.35;
        ctx.globalAlpha = 0.75 - layer * 0.08;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10 + layer * 2.5;

        for (let i = 0; i < points.length; i++) {
          if (i === 0) ctx.moveTo(points[i].x, points[i].y);
          else ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };
    draw();

    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointermove", onPointerMove);
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
    octx.font = "14px system-ui";
    octx.fillStyle = "rgba(255,255,255,0.4)";
    octx.textAlign = "right";
    octx.fillText("UtiliHub · Echo Wave", off.width - 16, off.height - 16);
    const a = document.createElement("a");
    a.download = `echo-wave-${(text || "sig").slice(0, 12).replace(/\s+/g, "-")}.png`;
    a.href = off.toDataURL("image/png");
    a.click();
  };

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (text.trim()) params.set("t", text.trim().slice(0, 24));
    params.set("l", String(layers));
    params.set("a", String(amplitude));
    params.set("s", speed.toFixed(1));
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [text, layers, amplitude, speed]);

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
          title: locale === "es" ? "Firma de Onda Eco" : "Echo Wave Signature",
          text: text,
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-50/70 via-white to-sky-50/40 p-4 dark:from-cyan-950/30 dark:via-background dark:to-sky-950/20">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">{t.message}</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 24))}
            placeholder={t.placeholder}
            className="rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none ring-primary/30 focus:ring-2"
            maxLength={24}
            autoComplete="off"
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">{t.help}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.layers}
          <input type="range" min={2} max={7} value={layers} onChange={(e) => setLayers(+e.target.value)} className="accent-cyan-500" />
          <span className="text-muted-foreground">{layers}</span>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.amplitude}
          <input type="range" min={15} max={80} value={amplitude} onChange={(e) => setAmplitude(+e.target.value)} className="accent-cyan-500" />
          <span className="text-muted-foreground">{amplitude}</span>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.speed}
          <input type="range" min={0.4} max={2.2} step={0.1} value={speed} onChange={(e) => setSpeed(+e.target.value)} className="accent-cyan-500" />
          <span className="text-muted-foreground">{speed.toFixed(1)}</span>
        </label>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#0a0c14] shadow-inner">
        <canvas ref={canvasRef} className="h-[min(52vh,420px)] w-full touch-none cursor-crosshair" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copyLink} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
          {copied ? t.copied : t.copy}
        </button>
        <button type="button" onClick={nativeShare} className="rounded-xl border border-cyan-500/40 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-800 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-100 dark:hover:bg-cyan-900/50">
          {t.share}
        </button>
        <button type="button" onClick={downloadPng} className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">
          {t.download}
        </button>
      </div>
    </div>
  );
}
