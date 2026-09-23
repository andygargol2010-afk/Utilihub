import { useCallback, useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

type Phase = "solid" | "liquid" | "gas";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Lattice home (solid) */
  hx: number;
  hy: number;
  r: number;
};

const W = 420;
const H = 280;
const COUNT = 64;
const R = 5.2;

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
  const cols = 8;
  const rows = 8;
  const gapX = (W - 48) / (cols - 1);
  const gapY = (H - 48) / (rows - 1);
  let i = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (i >= COUNT) break;
      const hx = 24 + col * gapX;
      const hy = 24 + row * gapY;
      const speed = phase === "solid" ? 0.15 : phase === "liquid" ? 0.85 : 2.4;
      const angle = Math.random() * Math.PI * 2;
      list.push({
        x: hx + (Math.random() - 0.5) * (phase === "solid" ? 2 : 10),
        y: hy + (Math.random() - 0.5) * (phase === "solid" ? 2 : 10),
        vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.8),
        vy: Math.sin(angle) * speed * (0.6 + Math.random() * 0.8),
        hx,
        hy,
        r: R * (0.9 + Math.random() * 0.2),
      });
      i++;
    }
  }
  return list;
}

function colorForSpeed(speed: number, phase: Phase): [number, number, number] {
  const t = Math.min(1, speed / (phase === "gas" ? 5 : phase === "liquid" ? 2.5 : 1.2));
  if (phase === "solid") return [96 + t * 40, 165 + t * 40, 250];
  if (phase === "liquid") return [56 + t * 80, 189 - t * 40, 248 - t * 80];
  return [251, 146 + (1 - t) * 40, 60 + t * 80];
}

export function MoleculesSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("solid");
  const [running, setRunning] = useState(true);
  const [temp, setTemp] = useState(0.45);
  const particles = useRef<Particle[]>(makeParticles("solid"));
  const phaseRef = useRef<Phase>("solid");
  const tempRef = useRef(0.45);
  const runningRef = useRef(true);
  phaseRef.current = phase;
  tempRef.current = temp;
  runningRef.current = running;

  const energyFromTemp = (t: number) => 0.55 + t * 1.1;

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
    const tick = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        const list = particles.current;
        const ph = phaseRef.current;
        const energy = energyFromTemp(tempRef.current);

        if (runningRef.current)
          for (let i = 0; i < list.length; i++) {
            const p = list[i]!;

            if (ph === "solid") {
              const k = 0.08 * energy;
              p.vx += (p.hx - p.x) * k;
              p.vy += (p.hy - p.y) * k;
              p.vx *= 0.92;
              p.vy *= 0.92;
              p.vx += (Math.random() - 0.5) * 0.08 * energy;
              p.vy += (Math.random() - 0.5) * 0.08 * energy;
            } else if (ph === "liquid") {
              let cx = 0;
              let cy = 0;
              let n = 0;
              for (let j = 0; j < list.length; j++) {
                if (j === i) continue;
                const q = list[j]!;
                const dx = q.x - p.x;
                const dy = q.y - p.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 48 * 48 && d2 > 1) {
                  const d = Math.sqrt(d2);
                  if (d < (p.r + q.r) * 1.35) {
                    p.vx -= (dx / d) * 0.18;
                    p.vy -= (dy / d) * 0.18;
                  } else {
                    cx += dx;
                    cy += dy;
                    n++;
                  }
                }
              }
              if (n > 0) {
                p.vx += (cx / n) * 0.0014 * energy;
                p.vy += (cy / n) * 0.0014 * energy;
              }
              p.vy += 0.012 * energy;
              p.vx += (Math.random() - 0.5) * 0.05 * energy;
              p.vy += (Math.random() - 0.5) * 0.05 * energy;
              p.vx *= 0.992;
              p.vy *= 0.992;
              const maxS = 1.5 * energy;
              const sp = Math.hypot(p.vx, p.vy);
              if (sp > maxS) {
                p.vx = (p.vx / sp) * maxS;
                p.vy = (p.vy / sp) * maxS;
              }
            } else {
              p.vx += (Math.random() - 0.5) * 0.02;
              p.vy += (Math.random() - 0.5) * 0.02;
              const maxS = 4.2 * energy;
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
              p.vx = Math.abs(p.vx) * (ph === "solid" ? 0.3 : 0.95);
            } else if (p.x > W - m) {
              p.x = W - m;
              p.vx = -Math.abs(p.vx) * (ph === "solid" ? 0.3 : 0.95);
            }
            if (p.y < m) {
              p.y = m;
              p.vy = Math.abs(p.vy) * (ph === "solid" ? 0.3 : 0.95);
            } else if (p.y > H - m) {
              p.y = H - m;
              p.vy = -Math.abs(p.vy) * (ph === "solid" ? 0.3 : 0.95);
            }
          }

        if (runningRef.current && ph !== "solid") {
          for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
              const a = list[i]!;
              const b = list[j]!;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const dist = Math.hypot(dx, dy) || 1;
              const minD = a.r + b.r;
              if (dist < minD) {
                const nx = dx / dist;
                const ny = dy / dist;
                const overlap = (minD - dist) / 2;
                a.x -= nx * overlap;
                a.y -= ny * overlap;
                b.x += nx * overlap;
                b.y += ny * overlap;
                const dvx = a.vx - b.vx;
                const dvy = a.vy - b.vy;
                const vn = dvx * nx + dvy * ny;
                if (vn > 0) continue;
                const impulse = vn * (ph === "gas" ? 0.95 : 0.55);
                a.vx -= impulse * nx;
                a.vy -= impulse * ny;
                b.vx += impulse * nx;
                b.vy += impulse * ny;
              }
            }
          }
        }

        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, "#0c1222");
        bg.addColorStop(1, "#020617");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = "rgba(56,189,248,0.06)";
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 28) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        for (let y = 0; y < H; y += 28) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }

        ctx.strokeStyle = "rgba(125,211,252,0.35)";
        ctx.lineWidth = 2;
        ctx.strokeRect(1.5, 1.5, W - 3, H - 3);

        for (const p of list) {
          const sp = Math.hypot(p.vx, p.vy);
          const [cr, cg, cb] = colorForSpeed(sp, ph);
          const g = ctx.createRadialGradient(p.x - 1.5, p.y - 1.5, 0.5, p.x, p.y, p.r + 2);
          g.addColorStop(0, `rgba(255,255,255,0.95)`);
          g.addColorStop(0.35, `rgb(${cr},${cg},${cb})`);
          g.addColorStop(1, `rgba(${cr},${cg},${cb},0.15)`);
          ctx.beginPath();
          ctx.fillStyle = g;
          ctx.arc(p.x, p.y, p.r + 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,0.85)`;
          ctx.arc(p.x - 0.8, p.y - 0.8, p.r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "rgba(15,23,42,0.72)";
        ctx.fillRect(10, 10, es ? 92 : 78, 26);
        ctx.fillStyle = "#7dd3fc";
        ctx.font = "bold 12px system-ui,sans-serif";
        ctx.fillText(phaseLabel(ph, es), 18, 28);

        if (!runningRef.current) {
          ctx.fillStyle = "rgba(2,6,23,0.4)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.font = "bold 14px system-ui,sans-serif";
          ctx.fillText(es ? "Pausado" : "Paused", W / 2 - 28, H / 2);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [es]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-sky-100/90">
        <SimSecondaryButton active={phase === "solid"} onClick={() => applyPhase("solid")}>
          {es ? "Sólido" : "Solid"}
        </SimSecondaryButton>
        <SimSecondaryButton active={phase === "liquid"} onClick={() => applyPhase("liquid")}>
          {es ? "Líquido" : "Liquid"}
        </SimSecondaryButton>
        <SimSecondaryButton active={phase === "gas"} onClick={() => applyPhase("gas")}>
          {es ? "Gas" : "Gas"}
        </SimSecondaryButton>
        <SimPrimaryButton onClick={() => setRunning((r) => !r)}>
          {running ? (es ? "Pausa" : "Pause") : es ? "Seguir" : "Resume"}
        </SimPrimaryButton>
        <SimSecondaryButton
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

      <label className="flex w-full max-w-sm flex-col gap-1 text-xs text-sky-100/80">
        <span className="flex justify-between font-semibold">
          <span>{es ? "Energía térmica" : "Thermal energy"}</span>
          <span className="tabular-nums">{Math.round(temp * 100)}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(temp * 100)}
          onChange={(e) => setThermal(Number(e.target.value) / 100)}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-sky-400"
        />
      </label>

      <p className="text-center text-[12px] text-sky-200/70">{phaseHint(phase, es)}</p>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        role="img"
        aria-label={
          es
            ? `Simulación de movimiento molecular en estado ${phaseLabel(phase, true)}`
            : `Molecular motion simulation in ${phaseLabel(phase, false)} state`
        }
        className="w-full rounded-xl border border-white/10 bg-slate-950"
        style={{ maxWidth: W, height: "auto" }}
      />

      <p className="text-center text-[11px] text-white/45">
        {es
          ? "Modelo didáctico simplificado — no es una simulación molecular exacta."
          : "Simplified teaching model — not an exact molecular simulation."}
      </p>
    </div>
  );
}
