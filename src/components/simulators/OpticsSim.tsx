import { useEffect, useMemo, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

type Device = "convex-lens" | "concave-lens" | "concave-mirror" | "convex-mirror";

const W = 560;
const H = 340;
const AXIS_Y = H / 2 + 8;
const ELEM_X = 300;

function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function uToX(uCm: number) {
  return ELEM_X - uCm * 2.15;
}
function vToX(vCm: number, isMirror: boolean) {
  return isMirror ? ELEM_X - vCm * 2.15 : ELEM_X + vCm * 2.15;
}

function computeImage(device: Device, u: number, fAbs: number) {
  const converging = device === "convex-lens" || device === "concave-mirror";
  const f = converging ? fAbs : -fAbs;
  const isMirror = device.includes("mirror");
  if (Math.abs(u - f) < 0.05) {
    return { v: Infinity as number, m: Infinity as number, real: false, inverted: false, atInfinity: true, f, isMirror };
  }
  const v = 1 / (1 / f - 1 / u);
  const m = -v / u;
  return { v, m, real: v > 0, inverted: m < 0, atInfinity: false, f, isMirror };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function deviceLabel(d: Device, es: boolean) {
  const map: Record<Device, [string, string]> = {
    "convex-lens": ["Convex lens", "Lente convergente"],
    "concave-lens": ["Concave lens", "Lente divergente"],
    "concave-mirror": ["Concave mirror", "Espejo cóncavo"],
    "convex-mirror": ["Convex mirror", "Espejo convexo"],
  };
  return es ? map[d][1] : map[d][0];
}

export function OpticsSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [device, setDevice] = useState<Device>("convex-lens");
  const [u, setU] = useState(40);
  const [fAbs, setFAbs] = useState(20);
  const objH = 32;
  const result = useMemo(() => computeImage(device, u, fAbs), [device, u, fAbs]);
  const tRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    let ctx: CanvasRenderingContext2D | null = null;
    if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
    const onResize = () => {
      if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
    };
    window.addEventListener("resize", onResize);

    const draw = (now: number) => {
      tRef.current = now / 1000;
      if (!ctx) {
        if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
        raf = requestAnimationFrame(draw);
        return;
      }
      const t = tRef.current;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0a1628");
      bg.addColorStop(0.55, "#0c1a2e");
      bg.addColorStop(1, "#081018");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(56,189,248,0.045)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      const vig = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 360);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "rgba(30,41,59,0.95)";
      ctx.fillRect(20, AXIS_Y + 54, W - 40, 12);
      ctx.fillStyle = "rgba(71,85,105,0.55)";
      ctx.fillRect(20, AXIS_Y + 54, W - 40, 3);

      ctx.strokeStyle = "rgba(148,163,184,0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(24, AXIS_Y);
      ctx.lineTo(W - 24, AXIS_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      const isMirror = result.isMirror;
      const f = result.f;
      const objX = uToX(u);
      const f1 = isMirror ? ELEM_X - Math.abs(f) * 2.15 : ELEM_X + Math.abs(f) * 2.15;
      const f2 = isMirror ? ELEM_X + Math.abs(f) * 2.15 : ELEM_X - Math.abs(f) * 2.15;

      const markF = (x: number, label: string) => {
        ctx!.fillStyle = "rgba(251,191,36,0.9)";
        ctx!.beginPath();
        ctx!.arc(x, AXIS_Y, 3.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.font = "10px ui-sans-serif, system-ui";
        ctx!.fillText(label, x - 4, AXIS_Y + 16);
      };
      markF(f1, "F");
      markF(f2, "F'");
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      ctx.arc(ELEM_X, AXIS_Y, 3, 0, Math.PI * 2);
      ctx.fill();

      if (isMirror) {
        const curve = device === "concave-mirror" ? 1 : -1;
        ctx.save();
        ctx.shadowColor = "rgba(125,211,252,0.55)";
        ctx.shadowBlur = 16;
        ctx.strokeStyle = "rgba(186,230,253,0.95)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(ELEM_X, AXIS_Y - 70);
        ctx.quadraticCurveTo(ELEM_X + curve * 28, AXIS_Y, ELEM_X, AXIS_Y + 70);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(148,163,184,0.35)";
        ctx.lineWidth = 1.5;
        for (let i = -3; i <= 3; i++) {
          const yy = AXIS_Y + i * 18;
          ctx.beginPath();
          ctx.moveTo(ELEM_X + curve * 4, yy);
          ctx.lineTo(ELEM_X + curve * 14, yy - 6);
          ctx.stroke();
        }
        ctx.restore();
      } else {
        ctx.save();
        const glass = ctx.createLinearGradient(ELEM_X - 18, 0, ELEM_X + 18, 0);
        glass.addColorStop(0, "rgba(56,189,248,0.05)");
        glass.addColorStop(0.5, "rgba(125,211,252,0.3)");
        glass.addColorStop(1, "rgba(56,189,248,0.05)");
        ctx.fillStyle = glass;
        ctx.shadowColor = "rgba(56,189,248,0.4)";
        ctx.shadowBlur = 20;
        const bulge = device === "convex-lens" ? 16 : -12;
        ctx.beginPath();
        ctx.moveTo(ELEM_X, AXIS_Y - 72);
        ctx.bezierCurveTo(ELEM_X + bulge, AXIS_Y - 40, ELEM_X + bulge, AXIS_Y + 40, ELEM_X, AXIS_Y + 72);
        ctx.bezierCurveTo(ELEM_X - bulge, AXIS_Y + 40, ELEM_X - bulge, AXIS_Y - 40, ELEM_X, AXIS_Y - 72);
        ctx.fill();
        ctx.strokeStyle = "rgba(186,230,253,0.75)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.shadowColor = "rgba(251,191,36,0.6)";
      ctx.shadowBlur = 14;
      ctx.strokeStyle = "#fbbf24";
      ctx.fillStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(objX, AXIS_Y);
      ctx.lineTo(objX, AXIS_Y - objH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(objX, AXIS_Y - objH);
      ctx.lineTo(objX - 6, AXIS_Y - objH + 12);
      ctx.lineTo(objX + 6, AXIS_Y - objH + 12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "rgba(251,191,36,0.9)";
      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillText(es ? "Objeto" : "Object", objX - 16, AXIS_Y - objH - 10);

      if (!result.atInfinity && Number.isFinite(result.v)) {
        const imgX = vToX(result.v, isMirror);
        const imgH = objH * Math.abs(result.m);
        const imgTop = result.inverted ? AXIS_Y + imgH : AXIS_Y - imgH;

        const ray = (x1: number, y1: number, x2: number, y2: number, color: string) => {
          ctx!.save();
          ctx!.shadowColor = color;
          ctx!.shadowBlur = 8;
          ctx!.strokeStyle = color;
          ctx!.lineWidth = 2;
          ctx!.setLineDash([8, 6]);
          ctx!.lineDashOffset = -t * 40;
          ctx!.beginPath();
          ctx!.moveTo(x1, y1);
          ctx!.lineTo(x2, y2);
          ctx!.stroke();
          ctx!.restore();
        };

        ray(objX, AXIS_Y - objH, ELEM_X, AXIS_Y - objH, "rgba(244,114,182,0.85)");
        ray(ELEM_X, AXIS_Y - objH, f1, AXIS_Y, "rgba(244,114,182,0.85)");
        if (result.real && !isMirror) ray(f1, AXIS_Y, imgX, imgTop, "rgba(244,114,182,0.55)");
        ray(objX, AXIS_Y - objH, ELEM_X, AXIS_Y, "rgba(52,211,153,0.8)");
        if (result.real || isMirror) {
          const extX = isMirror ? objX - 40 : imgX;
          ray(ELEM_X, AXIS_Y, extX, isMirror ? AXIS_Y + 8 : imgTop, "rgba(52,211,153,0.55)");
        }

        if (Math.abs(imgH) > 2 && Math.abs(imgX - ELEM_X) < W) {
          ctx.save();
          const col = result.real ? "rgba(167,139,250,0.95)" : "rgba(251,146,60,0.9)";
          ctx.shadowColor = col;
          ctx.shadowBlur = 14;
          ctx.strokeStyle = col;
          ctx.fillStyle = col;
          ctx.lineWidth = 2.5;
          ctx.setLineDash(result.real ? [] : [4, 3]);
          ctx.beginPath();
          ctx.moveTo(imgX, AXIS_Y);
          ctx.lineTo(imgX, imgTop);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath();
          if (result.inverted) {
            ctx.moveTo(imgX, imgTop);
            ctx.lineTo(imgX - 5, imgTop - 10);
            ctx.lineTo(imgX + 5, imgTop - 10);
          } else {
            ctx.moveTo(imgX, imgTop);
            ctx.lineTo(imgX - 5, imgTop + 10);
            ctx.lineTo(imgX + 5, imgTop + 10);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          ctx.fillStyle = col;
          ctx.font = "11px ui-sans-serif, system-ui";
          ctx.fillText(es ? "Imagen" : "Image", imgX - 14, result.inverted ? imgTop + 18 : imgTop - 10);
        }
      }

      ctx.fillStyle = "rgba(15,23,42,0.75)";
      ctx.strokeStyle = "rgba(56,189,248,0.25)";
      ctx.lineWidth = 1;
      roundRect(ctx, 12, 10, 158, 38, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(186,230,253,0.95)";
      ctx.font = "bold 11px ui-sans-serif, system-ui";
      ctx.fillText(deviceLabel(device, es), 22, 26);
      ctx.fillStyle = "rgba(148,163,184,0.85)";
      ctx.font = "10px ui-sans-serif, system-ui";
      const info = result.atInfinity
        ? es
          ? "Imagen en ∞"
          : "Image at ∞"
        : `v=${result.v.toFixed(1)} cm  m=${result.m.toFixed(2)}`;
      ctx.fillText(info, 22, 40);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [device, u, fAbs, result, es, objH]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["convex-lens", es ? "Lente +" : "Convex lens"],
            ["concave-lens", es ? "Lente −" : "Concave lens"],
            ["concave-mirror", es ? "Espejo cóncavo" : "Concave mirror"],
            ["convex-mirror", es ? "Espejo convexo" : "Convex mirror"],
          ] as const
        ).map(([id, label]) => (
          <SimSecondaryButton key={id} theme="lab" active={device === id} onClick={() => setDevice(id)}>
            {label}
          </SimSecondaryButton>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-sky-400/20 bg-black/40 shadow-[0_0_40px_-12px_rgba(56,189,248,0.25)]">
        <canvas ref={canvasRef} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-sky-100/70">
          {es ? "Distancia objeto u (cm)" : "Object distance u (cm)"}: {u}
          <input type="range" min={12} max={90} value={u} onChange={(e) => setU(Number(e.target.value))} className="mt-1 w-full accent-amber-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Distancia focal |f| (cm)" : "Focal length |f| (cm)"}: {fAbs}
          <input type="range" min={8} max={40} value={fAbs} onChange={(e) => setFAbs(Number(e.target.value))} className="mt-1 w-full accent-sky-400" />
        </label>
      </div>
      <p className="text-center text-xs text-white/45">
        {es ? "1/f = 1/v + 1/u · Rayos principales animados" : "1/f = 1/v + 1/u · Animated principal rays"}
      </p>
    </div>
  );
}
