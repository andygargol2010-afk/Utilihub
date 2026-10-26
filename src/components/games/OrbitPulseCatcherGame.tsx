import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const W = 400;
const H = 480;
const CX = W / 2;
const CY = H / 2 - 20;
const INNER_R = 48;
const OUTER_R = 160;
const ZONES = 6;
const ZONE_COLORS = [200, 30, 120, 280, 50, 160]; // hues

type Pulse = {
  angle: number;
  radius: number;
  speed: number;
  hue: number;
  zone: number;
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

export function OrbitPulseCatcherGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [shared, setShared] = useState(false);

  const pulsesRef = useRef<Pulse[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef(0);
  const lastCatchRef = useRef(0);
  const runningRef = useRef(false);
  const gameOverRef = useRef(false);
  const shakeRef = useRef(0);
  const spawnTimerRef = useRef(0);

  useEffect(() => {
    setBest(readBestScore("orbit-pulse-catcher"));
  }, []);

  useEffect(() => {
    scoreRef.current = score;
    livesRef.current = lives;
    comboRef.current = combo;
    runningRef.current = running;
    gameOverRef.current = gameOver;
  }, [score, lives, combo, running, gameOver]);

  const hardReset = useCallback(() => {
    pulsesRef.current = [];
    particlesRef.current = [];
    spawnTimerRef.current = 0;
    shakeRef.current = 0;
    comboRef.current = 0;
    lastCatchRef.current = 0;
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setGameOver(false);
    setPaused(false);
    setRunning(true);
    setShared(false);
    scoreRef.current = 0;
    livesRef.current = 3;
    runningRef.current = true;
    gameOverRef.current = false;
  }, []);

  const tryCatch = useCallback((zone: number) => {
    if (!runningRef.current || gameOverRef.current || paused) return;
    const tolerance = 0.35; // radians
    let caught = false;
    pulsesRef.current = pulsesRef.current.filter((p) => {
      if (p.zone !== zone) return true;
      const zoneAngle = (zone / ZONES) * Math.PI * 2;
      let diff = Math.abs(p.angle - zoneAngle);
      diff = Math.min(diff, Math.PI * 2 - diff);
      if (diff < tolerance) {
        caught = true;
        const now = performance.now();
        if (now - lastCatchRef.current < 900) {
          comboRef.current = Math.min(12, comboRef.current + 1);
        } else {
          comboRef.current = 1;
        }
        lastCatchRef.current = now;
        setCombo(comboRef.current);
        const pts = Math.round(20 * (1 + (comboRef.current - 1) * 0.3) * (1 + level * 0.1));
        setScore((s) => {
          const next = s + pts;
          setBest((b) => writeBestScore("orbit-pulse-catcher", Math.max(b, next)));
          return next;
        });
        // particles
        const ang = p.angle;
        const px = CX + Math.cos(ang) * p.radius;
        const py = CY + Math.sin(ang) * p.radius;
        for (let i = 0; i < 14; i++) {
          particlesRef.current.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 28,
            hue: p.hue,
            size: 1.5 + Math.random() * 2,
          });
        }
        shakeRef.current = 5;
        return false;
      }
      return true;
    });
    if (!caught) {
      // miss penalty
      setLives((l) => {
        const nl = l - 1;
        livesRef.current = nl;
        if (nl <= 0) {
          setGameOver(true);
          gameOverRef.current = true;
          setRunning(false);
          runningRef.current = false;
        }
        return nl;
      });
      comboRef.current = 0;
      setCombo(0);
    }
  }, [level, paused]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      if (!paused && !gameOver) {
        const dt = 16;
        spawnTimerRef.current += dt;
        const difficulty = 1 + level * 0.2;
        const spawnEvery = Math.max(600, 1800 - difficulty * 80);
        if (spawnTimerRef.current > spawnEvery && pulsesRef.current.length < 4 + level) {
          spawnTimerRef.current = 0;
          const zone = Math.floor(Math.random() * ZONES);
          pulsesRef.current.push({
            angle: Math.random() * Math.PI * 2,
            radius: INNER_R + 30 + Math.random() * (OUTER_R - INNER_R - 50),
            speed: (0.008 + Math.random() * 0.012) * difficulty,
            hue: ZONE_COLORS[zone],
            zone,
            life: 400,
          });
        }

        // update pulses
        pulsesRef.current = pulsesRef.current.filter((p) => {
          p.angle += p.speed;
          p.life -= 1;
          return p.life > 0;
        });

        // particles
        particlesRef.current = particlesRef.current.filter((pt) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= 1;
          return pt.life > 0;
        });

        if (shakeRef.current > 0) shakeRef.current -= 0.4;

        // level up
        if (scoreRef.current > level * 150 && level < 8) {
          setLevel((l) => l + 1);
        }

        if (performance.now() - lastCatchRef.current > 1400) {
          if (comboRef.current > 0) {
            comboRef.current = 0;
            setCombo(0);
          }
        }
      }

      // draw
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        const shake = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current : 0;
        ctx.save();
        ctx.translate(shake, shake * 0.5);
        ctx.fillStyle = "#060810";
        ctx.fillRect(-4, -4, W + 8, H + 8);

        // zones as arcs
        for (let z = 0; z < ZONES; z++) {
          const start = (z / ZONES) * Math.PI * 2 - Math.PI / ZONES;
          const end = start + (Math.PI * 2) / ZONES;
          ctx.beginPath();
          ctx.arc(CX, CY, OUTER_R, start, end);
          ctx.arc(CX, CY, INNER_R, end, start, true);
          ctx.closePath();
          ctx.fillStyle = `hsla(${ZONE_COLORS[z]}, 70%, 45%, 0.25)`;
          ctx.fill();
          ctx.strokeStyle = `hsl(${ZONE_COLORS[z]}, 80%, 60%)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // center
        ctx.beginPath();
        ctx.arc(CX, CY, INNER_R - 8, 0, Math.PI * 2);
        ctx.fillStyle = "#111827";
        ctx.fill();
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 3;
        ctx.stroke();

        // pulses
        for (const p of pulsesRef.current) {
          const x = CX + Math.cos(p.angle) * p.radius;
          const y = CY + Math.sin(p.angle) * p.radius;
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${p.hue}, 90%, 62%)`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsl(${p.hue}, 90%, 62%)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // particles
        for (const pt of particlesRef.current) {
          ctx.globalAlpha = Math.max(0, pt.life / 28);
          ctx.fillStyle = `hsl(${pt.hue}, 100%, 70%)`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // HUD
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "bold 14px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${es ? "Puntos" : "Score"}: ${scoreRef.current}`, 12, 24);
        ctx.fillText(`${es ? "Nivel" : "Level"}: ${level}`, 12, 42);
        ctx.fillText(`${es ? "Vidas" : "Lives"}: ${livesRef.current}`, 12, 60);
        if (comboRef.current > 1) {
          ctx.textAlign = "center";
          ctx.fillStyle = "#fef08a";
          ctx.fillText(`COMBO x${comboRef.current}`, W / 2, 28);
        }

        if (paused && !gameOver) {
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 24px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(es ? "Pausa" : "Paused", W / 2, H / 2);
        }
        if (gameOver) {
          ctx.fillStyle = "rgba(0,0,0,0.75)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 22px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(es ? "Juego terminado" : "Game Over", W / 2, H / 2 - 10);
          ctx.font = "15px system-ui";
          ctx.fillText(`${es ? "Puntos" : "Score"}: ${scoreRef.current}`, W / 2, H / 2 + 18);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, gameOver, es, level]);

  useEffect(() => {
    if (running) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#060810";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Orbit Pulse Catcher" : "Orbit Pulse Catcher", W / 2, H / 2 - 8);
    ctx.font = "13px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(es ? "Tocá Jugar para empezar" : "Tap Play to start", W / 2, H / 2 + 16);
  }, [running, es]);

  const onPointer = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!running || paused || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const dx = x - CX;
    const dy = y - CY;
    const dist = Math.hypot(dx, dy);
    if (dist < INNER_R || dist > OUTER_R + 20) return;
    let ang = Math.atan2(dy, dx);
    if (ang < 0) ang += Math.PI * 2;
    const zone = Math.floor((ang / (Math.PI * 2)) * ZONES) % ZONES;
    tryCatch(zone);
  };

  const sharePng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H + 60;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.drawImage(canvas, 0, 0);
    octx.fillStyle = "#0a0a12";
    octx.fillRect(0, H, W, 60);
    octx.fillStyle = "#fff";
    octx.font = "bold 16px system-ui";
    octx.textAlign = "center";
    octx.fillText(es ? "Orbit Pulse Catcher" : "Orbit Pulse Catcher", W / 2, H + 22);
    octx.font = "13px system-ui";
    octx.fillText(`utilihub.com  ·  ${es ? "Puntos" : "Score"}: ${best}  ·  Combo max`, W / 2, H + 42);
    off.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orbit-pulse-catcher.png";
      a.click();
      URL.revokeObjectURL(url);
      setShared(true);
    });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="max-w-full rounded-xl border border-white/10 touch-none"
        style={{ aspectRatio: `${W}/${H}`, maxHeight: "70vh" }}
        onPointerDown={onPointer}
      />
      <div className="flex flex-wrap justify-center gap-2">
        {!running && !gameOver && (
          <GamePrimaryButton onClick={hardReset}>{es ? "Jugar" : "Play"}</GamePrimaryButton>
        )}
        {running && (
          <GameSecondaryButton onClick={() => setPaused((p) => !p)}>
            {paused ? (es ? "Reanudar" : "Resume") : (es ? "Pausa" : "Pause")}
          </GameSecondaryButton>
        )}
        {gameOver && (
          <GamePrimaryButton onClick={hardReset}>{es ? "Reintentar" : "Retry"}</GamePrimaryButton>
        )}
        <GameSecondaryButton onClick={sharePng}>
          {shared ? (es ? "¡Compartido!" : "Shared!") : (es ? "Compartir PNG" : "Share PNG")}
        </GameSecondaryButton>
      </div>
      <p className="max-w-md text-center text-xs text-white/60">
        {es
          ? "Hacé clic en la zona de color cuando el pulso coincidente esté sobre ella. Combos por atrapes consecutivos."
          : "Click the matching color zone when the pulse is over it. Combos for consecutive catches."}
      </p>
    </div>
  );
}
