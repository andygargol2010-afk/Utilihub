import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const W = 360;
const H = 480;
const BAR_W = 72;
const BAR_H = 12;
const BAR_Y = H - 36;

type PulseKind = "normal" | "rare" | "life" | "power-magnet" | "power-slow" | "power-multi";

type Pulse = {
  x: number;
  y: number;
  vy: number;
  r: number;
  kind: PulseKind;
  hue: number;
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

type Announcement = {
  text: string;
  life: number;
  color: string;
};

export function PulseCatchArenaGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shared, setShared] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const pulsesRef = useRef<Pulse[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const barXRef = useRef(W / 2 - BAR_W / 2);
  const magnetUntilRef = useRef(0);
  const slowUntilRef = useRef(0);
  const multiUntilRef = useRef(0);
  const shakeRef = useRef(0);
  const flashRef = useRef(0);
  const waveTimerRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const runningRef = useRef(false);
  const gameOverRef = useRef(false);
  const comboRef = useRef(0);
  const lastCatchRef = useRef(0);
  const announcementRef = useRef<Announcement | null>(null);

  useEffect(() => {
    setBest(readBestScore("pulse-catch-arena"));
  }, []);

  useEffect(() => {
    scoreRef.current = score;
    livesRef.current = lives;
    runningRef.current = running;
    gameOverRef.current = gameOver;
    comboRef.current = combo;
  }, [score, lives, running, gameOver, combo]);

  const showAnnouncement = useCallback((text: string, color = "#fef08a") => {
    const ann = { text, life: 90, color };
    setAnnouncement(ann);
    announcementRef.current = ann;
  }, []);

  const hardReset = useCallback(() => {
    pulsesRef.current = [];
    particlesRef.current = [];
    barXRef.current = W / 2 - BAR_W / 2;
    magnetUntilRef.current = 0;
    slowUntilRef.current = 0;
    multiUntilRef.current = 0;
    shakeRef.current = 0;
    flashRef.current = 0;
    waveTimerRef.current = 0;
    comboRef.current = 0;
    lastCatchRef.current = 0;
    setScore(0);
    setLives(3);
    setWave(1);
    setCombo(0);
    setGameOver(false);
    setPaused(false);
    setRunning(true);
    setShared(false);
    setAnnouncement(null);
    announcementRef.current = null;
    scoreRef.current = 0;
    livesRef.current = 3;
    runningRef.current = true;
    gameOverRef.current = false;
    showAnnouncement(es ? "¡Ola 1!" : "Wave 1!", "#86efac");
  }, [es, showAnnouncement]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      if (!paused && !gameOver) {
        const now = performance.now();
        const slow = slowUntilRef.current > now;
        const timeScale = slow ? 0.55 : 1;
        const magnet = magnetUntilRef.current > now;
        const multi = multiUntilRef.current > now;

        waveTimerRef.current += 16 * timeScale;
        const difficulty = 1 + wave * 0.15;
        const spawnInterval = Math.max(280, 900 - difficulty * 40);
        if (waveTimerRef.current >= spawnInterval) {
          waveTimerRef.current = 0;
          const kinds: PulseKind[] = ["normal", "normal", "normal", "rare", "life"];
          if (Math.random() < 0.12) kinds.push("power-magnet", "power-slow", "power-multi");
          const kind = kinds[Math.floor(Math.random() * kinds.length)];
          let hue = 200;
          if (kind === "rare") hue = 50;
          if (kind === "life") hue = 140;
          if (kind === "power-magnet") hue = 280;
          if (kind === "power-slow") hue = 220;
          if (kind === "power-multi") hue = 30;
          pulsesRef.current.push({
            x: 20 + Math.random() * (W - 40),
            y: -20,
            vy: (1.8 + Math.random() * 1.4) * difficulty * timeScale,
            r: kind === "rare" ? 14 : 11,
            kind,
            hue,
          });
        }

        // update pulses
        pulsesRef.current = pulsesRef.current.filter((p) => {
          if (magnet && p.y > H * 0.4) {
            const dx = (barXRef.current + BAR_W / 2) - p.x;
            p.x += dx * 0.08;
          }
          p.y += p.vy;

          // catch
          if (p.y + p.r > BAR_Y && p.y - p.r < BAR_Y + BAR_H && p.x > barXRef.current - 8 && p.x < barXRef.current + BAR_W + 8) {
            const nowCatch = performance.now();
            if (nowCatch - lastCatchRef.current < 800) {
              comboRef.current = Math.min(15, comboRef.current + 1);
            } else {
              comboRef.current = 1;
            }
            lastCatchRef.current = nowCatch;
            setCombo(comboRef.current);
            if (comboRef.current >= 5 && comboRef.current % 5 === 0) {
              showAnnouncement(es ? `¡COMBO x${comboRef.current}!` : `COMBO x${comboRef.current}!`, "#f472b6");
            }

            let pts = 10;
            if (p.kind === "rare") pts = 40;
            if (p.kind === "life") {
              setLives((l) => Math.min(5, l + 1));
              livesRef.current = Math.min(5, livesRef.current + 1);
              pts = 0;
            }
            if (p.kind === "power-magnet") magnetUntilRef.current = now + 6000;
            if (p.kind === "power-slow") slowUntilRef.current = now + 5000;
            if (p.kind === "power-multi") multiUntilRef.current = now + 7000;

            if (pts > 0) {
              const mult = multi ? 2 : 1;
              const comboMult = 1 + (comboRef.current - 1) * 0.2;
              pts = Math.round(pts * mult * comboMult);
              setScore((s) => {
                const next = s + pts;
                setBest((b) => writeBestScore("pulse-catch-arena", Math.max(b, next)));
                return next;
              });
            }

            // juice
            shakeRef.current = 6 + comboRef.current * 0.4;
            flashRef.current = 8;
            const burst = 16 + comboRef.current * 2;
            for (let i = 0; i < burst; i++) {
              particlesRef.current.push({
                x: p.x,
                y: p.y,
                vx: (Math.random() - 0.5) * (4 + comboRef.current * 0.3),
                vy: (Math.random() - 0.5) * (4 + comboRef.current * 0.3) - 1,
                life: 22 + Math.random() * 10,
                hue: p.hue,
                size: 1.8 + Math.random() * 1.4,
              });
            }
            return false;
          }

          // miss
          if (p.y > H + 20) {
            if (p.kind !== "life" && p.kind !== "power-magnet" && p.kind !== "power-slow" && p.kind !== "power-multi") {
              setLives((l) => {
                const nl = l - 1;
                livesRef.current = nl;
                if (nl <= 0) {
                  setGameOver(true);
                  gameOverRef.current = true;
                  setRunning(false);
                  runningRef.current = false;
                  showAnnouncement(es ? "Fin del juego" : "Game Over", "#f87171");
                }
                return nl;
              });
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

        if (shakeRef.current > 0) shakeRef.current -= 0.5;
        if (flashRef.current > 0) flashRef.current -= 1;

        // wave advance
        if (scoreRef.current > wave * 120 && wave < 12) {
          setWave((w) => {
            const nw = w + 1;
            showAnnouncement(es ? `¡Ola ${nw}!` : `Wave ${nw}!`, "#86efac");
            return nw;
          });
        }

        if (performance.now() - lastCatchRef.current > 1200) {
          if (comboRef.current > 0) setCombo(0);
          comboRef.current = 0;
        }

        if (announcementRef.current) {
          announcementRef.current.life -= 1;
          if (announcementRef.current.life <= 0) {
            setAnnouncement(null);
            announcementRef.current = null;
          } else {
            setAnnouncement({ ...announcementRef.current });
          }
        }
      }

      // draw
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        const shake = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current : 0;
        ctx.save();
        ctx.translate(shake, shake * 0.4);
        ctx.fillStyle = "#0a0a12";
        ctx.fillRect(-4, -4, W + 8, H + 8);

        // subtle grid
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }

        // flash
        if (flashRef.current > 0) {
          ctx.fillStyle = `rgba(254,240,138,${flashRef.current / 40})`;
          ctx.fillRect(0, 0, W, H);
        }

        // pulses
        for (const p of pulsesRef.current) {
          ctx.save();
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsl(${p.hue},90%,60%)`;
          ctx.fillStyle = `hsl(${p.hue},85%,55%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          if (p.kind.startsWith("power")) {
            ctx.fillStyle = "#fff";
            ctx.font = "bold 10px system-ui";
            ctx.textAlign = "center";
            ctx.fillText(p.kind === "power-magnet" ? "M" : p.kind === "power-slow" ? "S" : "×2", p.x, p.y + 3);
          }
          ctx.restore();
        }

        // particles
        for (const pt of particlesRef.current) {
          ctx.globalAlpha = Math.max(0, pt.life / 28);
          ctx.fillStyle = `hsl(${pt.hue},100%,70%)`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // bar
        const magnetActive = magnetUntilRef.current > performance.now();
        ctx.fillStyle = magnetActive ? "#c084fc" : "#38bdf8";
        ctx.shadowBlur = magnetActive ? 16 : 8;
        ctx.shadowColor = magnetActive ? "#c084fc" : "#38bdf8";
        ctx.fillRect(barXRef.current, BAR_Y, BAR_W, BAR_H);
        ctx.shadowBlur = 0;

        // HUD
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.font = "bold 14px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${es ? "Puntos" : "Score"}: ${scoreRef.current}`, 12, 24);
        ctx.fillText(`${es ? "Vidas" : "Lives"}: ${"♥".repeat(livesRef.current)}`, 12, 44);
        ctx.fillText(`${es ? "Ola" : "Wave"}: ${wave}`, 12, 64);
        if (comboRef.current > 1) {
          ctx.fillStyle = "#f472b6";
          ctx.font = "bold 16px system-ui, sans-serif";
          ctx.textAlign = "right";
          ctx.fillText(`x${comboRef.current}`, W - 12, 24);
        }

        // power indicators
        const nowHud = performance.now();
        let hudY = 84;
        if (magnetUntilRef.current > nowHud) {
          ctx.fillStyle = "#c084fc";
          ctx.font = "12px system-ui";
          ctx.textAlign = "left";
          ctx.fillText(es ? "Imán" : "Magnet", 12, hudY);
          hudY += 16;
        }
        if (slowUntilRef.current > nowHud) {
          ctx.fillStyle = "#67e8f9";
          ctx.fillText(es ? "Lento" : "Slow", 12, hudY);
          hudY += 16;
        }
        if (multiUntilRef.current > nowHud) {
          ctx.fillStyle = "#fbbf24";
          ctx.fillText("×2", 12, hudY);
        }

        // announcement
        if (announcement) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, announcement.life / 30);
          ctx.fillStyle = announcement.color;
          ctx.font = "bold 28px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.shadowBlur = 12;
          ctx.shadowColor = announcement.color;
          ctx.fillText(announcement.text, W / 2, H / 2 - 20);
          ctx.restore();
        }

        if (paused && !gameOver) {
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 24px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(es ? "Pausa" : "Paused", W / 2, H / 2);
        }

        if (gameOver) {
          ctx.fillStyle = "rgba(0,0,0,0.75)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 26px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(es ? "¡Fin!" : "Game Over", W / 2, H / 2 - 40);
          ctx.font = "18px system-ui, sans-serif";
          ctx.fillText(`${es ? "Puntos" : "Score"}: ${scoreRef.current}`, W / 2, H / 2);
          ctx.fillText(`${es ? "Mejor" : "Best"}: ${best}`, W / 2, H / 2 + 28);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, gameOver, es, wave, announcement, best, showAnnouncement]);

  useEffect(() => {
    if (running) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Pulse Catch Arena" : "Pulse Catch Arena", W / 2, H / 2 - 10);
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(es ? "Tocá Jugar" : "Tap Play", W / 2, H / 2 + 20);
  }, [running, es]);

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!running || paused || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    barXRef.current = Math.max(0, Math.min(W - BAR_W, x - BAR_W / 2));
  };

  const shareCard = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = ctx.createLinearGradient(0, 0, 640, 360);
    g.addColorStop(0, "#0f172a");
    g.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 640, 360);
    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 36px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Pulse Catch Arena" : "Pulse Catch Arena", 320, 80);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 64px system-ui, sans-serif";
    ctx.fillText(`${best}`, 320, 180);
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText(es ? "Mejor puntuación" : "High Score", 320, 220);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("utilihub.net", 320, 300);
    const data = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = data;
    a.download = `pulse-catch-arena-${best}.png`;
    a.click();
    setShared(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-xl border border-white/10 shadow-lg touch-none"
        style={{ width: "min(100%, 360px)", height: "auto", aspectRatio: `${W}/${H}` }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerMove}
      />
      <div className="flex flex-wrap justify-center gap-2">
        {!running && !gameOver && (
          <GamePrimaryButton onClick={hardReset}>{es ? "Jugar" : "Play"}</GamePrimaryButton>
        )}
        {running && !gameOver && (
          <GameSecondaryButton onClick={() => setPaused((p) => !p)}>
            {paused ? (es ? "Continuar" : "Resume") : (es ? "Pausa" : "Pause")}
          </GameSecondaryButton>
        )}
        {(gameOver || !running) && (
          <GameSecondaryButton onClick={hardReset}>{es ? "Reiniciar" : "Restart"}</GameSecondaryButton>
        )}
        {(gameOver || best > 0) && (
          <GameSecondaryButton onClick={shareCard}>
            {shared ? (es ? "¡Compartido!" : "Shared!") : (es ? "Tarjeta de récord" : "Score card")}
          </GameSecondaryButton>
        )}
      </div>
    </div>
  );
}
