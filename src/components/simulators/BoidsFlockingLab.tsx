import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

type Boid = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  trail: { x: number; y: number; a: number }[];
};

const W = 520;
const H = 380;
const MAX_BOIDS = 140;
const TRAIL_MAX = 18;

const PRESETS = [
  { id: "school", en: "School", es: "Cardumen", sep: 1.2, align: 1.4, coh: 1.3, speed: 1.1, perc: 85, wander: 0.3 },
  { id: "scatter", en: "Scatter", es: "Dispersar", sep: 2.0, align: 0.4, coh: 0.3, speed: 1.0, perc: 60, wander: 0.8 },
  { id: "tight", en: "Tight", es: "Compacto", sep: 0.8, align: 1.1, coh: 1.6, speed: 0.8, perc: 45, wander: 0.2 },
  { id: "free", en: "Free", es: "Libre", sep: 1.4, align: 1.0, coh: 1.0, speed: 1.0, perc: 70, wander: 0.5 },
  { id: "swirl", en: "Swirl", es: "Remolino", sep: 0.9, align: 1.6, coh: 0.7, speed: 1.3, perc: 95, wander: 0.4 },
];

function makeBoid(x?: number, y?: number): Boid {
  const ang = Math.random() * Math.PI * 2;
  const sp = 1.2 + Math.random() * 1.4;
  return {
    x: x ?? Math.random() * W,
    y: y ?? Math.random() * H,
    vx: Math.cos(ang) * sp,
    vy: Math.sin(ang) * sp,
    hue: 180 + Math.random() * 80,
    trail: [],
  };
}

export function BoidsFlockingLab({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [running, setRunning] = useState(true);
  const [sep, setSep] = useState(1.4);
  const [align, setAlign] = useState(1.0);
  const [coh, setCoh] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  const [perception, setPerception] = useState(70);
  const [wander, setWander] = useState(0.4);
  const [trails, setTrails] = useState(true);
  const [mouseAttract, setMouseAttract] = useState(true);
  const [colorMode, setColorMode] = useState<"velocity" | "neighbors">("velocity");
  const [boundary, setBoundary] = useState<"wrap" | "bounce">("wrap");
  const [showLinks, setShowLinks] = useState(false);
  const [count, setCount] = useState(90);
  const [clickScatter, setClickScatter] = useState(true);
  const [predator, setPredator] = useState(false);

  const boids = useRef<Boid[]>([]);
  const runningRef = useRef(true);
  const paramsRef = useRef({
    sep: 1.4, align: 1.0, coh: 1.0, speed: 1.0, perc: 70, wander: 0.4, trails: true, mouse: true,
    color: "velocity" as const, boundary: "wrap" as const, links: false, scatter: true, predator: false,
  });
  const mouse = useRef({ x: W / 2, y: H / 2, active: false });
  const scatterBurst = useRef<{ x: number; y: number; until: number } | null>(null);
  const predatorRef = useRef({ x: W / 2, y: H / 2, vx: 0.55, vy: 0.35 });

  if (boids.current.length === 0) {
    const initial = typeof window !== "undefined" && window.innerWidth < 640 ? 60 : 90;
    for (let i = 0; i < initial; i++) boids.current.push(makeBoid());
    setCount(initial);
  }

  runningRef.current = running;
  paramsRef.current = {
    sep, align, coh, speed, perc: perception, wander, trails, mouse: mouseAttract,
    color: colorMode, boundary, links: showLinks, scatter: clickScatter, predator,
  };

  const reset = useCallback(() => {
    boids.current = [];
    for (let i = 0; i < count; i++) boids.current.push(makeBoid());
    setRunning(true);
  }, [count]);

  const addBoids = useCallback((n: number) => {
    const next = Math.min(MAX_BOIDS, boids.current.length + n);
    while (boids.current.length < next) boids.current.push(makeBoid());
    setCount(boids.current.length);
  }, []);

  const applyPreset = useCallback((p: typeof PRESETS[0]) => {
    setSep(p.sep);
    setAlign(p.align);
    setCoh(p.coh);
    setSpeed(p.speed);
    setPerception(p.perc);
    setWander(p.wander);
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const p = paramsRef.current;
      const list = boids.current;
      const n = list.length;

      if (runningRef.current) {
        for (let i = 0; i < n; i++) {
          const b = list[i]!;
          let sepX = 0, sepY = 0, sepC = 0;
          let aliX = 0, aliY = 0, aliC = 0;
          let cohX = 0, cohY = 0, cohC = 0;

          for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const o = list[j]!;
            const dx = o.x - b.x;
            const dy = o.y - b.y;
            const d2 = dx * dx + dy * dy;
            const d = Math.sqrt(d2);
            if (d > 0 && d < p.perc) {
              if (d < p.perc * 0.45) {
                sepX -= dx / d;
                sepY -= dy / d;
                sepC++;
              }
              aliX += o.vx;
              aliY += o.vy;
              aliC++;
              cohX += o.x;
              cohY += o.y;
              cohC++;
            }
          }

          let ax = 0, ay = 0;
          if (sepC) {
            ax += (sepX / sepC) * p.sep * 1.8;
            ay += (sepY / sepC) * p.sep * 1.8;
          }
          if (aliC) {
            ax += (aliX / aliC - b.vx) * p.align * 0.9;
            ay += (aliY / aliC - b.vy) * p.align * 0.9;
          }
          if (cohC) {
            const cx = cohX / cohC - b.x;
            const cy = cohY / cohC - b.y;
            const cl = Math.hypot(cx, cy) || 1;
            ax += (cx / cl) * p.coh * 0.55;
            ay += (cy / cl) * p.coh * 0.55;
          }

          // wander / noise for organic motion
          if (p.wander > 0) {
            const wa = Math.random() * Math.PI * 2;
            const ws = p.wander * 0.35;
            ax += Math.cos(wa) * ws;
            ay += Math.sin(wa) * ws;
          }

          if (p.mouse && mouse.current.active) {
            const mdx = mouse.current.x - b.x;
            const mdy = mouse.current.y - b.y;
            const md = Math.hypot(mdx, mdy);
            if (md > 8 && md < 180) {
              ax += (mdx / md) * 0.9;
              ay += (mdy / md) * 0.9;
            }
          }

          if (p.predator) {
            const pred = predatorRef.current;
            const pdx = b.x - pred.x;
            const pdy = b.y - pred.y;
            const pd = Math.hypot(pdx, pdy);
            if (pd > 0 && pd < 110) {
              const force = (1 - pd / 110) * 4.5;
              ax += (pdx / pd) * force;
              ay += (pdy / pd) * force;
            }
          }

          if (p.scatter && scatterBurst.current && now < scatterBurst.current.until) {
            const sdx = b.x - scatterBurst.current.x;
            const sdy = b.y - scatterBurst.current.y;
            const sd = Math.hypot(sdx, sdy);
            if (sd > 0 && sd < 160) {
              ax += (sdx / sd) * 3.2;
              ay += (sdy / sd) * 3.2;
            }
          }

          b.vx += ax * dt * 60 * 0.08;
          b.vy += ay * dt * 60 * 0.08;

          const sp = Math.hypot(b.vx, b.vy);
          const maxSp = 2.2 + p.speed * 1.6;
          const minSp = 0.6;
          if (sp > maxSp) {
            b.vx = (b.vx / sp) * maxSp;
            b.vy = (b.vy / sp) * maxSp;
          } else if (sp < minSp && sp > 0) {
            b.vx = (b.vx / sp) * minSp;
            b.vy = (b.vy / sp) * minSp;
          }

          b.x += b.vx * dt * 60 * p.speed;
          b.y += b.vy * dt * 60 * p.speed;

          if (p.boundary === "wrap") {
            if (b.x < 0) b.x += W;
            if (b.x > W) b.x -= W;
            if (b.y < 0) b.y += H;
            if (b.y > H) b.y -= H;
          } else {
            if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); }
            if (b.x > W) { b.x = W; b.vx = -Math.abs(b.vx); }
            if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy); }
            if (b.y > H) { b.y = H; b.vy = -Math.abs(b.vy); }
          }

          if (p.color === "velocity") {
            b.hue = 200 + Math.min(80, sp * 18);
          } else {
            b.hue = 160 + Math.min(100, (sepC + aliC + cohC) * 4);
          }

          if (p.trails) {
            b.trail.push({ x: b.x, y: b.y, a: 1 });
            if (b.trail.length > TRAIL_MAX) b.trail.shift();
            for (const t of b.trail) t.a *= 0.94;
          } else {
            b.trail.length = 0;
          }
        }

        // move predator
        if (p.predator) {
          const pred = predatorRef.current;
          pred.x += pred.vx * dt * 60;
          pred.y += pred.vy * dt * 60;
          if (pred.x < 20 || pred.x > W - 20) pred.vx *= -1;
          if (pred.y < 20 || pred.y > H - 20) pred.vy *= -1;
          // mild random turn
          if (Math.random() < 0.02) {
            const turn = (Math.random() - 0.5) * 0.4;
            const sp = Math.hypot(pred.vx, pred.vy);
            const ang = Math.atan2(pred.vy, pred.vx) + turn;
            pred.vx = Math.cos(ang) * sp;
            pred.vy = Math.sin(ang) * sp;
          }
        }
      }

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#071018");
      bg.addColorStop(1, "#03070c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(45,212,191,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      if (p.links) {
        ctx.lineWidth = 0.6;
        for (let i = 0; i < n; i++) {
          const b = list[i]!;
          for (let j = i + 1; j < n; j++) {
            const o = list[j]!;
            const dx = o.x - b.x;
            const dy = o.y - b.y;
            const d = Math.hypot(dx, dy);
            if (d > 0 && d < p.perc * 0.6) {
              ctx.beginPath();
              ctx.strokeStyle = `hsla(${(b.hue + o.hue) / 2}, 70%, 60%, ${0.25 * (1 - d / (p.perc * 0.6))})`;
              ctx.moveTo(b.x, b.y);
              ctx.lineTo(o.x, o.y);
              ctx.stroke();
            }
          }
        }
      }

      for (const b of list) {
        if (b.trail.length > 1) {
          for (let k = 1; k < b.trail.length; k++) {
            const a = b.trail[k]!;
            const prev = b.trail[k - 1]!;
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${b.hue}, 80%, 65%, ${a.a * 0.5})`;
            ctx.lineWidth = 1.6;
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(a.x, a.y);
            ctx.stroke();
          }
        }

        const ang = Math.atan2(b.vy, b.vx);
        const sp = Math.hypot(b.vx, b.vy);
        const size = 5.5 + Math.min(3.5, sp * 1.1);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.fillStyle = `hsl(${b.hue}, 85%, 62%)`;
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.6, size * 0.48);
        ctx.lineTo(-size * 0.45, 0);
        ctx.lineTo(-size * 0.6, -size * 0.48);
        ctx.closePath();
        ctx.fill();
        // highlight
        ctx.beginPath();
        ctx.fillStyle = `hsla(${b.hue}, 90%, 80%, 0.6)`;
        ctx.arc(size * 0.3, -size * 0.08, size * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (mouse.current.active && p.mouse) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(45,212,191,0.35)";
        ctx.lineWidth = 1.5;
        ctx.arc(mouse.current.x, mouse.current.y, 18, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (p.predator) {
        const pred = predatorRef.current;
        const pulse = 0.6 + 0.4 * Math.sin(now / 180);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,70,70,${0.35 * pulse})`;
        ctx.arc(pred.x, pred.y, 14 + 4 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,100,100,${0.8 * pulse})`;
        ctx.lineWidth = 2;
        ctx.arc(pred.x, pred.y, 22, 0, Math.PI * 2);
        ctx.stroke();
        // eyes
        ctx.fillStyle = "rgba(255,220,220,0.9)";
        ctx.beginPath();
        ctx.arc(pred.x - 4, pred.y - 3, 2.2, 0, Math.PI * 2);
        ctx.arc(pred.x + 4, pred.y - 3, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (scatterBurst.current && now < scatterBurst.current.until) {
        const life = (scatterBurst.current.until - now) / 700;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,120,80,${0.45 * life})`;
        ctx.lineWidth = 2;
        ctx.arc(scatterBurst.current.x, scatterBurst.current.y, 28 + (1 - life) * 40, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (!runningRef.current) {
        ctx.fillStyle = "rgba(3,7,12,0.5)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "bold 16px ui-sans-serif,system-ui,sans-serif";
        ctx.fillText(es ? "Pausado" : "Paused", W / 2 - 32, H / 2);
      }

      // count badge
      ctx.fillStyle = "rgba(7,16,24,0.55)";
      ctx.fillRect(8, 8, 72, 22);
      ctx.fillStyle = "rgba(165,243,252,0.9)";
      ctx.font = "11px ui-sans-serif,system-ui,sans-serif";
      ctx.fillText(`${n} boids`, 14, 23);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [es]);

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * W;
    mouse.current.y = ((e.clientY - rect.top) / rect.height) * H;
    mouse.current.active = true;
  };
  const onPointerLeave = () => {
    mouse.current.active = false;
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!paramsRef.current.scatter) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    scatterBurst.current = { x, y, until: performance.now() + 700 };
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
      <div className="w-full rounded-2xl border border-teal-400/25 bg-teal-950/40 p-3 backdrop-blur-sm">
        <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300/85">
          {es ? "Lab de bandada — Boids" : "Flocking lab — Boids"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <SimPrimaryButton theme="lab" onClick={() => setRunning((r) => !r)}>
            {running ? (es ? "Pausa" : "Pause") : es ? "Seguir" : "Resume"}
          </SimPrimaryButton>
          <SimSecondaryButton theme="lab" onClick={reset}>
            {es ? "Reiniciar" : "Reset"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" onClick={() => addBoids(15)}>
            {es ? "+ Boids" : "+ Boids"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" active={trails} onClick={() => setTrails((t) => !t)}>
            {es ? (trails ? "Estelas ✓" : "Estelas") : trails ? "Trails ✓" : "Trails"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" active={mouseAttract} onClick={() => setMouseAttract((m) => !m)}>
            {es ? (mouseAttract ? "Ratón ✓" : "Ratón") : mouseAttract ? "Mouse ✓" : "Mouse"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" active={showLinks} onClick={() => setShowLinks((l) => !l)}>
            {es ? (showLinks ? "Enlaces ✓" : "Enlaces") : showLinks ? "Links ✓" : "Links"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" active={boundary === "bounce"} onClick={() => setBoundary((b) => (b === "wrap" ? "bounce" : "wrap"))}>
            {boundary === "wrap" ? (es ? "Envolver" : "Wrap") : es ? "Rebotar" : "Bounce"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" active={clickScatter} onClick={() => setClickScatter((s) => !s)}>
            {es ? (clickScatter ? "Clic dispersa ✓" : "Clic dispersa") : clickScatter ? "Click scatter ✓" : "Click scatter"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" active={predator} onClick={() => setPredator((pr) => !pr)}>
            {es ? (predator ? "Depredador ✓" : "Depredador") : predator ? "Predator ✓" : "Predator"}
          </SimSecondaryButton>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          {PRESETS.map((pr) => (
            <button
              key={pr.id}
              type="button"
              onClick={() => applyPreset(pr)}
              className="rounded-lg border border-teal-400/30 bg-teal-900/40 px-2 py-0.5 text-[10px] font-semibold text-teal-100/90 hover:bg-teal-800/50"
            >
              {es ? pr.es : pr.en}
            </button>
          ))}
        </div>
      </div>

      <div className="grid w-full max-w-md gap-2 text-xs text-teal-100/85">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Separación" : "Separation"}</span>
            <span className="tabular-nums text-teal-300">{sep.toFixed(2)}</span>
          </span>
          <input type="range" min={0} max={250} value={Math.round(sep * 100)} onChange={(e) => setSep(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Alineación" : "Alignment"}</span>
            <span className="tabular-nums text-teal-300">{align.toFixed(2)}</span>
          </span>
          <input type="range" min={0} max={200} value={Math.round(align * 100)} onChange={(e) => setAlign(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Cohesión" : "Cohesion"}</span>
            <span className="tabular-nums text-teal-300">{coh.toFixed(2)}</span>
          </span>
          <input type="range" min={0} max={200} value={Math.round(coh * 100)} onChange={(e) => setCoh(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Velocidad" : "Speed"}</span>
            <span className="tabular-nums text-teal-300">{speed.toFixed(2)}×</span>
          </span>
          <input type="range" min={30} max={180} value={Math.round(speed * 100)} onChange={(e) => setSpeed(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Radio de percepción" : "Perception radius"}</span>
            <span className="tabular-nums text-teal-300">{perception}px</span>
          </span>
          <input type="range" min={30} max={140} value={perception} onChange={(e) => setPerception(Number(e.target.value))} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Errabundo" : "Wander"}</span>
            <span className="tabular-nums text-teal-300">{wander.toFixed(2)}</span>
          </span>
          <input type="range" min={0} max={100} value={Math.round(wander * 100)} onChange={(e) => setWander(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <div className="flex items-center justify-between">
          <span className="font-semibold">{es ? "Color por" : "Color by"}</span>
          <div className="flex gap-2">
            <SimSecondaryButton theme="lab" active={colorMode === "velocity"} onClick={() => setColorMode("velocity")}>
              {es ? "Velocidad" : "Velocity"}
            </SimSecondaryButton>
            <SimSecondaryButton theme="lab" active={colorMode === "neighbors"} onClick={() => setColorMode("neighbors")}>
              {es ? "Vecinos" : "Neighbors"}
            </SimSecondaryButton>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-[520px]">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          role="img"
          aria-label={es ? "Laboratorio de bandada Boids" : "Boids flocking lab"}
          className="w-full cursor-crosshair touch-none rounded-2xl border border-teal-400/30 bg-[#03070c]"
          style={{ width: "100%", maxWidth: W, height: "auto", aspectRatio: `${W} / ${H}` }}
        />
      </div>

      <p className="text-center text-[11px] text-teal-200/50">
        {es
          ? "Reglas clásicas de Craig Reynolds · canvas ligero · presets · envolver/rebotar · atrae con el ratón · clic para dispersar · errabundo orgánico · depredador opcional."
          : "Classic Craig Reynolds rules · lightweight canvas · presets · wrap/bounce · attract with mouse · click to scatter · organic wander · optional predator."}
      </p>
    </div>
  );
}
