import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const PADS = [
  { id: 0, labelEn: "Red", labelEs: "Rojo", bg: "#dc2626", active: "#f87171", freq: 329.63, key: "1" },
  { id: 1, labelEn: "Green", labelEs: "Verde", bg: "#16a34a", active: "#4ade80", freq: 392.0, key: "2" },
  { id: 2, labelEn: "Blue", labelEs: "Azul", bg: "#2563eb", active: "#60a5fa", freq: 440.0, key: "3" },
  { id: 3, labelEn: "Yellow", labelEs: "Amarillo", bg: "#ca8a04", active: "#facc15", freq: 493.88, key: "4" },
] as const;

type Status = "idle" | "playing" | "input" | "over";
type Difficulty = "easy" | "normal" | "hard";

const SPEED: Record<Difficulty, number> = { easy: 1.45, normal: 1, hard: 0.65 };

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function SimonSequenceMemoryGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [lit, setLit] = useState<number | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const audioRef = useRef<AudioContext | null>(null);
  const playingRef = useRef(false);
  const rngRef = useRef<(() => number) | null>(null);
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    setBest(readBestScore("simon-sequence-memory"));
    const params = new URLSearchParams(window.location.search);
    const s = params.get("seed");
    if (s) {
      const n = parseInt(s, 10);
      if (!Number.isNaN(n) && n > 0) {
        setSeed(n);
      }
    }
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (Ctx) audioRef.current = new Ctx();
    }
    if (audioRef.current?.state === "suspended") void audioRef.current.resume();
  }, []);

  const playTone = useCallback(
    (id: number, ms = 280) => {
      if (!soundOn) return;
      try {
        ensureAudio();
        const ctx = audioRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = PADS[id]!.freq;
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms / 1000);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + ms / 1000);
      } catch {
        /* ignore autoplay / browser limits */
      }
    },
    [soundOn, ensureAudio],
  );

  const playSequence = useCallback(
    async (seq: number[]) => {
      if (playingRef.current) return;
      playingRef.current = true;
      setStatus("playing");
      setUserStep(0);
      const speed = SPEED[difficulty];
      setAnnounce(es ? `Observá la secuencia de ${seq.length} colores.` : `Watch the ${seq.length}-color sequence.`);
      for (let i = 0; i < seq.length; i++) {
        const id = seq[i]!;
        setLit(id);
        playTone(id, Math.round(360 * speed));
        await new Promise((r) => setTimeout(r, Math.round(420 * speed)));
        setLit(null);
        await new Promise((r) => setTimeout(r, Math.round(160 * speed)));
      }
      playingRef.current = false;
      setStatus("input");
      setAnnounce(es ? "Tu turno: repetí la secuencia." : "Your turn: repeat the sequence.");
    },
    [playTone, es, difficulty],
  );

  const updateUrl = useCallback((nextSeed: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("seed", String(nextSeed));
    window.history.replaceState(null, "", url);
  }, []);

  const start = () => {
    ensureAudio();
    let nextSeed = seed;
    if (nextSeed == null) {
      nextSeed = Math.floor(Math.random() * 1e9) + 1;
      setSeed(nextSeed);
    }
    updateUrl(nextSeed);
    const rng = mulberry32(nextSeed);
    rngRef.current = rng;
    const first = Array.from({ length: 3 }, () => Math.floor(rng() * 4));
    setSequence(first);
    setScore(0);
    setStatus("playing");
    setAnnounce(es ? "Secuencia iniciada." : "Sequence started.");
    setTimeout(() => void playSequence(first), 350);
  };

  const restart = () => {
    setStatus("idle");
    setSequence([]);
    setUserStep(0);
    setScore(0);
    setLit(null);
    setAnnounce("");
    playingRef.current = false;
    rngRef.current = null;
  };

  const onPad = useCallback(
    (id: number) => {
      if (statusRef.current !== "input" || playingRef.current) return;
      setLit(id);
      playTone(id, 180);
      setTimeout(() => setLit(null), 180);

      if (sequence[userStep] !== id) {
        setStatus("over");
        const nextBest = writeBestScore("simon-sequence-memory", score);
        setBest(nextBest);
        setAnnounce(
          es
            ? `Error. Puntaje final: ${score}. Mejor: ${nextBest}.`
            : `Mistake. Final score: ${score}. Best: ${nextBest}.`,
        );
        return;
      }

      const next = userStep + 1;
      if (next === sequence.length) {
        const nextScore = score + 1;
        setScore(nextScore);
        const rng = rngRef.current;
        const extra = rng ? Math.floor(rng() * 4) : Math.floor(Math.random() * 4);
        const extended = [...sequence, extra];
        setSequence(extended);
        setAnnounce(es ? `Correcto. Nivel ${extended.length}.` : `Correct. Level ${extended.length}.`);
        setTimeout(() => void playSequence(extended), 550);
      } else {
        setUserStep(next);
      }
    },
    [sequence, userStep, playTone, score, es, playSequence],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (statusRef.current !== "input" || playingRef.current) return;
      const pad = PADS.find((p) => p.key === e.key);
      if (pad) {
        e.preventDefault();
        onPad(pad.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPad]);

  const shareUrl = useCallback(async () => {
    if (seed != null) updateUrl(seed);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* silent */
    }
  }, [seed, updateUrl]);

  const exportPng = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(0, 0, canvas.width, 6);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Memoria Secuencia · UtiliHub" : "Sequence Memory · UtiliHub", canvas.width / 2, 36);
    const padSize = 36;
    const startX = (canvas.width - (padSize * 4 + 12 * 3)) / 2;
    PADS.forEach((pad, i) => {
      ctx.fillStyle = pad.bg;
      ctx.fillRect(startX + i * (padSize + 12), 70, padSize, padSize);
    });
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.fillText(`${es ? "Puntaje" : "Score"}: ${score}`, canvas.width / 2, 160);
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.fillStyle = "#facc15";
    ctx.fillText(`${es ? "Mejor" : "Best"}: ${best}`, canvas.width / 2, 195);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px system-ui, sans-serif";
    const level = sequence.length || 3;
    ctx.fillText(`${es ? "Nivel" : "Level"} ${level}`, canvas.width / 2, 225);
    ctx.fillText("utilihub.app", canvas.width / 2, 270);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `utilihub-simon-${score}.png`;
    a.click();
  }, [score, best, sequence.length, es]);

  const statusText =
    status === "idle"
      ? es
        ? "Presioná Iniciar para ver la secuencia de 3 colores. Teclas 1-4."
        : "Press Start to watch a 3-color sequence. Keys 1-4."
      : status === "playing"
        ? es
          ? "Observá la secuencia…"
          : "Watch the sequence…"
        : status === "input"
          ? es
            ? "Repetí la secuencia (teclas 1-4 o toques)."
            : "Repeat the sequence (keys 1-4 or taps)."
          : es
            ? `Fin del juego. Puntaje: ${score}. Mejor: ${best}.`
            : `Game over. Score: ${score}. Best: ${best}.`;

  const level = sequence.length || 0;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-1">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1">
          {es ? "Puntaje" : "Score"}: <span className="tabular-nums text-white">{score}</span>
        </span>
        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1">
          {es ? "Mejor" : "Best"}: <span className="tabular-nums text-amber-300">{best}</span>
        </span>
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1">
          {es ? "Nivel" : "Level"}: <span className="tabular-nums text-white">{level || "–"}</span>
        </span>
        <GameSecondaryButton onClick={() => setSoundOn((s) => !s)} active={soundOn}>
          {soundOn ? (es ? "Sonido on" : "Sound on") : es ? "Sonido off" : "Sound off"}
        </GameSecondaryButton>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1 text-xs">
        <span className="mr-1 text-emerald-100/70">{es ? "Dificultad:" : "Difficulty:"}</span>
        {(["easy", "normal", "hard"] as const).map((d) => (
          <GameSecondaryButton
            key={d}
            onClick={() => setDifficulty(d)}
            active={difficulty === d}
            disabled={status === "playing" || status === "input"}
          >
            {d === "easy" ? (es ? "Fácil" : "Easy") : d === "normal" ? (es ? "Normal" : "Normal") : es ? "Difícil" : "Hard"}
          </GameSecondaryButton>
        ))}
      </div>

      <p className="min-h-[1.5rem] text-center text-sm font-medium text-emerald-100/80" aria-live="polite">
        {statusText}
      </p>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4" role="group" aria-label={es ? "Pads de colores" : "Color pads"}>
        {PADS.map((pad) => {
          const isLit = lit === pad.id;
          return (
            <button
              key={pad.id}
              type="button"
              disabled={status !== "input"}
              onClick={() => onPad(pad.id)}
              aria-label={`${es ? pad.labelEs : pad.labelEn} (${pad.key})`}
              className="relative h-24 w-24 rounded-2xl border-2 border-white/20 shadow-lg transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed sm:h-28 sm:w-28"
              style={{
                background: isLit ? pad.active : pad.bg,
                transform: isLit ? "scale(1.06)" : "scale(1)",
                boxShadow: isLit
                  ? `0 0 24px ${pad.active}, inset 0 2px 0 rgba(255,255,255,0.35)`
                  : "inset 0 2px 0 rgba(255,255,255,0.18), 0 6px 16px rgba(0,0,0,0.4)",
                opacity: status === "playing" && !isLit ? 0.75 : 1,
              }}
            >
              <span className="absolute bottom-1 right-1.5 text-[10px] font-bold text-white/70">{pad.key}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        {status === "idle" || status === "over" ? (
          <GamePrimaryButton onClick={status === "over" ? restart : start}>
            {status === "over" ? (es ? "Jugar de nuevo" : "Play again") : es ? "Iniciar" : "Start"}
          </GamePrimaryButton>
        ) : (
          <GamePrimaryButton disabled>
            {es ? "En curso…" : "In progress…"}
          </GamePrimaryButton>
        )}
        <GameSecondaryButton onClick={exportPng} disabled={status === "idle"}>
          {es ? "PNG puntuación" : "Score PNG"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={shareUrl} disabled={seed == null}>
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Compartir enlace" : "Share link"}
        </GameSecondaryButton>
      </div>
    </div>
  );
}
