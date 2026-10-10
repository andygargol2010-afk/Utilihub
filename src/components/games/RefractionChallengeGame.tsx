import { useEffect, useMemo, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Lens = { x: number; y: number; r: number; strength: number };
type Block = { x: number; y: number; w: number; h: number };
type Level = {
  lenses: Lens[];
  blocks: Block[];
  target: { x: number; y: number; r: number };
  hintEn: string;
  hintEs: string;
};

const W = 480;
const H = 280;
const ORIGIN = { x: 24, y: H / 2 };

const LEVELS: Level[] = [
  {
    lenses: [],
    blocks: [],
    target: { x: 430, y: 140, r: 18 },
    hintEn: "Straight shot — aim carefully.",
    hintEs: "Tiro directo — apuntá con cuidado.",
  },
  {
    lenses: [{ x: 240, y: 140, r: 42, strength: 0.045 }],
    blocks: [],
    target: { x: 430, y: 70, r: 18 },
    hintEn: "One lens bends the beam toward its center.",
    hintEs: "Una lente dobla el rayo hacia su centro.",
  },
  {
    lenses: [
      { x: 170, y: 100, r: 36, strength: 0.05 },
      { x: 300, y: 180, r: 36, strength: 0.05 },
    ],
    blocks: [{ x: 250, y: 40, w: 20, h: 80 }],
    target: { x: 430, y: 210, r: 18 },
    hintEn: "Two lenses + a blocker. Thread the gap.",
    hintEs: "Dos lentes y un obstáculo. Pasá por el hueco.",
  },
  {
    lenses: [
      { x: 150, y: 80, r: 34, strength: 0.055 },
      { x: 250, y: 200, r: 34, strength: 0.055 },
      { x: 340, y: 110, r: 30, strength: 0.05 },
    ],
    blocks: [
      { x: 200, y: 120, w: 18, h: 100 },
      { x: 300, y: 40, w: 18, h: 70 },
    ],
    target: { x: 440, y: 200, r: 16 },
    hintEn: "Three lenses. Small target.",
    hintEs: "Tres lentes. Blanco chico.",
  },
  {
    lenses: [
      { x: 160, y: 140, r: 40, strength: 0.06 },
      { x: 280, y: 70, r: 32, strength: 0.05 },
      { x: 280, y: 210, r: 32, strength: 0.05 },
    ],
    blocks: [
      { x: 220, y: 0, w: 16, h: 100 },
      { x: 220, y: 180, w: 16, h: 100 },
      { x: 350, y: 100, w: 16, h: 80 },
    ],
    target: { x: 440, y: 140, r: 15 },
    hintEn: "Final: navigate the corridor.",
    hintEs: "Final: navegá el corredor.",
  },
];

function castRay(angleDeg: number, level: Level): { points: { x: number; y: number }[]; hit: boolean } {
  const rad = (angleDeg * Math.PI) / 180;
  let x = ORIGIN.x;
  let y = ORIGIN.y;
  let vx = Math.cos(rad);
  let vy = Math.sin(rad);
  const points = [{ x, y }];
  const step = 2;
  const inside = new Set<number>();

  for (let i = 0; i < 900; i++) {
    x += vx * step;
    y += vy * step;
    if (i % 2 === 0) points.push({ x, y });

    if (x < 0 || x > W || y < 0 || y > H) break;

    for (const b of level.blocks) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        return { points, hit: false };
      }
    }

    const t = level.target;
    if ((x - t.x) ** 2 + (y - t.y) ** 2 <= t.r ** 2) {
      points.push({ x: t.x, y: t.y });
      return { points, hit: true };
    }

    level.lenses.forEach((lens, idx) => {
      const dx = x - lens.x;
      const dy = y - lens.y;
      const dist = Math.hypot(dx, dy);
      if (dist < lens.r) {
        if (!inside.has(idx)) {
          inside.add(idx);
          const tx = lens.x - x;
          const ty = lens.y - y;
          const tl = Math.hypot(tx, ty) || 1;
          const nx = tx / tl;
          const ny = ty / tl;
          const factor = lens.strength * (1 - dist / lens.r);
          vx += nx * factor * 12;
          vy += ny * factor * 12;
          const len = Math.hypot(vx, vy) || 1;
          vx /= len;
          vy /= len;
        }
      } else {
        inside.delete(idx);
      }
    });
  }

  return { points, hit: false };
}

export function RefractionChallengeGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [levelIdx, setLevelIdx] = useState(0);
  const [angle, setAngle] = useState(0);
  const [shots, setShots] = useState(0);
  const [fired, setFired] = useState(false);
  const [result, setResult] = useState<"idle" | "hit" | "miss">("idle");
  const [best, setBest] = useState(0);
  const [cleared, setCleared] = useState(false);

  const level = LEVELS[levelIdx]!;

  useEffect(() => {
    setBest(readBestScore("refraction-challenge"));
  }, []);

  const path = useMemo(() => castRay(angle, level), [angle, level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#0f172a");
    g.addColorStop(1, "#020617");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(52,211,153,0.06)";
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

    for (const b of level.blocks) {
      ctx.fillStyle = "rgba(15,23,42,0.95)";
      ctx.strokeStyle = "rgba(148,163,184,0.5)";
      ctx.lineWidth = 2;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    }

    for (const lens of level.lenses) {
      const lg = ctx.createRadialGradient(lens.x - 8, lens.y - 8, 4, lens.x, lens.y, lens.r);
      lg.addColorStop(0, "rgba(125,211,252,0.35)");
      lg.addColorStop(0.7, "rgba(56,189,248,0.15)");
      lg.addColorStop(1, "rgba(14,165,233,0.05)");
      ctx.beginPath();
      ctx.arc(lens.x, lens.y, lens.r, 0, Math.PI * 2);
      ctx.fillStyle = lg;
      ctx.fill();
      ctx.strokeStyle = "rgba(125,211,252,0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.moveTo(lens.x, lens.y - lens.r);
      ctx.lineTo(lens.x, lens.y + lens.r);
      ctx.stroke();
    }

    const t = level.target;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
    ctx.fillStyle = result === "hit" ? "rgba(52,211,153,0.5)" : "rgba(244,63,94,0.35)";
    ctx.fill();
    ctx.strokeStyle = result === "hit" ? "#34d399" : "#fb7185";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#34d399";
    ctx.beginPath();
    ctx.arc(ORIGIN.x, ORIGIN.y, 8, 0, Math.PI * 2);
    ctx.fill();

    if (!fired) {
      const rad = (angle * Math.PI) / 180;
      ctx.strokeStyle = "rgba(52,211,153,0.25)";
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(ORIGIN.x, ORIGIN.y);
      ctx.lineTo(ORIGIN.x + Math.cos(rad) * 80, ORIGIN.y + Math.sin(rad) * 80);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (fired && path.points.length > 1) {
      ctx.strokeStyle = path.hit ? "#6ee7b7" : "#fbbf24";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = path.hit ? "#34d399" : "#f59e0b";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(path.points[0]!.x, path.points[0]!.y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i]!.x, path.points[i]!.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [angle, fired, level, path, result]);

  const fire = () => {
    const { hit } = castRay(angle, level);
    const nextShots = shots + 1;
    setFired(true);
    setShots(nextShots);
    setResult(hit ? "hit" : "miss");
    if (hit && levelIdx >= LEVELS.length - 1) {
      setCleared(true);
      const score = Math.max(1, 1000 - nextShots * 40);
      setBest(writeBestScore("refraction-challenge", score));
    }
  };

  const next = () => {
    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx((i) => i + 1);
      setFired(false);
      setResult("idle");
      setAngle(0);
    }
  };

  const resetLevel = () => {
    setFired(false);
    setResult("idle");
  };

  const restart = () => {
    setLevelIdx(0);
    setAngle(0);
    setShots(0);
    setFired(false);
    setResult("idle");
    setCleared(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-emerald-100/80">
        <span>
          {es ? "Nivel" : "Level"}{" "}
          <strong className="text-white">
            {levelIdx + 1}/{LEVELS.length}
          </strong>
        </span>
        <span>
          {es ? "Disparos" : "Shots"}: <strong className="text-white">{shots}</strong>
        </span>
        {best > 0 && (
          <span>
            {es ? "Mejor" : "Best"}: <strong className="text-amber-300">{best}</strong>
          </span>
        )}
      </div>

      <p className="text-center text-xs text-white/55">{es ? level.hintEs : level.hintEn}</p>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={es ? `Nivel ${levelIdx + 1}: lentes, obstáculos y blanco del láser` : `Level ${levelIdx + 1}: lenses, blockers and laser target`}
          width={W}
          height={H}
          className="h-auto w-full touch-none"
          style={{ aspectRatio: `${W}/${H}` }}
        />
      </div>

      <label className="block text-xs text-emerald-100/70">
        {es ? "Ángulo" : "Angle"}: {angle}°
        <input
          type="range"
          min={-55}
          max={55}
          value={angle}
          disabled={fired && result === "hit"}
          onChange={(e) => {
            setAngle(Number(e.target.value));
            if (fired) {
              setFired(false);
              setResult("idle");
            }
          }}
          className="mt-1 w-full accent-emerald-400"
        />
      </label>

      <div className="flex flex-wrap justify-center gap-2">
        {!cleared && result !== "hit" && (
          <GamePrimaryButton onClick={fire}>{es ? "Disparar" : "Fire"}</GamePrimaryButton>
        )}
        {result === "hit" && levelIdx < LEVELS.length - 1 && (
          <GamePrimaryButton onClick={next}>{es ? "Siguiente nivel" : "Next level"}</GamePrimaryButton>
        )}
        {result === "miss" && (
          <GameSecondaryButton onClick={resetLevel}>{es ? "Reintentar" : "Retry"}</GameSecondaryButton>
        )}
        <GameSecondaryButton onClick={restart}>{es ? "Desde cero" : "Restart"}</GameSecondaryButton>
      </div>

      {result === "hit" && !cleared && (
        <p className="text-center text-sm font-bold text-emerald-300">{es ? "¡Impacto!" : "Hit!"}</p>
      )}
      {result === "miss" && (
        <p className="text-center text-sm font-semibold text-amber-200/90">
          {es ? "Fallaste — ajustá el ángulo." : "Miss — tweak the angle."}
        </p>
      )}
      {cleared && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-center">
          <p className="font-black text-emerald-300">
            {es ? "¡Todos los niveles!" : "All levels cleared!"}
          </p>
          <p className="mt-1 text-xs text-white/60">
            {es ? "Disparos totales" : "Total shots"}: {shots}
          </p>
        </div>
      )}
    </div>
  );
}
