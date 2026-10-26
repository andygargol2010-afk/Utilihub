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
  const flashZoneRef = useRef<number | null>(null);
  const flashTimerRef = useRef(0);

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
    flashZoneRef.current = null;
    flashTimerRef.current = 0;
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
    flashZoneRef.current = zone;
    flashTimerRef.current = 12;
    const tolerance = 0.38; // slightly more forgiving timing feel
    let caught = false;
    pulsesRef.current = pulsesRef.current.filter((p) => {
      if (p.zone !== zone) return true;
      const zoneAngle = (zone / ZONES) * Math.PI * 2;
      let diff = Math.abs(p.angle - zoneAngle);
      diff = Math.min(diff, Math.PI * 2 - diff);
      if (diff < tolerance) {
        caught = true;
        const now = performance.now();
        if (now - lastCatchRef.current < 1000) {
          comboRef.current = Math.min(12, comboRef.current + 1);
        } else {
          comboRef.current = 1;
        }
        lastCatchRef.current = now;
        setCombo(comboRef.current);
        const pts = Math.round(22 * (1 + (comboRef.current - 1) * 0.35) * (1 + level * 0.12));
        setScore((s) => {
          const next = s + pts;
          setBest((b) => writeBestScore("orbit-pulse-catcher", Math.max(b, next)));
          return next;
        });
        // particles + ring
        const ang = p.angle;
        const px = CX + Math.cos(ang) * p.radius;
        const py = CY + Math.sin(ang) * p.radius;
        for (let i = 0; i < 18; i++) {
          particlesRef.current.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 7,
            vy: (Math.random() - 0.5) * 7,
            life: 32,
            hue: p.hue,
            size: 1.8 + Math.random() * 2.4,
          });
        }
        shakeRef.current = 6;
        return false;
      }
      return true;
    });
    if (!caught) {
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
      shakeRef.current = 3;
    }
  }, [level, paused]);

  // Keyboard controls: 1-6 or QWERTY for zones
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!runningRef.current || gameOverRef.current || paused) return;
      let zone = -1;
      const k = e.key.toLowerCase();
      if (k >= "1" && k <= "6") zone = parseInt(k, 10) - 1;
      else if (k === "q") zone = 0;
      else if (k === "w") zone = 1;
      else if (k === "e") zone = 2;
      else if (k === "r") zone = 3;
      else if (k === "t") zone = 4;
      else if (k === "y") zone = 5;
      if (zone >= 0) {
        e.preventDefault();
        tryCatch(zone);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tryCatch, paused]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      if (!paused && !gameOver) {
        const dt = 16;
        spawnTimerRef.current += dt;
        const difficulty = 1 + level * 0.25;
        const spawnEvery = Math.max(480, 1600 - difficulty * 90);
        if (spawnTimerRef.current > spawnEvery && pulsesRef.current.length < 3 + level) {
          spawnTimerRef.current = 0;
          const zone = Math.floor(Math.random() * ZONES);
          const startAngle = Math.random() * Math.PI * 2;
          pulsesRef.current.push({
            angle: startAngle,
            radius: INNER_R + 35 + Math.random() * (OUTER_R - INNER_R - 55),
            speed: (0.009 + Math.random() * 0.014) * difficulty,
            hue: ZONE_COLORS[zone],
            zone,
            life: 380,
            trail: [],
          });
        }

        // update pulses + trails
        pulsesRef.current = pulsesRef.current.filter((p) => {
          p.angle += p.speed;
          p.life -= 1;
          const x = CX + Math.cos(p.angle) * p.radius;
          const y = CY + Math.sin(p.angle) * p.radius;
          p.trail.push({ x, y });
          if (p.trail.length > 10) p.trail.shift();
          return p.life > 0;
        });

        // particles
        particlesRef.current = particlesRef.current.filter((pt) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= 1;
          return pt.life > 0;
        });

        if (shakeRef.current > 0) shakeRef.current -= 0.35;
        if (flashTimerRef.current > 0) {
          flashTimerRef.current -= 1;
          if (flashTimerRef.current <= 0) flashZoneRef.current = null;
        }

        // level up
        if (scoreRef.current > level * 180 && level < 8) {
          setLevel((l) => l + 1);
        }

        if (performance.now() - lastCatchRef.current > 1500) {
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

        // zones as arcs with flash
        for (let z = 0; z < ZONES; z++) {
          const start = (z / ZONES) * Math.PI * 2 - Math.PI / ZONES;
          const end = start + (Math.PI * 2) / ZONES;
          ctx.beginPath();
          ctx.arc(CX, CY, OUTER_R, start, end);
          ctx.arc(CX, CY, INNER_R, end, start, true);
          ctx.closePath();
          const flash = flashZoneRef.current === z && flashTimerRef.current > 0;
          ctx.fillStyle = `hsla(${ZONE_COLORS[z]}, 70%, 45%, ${flash ? 0.45 : 0.22})`;
          ctx.fill();
          ctx.strokeStyle = `hsl(${ZONE_COLORS[z]}, 80%, ${flash ? 75 : 60}%)`;
          ctx.lineWidth = flash ? 3.5 : 2;
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

        // pulses with trails
        for (const p of pulsesRef.current) {
          // trail
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let i = 1; i < p.trail.length; i++) {
              ctx.lineTo(p.trail[i].x, p.trail[i].y);
            }
            ctx.strokeStyle = `hsla(${p.hue}, 90%, 62%, 0.35)`;
            ctx.lineWidth = 4;
            ctx.stroke();
          }
          const x = CX + Math.cos(p.angle) * p.radius;
          const y = CY + Math.sin(p.angle) * p.radius;
          ctx.beginPath();
          ctx.arc(x, y, 11, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${p.hue}, 90%, 62%)`;
          ctx.shadowBlur = 14;
          ctx.shadowColor = `hsl(${p.hue}, 90%, 62%)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // particles
        for (const pt of particlesRef.current) {
          ctx.globalAlpha = Math.max(0, pt.life / 32);
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
    ctx.fillText("Orbit Pulse Catcher", W / 2, H / 2 - 8);
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
    octx.fillText("Orbit Pulse Catcher", W / 2, H + 22);
    octx.font = "13px system-ui";
    octx.fillText(`utilihub.com  ·  ${es ? "Puntos" : "Score"}: ${best}`, W / 2, H + 42);
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
          ? "Clic en la zona de color (o teclas 1-6 / QWERTY) cuando el pulso coincidente esté sobre ella. Combos por atrapes consecutivos. Estelas y flash de zona."
          : "Click the matching color zone (or keys 1-6 / QWERTY) when the pulse is over it. Combos for consecutive catches. Trails and zone flash."}
      </p>
    </div>
  );
}
