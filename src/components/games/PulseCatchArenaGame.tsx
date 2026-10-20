import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const W = 360;
const H = 480;
const BAR_W = 72;
const BAR_H = 12;
const BAR_Y = H - 36;

type PulseKind = "normal" | "rare" | "life" | "power-magnet" | "power-slow" | "power-multi" | "power-shield";

type Pulse = {
  x: number;
  y: number;
  vy: number;
  r: number;
  kind: PulseKind;
  hue: number;
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

type ScorePopup = {
  x: number;
  y: number;
  text: string;
  life: number;
  color: string;
};

type Announcement = {
  text: string;
  life: number;
  color: string;
};

type Star = {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
};

type Shockwave = {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  hue: number;
};

function makeStars(n: number): Star[] {
  const out: Star[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 0.6 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.04,
    });
  }
  return out;
}

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
  const popupsRef = useRef<ScorePopup[]>([]);
  const starsRef = useRef<Star[]>(makeStars(48));
  const ringsRef = useRef<Shockwave[]>([]);
  const barTrailRef = useRef<{ x: number; life: number }[]>([]);
  const barXRef = useRef(W / 2 - BAR_W / 2);
  const magnetUntilRef = useRef(0);
  const slowUntilRef = useRef(0);
  const multiUntilRef = useRef(0);
  const shieldUntilRef = useRef(0);
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
  const frameRef = useRef(0);

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
    popupsRef.current = [];
    ringsRef.current = [];
    barTrailRef.current = [];
    starsRef.current = makeStars(48);
    barXRef.current = W / 2 - BAR_W / 2;
    magnetUntilRef.current = 0;
    slowUntilRef.current = 0;
    multiUntilRef.current = 0;
    shieldUntilRef.current = 0;
    shakeRef.current = 0;
    flashRef.current = 0;
    waveTimerRef.current = 0;
    comboRef.current = 0;
    lastCatchRef.current = 0;
    frameRef.current = 0;
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
      frameRef.current += 1;
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
          if (Math.random() < 0.12) kinds.push("power-magnet", "power-slow", "power-multi", "power-shield");
          const kind = kinds[Math.floor(Math.random() * kinds.length)];
          let hue = 200;
          if (kind === "rare") hue = 50;
          if (kind === "life") hue = 140;
          if (kind === "power-magnet") hue = 280;
          if (kind === "power-slow") hue = 220;
          if (kind === "power-multi") hue = 30;
          if (kind === "power-shield") hue = 160;
          pulsesRef.current.push({
            x: 20 + Math.random() * (W - 40),
            y: -20,
            vy: (1.8 + Math.random() * 1.4) * difficulty * timeScale,
            r: kind === "rare" ? 14 : 11,
            kind,
            hue,
            trail: [],
          });
        }

        // update pulses
        pulsesRef.current = pulsesRef.current.filter((p) => {
          if (magnet && p.y > H * 0.4) {
            const dx = barXRef.current + BAR_W / 2 - p.x;
            p.x += dx * 0.08;
          }
          p.y += p.vy;
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 6) p.trail.shift();

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
              showAnnouncement(es ? `\u00a1COMBO x${comboRef.current}!` : `COMBO x${comboRef.current}!`, "#f472b6");
            }

            let pts = 10;
            if (p.kind === "rare") pts = 40;
            if (p.kind === "life") {
              setLives((l) => Math.min(5, l + 1));
              livesRef.current = Math.min(5, livesRef.current + 1);
              pts = 0;
              popupsRef.current.push({
                x: p.x,
                y: p.y - 10,
                text: es ? "+vida" : "+life",
                life: 50,
                color: "#86efac",
              });
            }
            if (p.kind === "power-magnet") {
              magnetUntilRef.current = now + 6000;
              popupsRef.current.push({
                x: p.x,
                y: p.y - 10,
                text: es ? "Im\u00e1n!" : "Magnet!",
                life: 55,
                color: "#c084fc",
              });
            }
            if (p.kind === "power-slow") {
              slowUntilRef.current = now + 5000;
              popupsRef.current.push({
                x: p.x,
                y: p.y - 10,
                text: es ? "Lento!" : "Slow!",
                life: 55,
                color: "#67e8f9",
              });
            }
            if (p.kind === "power-multi") {
              multiUntilRef.current = now + 7000;
              popupsRef.current.push({
                x: p.x,
                y: p.y - 10,
                text: "\u00d72!",
                life: 55,
                color: "#fbbf24",
              });
            }
            if (p.kind === "power-shield") {
              shieldUntilRef.current = now + 8000;
              popupsRef.current.push({
                x: p.x,
                y: p.y - 10,
                text: es ? "Escudo!" : "Shield!",
                life: 55,
                color: "#4ade80",
              });
            }

            // perfect catch if near bar center
            const barCenter = barXRef.current + BAR_W / 2;
            const distFromCenter = Math.abs(p.x - barCenter);
            const isPerfect = distFromCenter < BAR_W * 0.28;
            if (isPerfect && pts > 0) {
              pts = Math.round(pts * 1.5);
              popupsRef.current.push({
                x: p.x,
                y: p.y - 22,
                text: es ? "\u00a1PERFECTO!" : "PERFECT!",
                life: 62,
                color: "#fef08a",
              });
              ringsRef.current.push({
                x: p.x,
                y: BAR_Y + BAR_H / 2,
                r: p.r + 4,
                maxR: 72 + comboRef.current * 5,
                life: 22,
                hue: 55,
              });
            }

            if (pts > 0) {
              const mult = multi ? 2 : 1;
              const comboMult = 1 + (comboRef.current - 1) * 0.2;
              pts = Math.round(pts * mult * comboMult);
              setScore((s) => {
                const next = s + pts;
                setBest((b) => writeBestScore("pulse-catch-arena", Math.max(b, next)));
                return next;
              });
              popupsRef.current.push({
                x: p.x,
                y: p.y - 8,
                text: `+${pts}`,
                life: 48,
                color: comboRef.current >= 5 ? "#f472b6" : "#fef08a",
              });
            }

            // juice + shockwave
            shakeRef.current = 6 + comboRef.current * 0.4;
            flashRef.current = 8;
            ringsRef.current.push({
              x: p.x,
              y: BAR_Y + BAR_H / 2,
              r: p.r,
              maxR: 48 + comboRef.current * 4,
              life: 18,
              hue: p.hue,
            });
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
            if (p.kind !== "life" && !p.kind.startsWith("power")) {
              if (shieldUntilRef.current > performance.now()) {
                shieldUntilRef.current = 0;
                popupsRef.current.push({
                  x: p.x,
                  y: BAR_Y - 10,
                  text: es ? "Escudo!" : "Blocked!",
                  life: 40,
                  color: "#4ade80",
                });
                ringsRef.current.push({
                  x: p.x,
                  y: BAR_Y + BAR_H / 2,
                  r: 20,
                  maxR: 60,
                  life: 14,
                  hue: 140,
                });
              } else {
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

        // score popups
        popupsRef.current = popupsRef.current.filter((sp) => {
          sp.y -= 0.9;
          sp.life -= 1;
          return sp.life > 0;
        });

        // shockwaves
        ringsRef.current = ringsRef.current.filter((sw) => {
          sw.r += (sw.maxR - sw.r) * 0.18;
          sw.life -= 1;
          return sw.life > 0;
        });

        // combo fire trail particles from bar
        if (comboRef.current >= 4 && Math.random() < 0.35 + comboRef.current * 0.04) {
          const fireHue = 15 + (comboRef.current * 8) % 40;
          particlesRef.current.push({
            x: barXRef.current + BAR_W / 2 + (Math.random() - 0.5) * BAR_W * 0.7,
            y: BAR_Y + 2,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -1.4 - Math.random() * 1.6 - comboRef.current * 0.08,
            life: 18 + Math.random() * 12,
            hue: fireHue,
            size: 1.4 + Math.random() * 1.6,
          });
        }

        // bar residual trail
        barTrailRef.current.unshift({ x: barXRef.current + BAR_W / 2, life: 10 });
        if (barTrailRef.current.length > 8) barTrailRef.current.pop();
        barTrailRef.current = barTrailRef.current.filter((bt) => {
          bt.life -= 1;
          return bt.life > 0;
        });

        if (shakeRef.current > 0) shakeRef.current -= 0.5;
        if (flashRef.current > 0) flashRef.current -= 1;

        // wave advance
        if (scoreRef.current > wave * 120 && wave < 12) {
          setWave((w) => {
            const nw = w + 1;
            showAnnouncement(es ? `\u00a1Ola ${nw}!` : `Wave ${nw}!`, "#86efac");
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

        // reactive starfield (twinkle speed scales with combo)
        const comboBoost = 1 + comboRef.current * 0.12;
        for (const s of starsRef.current) {
          s.phase += s.speed * comboBoost;
          const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase));
          ctx.globalAlpha = a;
          ctx.fillStyle = comboRef.current >= 5 ? "#f9a8d4" : "#e0e7ff";
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // fever vignette at high combo
        if (comboRef.current >= 8) {
          const fever = Math.min(1, (comboRef.current - 7) / 6);
          const vg = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.7);
          vg.addColorStop(0, `rgba(244,114,182,0)`);
          vg.addColorStop(1, `rgba(244,114,182,${0.18 * fever})`);
          ctx.fillStyle = vg;
          ctx.fillRect(0, 0, W, H);
        }

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

        // power residual edge auras
        const nowHud = performance.now();
        if (magnetUntilRef.current > nowHud) {
          const t = (magnetUntilRef.current - nowHud) / 6000;
          ctx.fillStyle = `rgba(192,132,252,${0.08 + 0.06 * t})`;
          ctx.fillRect(0, 0, 18, H);
          ctx.fillRect(W - 18, 0, 18, H);
        }
        if (slowUntilRef.current > nowHud) {
          const t = (slowUntilRef.current - nowHud) / 5000;
          ctx.fillStyle = `rgba(103,232,249,${0.06 + 0.05 * t})`;
          ctx.fillRect(0, 0, W, 14);
        }
        if (multiUntilRef.current > nowHud) {
          const t = (multiUntilRef.current - nowHud) / 7000;
          ctx.fillStyle = `rgba(251,191,36,${0.07 + 0.05 * t})`;
          ctx.fillRect(0, H - 20, W, 20);
        }
        if (shieldUntilRef.current > nowHud) {
          const t = (shieldUntilRef.current - nowHud) / 8000;
          ctx.fillStyle = `rgba(74,222,128,${0.07 + 0.05 * t})`;
          ctx.fillRect(0, 0, W, 10);
          ctx.fillRect(0, H - 10, W, 10);
        }

        // pulses with trails
        for (const p of pulsesRef.current) {
          // trail
          if (p.trail.length > 1) {
            ctx.save();
            ctx.globalAlpha = 0.45;
            ctx.strokeStyle = `hsl(${p.hue},90%,60%)`;
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let i = 1; i < p.trail.length; i++) {
              ctx.lineTo(p.trail[i].x, p.trail[i].y);
            }
            ctx.stroke();
            ctx.restore();
          }
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
            const label =
              p.kind === "power-magnet" ? "M" :
              p.kind === "power-slow" ? "S" :
              p.kind === "power-multi" ? "\u00d72" :
              "SH";
            ctx.fillText(label, p.x, p.y + 3);
          }
          ctx.restore();
        }

        // shockwaves
        for (const sw of ringsRef.current) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, sw.life / 18) * 0.7;
          ctx.strokeStyle = `hsl(${sw.hue},100%,70%)`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
          ctx.stroke();
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

        // score popups
        for (const sp of popupsRef.current) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, sp.life / 20);
          ctx.fillStyle = sp.color;
          ctx.font = "bold 15px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.shadowBlur = 8;
          ctx.shadowColor = sp.color;
          ctx.fillText(sp.text, sp.x, sp.y);
          ctx.restore();
        }

        // bar residual trail
        for (let i = barTrailRef.current.length - 1; i >= 0; i--) {
          const bt = barTrailRef.current[i];
          ctx.save();
          ctx.globalAlpha = (bt.life / 10) * 0.35;
          ctx.fillStyle = "#38bdf8";
          ctx.fillRect(bt.x - BAR_W / 2, BAR_Y, BAR_W, BAR_H);
          ctx.restore();
        }

        // bar
        const magnetActive = magnetUntilRef.current > performance.now();
        const multiActive = multiUntilRef.current > performance.now();
        const shieldActive = shieldUntilRef.current > performance.now();
        ctx.save();
        ctx.shadowBlur = 16 + comboRef.current * 2;
        ctx.shadowColor = magnetActive ? "#c084fc" : multiActive ? "#fbbf24" : shieldActive ? "#4ade80" : "#38bdf8";
        ctx.fillStyle = magnetActive ? "#a855f7" : multiActive ? "#f59e0b" : shieldActive ? "#22c55e" : "#0ea5e9";
        ctx.fillRect(barXRef.current, BAR_Y, BAR_W, BAR_H);
        // inner highlight
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fillRect(barXRef.current + 2, BAR_Y + 2, BAR_W - 4, 3);
        ctx.restore();

        // combo meter glow bar
        if (comboRef.current > 1) {
          const meterW = Math.min(BAR_W, (comboRef.current / 15) * BAR_W);
          ctx.fillStyle = "rgba(244,114,182,0.7)";
          ctx.fillRect(barXRef.current, BAR_Y - 6, meterW, 3);
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
          ctx.fillText(announcement.text, W / 2, H / 2 - 40);
          ctx.restore();
        }

        // HUD
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "bold 14px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${es ? "Puntos" : "Score"}: ${scoreRef.current}`, 12, 22);
        ctx.fillText(`${es ? "Ola" : "Wave"} ${wave}`, 12, 40);
        ctx.textAlign = "right";
        ctx.fillText(`${es ? "Vidas" : "Lives"}: ${"\u2665".repeat(Math.max(0, livesRef.current))}`, W - 12, 22);
        if (comboRef.current > 1) {
          ctx.fillStyle = "#f472b6";
          ctx.fillText(`COMBO x${comboRef.current}`, W - 12, 40);
        }

        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, gameOver, wave, es, showAnnouncement, announcement]);

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!running || paused || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    barXRef.current = Math.max(0, Math.min(W - BAR_W, x - BAR_W / 2));
  };

  const shareCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = ctx.createLinearGradient(0, 0, 640, 360);
    g.addColorStop(0, "#0f172a");
    g.addColorStop(0.6, "#1e1b4b");
    g.addColorStop(1, "#312e81");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 640, 360);
    // decorative rings
    ctx.strokeStyle = "rgba(56,189,248,0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(320, 180, 120, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(244,114,182,0.25)";
    ctx.beginPath();
    ctx.arc(320, 180, 90, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 36px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Pulse Catch Arena", 320, 80);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 72px system-ui, sans-serif";
    ctx.fillText(`${best}`, 320, 190);
    ctx.font = "22px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(es ? "Mejor puntuaci\u00f3n" : "High Score", 320, 230);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
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
            {paused ? (es ? "Continuar" : "Resume") : es ? "Pausa" : "Pause"}
          </GameSecondaryButton>
        )}
        {(gameOver || !running) && (
          <GameSecondaryButton onClick={hardReset}>{es ? "Reiniciar" : "Restart"}</GameSecondaryButton>
        )}
        {(gameOver || best > 0) && (
          <GameSecondaryButton onClick={shareCard}>
            {shared ? (es ? "\u00a1Compartido!" : "Shared!") : es ? "Tarjeta de r\u00e9cord" : "Score card"}
          </GameSecondaryButton>
        )}
      </div>
    </div>
  );
}
