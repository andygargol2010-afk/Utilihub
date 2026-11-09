import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { type Cat } from "./HangmanGame.part1";
import { type Diff, DIFFS, ALL_ES, ALL_EN, WORDS, CATS, pickWord } from "./HangmanGame.part2";

export function HangmanGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";

  const [cat, setCat] = useState<Cat>("random");
  const [diff, setDiff] = useState<Diff>("normal");
  const [word, setWord] = useState("");
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [misses, setMisses] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [announce, setAnnounce] = useState("");

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
    setAnnounce(es ? `Nuevo juego. Palabra de ${initial.length} letras.` : `New game. Word with ${initial.length} letters.`);
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
  const score = Math.max(0, (maxMisses - misses) * 40 + (won ? 120 : 0) - hintsUsed * 20);

  const guess = useCallback(
    (letter: string) => {
      const L = letter.toUpperCase();
      if (over || !word || guessed.has(L) || !/^[A-Z]$/.test(L)) return;
      const next = new Set(guessed);
      next.add(L);
      setGuessed(next);
      const correct = word.includes(L);
      const nextMisses = correct ? misses : misses + 1;
      if (!correct) setMisses(nextMisses);
      const nextRevealed = word.split("").map((c) => (next.has(c) ? c : "_"));
      setAnnounce(
        correct
          ? es ? `Letra ${L} correcta. Palabra: ${nextRevealed.join(" ")}` : `Letter ${L} correct. Word: ${nextRevealed.join(" ")}`
          : es ? `Letra ${L} incorrecta. Fallos: ${nextMisses} de ${maxMisses}` : `Letter ${L} wrong. Misses: ${nextMisses} of ${maxMisses}`,
      );
    },
    [over, guessed, word, es, misses, maxMisses],
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
    const nextMisses = misses + 1;
    setMisses(nextMisses);
    const nextRevealed = word.split("").map((c) => (next.has(c) ? c : "_"));
    setAnnounce(es ? `Pista: letra ${letter}. Palabra: ${nextRevealed.join(" ")}. Fallos: ${nextMisses}` : `Hint: letter ${letter}. Word: ${nextRevealed.join(" ")}. Misses: ${nextMisses}`);
  }, [over, word, guessed, hintsUsed, es, misses]);

  const startNew = useCallback(
    (nextCat: Cat = cat, nextDiff: Diff = diff) => {
      const list = nextCat === "random" ? (es ? ALL_ES : ALL_EN) : (es ? WORDS[nextCat].es : WORDS[nextCat].en);
      if (!list.length) return;
      const next = pickWord(list);
      setCat(nextCat);
      setDiff(nextDiff);
      setWord(next);
      setGuessed(new Set());
      setMisses(0);
      setHintsUsed(0);
      setAnnounce(es ? `Nueva palabra de ${next.length} letras.` : `New word with ${next.length} letters.`);
      updateUrl(nextCat, next, nextDiff);
    },
    [cat, diff, es, updateUrl],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toUpperCase();
      if (k.length === 1 && /^[A-Z]$/.test(k)) {
        e.preventDefault();
        guess(k);
      } else if (k === "R") {
        e.preventDefault();
        startNew();
      } else if (k === "H") {
        e.preventDefault();
        giveHint();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guess, startNew, giveHint]);

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
    canvas.width = 560;
    canvas.height = 340;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // branded background
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, "#0f172a");
    g.addColorStop(1, "#1e293b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // header
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Ahorcado Clásico · UtiliHub" : "Hangman Classic · UtiliHub", canvas.width / 2, 32);
    // gallows
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(70, 290); ctx.lineTo(170, 290);
    ctx.moveTo(110, 290); ctx.lineTo(110, 70);
    ctx.moveTo(110, 70); ctx.lineTo(200, 70);
    ctx.moveTo(200, 70); ctx.lineTo(200, 95);
    ctx.stroke();
    // figure (matches on-screen SVG)
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 4;
    if (misses >= 1) { ctx.beginPath(); ctx.arc(200, 115, 14, 0, Math.PI * 2); ctx.stroke(); }
    if (misses >= 2) { ctx.beginPath(); ctx.moveTo(200, 129); ctx.lineTo(200, 185); ctx.stroke(); }
    if (misses >= 3) { ctx.beginPath(); ctx.moveTo(200, 145); ctx.lineTo(175, 170); ctx.stroke(); }
    if (misses >= 4) { ctx.beginPath(); ctx.moveTo(200, 145); ctx.lineTo(225, 170); ctx.stroke(); }
    if (misses >= 5) { ctx.beginPath(); ctx.moveTo(200, 185); ctx.lineTo(175, 215); ctx.stroke(); }
    if (misses >= 6) { ctx.beginPath(); ctx.moveTo(200, 185); ctx.lineTo(225, 215); ctx.stroke(); }
    if (misses >= 7) {
      ctx.fillStyle = "#f87171";
      ctx.beginPath(); ctx.arc(194, 110, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(206, 110, 2, 0, Math.PI * 2); ctx.fill();
    }
    // word + stats
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillText(revealed.join(" "), canvas.width / 2 + 50, 160);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px system-ui";
    const catLabel = CATS.find((c) => c.id === cat);
    ctx.fillText(`${es ? "Categoría" : "Category"}: ${es ? catLabel?.es : catLabel?.en}`, canvas.width / 2, 230);
    ctx.fillText(`${es ? "Fallos" : "Misses"}: ${misses}/${maxMisses}  ·  ${es ? "Puntaje" : "Score"}: ${score}`, canvas.width / 2, 252);
    ctx.fillText(over ? (won ? (es ? "¡Ganaste!" : "You win!") : (es ? "Perdiste" : "You lose")) : "", canvas.width / 2, 274);
    ctx.fillStyle = "#10b981";
    ctx.font = "11px system-ui";
    ctx.fillText("utilihub.net  ·  free tools & games", canvas.width / 2, 320);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `utilihub-hangman-${word.toLowerCase()}.png`;
    a.click();
  }, [word, revealed, misses, maxMisses, es, cat, score, won, over]);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  if (!word) return null;

  const figureLabel = es
    ? `Figura del ahorcado con ${misses} partes de ${maxMisses}`
    : `Hangman figure with ${misses} parts of ${maxMisses}`;

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
          {es ? "Fallos" : "Misses"}: {misses} / {maxMisses} · {es ? "Puntaje" : "Score"}: {score}
        </p>
        <div className="relative h-28 w-28 sm:h-32 sm:w-32" role="img" aria-label={figureLabel}>
          <svg viewBox="0 0 120 140" className="h-full w-full">
            <line x1="15" y1="125" x2="85" y2="125" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            <line x1="40" y1="125" x2="40" y2="15" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            <line x1="40" y1="15" x2="85" y2="15" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            <line x1="85" y1="15" x2="85" y2="32" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            {misses >= 1 && <circle cx="85" cy="46" r="12" fill="none" stroke="#f87171" strokeWidth="3.5" />}
            {misses >= 2 && <line x1="85" y1="58" x2="85" y2="92" stroke="#f87171" strokeWidth="3.5" strokeLinecap="round" />}
            {misses >= 3 && <line x1="85" y1="68" x2="68" y2="80" stroke="#f87171" strokeWidth="3.5" strokeLinecap="round" />}
            {misses >= 4 && <line x1="85" y1="68" x2="102" y2="80" stroke="#f87171" strokeWidth="3.5" strokeLinecap="round" />}
            {misses >= 5 && <line x1="85" y1="92" x2="68" y2="112" stroke="#f87171" strokeWidth="3.5" strokeLinecap="round" />}
            {misses >= 6 && <line x1="85" y1="92" x2="102" y2="112" stroke="#f87171" strokeWidth="3.5" strokeLinecap="round" />}
            {misses >= 7 && (
              <>
                <circle cx="80" cy="43" r="1.8" fill="#f87171" />
                <circle cx="90" cy="43" r="1.8" fill="#f87171" />
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
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
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900`}
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
          ? "Toca letras o usa el teclado · R nueva · H pista · categorías · dificultad · enlace con palabra · PNG de progreso"
          : "Tap letters or use keyboard · R new · H hint · categories · difficulty · link with word · progress PNG"}
      </p>
    </div>
  );
}
