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
  trail: { x: number; y: number }[];
};

interface Props {
  locale?: GameLocale;
}

const BEST_KEY = "utilihub-magnetic-letter-best";

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
  const [best, setBest] = useState(0);
  const [flash, setFlash] = useState(0);
  const mouse = useRef({ x: 240, y: 170 });
  const particles = useRef<Particle[]>([]);
  const nextNeeded = useRef(0);
  const anim = useRef<number>(0);
  const lastCombo = useRef(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BEST_KEY);
      if (stored) setBest(Number(stored) || 0);
    } catch {}
  }, []);

  const persistBest = useCallback((v: number) => {
    setBest((b) => {
      const next = Math.max(b, v);
      try { localStorage.setItem(BEST_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const letters = (name.trim() || "A").toUpperCase().slice(0, 10).split("");
    const pts: Particle[] = [];
    const modeSpeed = mode === "challenge" ? speed * 1.6 : mode === "zen" ? speed * 0.6 : speed;
    letters.forEach((ch, i) => {
      for (let c = 0; c < count; c++) {
        pts.push({
          char: ch,
          x: 50 + Math.random() * 380,
          y: 40 + Math.random() * 220,
          vx: (Math.random() - 0.5) * modeSpeed * 2.4,
          vy: (Math.random() - 0.5) * modeSpeed * 2.4,
          caught: false,
          targetX: 70 + i * 38,
          targetY: 300,
          order: i,
          trail: [],
        });
      }
    });
    particles.current = pts;
    nextNeeded.current = 0;
    setScore(0);
    setCombo(0);
    setCaught(0);
    setFlash(0);
    lastCombo.current = 0;
  }, [name, speed, count, mode]);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      ctx.fillStyle = "rgba(6, 10, 24, 0.22)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const attractRadius = mode === "zen" ? 180 : mode === "challenge" ? 100 : 140;
      const pullStrength = mode === "zen" ? 0.07 : mode === "challenge" ? 0.22 : 0.14;

      particles.current.forEach((p) => {
        if (p.caught) {
          p.x += (p.targetX - p.x) * 0.14;
          p.y += (p.targetY - p.y) * 0.14;
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 8) p.trail.shift();
        } else if (running) {
          const dist = Math.hypot(mx - p.x, my - p.y);
          if (p.order === nextNeeded.current && dist < attractRadius) {
            const pull = pullStrength * (1 - dist / attractRadius);
            p.vx += (mx - p.x) * pull * 0.018;
            p.vy += (my - p.y) * pull * 0.018;
            const ang = Math.atan2(my - p.y, mx - p.x) + 0.4;
            p.vx += Math.cos(ang) * pull * 0.4;
            p.vy += Math.sin(ang) * pull * 0.4;
            if (dist < 22) {
              p.caught = true;
              setCaught((c) => c + 1);
              const newCombo = lastCombo.current + 1;
              lastCombo.current = newCombo;
              setCombo(newCombo);
              setScore((s) => s + 120 * newCombo);
              setFlash(12);
              nextNeeded.current += 1;
            }
          }
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= mode === "challenge" ? 0.99 : 0.982;
          p.vy *= mode === "challenge" ? 0.99 : 0.982;
          if (p.x < 12 || p.x > canvas.width - 12) p.vx *= -1;
          if (p.y < 12 || p.y > canvas.height - 12) p.vy *= -1;
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 6) p.trail.shift();
        }

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = p.caught ? "rgba(52, 211, 153, 0.35)" : "rgba(103, 232, 249, 0.25)";
          ctx.lineWidth = 2;
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) ctx.lineTo(p.trail[t].x, p.trail[t].y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.fillStyle = p.caught ? "#34d399" : p.order === nextNeeded.current ? "#67e8f9" : "#64748b";
        ctx.arc(p.x, p.y, p.caught ? 15 : 13, 0, Math.PI * 2);
        ctx.fill();
        if (p.order === nextNeeded.current && !p.caught) {
          ctx.strokeStyle = "rgba(103, 232, 249, 0.7)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 15px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, p.x, p.y);
      });

      const grad = ctx.createRadialGradient(mx, my, 4, mx, my, 28);
      grad.addColorStop(0, "rgba(52, 211, 153, 0.9)");
      grad.addColorStop(1, "rgba(52, 211, 153, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mx, my, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 2.5;
      ctx.arc(mx, my, 16, 0, Math.PI * 2);
      ctx.stroke();

      if (flash > 0) {
        ctx.fillStyle = `rgba(52, 211, 153, ${flash / 40})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setFlash((f) => Math.max(0, f - 1));
      }

      if (running && nextNeeded.current >= (name.trim() || "A").length) {
        setRunning(false);
        setScore((s) => {
          const final = s + 600;
          persistBest(final);
          return final;
        });
        setFlash(20);
      }

      anim.current = requestAnimationFrame(loop);
    };
    anim.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim.current);
  }, [running, mode, name, flash, persistBest]);

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current = {
      x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width,
      y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height,
    };
    if (e.type === "pointerdown") {
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    }
  };

  const sharePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `magnetic-${(name || "name").slice(0, 12)}.png`;
    a.click();
  };

  const shareScore = async () => {
    const text = es
      ? `Atrapé las letras de "${name}" en Atrapa Letras Magnéticas. Puntaje: ${score} (mejor ${best}). ¡Probálo en UtiliHub!`
      : `Caught the letters of "${name}" in Magnetic Letter Catcher. Score: ${score} (best ${best}). Try it on UtiliHub!`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: es ? "Atrapa Letras Magnéticas" : "Magnetic Letter Catcher", text, url });
        return;
      }
      await navigator.clipboard.writeText(text + "\n" + url);
      alert(es ? "Puntaje copiado al portapapeles" : "Score copied to clipboard");
    } catch {
      alert(text);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 10))}
          className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-sm text-white"
          placeholder={es ? "Tu nombre" : "Your name"}
          maxLength={10}
        />
        <GameSecondaryButton active={mode === "arcade"} onClick={() => setMode("arcade")}>Arcade</GameSecondaryButton>
        <GameSecondaryButton active={mode === "zen"} onClick={() => setMode("zen")}>Zen</GameSecondaryButton>
        <GameSecondaryButton active={mode === "challenge"} onClick={() => setMode("challenge")}>Challenge</GameSecondaryButton>
        <label className="text-xs text-slate-300">
          {es ? "Vel." : "Speed"}
          <input type="range" min={0.5} max={2.4} step={0.1} value={speed} onChange={(e) => setSpeed(+e.target.value)} className="ml-1 w-20" />
        </label>
        <label className="text-xs text-slate-300">
          {es ? "Copias" : "Copies"}
          <input type="range" min={1} max={3} value={count} onChange={(e) => setCount(+e.target.value)} className="ml-1 w-16" />
        </label>
        <GamePrimaryButton onClick={() => { reset(); setRunning(true); }}>
          {running ? (es ? "Reiniciar" : "Restart") : (es ? "Jugar" : "Play")}
        </GamePrimaryButton>
        <GameSecondaryButton onClick={sharePng}>{es ? "PNG" : "PNG"}</GameSecondaryButton>
        <GameSecondaryButton onClick={shareScore}>{es ? "Compartir" : "Share"}</GameSecondaryButton>
      </div>
      <div className="flex gap-4 text-sm font-semibold text-emerald-300">
        <span>{es ? "Puntaje" : "Score"}: {score}</span>
        <span>Combo: x{combo}</span>
        <span>{es ? "Atrapadas" : "Caught"}: {caught}</span>
        <span>{es ? "Mejor" : "Best"}: {best}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={480}
        height={340}
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        className="w-full max-w-lg rounded-xl border border-emerald-500/40 bg-slate-950 touch-none cursor-crosshair select-none"
        style={{ touchAction: "none" }}
      />
      <p className="text-xs text-slate-400">
        {es
          ? "Atraé las letras en orden con el mouse o el dedo. Las partículas dejan rastro y se fijan al formar el nombre. Modo Challenge es más rápido. Mejor puntaje se guarda localmente."
          : "Attract the letters in order with mouse or touch. Particles leave trails and lock when forming the name. Challenge mode is faster. Best score is saved locally."}
      </p>
    </div>
  );
}
