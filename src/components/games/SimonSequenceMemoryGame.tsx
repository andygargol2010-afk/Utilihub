import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const PADS = [
  { id: 0, labelEn: "Red", labelEs: "Rojo", bg: "#dc2626", active: "#f87171", freq: 329.63 },
  { id: 1, labelEn: "Green", labelEs: "Verde", bg: "#16a34a", active: "#4ade80", freq: 392.0 },
  { id: 2, labelEn: "Blue", labelEs: "Azul", bg: "#2563eb", active: "#60a5fa", freq: 440.0 },
  { id: 3, labelEn: "Yellow", labelEs: "Amarillo", bg: "#ca8a04", active: "#facc15", freq: 493.88 },
] as const;

type Status = "idle" | "playing" | "input" | "over";

export function SimonSequenceMemoryGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [lit, setLit] = useState<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const playingRef = useRef(false);

  useEffect(() => {
    setBest(readBestScore("simon-sequence-memory"));
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
      for (let i = 0; i < seq.length; i++) {
        const id = seq[i]!;
        setLit(id);
        playTone(id, 360);
        await new Promise((r) => setTimeout(r, 420));
        setLit(null);
        await new Promise((r) => setTimeout(r, 160));
      }
      playingRef.current = false;
      setStatus("input");
    },
    [playTone],
  );

  const start = () => {
    ensureAudio();
    const first = Array.from({ length: 3 }, () => Math.floor(Math.random() * 4));
    setSequence(first);
    setScore(0);
    setStatus("playing");
    setTimeout(() => void playSequence(first), 350);
  };

  const restart = () => {
    setStatus("idle");
    setSequence([]);
    setUserStep(0);
    setScore(0);
    setLit(null);
    playingRef.current = false;
  };

  const onPad = (id: number) => {
    if (status !== "input" || playingRef.current) return;
    setLit(id);
    playTone(id, 180);
    setTimeout(() => setLit(null), 180);

    if (sequence[userStep] !== id) {
      setStatus("over");
      const nextBest = writeBestScore("simon-sequence-memory", score);
      setBest(nextBest);
      return;
    }

    const next = userStep + 1;
    if (next === sequence.length) {
      const nextScore = score + 1;
      setScore(nextScore);
      const extended = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(extended);
      setTimeout(() => void playSequence(extended), 550);
    } else {
      setUserStep(next);
    }
  };

  const statusText =
    status === "idle"
      ? es
        ? "Presioná Iniciar para ver la secuencia de 3 colores."
        : "Press Start to watch a 3-color sequence."
      : status === "playing"
        ? es
          ? "Observá la secuencia…"
          : "Watch the sequence…"
        : status === "input"
          ? es
            ? "Repetí la secuencia tocando los colores."
            : "Repeat the sequence by tapping the colors."
          : es
            ? `Fin del juego. Puntaje: ${score}. Mejor: ${best}.`
            : `Game over. Score: ${score}. Best: ${best}.`;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-1">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1">
          {es ? "Puntaje" : "Score"}: <span className="tabular-nums text-white">{score}</span>
        </span>
        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1">
          {es ? "Mejor" : "Best"}: <span className="tabular-nums text-amber-300">{best}</span>
        </span>
        <GameSecondaryButton onClick={() => setSoundOn((s) => !s)} active={soundOn}>
          {soundOn ? (es ? "Sonido on" : "Sound on") : es ? "Sonido off" : "Sound off"}
        </GameSecondaryButton>
      </div>

      <p className="min-h-[1.5rem] text-center text-sm font-medium text-emerald-100/80" aria-live="polite">
        {statusText}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4" role="group" aria-label={es ? "Pads de colores" : "Color pads"}>
        {PADS.map((pad) => {
          const isLit = lit === pad.id;
          return (
            <button
              key={pad.id}
              type="button"
              disabled={status !== "input"}
              onClick={() => onPad(pad.id)}
              aria-label={es ? pad.labelEs : pad.labelEn}
              className="h-24 w-24 rounded-2xl border-2 border-white/20 shadow-lg transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed sm:h-28 sm:w-28"
              style={{
                background: isLit ? pad.active : pad.bg,
                transform: isLit ? "scale(1.06)" : "scale(1)",
                boxShadow: isLit
                  ? `0 0 24px ${pad.active}, inset 0 2px 0 rgba(255,255,255,0.35)`
                  : "inset 0 2px 0 rgba(255,255,255,0.18), 0 6px 16px rgba(0,0,0,0.4)",
                opacity: status === "playing" && !isLit ? 0.75 : 1,
              }}
            />
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
      </div>
    </div>
  );
}
