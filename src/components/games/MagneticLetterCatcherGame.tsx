import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Mode = "arcade" | "zen" | "challenge";
type Particle = {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  caught: boolean;
  targetX: number;
  targetY: number;
  order: number;
};

interface Props {
  locale?: GameLocale;
}

export function MagneticLetterCatcherGame({ locale = "en" }: Props) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState(es ? "Utili" : "Utili");
  const [mode, setMode] = useState<Mode>("arcade");
  const [speed, setSpeed] = useState(1.2);
  const [count, setCount] = useState(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [caught, setCaught] = useState(0);
  const [running, setRunning] = useState(false);
  const mouse = useRef({ x: 200, y: 180 });
  const particles = useRef<Particle[]>([]);
  const nextNeeded = useRef(0);
  const anim = useRef<number>(0);

  const reset = useCallback(() => {
    const letters = (name.trim() || "A").toUpperCase().slice(0, 10).split("");
    const pts: Particle[] = [];
    letters.forEach((ch, i) => {
      for (let c = 0; c < count; c++) {
        pts.push({
          char: ch,
          x: 40 + Math.random() * 320,
          y: 40 + Math.random() * 240,
          vx: (Math.random() - 0.5) * speed * 2,
          vy: (Math.random() - 0.5) * speed * 2,
          caught: false,
          targetX: 60 + i * 36,
          targetY: 280,
          order: i,
        });
      }
    });
    particles.current = pts;
    nextNeeded.current = 0;
    setScore(0);
    setCombo(0);
    setCaught(0);
  }, [name, speed, count]);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      if (!running) {
        anim.current = requestAnimationFrame(loop);
        return;
      }
      ctx.fillStyle = "rgba(8, 12, 28, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mx = mouse.current.x;
      const my = mouse.current.y;

      particles.current.forEach((p) => {
        if (p.caught) {
          p.x += (p.targetX - p.x) * 0.12;
          p.y += (p.targetY - p.y) * 0.12;
        } else {
          // magnetic attract if next in sequence
          const dist = Math.hypot(mx - p.x, my - p.y);
          if (p.order === nextNeeded.current && dist < 140) {
            const pull = (mode === "zen" ? 0.08 : 0.15) * (1 - dist / 140);
            p.vx += (mx - p.x) * pull * 0.02;
            p.vy += (my - p.y) * pull * 0.02;
            if (dist < 22) {
              p.caught = true;
              setCaught((c) => c + 1);
              setCombo((cm) => cm + 1);
              setScore((s) => s + 100 * (combo + 1));
              nextNeeded.current += 1;
            }
          }
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.985;
          p.vy *= 0.985;
          if (p.x < 10 || p.x > canvas.width - 10) p.vx *= -1;
          if (p.y < 10 || p.y > canvas.height - 10) p.vy *= -1;
        }

        ctx.beginPath();
        ctx.fillStyle = p.caught ? "#34d399" : p.order === nextNeeded.current ? "#67e8f9" : "#94a3b8";
        ctx.arc(p.x, p.y, p.caught ? 14 : 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 14px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, p.x, p.y);
      });

      // attractor
      ctx.beginPath();
      ctx.strokeStyle = "rgba(52, 211, 153, 0.6)";
      ctx.lineWidth = 2;
      ctx.arc(mx, my, 18, 0, Math.PI * 2);
      ctx.stroke();

      if (nextNeeded.current >= (name.trim() || "A").length) {
        setRunning(false);
        setScore((s) => s + 500);
      }

      anim.current = requestAnimationFrame(loop);
    };
    anim.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim.current);
  }, [running, mode, combo, name]);

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current = {
      x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width,
      y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height,
    };
  };

  const sharePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `magnetic-${name || "name"}.png`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 10))}
          className="rounded-lg border bg-slate-900/60 px-3 py-1.5 text-sm text-white"
          placeholder={es ? "Tu nombre" : "Your name"}
          maxLength={10}
        />
        <GameSecondaryButton active={mode === "arcade"} onClick={() => setMode("arcade")}>Arcade</GameSecondaryButton>
        <GameSecondaryButton active={mode === "zen"} onClick={() => setMode("zen")}>Zen</GameSecondaryButton>
        <GameSecondaryButton active={mode === "challenge"} onClick={() => setMode("challenge")}>Challenge</GameSecondaryButton>
        <label className="text-xs text-slate-300">
          {es ? "Vel." : "Speed"}
          <input type="range" min={0.4} max={2.5} step={0.1} value={speed} onChange={(e) => setSpeed(+e.target.value)} className="ml-1 w-20" />
        </label>
        <label className="text-xs text-slate-300">
          {es ? "Copias" : "Copies"}
          <input type="range" min={1} max={3} value={count} onChange={(e) => setCount(+e.target.value)} className="ml-1 w-16" />
        </label>
        <GamePrimaryButton onClick={() => { reset(); setRunning(true); }}>
          {running ? (es ? "Reiniciar" : "Restart") : (es ? "Jugar" : "Play")}
        </GamePrimaryButton>
        <GameSecondaryButton onClick={sharePng}>{es ? "PNG" : "PNG"}</GameSecondaryButton>
      </div>
      <div className="flex gap-4 text-sm font-semibold text-emerald-300">
        <span>{es ? "Puntaje" : "Score"}: {score}</span>
        <span>Combo: x{combo}</span>
        <span>{es ? "Atrapadas" : "Caught"}: {caught}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={480}
        height={340}
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        className="w-full max-w-lg rounded-xl border border-emerald-500/30 bg-slate-950 touch-none"
      />
      <p className="text-xs text-slate-400">
        {es
          ? "Atraé las letras en orden con el mouse o el dedo. Formá tu nombre y combiná combos."
          : "Attract the letters in order with mouse or touch. Form your name and chain combos."}
      </p>
    </div>
  );
}
