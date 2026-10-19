import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const W = 360;
const H = 520;
const PLANET_R = 28;
const PLANET_X = W / 2;
const PLANET_Y = H / 2;

type Asteroid = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  hp: number;
  rot: number;
  points: number[];
};

type Shot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
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

type PowerUp = {
  x: number;
  y: number;
  kind: "shield" | "rapid" | "slow";
  life: number;
};

function makeAsteroidShape(r: number) {
  const pts: number[] = [];
  const n = 7 + Math.floor(Math.random() * 4);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.72 + Math.random() * 0.5);
    pts.push(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  return pts;
}

export function OrbitDefenderArcadeGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [shield, setShield] = useState(0);
  const [best, setBest] = useState(0);
  const [shared, setShared] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const asteroidsRef = useRef<Asteroid[]>([]);
  const shotsRef = useRef<Shot[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const aimRef = useRef({ x: W / 2, y: H / 4 });
  const lastShotRef = useRef(0);
  const waveTimerRef = useRef(0);
  const elapsedRef = useRef(0);
  const scoreRef = useRef(0);
  const shieldRef = useRef(0);
  const runningRef = useRef(false);
  const gameOverRef = useRef(false);
  const rapidUntilRef = useRef(0);
  const slowUntilRef = useRef(0);
  const shakeRef = useRef(0);

  useEffect(() => {
    setBest(readBestScore("orbit-defender-arcade"));
  }, []);

  useEffect(() => {
    scoreRef.current = score;
    shieldRef.current = shield;
    runningRef.current = running;
    gameOverRef.current = gameOver;
  }, [score, shield, running, gameOver]);

  const hardReset = useCallback(() => {
    asteroidsRef.current = [];
    shotsRef.current = [];
    particlesRef.current = [];
    powerUpsRef.current = [];
    aimRef.current = { x: W / 2, y: H / 4 };
    lastShotRef.current = 0;
    waveTimerRef.current = 0;
    elapsedRef.current = 0;
    rapidUntilRef.current = 0;
    slowUntilRef.current = 0;
    shakeRef.current = 0;
    setScore(0);
    setWave(1);
    setShield(0);
    setGameOver(false);
    setPaused(false);
    setRunning(true);
    scoreRef.current = 0;
    shieldRef.current = 0;
    runningRef.current = true;
    gameOverRef.current = false;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
    return () => window.removeEventListener("keydown", onKey);
  }, [hardReset]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      if (!paused && !gameOver) {
        const now = performance.now();
        elapsedRef.current += 16;
        const difficulty = 1 + elapsedRef.current / 20000;
        const currentWave = Math.min(12, Math.floor(elapsedRef.current / 15000) + 1);
        if (currentWave !== wave) setWave(currentWave);

        const slow = slowUntilRef.current > now;
        const rapid = rapidUntilRef.current > now;
        const timeScale = slow ? 0.55 : 1;

        // spawn asteroids
        waveTimerRef.current += 16 * timeScale;
        const spawnInterval = Math.max(400, 1400 - difficulty * 80);
        if (waveTimerRef.current >= spawnInterval) {
          waveTimerRef.current = 0;
          const angle = Math.random() * Math.PI * 2;
          const dist = 280 + Math.random() * 40;
          const speed = (0.6 + Math.random() * 0.8) * difficulty * timeScale;
          const r = 8 + Math.random() * 10;
          asteroidsRef.current.push({
            x: PLANET_X + Math.cos(angle) * dist,
            y: PLANET_Y + Math.sin(angle) * dist,
            vx: -Math.cos(angle) * speed,
            vy: -Math.sin(angle) * speed,
            r,
            hue: 18 + Math.random() * 42,
            hp: Math.random() < 0.15 ? 2 : 1,
            rot: Math.random() * Math.PI * 2,
            points: makeAsteroidShape(r),
          });
          // occasional power-up
          if (Math.random() < 0.09) {
            powerUpsRef.current.push({
              x: PLANET_X + Math.cos(angle) * (dist * 0.7),
              y: PLANET_Y + Math.sin(angle) * (dist * 0.7),
              kind: Math.random() < 0.4 ? "shield" : Math.random() < 0.5 ? "rapid" : "slow",
              life: 280,
            });
          }
        }

        // auto fire toward aim
        const fireRate = rapid ? 85 : 175;
        if (now - lastShotRef.current > fireRate) {
          const dx = aimRef.current.x - PLANET_X;
          const dy = aimRef.current.y - PLANET_Y;
          const len = Math.hypot(dx, dy) || 1;
          const shotSpeed = 5.6;
          shotsRef.current.push({
            x: PLANET_X + (dx / len) * (PLANET_R + 6),
            y: PLANET_Y + (dy / len) * (PLANET_R + 6),
            vx: (dx / len) * shotSpeed,
            vy: (dy / len) * shotSpeed,
            life: 72,
          });
          lastShotRef.current = now;
        }

        // update shots
        shotsRef.current = shotsRef.current.filter((s) => {
          s.x += s.vx * timeScale;
          s.y += s.vy * timeScale;
          s.life -= 1;
          return s.life > 0 && s.x > -20 && s.x < W + 20 && s.y > -20 && s.y < H + 20;
        });

        // update asteroids
        asteroidsRef.current = asteroidsRef.current.filter((a) => {
          a.x += a.vx * timeScale;
          a.y += a.vy * timeScale;
          a.rot += 0.012 * timeScale;

          // hit planet
          const dx = a.x - PLANET_X;
          const dy = a.y - PLANET_Y;
          if (Math.hypot(dx, dy) < PLANET_R + a.r - 4) {
            if (shieldRef.current > 0) {
              setShield((s) => Math.max(0, s - 1));
              shieldRef.current = Math.max(0, shieldRef.current - 1);
              shakeRef.current = 8;
            } else {
              setGameOver(true);
              gameOverRef.current = true;
              setRunning(false);
              runningRef.current = false;
            }
            for (let i = 0; i < 22; i++) {
              particlesRef.current.push({
                x: a.x,
                y: a.y,
                vx: (Math.random() - 0.5) * 5.2,
                vy: (Math.random() - 0.5) * 5.2,
                life: 34,
                hue: a.hue,
                size: 2.2 + Math.random() * 1.6,
              });
            }
            return false;
          }

          // shot hits
          for (let i = shotsRef.current.length - 1; i >= 0; i--) {
            const s = shotsRef.current[i];
            if (Math.hypot(s.x - a.x, s.y - a.y) < a.r + 3) {
              shotsRef.current.splice(i, 1);
              a.hp -= 1;
              shakeRef.current = 4;
              if (a.hp <= 0) {
                const pts = Math.round(10 * (1 + difficulty * 0.3));
                setScore((sc) => {
                  const next = sc + pts;
                  setBest((b) => {
                    const nb = Math.max(b, next);
                    return writeBestScore("orbit-defender-arcade", nb);
                  });
                  return next;
                });
                for (let j = 0; j < 20; j++) {
                  particlesRef.current.push({
                    x: a.x,
                    y: a.y,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    life: 28,
                    hue: a.hue + (Math.random() - 0.5) * 36,
                    size: 1.8 + Math.random() * 1.8,
                  });
                }
                return false;
              }
              break;
            }
          }
          return true;
        });

        // power-ups
        powerUpsRef.current = powerUpsRef.current.filter((p) => {
          p.life -= 1;
          const dx = p.x - PLANET_X;
          const dy = p.y - PLANET_Y;
          if (Math.hypot(dx, dy) < PLANET_R + 12) {
            if (p.kind === "shield") setShield((s) => Math.min(3, s + 1));
            if (p.kind === "rapid") rapidUntilRef.current = now + 5200;
            if (p.kind === "slow") slowUntilRef.current = now + 4600;
            return false;
          }
          return p.life > 0;
        });

        // particles
        particlesRef.current = particlesRef.current.filter((pt) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.035;
          pt.life -= 1;
          return pt.life > 0;
        });

        if (shakeRef.current > 0) shakeRef.current -= 1;
      }

      // draw
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        const shake = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current : 0;
        ctx.save();
        ctx.translate(shake, shake * 0.5);
        ctx.fillStyle = "#04060d";
        ctx.fillRect(-4, -4, W + 8, H + 8);

        // stars
        ctx.fillStyle = "rgba(190,210,255,0.45)";
        for (let i = 0; i < 48; i++) {
          ctx.fillRect((i * 53) % W, (i * 29) % H, i % 7 === 0 ? 1.5 : 1, i % 7 === 0 ? 1.5 : 1);
        }

        // planet
        ctx.save();
        ctx.shadowBlur = 28;
        ctx.shadowColor = "#34d399";
        const pg = ctx.createRadialGradient(PLANET_X - 8, PLANET_Y - 8, 3, PLANET_X, PLANET_Y, PLANET_R);
        pg.addColorStop(0, "#86efac");
        pg.addColorStop(0.55, "#34d399");
        pg.addColorStop(1, "#047857");
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(PLANET_X, PLANET_Y, PLANET_R, 0, Math.PI * 2);
        ctx.fill();
        if (shieldRef.current > 0) {
          ctx.strokeStyle = `rgba(34,211,238,${0.45 + shieldRef.current * 0.14})`;
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.arc(PLANET_X, PLANET_Y, PLANET_R + 9, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // asteroids
        for (const a of asteroidsRef.current) {
          ctx.save();
          ctx.translate(a.x, a.y);
          ctx.rotate(a.rot);
          ctx.shadowBlur = 14;
          ctx.shadowColor = `hsl(${a.hue},85%,52%)`;
          ctx.fillStyle = `hsl(${a.hue},68%,42%)`;
          ctx.beginPath();
          ctx.moveTo(a.points[0], a.points[1]);
          for (let i = 2; i < a.points.length; i += 2) {
            ctx.lineTo(a.points[i], a.points[i + 1]);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // shots
        for (const s of shotsRef.current) {
          ctx.fillStyle = "#fef08a";
          ctx.shadowBlur = 9;
          ctx.shadowColor = "#fef08a";
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // power-ups
        for (const p of powerUpsRef.current) {
          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.kind === "shield" ? "#22d3ee" : p.kind === "rapid" ? "#f472b6" : "#a78bfa";
          ctx.fillStyle = p.kind === "shield" ? "#22d3ee" : p.kind === "rapid" ? "#f472b6" : "#a78bfa";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // particles
        for (const pt of particlesRef.current) {
          ctx.globalAlpha = Math.max(0, pt.life / 28);
          ctx.fillStyle = `hsl(${pt.hue},100%,66%)`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // aim line
        if (running && !paused && !gameOver) {
          ctx.strokeStyle = "rgba(255,255,255,0.28)";
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(PLANET_X, PLANET_Y);
          ctx.lineTo(aimRef.current.x, aimRef.current.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // HUD
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.font = "12px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${es ? "Puntos" : "Score"}: ${scoreRef.current}`, 10, 20);
        ctx.fillText(`${es ? "Ola" : "Wave"}: ${wave}`, 10, 36);
        ctx.fillText(`${es ? "Escudo" : "Shield"}: ${"\u25cf".repeat(shieldRef.current)}`, 10, 52);

        if (paused && !gameOver) {
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 22px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(es ? "Pausa" : "Paused", W / 2, H / 2);
        }

        if (gameOver) {
          ctx.fillStyle = "rgba(0,0,0,0.72)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 22px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(es ? "Planeta destruido" : "Planet destroyed", W / 2, H / 2 - 10);
          ctx.font = "15px system-ui, sans-serif";
          ctx.fillText(`${es ? "Puntos" : "Score"}: ${scoreRef.current}`, W / 2, H / 2 + 16);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, gameOver, es, wave]);

  useEffect(() => {
    if (running) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#04060d";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Arcade Defensor Órbita" : "Orbit Defender Arcade", W / 2, H / 2 - 10);
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(es ? "Tocá Jugar para empezar" : "Tap Play to start", W / 2, H / 2 + 16);
  }, [running, es]);

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!running || paused || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    aimRef.current = { x, y };
  };

  const sharePng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const text = es
      ? `Defendí el planeta y hice ${best} puntos en Orbit Defender Arcade en UtiliHub! https://utilihub.net/es/juegos/arcade-defensor-orbita`
      : `I defended the planet and scored ${best} in Orbit Defender Arcade on UtiliHub! https://utilihub.net/games/orbit-defender-arcade`;
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("no blob");
      const file = new File([blob], "orbit-defender-score.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: "Orbit Defender Arcade", text, files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orbit-defender-score.png";
        a.click();
        URL.revokeObjectURL(url);
        await navigator.clipboard.writeText(text).catch(() => {});
      }
      setShared(true);
      setTimeout(() => setShared(false), 1800);
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
          {es ? "Ola" : "Wave"}: <span className="text-amber-300">{wave}</span>
        </span>
        <span>
          {es ? "Escudo" : "Shield"}: <span className="text-sky-300">{"\u25cf".repeat(shield)}</span>
        </span>
        <span>
          {es ? "Mejor" : "Best"}: <span className="text-emerald-300">{best}</span>
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full max-w-[360px] touch-none rounded-2xl border border-emerald-500/20 bg-black shadow-lg"
        style={{ touchAction: "none" }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerMove}
      />
      <div className="flex flex-wrap justify-center gap-2">
        <GamePrimaryButton onClick={hardReset} disabled={running && !gameOver}>
          {running && !gameOver ? (es ? "Reiniciar" : "Restart") : es ? "Jugar" : "Play"}
        </GamePrimaryButton>
        <GameSecondaryButton onClick={() => setPaused((p) => !p)} active={paused}>
          {paused ? (es ? "Seguir" : "Resume") : es ? "Pausa" : "Pause"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={sharePng}>{shared ? (es ? "¡Listo!" : "Ready!") : es ? "Compartir PNG" : "Share PNG"}</GameSecondaryButton>
      </div>
    </div>
  );
}
