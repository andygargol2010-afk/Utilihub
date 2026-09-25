import { useCallback, useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

type Phase = "solid" | "liquid" | "gas";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
  r: number;
};

const W = 480;
const H = 320;
const COUNT = 72;
const R = 5.4;

function phaseLabel(phase: Phase, es: boolean) {
  if (es) return phase === "solid" ? "Sólido" : phase === "liquid" ? "Líquido" : "Gas";
  return phase === "solid" ? "Solid" : phase === "liquid" ? "Liquid" : "Gas";
}

function phaseHint(phase: Phase, es: boolean) {
  if (es) {
    if (phase === "solid") return "Vibran en una red fija — poca energía cinética.";
    if (phase === "liquid") return "Se deslizan y se agrupan — energía media.";
    return "Se mueven libremente y chocan — mucha energía.";
  }
  if (phase === "solid") return "Vibrate in a fixed lattice — low kinetic energy.";
  if (phase === "liquid") return "Slide and cluster — medium energy.";
  return "Move freely and collide — high kinetic energy.";
}

function makeParticles(phase: Phase): Particle[] {
  const list: Particle[] = [];
  const cols = 9;
  const rows = 8;
  const gapX = (W - 56) / (cols - 1);
  const gapY = (H - 56) / (rows - 1);
  let i = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (i >= COUNT) break;
      const hx = 28 + col * gapX;
      const hy = 28 + row * gapY;
      const speed = phase === "solid" ? 0.12 : phase === "liquid" ? 0.9 : 2.6;
      const angle = Math.random() * Math.PI * 2;
      list.push({
        x: hx + (Math.random() - 0.5) * (phase === "solid" ? 1.5 : 12),
        y: hy + (Math.random() - 0.5) * (phase === "solid" ? 1.5 : 12),
        vx: Math.cos(angle) * speed * (0.55 + Math.random() * 0.9),
        vy: Math.sin(angle) * speed * (0.55 + Math.random() * 0.9),
        hx,
        hy,
        r: R * (0.92 + Math.random() * 0.16),
      });
      i++;
    }
  }
  return list;
}

function colorForSpeed(speed: number, phase: Phase): [number, number, number] {
  const t = Math.min(1, speed / (phase === "gas" ? 5.5 : phase === "liquid" ? 2.8 : 1.1));
  if (phase === "solid") return [56 + t * 50, 200 + t * 30, 190];
  if (phase === "liquid") return [30 + t * 70, 170 + t * 40, 210 - t * 50];
  return [251, 140 + (1 - t) * 50, 50 + t * 90];
}

function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function MoleculesSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("solid");
  const [running, setRunning] = useState(true);
  const [temp, setTemp] = useState(0.45);
  const [avgKe, setAvgKe] = useState(0);
  const particles = useRef<Particle[]>(makeParticles("solid"));
  const phaseRef = useRef<Phase>("solid");
  const tempRef = useRef(0.45);
  const runningRef = useRef(true);
  const frame = useRef(0);
  phaseRef.current = phase;
  tempRef.current = temp;
  runningRef.current = running;

  const energyFromTemp = (t: number) => 0.5 + t * 1.15;

  const applyPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
    particles.current = makeParticles(next);
    const scale = energyFromTemp(tempRef.current);
    for (const p of particles.current) {
      p.vx *= scale;
      p.vy *= scale;
    }
  }, []);

  const setThermal = useCallback((next: number) => {
    const prevE = energyFromTemp(tempRef.current);
    const nextE = energyFromTemp(next);
    const ratio = prevE > 0.01 ? nextE / prevE : 1;
    for (const p of particles.current) {
      p.vx *= ratio;
      p.vy *= ratio;
    }
    tempRef.current = next;
    setTemp(next);
  }, []);

  useEffect(() => {
    let raf = 0;
    let ctx: CanvasRenderingContext2D | null = null;
    if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
    const onResize = () => {
      if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
    };
    window.addEventListener("resize", onResize);

    const tick = () => {
      if (!ctx) {
        if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
        raf = requestAnimationFrame(tick);
        return;
      }
      const list = particles.current;
      const ph = phaseRef.current;
      const energy = energyFromTemp(tempRef.current);

      if (runningRef.current) {
        for (let i = 0; i < list.length; i++) {
          const p = list[i]!;
          if (ph === "solid") {
            const k = 0.09 * energy;
            p.vx += (p.hx - p.x) * k;
            p.vy += (p.hy - p.y) * k;
            p.vx *= 0.91;
            p.vy *= 0.91;
            p.vx += (Math.random() - 0.5) * 0.07 * energy;
            p.vy += (Math.random() - 0.5) * 0.07 * energy;
          } else if (ph === "liquid") {
            let cx = 0,
              cy = 0,
              n = 0;
            for (let j = 0; j < list.length; j++) {
              if (j === i) continue;
              const q = list[j]!;
              const dx = q.x - p.x,
                dy = q.y - p.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < 52 * 52 && d2 > 1) {
                const d = Math.sqrt(d2);
                if (d < (p.r + q.r) * 1.4) {
                  p.vx -= (dx / d) * 0.2;
                  p.vy -= (dy / d) * 0.2;
                } else {
                  cx += dx;
                  cy += dy;
                  n++;
                }
              }
            }
            if (n > 0) {
              p.vx += (cx / n) * 0.0015 * energy;
              p.vy += (cy / n) * 0.0015 * energy;
            }
            p.vy += 0.014 * energy;
            p.vx += (Math.random() - 0.5) * 0.045 * energy;
            p.vy += (Math.random() - 0.5) * 0.045 * energy;
            p.vx *= 0.993;
            p.vy *= 0.993;
            const maxS = 1.6 * energy;
            const sp = Math.hypot(p.vx, p.vy);
            if (sp > maxS) {
              p.vx = (p.vx / sp) * maxS;
              p.vy = (p.vy / sp) * maxS;
            }
          } else {
            p.vx += (Math.random() - 0.5) * 0.018;
            p.vy += (Math.random() - 0.5) * 0.018;
            const maxS = 4.5 * energy;
            const sp = Math.hypot(p.vx, p.vy);
            if (sp > maxS) {
              p.vx = (p.vx / sp) * maxS;
              p.vy = (p.vy / sp) * maxS;
            }
          }
          p.x += p.vx;
          p.y += p.vy;
          const m = p.r + 2;
          if (p.x < m) {
            p.x = m;
            p.vx = Math.abs(p.vx) * (ph === "solid" ? 0.25 : 0.96);
          } else if (p.x > W - m) {
            p.x = W - m;
            p.vx = -Math.abs(p.vx) * (ph === "solid" ? 0.25 : 0.96);
          }
          if (p.y < m) {
            p.y = m;
            p.vy = Math.abs(p.vy) * (ph === "solid" ? 0.25 : 0.96);
          } else if (p.y > H - m) {
            p.y = H - m;
            p.vy = -Math.abs(p.vy) * (ph === "solid" ? 0.25 : 0.96);
          }
        }

        if (ph !== "solid") {
          for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
              const a = list[i]!,
                b = list[j]!;
              const dx = b.x - a.x,
                dy = b.y - a.y;
              const dist = Math.hypot(dx, dy) || 1;
              const minD = a.r + b.r;
              if (dist < minD) {
                const nx = dx / dist,
                  ny = dy / dist;
                const overlap = (minD - dist) / 2;
                a.x -= nx * overlap;
                a.y -= ny * overlap;
                b.x += nx * overlap;
                b.y += ny * overlap;
                const vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                if (vn > 0) continue;
                const impulse = vn * (ph === "gas" ? 0.96 : 0.58);
                a.vx -= impulse * nx;
                a.vy -= impulse * ny;
                b.vx += impulse * nx;
                b.vy += impulse * ny;
              }
            }
          }
        }
      }

      // Background — deep lab chamber
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#062428");
      bg.addColorStop(0.5, "#031618");
      bg.addColorStop(1, "#020c0e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = "rgba(45,212,191,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Glass vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Lattice bonds (solid)
      if (ph === "solid") {
        ctx.strokeStyle = "rgba(94,234,212,0.12)";
        ctx.lineWidth = 1;
        for (let i = 0; i < list.length; i++) {
          const a = list[i]!;
          for (let j = i + 1; j < list.length; j++) {
            const b = list[j]!;
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 42) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Particles
      let keSum = 0;
      for (const p of list) {
        const sp = Math.hypot(p.vx, p.vy);
        keSum += sp * sp;
        const [cr, cg, cb] = colorForSpeed(sp, ph);
        // outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, p.r * 0.2, p.x, p.y, p.r + 6);
        glow.addColorStop(0, `rgba(${cr},${cg},${cb},0.35)`);
        glow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(p.x, p.y, p.r + 6, 0, Math.PI * 2);
        ctx.fill();
        // body
        const g = ctx.createRadialGradient(p.x - 1.8, p.y - 1.8, 0.4, p.x, p.y, p.r + 1.5);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(0.3, `rgb(${cr},${cg},${cb})`);
        g.addColorStop(1, `rgba(${Math.floor(cr * 0.4)},${Math.floor(cg * 0.4)},${Math.floor(cb * 0.4)},0.9)`);
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Chamber frame
      ctx.strokeStyle = "rgba(45,212,191,0.45)";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(2, 2, W - 4, H - 4);
      ctx.strokeStyle = "rgba(94,234,212,0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(6, 6, W - 12, H - 12);

      // Instrument badge
      ctx.fillStyle = "rgba(4, 40, 42, 0.92)";
      const bw = es ? 108 : 92;
      ctx.beginPath();
      ctx.roundRect?.(10, 10, bw, 28, 6);
      if (!ctx.roundRect) {
        ctx.rect(10, 10, bw, 28);
      }
      ctx.fill();
      ctx.strokeStyle = "rgba(45,212,191,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#5eead4";
      ctx.font = "bold 12px ui-sans-serif,system-ui,sans-serif";
      ctx.fillText(phaseLabel(ph, es), 18, 29);

      // KE readout
      frame.current++;
      if (frame.current % 8 === 0) {
        setAvgKe(Math.round((keSum / list.length) * 10) / 10);
      }

      if (!runningRef.current) {
        ctx.fillStyle = "rgba(2,12,14,0.5)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "bold 15px ui-sans-serif,system-ui,sans-serif";
        const msg = es ? "Pausado" : "Paused";
        ctx.fillText(msg, W / 2 - 28, H / 2);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [es]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
      <div className="w-full rounded-2xl border border-teal-400/25 bg-teal-950/50 p-3.5 shadow-inner backdrop-blur-sm">
        <p className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300/85">
          {es ? "Cámara de partículas" : "Particle chamber"}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "solid" as const, en: "Solid", es: "Sólido", tip: "❄" },
              { id: "liquid" as const, en: "Liquid", es: "Líquido", tip: "💧" },
              { id: "gas" as const, en: "Gas", es: "Gas", tip: "💨" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => applyPhase(opt.id)}
              className={
                phase === opt.id
                  ? "flex flex-col items-center gap-0.5 rounded-xl bg-gradient-to-b from-teal-300 to-teal-600 py-2.5 text-xs font-bold text-teal-950 shadow-[0_0_24px_rgba(45,212,191,0.4)] ring-2 ring-teal-100/40"
                  : "flex flex-col items-center gap-0.5 rounded-xl border border-teal-500/25 bg-black/35 py-2.5 text-xs font-semibold text-teal-100/85 hover:border-teal-400/45 hover:bg-teal-900/35"
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
        <SimPrimaryButton theme="lab" onClick={() => setRunning((r) => !r)}>
          {running ? (es ? "Pausa" : "Pause") : es ? "Seguir" : "Resume"}
        </SimPrimaryButton>
        <SimSecondaryButton
          theme="lab"
          onClick={() => {
            particles.current = makeParticles(phaseRef.current);
            const scale = energyFromTemp(tempRef.current);
            for (const p of particles.current) {
              p.vx *= scale;
              p.vy *= scale;
            }
          }}
        >
          {es ? "Reiniciar" : "Reset"}
        </SimSecondaryButton>
      </div>

      <label className="flex w-full max-w-md flex-col gap-1.5 text-xs text-teal-100/90">
        <span className="flex justify-between font-semibold tracking-wide">
          <span>{es ? "Energía térmica" : "Thermal energy"}</span>
          <span className="tabular-nums text-teal-300">{Math.round(temp * 100)}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(temp * 100)}
          onChange={(e) => setThermal(Number(e.target.value) / 100)}
          className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-cyan-950 via-teal-500 to-amber-400 accent-teal-300"
        />
      </label>

      <div className="grid w-full max-w-md grid-cols-2 gap-2 text-center text-[11px]">
        <div className="rounded-xl border border-teal-500/25 bg-black/40 px-3 py-2.5">
          <p className="font-bold text-teal-200/70">{es ? "Fase" : "Phase"}</p>
          <p className="mt-0.5 text-sm font-bold text-teal-100">{phaseLabel(phase, es)}</p>
        </div>
        <div className="rounded-xl border border-teal-500/25 bg-black/40 px-3 py-2.5">
          <p className="font-bold text-teal-200/70">{es ? "⟨v²⟩ aprox." : "⟨v²⟩ approx."}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-teal-100">{avgKe.toFixed(1)}</p>
        </div>
      </div>

      <p className="max-w-md text-center text-[12px] leading-relaxed text-teal-200/80">{phaseHint(phase, es)}</p>

      <div className="relative w-full max-w-[480px]">
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-teal-400/40 via-transparent to-cyan-500/25 opacity-90"
          aria-hidden
        />
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={
            es
              ? `Simulación molecular: ${phaseLabel(phase, true)}`
              : `Molecular simulation: ${phaseLabel(phase, false)}`
          }
          className="relative w-full rounded-2xl border border-teal-400/30 bg-[#020c0e] shadow-[inset_0_0_50px_rgba(13,148,136,0.2)]"
          style={{ width: "100%", maxWidth: W, height: "auto", aspectRatio: `${W} / ${H}` }}
        />
      </div>

      <p className="text-center text-[11px] text-teal-200/45">
        {es
          ? "Cámara de partículas · modelo didáctico (no molecular exacto)."
          : "Particle chamber · teaching model (not exact molecular)."}
      </p>
    </div>
  );
}
