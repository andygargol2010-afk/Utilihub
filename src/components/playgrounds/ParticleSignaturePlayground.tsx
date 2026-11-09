"use client";
// Particle Signature Playground — export restored (max 10 chars)
import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";
const MAX_CHARS = 10;

export function ParticleSignaturePlayground({ locale }: { locale: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("UtiliHub".slice(0, MAX_CHARS));
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; tx: number; ty: number; size: number }[]>([]);

  const regenerate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 600, h = rect.height || 360;
    const off = document.createElement("canvas");
    off.width = Math.floor(w); off.height = Math.floor(h);
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.fillStyle = "#000"; octx.fillRect(0, 0, w, h);
    octx.fillStyle = "#fff";
    octx.font = `900 ${Math.min(h * 0.42, 90)}px system-ui, sans-serif`;
    octx.textAlign = "center"; octx.textBaseline = "middle";
    octx.fillText(text.trim().slice(0, MAX_CHARS), w / 2, h / 2);
    const data = octx.getImageData(0, 0, w, h).data;
    const targets: { x: number; y: number }[] = [];
    for (let y = 0; y < h; y += 4) {
      for (let x = 0; x < w; x += 4) {
        if (data[(y * w + x) * 4] > 100) targets.push({ x, y });
      }
    }
    particlesRef.current = targets.map((t) => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: 0, vy: 0, tx: t.x, ty: t.y, size: 1.2 + Math.random() * 1.2,
    }));
  }, [text]);

  useEffect(() => {
    regenerate();
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
    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      ctx.fillStyle = "rgba(8,8,16,0.3)";
      ctx.fillRect(0, 0, w, h);
      for (const p of particlesRef.current) {
        const dx = p.tx - p.x, dy = p.ty - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 2.5) { p.x = p.tx; p.y = p.ty; p.vx = 0; p.vy = 0; }
        else {
          p.vx += (dx / dist) * 0.4;
          p.vy += (dy / dist) * 0.4;
          p.vx *= 0.86; p.vy *= 0.86;
          p.x += p.vx; p.y += p.vy;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "hsl(280,75%,65%)";
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [regenerate]);

  return (
    <div className="space-y-4">
      <input type="text" value={text} maxLength={MAX_CHARS} onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base" placeholder={locale === "es" ? "Tu firma" : "Your signature"} />
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-[#080810]">
        <canvas ref={canvasRef} className="h-[min(52vh,420px)] w-full" />
      </div>
    </div>
  );
}
