import { useEffect, useMemo, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

type Topology = "series" | "parallel";

const W = 520;
const H = 300;

function seriesReq(r1: number, r2: number) {
  return r1 + r2;
}
function parallelReq(r1: number, r2: number) {
  if (r1 <= 0 || r2 <= 0) return Infinity;
  return (r1 * r2) / (r1 + r2);
}

export function DcCircuitSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [topology, setTopology] = useState<Topology>("series");
  const [V, setV] = useState(12);
  const [R1, setR1] = useState(100);
  const [R2, setR2] = useState(220);
  const [led, setLed] = useState(false);
  const anim = useRef(0);

  const math = useMemo(() => {
    const ledDrop = led ? 2 : 0;
    const Veff = Math.max(0, V - ledDrop);
    const Req = topology === "series" ? seriesReq(R1, R2) : parallelReq(R1, R2);
    const I = Req > 0 && Number.isFinite(Req) ? Veff / Req : 0;
    let I1 = I;
    let I2 = I;
    let V1 = 0;
    let V2 = 0;
    if (topology === "series") {
      V1 = I * R1;
      V2 = I * R2;
    } else {
      V1 = Veff;
      V2 = Veff;
      I1 = R1 > 0 ? Veff / R1 : 0;
      I2 = R2 > 0 ? Veff / R2 : 0;
    }
    const P = Veff * (topology === "series" ? I : I1 + I2);
    return { Req, I, I1, I2, V1, V2, P, Veff, ledDrop };
  }, [V, R1, R2, topology, led]);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      anim.current += 0.04 + Math.min(0.12, math.I * 8);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0c1929");
      bg.addColorStop(1, "#061018");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const pad = 48;
      const left = pad;
      const right = W - pad;
      const top = 56;
      const bot = H - 48;
      const midY = (top + bot) / 2;
      const midX = (left + right) / 2;

      const wire = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.strokeStyle = "rgba(148,163,184,0.75)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      wire(left, top, left, bot);
      wire(left, top, midX - 40, top);
      wire(left, bot, midX - 40, bot);

      const by = midY;
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(left - 10, by - 18);
      ctx.lineTo(left + 10, by - 18);
      ctx.stroke();
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(left - 16, by - 6);
      ctx.lineTo(left + 16, by - 6);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(left - 10, by + 6);
      ctx.lineTo(left + 10, by + 6);
      ctx.stroke();
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(left - 16, by + 18);
      ctx.lineTo(left + 16, by + 18);
      ctx.stroke();
      ctx.fillStyle = "#34d399";
      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillText(`${V} V`, left + 22, by + 4);

      if (led) {
        const lx = left + 70;
        ctx.strokeStyle = "rgba(251,191,36,0.9)";
        ctx.fillStyle = "rgba(251,191,36,0.35)";
        ctx.beginPath();
        ctx.moveTo(lx - 10, top - 8);
        ctx.lineTo(lx + 10, top);
        ctx.lineTo(lx - 10, top + 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lx + 12, top - 10);
        ctx.lineTo(lx + 12, top + 10);
        ctx.stroke();
        ctx.fillStyle = "rgba(251,191,36,0.85)";
        ctx.fillText("LED", lx - 8, top - 14);
      }

      const drawResistor = (x: number, y: number, label: string, ohms: number) => {
        const zig = 8;
        ctx.strokeStyle = "rgba(56,189,248,0.9)";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(x - 36, y);
        let px = x - 28;
        ctx.lineTo(px, y);
        for (let i = 0; i < 6; i++) {
          px += 8;
          ctx.lineTo(px, y + (i % 2 === 0 ? -zig : zig));
        }
        ctx.lineTo(x + 36, y);
        ctx.stroke();
        ctx.fillStyle = "rgba(125,211,252,0.95)";
        ctx.font = "11px ui-sans-serif, system-ui";
        ctx.fillText(`${label} ${ohms}Ω`, x - 22, y - 14);
      };

      if (topology === "series") {
        wire(midX - 40, top, right, top);
        wire(right, top, right, bot);
        wire(midX - 40, bot, right, bot);
        drawResistor(midX + 40, top, "R1", R1);
        drawResistor(midX + 40, bot, "R2", R2);
      } else {
        wire(midX - 40, top, midX - 40, bot);
        wire(midX - 40, top, right, top);
        wire(midX - 40, bot, right, bot);
        wire(right, top, right, bot);
        drawResistor(midX + 50, top, "R1", R1);
        drawResistor(midX + 50, bot, "R2", R2);
        wire(midX - 40, midY, right, midY);
      }

      const flow = Math.min(1.2, math.I * 15);
      if (flow > 0.02) {
        const t = anim.current;
        const dots = 10;
        for (let i = 0; i < dots; i++) {
          const p = (t * 0.15 * flow + i / dots) % 1;
          let x: number;
          let y: number;
          if (topology === "series") {
            const perim = (right - left) * 2 + (bot - top) * 2;
            const d = p * perim;
            if (d < right - left) {
              x = left + d;
              y = top;
            } else if (d < right - left + (bot - top)) {
              x = right;
              y = top + (d - (right - left));
            } else if (d < (right - left) * 2 + (bot - top)) {
              x = right - (d - (right - left) - (bot - top));
              y = bot;
            } else {
              x = left;
              y = bot - (d - (right - left) * 2 - (bot - top));
            }
          } else {
            const loop = i % 2 === 0;
            const yLine = loop ? top : bot;
            x = left + ((p * (right - left) * 2) % (right - left));
            y = yLine;
            if (p > 0.5) x = right - ((p - 0.5) * 2 * (right - left));
          }
          ctx.fillStyle = `rgba(52,211,153,${0.35 + 0.45 * Math.sin(i)})`;
          ctx.beginPath();
          ctx.arc(x, y, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = "rgba(148,163,184,0.55)";
      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillText(
        topology === "series"
          ? es
            ? "Serie: misma corriente"
            : "Series: same current"
          : es
            ? "Paralelo: mismo voltaje"
            : "Parallel: same voltage",
        midX - 40,
        H - 16,
      );

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [V, R1, R2, topology, led, math.I, es]);

  const fmt = (n: number, d = 2) =>
    !Number.isFinite(n) ? "—" : Math.abs(n) >= 100 ? n.toFixed(1) : n.toFixed(d);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <SimSecondaryButton theme="lab" active={topology === "series"} onClick={() => setTopology("series")}>
          {es ? "Serie" : "Series"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="lab" active={topology === "parallel"} onClick={() => setTopology("parallel")}>
          {es ? "Paralelo" : "Parallel"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="lab" active={led} onClick={() => setLed((v) => !v)}>
          LED {led ? "ON" : "OFF"}
        </SimSecondaryButton>
      </div>

      <div className="overflow-hidden rounded-2xl border border-sky-400/15 bg-black/30">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-sky-100/70">
          {es ? "Batería V (V)" : "Battery V (V)"}: {V}
          <input
            type="range"
            min={1}
            max={24}
            step={0.5}
            value={V}
            onChange={(e) => setV(Number(e.target.value))}
            className="mt-1 w-full accent-emerald-400"
          />
        </label>
        <label className="text-xs text-sky-100/70">
          R1 (Ω): {R1}
          <input
            type="range"
            min={10}
            max={1000}
            step={10}
            value={R1}
            onChange={(e) => setR1(Number(e.target.value))}
            className="mt-1 w-full accent-sky-400"
          />
        </label>
        <label className="text-xs text-sky-100/70">
          R2 (Ω): {R2}
          <input
            type="range"
            min={10}
            max={1000}
            step={10}
            value={R2}
            onChange={(e) => setR2(Number(e.target.value))}
            className="mt-1 w-full accent-sky-400"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: es ? "Req" : "Req", value: `${fmt(math.Req, 1)} Ω` },
          {
            label: es ? "Corriente" : "Current",
            value:
              topology === "series"
                ? `${fmt(math.I * 1000, 1)} mA`
                : `I1 ${fmt(math.I1 * 1000, 1)} · I2 ${fmt(math.I2 * 1000, 1)} mA`,
          },
          {
            label: es ? "Caídas V" : "Voltage drops",
            value: `V1 ${fmt(math.V1)} · V2 ${fmt(math.V2)} V`,
          },
          { label: es ? "Potencia" : "Power", value: `${fmt(math.P * 1000, 1)} mW` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-black/35 px-2 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-200/55">{s.label}</p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {led && (
        <p className="text-center text-xs text-amber-200/80">
          {es
            ? `LED ~${math.ledDrop} V de caída · V efectiva ${fmt(math.Veff)} V`
            : `LED ~${math.ledDrop} V drop · effective V ${fmt(math.Veff)} V`}
        </p>
      )}

      <p className="text-center text-xs text-white/45">
        {es
          ? "Ley de Ohm: V = I·R · Serie: Req = R1+R2 · Paralelo: 1/Req = 1/R1+1/R2"
          : "Ohm's law: V = I·R · Series: Req = R1+R2 · Parallel: 1/Req = 1/R1+1/R2"}
      </p>

      <div className="flex justify-center">
        <SimPrimaryButton
          theme="lab"
          onClick={() => {
            setTopology("series");
            setV(12);
            setR1(100);
            setR2(220);
            setLed(false);
          }}
        >
          {es ? "Restablecer" : "Reset"}
        </SimPrimaryButton>
      </div>
    </div>
  );
}
