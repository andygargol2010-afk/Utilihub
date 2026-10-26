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
const BASE_ZONES = 4;
const MAX_ZONES = 8;
const ZONE_COLORS = [200, 30, 120, 280, 50, 160, 310, 80]; // hues up to 8

type Pulse = {
  angle: number;
  radius: number;
  speed: number;
  hue: number;
  zone: number;
  life: number;
  trail: { x: number; y: number }[];
  scale: number;
  isPowerup?: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
  type: "spark" | "ring";
};

type CatchRing = {
  x: number;
  y: number;
  r: number;
  life: number;
  hue: number;
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
  const ringsRef = useRef<CatchRing[]>([]);
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
  const zonesRef = useRef(BASE_ZONES);
  const powerupTimerRef = useRef(0); // temporary score boost

  useEffect(() => {
    setBest(readBestScore("orbit-pulse-catcher"));
  }, []);

  useEffect(() => {
    scoreRef.current = score;
    livesRef.current = lives;
    comboRef.current = combo;
    runningRef.current = running;
    gameOverRef.current = gameOver;
    zonesRef.current = Math.min(MAX_ZONES, BASE_ZONES + Math.floor((level - 1) / 2));
  }, [score, lives, combo, running, gameOver, level]);

  const hardReset = useCallback(() => {
    pulsesRef.current = [];
    particlesRef.current = [];
    ringsRef.current = [];
    spawnTimerRef.current = 0;
    shakeRef.current = 0;
    flashZoneRef.current = null;
    flashTimerRef.current = 0;
    comboRef.current = 0;
    lastCatchRef.current = 0;
    powerupTimerRef.current = 0;
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
    zonesRef.current = BASE_ZONES;
  }, []);

  const tryCatch = useCallback((zone: number) => {
    if (!runningRef.current || gameOverRef.current || paused) return;
    const zones = zonesRef.current;
    if (zone < 0 || zone >= zones) return;
    flashZoneRef.current = zone;
    flashTimerRef.current = 14;
    const tolerance = 0.42; // more forgiving for mobile timing
    let caught = false;
    pulsesRef.current = pulsesRef.current.filter((p) => {
      if (p.zone !== zone) return true;
      const zoneAngle = (zone / zones) * Math.PI * 2;
      let diff = Math.abs(p.angle - zoneAngle);
      diff = Math.min(diff, Math.PI * 2 - diff);
      if (diff < tolerance) {
        caught = true;
        const now = performance.now();
        if (now - lastCatchRef.current < 1100) {
          comboRef.current = Math.min(15, comboRef.current + 1);
        } else {
          comboRef.current = 1;
        }
        lastCatchRef.current = now;
        setCombo(comboRef.current);
        const mult = powerupTimerRef.current > 0 ? 1.8 : 1;
        const pts = Math.round(24 * (1 + (comboRef.current - 1) * 0.4) * (1 + level * 0.15) * mult);
        setScore((s) => {
          const next = s + pts;
          setBest((b) => writeBestScore("orbit-pulse-catcher", Math.max(b, next)));
          return next;
        });
        const ang = p.angle;
        const px = CX + Math.cos(ang) * p.radius;
        const py = CY + Math.sin(ang) * p.radius;
        // sparks
        const sparkCount = p.isPowerup ? 32 : 22;
        for (let i = 0; i < sparkCount; i++) {
          particlesRef.current.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * (p.isPowerup ? 10 : 8),
            vy: (Math.random() - 0.5) * (p.isPowerup ? 10 : 8),
            life: p.isPowerup ? 42 : 36,
            hue: p.hue,
            size: 1.6 + Math.random() * (p.isPowerup ? 3.5 : 2.8),
            type: "spark",
          });
        }
        // expanding catch ring
        ringsRef.current.push({
          x: px,
          y: py,
          r: p.isPowerup ? 16 : 12,
          life: p.isPowerup ? 34 : 28,
          hue: p.hue,
        });
        shakeRef.current = p.isPowerup ? 10 : 7;
        if (p.isPowerup) {
          // +1 life if under cap, plus temporary multiplier
          setLives((l) => {
            const nl = Math.min(5, l + 1);
            livesRef.current = nl;
            return nl;
          });
          powerupTimerRef.current = 180; // ~3s at 60fps
        }
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
      shakeRef.current = 4;
    }
  }, [level, paused]);

  // Keyboard controls: 1-N or QWERTY for zones
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!runningRef.current || gameOverRef.current || paused) return;
      const zones = zonesRef.current;
      let zone = -1;
      const k = e.key.toLowerCase();
      if (k >= "1" && k <= String(zones)) zone = parseInt(k, 10) - 1;
      else if (k === "q") zone = 0;
      else if (k === "w") zone = 1;
      else if (k === "e") zone = 2;
      else if (k === "r") zone = 3;
      else if (k === "t" && zones > 4) zone = 4;
      else if (k === "y" && zones > 5) zone = 5;
      else if (k === "u" && zones > 6) zone = 6;
      else if (k === "i" && zones > 7) zone = 7;
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
        const difficulty = 1 + level * 0.22;
        const spawnEvery = Math.max(420, 1500 - difficulty * 80);
        const maxPulses = 2 + Math.floor(level * 0.6);
        if (spawnTimerRef.current > spawnEvery && pulsesRef.current.length < maxPulses) {
          spawnTimerRef.current = 0;
          const zones = zonesRef.current;
          const zone = Math.floor(Math.random() * zones);
          const startAngle = Math.random() * Math.PI * 2;
          const isPowerup = Math.random() < 0.11 && level > 1;
          pulsesRef.current.push({
            angle: startAngle,
            radius: INNER_R + 40 + Math.random() * (OUTER_R - INNER_R - 50),
            speed: (0.008 + Math.random() * 0.016) * difficulty * (isPowerup ? 0.85 : 1),
            hue: isPowerup ? 48 : ZONE_COLORS[zone % ZONE_COLORS.length],
            zone,
            life: 420 - level * 8,
            trail: [],
            scale: 1,
            isPowerup,
          });
        }

        // update pulses + trails + scale pulse
        pulsesRef.current = pulsesRef.current.filter((p) => {
          p.angle += p.speed;
          p.life -= 1;
          p.scale = 1 + Math.sin(performance.now() * 0.008 + p.angle) * (p.isPowerup ? 0.18 : 0.12);
          const x = CX + Math.cos(p.angle) * p.radius;
          const y = CY + Math.sin(p.angle) * p.radius;
          p.trail.push({ x, y });
          if (p.trail.length > (p.isPowerup ? 16 : 12)) p.trail.shift();
          return p.life > 0;
        });

        // particles
        particlesRef.current = particlesRef.current.filter((pt) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= 1;
          return pt.life > 0;
        });

        // rings expand
        ringsRef.current = ringsRef.current.filter((r) => {
          r.r += 2.4;
          r.life -= 1;
          return r.life > 0;
        });

        if (shakeRef.current > 0) shakeRef.current -= 0.4;
        if (flashTimerRef.current > 0) {
          flashTimerRef.current -= 1;
          if (flashTimerRef.current <= 0) flashZoneRef.current = null;
        }
        if (powerupTimerRef.current > 0) powerupTimerRef.current -= 1;

        // level up (softer threshold)
        if (scoreRef.current > level * 220 && level < 10) {
          setLevel((l) => l + 1);
        }

        if (performance.now() - lastCatchRef.current > 1600) {
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

        const zones = zonesRef.current;

        // zones as arcs with flash + labels
        for (let z = 0; z < zones; z++) {
          const start = (z / zones) * Math.PI * 2 - Math.PI / zones;
          const end = start + (Math.PI * 2) / zones;
          ctx.beginPath();
          ctx.arc(CX, CY, OUTER_R, start, end);
          ctx.arc(CX, CY, INNER_R, end, start, true);
          ctx.closePath();
          const flash = flashZoneRef.current === z && flashTimerRef.current > 0;
          ctx.fillStyle = `hsla(${ZONE_COLORS[z % ZONE_COLORS.length]}, 70%, 45%, ${flash ? 0.5 : 0.24})`;
          ctx.fill();
          ctx.strokeStyle = `hsl(${ZONE_COLORS[z % ZONE_COLORS.length]}, 80%, ${flash ? 78 : 62}%)`;
          ctx.lineWidth = flash ? 4 : 2.2;
          ctx.stroke();

          // zone label (number) for mobile/keyboard clarity
          const midAng = start + (Math.PI / zones);
          const lx = CX + Math.cos(midAng) * (OUTER_R - 22);
          const ly = CY + Math.sin(midAng) * (OUTER_R - 22);
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.font = "bold 13px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(z + 1), lx, ly);
        }

        // center
        ctx.beginPath();
        ctx.arc(CX, CY, INNER_R - 8, 0, Math.PI * 2);
        ctx.fillStyle = "#111827";
        ctx.fill();
        ctx.strokeStyle = powerupTimerRef.current > 0 ? "#fbbf24" : "#34d399";
        ctx.lineWidth = powerupTimerRef.current > 0 ? 4 : 3;
        ctx.stroke();

        // catch rings
        for (const r of ringsRef.current) {
          ctx.globalAlpha = Math.max(0, r.life / 28);
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
          ctx.strokeStyle = `hsl(${r.hue}, 100%, 70%)`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // pulses with trails + scale
        for (const p of pulsesRef.current) {
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let i = 1; i < p.trail.length; i++) {
              ctx.lineTo(p.trail[i].x, p.trail[i].y);
            }
            ctx.strokeStyle = `hsla(${p.hue}, 90%, 62%, ${p.isPowerup ? 0.55 : 0.4})`;
            ctx.lineWidth = p.isPowerup ? 7 : 5;
            ctx.stroke();
          }
          const x = CX + Math.cos(p.angle) * p.radius;
          const y = CY + Math.sin(p.angle) * p.radius;
          const rad = (p.isPowerup ? 13 : 11) * p.scale;
          ctx.beginPath();
          ctx.arc(x, y, rad, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${p.hue}, 90%, ${p.isPowerup ? 68 : 62}%)`;
          ctx.shadowBlur = p.isPowerup ? 22 : 16;
          ctx.shadowColor = `hsl(${p.hue}, 90%, 62%)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // particles
        for (const pt of particlesRef.current) {
          ctx.globalAlpha = Math.max(0, pt.life / 36);
          ctx.fillStyle = `hsl(${pt.hue}, 100%, 70%)`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // HUD
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.font = "bold 14px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(`${es ? "Puntos" : "Score"}: ${scoreRef.current}`, 12, 24);
        ctx.fillText(`${es ? "Nivel" : "Level"}: ${level} (${zones})`, 12, 42);
        ctx.fillText(`${es ? "Vidas" : "Lives"}: ${livesRef.current}`, 12, 60);
        if (comboRef.current > 1) {
          ctx.textAlign = "center";
          ctx.fillStyle = "#fef08a";
          ctx.fillText(`COMBO x${comboRef.current}`, W / 2, 28);
        }
        if (powerupTimerRef.current > 0) {
          ctx.textAlign = "center";
          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 13px system-ui";
          ctx.fillText(es ? "¡BOOST!" : "BOOST!", W / 2, 48);
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
    if (dist < INNER_R - 4 || dist > OUTER_R + 28) return; // wider touch zone
    let ang = Math.atan2(dy, dx);
    if (ang < 0) ang += Math.PI * 2;
    const zones = zonesRef.current;
    const zone = Math.floor((ang / (Math.PI * 2)) * zones) % zones;
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
          ? "Clic en la zona numerada (o teclas 1-N / QWERTY) cuando el pulso coincidente esté sobre ella. Zonas aumentan con el nivel. Anillos de captura y estelas. Pulsos dorados raros: +1 vida y boost temporal. Más tolerante en móvil."
          : "Click the numbered matching zone (or keys 1-N / QWERTY) when the pulse is over it. Zones grow with level. Catch rings and trails. Rare golden power-up pulses: +1 life and temporary score boost. More forgiving on mobile."}
      </p>
    </div>
  );
}
