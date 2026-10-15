"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";
type SceneId = "void" | "brick" | "cyber";
type FontId = "block" | "script" | "condensed";

const PRESETS = [
  { id: "cyan", hue: 180, labelEn: "Cyan", labelEs: "Cian" },
  { id: "pink", hue: 320, labelEn: "Hot Pink", labelEs: "Rosa intenso" },
  { id: "lime", hue: 120, labelEn: "Lime", labelEs: "Lima" },
  { id: "orange", hue: 25, labelEn: "Orange", labelEs: "Naranja" },
  { id: "purple", hue: 280, labelEn: "Purple", labelEs: "Púrpura" },
  { id: "red", hue: 350, labelEn: "Red", labelEs: "Rojo" },
];

const SCENES: { id: SceneId; labelEn: string; labelEs: string }[] = [
  { id: "void", labelEn: "Deep void", labelEs: "Vacío profundo" },
  { id: "brick", labelEn: "Brick wall", labelEs: "Pared de ladrillo" },
  { id: "cyber", labelEn: "Cyber grid", labelEs: "Rejilla cyber" },
];

const FONTS: { id: FontId; labelEn: string; labelEs: string }[] = [
  { id: "block", labelEn: "Block", labelEs: "Bloque" },
  { id: "script", labelEn: "Script", labelEs: "Manuscrita" },
  { id: "condensed", labelEn: "Condensed", labelEs: "Condensada" },
];

const labels = {
  en: {
    message: "Your neon text",
    placeholder: "Neon Sign",
    hue: "Neon color (hue)",
    intensity: "Glow intensity",
    flicker: "Flicker amount",
    presets: "Classic neon colors",
    scenes: "Scene background",
    fonts: "Tube font",
    help: "Type text. It becomes a glowing neon tube sign. Color from hash, slider or presets. Pick a scene and font for shareable shots. Flicker + ignite. Download PNG or share URL.",
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
    presets: "Colores neón clásicos",
    scenes: "Fondo de escena",
    fonts: "Fuente del tubo",
    help: "Escribí texto. Se convierte en un cartel de neón con tubo brillante. Color por hash, deslizador o presets. Elegí escena y fuente para capturas. Parpadeo + animación de encendido. Descargá PNG o compartí URL.",
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

function drawBrickWall(ctx: CanvasRenderingContext2D, w: number, hgt: number) {
  ctx.fillStyle = "#1a1210";
  ctx.fillRect(0, 0, w, hgt);
  const bw = 28;
  const bh = 14;
  const mortar = 2;
  for (let row = 0; row * (bh + mortar) < hgt + bh; row++) {
    const offset = (row % 2) * (bw / 2);
    for (let col = -1; col * (bw + mortar) < w + bw; col++) {
      const x = col * (bw + mortar) + offset;
      const y = row * (bh + mortar);
      const shade = 0.12 + ((row * 7 + col * 3) % 5) * 0.03;
      ctx.fillStyle = `rgb(${Math.floor(55 + shade * 40)}, ${Math.floor(32 + shade * 20)}, ${Math.floor(28 + shade * 15)})`;
      ctx.fillRect(x, y, bw, bh);
    }
  }
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, w, hgt);
}

function drawCyberGrid(ctx: CanvasRenderingContext2D, w: number, hgt: number, tme: number) {
  ctx.fillStyle = "#050810";
  ctx.fillRect(0, 0, w, hgt);
  const step = 28;
  const pulse = 0.08 + 0.04 * Math.sin(tme * 0.8);
  ctx.strokeStyle = `rgba(80, 120, 180, ${0.12 + pulse})`;
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, hgt);
    ctx.stroke();
  }
  for (let y = 0; y <= hgt; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  const gy = hgt * 0.72;
  const g = ctx.createLinearGradient(0, gy - 40, 0, gy + 20);
  g.addColorStop(0, "rgba(40, 80, 140, 0)");
  g.addColorStop(0.5, "rgba(60, 120, 200, 0.15)");
  g.addColorStop(1, "rgba(40, 80, 140, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, gy - 40, w, 60);
}

function fontStack(id: FontId, size: number): string {
  if (id === "script") return `italic 700 ${Math.round(size * 1.05)}px "Brush Script MT", "Segoe Script", "Comic Sans MS", cursive`;
  if (id === "condensed") return `900 ${size}px "Arial Narrow", Impact, "Franklin Gothic Condensed", sans-serif`;
  return `900 ${size}px system-ui, "Arial Black", Impact, sans-serif`;
}

export function NeonSignature({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("Neon Sign");
  const [hue, setHue] = useState(180);
  const [intensity, setIntensity] = useState(60);
  const [flicker, setFlicker] = useState(30);
  const [scene, setScene] = useState<SceneId>("void");
  const [font, setFont] = useState<FontId>("block");
  const [copied, setCopied] = useState(false);
  const paramsRef = useRef({ text, hue, intensity, flicker, scene, font });
  const timeRef = useRef(0);
  const hydrated = useRef(false);
  const urlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flickerSeed = useRef(Math.random());
  const igniteStartRef = useRef(0);
  const prevTextRef = useRef(text);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const sp = new URLSearchParams(window.location.search);
    const tParam = sp.get("t");
    const hParam = sp.get("h");
    const iParam = sp.get("i");
    const fParam = sp.get("f");
    const bParam = sp.get("b");
    const fontParam = sp.get("fnt");
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
    if (bParam === "brick" || bParam === "cyber" || bParam === "void") {
      setScene(bParam);
    }
    if (fontParam === "script" || fontParam === "condensed" || fontParam === "block") {
      setFont(fontParam);
    }
  }, []);

  useEffect(() => {
    paramsRef.current = { text, hue, intensity, flicker, scene, font };
    if (text !== prevTextRef.current) {
      igniteStartRef.current = timeRef.current;
      prevTextRef.current = text;
    }
  }, [text, hue, intensity, flicker, scene, font]);

  useEffect(() => {
    if (!hydrated.current) return;
    if (urlTimerRef.current) clearTimeout(urlTimerRef.current);
    urlTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (text.trim()) params.set("t", text.trim().slice(0, 20));
      params.set("h", String(hue));
      params.set("i", String(intensity));
      params.set("f", String(flicker));
      if (scene !== "void") params.set("b", scene);
      if (font !== "block") params.set("fnt", font);
      const qs = params.toString();
      const next = `${window.location.pathname}?${qs}`;
      if (window.location.search !== `?${qs}`) {
        window.history.replaceState(null, "", next);
      }
    }, 280);
    return () => {
      if (urlTimerRef.current) clearTimeout(urlTimerRef.current);
    };
  }, [text, hue, intensity, flicker, scene, font]);

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
      const { text: txt, hue: h, intensity: intens, flicker: flick, scene: sc, font: ft } = paramsRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const hgt = canvas.height / dpr;
      timeRef.current += 0.016;
      const tme = timeRef.current;

      if (sc === "brick") {
        drawBrickWall(ctx, w, hgt);
      } else if (sc === "cyber") {
        drawCyberGrid(ctx, w, hgt, tme);
      } else {
        ctx.fillStyle = "#07090f";
        ctx.fillRect(0, 0, w, hgt);
      }

      const display = (txt || "Neon").slice(0, 20).toUpperCase();
      const baseHue = h;
      const hsh = hashString(txt || "Neon");
      const effectiveHue = (baseHue + (hsh % 40) - 20 + 360) % 360;

      const sinceIgnite = tme - igniteStartRef.current;
      const ignite = Math.min(1, sinceIgnite / 0.7);

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
      glowMul *= ignite;

      const charFactor = ft === "condensed" ? 0.55 : ft === "script" ? 0.82 : 0.72;
      const fontSize = Math.min(72, Math.max(28, w / (display.length * charFactor)));
      ctx.font = fontStack(ft, fontSize);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      const cx = w / 2;
      const cy = hgt / 2;

      const washR = Math.max(w, hgt) * 0.55;
      const wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, washR);
      const washA = 0.22 * (intens / 60) * glowMul;
      wash.addColorStop(0, `hsla(${effectiveHue}, 90%, 45%, ${washA})`);
      wash.addColorStop(0.45, `hsla(${effectiveHue}, 70%, 30%, ${washA * 0.35})`);
      wash.addColorStop(1, "hsla(0, 0%, 0%, 0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, hgt);

      const glowLayers = [
        { blur: 48, alpha: 0.18, line: ft === "script" ? 8 : 10 },
        { blur: 28, alpha: 0.28, line: ft === "script" ? 5.5 : 7 },
        { blur: 14, alpha: 0.4, line: ft === "script" ? 4 : 5 },
        { blur: 6, alpha: 0.55, line: ft === "script" ? 2.8 : 3.5 },
        { blur: 2, alpha: 0.75, line: ft === "script" ? 1.6 : 2 },
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

      ctx.shadowBlur = 0;
      ctx.fillStyle = `hsl(${effectiveHue}, 100%, 96%)`;
      ctx.fillText(display, cx, cy);
      ctx.strokeStyle = `hsl(${effectiveHue}, 100%, 78%)`;
      ctx.lineWidth = ft === "script" ? 1.4 : 1.8;
      ctx.strokeText(display, cx, cy);

      ctx.globalAlpha = 0.18 * glowMul;
      ctx.fillStyle = `hsl(${effectiveHue}, 85%, 52%)`;
      ctx.fillText(display, cx, cy + fontSize * 0.58);
      ctx.globalAlpha = 1;

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
    if (scene !== "void") params.set("b", scene);
    if (font !== "block") params.set("fnt", font);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [text, hue, intensity, flicker, scene, font]);

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

      <div>
        <p className="mb-2 text-xs font-medium">{t.presets}</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setHue(p.hue)}
              className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-semibold hover:border-fuchsia-500/50"
              style={{ boxShadow: `0 0 0 2px hsl(${p.hue} 90% 55% / 0.35)` }}
            >
              {locale === "es" ? p.labelEs : p.labelEn}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium">{t.scenes}</p>
        <div className="flex flex-wrap gap-2">
          {SCENES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScene(s.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                scene === s.id
                  ? "border-fuchsia-500/60 bg-fuchsia-50 text-fuchsia-900 dark:bg-fuchsia-950/50 dark:text-fuchsia-100"
                  : "border-border/60 bg-background hover:border-fuchsia-500/40"
              }`}
            >
              {locale === "es" ? s.labelEs : s.labelEn}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium">{t.fonts}</p>
        <div className="flex flex-wrap gap-2">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFont(f.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                font === f.id
                  ? "border-fuchsia-500/60 bg-fuchsia-50 text-fuchsia-900 dark:bg-fuchsia-950/50 dark:text-fuchsia-100"
                  : "border-border/60 bg-background hover:border-fuchsia-500/40"
              }`}
            >
              {locale === "es" ? f.labelEs : f.labelEn}
            </button>
          ))}
        </div>
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
