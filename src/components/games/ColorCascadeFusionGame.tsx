import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";

const W = 360;
const H = 520;
const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"];
const ORB_R = 18;
const COMBO_WINDOW_MS = 2800;

type Power = "none" | "bomb" | "freeze" | "multi";
type Orb = { id: number; x: number; y: number; vy: number; color: string; size: number; fused: boolean; power: Power };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };
type ScorePopup = { x: number; y: number; text: string; life: number; color: string };

function playTone(ctx: AudioContext, freq: number, dur: number, type: OscillatorType = "sine", vol = 0.12) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

export function ColorCascadeFusionGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const [multiUntil, setMultiUntil] = useState(0);
  const [combo, setCombo] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const orbsRef = useRef<Orb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const popupsRef = useRef<ScorePopup[]>([]);
  const nextId = useRef(1);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const gameOverRef = useRef(false);
  const freezeUntilRef = useRef(0);
  const multiUntilRef = useRef(0);
  const comboRef = useRef(0);
  const lastFusionAtRef = useRef(0);
  const levelFlashUntilRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundOnRef = useRef(true);
  const newBestRef = useRef(false);

  useEffect(() => setBest(readBestScore("color-cascade-fusion")), []);
  useEffect(() => {
    scoreRef.current = score;
    levelRef.current = level;
    gameOverRef.current = gameOver;
    comboRef.current = combo;
    soundOnRef.current = soundOn;
    newBestRef.current = newBest;
  }, [score, level, gameOver, combo, soundOn, newBest]);

  const ensureAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  const playFusion = useCallback((mega: boolean, comboN: number) => {
    if (!soundOnRef.current) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    if (mega) {
      playTone(ctx, 520, 0.18, "triangle", 0.14);
      playTone(ctx, 780, 0.22, "sine", 0.1);
    } else if (comboN >= 3) {
      playTone(ctx, 440 + comboN * 40, 0.12, "square", 0.08);
    } else {
      playTone(ctx, 360, 0.08, "sine", 0.07);
    }
  }, [ensureAudio]);

  const playLevelUp = useCallback(() => {
    if (!soundOnRef.current) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    playTone(ctx, 523, 0.12, "sine", 0.1);
    setTimeout(() => playTone(ctx, 659, 0.14, "sine", 0.1), 90);
    setTimeout(() => playTone(ctx, 784, 0.18, "triangle", 0.12), 180);
  }, [ensureAudio]);

  const playGameOver = useCallback(() => {
    if (!soundOnRef.current) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    playTone(ctx, 220, 0.25, "sawtooth", 0.08);
    setTimeout(() => playTone(ctx, 160, 0.3, "sine", 0.07), 120);
  }, [ensureAudio]);

  const spawnOrb = useCallback(() => {
    const col = Math.floor(Math.random() * COLORS.length);
    let power: Power = "none";
    const powerChance = Math.min(0.18, 0.06 + levelRef.current * 0.015);
    if (levelRef.current >= 2 && Math.random() < powerChance) {
      const powers: Power[] = ["bomb", "freeze", "multi"];
      power = powers[Math.floor(Math.random() * powers.length)];
    }
    orbsRef.current.push({
      id: nextId.current++,
      x: 30 + Math.random() * (W - 60),
      y: -ORB_R * 2,
      vy: 1.1 + levelRef.current * 0.18 + Math.random() * 0.6,
      color: COLORS[col],
      size: 1,
      fused: false,
      power,
    });
  }, []);

  const hardReset = useCallback(() => {
    orbsRef.current = [];
    particlesRef.current = [];
    popupsRef.current = [];
    nextId.current = 1;
    freezeUntilRef.current = 0;
    multiUntilRef.current = 0;
    comboRef.current = 0;
    lastFusionAtRef.current = 0;
    levelFlashUntilRef.current = 0;
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setNewBest(false);
    setRunning(true);
    setMultiUntil(0);
    setCombo(0);
    scoreRef.current = 0;
    levelRef.current = 1;
    gameOverRef.current = false;
    newBestRef.current = false;
    ensureAudio();
  }, [ensureAudio]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let spawnAcc = 0;
    const tick = () => {
      if (!gameOverRef.current) {
        const now = performance.now();
        const frozen = freezeUntilRef.current > now;
        const timeScale = frozen ? 0.35 : 1;
        spawnAcc += 16 * timeScale;
        if (spawnAcc > Math.max(320, 850 - levelRef.current * 45)) {
          spawnAcc = 0;
          spawnOrb();
        }
        for (const o of orbsRef.current) {
          o.y += o.vy * timeScale;
          if (o.y > H - ORB_R * o.size - 10) {
            o.y = H - ORB_R * o.size - 10;
            o.vy = 0;
          }
        }
        particlesRef.current = particlesRef.current.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12;
          p.life -= 1;
          return p.life > 0;
        });
        popupsRef.current = popupsRef.current.filter((p) => {
          p.y -= 0.7;
          p.life -= 1;
          return p.life > 0;
        });
        if (comboRef.current > 0 && now - lastFusionAtRef.current > COMBO_WINDOW_MS) {
          comboRef.current = 0;
          setCombo(0);
        }
        if (orbsRef.current.some((o) => o.y < 40 && o.vy === 0)) {
          const finalScore = scoreRef.current;
          const isNew = finalScore > best;
          setNewBest(isNew);
          newBestRef.current = isNew;
          if (isNew) {
            for (let i = 0; i < 40; i++)
              particlesRef.current.push({
                x: W / 2,
                y: H / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 50,
                color: "#fbbf24",
              });
          }
          setGameOver(true);
          gameOverRef.current = true;
          setRunning(false);
          playGameOver();
        }
        if (multiUntilRef.current > now) setMultiUntil(multiUntilRef.current);
        else setMultiUntil(0);
      }
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0f0f1a";
        ctx.fillRect(0, 0, W, H);
        const now = performance.now();
        const frozen = freezeUntilRef.current > now;
        if (frozen) {
          ctx.fillStyle = "rgba(103,232,249,0.12)";
          ctx.fillRect(0, 0, W, H);
        }
        if (levelFlashUntilRef.current > now) {
          const t = (levelFlashUntilRef.current - now) / 900;
          ctx.fillStyle = `rgba(34,211,238,${0.22 * t})`;
          ctx.fillRect(0, 0, W, H);
        }
        for (const p of particlesRef.current) {
          ctx.globalAlpha = p.life / 40;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        for (const o of orbsRef.current) {
          ctx.shadowBlur = 14;
          ctx.shadowColor = o.color;
          ctx.fillStyle = o.color;
          ctx.beginPath();
          ctx.arc(o.x, o.y, ORB_R * o.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.beginPath();
          ctx.arc(o.x - ORB_R * o.size * 0.3, o.y - ORB_R * o.size * 0.3, ORB_R * o.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
          if (o.power !== "none") {
            ctx.strokeStyle = o.power === "bomb" ? "#f87171" : o.power === "freeze" ? "#67e8f9" : "#fbbf24";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(o.x, o.y, ORB_R * o.size + 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = "#fff";
            ctx.font = "bold 11px system-ui";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const label = o.power === "bomb" ? "B" : o.power === "freeze" ? "F" : "\u00d7";
            ctx.fillText(label, o.x, o.y);
          }
        }
        for (const p of popupsRef.current) {
          ctx.globalAlpha = Math.min(1, p.life / 20);
          ctx.fillStyle = p.color;
          ctx.font = "bold 14px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(p.text, p.x, p.y);
        }
        ctx.globalAlpha = 1;
        if (comboRef.current >= 2) {
          const cx = W - 52;
          const cy = 36;
          ctx.fillStyle = "rgba(251,191,36,0.2)";
          ctx.beginPath();
          ctx.roundRect(cx - 40, cy - 16, 80, 32, 8);
          ctx.fill();
          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 13px system-ui";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`x${comboRef.current} COMBO`, cx, cy);
        }
        if (multiUntil > 0) {
          ctx.fillStyle = "rgba(251,191,36,0.15)";
          ctx.fillRect(0, H - 24, W, 24);
          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 12px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(es ? "\u00d72 ACTIVO" : "\u00d72 ACTIVE", W / 2, H - 12);
        }
        if (gameOverRef.current) {
          ctx.fillStyle = "rgba(0,0,0,0.65)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 28px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(es ? "Fin de partida" : "Game Over", W / 2, H / 2 - 40);
          ctx.font = "bold 20px system-ui";
          ctx.fillText(`${es ? "Puntuaci\u00f3n" : "Score"}: ${scoreRef.current}`, W / 2, H / 2);
          ctx.fillText(`${es ? "Mejor" : "Best"}: ${best}`, W / 2, H / 2 + 30);
          if (newBestRef.current) {
            ctx.fillStyle = "#fbbf24";
            ctx.font = "bold 22px system-ui";
            ctx.fillText(es ? "\u00a1Nuevo r\u00e9cord!" : "New Best!", W / 2, H / 2 + 70);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, spawnOrb, es, multiUntil, playGameOver, best]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!running || gameOver) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    const hit = orbsRef.current.find((o) => Math.hypot(o.x - mx, o.y - my) < ORB_R * o.size + 8);
    if (!hit) return;
    const group = new Set<Orb>();
    const queue = [hit];
    while (queue.length) {
      const cur = queue.pop()!;
      if (group.has(cur)) continue;
      group.add(cur);
      for (const o of orbsRef.current) {
        if (o.color === cur.color && !group.has(o) && Math.hypot(o.x - cur.x, o.y - cur.y) < ORB_R * (o.size + cur.size) * 1.3)
          queue.push(o);
      }
    }
    if (group.size < 2) return;

    const now = performance.now();
    if (now - lastFusionAtRef.current <= COMBO_WINDOW_MS && comboRef.current > 0) {
      comboRef.current += 1;
    } else {
      comboRef.current = 1;
    }
    lastFusionAtRef.current = now;
    setCombo(comboRef.current);
    const comboMul = Math.min(5, 1 + (comboRef.current - 1) * 0.5);

    const fusedSize = Math.min(3, 1 + Math.log2(group.size));
    const avgX = [...group].reduce((s, o) => s + o.x, 0) / group.size;
    const avgY = [...group].reduce((s, o) => s + o.y, 0) / group.size;
    const hasBomb = [...group].some((o) => o.power === "bomb");
    const hasFreeze = [...group].some((o) => o.power === "freeze");
    const hasMulti = [...group].some((o) => o.power === "multi");
    const isMega = group.size >= 4;
    orbsRef.current = orbsRef.current.filter((o) => !group.has(o));
    if (hasBomb) {
      const toClear = orbsRef.current.filter((o) => o.color === hit.color && Math.hypot(o.x - avgX, o.y - avgY) < 120);
      orbsRef.current = orbsRef.current.filter((o) => !toClear.includes(o));
      for (const o of toClear) {
        for (let i = 0; i < 8; i++)
          particlesRef.current.push({
            x: o.x,
            y: o.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 25,
            color: o.color,
          });
      }
    }
    if (hasFreeze) freezeUntilRef.current = performance.now() + 4500;
    if (hasMulti) multiUntilRef.current = performance.now() + 6000;
    orbsRef.current.push({
      id: nextId.current++,
      x: avgX,
      y: avgY,
      vy: 0.5,
      color: hit.color,
      size: fusedSize,
      fused: true,
      power: "none",
    });

    let pts = Math.round(group.size * 15 * levelRef.current * comboMul);
    if (multiUntilRef.current > performance.now()) pts *= 2;
    if (isMega) pts = Math.round(pts * 1.6);

    const popupColor = isMega ? "#22d3ee" : comboRef.current >= 3 ? "#fbbf24" : hit.color;
    const popupText =
      isMega
        ? `MEGA +${pts}`
        : comboRef.current >= 2
        ? `+${pts} x${comboRef.current}`
        : `+${pts}`;
    popupsRef.current.push({ x: avgX, y: avgY - 10, text: popupText, life: isMega ? 70 : 50, color: popupColor });

    playFusion(isMega, comboRef.current);

    setScore((s) => {
      const next = s + pts;
      const prevLevel = levelRef.current;
      const newLevel = Math.floor(next / 220) + 1;
      if (newLevel > prevLevel) {
        setLevel(newLevel);
        levelRef.current = newLevel;
        levelFlashUntilRef.current = performance.now() + 900;
        freezeUntilRef.current = Math.max(freezeUntilRef.current, performance.now() + 1800);
        playLevelUp();
        for (let i = 0; i < 24; i++)
          particlesRef.current.push({
            x: W / 2,
            y: H / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 40,
            color: "#22d3ee",
          });
      }
      setBest((b) => writeBestScore("color-cascade-fusion", Math.max(b, next)));
      return next;
    });
    const burst = group.size * 6 + (comboRef.current >= 3 ? 12 : 0) + (isMega ? 20 : 0);
    for (let i = 0; i < burst; i++)
      particlesRef.current.push({
        x: avgX,
        y: avgY,
        vx: (Math.random() - 0.5) * (isMega ? 9 : 6),
        vy: (Math.random() - 0.5) * (isMega ? 9 : 6) - 2,
        life: 30 + Math.random() * 20,
        color: isMega ? "#22d3ee" : hit.color,
      });
  };

  const sharePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H + 80;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f0f1a";
    ctx.fillRect(0, 0, W, H + 80);
    ctx.drawImage(canvas, 0, 0);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(es ? `Puntuaci\u00f3n: ${score}  Mejor: ${best}` : `Score: ${score}  Best: ${best}`, W / 2, H + 28);
    if (newBest) {
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 16px system-ui";
      ctx.fillText(es ? "\u00a1NUEVO R\u00c9CORD!" : "NEW BEST!", W / 2, H + 52);
    }
    ctx.fillStyle = "#aaa";
    ctx.font = "12px system-ui";
    ctx.fillText("utilihub \u2014 Color Cascade Fusion", W / 2, H + 68);
    const a = document.createElement("a");
    a.href = off.toDataURL("image/png");
    a.download = `color-cascade-fusion-${score}${newBest ? "-best" : ""}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-sm font-medium flex-wrap justify-center">
        <span>{es ? "Puntuaci\u00f3n" : "Score"}: {score}</span>
        <span>{es ? "Mejor" : "Best"}: {best}</span>
        <span>{es ? "Nivel" : "Level"}: {level}</span>
        {combo >= 2 && <span className="text-amber-400 font-bold">Combo x{combo}</span>}
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-xl border border-white/10 shadow-lg cursor-pointer bg-black max-w-full"
        onClick={handleClick}
        style={{ aspectRatio: `${W}/${H}` }}
      />
      <div className="flex gap-3 flex-wrap justify-center">
        {!running && !gameOver && (
          <button onClick={hardReset} className="rounded-lg bg-cyan-600 px-5 py-2 font-semibold text-white">
            {es ? "Empezar" : "Start"}
          </button>
        )}
        {gameOver && (
          <button onClick={hardReset} className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white">
            {es ? "Reintentar" : "Retry"}
          </button>
        )}
        {running && (
          <button onClick={() => setRunning(false)} className="rounded-lg bg-zinc-700 px-5 py-2 font-semibold text-white">
            {es ? "Pausa" : "Pause"}
          </button>
        )}
        <button onClick={() => setSoundOn((s) => !s)} className="rounded-lg bg-zinc-800 px-5 py-2 font-semibold text-white">
          {soundOn ? (es ? "Sonido ON" : "Sound ON") : (es ? "Sonido OFF" : "Sound OFF")}
        </button>
        <button onClick={sharePng} className="rounded-lg bg-violet-600 px-5 py-2 font-semibold text-white">
          {es ? "Compartir PNG" : "Share PNG"}
        </button>
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground">
        {es
          ? "Haz clic en orbes del mismo color adyacentes para fusionarlos. Encaden\u00e1 fusiones r\u00e1pidas para subir el combo (x1.5\u2026x5). 4+ orbes = MEGA (bonus + anillo). Subir de nivel da flash cian y breve ralentizaci\u00f3n. Orbes especiales desde nivel 2. Sonidos de fusi\u00f3n/nivel/fin (se pueden silenciar). Al terminar, overlay con puntuaci\u00f3n y celebraci\u00f3n de nuevo r\u00e9cord. \u00a1No dejes que se amontonen!"
          : "Click adjacent matching-color orbs to fuse them. Chain fusions quickly to raise combo (x1.5\u2026x5). 4+ orbs = MEGA (bonus + ring). Level-up gives cyan flash and brief slowdown. Special orbs from level 2. Fusion/level/game-over sounds (mute available). On end, overlay with score and new-best celebration. Don\u2019t let them pile up!"}
      </p>
    </div>
  );
}
