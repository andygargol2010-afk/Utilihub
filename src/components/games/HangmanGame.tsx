import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Cat = "random" | "animals" | "countries" | "food" | "tech";
type Diff = "easy" | "normal" | "hard";

const CATS: { id: Cat; en: string; es: string }[] = [
  { id: "random", en: "Random", es: "Aleatorio" },
  { id: "animals", en: "Animals", es: "Animales" },
  { id: "countries", en: "Countries", es: "Países" },
  { id: "food", en: "Food", es: "Comida" },
  { id: "tech", en: "Tech", es: "Tecnología" },
];

const DIFFS: { id: Diff; en: string; es: string; max: number }[] = [
  { id: "easy", en: "Easy", es: "Fácil", max: 8 },
  { id: "normal", en: "Normal", es: "Normal", max: 6 },
  { id: "hard", en: "Hard", es: "Difícil", max: 4 },
];

const WORDS: Record<Exclude<Cat, "random">, { en: string[]; es: string[] }> = {
  animals: {
    en: ["LION", "TIGER", "ELEPHANT", "GIRAFFE", "DOLPHIN", "PENGUIN", "KANGAROO", "ZEBRA", "PANDA", "EAGLE", "WHALE", "FOX", "BEAR", "WOLF"],
    es: ["LEON", "TIGRE", "ELEFANTE", "JIRAFA", "DELFIN", "PINGUINO", "CANGURO", "CEBRA", "PANDA", "AGUILA", "BALLENA", "ZORRO", "OSO", "LOBO"],
  },
  countries: {
    en: ["CANADA", "BRAZIL", "JAPAN", "FRANCE", "ITALY", "SPAIN", "MEXICO", "AUSTRALIA", "INDIA", "GERMANY", "ARGENTINA", "CHILE", "PERU", "PORTUGAL"],
    es: ["CANADA", "BRASIL", "JAPON", "FRANCIA", "ITALIA", "ESPANA", "MEXICO", "AUSTRALIA", "INDIA", "ALEMANIA", "ARGENTINA", "CHILE", "PERU", "PORTUGAL"],
  },
  food: {
    en: ["PIZZA", "SUSHI", "TACO", "BURGER", "PASTA", "SALAD", "STEAK", "CURRY", "APPLE", "BANANA", "RICE", "BREAD", "CHEESE", "SOUP"],
    es: ["PIZZA", "SUSHI", "TACO", "HAMBURGUESA", "PASTA", "ENSALADA", "BISTEC", "CURRY", "MANZANA", "PLATANO", "ARROZ", "PAN", "QUESO", "SOPA"],
  },
  tech: {
    en: ["REACT", "TYPESCRIPT", "BROWSER", "COMPONENT", "FUNCTION", "VARIABLE", "ALGORITHM", "INTERFACE", "ASYNC", "PROMISE", "HOOK", "STATE", "RENDER", "BUNDLE"],
    es: ["REACT", "TYPESCRIPT", "NAVEGADOR", "COMPONENTE", "FUNCION", "VARIABLE", "ALGORITMO", "INTERFAZ", "ASINCRONO", "PROMESA", "HOOK", "ESTADO", "RENDER", "BUNDLE"],
  },
};

const ALL_EN = Object.values(WORDS).flatMap((w) => w.en);
const ALL_ES = Object.values(WORDS).flatMap((w) => w.es);

function pickWord(list: string[], seed?: number) {
  if (seed != null && list.length) {
    const i = Math.abs(seed) % list.length;
    return list[i]!;
  }
  return list[Math.floor(Math.random() * list.length)]!;
}

export function HangmanGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";

  const [cat, setCat] = useState<Cat>("random");
  const [diff, setDiff] = useState<Diff>("normal");
  const [word, setWord] = useState("");
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [misses, setMisses] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [copied, setCopied] = useState(false);

  const maxMisses = DIFFS.find((d) => d.id === diff)?.max ?? 6;

  const wordList = useMemo(() => {
    if (cat === "random") return es ? ALL_ES : ALL_EN;
    return es ? WORDS[cat].es : WORDS[cat].en;
  }, [cat, es]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = (params.get("cat") || "random") as Cat;
    const validCat = CATS.some((x) => x.id === c) ? c : "random";
    setCat(validCat);
    const d = (params.get("diff") || "normal") as Diff;
    const validDiff = DIFFS.some((x) => x.id === d) ? d : "normal";
    setDiff(validDiff);
    const wParam = params.get("word")?.toUpperCase();
    const list = validCat === "random" ? (es ? ALL_ES : ALL_EN) : (es ? WORDS[validCat].es : WORDS[validCat].en);
    let initial = "";
    if (wParam && list.includes(wParam)) {
      initial = wParam;
    } else {
      const s = params.get("seed");
      const seed = s ? parseInt(s, 10) : undefined;
      initial = pickWord(list, Number.isNaN(seed) ? undefined : seed);
    }
    setWord(initial);
    setGuessed(new Set());
    setMisses(0);
    setHintsUsed(0);
  }, [es]);

  const updateUrl = useCallback((nextCat: Cat, nextWord: string, nextDiff: Diff) => {
    const url = new URL(window.location.href);
    url.searchParams.set("cat", nextCat);
    url.searchParams.set("word", nextWord);
    url.searchParams.set("diff", nextDiff);
    url.searchParams.delete("seed");
    window.history.replaceState(null, "", url);
  }, []);

  const revealed = useMemo(
    () => (word ? word.split("").map((c) => (guessed.has(c) ? c : "_")) : []),
    [word, guessed],
  );

  const won = word && revealed.every((c) => c !== "_");
  const lost = misses >= maxMisses;
  const over = won || lost;

  const guess = useCallback(
    (letter: string) => {
      const L = letter.toUpperCase();
      if (over || !word || guessed.has(L) || !/^[A-Z]$/.test(L)) return;
      const next = new Set(guessed);
      next.add(L);
      setGuessed(next);
      if (!word.includes(L)) setMisses((m) => m + 1);
    },
    [over, guessed, word],
  );

  const giveHint = useCallback(() => {
    if (over || !word || hintsUsed >= 1) return;
    const missing = word.split("").filter((c) => !guessed.has(c));
    if (!missing.length) return;
    const letter = missing[Math.floor(Math.random() * missing.length)]!;
    const next = new Set(guessed);
    next.add(letter);
    setGuessed(next);
    setHintsUsed((h) => h + 1);
    setMisses((m) => m + 1);
  }, [over, word, guessed, hintsUsed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toUpperCase();
      if (k.length === 1 && /^[A-Z]$/.test(k)) {
        e.preventDefault();
        guess(k);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guess]);

  const startNew = useCallback(
    (nextCat: Cat = cat, nextDiff: Diff = diff) => {
      const list = nextCat === "random" ? (es ? ALL_ES : ALL_EN) : (es ? WORDS[nextCat].es : WORDS[nextCat].en);
      const next = pickWord(list);
      setCat(nextCat);
      setDiff(nextDiff);
      setWord(next);
      setGuessed(new Set());
      setMisses(0);
      setHintsUsed(0);
      updateUrl(nextCat, next, nextDiff);
    },
    [cat, diff, es, updateUrl],
  );

  const shareUrl = useCallback(async () => {
    updateUrl(cat, word, diff);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* silent */
    }
  }, [cat, word, diff, updateUrl]);

  const exportPng = useCallback(() => {
    if (!word) return;
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 280;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Ahorcado · UtiliHub" : "Hangman · UtiliHub", canvas.width / 2, 28);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(60, 240); ctx.lineTo(140, 240);
    ctx.moveTo(90, 240); ctx.lineTo(90, 60);
    ctx.moveTo(90, 60); ctx.lineTo(160, 60);
    ctx.moveTo(160, 60); ctx.lineTo(160, 80);
    ctx.stroke();
    ctx.strokeStyle = "#f87171";
    if (misses >= 1) { ctx.beginPath(); ctx.arc(160, 95, 12, 0, Math.PI * 2); ctx.stroke(); }
    if (misses >= 2) { ctx.beginPath(); ctx.moveTo(160, 107); ctx.lineTo(160, 155); ctx.stroke(); }
    if (misses >= 3) { ctx.beginPath(); ctx.moveTo(160, 120); ctx.lineTo(140, 140); ctx.stroke(); }
    if (misses >= 4) { ctx.beginPath(); ctx.moveTo(160, 120); ctx.lineTo(180, 140); ctx.stroke(); }
    if (misses >= 5) { ctx.beginPath(); ctx.moveTo(160, 155); ctx.lineTo(140, 180); ctx.stroke(); }
    if (misses >= 6) { ctx.beginPath(); ctx.moveTo(160, 155); ctx.lineTo(180, 180); ctx.stroke(); }
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px system-ui, sans-serif";
    const display = revealed.join(" ");
    ctx.fillText(display, canvas.width / 2 + 40, 140);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui";
    ctx.fillText(`${es ? "Fallos" : "Misses"}: ${misses}/${maxMisses}`, canvas.width / 2, 220);
    ctx.fillText("utilihub.app", canvas.width / 2, 260);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `utilihub-hangman-${word.toLowerCase()}.png`;
    a.click();
  }, [word, revealed, misses, maxMisses, es]);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  if (!word) return null;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-2 sm:gap-5">
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {CATS.map((c) => (
          <GameSecondaryButton key={c.id} active={cat === c.id} onClick={() => startNew(c.id, diff)}>
            {es ? c.es : c.en}
          </GameSecondaryButton>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {DIFFS.map((d) => (
          <GameSecondaryButton key={d.id} active={diff === d.id} onClick={() => startNew(cat, d.id)}>
            {es ? d.es : d.en}
          </GameSecondaryButton>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/80" aria-live="polite">
          {es ? "Fallos" : "Misses"}: {misses} / {maxMisses}
        </p>
        <div className="relative h-20 w-20 sm:h-24 sm:w-24" aria-hidden>
          <svg viewBox="0 0 100 120" className="h-full w-full">
            <line x1="10" y1="110" x2="70" y2="110" stroke="#94a3b8" strokeWidth="4" />
            <line x1="30" y1="110" x2="30" y2="10" stroke="#94a3b8" strokeWidth="4" />
            <line x1="30" y1="10" x2="70" y2="10" stroke="#94a3b8" strokeWidth="4" />
            <line x1="70" y1="10" x2="70" y2="25" stroke="#94a3b8" strokeWidth="4" />
            {misses >= 1 && <circle cx="70" cy="35" r="10" fill="none" stroke="#f87171" strokeWidth="3" />}
            {misses >= 2 && <line x1="70" y1="45" x2="70" y2="75" stroke="#f87171" strokeWidth="3" />}
            {misses >= 3 && <line x1="70" y1="55" x2="55" y2="65" stroke="#f87171" strokeWidth="3" />}
            {misses >= 4 && <line x1="70" y1="55" x2="85" y2="65" stroke="#f87171" strokeWidth="3" />}
            {misses >= 5 && <line x1="70" y1="75" x2="55" y2="95" stroke="#f87171" strokeWidth="3" />}
            {misses >= 6 && <line x1="70" y1="75" x2="85" y2="95" stroke="#f87171" strokeWidth="3" />}
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1 sm:gap-2" role="group" aria-label={es ? "Palabra" : "Word"}>
        {revealed.map((c, i) => (
          <span
            key={i}
            className="flex h-9 w-7 items-center justify-center rounded border border-white/20 bg-white/5 text-base font-bold text-white sm:h-12 sm:w-10 sm:text-xl"
            aria-label={c === "_" ? (es ? "letra oculta" : "hidden letter") : c}
          >
            {c}
          </span>
        ))}
      </div>

      {over && (
        <div className="text-center" role="status" aria-live="assertive">
          <p className={`text-xl font-black sm:text-2xl ${won ? "text-emerald-300" : "text-rose-300"}`}>
            {won ? (es ? "¡Ganaste! 🎉" : "You win! 🎉") : es ? `Perdiste. Era: ${word}` : `You lose. It was: ${word}`}
          </p>
          <p className="mt-1 text-sm text-white/70">
            {won ? (es ? "¡Bien hecho!" : "Well done!") : es ? "Inténtalo de nuevo" : "Try again"}
          </p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5" style={{ maxWidth: "100%" }}>
        {letters.map((L) => {
          const used = guessed.has(L);
          const correct = used && word.includes(L);
          return (
            <button
              key={L}
              type="button"
              disabled={used || over}
              onClick={() => guess(L)}
              className={`min-h-9 min-w-8 rounded-lg px-1.5 text-xs font-bold transition active:scale-95 disabled:opacity-40 sm:min-h-10 sm:min-w-9 sm:px-2 sm:text-sm ${
                used
                  ? correct
                    ? "bg-emerald-600/80 text-white"
                    : "bg-rose-600/60 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-label={`${L}${used ? (correct ? (es ? " correcta" : " correct") : (es ? " incorrecta" : " incorrect")) : ""}`}
            >
              {L}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <GamePrimaryButton onClick={() => startNew()}>{es ? "Nueva palabra" : "New word"}</GamePrimaryButton>
        <GameSecondaryButton onClick={giveHint} disabled={over || hintsUsed >= 1}>
          {es ? `Pista (${hintsUsed}/1)` : `Hint (${hintsUsed}/1)`}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={exportPng}>{es ? "PNG" : "PNG"}</GameSecondaryButton>
        <GameSecondaryButton onClick={shareUrl}>
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Compartir" : "Share"}
        </GameSecondaryButton>
      </div>
      <p className="text-center text-[11px] text-white/50">
        {es
          ? "Toca letras o usa el teclado · categorías · dificultad · pista · enlace con palabra · PNG de progreso"
          : "Tap letters or use keyboard · categories · difficulty · hint · link with word · progress PNG"}
      </p>
    </div>
  );
}
