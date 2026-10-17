import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const W = 360;
const H = 480;
const BAR_W = 72;
const BAR_H = 12;
const BAR_Y = H - 36;

type PulseKind = "normal" | "rare" | "life";

type Pulse = {
  x: number;
  y: number;
  r: number;
  vy: number;
  hue: number;
  kind: PulseKind;
  trail: { x: number; y: number }[];
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
};

type Floater = {
  x: number;
  y: number;
  text: string;
  life: number;
  hue: number;
};

export function PulseCatchArenaGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [shared, setShared] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  const pulsesRef = useRef<Pulse[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatersRef = useRef<Floater[]>([]);
  const barXRef = useRef(W / 2 - BAR_W / 2);
  const keysRef = useRef({ left: false, right: false });
  const spawnTimerRef = useRef(0);
  const elapsedRef = useRef(0);
  const comboRef = useRef(1);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const runningRef = useRef(false);
  const gameOverRef = useRef(false);
  const missFlashRef = useRef(0);
  const comboFlashRef = useRef(0);
  const holdLeftRef = useRef(false);
  const holdRightRef = useRef(false);
  const shakeRef = useRef(0);

  useEffect(() => {
    setBest(readBestScore("pulse-catch-arena"));
  }, []);

  useEffect(() => {
    comboRef.current = combo;
    livesRef.current = lives;
    scoreRef.current = score;
    runningRef.current = running;
    gameOverRef.current = gameOver;
  }, [combo, lives, score, running, gameOver]);

  const hardReset = useCallback(() => {
    pulsesRef.current = [];
    particlesRef.current = [];
    floatersRef.current = [];
    barXRef.current = W / 2 - BAR_W / 2;
    spawnTimerRef.current = 0;
    elapsedRef.current = 0;
    missFlashRef.current = 0;
    comboFlashRef.current = 0;
    holdLeftRef.current = false;
    holdRightRef.current = false;
    shakeRef.current = 0;
    setScore(0);
    setCombo(1);
    setLives(3);
    setDifficultyLevel(1);
    setGameOver(false);
    setPaused(false);
    setRunning(true);
    comboRef.current = 1;
    livesRef.current = 3;
    scoreRef.current = 0;
    runningRef.current = true;
    gameOverRef.current = false;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        keysRef.current.left = e.type === "keydown";
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        keysRef.current.right = e.type === "keydown";
      }
      if ((e.key === " " || e.key === "p" || e.key === "P") && e.type === "keydown") {
        e.preventDefault();
        if (gameOverRef.current || !runningRef.current) {
          hardReset();
        } else {
          setPaused((p) => !p);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [hardReset]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      if (!paused && !gameOver) {
        elapsedRef.current += 16;
        const difficulty = 1 + elapsedRef.current / 25000;
        const level = Math.min(12, Math.floor(elapsedRef.current / 18000) + 1);
        if (level !== difficultyLevel) setDifficultyLevel(level);

        spawnTimerRef.current += 16;
        const spawnInterval = Math.max(260, 900 - difficulty * 130);
        if (spawnTimerRef.current >= spawnInterval) {
          spawnTimerRef.current = 0;
          const roll = Math.random();
          const kind: PulseKind = roll < 0.055 ? "life" : roll < 0.12 ? "rare" : "normal";
          pulsesRef.current.push({
            x: 20 + Math.random() * (W - 40),
            y: -10,
            r: kind === "life" ? 13 : kind === "rare" ? 12 : 9 + Math.random() * 4,
            vy: (1.55 + Math.random() * 1.3) * difficulty * (kind === "life" ? 0.9 : 1),
            hue: kind === "life" ? 140 + Math.random() * 20 : kind === "rare" ? 40 + Math.random() * 25 : 160 + Math.random() * 160,
            kind,
            trail: [],
          });
        }

        // move bar
        const speed = 5.6;
        if (keysRef.current.left || holdLeftRef.current) barXRef.current = Math.max(0, barXRef.current - speed);
        if (keysRef.current.right || holdRightRef.current) barXRef.current = Math.min(W - BAR_W, barXRef.current + speed);

        // update pulses
        pulsesRef.current = pulsesRef.current.filter((p) => {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 8) p.trail.shift();
          p.y += p.vy;
          // catch
          if (
            p.y + p.r >= BAR_Y &&
            p.y - p.r <= BAR_Y + BAR_H &&
            p.x >= barXRef.current - 4 &&
            p.x <= barXRef.current + BAR_W + 4
          ) {
            shakeRef.current = 6;
            const barCenter = barXRef.current + BAR_W / 2;
            const dist = Math.abs(p.x - barCenter);
            const perfect = dist < BAR_W * 0.22;
            if (p.kind === "life") {
              setLives((l) => {
                const next = Math.min(5, l + 1);
                livesRef.current = next;
                return next;
              });
              floatersRef.current.push({
                x: p.x,
                y: p.y - 8,
                text: es ? "+1 vida" : "+1 life",
                life: 46,
                hue: 140,
              });
            } else {
              const c = comboRef.current;
              const base = p.kind === "rare" ? 18 : 8;
              const mult = perfect ? 1.6 : 1;
              const pts = Math.round(base * c * mult);
              setScore((s) => {
                const next = s + pts;
                setBest((b) => writeBestScore("pulse-catch-arena", Math.max(b, next)));
                return next;
              });
              const nextC = Math.min(c + 1, 20);
              setCombo(nextC);
              comboRef.current = nextC;
              if (nextC >= 3) comboFlashRef.current = 18;
              floatersRef.current.push({
                x: p.x,
                y: p.y - 8,
                text: perfect
                  ? `${es ? "PERFECTO" : "PERFECT"} +${pts}${nextC > 1 ? ` x${nextC}` : ""}`
                  : `+${pts}${nextC > 1 ? ` x${nextC}` : ""}`,
                life: perfect ? 52 : 40,
                hue: perfect ? 55 : p.hue,
              });
            }
            // particles
            const n = p.kind === "life" ? 20 : p.kind === "rare" ? 22 : 14;
            for (let i = 0; i < n; i++) {
              particlesRef.current.push({
                x: p.x,
                y: p.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 1,
                life: 28,
                hue: p.hue + (Math.random() - 0.5) * 40,
                size: p.kind === "normal" ? 2.2 : 3,
              });
            }
            return false;
          }
          // miss
          if (p.y - p.r > H) {
            if (p.kind !== "life") {
              setLives((l) => {
                const next = l - 1;
                livesRef.current = next;
                if (next <= 0) {
                  setGameOver(true);
                  gameOverRef.current = true;
                  setRunning(false);
                  runningRef.current = false;
                }
                return next;
              });
              setCombo(1);
              comboRef.current = 1;
              missFlashRef.current = 14;
            }
            return false;
          }
          return true;
        });

        // particles
        particlesRef.current = particlesRef.current.filter((pt) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.08;
          pt.life -= 1;
          return pt.life > 0;
        });

        // floaters
        floatersRef.current = floatersRef.current.filter((f) => {
          f.y -= 0.7;
          f.life -= 1;
          return f.life > 0;
        });

        if (missFlashRef.current > 0) missFlashRef.current -= 1;
        if (comboFlashRef.current > 0) comboFlashRef.current -= 1;
        if (shakeRef.current > 0) shakeRef.current -= 1;
      }

      // draw
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        const shake = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 1.4 : 0;
        ctx.save();
        ctx.translate(shake, shake * 0.6);
        ctx.fillStyle = "#05050a";
        ctx.fillRect(-4, -4, W + 8, H + 8);

        // ambient grid that intensifies with combo
        const comboBoost = Math.min(comboRef.current, 12);
        ctx.globalAlpha = 0.04 + comboBoost * 0.012;
        ctx.strokeStyle = comboBoost >= 6 ? "#e879f9" : "#22d3ee";
        ctx.lineWidth = 0.6;
        for (let gy = 40; gy < H; gy += 40) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(W, gy);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // pulse trails
        for (const p of pulsesRef.current) {
          for (let i = 0; i < p.trail.length; i++) {
            const t = p.trail[i];
            const a = (i / p.trail.length) * 0.35;
            ctx.globalAlpha = a;
            ctx.fillStyle = `hsl(${p.hue},100%,60%)`;
            ctx.beginPath();
            ctx.arc(t.x, t.y, p.r * (0.35 + (i / p.trail.length) * 0.4), 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;

        // pulses
        for (const p of pulsesRef.current) {
          ctx.save();
          ctx.shadowBlur = p.kind === "normal" ? 18 : 28;
          ctx.shadowColor = `hsl(${p.hue},100%,65%)`;
          ctx.fillStyle = `hsl(${p.hue},100%,${p.kind === "life" ? 55 : p.kind === "rare" ? 60 : 70}%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = p.kind === "life" ? "#bbf7d0" : p.kind === "rare" ? "#fef3c7" : "#fff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.38, 0, Math.PI * 2);
          ctx.fill();
          if (p.kind === "life") {
            ctx.fillStyle = "#052e16";
            ctx.font = "bold 11px system-ui";
            ctx.textAlign = "center";
            ctx.fillText("+", p.x, p.y + 4);
          }
          if (p.kind === "rare") {
            ctx.strokeStyle = "#fef3c7";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r + 3, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        }

        // particles
        for (const pt of particlesRef.current) {
          ctx.globalAlpha = pt.life / 28;
          ctx.fillStyle = `hsl(${pt.hue},100%,70%)`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // floaters (+pts)
        for (const f of floatersRef.current) {
          ctx.globalAlpha = Math.min(1, f.life / 20);
          ctx.fillStyle = `hsl(${f.hue},100%,75%)`;
          ctx.font = "bold 13px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(f.text, f.x, f.y);
        }
        ctx.globalAlpha = 1;

        // bar (combo reactive)
        ctx.save();
        ctx.shadowBlur = 16 + comboBoost * 1.5;
        ctx.shadowColor = comboBoost >= 6 ? "#e879f9" : "#22d3ee";
        const g = ctx.createLinearGradient(barXRef.current, BAR_Y, barXRef.current + BAR_W, BAR_Y);
        if (comboBoost >= 6) {
          g.addColorStop(0, "#e879f9");
          g.addColorStop(1, "#a21caf");
        } else {
          g.addColorStop(0, "#22d3ee");
          g.addColorStop(1, "#0891b2");
        }
        ctx.fillStyle = g;
        ctx.fillRect(barXRef.current, BAR_Y, BAR_W, BAR_H);
        ctx.restore();

        // combo meter (left)
        const comboMax = 12;
        const cProg = Math.min(1, comboRef.current / comboMax);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(8, H - 80, 6, 60);
        ctx.fillStyle = comboBoost >= 6 ? "#e879f9" : "#22d3ee";
        ctx.fillRect(8, H - 80 + 60 * (1 - cProg), 6, 60 * cProg);

        // difficulty meter (top)
        const meterW = 120;
        const meterX = (W - meterW) / 2;
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(meterX, 10, meterW, 6);
        const prog = Math.min(1, (elapsedRef.current % 18000) / 18000);
        ctx.fillStyle = "#22d3ee";
        ctx.fillRect(meterX, 10, meterW * prog, 6);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.font = "10px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`Lv ${difficultyLevel}`, W / 2, 28);

        // miss vignette
        if (missFlashRef.current > 0) {
          ctx.fillStyle = `rgba(244,63,94,${0.22 * (missFlashRef.current / 14)})`;
          ctx.fillRect(0, 0, W, H);
        }

        // combo flash ring
        if (comboFlashRef.current > 0) {
          ctx.strokeStyle = `rgba(232,121,249,${0.45 * (comboFlashRef.current / 18)})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(W / 2, H / 2, 40 + (18 - comboFlashRef.current) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // pause overlay
        if (paused && !gameOver) {
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 22px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(es ? "Pausa" : "Paused", W / 2, H / 2 - 6);
          ctx.font = "13px system-ui";
          ctx.fillStyle = "rgba(255,255,255,0.75)";
          ctx.fillText(es ? "Espacio / P para seguir" : "Space / P to resume", W / 2, H / 2 + 20);
        }

        if (gameOver) {
          ctx.fillStyle = "rgba(0,0,0,0.65)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 22px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(es ? "Fin del juego" : "Game Over", W / 2, H / 2 - 18);
          ctx.font = "15px system-ui";
          ctx.fillText(`${es ? "Puntos" : "Score"}: ${scoreRef.current}`, W / 2, H / 2 + 10);
          ctx.font = "12px system-ui";
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.fillText(es ? "Espacio para reiniciar" : "Space to restart", W / 2, H / 2 + 34);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, gameOver, es, difficultyLevel]);

  // idle canvas when not running
  useEffect(() => {
    if (running) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#05050a";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(125,211,252,0.12)";
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc((i * 53) % W, (i * 37) % H, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Pulse Catch Arena", W / 2, H / 2 - 12);
    ctx.font = "13px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(es ? "Toc\u00e1 Jugar para empezar" : "Tap Play to start", W / 2, H / 2 + 16);
  }, [running, es]);

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!running || paused || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    barXRef.current = Math.max(0, Math.min(W - BAR_W, x - BAR_W / 2));
  };

  const share = async () => {
    const text = es
      ? `Hice ${best} puntos en Pulse Catch Arena en UtiliHub! \u00bfPod\u00e9s superarme? https://utilihub.net/es/juegos/pulse-catch-arena`
      : `I scored ${best} in Pulse Catch Arena on UtiliHub! Can you beat it? https://utilihub.net/games/pulse-catch-arena`;
    try {
      if (navigator.share) await navigator.share({ title: "Pulse Catch Arena", text });
      else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 1600);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 1600);
      } catch {}
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-emerald-100/90">
        <span>
          {es ? "Puntos" : "Score"}: <span className="text-cyan-300">{score}</span>
        </span>
        <span>
          Combo: <span className="text-fuchsia-300">x{combo}</span>
        </span>
        <span>
          {es ? "Vidas" : "Lives"}: <span className="text-rose-300">{"\u2764".repeat(Math.max(0, lives))}</span>
        </span>
        <span>
          {es ? "Mejor" : "Best"}: <span className="text-amber-300">{best}</span>
        </span>
        {!running || gameOver ? (
          <GamePrimaryButton onClick={hardReset}>{es ? "Jugar" : "Play"}</GamePrimaryButton>
        ) : (
          <>
            <GameSecondaryButton onClick={() => setPaused((p) => !p)} active={paused}>
              {paused ? (es ? "Seguir" : "Resume") : es ? "Pausa" : "Pause"}
            </GameSecondaryButton>
            <GamePrimaryButton onClick={hardReset}>{es ? "Reiniciar" : "Restart"}</GamePrimaryButton>
          </>
        )}
        {best > 0 && (
          <GameSecondaryButton onClick={share}>{shared ? (es ? "\u00a1Copiado!" : "Copied!") : es ? "Compartir" : "Share"}</GameSecondaryButton>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onPointerMove={onPointerMove}
        className="touch-none rounded-xl border border-cyan-500/20 bg-black shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_16px_40px_rgba(0,0,0,0.45)]"
        style={{ width: "100%", maxWidth: W, height: "auto", aspectRatio: `${W}/${H}` }}
      />
      {running && !gameOver && (
        <div className="flex w-full max-w-[360px] justify-between gap-3 px-1">
          <button
            type="button"
            className="flex-1 rounded-lg border border-cyan-500/30 bg-cyan-950/40 py-2 text-sm font-semibold text-cyan-100 active:bg-cyan-800/50"
            onPointerDown={() => { holdLeftRef.current = true; }}
            onPointerUp={() => { holdLeftRef.current = false; }}
            onPointerLeave={() => { holdLeftRef.current = false; }}
            onPointerCancel={() => { holdLeftRef.current = false; }}
          >
            \u2190
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg border border-cyan-500/30 bg-cyan-950/40 py-2 text-sm font-semibold text-cyan-100 active:bg-cyan-800/50"
            onPointerDown={() => { holdRightRef.current = true; }}
            onPointerUp={() => { holdRightRef.current = false; }}
            onPointerLeave={() => { holdRightRef.current = false; }}
            onPointerCancel={() => { holdRightRef.current = false; }}
          >
            \u2192
          </button>
        </div>
      )}
      <p className="text-center text-[11px] text-white/50">
        {es
          ? "Arrastr\u00e1, botones o \u2190\u2192 / A D. Atrap\u00e1 cerca del centro para PERFECTO. Verdes dan +1 vida (m\u00e1x 5). Combos suben puntos."
          : "Drag, buttons or \u2190\u2192 / A D. Catch near the center for PERFECT. Green ones give +1 life (max 5). Combos boost score."}
      </p>
    </div>
  );
}
