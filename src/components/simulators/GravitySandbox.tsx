import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  m: number;
  hue: number;
  trail: { x: number; y: number }[];
  trailHead: number;
  trailLen: number;
};
type Preset = "orbit" | "binary" | "cluster";

const W = 480;
const H = 340;
const SOFT = 14;
const TRAIL_MAX = 110;
const MAX_BODIES = 28;
const DT = 1 / 60;

function hueForMass(m: number) {
  return Math.max(18, Math.min(210, 220 - m * 12));
}
function emptyTrail() {
  return {
    trail: Array.from({ length: TRAIL_MAX }, () => ({ x: 0, y: 0 })),
    trailHead: 0,
    trailLen: 0,
  };
}
function withTrail(p: Omit<Body, "trail" | "trailHead" | "trailLen">): Body {
  return { ...p, ...emptyTrail() };
}
function pushTrail(b: Body, x: number, y: number) {
  b.trail[b.trailHead] = { x, y };
  b.trailHead = (b.trailHead + 1) % TRAIL_MAX;
  if (b.trailLen < TRAIL_MAX) b.trailLen++;
}
function clearTrail(b: Body) {
  b.trailHead = 0;
  b.trailLen = 0;
}
function makeOrbit(): Body[] {
  return [
    withTrail({ x: W / 2, y: H / 2, vx: 0, vy: 0, m: 20, hue: 42 }),
    withTrail({ x: W / 2 + 120, y: H / 2, vx: 0, vy: 1.5, m: 2.4, hue: 195 }),
    withTrail({ x: W / 2 - 75, y: H / 2 + 45, vx: 0.32, vy: -1.85, m: 1.5, hue: 160 }),
  ];
}
function makeBinary(): Body[] {
  return [
    withTrail({ x: W / 2 - 60, y: H / 2, vx: 0, vy: -0.88, m: 9, hue: 35 }),
    withTrail({ x: W / 2 + 60, y: H / 2, vx: 0, vy: 0.88, m: 9, hue: 200 }),
    withTrail({ x: W / 2, y: H / 2 - 110, vx: 1.3, vy: 0, m: 1.3, hue: 140 }),
  ];
}
function makeCluster(): Body[] {
  const list: Body[] = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const r = 42 + (i % 4) * 20;
    list.push(
      withTrail({
        x: W / 2 + Math.cos(a) * r,
        y: H / 2 + Math.sin(a) * r * 0.72,
        vx: -Math.sin(a) * 0.52,
        vy: Math.cos(a) * 0.42,
        m: 1.2 + (i % 3) * 0.85,
        hue: 40 + i * 12,
      }),
    );
  }
  return list;
}
function fromPreset(p: Preset) {
  return p === "binary" ? makeBinary() : p === "cluster" ? makeCluster() : makeOrbit();
}
function radiusOf(m: number) {
  return 3.5 + Math.sqrt(m) * 2.6;
}
function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function GravitySandbox({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(true);
  const [gStrength, setGStrength] = useState(0.55);
  const [trails, setTrails] = useState(true);
  const [preset, setPreset] = useState<Preset>("orbit");
  const [count, setCount] = useState(3);
  const [statusMsg, setStatusMsg] = useState("");
  const bodies = useRef<Body[]>(makeOrbit());
  const runningRef = useRef(true);
  const gRef = useRef(0.55);
  const trailsRef = useRef(true);
  const axBuf = useRef(new Float64Array(MAX_BODIES));
  const ayBuf = useRef(new Float64Array(MAX_BODIES));
  const stars = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      x: ((i * 97) % W) + 0.5,
      y: ((i * 53) % H) + 0.5,
      a: 0.08 + (i % 5) * 0.04,
    })),
  );
  runningRef.current = running;
  gRef.current = gStrength;
  trailsRef.current = trails;

  const applyPreset = useCallback((p: Preset) => {
    setPreset(p);
    bodies.current = fromPreset(p);
    setCount(bodies.current.length);
    setStatusMsg("");
  }, []);
  const reset = useCallback(() => {
    bodies.current = fromPreset(preset);
    setCount(bodies.current.length);
    setStatusMsg("");
  }, [preset]);
  const removeLast = useCallback(() => {
    if (bodies.current.length <= 1) {
      setStatusMsg(es ? "Hace falta al menos 1 cuerpo." : "Need at least 1 body.");
      return;
    }
    bodies.current.pop();
    setCount(bodies.current.length);
    setStatusMsg("");
  }, [es]);

  useEffect(() => {
    let raf = 0,
      last = performance.now(),
      acc = 0;
    let ctx: CanvasRenderingContext2D | null = null;
    if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
    const onResize = () => {
      if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
    };
    window.addEventListener("resize", onResize);

    const tick = (now: number) => {
      if (!ctx) {
        if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
        raf = requestAnimationFrame(tick);
        return;
      }
      const dtFrame = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dtFrame;
      const list = bodies.current;
      const G = 0.35 + gRef.current * 1.4;
      const n = list.length;
      const scale = DT * 60;

      if (runningRef.current && n > 0) {
        while (acc >= DT) {
          const ax = axBuf.current,
            ay = ayBuf.current;
          ax.fill(0, 0, n);
          ay.fill(0, 0, n);
          for (let i = 0; i < n; i++)
            for (let j = i + 1; j < n; j++) {
              const a = list[i]!,
                b = list[j]!;
              const dx = b.x - a.x,
                dy = b.y - a.y;
              const d2 = dx * dx + dy * dy + SOFT;
              const inv = 1 / Math.sqrt(d2),
                inv3 = inv * inv * inv;
              const f = G * inv3,
                fx = f * dx,
                fy = f * dy;
              ax[i]! += fx * b.m;
              ay[i]! += fy * b.m;
              ax[j]! -= fx * a.m;
              ay[j]! -= fy * a.m;
            }
          for (let i = 0; i < n; i++) {
            const b = list[i]!;
            b.vx += ax[i]! * scale;
            b.vy += ay[i]! * scale;
            b.vx *= 0.9995;
            b.vy *= 0.9995;
            const sp = Math.hypot(b.vx, b.vy);
            if (sp > 8.5) {
              b.vx = (b.vx / sp) * 8.5;
              b.vy = (b.vy / sp) * 8.5;
            }
            b.x += b.vx * scale;
            b.y += b.vy * scale;
            const r = radiusOf(b.m);
            if (b.x < r) {
              b.x = r;
              b.vx = Math.abs(b.vx) * 0.65;
            } else if (b.x > W - r) {
              b.x = W - r;
              b.vx = -Math.abs(b.vx) * 0.65;
            }
            if (b.y < r) {
              b.y = r;
              b.vy = Math.abs(b.vy) * 0.65;
            } else if (b.y > H - r) {
              b.y = H - r;
              b.vy = -Math.abs(b.vy) * 0.65;
            }
            if (trailsRef.current) pushTrail(b, b.x, b.y);
            else if (b.trailLen) clearTrail(b);
          }
          acc -= DT;
        }
      } else acc = 0;

      // Deep space background
      const bg = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * 0.72);
      bg.addColorStop(0, "#12102a");
      bg.addColorStop(0.55, "#08061a");
      bg.addColorStop(1, "#02010a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      for (const s of stars.current) {
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fillRect(s.x, s.y, 1.3, 1.3);
      }

      // Soft vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.8);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Trails with fade
      for (const b of list) {
        if (b.trailLen < 2) continue;
        const start = (b.trailHead - b.trailLen + TRAIL_MAX) % TRAIL_MAX;
        for (let k = 1; k < b.trailLen; k++) {
          const a = b.trail[(start + k - 1) % TRAIL_MAX]!;
          const c = b.trail[(start + k) % TRAIL_MAX]!;
          const alpha = (k / b.trailLen) * 0.45;
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${b.hue}, 85%, 68%, ${alpha})`;
          ctx.lineWidth = 1.6;
          ctx.lineCap = "round";
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
        }
      }

      // Bodies
      for (const b of list) {
        const r = radiusOf(b.m);
        const glow = ctx.createRadialGradient(b.x, b.y, r * 0.15, b.x, b.y, r + 12);
        glow.addColorStop(0, `hsla(${b.hue}, 90%, 70%, 0.45)`);
        glow.addColorStop(1, `hsla(${b.hue}, 90%, 50%, 0)`);
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(b.x, b.y, r + 12, 0, Math.PI * 2);
        ctx.fill();

        const g = ctx.createRadialGradient(
          b.x - r * 0.35,
          b.y - r * 0.35,
          r * 0.08,
          b.x,
          b.y,
          r + 2,
        );
        g.addColorStop(0, "#fff");
        g.addColorStop(0.3, `hsl(${b.hue}, 92%, 65%)`);
        g.addColorStop(0.75, `hsl(${b.hue}, 85%, 42%)`);
        g.addColorStop(1, `hsla(${b.hue}, 80%, 25%, 0.2)`);
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.arc(b.x - r * 0.28, b.y - r * 0.28, Math.max(1.2, r * 0.26), 0, Math.PI * 2);
        ctx.fill();
      }

      // Frame
      ctx.strokeStyle = "rgba(167,139,250,0.35)";
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, W - 4, H - 4);

      if (!runningRef.current) {
        ctx.fillStyle = "rgba(2,6,23,0.48)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "bold 15px ui-sans-serif,system-ui,sans-serif";
        ctx.fillText(es ? "Pausado" : "Paused", W / 2 - 30, H / 2);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [es]);

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    let hit = -1,
      best = 18;
    for (let i = 0; i < bodies.current.length; i++) {
      const b = bodies.current[i]!;
      const d = Math.hypot(b.x - x, b.y - y);
      const r = radiusOf(b.m) + 6;
      if (d < r && d < best) {
        best = d;
        hit = i;
      }
    }
    if (hit >= 0 && bodies.current.length > 1) {
      bodies.current.splice(hit, 1);
      setCount(bodies.current.length);
      setStatusMsg(es ? "Cuerpo eliminado." : "Body removed.");
      return;
    }
    if (bodies.current.length >= MAX_BODIES) {
      setStatusMsg(
        es
          ? `Límite ${MAX_BODIES}. Tocá un cuerpo para borrarlo o “Quitar último”.`
          : `Limit ${MAX_BODIES}. Tap a body to remove or use “Remove last”.`,
      );
      return;
    }
    const m = 1.2 + Math.random() * 3.5;
    bodies.current.push(
      withTrail({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        m,
        hue: hueForMass(m),
      }),
    );
    setCount(bodies.current.length);
    setStatusMsg("");
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
      <div className="w-full rounded-2xl border border-violet-400/25 bg-violet-950/45 p-3.5 shadow-inner backdrop-blur-sm">
        <p className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300/85">
          {es ? "Observatorio N-cuerpos" : "N-body observatory"}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "orbit" as const, en: "Orbit", es: "Órbita", tip: "🪐" },
              { id: "binary" as const, en: "Binary", es: "Binario", tip: "⭐" },
              { id: "cluster" as const, en: "Cluster", es: "Cúmulo", tip: "✨" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => applyPreset(opt.id)}
              className={
                preset === opt.id
                  ? "flex flex-col items-center gap-0.5 rounded-xl bg-gradient-to-b from-violet-300 to-violet-700 py-2.5 text-xs font-bold text-violet-950 shadow-[0_0_24px_rgba(139,92,246,0.45)] ring-2 ring-violet-100/40"
                  : "flex flex-col items-center gap-0.5 rounded-xl border border-violet-500/25 bg-black/35 py-2.5 text-xs font-semibold text-violet-100/85 hover:border-violet-400/45 hover:bg-violet-900/35"
              }
            >
              <span className="text-base leading-none" aria-hidden>
                {opt.tip}
              </span>
              {es ? opt.es : opt.en}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <SimPrimaryButton theme="cosmos" onClick={() => setRunning((r) => !r)}>
          {running ? (es ? "Pausa" : "Pause") : es ? "Seguir" : "Resume"}
        </SimPrimaryButton>
        <SimSecondaryButton theme="cosmos" onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="cosmos" onClick={removeLast}>
          {es ? "Quitar último" : "Remove last"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="cosmos" active={trails} onClick={() => setTrails((t) => !t)}>
          {es ? (trails ? "Estelas ✓" : "Estelas") : trails ? "Trails ✓" : "Trails"}
        </SimSecondaryButton>
      </div>

      <label className="flex w-full max-w-md flex-col gap-1.5 text-xs text-violet-100/90">
        <span className="flex justify-between font-semibold tracking-wide">
          <span>{es ? "Constante G" : "Constant G"}</span>
          <span className="tabular-nums text-violet-300">{Math.round(gStrength * 100)}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(gStrength * 100)}
          onChange={(e) => setGStrength(Number(e.target.value) / 100)}
          className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-indigo-950 via-violet-600 to-fuchsia-400 accent-violet-300"
        />
      </label>

      <div className="grid w-full max-w-md grid-cols-2 gap-2 text-center text-[11px]">
        <div className="rounded-xl border border-violet-500/25 bg-black/40 px-3 py-2.5">
          <p className="font-bold text-violet-200/70">{es ? "Cuerpos" : "Bodies"}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-violet-100">
            {count}/{MAX_BODIES}
          </p>
        </div>
        <div className="rounded-xl border border-violet-500/25 bg-black/40 px-3 py-2.5">
          <p className="font-bold text-violet-200/70">{es ? "Escenario" : "Scenario"}</p>
          <p className="mt-0.5 text-sm font-bold capitalize text-violet-100">{preset}</p>
        </div>
      </div>

      <p className="max-w-md text-center text-[12px] leading-relaxed text-violet-200/80">
        {es
          ? "Vacío = añadir · sobre un cuerpo = borrar. Ajustá G y mirá cómo cambian las órbitas."
          : "Empty = add · on a body = remove. Tweak G and watch orbits change."}
      </p>
      {statusMsg ? (
        <p className="text-center text-[12px] font-semibold text-fuchsia-300/90" role="status">
          {statusMsg}
        </p>
      ) : null}

      <div className="relative w-full max-w-[480px]">
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-violet-400/40 via-transparent to-fuchsia-500/25 opacity-90"
          aria-hidden
        />
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          role="img"
          aria-label={es ? "Simulador de gravedad" : "Gravity sandbox"}
          className="relative w-full cursor-crosshair touch-none rounded-2xl border border-violet-400/30 bg-[#02010a] shadow-[inset_0_0_55px_rgba(91,33,182,0.25)]"
          style={{ width: "100%", maxWidth: W, height: "auto", aspectRatio: `${W} / ${H}` }}
        />
      </div>

      <p className="text-center text-[11px] text-violet-200/45">
        {es
          ? "Observatorio N-cuerpos · paso fijo 60 Hz · suavizado didáctico."
          : "N-body observatory · fixed 60 Hz step · teaching softening."}
      </p>
    </div>
  );
}
