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
  const timeRef = useRef(0);

  useEffect(() => {
    paramsRef.current = { text, layers, amplitude, speed };
  }, [text, layers, amplitude, speed]);

  const hash = hashString(text || "Echo");

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
      const { text: txt, layers: L, amplitude: amp, speed: spd } = paramsRef.current;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      timeRef.current += 0.016 * spd;
      const tme = timeRef.current;

      ctx.fillStyle = "#0a0c14";
      ctx.fillRect(0, 0, w, h);

      const hsh = hashString(txt || "Echo");
      const freqs = [];
      for (let i = 0; i < Math.max(1, txt.length); i++) {
        freqs.push(0.5 + (txt.charCodeAt(i % txt.length) % 20) * 0.05);
      }

      ripplesRef.current = ripplesRef.current.filter((r) => r.age < 120);
      ripplesRef.current.forEach((r) => r.age += 1);

      for (let layer = 0; layer < L; layer++) {
        const layerOffset = layer * 0.3;
        const color = hslFromHash(hsh, layer);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5 + layer * 0.4;
        ctx.globalAlpha = 0.7 - layer * 0.1;

        for (let x = 0; x <= w; x += 2) {
          let y = h / 2;
          for (let f = 0; f < freqs.length; f++) {
            const freq = freqs[f] * (1 + layer * 0.15);
            y += Math.sin((x * freq * 0.02) + tme * (1.2 + layer * 0.3) + f * 0.8) * (amp * 0.6 / (layer + 1));
          }
          // Ripple interference
          ripplesRef.current.forEach((r) => {
            const dx = x - r.x;
            const dist = Math.abs(dx);
            if (dist < 180) {
              const wave = Math.sin(dist * 0.08 - r.age * 0.15) * Math.exp(-dist * 0.015) * r.strength * (1 - r.age / 120);
              y += wave * (amp * 0.4);
            }
          });
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripplesRef.current.push({ x, y, age: 0, strength: 1.2 });
      if (ripplesRef.current.length > 12) ripplesRef.current.shift();
    };
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("pointermove", (e) => {
      if (e.buttons > 0) onPointer(e);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointer);
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

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (text.trim()) params.set("t", text.trim().slice(0, 24));
    params.set("l", String(layers));
    params.set("a", String(amplitude));
    params.set("s", speed.toFixed(1));
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      prompt(locale === "es" ? "Copiá:" : "Copy:", buildUrl());
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
        <button type="button" onClick={downloadPng} className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">
          {t.download}
        </button>
      </div>
    </div>
  );
}
